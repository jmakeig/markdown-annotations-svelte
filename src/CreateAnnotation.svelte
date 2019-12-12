<script>
	import { onMount, createEventDispatcher } from 'svelte';
	export let selection;
	//export let range;
	//export let text;
	let position;
	$: ({ position = { x: -1000, y: -1000 } } = selection || {});
	const nudge = 5;
</script>

<style>
	#CreateAnnotation {
		position: absolute;

		border-radius: 0.5em;
		padding: 0.25em;

		box-shadow: 2px 2px 8px 0px rgba(0, 0, 0, 0.5);
		background-color: white;

		user-select: none;
	}
</style>

<div
	id="CreateAnnotation"
	style="top: {position.y + nudge}px; left: {position.x + nudge}px;">
	<button>🖍 Add annotation…</button>
</div>
