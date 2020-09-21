import { Change, firestore } from 'firebase-functions'

export const execute = async (snap: Change<firestore.DocumentSnapshot>) => {
	const data = snap.after.data()
	if (!data || !Array.isArray(data.numbers)) return


	await snap.after.ref.firestore
		.collection('fcm-requests').add({
			title: 'Szczęśliwy numerek dla Ciebie!',
			body: 'Wykryto szczęśliwe numerki: ' + data.numbers.join(' i '),
			triggers: data.numbers.map(e => `${e}`),
			time: new Date(),
		})
}

export default execute
