<script>
	export let data;

	import { dateTimeLocalizer } from './i18n.js';

	function formatDate(string) {
		if (undefined === string || null === string) {
			throw new TypeError(`${String(string)} is not a Date`);
		}
		const date = new Date(string);
		// https://stackoverflow.com/a/1353711/563324
		if (!isNaN(date)) {
			return dateTimeLocalizer.format(date);
		}
		throw new TypeError(`${string} is not a Date`);
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
