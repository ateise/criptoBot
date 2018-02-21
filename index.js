// 'use strict';
const electron = require('electron');
const path = require('path');
const url = require('url');

const {app, BrowserWindow, Menu} = electron;

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

// prevent window being garbage collected
let mainWindow;

function onClosed() {
	// dereference the window
	// for multiple windows store them in an array
	mainWindow = null;

	app.quit();
}

function createMainWindow() {

	const win = new BrowserWindow({
		width: 600,
		height: 400
	});

	win.loadURL(`file://${__dirname}/index.html`);
	win.on('closed', onClosed);

	// Build menu from template
	const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
	// Insert Menu
	Menu.setApplicationMenu(mainMenu);

	return win;
}

app.on('ready', function(){});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (!mainWindow) {
		mainWindow = createMainWindow();
	}
});


function createAddWindow() {
	// Create new window
	addWindow  = new BrowserWindow({
		width: 400,
		height: 300,
		title:'Add Configuration'
	});
	// Load html into window
	addWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'addConfiguration.html'),
		protocol:'file',
		slashes:true
	}));
}

const mainMenuTemplate = [
	{
		label:'CryptoBot',
		submenu:[
			{
				label: 'Add Configuration',
				click(){
					createAddWindow();
				}
			},
			{
				label: 'Show Configuration'
			},
			{
				label:'Quit',
				accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
				click(){
					app.quit();
				}
			}
		]
	}
];

// If on mac, add an empty object at the beginning
if (process.platform == 'darwin') {
	mainMenuTemplate.unshift({});
}

// Add devtools
if (process.env.NODE_ENV !== 'production') {
	mainMenuTemplate.push({
		label: 'DevTools',
		submenu: [
			{
				label: 'Toggle Devtools',
				click(item, focusedWindow){
					focusedWindow.toggleDevTools();
				}
			},
			{
				role: 'reload'
			}
		]
	});
}
