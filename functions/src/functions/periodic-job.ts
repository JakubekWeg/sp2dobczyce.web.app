import admin from '../admin'

interface ServerState {
	nextNumbersUpdate?: Date
	nextTimetablesUpdate?: Date
	lastNewsHtmlContent?: string
	timetablesListLastModifiedHeader?: string | null
}

interface ExecuteArguments {
	lastState: ServerState
	newState: ServerState
	firestore: admin.firestore.Firestore
	transaction: admin.firestore.Transaction
	affectedTriggers: Set<string>
}

export interface ExecuteOptions {
	ignoreCurrentState?: boolean
}

export const execute = async (options: ExecuteOptions = {}) => {
	const firestore = admin.firestore()
	const serverStateRef = firestore.collection('values').doc('server-state')

	await firestore.runTransaction(async transaction => {
		let state: ServerState = {}
		if (!options.ignoreCurrentState) {
			const stateValue: any = (await transaction.get(serverStateRef)).data()
			state = stateValue ? {
				...stateValue,
				nextNumbersUpdate: stateValue.nextNumbersUpdate?.toDate() ?? new Date(),
				nextTimetablesUpdate: stateValue.nextTimetablesUpdate?.toDate() ?? new Date(),
			} : {}
		}

		const newState: ServerState = {}

		const args: ExecuteArguments = {
			lastState: state,
			newState, transaction, firestore,
			affectedTriggers: new Set<string>(),
		}
		const promises = [updateNews, updateNumbers, updateTimetables].map(e => e(args))

		await Promise.all(promises)

		transaction.set(serverStateRef, args.newState, {merge: true})

		if (args.affectedTriggers.size) {
			const triggers = Array.from(args.affectedTriggers.values())
			transaction.create(firestore.collection('fcm-requests').doc(), {
				triggers,
				time: admin.firestore.FieldValue.serverTimestamp(),
				title: 'Nowe zastępstwa',
				body: 'Pojawiły się nowe zastępstwa, jest też coś dla Ciebie',
			})
		}
	})
}

const updateNews = async (args: ExecuteArguments) => {
	const {downloadAndParseSubstitutes, compareSnapshots} = await import('../news-parser')


	const current = await downloadAndParseSubstitutes(args.lastState.lastNewsHtmlContent)

	if (current) {
		args.newState.lastNewsHtmlContent = current.htmlContent

		const collection = args.firestore.collection('substitutes')
		const lastDocs = (await collection.get()).docs
		const lastSections = lastDocs.map(e => e.data()) as any[]


		lastDocs.forEach(ref => args.transaction.delete(ref.ref))
		current.sections.forEach(value => args.transaction.create(collection.doc(), value))

		const addedLineEntries = compareSnapshots(current.sections, lastSections)

		addedLineEntries.forEach(e => e.affects.forEach(e2 => args.affectedTriggers.add(e2)))
	}
}

const updateNumbers = async (args: ExecuteArguments) => {
	const shouldDownloadNumbers = args.lastState.nextNumbersUpdate?.getTime() || 0 < Date.now()
	if (!shouldDownloadNumbers) return

	const {downloadLuckNumbers} = await import('../lucky-numbers-parser')

	const result = await downloadLuckNumbers()

	const ref = args.firestore
		.collection('values')
		.doc('lucky-numbers')

	if (result === 'not-found')
		args.transaction.delete(ref)
	else {
		const current = (await ref.get()).data()
		let changed = !current

		if (current && current.numbers) {
			if (current.numbers.length !== result.length) {
				changed = true
			} else {
				for (let i = 0; i < current.numbers.length; i++) {
					if (current.numbers[i] !== result[i]) {
						changed = true
						break
					}
				}
			}
		}

		if (changed) {
			args.transaction.set(ref, {
				numbers: result,
				downloaded: admin.firestore.FieldValue.serverTimestamp(),
			})

			args.newState.nextNumbersUpdate = new Date(Date.now() + 16 * 60 * 60 * 1000)
		}
	}

}

const updateTimetables = async (args: ExecuteArguments) => {
	const shouldDownloadTimetables = args.lastState.nextTimetablesUpdate?.getTime() || 0 < Date.now()
	if (!shouldDownloadTimetables) return

	const {downloadTimetablesSummary, downloadTimetable} = await import('../timetables-parser')

	const summary = await downloadTimetablesSummary(args.lastState.timetablesListLastModifiedHeader)
	if (summary) {
		args.transaction.set(args.firestore.collection('values').doc('timetables'), summary)

		const timetablesCollection = args.firestore.collection('timetables');
		(await timetablesCollection.listDocuments()).forEach(e => args.transaction.delete(e));

		(await Promise.all(summary.combined.map(downloadTimetable))).forEach(t => {
			args.transaction.set(timetablesCollection.doc(t.id), t)
		})

		args.newState.timetablesListLastModifiedHeader = summary.lastModifiedHeader
	}
	args.newState.nextTimetablesUpdate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
}

export default execute
