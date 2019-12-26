/** Adapted from https://davidwalsh.name/javascript-debounce-function */
export function debounce(func, wait, immediate) {
	let timeout;
	return function _debounce() {
		const context = this,
			args = arguments;
		function later() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		}
		const callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) {
			func.apply(context, args);
		}
	};
}

export const count = component => name => console.count(`${component}>${name}`);
