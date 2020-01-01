<script>
	import { debounce, count } from './util.js';
	import { formatDate } from './i18n.js';
	import { onMount, beforeUpdate, afterUpdate, tick } from 'svelte';
	// import { flash } from './flash.js';
	import { AnnotationMachine } from './annotation-existing-machine.js';
	import User from './User.svelte';

	const counter = count('Annotation');

	export let instance;
	$: ({ id, comment, user, timestamp, range, isActive } = instance);

	export let services;

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

	const annotationMachine = AnnotationMachine(instance, {
		confirmCancel,
		saveAnnotation
	});

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
	// afterUpdate(() => {
	// counter('afterUpdate');
	// flash(me);
	// });

	$: {
		if (machineState.matches('unselected') && isActive) {
			console.log({ id });
			annotationMachine.send('select', { id });
		}
	}

	function handleChange(initialValue, wait = 500) {
		return debounce(
			event =>
				annotationMachine.send('change', { comment: event.target.value }),
			wait
		);
	}

	/**
	 * Action to handle changing the comment field
	 */
	function change(textarea, value) {
		// counter('Annotation>comment: change action');
		const handler = handleChange();
		//node.addEventListener('change', handler);
		textarea.addEventListener('input', handler);
		return {
			destroy() {
				//node.removeEventListener('change', handler);
				textarea.removeEventListener('input', handler);
			}
		};
	}

	/**
	 * Action to set the focus on the textarea.
	 */
	function focus(textarea) {
		tick().then(() => {
			textarea.focus();
		});
	}

	// TODO: {@html …} doesn’t sanitize. Probably should just do Markdown here.
	function toHTML(str) {
		if (null === str || undefined === str) return '';
		//return str.replace(/\n/g, '<br/>');
		return str;
	}

	const DEBUG = false;
</script>

<style>
	/* * {
		outline: solid 1px green;
	} */
	section {
		margin: 1em 0;
		padding: 1em 1.5em;

		border-radius: 0;
		border: solid 1px #ccc;

		/* So the close button can be absolutely positioned */
		position: relative;
	}

	section.selected {
		box-shadow: 2px 2px 0px 0px rgba(0, 0, 0, 0.15);
	}

	.title {
		display: flex;
	}
	.selected .title {
		padding-bottom: 0.75em;
		border-bottom: solid 1px #ccc;
	}
	.title > .edit > * {
		flex: 0;
		text-align: right;
		display: flex;
	}
	.title > .user {
		flex: 1;
	}
	.controls {
		display: flex;
		justify-content: flex-end;
	}
	.controls > * {
		display: block;
	}
	/* DEBUG
	section * {
		outline: solid 0.5px #666 !important;
	}*/
	textarea.comment {
		box-sizing: border-box;
		width: 100%;
		min-height: 8em;

		padding: 0.5em;

		border-color: #ccc;

		font-family: inherit;
		font-size: inherit;
	}
	.comment {
		margin: 1em 0;
	}
	.close {
		position: absolute;
		top: 0.1em;
		right: 0.1em;
		z-index: 10;
	}
	.close button {
		background-color: transparent;
		border-style: none;
		color: #ccc;
	}
	/*
	pre {
		width: 100%;
		overflow: auto;
		font-size: 80%;
	}
	*/
</style>

<!-- {@debug machineState} -->

<section
	data-id={id}
	bind:this={me}
	class={machineState.matches('unselected') ? 'unselected' : 'selected'}>
	{#if DEBUG}
		<pre>{JSON.stringify(instance, null, 2)}</pre>
		<pre>{JSON.stringify(machineState.value, null, 2)}</pre>
		<pre>{JSON.stringify(machineState.context, null, 2)}</pre>
	{/if}
	<button on:click={event => services.delete(instance)}>DELETE</button>
	{#if machineState.matches('unselected')}
		<div class="title">
			<div class="user">
				<!-- TODO: Need to figure out where to store user -->
				<User name={user}>{formatDate(timestamp)}</User>
			</div>
			<div class="edit">
				<button on:click={event => annotationMachine.send('select', { id })}>
					S
				</button>
			</div>
		</div>
	{:else if machineState.matches('selected')}
		<div class="close">
			<button title="Close" on:click={event => annotationMachine.send('blur')}>
				X
			</button>
		</div>
		<div class="title">
			<div class="user">
				<User name={machineState.context.annotation.user}>
					{formatDate(timestamp)}
				</User>
			</div>
			{#if machineState.matches('selected.viewing')}
				<div class="edit">
					<button on:click={event => annotationMachine.send('edit')}>E</button>
				</div>
			{/if}
		</div>
		{#if machineState.matches('selected.viewing')}
			<div class="comment">{toHTML(comment)}</div>
		{:else if machineState.matches('selected.editing')}
			<textarea
				class="comment"
				use:change={machineState.context.annotation.comment}
				use:focus
				value={machineState.context.annotation.comment} />
			<div class="controls">
				<button on:click={event => annotationMachine.send('cancel')}>
					Cancel
				</button>
				<button
					disabled={!machineState.matches('selected.editing.dirty')}
					on:click={event => annotationMachine.send('save')}>
					Save
				</button>
			</div>
		{/if}
	{/if}
</section>
