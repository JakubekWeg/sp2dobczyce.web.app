import { firestore } from 'firebase-functions'

export const execute = async (snapshot: firestore.QueryDocumentSnapshot) => {
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

	const fcm = await import('../fcm')
	await fcm.sendFcmNotifications(Array.from(tokens.values()), {title, body})
}

export default execute
