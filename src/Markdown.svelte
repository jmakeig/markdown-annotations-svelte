<script>
	import { onMount } from 'svelte';
	export let rawText;

	function handleSelectionChange(event) {
		console.log(document.getSelection());
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

<svelte:head>
	<title>Markdown Annotations ({Math.random()})</title>
</svelte:head>

<table>
	{#each rawText.split('\n') as line, index}
		<tr>
			<td data-linenumber={index + 1} />
			<td>{line}</td>
		</tr>
	{/each}
</table>
