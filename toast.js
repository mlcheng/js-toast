/***********************************************

  "toast.js"

  Created by Michael Cheng on 05/31/2015 22:34
            http://michaelcheng.us/
            michael@michaelcheng.us
            --All Rights Reserved--

***********************************************/

'use strict';

/**
 * Merge the DEFAULT_SETTINGS with the user defined options if specified
 * @param {Object} options The user defined options
 */
export function mergeOptions(initialOptions, customOptions) {
	const merged = customOptions;
	for(const prop in initialOptions) {
		if(merged.hasOwnProperty(prop)) {
			if(initialOptions[prop] !== null && initialOptions[prop].constructor === Object) {
				merged[prop] = mergeOptions(initialOptions[prop], merged[prop]);
			}
		} else {
			merged[prop] = initialOptions[prop];
		}
	}
	return merged;
}

/**
 * Stylize the Toast.
 * @param {Element} element The HTML element to stylize
 * @param {Object}  styles  An object containing the style to apply
 */
export function stylize(element, styles) {
	Object.keys(styles).forEach((style) => {
		element.style[style] = styles[style];
	});
}

export const toast = (() => {
	/**
	 * The Toast animation speed; how long the Toast takes to move to and from the screen
	 * @type {number}
	 */
	const TOAST_ANIMATION_SPEED = 400;

	const Transitions = {
		SHOW: {
			'-webkit-transition': 'opacity ' + TOAST_ANIMATION_SPEED + 'ms, -webkit-transform ' + TOAST_ANIMATION_SPEED + 'ms',
			'transition': 'opacity ' + TOAST_ANIMATION_SPEED + 'ms, transform ' + TOAST_ANIMATION_SPEED + 'ms',
			'opacity': '1',
			'-webkit-transform': 'translateY(-100%) translateZ(0)',
			'transform': 'translateY(-100%) translateZ(0)'
		},

		HIDE: {
			'opacity': '0',
			'-webkit-transform': 'translateY(150%) translateZ(0)',
			'transform': 'translateY(150%) translateZ(0)'
		}
	};

	/**
	 * The default Toast settings
	 * @type {Object}
	 */
	const DEFAULT_SETTINGS = {
		style: {
			main: {
				'background': 'rgba(0, 0, 0, .85)',
				'box-shadow': '0 0 10px rgba(0, 0, 0, .8)',

				'border-radius': '3px',

				'z-index': '99999',

				'color': 'rgba(255, 255, 255, .9)',
				'font-family': 'sans-serif',

				'padding': '10px 15px',
				'max-width': '60%',
				'width': '100%',
				'word-break': 'keep-all',
				'margin': '0 auto',
				'text-align': 'center',

				'position': 'fixed',
				'left': '0',
				'right': '0',
				'bottom': '0',

				'-webkit-transform': 'translateY(150%) translateZ(0)',
				'transform': 'translateY(150%) translateZ(0)',
				'-webkit-filter': 'blur(0)',
				'opacity': '0'
			},
		},

		settings: {
			duration: 4000,
		},
	};

	/**
	 * The queue of Toasts waiting to be shown
	 * @type {Array}
	 */
	const toastQueue = [];

	/**
	 * The toastStage. This is the HTML element in which the toast resides
	 * Getter and setter methods are available privately
	 * @type {HTMLElement}
	 */
	let toastStage;

	/**
	 * The Timeout object for animations.
	 * This should be shared among the Toasts, because timeouts may be cancelled e.g. on explicit call of hide()
	 * @type {Object}
	 */
	let timeout;

	/**
	 * The main Toast object
	 * @param {string} text The text to put inside the Toast
	 * @param {Object} options Optional; the Toast options. See Toast.prototype.DEFAULT_SETTINGS for more information
	 * @param {Object} transitions Optional; the Transitions object. This should not be used unless you know what you're doing
	 * @param {Object} __internalDefaultSettings For internal use only. Used for Snackbar.
	 */
	function toast(text, options, transitions) {
		const _transitions = transitions || Transitions;

		if(getToastStage() !== undefined) {
			// If there is already a Toast being shown, put this Toast in the queue to show later
			toastQueue.push({ text, options, transitions: _transitions });
		} else {
			let _options = options || {};
			_options = mergeOptions(DEFAULT_SETTINGS, _options);

			showToast(text, _options, _transitions);
		}

		return {
			hide: () => hideToast(_transitions),
		};
	}

	/**
	 * Show the Toast
	 * @param {string} text The text to show inside the Toast
	 * @param {Object} options The object containing the options for the Toast
	 */
	function showToast(text, options, transitions) {
		generateToast(text, options.style.main);

		const toastStage = getToastStage();
		document.body.insertBefore(toastStage, document.body.firstChild);

		// This is a hack to get animations started. Apparently without explicitly redrawing, it'll just attach the class and no animations would be done.
		toastStage.offsetHeight;

		stylize(toastStage, transitions.SHOW);

		// Hide the Toast after the specified time
		clearTimeout(timeout);
		if(options.settings.duration !== 0) {
			timeout = setTimeout(() => hideToast(transitions), options.settings.duration);
		}
	}

	/**
	 * Hide the Toast that's currently shown.
	 */
	function hideToast(transitions) {
		const toastStage = getToastStage();
		stylize(toastStage, transitions.HIDE);

		// Destroy the Toast element after animations end.
		clearTimeout(timeout);
		toastStage.addEventListener('transitionend', destroyToast, { once: true });
	}

	/**
	 * Generate the Toast with the specified text.
	 * @param {string|HTMLElement} text The text to show inside the Toast, can be an HTML element or plain text
	 * @param {Object} style The style to set for the Toast
	 */
	function generateToast(text, style) {
		var toastStage = document.createElement('div');

		// If the text is a String, create a textNode for appending.
		if(typeof text === 'string') {
			text = document.createTextNode(text);
		}
		toastStage.appendChild(text);

		setToastStage(toastStage);
		stylize(getToastStage(), style);
	}

	/**
	 * Clean up after the Toast slides away. Namely, removing the Toast from the DOM.
	 * After the Toast is cleaned up, display the next Toast in the queue if any exists.
	 */
	function destroyToast() {
		const toastStage = getToastStage();

		document.body.removeChild(toastStage);
		setToastStage(undefined);

		if(toastQueue.length > 0) {
			// Show the rest of the Toasts in the queue if they exist.
			const newToast = toastQueue.shift();
			toast(newToast.text, newToast.options, newToast.transitions);
		}
	}

	function getToastStage() {
		return toastStage;
	}

	function setToastStage(newToastStage) {
		toastStage = newToastStage;
	}

	return { toast };
})();