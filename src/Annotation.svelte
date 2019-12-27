<script>
	import { debounce, count } from './util.js';
	import { formatDate } from './i18n.js';
	import { onMount, afterUpdate } from 'svelte';
	// import { flash } from './flash.js';
	import { AnnotationMachine } from './annotation-existing-machine.js';
	import User from './User.svelte';

	const counter = count('Annotation');

	export let instance;
	$: ({ id, comment, user, timestamp, range } = instance);

	export let services;

	/**
	 * Fake over-engineered Promise just in case I need to
	 * retrieve this asynchronously in the future.
	 */
	function fetchAnnotation(id) {
		//return Promise.reject('oops!');
		return Promise.resolve(instance);
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
		return Promise.resolve(services.update(annotation));
	}

	let machineState;

	const annotationMachine = AnnotationMachine(
		fetchAnnotation,
		confirmCancel,
		saveAnnotation
	);

	annotationMachine
		.onTransition(state => {
			// console.log(state);
			// if (state.changed)
			machineState = Object.assign({}, state);
		})
		.start();

	// Do I need this?
	onMount(() => () => annotationMachine.stop());

	let me;
	afterUpdate(() => {
		// counter('afterUpdate');
		// flash(me);
	});

	function handleChange(initialValue, wait = 500) {
		return debounce(
			event =>
				annotationMachine.send('change', { comment: event.target.value }),
			wait
		);
	}

	function change(node, value) {
		// counter('Annotation>comment: change action');
		const handler = handleChange();
		//node.addEventListener('change', handler);
		node.addEventListener('input', handler);
		return {
			destroy() {
				//node.removeEventListener('change', handler);
				node.removeEventListener('input', handler);
			}
		};
	}

	const DEBUG = false;
</script>

<style>
	section {
		padding: 0.75em;
		background: #efefef;
		border-radius: 0.5em;
	}
	textarea {
		width: 100%;
		min-height: 8em;

		padding: 0.25em;
		line-height: 1.25;

		font-family: inherit;
		font-size: inherit;
	}
	.title {
		font-size: 85%;
	}
	/*
	pre {
		width: 100%;
		overflow: auto;
		font-size: 80%;
	}
	*/
</style>

<section data-id={id} bind:this={me}>
	{#if DEBUG}
		<pre>{JSON.stringify(machineState.value, null, 2)}</pre>
		<pre>{JSON.stringify(machineState.context, null, 2)}</pre>
	{/if}
	{#if machineState.matches('unselected')}
		<button on:click={event => annotationMachine.send('select', { id })}>
			Select
		</button>
	{:else if machineState.matches('selected')}
		<div class="title">
			<User name={user} />
		</div>
		{#if machineState.matches('selected.viewing')}
			<div>{null === comment ? '' : comment}</div>
			<div>{formatDate(timestamp)}</div>
			<button on:click={event => annotationMachine.send('edit')}>Edit</button>
		{:else if machineState.matches('selected.editing')}
			<textarea
				use:change={machineState.context.annotation.comment}
				value={machineState.context.annotation.comment} />
			<button
				disabled={!machineState.matches('selected.editing.dirty')}
				on:click={event => annotationMachine.send('save')}>
				Save
			</button>
			<button on:click={event => annotationMachine.send('cancel')}>
				Cancel
			</button>
		{/if}
	{/if}
</section>
