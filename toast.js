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

	function Toast(text, options) {
		if(getToastStage() != null) {
			Toast.prototype.toastQueue.push({text: text, options: options});
		} else {
			var options = options == undefined ? {} : options;
			Toast.prototype.options = Toast.prototype.mergeOptions(Toast.prototype.DEFAULT_SETTINGS, options);


			Toast.prototype.show(text);
		}
	};


	// define some Toast constants
	
	/**
	 * The Toast animation speed; how long the Toast takes to move to and from the screen
	 * @type {Number}
	 */
	Toast.prototype.TOAST_ANIMATION_SPEED = 400;

	// Toast classes
	Toast.prototype.CLASS_TOAST_GONE = "iqwerty_toast_gone";
	Toast.prototype.CLASS_TOAST_VISIBLE = "iqwerty_toast_visible";
	Toast.prototype.CLASS_TOAST_ANIMATED = "iqwerty_toast_animated";

	/**
	 * The default Toast settings
	 * @type {Object}
	 */
	Toast.prototype.DEFAULT_SETTINGS = {
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

	Toast.prototype.styleExists = false;

	Toast.prototype.options = {};

	Toast.prototype.toastQueue = [];

	/**
	 * Merge the options
	 * @param  {Object} options The user defined options
	 */
	Toast.prototype.mergeOptions = function(initialOptions, customOptions) {
		var merged = customOptions;
		for(var prop in initialOptions) {
			if(merged.hasOwnProperty(prop)) {
				if(initialOptions[prop] != null && initialOptions[prop].constructor == Object) {
					merged[prop] = Toast.prototype.mergeOptions(initialOptions[prop], merged[prop]);
				}
			} else {
				merged[prop] = initialOptions[prop];
			}
		}


		return merged;
	};

	Toast.prototype.initializeStyles = function() {
		if(Toast.prototype.styleExists) return;

		var style = document.createElement("style");
		style.innerHTML = "." + this.CLASS_TOAST_GONE +
		"{opacity: 0; bottom: -10%;}" +

		"." + this.CLASS_TOAST_VISIBLE +
		"{opacity: 1; bottom: 10%;}" +

		"." + this.CLASS_TOAST_ANIMATED +
		"{transition: opacity " + this.TOAST_ANIMATION_SPEED + "ms, bottom " + this.TOAST_ANIMATION_SPEED + "ms;}";

		document.head.appendChild(style);
		style = null;

		// Notify that the stylesheet exists to avoid creating more
		Toast.prototype.styleExists = true;
	};

	var _toastStage = null;
	function setToastStage(toastStage) {
		_toastStage = toastStage;
	};
	function getToastStage() {
		return _toastStage;
	};

	Toast.prototype.generate = function(text) {
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
			var s = Object.keys(Toast.prototype.options.style);
			s.forEach(function(style) {
				toastStage.style[style] = Toast.prototype.options.style[style];
			});

			toastStage = null;
			s = null;
		}.bind(this))();
	};

	Toast.prototype.show = function(text) {
		this.initializeStyles();
		this.generate(text);
		
		var toastStage = getToastStage();
		toastStage.classList.add(this.CLASS_TOAST_ANIMATED);
		toastStage.classList.add(this.CLASS_TOAST_GONE);
		document.body.insertBefore(toastStage, document.body.firstChild);
		toastStage.offsetHeight;
		toastStage.classList.remove(this.CLASS_TOAST_GONE);
		toastStage.classList.add(this.CLASS_TOAST_VISIBLE);

		var toastStage = null;


		// Hide the Toast after the specified time
		setTimeout(Toast.prototype.hide, Toast.prototype.options.settings.duration);
	};

	Toast.prototype.hide = function() {
		var toastStage = getToastStage();
		toastStage.classList.remove(Toast.prototype.CLASS_TOAST_VISIBLE);
		toastStage.classList.add(Toast.prototype.CLASS_TOAST_GONE);
		toastStage = null;

		// Destroy the Toast element after animations end
		setTimeout(Toast.prototype.destroy, Toast.prototype.TOAST_ANIMATION_SPEED);
	};

	Toast.prototype.destroy = function() {
		var toastStage = getToastStage();
		document.body.removeChild(toastStage);

		toastStage = null;
		setToastStage(null);


		if(Toast.prototype.toastQueue.length != 0) {
			var toast = Toast.prototype.toastQueue.shift();
			Toast(toast.text, toast.options);
			toast = null;
		}
	};

	return {
		Toast: Toast
	};
})();