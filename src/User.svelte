<script>
	import ColorHash from 'color-hash';
	const hash = new ColorHash();

	export let name;
</script>

<style>
	.User {
		display: flex;
		font-size: 80%;
	}
	.User > div {
		margin-right: 0.5em;
	}
	.name {
		font-weight: bold;
	}
	.avatar {
		display: inline-block;
		width: 2em;
		height: 2em;
		margin-right: 0.25em;
		line-height: 1;
		border-radius: 4em;
	}
</style>

<div class="User">
	<div>
		<span class="avatar" style={`background-color: ${hash.hex(name)};`}>
			&nbsp;
		</span>
	</div>
	<div>
		<span class="name">{name}</span>
		<div>
			<slot />
		</div>
	</div>
</div>
