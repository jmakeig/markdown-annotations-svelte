<script>
	import { afterUpdate, createEventDispatcher } from 'svelte';
	export let text;
	export let annotations = [];

	// const dispatch = createEventDispatcher();

	afterUpdate(() => {
		// console.log('after update');
	});
</script>

<style>
	table {
		width: 100%;
		border-collapse: collapse;
	}
	td {
		padding: 0.25em;
		text-align: left;
		vertical-align: top;
	}
	tr[data-line] td:first-child {
		width: 1em;
	}
	tr[data-line] td:first-child:before {
		/* Put the line numbers in a pseudo element so they cannot be selected. */
		content: attr(data-line) '.';
		user-select: none;
	}
</style>

<table>
	{#each text.split('\n') as line, index}
		<tr class="line" data-line={index + 1}>
			<!-- It’s not possible to get the attribute value of a parent element in CSS, so this has to be repeated here. -->
			<td data-line={index + 1} />
			<td>{line}</td>
		</tr>
	{/each}
</table>
<svelte:head>
	<title>Markdown Annotations ({Math.random()})</title>
</svelte:head>
