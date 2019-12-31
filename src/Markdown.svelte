<script>
	import { getContext, setContext, onMount } from 'svelte';
	import { highlightRange } from './highlight-range.js';

	import { hashColor } from './user-store.js';

	import HighlightMark from './HighlightMark.svelte';

	export let text;
	export let annotations; // svelte/store

	/* Set the context of the rendered Markdown so highlights can be rendered within. */
	let table;
	setContext('table', {
		get ref() {
			return table;
		}
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
	table {
		line-height: 1.85;
	}
	:global(mark) {
	}
</style>

<svelte:head>
	<title>Markdown Annotations</title>
</svelte:head>

<table bind:this={table}>
	{#each text.split('\n') as line, index (index)}
		<tr class="line" id={`L${index + 1}`} data-line={index + 1}>
			<!-- It’s not possible to get the attribute value of a parent element in CSS, so this has to be repeated here. -->
			<td data-line={index + 1} />
			<td class="content">{line}</td>
		</tr>
	{/each}
</table>

{#each $annotations as annotation (annotation.id)}
	<HighlightMark {annotation} isActive={false} />
{/each}
