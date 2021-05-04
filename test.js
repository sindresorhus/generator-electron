import {promisify} from 'util';
import path from 'path';
import {serial as test} from 'ava';
import helpers from 'yeoman-test';
import assert from 'yeoman-assert';

let generator;

test.beforeEach(async () => {
	await promisify(helpers.testDirectory)(path.join(__dirname, 'temp'));
	generator = helpers.createGenerator('electron:app', ['../app'], undefined, {skipInstall: true});
});

test('generates expected files', async () => {
	helpers.mockPrompt(generator, {
		appName: 'test',
		githubUsername: 'test',
		website: 'test.com'
	});

	await generator.run();

	assert.file([
		'.editorconfig',
		'.gitattributes',
		'.gitignore',
		'index.js',
		'index.html',
		'index.css',
		'license',
		'package.json',
		'readme.md'
	]);
});
