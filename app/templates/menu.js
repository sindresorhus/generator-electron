'use strict';
const path = require('path');
const {app, Menu, shell} = require('electron');
const {
	is,
	appMenu,
	aboutMenuItem,
	openUrlMenuItem,
	openNewGitHubIssue,
	debugInfo,
} = require('electron-util');
const config = require('./config.js');

const showPreferences = () => {
	// Show the app's preferences here
};

const helpSubmenu = [
	openUrlMenuItem({
		label: 'Website',
		url: '<%= repoUrl %>',
	}),
	openUrlMenuItem({
		label: 'Source Code',
		url: '<%= repoUrl %>',
	}),
	{
		label: 'Report an Issue…',
		click() {
			const body = `
<!-- Please succinctly describe your issue and steps to reproduce it. -->


---

${debugInfo()}`;

			openNewGitHubIssue({
				user: '<%= githubUsername %>',
				repo: '<%= slugifiedAppName %>',
				body,
			});
		},
	},
];

if (!is.macos) {
	helpSubmenu.push(
		{
			type: 'separator',
		},
		aboutMenuItem({
			icon: path.join(__dirname, 'static', 'icon.png'),
			text: 'Created by <%= name %>',
		}),
	);
}

const debugSubmenu = [
	{
		label: 'Show Settings',
		click() {
			config.openInEditor();
		},
	},
	{
		label: 'Show App Data',
		click() {
			shell.openItem(app.getPath('userData'));
		},
	},
	{
		type: 'separator',
	},
	{
		label: 'Delete Settings',
		click() {
			config.clear();
			app.relaunch();
			app.quit();
		},
	},
	{
		label: 'Delete App Data',
		click() {
			shell.moveItemToTrash(app.getPath('userData'));
			app.relaunch();
			app.quit();
		},
	},
];

const macosTemplate = [
	appMenu([
		{
			label: 'Preferences…',
			accelerator: 'Command+,',
			click() {
				showPreferences();
			},
		},
	]),
	{
		role: 'fileMenu',
		submenu: [
			{
				label: 'Custom',
			},
			{
				type: 'separator',
			},
			{
				role: 'close',
			},
		],
	},
	{
		role: 'editMenu',
	},
	{
		role: 'viewMenu',
	},
	{
		role: 'windowMenu',
	},
	{
		role: 'help',
		submenu: helpSubmenu,
	},
];

// Linux and Windows
const otherTemplate = [
	{
		role: 'fileMenu',
		submenu: [
			{
				label: 'Custom',
			},
			{
				type: 'separator',
			},
			{
				label: 'Settings',
				accelerator: 'Control+,',
				click() {
					showPreferences();
				},
			},
			{
				type: 'separator',
			},
			{
				role: 'quit',
			},
		],
	},
	{
		role: 'editMenu',
	},
	{
		role: 'viewMenu',
	},
	{
		role: 'help',
		submenu: helpSubmenu,
	},
];

const template = is.macos ? macosTemplate : otherTemplate;

if (is.development) {
	template.push({
		label: 'Debug',
		submenu: debugSubmenu,
	});
}

module.exports = Menu.buildFromTemplate(template);
