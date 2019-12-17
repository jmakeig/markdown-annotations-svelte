<script>
	import { onMount, createEventDispatcher } from 'svelte';
	import CreateAnnotation from './CreateAnnotation.svelte';

	const dispatch = createEventDispatcher();

	/**
	 * Given a node, find its parent line.
	 *
	 * @param {Node} node
	 * @param {string} [matcher = 'tr.line']
	 */
	function getLine(node, matcher = 'tr.line') {
		do {
			if (node.matches && node.matches(matcher)) {
				return node;
			}
		} while ((node = node.parentNode));
		return undefined;
	}

	/**
	 * The number of characters from the start of the parent node
	 * to the child node, flattening all intervening children,
	 * plus the offset in the child node.
	 *
	 * @example <div>ab<a>cd<a>ef</a>f</a>gh</div>
	 *          textOffsetFromNode(div, a[1], 1) // 5 = 'ab' + 'cd' + 1
	 *
	 * @param {Node} parent
	 * @param {Node} child
	 * @param {number} [childOffset = 0]
	 */
	function textOffsetFromNode(parent, child, childOffset = 0) {
		if (!parent) return;
		if (!child) return offset;
		// console.log('textOffsetFromNode', parent, child, childOffset);
		const iter = document.createNodeIterator(parent, NodeFilter.SHOW_TEXT);

		let node;
		let offset = 0;
		while (iter.nextNode()) {
			node = iter.referenceNode;
			if (node === child) {
				return offset + childOffset;
			}
			if (Node.TEXT_NODE === node.nodeType) {
				offset += node.textContent.length;
			}
		}
		throw new Error(
			`Couldn’t find ${String(child)} as a child of ${String(parent)}`
		);
	}

	/**
	 * Given a node, find its parent line number,
	 * delegating to `getLine()`.
	 *
	 * @param {Node} node
	 * @param {string} [matcher = 'tr.line']
	 * @return {number}
	 */
	function getLineNumber(node, matcher = 'tr.line') {
		return parseInt(getLine(node, matcher).dataset.line, 10);
	}

	/**
	 * Given a `Selection`, determine the `Range`, where
	 * `start` is always before `end`, regardless
	 * from which direction the selection was made.
	 *
	 * @param {Selection} selection
	 * @returns {Object} - `{ start: number, end: number };
	 */
	function getRange(selection) {
		if (!selection) return;
		if (!(selection instanceof Selection))
			throw new TypeError(String(selection.constructor.name));

		const anchor = {
			line: getLineNumber(selection.anchorNode),
			column: textOffsetFromNode(
				getLine(selection.anchorNode),
				selection.anchorNode,
				selection.anchorOffset
			)
		};
		const focus = {
			line: getLineNumber(selection.focusNode),
			column: textOffsetFromNode(
				getLine(selection.focusNode),
				selection.focusNode,
				selection.focusOffset
			)
		};
		// console.log('getRange', anchor, focus);
		if (
			anchor.line < focus.line ||
			(anchor.line === focus.line && anchor.column <= focus.column)
		) {
			return {
				start: anchor,
				end: focus
			};
		} else {
			return {
				start: focus,
				end: anchor
			};
		}
	}

	function onSelect(element, callback) {
		// console.log(element, callback);
		let isSelecting = false;
		let selection = null;

		function handleSelectStart(event) {
			// console.log(event);
			isSelecting = true; //!document.getSelection().isCollapsed;
		}

		function handleMouseUp(event) {
			// console.log(event, isSelecting);
			if (isSelecting && !document.getSelection().isCollapsed) {
				selection = document.getSelection();
				callback({
					text: selection.toString(),
					range: getRange(selection),
					position: { x: event.pageX, y: event.pageY }
				});
				isSelecting = false;
			}
		}

		function handleSelectionChange(event) {
			// console.log('change', isSelecting);
			if (document.getSelection().isCollapsed) {
				if (null !== selection) callback((selection = null));
			}
		}

		element.addEventListener('selectstart', handleSelectStart);
		element.addEventListener('mouseup', handleMouseUp);
		document.addEventListener('selectionchange', handleSelectionChange);

		return function destroy() {
			element.removeEventListener('selectstart', handleSelectStart);
			element.removeEventListener('mouseup', handleMouseUp);
			document.removeEventListener('selectionchange', handleSelectionChange);
		};
	}

	let selection = {};
	let me;
	onMount(() => {
		return onSelect(me, details => {
			console.log(details);
			selection = details;
			// dispatch('selectionchange', details);
		});
	});
</script>

<!-- FIXME: Why do I need this extra div? -->
<div bind:this={me}>
	<slot />
</div>
<CreateAnnotation {selection} />
