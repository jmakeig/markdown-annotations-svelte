import { Machine } from 'xstate';

// Actions are on transitions
// Entry/exit are on states

// Mocks for testing services: https://medium.com/@tahini/how-to-effortlessly-model-async-react-with-xstates-invoke-4c36dc8547b3

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
			}
		},
		loading: {
			on: {
				success: 'viewing',
				error: 'error',
				cancel: 'aborted'
			}
		},
		viewing: {
			on: {
				edit: 'editing'
			}
		},
		editing: {
			on: {
				cancel: {
					target: 'viewing'
				}
			},
			entry: 'asdf',
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
		isNew: true,
		errorMessage: null
	},
	states: {
		unselected: {
			on: {
				select: [
					{
						target: 'selected.loading',
						cond: (context, event) => context.isNew
					},
					{
						target: 'selected.creating',
						cond: (context, event) => !context.isNew
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
