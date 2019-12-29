<script>
	export let annotation;

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
		// console.log('rangeFromOffsets', parentStart, start, parentEnd, end);
		const range = document.createRange();
		const s = nodeFromTextOffset(parentStart, start);
		const e = nodeFromTextOffset(parentEnd, end);
		// console.log('rangeFromOffsets#nodeFromTextOffset', s, e);
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
		const r = rangeFromOffsets(
			document.querySelector(`#L${annotation.range.start.line}>td.content`),
			annotation.range.start.column,
			document.querySelector(`#L${annotation.range.end.line}>td.content`),
			annotation.range.end.column
		);
		let first;
		highlightRange(r, (node, index) => {
			// FIXME: Fix this in highlight-range.js
			index = parseInt(index, 10);

			const mark = document.createElement('mark');
			mark.classList.add('annotation-highlight');
			mark.dataset.annotationId = annotation.id;
			if (isMine) {
				mark.classList.add('mine');
			}
			if (isActive) {
				mark.classList.add('active');
			}
			mark.style.backgroundColor = `rgba(${new ColorHash()
				.rgb(annotation.user)
				.join(', ')}, 0.5)`;
			mark.onclick = evt => {
				dispatch(annotationSelect(evt.target.dataset.annotationId));
			};
			if (0 === index) first = mark;
			return mark;
		});
		// The offset from the container
		return first.getBoundingClientRect().y - relativeY;
	}

	/**
	 * @action
	 */
	function render(node) {
		console.log('render', annotation);
		return {
			update(params) {
				console.log('render.update', params, annotation);
			},
			destroy() {
				console.log('render.destroy', annotation);
			}
		};
	}
</script>

<style>
	mark {
		background-color: yellow;
	}
</style>

<mark data-annotationid={annotation.id} bind:this={markNode}>
	{annotation.id}
</mark>
<br />
