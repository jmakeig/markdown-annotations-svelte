import { writable } from 'svelte/store';
import ColorHash from 'color-hash';

const hash = new ColorHash();

const _user = writable({
	user: null,
	avatar: null
});

export const user = {
	subscribe: _user.subscribe,
	set: _user.set,
	get color() {
		return hashColor(_user.name);
	}
};

export function hashColor(name) {
	const hex = hash.hex(name);
	return {
		backgroundColor: hex,
		color: contrast(hex)
	};
}

// Random hex
/* `#${Math.floor(Math.random() * 16777215).toString(16)}`; */

// https://trendct.org/2016/01/22/how-to-choose-a-label-color-to-contrast-with-background/
function contrast(color, light = '#fff', dark = '#000') {
	//if only first half of color is defined, repeat it
	if (color.length < 5) {
		color += color.slice(1);
	}
	return color.replace('#', '0x') > 0xffffff / 2 ? dark : light;
}
