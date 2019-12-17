import { Machine } from 'xstate';
//import { Machine } from 'xstate';

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
		creating: {},
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
				cancel: 'viewing'
			},
			...dirty
		},
		saving: {
			on: {
				success: 'viewing',
				error: 'error',
				cancel: 'error'
			}
		},
		error: {},
		aborted: {}
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
			...selected
		}
	}
});
