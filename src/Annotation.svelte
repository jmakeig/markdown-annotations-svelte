<script>
	import { debounce, count } from './util.js';
	import { dateTimeLocalizer } from './i18n.js';
	import { onMount, afterUpdate } from 'svelte';
	import flash from './flash.js';
	import { AnnotationMachine } from './annotation-existing-machine.js';

	const counter = count('Annotation');

	function formatDate(string) {
		if (undefined === string || null === string) {
			throw new TypeError(`${String(string)} is not a Date`);
		}
		const date = new Date(string);
		// https://stackoverflow.com/a/1353711/563324
		if (!isNaN(date)) {
			return dateTimeLocalizer.format(date);
		}
		throw new TypeError(`${string} is not a Date`);
	}

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

	let me;
	afterUpdate(() => {
		// counter('afterUpdate');
		flash(me);
	});

	function handleChange(initialValue, { wait = 250, immediate = false } = {}) {
		function actuallyHandleChange(event) {
			counter('actuallyHandleChange');
			if (initialValue !== event.target.value) {
				annotationMachine.send('change', { comment: event.target.value });
			}
		}
		return debounce(actuallyHandleChange, wait, immediate);
	}

	function change(node, value) {
		// counter('Annotation>comment: change action');
		const handler = handleChange(value);
		//node.addEventListener('change', handler);
		node.addEventListener('input', handler);
		return {
			destroy() {
				//node.removeEventListener('change', handler);
				node.removeEventListener('input', handler);
			}
		};
	}

	export let id, user, timestamp, comment, range;
</script>

<style>
	section {
		padding: 0.75em;
		background: #efefef;
		border-radius: 0.5em;
	}
	pre {
		width: 100%;
		overflow: auto;
	}
</style>

<section data-id={id} bind:this={me}>
	<pre>{JSON.stringify(machineState.value)}</pre>
	<pre>{JSON.stringify(machineState.context)}</pre>
	{#if machineState.matches('unselected')}
		<button on:click={event => annotationMachine.send('select')}>Select</button>
	{:else if machineState.matches('selected.viewing')}
		<div>{null === comment ? '' : comment}</div>
		<div>{formatDate(timestamp)}</div>
		<div>{user}</div>
		<button on:click={event => annotationMachine.send('edit')}>Edit</button>
	{:else if machineState.matches('selected.editing')}
		<textarea
			use:change={machineState.context.annotation.comment}
			value={machineState.context.annotation.comment} />
		<button disabled={!machineState.matches('selected.editing.dirty')}>
			Save
		</button>
	{:else}FALL-THROUGH{/if}
</section>
