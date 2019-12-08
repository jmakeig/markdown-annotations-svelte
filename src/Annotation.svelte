<script>
	export let data;

	import dateLocalizer from './i18n.js';

	function formatDate(string) {
		return dateLocalizer.format(new Date(string));
	}
</script>

<style>
	section {
		border: solid 0.5px #ccc;
		padding: 0.5em;
	}
</style>

<section>
	<div>{data.comment}</div>
	<div>{formatDate(data.timestamp)}</div>
	<div>{data.user}</div>
</section>
