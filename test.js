'use strict';
var path = require('path');
var helpers = require('yeoman-generator').test;
var assert = require('yeoman-assert');

describe('generator', function () {
	beforeEach(function (cb) {
		var deps = ['../app'];

		helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
			if (err) {
				cb(err);
				return;
			}

			this.generator = helpers.createGenerator('electron:app', deps, null, {skipInstall: true});
			cb();
		}.bind(this));
	});

	it('generates expected files', function (cb) {
		var expected = [
			'.editorconfig',
			'.gitattributes',
			'.gitignore',
			'index.js',
			'index.html',
			'index.css',
			'license',
			'package.json',
			'readme.md'
		];

		helpers.mockPrompt(this.generator, {
			appName: 'test',
			githubUsername: 'test',
			website: 'test.com'
		});

		this.generator.run(function () {
			assert.file(expected);
			cb();
		});
	});
});
