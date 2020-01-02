import { Machine, assign, interpret } from 'xstate';

function clone(...rest) {
	return Object.assign({}, ...rest);
}

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
			on: {
				select: {
					target: 'selected',
					actions: assign({
						id: (context, event) => event.id
					})
				}
			}
		},
		selected: {
			initial: 'viewing',
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
								change: { target: 'dirty', actions: 'updateAnnotation' }
							}
						},
						dirty: {
							on: {
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

/*
const config1 = {
	id: 'annotation',
	initial: 'unselected',
	states: {
		unselected: {
			on: {
				select: {
					target: 'selected',
					actions: assign({
						id: (context, event) => event.id
					})
				}
			}
		},
		selected: {
			id: 'selected',
			initial: 'viewing',
			on: {
				blur: { target: 'unselected' }
			},
			states: {
				viewing: {
					on: {
						edit: 'editing'
					}
				},
				editing: {
					id: 'editing',
					initial: 'clean',
					entry: assign({ cache: (c, e) => clone(c.annotation) }),
					states: {
						clean: {
							on: {
								change: {
									target: 'dirty',
									actions: 'updateAnnotation'
								},
								cancel: '#annotation.selected.viewing'
							}
						},
						dirty: {
							id: 'dirty',
							initial: 'changing',
							on: {
								save: 'saving',
								blur: undefined
							},
							states: {
								changing: {
									on: {
										cancel: 'confirming',
										change: {
											target: 'changing',
											actions: 'updateAnnotation'
										}
									}
								},
								confirming: {
									invoke: {
										id: 'confirmCancel',
										src: 'confirmCancelService',
										onDone: {
											target: '#annotation.selected.viewing',
											actions: [
												assign({
													annotation: (context, event) => clone(context.cache)
												}),
												assign({ cache: (context, event) => null })
											]
										},
										onError: { target: 'changing' }
									}
								}
							}
						},
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
				}
			}
		}
	}
};
*/

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
    fetchAnnotationService: (context, event) =>
      Promise.resolve({
        id: 'ANN1234',
        comment: 'Hi!',
        timestamp: new Date().toISOString()
      }),
    confirmCancelService: (context, event) => confirmCancel(),
    saveAnnotationService: (context, event) => Promise.resolve({})
  }
};

const machine = Machine(config, options);
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
			})
		},
		services: {
			fetchAnnotationService: (context, event) => fetchAnnotation(context.id),
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

	function dirtyGuard(context, event, meta) {
		if (meta && meta.state) {
			//console.log(m.state.value);
			return meta.state.value.selected.editing !== 'dirty';
		}
		return true;
	}

	const initialContext = {
		id: null,
		annotation,
		errorMessage: null,
		cache: null
	};
	return interpret(Machine(config, options).withContext(initialContext));
}
