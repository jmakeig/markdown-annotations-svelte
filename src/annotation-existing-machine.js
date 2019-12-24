import { Machine, assign } from 'xstate';

function fetchAnnotation(id) {
	//return Promise.reject('oops!');
	return Promise.resolve({
		id,
		comment: 'Dummy resolved',
		user: 'jmakeig'
	});
}

function confirmCancel(message = 'You sure?') {
	return new Promise(function(resolve, reject) {
		if (window.confirm(message)) {
			resolve();
		} else {
			reject();
		}
	});
}

function saveAnnotation(annotation) {
	//return Promise.reject('oops!');
	return Promise.resolve(Object.assign({}, annotation));
}

export const annotationMachine = Machine({
	id: 'annotation',
	initial: 'unselected',
	context: {
		id: null,
		annotation: null,
		errorMessage: null
	},
	states: {
		unselected: {
			on: {
				select: {
					target: 'selected',
					actions: assign({ id: (context, event) => '1234' })
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
				error: {},
				viewing: {
					on: {
						edit: 'editing'
					}
				},
				editing: {
					id: 'editing',
					initial: 'clean',
					states: {
						clean: {
							on: {
								change: 'dirty',
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
										cancel: 'confirming'
									}
								},
								confirming: {
									invoke: {
										id: 'confirmCancel',
										src: (context, event) => confirmCancel('You sure?'),
										onDone: {
											target: '#annotation.selected.viewing'
										},
										onError: { target: 'changing' }
									}
								}
							}
						},
						saving: {
							invoke: {
								id: 'saveAnnotation',
								src: (context, event) => saveAnnotation(context.annotation),
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
});
