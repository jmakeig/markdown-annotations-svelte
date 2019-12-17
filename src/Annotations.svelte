<script>
	import { afterUpdate } from 'svelte';
	import Annotation from './Annotation.svelte';

	export let items;

	afterUpdate(() => {
		console.log('Annotations.afterUpdate');
		// TODO: This is where the Annotation instances get positioned
	});
</script>

<div>
	{#each $items as annotation, index (annotation.id)}
		<Annotation {...annotation} />
	{/each}
</div>
