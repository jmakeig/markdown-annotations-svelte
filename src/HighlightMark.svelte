<script>
	import { onMount, afterUpdate, onDestroy, getContext, tick } from 'svelte';
	import { highlightRange } from './highlight-range.js';

	import { hashColor } from './user-store.js';

	export let annotation;
	export let isActive;

	const user = getContext('user');
	const parent = getContext('table');

	/**
	 *
	 * @param {Node} parent
	 * @param {number} offset
	 * @return {Object} - `{ node: Node, offset: number }`
	 */
	function nodeFromTextOffset(parent, offset = 0) {
		if (!parent) return;
		// console.log('nodeFromTextOffset', parent, offset);

		const iter = document.createNodeIterator(parent, NodeFilter.SHOW_TEXT);

		let counter = -1;
		let node;
		let last;
		// Find the start node (could we somehow skip this seemingly needless search?)
		while (counter < offset && iter.nextNode()) {
			node = iter.referenceNode;
			if (node.nodeType === Node.TEXT_NODE) {
				last = offset - counter - 1;
				counter += node.textContent.length;
			}
		}
		return { node: node, offset: last };
	}
	/**
	 * Descendent-or-self until you get a `TextNode`
	 *
	 * @param {Node} node
	 * @return {TextNode} - Or `undefined` if there are not text
	 *                      children, e.g. `<br/>`
	 */
	function childTextNodeOrSelf(node) {
		if (!node) return;
		if (!(node instanceof Node)) throw new TypeError(node.constructor.name);

		if (Node.TEXT_NODE === node.nodeType) {
			return node;
		}
		if (node.firstChild) {
			return childTextNodeOrSelf(node.firstChild);
		}
		return undefined;
	}

	/**
	 * Some stuff
	 *
	 * @param {Node} parentStart
	 * @param {number} start
	 * @param {Node} parentEnd
	 * @param {number} end
	 * @return {Range}
	 */
	function rangeFromOffsets(
		parentStart,
		start = 0,
		parentEnd = parentStart,
		end = 0
	) {
		const range = document.createRange();
		const s = nodeFromTextOffset(parentStart, start);
		const e = nodeFromTextOffset(parentEnd, end);
		range.setStart(childTextNodeOrSelf(s.node), s.offset);
		range.setEnd(childTextNodeOrSelf(e.node), e.offset);

		return range;
	}

	function renderAnnotationHighlight(
		annotation,
		isMine = false,
		isActive = false,
		relativeY = 0,
		dispatch
	) {
		if (!annotation) return;
		const scope = parent.ref;
		const r = rangeFromOffsets(
			scope.querySelector(`#L${annotation.range.start.line}>td.content`),
			annotation.range.start.column,
			scope.querySelector(`#L${annotation.range.end.line}>td.content`),
			annotation.range.end.column
		);
		let first;
		/* Returns a function that will remove the annotation parts. Perfect for the destroy lifecycle event. */
		return highlightRange(r, (node, index) => {
			// FIXME: Fix this in highlight-range.js
			index = parseInt(index, 10);

			const mark = document.createElement('mark');
			// mark.classList.add('annotation-highlight');
			mark.dataset.annotationId = annotation.id;
			if (isMine) {
				mark.classList.add('mine');
			}
			if (isActive) {
				mark.classList.add('active');
			}

			Object.assign(mark.style, hashColor(annotation.user));
			mark.onclick = event => {
				//dispatch(annotationSelect(evt.target.dataset.annotationId));
				console.log('clicked', event);
			};
			if (0 === index) first = mark;
			return mark;
		});
		// The offset from the container
		// return first.getBoundingClientRect().y - relativeY;
	}

	onMount(() => {
		return renderAnnotationHighlight(
			annotation,
			annotation.user === $user.name,
			false
		);
	});
</script>
