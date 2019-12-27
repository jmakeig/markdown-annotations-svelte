<script>
	import ColorHash from 'color-hash';
	const hash = new ColorHash();

	export let name;
</script>

<style>
	.color {
		display: inline-block;
		width: 1em;
		height: 1em;
		margin-right: 0.25em;
		line-height: 1;
		border-radius: 0.5em;
	}
</style>

<span>
	<span class="color" style={`background-color: ${hash.hex(name)};`}>
		&nbsp;
	</span>
	{name}
</span>
