import { Machine } from 'xstate';
// Actions are on transitions
// Entry/exit are on states

// Mocks for testing services: https://medium.com/@tahini/how-to-effortlessly-model-async-react-with-xstates-invoke-4c36dc8547b3

function fetchAnnotation(id = null) {
	//return Promise.reject('oops!');
	return Promise.resolve({
		id,
		comment: 'Dummy resolved',
		user: 'jmakeig'
	});
}

const dirty = {
	initial: 'clean',
	states: {
		clean: {
			on: {
				change: 'dirty'
			}
		},
		dirty: {
			on: {
				save: '#annotation.selected.saving'
			}
		}
	}
};

const selected = {
	id: 'selected',
	initial: 'aborted',
	states: {
		creating: {
			on: {
				'': 'editing'
			},
			entry: assign({
				annotation: (context, event) => ({ id: null, comment: 'NEW!' })
			})
		},
		loading: {
			invoke: {
				id: 'fetchAnnotation',
				src: (context, event) => fetchAnnotation(context.id),
				onDone: {
					target: 'viewing',
					actions: assign({ annotation: (context, event) => event.data })
				},
				onError: {
					target: 'error',
					actions: assign({ errorMessage: (context, event) => event.data })
				}
			}
		},
		viewing: {
			on: {
				edit: 'editing'
			}
		},
		editing: {
			on: {
				cancel: [
					{ cond: (context, event) => null !== context.id, target: 'viewing' }
				]
			},
			...dirty
		},
		saving: {
			on: {
				success: 'viewing',
				error: 'error',
				cancel: 'aborted'
			}
		},
		error: {},
		aborted: {
			on: {
				reload: 'loading'
			}
		}
	}
};

export const annotationMachine = Machine({
	id: 'annotation',
	initial: 'unselected',
	context: {
		id: '1234',
		errorMessage: null
	},
	states: {
		unselected: {
			on: {
				select: [
					{
						target: 'selected.loading',
						cond: (context, event) => null !== context.id
					},
					{
						target: 'selected.creating',
						cond: (context, event) => null === context.id
					}
				]
			}
		},
		selected: {
			...selected,
			on: {
				blur: '#annotation.unselected'
			},
			exit: ['destroyAnnotation']
		}
	}
});
