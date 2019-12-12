<script>
	import { onMount, createEventDispatcher } from 'svelte';
	export let position;
	//xport let range;
	//export let text;
	$: p = position || { x: -1000, y: -1000 };
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
	button {
	}
</style>

<div id="CreateAnnotation" style="top: {p.y + nudge}px; left: {p.x + nudge}px;">
	<button>🖍 Add annotation…</button>
</div>
