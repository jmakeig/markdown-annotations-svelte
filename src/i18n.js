export const dateTimeLocalizer = new Intl.DateTimeFormat(
	'default', //[navigator.language, 'en-US'],
	{
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
		second: 'numeric',
		timeZoneName: 'short'
	}
);

export function formatDate(string) {
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
