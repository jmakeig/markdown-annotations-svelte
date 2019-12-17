import { Machine } from 'xstate';

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
				save: '#annotation.saving'
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
					{ target: 'loading', cond: (context, event) => !context.isNew },
					{ target: 'editing', cond: (context, event) => context.isNew }
				]
			}
		},

		loading: {
			on: {
				success: 'viewing',
				error: 'error',
				cancel: 'aborted'
			}
		},
		aborted: {},
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
		error: {}
	}
});
