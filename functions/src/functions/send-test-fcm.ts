import { https } from 'firebase-functions'

export const execute = async (data: any) => {
	if (!data) throw new https.HttpsError('invalid-argument', 'data is missing')
	if (!data.token) throw new https.HttpsError('invalid-argument', 'data.token is missing')

	if (!await (await import('../fcm')).sendTestFcm(data.token))
		throw new https.HttpsError('invalid-argument', 'Invalid token')

	return {ok: true}
}

export default execute
