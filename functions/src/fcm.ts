import admin from './admin'

const WEB_PAGE_ROOT = 'https://sp2dobczyce.web.app/'
const defaultNotification = {
	clickAction: WEB_PAGE_ROOT,
	icon: '/img/icons/android-chrome-192x192.png',
	color: '#4150b6',
}

const messaging = admin.messaging()
export const sendFcmNotifications = async (tokens: string[], notification: admin.messaging.NotificationMessagePayload) => {
	if (tokens.length === 0) return

	const results = await messaging
		.sendToDevice(tokens, {
			notification: {
				...defaultNotification,
				...notification,
			},
		})

	if (results.failureCount === 0) return

	const firestore = admin.firestore()
	const batch = firestore.batch()
	const collectionReference = firestore.collection('tokens')
	let i = 0
	for (const result of results.results) {
		if (result.error)
			batch.delete(collectionReference.doc(tokens[i]))
		i++
	}

	await batch.commit()
}

export const sendTestFcm = async (token: string): Promise<boolean> => {

	const results = await messaging.sendToDevice(token, {
		notification: {
			...defaultNotification,
			title: 'Testowe powiadomienie',
			body: 'Wygląda na to, że powiadomienia działają!',
		},
	})
	return results.failureCount === 0
}
