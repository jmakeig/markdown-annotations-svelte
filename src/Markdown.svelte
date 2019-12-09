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
	td[data-linenumber] {
		width: 1em;
	}
	td[data-linenumber]:before {
		content: attr(data-lineNumber) '.';
	}
</style>

<table>
	{#each text.split('\n') as line, index}
		<tr>
			<td data-linenumber={index + 1} />
			<td>{line}</td>
		</tr>
	{/each}
</table>
<svelte:head>
	<title>Markdown Annotations ({Math.random()})</title>
</svelte:head>
