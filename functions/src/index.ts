import * as functions from 'firebase-functions'

const executeFunction = (fileName: string) => (...args: any[]) => import('./functions/' + fileName).then(e => e.default(...args))

// noinspection JSUnusedGlobalSymbols
export const periodicSync = functions
	.runWith({memory: '128MB'})
	.pubsub.schedule('*/15 7-22 * * *')
	.timeZone('Europe/Warsaw')
	.retryConfig({retryCount: 0})
	.onRun(executeFunction('periodic-job'))

// noinspection JSUnusedGlobalSymbols
export const luckyNumbersChanged = functions
	.runWith({memory: '128MB'})
	.firestore.document('values/lucky-numbers')
	.onWrite(executeFunction('lucky-numbers-changed'))


// noinspection JSUnusedGlobalSymbols
export const sendTestFcm = functions
	.runWith({memory: '128MB'})
	.https.onCall(executeFunction('send-test-fcm'))


// noinspection JSUnusedGlobalSymbols
export const fcmRequestAdded = functions
	.runWith({memory: '128MB'})
	.firestore.document('fcm-requests/{id}')
	.onCreate(executeFunction('fcm-request-added'))

// // noinspection JSUnusedGlobalSymbols
// export const triggerPeriodicSync = functions
// 	.runWith({memory: '128MB'})
// 	.https.onCall(async () => {
// 		if (!process.env.FUNCTIONS_EMULATOR)
// 			throw new functions.https.HttpsError('unimplemented', 'requires functions emulator')
// 		await (await import('./functions/periodic-job')).execute({ignoreCurrentState: true})
// 	})
