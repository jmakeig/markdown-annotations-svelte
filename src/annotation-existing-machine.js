import { Machine, assign, interpret } from 'xstate';

function clone(...rest) {
	return Object.assign({}, ...rest);
}

const config = {
	id: 'annotation',
	initial: 'unselected',
	context: {
		id: null,
		annotation: null,
		errorMessage: null,
		cache: null
	},
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
			initial: 'loading',
			on: {
				blur: { target: 'unselected' }
			},
			states: {
				loading: {
					invoke: {
						id: 'fetchAnnotation',
						src: 'fetchAnnotationService',
						onDone: {
							target: 'viewing',
							actions: assign({ annotation: (context, event) => event.data })
						},
						onError: {
							target: 'error',
							actions: assign({
								errorMessage: (context, event) => event.data
							})
						}
					}
				},
				error: {},
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
	fetchAnnotation,
	confirmCancel,
	saveAnnotation
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
		}
	};
	return interpret(Machine(config, options));
}
