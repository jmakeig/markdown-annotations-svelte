<script>
	import { onMount, createEventDispatcher } from 'svelte';

	let context;

	const dispatch = createEventDispatcher();

	function onSelect(element, callback) {
		// console.log(element, callback);
		let isSelecting = false;
		let selection = null;

		function handleSelectStart(event) {
			// console.log(event);
			isSelecting = true; //!document.getSelection().isCollapsed;
		}

		function handleMouseUp(event) {
			// console.log(event, isSelecting);
			if (isSelecting && !document.getSelection().isCollapsed) {
				callback((selection = document.getSelection()));
				isSelecting = false;
			}
		}

		function handleSelectionChange(event) {
			// console.log('change', isSelecting);
			if (document.getSelection().isCollapsed) {
				if (null !== selection) callback((selection = null));
			}
		}

		element.addEventListener('selectstart', handleSelectStart);
		element.addEventListener('mouseup', handleMouseUp);
		document.addEventListener('selectionchange', handleSelectionChange);

		return function destroy() {
			element.removeEventListener('selectstart', handleSelectStart);
			element.removeEventListener('mouseup', handleMouseUp);
			document.removeEventListener('selectionchange', handleSelectionChange);
		};
	}

	onMount(() => {
		return onSelect(context, selection => {
			// console.log(selection);
			dispatch('selectionchange', selection);
		});
	});
</script>

<!-- Why do I need this extra div? -->
<div bind:this={context}>
	<slot />
</div>
