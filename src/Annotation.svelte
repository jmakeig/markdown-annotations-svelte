<script>
	import { dateTimeLocalizer } from './i18n.js';
	import { onMount, afterUpdate } from 'svelte';
	import flash from './flash.js';
	import { annotationMachine } from './annotation-existing-machine.js';
	import { interpret } from 'xstate';

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

	let toggleService;

	onMount(() => {
		toggleService = interpret(annotationMachine)
			.onTransition(state => console.log(state.value))
			.start();
	});

	let me;
	afterUpdate(() => {
		flash(me);
	});

	export let id, user, timestamp, comment, range;
</script>

<style>
	section {
		padding: 0.75em;
		background: #efefef;
		border-radius: 0.5em;
	}
</style>

<section
	data-id={id}
	bind:this={me}
	on:click={event => toggleService.send('select')}>
	<div>{null === comment ? '' : comment}</div>
	<div>{formatDate(timestamp)}</div>
	<div>{user}</div>
</section>
