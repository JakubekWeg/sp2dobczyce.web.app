import { default as fetch } from 'node-fetch'
import { parse as parseHTML } from 'node-html-parser'

const numberRegex = /(\d?\d),\s*(\d?\d)/

type LuckyNumbersResult = 'not-found' | number[]

export const downloadLuckNumbers = async (): Promise<LuckyNumbersResult> => {
	const response = await fetch('http://sp2dobczyce.pl/informacje-2/')
	if (!response.ok) throw new Error('Luck numbers response no ok, status:' + response.status)
	const dom = parseHTML(await response.text())
	const el = dom.querySelector('tbody tr td span strong')
	if (!el) return 'not-found'

	const result = numberRegex.exec(el.rawText)
	if (!result) return 'not-found'

	const n1 = +result[1]
	const n2 = +result[2]

	if (!n1 || !n2) return 'not-found'

	return [n1, n2]
}
