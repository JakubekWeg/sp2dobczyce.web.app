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
		await (await import('./periodic-job')).execute({ignoreCurrentState: true})
	})


// noinspection JSUnusedGlobalSymbols
export const onLuckyNumbersChanged = functions
	.runWith({memory: '128MB'})
	.firestore.document('values/lucky-numbers')
	.onWrite(async (snap) => {
		const data = snap.after.data()
		if (!data || !Array.isArray(data.numbers)) return
		functions.logger.info('Lucky numbers changed! numbers=' + data.numbers.join(', '))

		const tokens = (await admin
			.firestore()
			.collection('tokens')
			.where('triggers', 'array-contains-any', data.numbers.map(e => `${e}`))
			.get()).docs.map(e => e.id)

		if (tokens.length === 0) return

		const fcm = await import('./fcm')
		await fcm.sendFcmNotifications(tokens, {
			title: 'Szczęśliwy numerek dla Ciebie!',
			body: 'Wykryto szczęśliwe numerki: ' + data.numbers.join(' i '),
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
