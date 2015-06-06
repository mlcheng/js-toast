/***********************************************

  "toast.js"

  Created by Michael Cheng on 05/31/2015 22:34
            http://michaelcheng.us/
            michael@michaelcheng.us
            --All Rights Reserved--

***********************************************/

"use strict";

var iqwerty = iqwerty || {};

iqwerty.toast = (function() {

	/**
	 * Toast object
	 * @param {String} text    The text to display in the toast
	 * @param {Object} options Options for the toast. The options object has the following structure
	 *
	 * var opt = {
	 * 		style: {
	 * 			//just css styles in here, like:
	 * 			"background": "pink"
	 * 			//...
	 * 		},
	 * 		settings: {
	 * 			duration: 3000
	 * 		}
	 * }
	 *
	 * The default duration is 3000ms, or 3 seconds. This is how long the toast stays on screen. By default, the toast will show for 3 seconds and then slide away.
	 */
	function Toast(text, options) {
		// define some constant settings
		var TOAST_ANIMATION_SPEED = 400; // the fade in/out speed
		// some toast identifiers
		var CLASS_TOAST_GONE = "iqwerty_toast_gone";
		var CLASS_TOAST_VISIBLE = "iqwerty_toast_visible";
		var CLASS_TOAST_ANIMATED = "iqwerty_toast_animated";


		var options = options == undefined ? {} : options;

		/**
		 * The default settings for the toast, including styles and timing options
		 * @type {Object}
		 */
		var _defaultSettings = {
			style: {
				"background": "rgba(0, 0, 0, .85)",
				"box-shadow": "0 0 10px rgba(0, 0, 0, .8)",
				"z-index": "99999",
				"border-radius": "3px",
				"color": "rgba(255, 255, 255, .9)",
				"padding": "10px 15px",
				"max-width": "40%",
				"word-break": "keep-all",
				"margin": "0 auto",
				"text-align": "center",
				"position": "fixed",
				"left": "0",
				"right": "0"
			},
			settings: {
				duration: 4000
			}
		};

		/**
		 * Apply the settings for the toast. If settings are customized, they are merged here.
		 * @return Returns nothing
		 */
		function setOptions() {
			/**
			 * Merge the options recursively and set them globally.
			 * @param  {Object} initial The initial default settings
			 * @param  {Object} custom  The customized settings object
			 * @return {Object}         The merged settings object
			 */
			options = (function mergeOptions(initial, custom) {
				var merged = custom;
				for(var prop in initial) {
					if(merged.hasOwnProperty(prop)) {
						if(initial[prop] != null && initial[prop].constructor == Object) {
							merged[prop] = mergeOptions(initial[prop], merged[prop]);
						}
					} else {
						merged[prop] = initial[prop];
					}
				}
				return merged;
			})(_defaultSettings, options);
		};

		/**
		 * If the stylesheet doesn't exist in the page, create it. The stylesheet contains animation settings for the toast.
		 * @return  Returns nothing
		 */
		function initializeStyles() {
			if(Toast.prototype.styleExists) return;

			var style = document.createElement("style");
			style.innerHTML = "." + CLASS_TOAST_GONE +
			"{opacity: 0; bottom: -10%;}" +

			"." + CLASS_TOAST_VISIBLE +
			"{opacity: 1; bottom: 10%;}" +

			"." + CLASS_TOAST_ANIMATED +
			"{transition: opacity " + TOAST_ANIMATION_SPEED + "ms, bottom " + TOAST_ANIMATION_SPEED + "ms;}";

			document.head.appendChild(style);
			style = null;

			// Notify that the stylesheet exists to avoid creating more
			Toast.prototype.styleExists = true;
		};

		/**
		 * The Toast stage. This is the HTML element of the toast.
		 * @type {Object}
		 */
		var _toastStage = null;
		function getToastStage() {
			return _toastStage;
		};
		function setToastStage(toastStage) {
			_toastStage = toastStage;
		};

		/**
		 * Generate the toast element and apply the styles from the settings.
		 * @return  Returns nothing
		 */
		function generate() {
			var toastStage = document.createElement("div");
			var textStage = document.createTextNode(text);

			toastStage.appendChild(textStage);

			setToastStage(toastStage);
			toastStage = null;
			textStage = null;


			/**
			 * Stylize the toast
			 * @return  Returns nothing
			 */
			(function stylize() {
				var toastStage = getToastStage();
				var s = Object.keys(options.style);
				s.forEach(function(value, index, array) {
					toastStage.style[value] = options.style[value];
				});

				toastStage = null;
				s = null;
			})();
		}

		/**
		 * Show the Toast. Classes are modified to allow CSS3 animations
		 * @return  Returns nothing
		 */
		(function show() {
			setOptions();
			initializeStyles();
			generate();

			var toastStage = getToastStage();
			toastStage.classList.add(CLASS_TOAST_ANIMATED);
			toastStage.classList.add(CLASS_TOAST_GONE);
			document.body.insertBefore(toastStage, document.body.firstChild);
			toastStage.offsetHeight;
			toastStage.classList.remove(CLASS_TOAST_GONE);
			toastStage.classList.add(CLASS_TOAST_VISIBLE);

			var toastStage = null;


			// Hide the Toast after the specified time
			setTimeout(hide, options.settings.duration);
		})();

		/**
		 * Animate the Toast away. Slide/fade out.
		 * @return  Returns nothing
		 */
		function hide() {
			var toastStage = getToastStage();
			toastStage.classList.remove(CLASS_TOAST_VISIBLE);
			toastStage.classList.add(CLASS_TOAST_GONE);
			toastStage = null;

			// Destroy the Toast element after animations end
			setTimeout(destroy, TOAST_ANIMATION_SPEED);
		};

		/**
		 * Remove the Toast from the DOM and perform some cleanup
		 * @return  Returns nothing
		 */
		function destroy() {
			var toastStage = getToastStage();
			document.body.removeChild(toastStage);

			toastStage = null;
			setToastStage(null);
		};
	};

	/**
	 * Specifies whether or not the inline stylesheet for CSS3 animations exists. This is used to avoid creating unnecessary multiple stylesheets in the page
	 * @type {Boolean}
	 */
	Toast.prototype.styleExists = false;

	return {
		Toast: function(text, options) {
			Toast(text, options);
		}
	}
})();