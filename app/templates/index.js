'use strict';
const app = require('app');
const BrowserWindow = require('browser-window');

// report crashes to the Electron project
require('crash-reporter').start();

function createMainWindow () {
	let browserWin = new BrowserWindow({
		width: 600,
		height: 400,
		resizable: false
	});

	browserWin.loadUrl(`file://${__dirname}/index.html`);
	browserWin.on('closed', onClosed);

	return browserWin;
}

function onClosed () {
	// deref the window
	// for multiple windows store them in an array
	mainWindow = null;
}

// prevent window being GC'd
let mainWindow = null;

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate-with-no-open-windows', function () {
	if (!mainWindow) {
		mainWindow = createMainWindow();
	}
});

app.on('ready', function () {
	mainWindow = createMainWindow();
});
