<script>
	import ColorHash from 'color-hash';
	const hash = new ColorHash();

	let hasContent = $$props.$$slots;

	export let name;
</script>

<style>
	.User {
		display: flex;
		font-size: 80%;
	}
	.User > .avatar {
		margin-right: 0.5em;
	}
	.name {
		font-weight: bold;
	}
	.avatar {
		display: flex;
		align-items: center;
	}
	.avatar > span {
		display: block;
		border-radius: 50%;
		height: 2em;
		width: 2em;
	}
	/* .avatar,
	.name {
		outline: solid 1px red;
	} */
</style>

<div class="User">
	<div class="avatar">
		<span style={`background-color: ${hash.hex(name)};`} />
	</div>
	<div>
		<span class="name">{name}</span>
		{#if hasContent}
			<div>
				<slot />
			</div>
		{/if}
	</div>
</div>
