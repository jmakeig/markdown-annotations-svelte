import { writable, derived } from 'svelte/store';

const items = writable([
	{
		id: 'ANN12345',
		user: 'jmakeig',
		comment: 'Here is some text',
		timestamp: '2019-12-16T22:14:28.872Z',
		range: {
			start: { line: 1, column: 53 },
			end: { line: 1, column: 100 }
		}
	}
]);

function stampTime(object) {
	return Object.assign({}, object, { timestamp: new Date().toISOString() });
}

export const annotations = {
	subscribe: items.subscribe,
	add: annotation =>
		items.update(state => [
			...state,
			stampTime(
				Object.assign({}, annotation, {
					id: String(new Date().valueOf())
				})
			)
		]),
	update: annotation =>
		items.update(state =>
			state.map(item => {
				// console.log('id', item.id, annotation.id);
				if (item.id === annotation.id) {
					// console.log('with update', annotation);
					return stampTime(Object.assign({}, annotation));
				}
				return item;
			})
		),
	delete: annotation =>
		items.update(state => state.filter(item => annotation.id !== item.id)),
	clear: () => items.update(state => [])
};

// export const sorted = derived(todos_, (todos_) => sortBy(todos_, 'checkboxed'))
