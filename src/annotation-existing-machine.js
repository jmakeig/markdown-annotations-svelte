import { Machine, assign, interpret } from 'xstate';

function clone(...rest) {
	return Object.assign({}, ...rest);
}

/**
 * Builder for confirmation states.
 *
 * @param {String} onConfirm State to transition to on confirmation
 * @param {String} onCancel State to transition to on cancel
 */
const confirming = (onConfirm, onCancel) => ({
	confirming: {
		invoke: {
			src: 'confirmCancelService',
			onDone: {
				target: onConfirm,
				actions: [
					assign({
						annotation: (context, event) => clone(context.cache)
					}),
					assign({ cache: (context, event) => null })
				]
			},
			onError: { target: onCancel }
		}
	}
});

/**
 * Builder for cancel transitions that guard against losing dirty data.
 *
 * @param {String} name The name of the current transition
 * @param {String} next The state to transition to if no confirmation is needed
 */
const cancel = (name, next) => ({
	[name]: [
		{
			target: next,
			cond: 'dirtyGuard'
		},
		{
			target: 'confirming',
			cond: 'needsConfirmation'
		}
	]
});

const config = {
	strict: true,
	id: 'annotation',
	initial: 'unselected',
	states: {
		unselected: {
			entry: assign({
				annotation: (context, event) => ({
					...context.annotation,
					isActive: false
				})
			}),
			on: {
				select: {
					target: 'selected'
				}
			}
		},
		selected: {
			initial: 'viewing',
			entry: assign({
				annotation: (context, event) => ({
					...context.annotation,
					isActive: true
				})
			}),
			states: {
				viewing: {
					on: {
						edit: 'editing'
					}
				},
				editing: {
					initial: 'clean',
					on: {
						...cancel('cancel', 'viewing')
					},
					states: {
						clean: {
							on: {
								change: {
									target: 'dirty',
									actions: ['cache', 'updateAnnotation']
								}
							}
						},
						dirty: {
							on: {
								change: {
									target: 'dirty',
									actions: ['updateAnnotation']
								},
								save: 'saving',
								...cancel('revert', 'clean')
							}
						},
						...confirming('clean', 'dirty'),
						saving: {
							invoke: {
								id: 'saveAnnotation',
								src: 'saveAnnotationService',
								onDone: {
									target: '#annotation.selected.viewing',
									actions: assign({
										annotation: (context, event) => event.data
									})
								},
								onError: {
									actions: assign({
										errorMessage: (context, event) => event.data
									})
								}
							}
						}
					}
				},
				...confirming('viewing', 'editing.dirty')
			},
			on: {
				...cancel('blur', 'unselected')
			}
		},
		...confirming('unselected', 'selected.editing.dirty')
	}
};

function dirtyGuard(context, event, meta) {
	if (meta && meta.state) {
		//console.log(m.state.value);
		return meta.state.value.selected.editing !== 'dirty';
	}
	return true;
}
/*
// For XState visualizer

function confirmCancel(message = 'You sure?') {
	return new Promise(function(resolve, reject) {
		if (window.confirm(message)) {
			resolve();
		} else {
			reject();
		}
	});
}

const options = {
	actions: {
		updateAnnotation: assign({
			annotation: (context, event) =>
				// This is an awkward way to update the `comment` property
				Object.assign({}, context.annotation, {
					comment: context.annotation.comment + 'X'
				})
		})
	},
	services: {
		confirmCancelService: (context, event) => confirmCancel(),
		saveAnnotationService: (context, event) => Promise.resolve({}),
	},
	guards: {
		dirtyGuard(c, e, m) {
			return dirtyGuard(c, e, m);
		},
		needsConfirmation(c, e, m) {
			return !dirtyGuard(c, e, m);
		}
	}
};
const annotation = {
	id: 'ANN12345',
	user: 'jmakeig',
	comment: 'Here is some text',
	timestamp: '2019-12-16T22:14:28.872Z',
	range: {
		start: { line: 3, column: 120 },
		end: { line: 3, column: 500 }
	},
	isActive: false
};

const initialContext = {
	id: null,
	annotation,
	errorMessage: null,
	cache: null
};
const machine = interpret(Machine(config, options).withContext(initialContext));
*/

export function AnnotationMachine(
	annotation,
	{ fetchAnnotation, confirmCancel, saveAnnotation }
) {
	const options = {
		actions: {
			updateAnnotation: assign({
				annotation: (context, event) =>
					// This is an awkward way to update the `comment` property
					clone(context.annotation, {
						comment: event.comment
					})
			}),
			cache: assign({
				cache: (context, event) =>
					context.cache === null ? clone(context.annotation) : context.cache
			})
		},
		services: {
			confirmCancelService: (context, event) => confirmCancel(),
			saveAnnotationService: (context, event) =>
				saveAnnotation(context.annotation)
		},
		guards: {
			dirtyGuard(c, e, m) {
				return dirtyGuard(c, e, m);
			},
			needsConfirmation(c, e, m) {
				return !dirtyGuard(c, e, m);
			}
		}
	};

	const initialContext = {
		id: null,
		annotation,
		errorMessage: null,
		cache: null
	};
	return interpret(Machine(config, options).withContext(initialContext));
}
