import fetch from 'node-fetch'
import { HTMLElement, parse as parseHTML } from 'node-html-parser'

const BASE_LINK = 'http://sp2dobczyce.pl/planlekcji/'

export type TimetableType = 'c' | 't' | 'r'

export interface GroupLessonData {
	subject: string
	teacher: string
	classroom: string
}

export interface Lesson {
	number: number
	day: number
	data: undefined | GroupLessonData | GroupLessonData[]
}

export interface Timetable {
	id: string
	title: string
	link: string
	type: TimetableType
	lessons: Lesson[]
}

export interface TimetableInfo {
	type: TimetableType
	name: string
	link: string
}

export interface Summary {
	lastModifiedHeader: string | null
	classes: TimetableInfo[]
	teachers: TimetableInfo[]
	// classrooms: TimetableInfo[]
	combined: TimetableInfo[]
}

const timetableIdRegex = /\d\wsp (\d\w)|(\d\w)|.*\((\p{L}+)\)/iu
export const getTimetableIdByName = (name: string) => {
	const result = timetableIdRegex.exec(name.toLowerCase())
	if (!result) throw new Error('Invalid timetable name ' + name)
	return result[1] || result[2] || result[3]
}

export const downloadTimetablesSummary = async (lastModifiedHeader: string | undefined | null): Promise<Summary | null> => {
	const headers: any = {}
	if (lastModifiedHeader)
		headers['If-Modified-Since'] = lastModifiedHeader

	const response = await fetch(BASE_LINK + 'lista.html', {headers})
	if (response.status === 304) {
		return null
	}

	if (!response.ok)
		throw new Error('Failed to fetch planlekcji/lista.html, status: ' + response.status)

	const dom = parseHTML(await response.text())
	const lists = dom.querySelectorAll('ul')
	if (lists.length !== 3)
		throw new Error('Lists length !== 3')

	const niceNameRegex = /\d\wsp (\d\w)|(\d\w)/i
	const getNiceName = (str: string) => {
		const result = str.match(niceNameRegex)
		if (result) return (result[1] || result[2]).toLowerCase()

		return str
	}

	const createInfo = (type: TimetableType) => (e: HTMLElement): TimetableInfo => ({
		type,
		name: getNiceName(e.rawText),
		link: BASE_LINK + e.getAttribute('href'),
	})

	const classes = lists[0].querySelectorAll('a').map(createInfo('c'))
	const teachers = lists[1].querySelectorAll('a').map(createInfo('t'))
	// const classrooms = lists[2].querySelectorAll('a').map(createInfo('r'))

	return {
		lastModifiedHeader: response.headers.get('last-modified') || null,

		classes,
		// classrooms,
		teachers,
		// combined: [...classes, ...teachers, ...classrooms],
		combined: [...classes, ...teachers],
	}
}


export const downloadTimetable = async (info: TimetableInfo): Promise<Timetable> => {
	const response = await fetch(info.link)
	if (!response.ok) throw new Error('Cannot download timetable, status=' + response.status)

	const dom = parseHTML(await response.text())
	const rows = dom.querySelectorAll('tr tr').slice(0, -1)
	if (!rows.length)
		throw new Error('Rows in timetable not found')


	const lessons: Lesson[] = []

	for (let i = 1; i < rows.length; i++) {
		const row = rows[i]
		const cells = row.querySelectorAll('td')

		if (cells.length !== 7)
			continue
		//throw new Error('Cells.length !== 7')

		if (!cells[0].classNames.includes('nr')) throw new Error('First cell doesn\'t have class \'nr\'')
		if (!cells[1].classNames.includes('g')) throw new Error('First cell doesn\'t have class \'g\'')

		const number = +cells[0].text.trim()
		if (!number) throw new Error('Invalid lesson number')


		for (let day = 0; day < 5; day++) {
			const cell = cells[day + 2]
			if (!cell) continue
			let lesson: Lesson | null = null
			const nodes = cell.childNodes
			// .filter(e => e.nodeType === NodeType.ELEMENT_NODE) as HTMLElement[]

			if (!cell.rawText.trim())
				lesson = {data: undefined, day, number}
			else if (!!cell.querySelector('br')
				&& nodes.length !== 1
				// && (nodes.pop() as HTMLElement)?.tagName === 'br'
			) {

				switch (nodes.length) {
					case 6:
						lesson = {
							number, day,
							data: {
								subject: nodes[2].rawText.trim(),
								teacher: nodes[0].rawText.trim(),
								classroom: nodes[4].rawText.trim(),
							},
						}
						break
					case 8:
						lesson = {
							number, day,
							data: {
								subject: nodes[6].rawText + nodes[7].rawText,
								classroom: nodes[0].rawText + nodes[1].rawText,
								teacher: nodes[3].rawText + nodes[4].rawText + ' ' + nodes[5].rawText + nodes[6].rawText,
							},
						}
						break
					case 7:
						const first = nodes[0]
						const last = nodes[6]

						if ((last as HTMLElement)?.tagName === 'span') {
							lesson = {
								number, day,
								data: [
									{
										subject: (nodes[0].rawText.trim() || '') + (nodes[1].rawText.trim() || ''),
										teacher: '',
										classroom: nodes[3].rawText.trim(),
									},
									{
										subject: (last as HTMLElement)?.querySelector('.p')?.rawText?.trim() || '',
										teacher: (last as HTMLElement)?.querySelector('.n')?.rawText?.trim() || '',
										classroom: (last as HTMLElement)?.querySelector('.s')?.rawText?.trim() || '',
									},
								],
							}

						} else if ((first as HTMLElement)?.tagName === 'span') {
							lesson = {
								number, day,
								data: [
									{
										subject: (last as HTMLElement)?.querySelector('.p')?.rawText?.trim() || '',
										teacher: (last as HTMLElement)?.querySelector('.n')?.rawText?.trim() || '',
										classroom: (last as HTMLElement)?.querySelector('.s')?.rawText?.trim() || '',
									},
									{
										subject: (nodes[3].rawText.trim() || '') + (nodes[4].rawText.trim() || ''),
										teacher: '',
										classroom: nodes[6].rawText.trim(),
									},
								],
							}
						} else if ((first as HTMLElement)?.tagName === 'a') {
							lesson = {
								number, day,
								data: [
									{
										teacher: nodes[0].rawText + nodes[1].rawText + nodes[2].rawText + nodes[3].rawText,
										subject: (last as HTMLElement)?.querySelector('.p')?.rawText?.trim() || '',
										classroom: (last as HTMLElement)?.querySelector('.s')?.rawText?.trim() || '',
									},
								],
							}
						} else {
							// // @ts-ignore
							// console.log({day, number, tags: nodes.map(e => e?.tagName)})
							// console.log(nodes)
							throw new Error('wut? xd')
						}
						break
					case 3:
						const child0 = cell.childNodes[0] as HTMLElement
						const child2 = cell.childNodes[cell.childNodes.length - 1] as HTMLElement
						lesson = {
							day, number,
							data: [
								{
									subject: child0.querySelector('.p')?.rawText?.trim() || '',
									teacher: child0.querySelector('.n')?.rawText?.trim() || '',
									classroom: child0.querySelector('.s')?.rawText?.trim() || '',
								},
								{
									subject: child2.querySelector('.p')?.rawText?.trim() || '',
									teacher: child2.querySelector('.n')?.rawText?.trim() || '',
									classroom: child2.querySelector('.s')?.rawText?.trim() || '',
								},
							],
						}
						break
					case 11:
						lesson = {
							day, number,
							data: [
								{
									subject: (nodes[0].rawText || '') + (nodes[1].rawText || ''),
									teacher: (nodes[3].rawText || ''),
									classroom: (nodes[4].rawText || ''),
								},
								{
									subject: (nodes[6].rawText || '') + (nodes[7].rawText || ''),
									teacher: (nodes[9].rawText || ''),
									classroom: (nodes[10].rawText || ''),
								},
							],
						}
						break
					case 5:
						lesson = {
							day, number,
							data: {
								teacher: nodes[0].rawText + nodes[1].rawText + nodes[2].rawText,
								classroom: nodes[4].rawText,
								subject: nodes[3].rawText,
							},
						}
						break
					default:
						throw new Error('Invalid node length = ' + nodes.length + ', name=' + info.name)
				}
			} else if (cell.childNodes.length === 1) {
				lesson = {
					number, day,
					data: {
						subject: cell.rawText.trim(),
						teacher: '',
						classroom: '',
					},
				}
			} else {
				lesson = {
					number, day,
					data: {
						subject: cell.querySelector('.p')?.rawText?.trim() || '',
						teacher: cell.querySelector('.n')?.rawText?.trim() || '',
						classroom: cell.querySelector('.s')?.rawText?.trim() || '',
					},
				}
			}

			if (lesson) {
				if (lesson.data) {
					const data: GroupLessonData | GroupLessonData[] = lesson.data
					const objects: GroupLessonData[] = (Array.isArray(data)) ? data as GroupLessonData[] : [data as GroupLessonData]
					for (const obj of objects) {
						if (obj) {
							if (obj.teacher === '&nbsp;') obj.teacher = ''
							if (obj.classroom === '&nbsp;') obj.classroom = ''
							if (obj.subject === '&nbsp;') obj.subject = ''
						}
					}


					if (!(Array.isArray(data))) {
						const tmp = data as GroupLessonData
						if (!tmp.subject && !tmp.classroom && !tmp.teacher)
							delete lesson.data
					} else {
						const asList = lesson.data as GroupLessonData[]
						for (let j = asList.length; j >= 0; j--) {
							const tmp = asList[j]
							if (!tmp || !tmp.subject && !tmp.classroom && !tmp.teacher)
								asList.splice(j, 1)
						}
					}
				}

				lessons.push(lesson)
			}

		}

	}

	return {
		lessons,
		link: info.link,
		id: getTimetableIdByName(info.name),
		title: dom.querySelector('title')?.rawText || '',
		type: info.type,
	}
}
