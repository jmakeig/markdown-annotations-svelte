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
