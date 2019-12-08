<script>
	import { onMount, createEventDispatcher } from 'svelte';
	export let text;

	// const dispatch = createEventDispatcher();

	function handleSelectionChange(event) {
		console.log(document.getSelection());
		// dispatch('selection', { selection: 'asdf' });
	}

	onMount(() => {
		document.addEventListener('selectionchange', handleSelectionChange);
		return () =>
			document.removeEventListener('selectionchange', handleSelectionChange);
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
