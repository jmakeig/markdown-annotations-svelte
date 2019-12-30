import { writable, derived } from 'svelte/store';

const items = writable([
	{
		id: 'ANN12345',
		user: 'jmakeig',
		comment: 'Here is some text',
		timestamp: '2019-12-16T22:14:28.872Z',
		range: {
			start: { line: 1, column: 120 },
			end: { line: 1, column: 500 }
		}
	},
	{
		id: 'ANN22222',
		user: 'dsmalls',
		comment:
			'Another annotation that has some extra bonus text\n\nAnd another line',
		timestamp: '2019-12-22T08:32:14.001Z',
		range: {
			start: { line: 1, column: 12 },
			end: { line: 1, column: 67 }
		}
	}
]);

function stampTime(object) {
	return Object.assign({}, object, { timestamp: new Date().toISOString() });
}

export const _annotations = {
	subscribe: items.subscribe,
	find: id => items.find(annotation => id === annotation.id),
	add: annotation =>
		items.update(state => [
			...state,
			stampTime(
				Object.assign({}, annotation, {
					id: String(new Date().valueOf())
				})
			)
		]),
	update: annotation => {
		const updatedAnnotation = stampTime(Object.assign({}, annotation));
		items.update(state =>
			state.map(item => (item.id === annotation.id ? updatedAnnotation : item))
		);
		return updatedAnnotation;
	},
	delete: annotation =>
		items.update(state => state.filter(item => annotation.id !== item.id)),
	clear: () => items.update(state => [])
};

function documentOrder(a, b) {
	if (a.range.start.line > b.range.start.line) return true;
	if (a.range.start.line === b.range.start.line) {
		return a.range.start.column > b.range.start.column;
	}
	return false;
}

export const annotations = {
	...derived(_annotations, $a => $a.sort(documentOrder)),
	find: _annotations.find,
	add: _annotations.add,
	update: _annotations.update,
	delete: _annotations.delete,
	clear: _annotations.clear
};
