<script>
	import Annotation from './Annotation.svelte';
	export let items;
</script>

<div>
	{#each items as annotation}
		<Annotation data={annotation} />
	{/each}
</div>
