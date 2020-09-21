import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'

admin.initializeApp()

// noinspection JSUnusedGlobalSymbols
export const periodicSync = functions
	.runWith({memory: '128MB'})
	.pubsub.schedule('*/15 7-22 * * *')
	.timeZone('Europe/Warsaw')
	.retryConfig({retryCount: 0})
	.onRun(async () => await (await import('./periodic-job')).execute())


// noinspection JSUnusedGlobalSymbols
export const triggerPeriodicSync = functions
	.runWith({memory: '128MB'})
	.https.onCall(async () => {
		if (!process.env.FUNCTIONS_EMULATOR)
			throw new functions.https.HttpsError('unimplemented', 'requires functions emulator')
		await (await import('./periodic-job')).execute({ignoreCurrentState: false})
	})


// noinspection JSUnusedGlobalSymbols
export const onLuckyNumbersChanged = functions
	.runWith({memory: '128MB'})
	.firestore.document('values/lucky-numbers')
	.onWrite(async (snap) => {
		const data = snap.after.data()
		if (!data || !Array.isArray(data.numbers)) return

		await snap.after.ref.firestore
			.collection('fcm-requests').add({
				title: 'Szczęśliwy numerek dla Ciebie!',
				body: 'Wykryto szczęśliwe numerki: ' + data.numbers.join(' i '),
				triggers: data.numbers.map(e => `${e}`),
				time: admin.firestore.FieldValue.serverTimestamp(),
			})
	})


// noinspection JSUnusedGlobalSymbols
export const sendTestFcm = functions
	.runWith({memory: '128MB'})
	.https.onCall(async (data) => {
		if (!data) throw new functions.https.HttpsError('invalid-argument', 'data is missing')
		if (!data.token) throw new functions.https.HttpsError('invalid-argument', 'data.token is missing')

		if (!await (await import('./fcm')).sendTestFcm(data.token))
			throw new functions.https.HttpsError('invalid-argument', 'Invalid token')

		return {ok: true}
	})


// noinspection JSUnusedGlobalSymbols
export const fcmRequestEntryAdded = functions
	.runWith({memory: '128MB'})
	.firestore.document('fcm-requests/{id}')
	.onCreate(async (snapshot) => {
		const data: any = snapshot.data()
		const title: string = data.title
		const body: string = data.body
		const triggers: string[] = data.triggers

		if (!triggers || !Array.isArray(triggers) || !title || !body) return

		const db = snapshot.ref.firestore
		const tokens = new Set<string>()

		while (triggers.length > 0) {
			const ten = triggers.splice(0, 10);
			(await db
				.collection('tokens')
				.where('triggers', 'array-contains-any', ten)
				.get())
				.docs.forEach(e => tokens.add(e.id))
		}

		if (tokens.size === 0) return

		const fcm = await import('./fcm')
		await fcm.sendFcmNotifications(Array.from(tokens.values()), {title, body})
	})
