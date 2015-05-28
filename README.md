# js-toast

This is a small JavaScript library that produces a toast message. Toasts are small, unobtrusive notifictions to alert the user of something. This toast slides in from the bottom of the page, stays for a specified amount of time, and then slides away. This is much friendlier than using the `alert()` function in JavaScript.

A demo is available on my [playground](http://www.michaelcheng.us/playground/lib-js/toast/).

## Usage
Usage is extremely simple, but advanced customization can also be done. For starters, just create a toast

	var toast = new iqwerty.toast.Toast();

Then, set the text for the toast

	toast.setText("This is a toast!");

Next, stylize the toast with default styles

	toast.stylize();

Finally, show the toast

	toast.show();

I really like method chaining, so these methods can be chained like `toast.setText(...).stylize().show();` if you wish.

## Advanced customization

The toast is easy to use, and it looks great by default. However, it can also be customized to your liking.

### Styles
The toast style can be customized by specifying a style object inside `stylize()`

	toast.stylize({
		background: "pink",
		color: "#ff00ff"
	});

### Duration
The duration of the toast (the time that the toast stays on the screen) is set to 3000ms (3s) by default, but you can change this if you wish

	toast.setDuration(5000); // 5 seconds

Make sure to set the duration ***before*** you `show()` the toast!
