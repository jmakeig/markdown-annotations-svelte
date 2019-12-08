<script>
	export let data;

	import { dateLocalizer } from './i18n.js';

	function formatDate(string) {
		return dateLocalizer.format(new Date(string));
	}
</script>

<style>
	section {
		padding: 0.75em;
		background: #efefef;
		border-radius: 0.5em;
	}
</style>

<section>
	<div>{data.comment}</div>
	<div>{formatDate(data.timestamp)}</div>
	<div>{data.user}</div>
</section>
