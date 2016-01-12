# js-toast

This is a small JavaScript library that produces a toast message. Toasts are small, unobtrusive notifictions to alert the user of something. This toast slides in from the bottom of the page, stays for a specified amount of time, and then slides away. This is much friendlier than using the `alert()` function in JavaScript.

A demo is available on my [playground](https://www.michaelcheng.us/playground/lib-js/toast/).

## Usage
Usage is extremely simple, but advanced customization can also be done. For starters, a toast can be created when a button is clicked

```html
<input type="button" value="Toast!" onclick="showAToast();">
```

Where the `showAToast()` function creates and shows a toast

```javascript
function showAToast() {
	iqwerty.toast.Toast('Hello!');
}
```

This shows a toast with default settings

## Advanced customization
The toast is easy to use, and it looks great by default. However, it can also be customized to your liking.

### Styles
The toast style can be customized by specifying a style in the options parameter

```javascript
var options = {
	style: {
		main: {
			background: "pink",
			color: "black"
		}
	}
};

iqwerty.toast.Toast('Hello!', options);
```

The styles are in CSS-ish syntax

### Duration
The duration of the toast (the time that the toast stays on the screen) is set to 4000ms (4s) by default, but you can change this if you wish

```javascript
var options = {
	settings: {
		duration: 5000
	}
};

iqwerty.toast.Toast('Hello!', options);
```

Have fun!
