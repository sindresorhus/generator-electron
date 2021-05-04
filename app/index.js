'use strict';
const superb = require('superb');
const normalizeUrl = require('normalize-url');
const humanizeUrl = require('humanize-url');
const Generator = require('yeoman-generator');
const _s = require('underscore.string');

module.exports = class extends Generator {
	async init() {
		const props = await this.prompt([{
			name: 'appName',
			message: 'What do you want to name your app?',
			default: this.appname
		}, {
			name: 'githubUsername',
			message: 'What is your GitHub username?',
			store: true,
			validate: x => x.length > 0 ? true : 'You have to provide a username'
		}, {
			name: 'website',
			message: 'What is the URL of your website?',
			store: true,
			validate: x => x.length > 0 ? true : 'You have to provide a website URL',
			filter: x => normalizeUrl(x)
		}]);

		const template = {
			appName: props.appName,
			slugifiedAppName: _s.slugify(props.appName),
			classifiedAppName: _s.classify(props.appName),
			githubUsername: props.githubUsername,
			repoUrl: `https://github.com/${props.githubUsername}/${props.slugifiedAppName}`,
			name: this.user.git.name(),
			email: this.user.git.email(),
			website: props.website,
			humanizedWebsite: humanizeUrl(props.website),
			superb: superb.random()
		};

		const moveDest = (from, to) => {
			this.fs.move(this.destinationPath(from), this.destinationPath(to));
		};

		const copy = (from, to) => {
			this.fs.copy(this.templatePath(from), this.destinationPath(to || from));
		};

		this.fs.copyTpl(`${this.templatePath()}/*`, this.destinationPath(), template);
		copy('build');
		copy('static');
		copy('github/workflows/main.yml', '.github/workflows/main.yml');
		moveDest('editorconfig', '.editorconfig');
		moveDest('gitattributes', '.gitattributes');
		moveDest('gitignore', '.gitignore');
		moveDest('_package.json', 'package.json');
	}

	install() {
		this.installDependencies({bower: false});
	}
};
