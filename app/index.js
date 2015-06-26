'use strict';
var superb = require('superb');
var normalizeUrl = require('normalize-url');
var humanizeUrl = require('humanize-url');
var yeoman = require('yeoman-generator');
var _s = require('underscore.string');

module.exports = yeoman.generators.Base.extend({
	init: function () {
		var cb = this.async();

		this.prompt([{
			name: 'appName',
			message: 'What do you want to name your app?',
			default: this.appname.replace(/\s/g, '-'),
			filter: function (val) {
				return _s.slugify(val);
			}
		}, {
			name: 'githubUsername',
			message: 'What is your GitHub username?',
			store: true,
			validate: function (val) {
				return val.length > 0 ? true : 'You have to provide a username';
			}
		}, {
			name: 'website',
			message: 'What is the URL of your website?',
			store: true,
			validate: function (val) {
				return val.length > 0 ? true : 'You have to provide a website URL';
			},
			filter: function (val) {
				return normalizeUrl(val);
			}
		}], function (props) {
			var tmpl = {
				appName: props.appName,
				classifiedAppName: _s.classify(props.appName),
				githubUsername: props.githubUsername,
				name: this.user.git.name(),
				email: this.user.git.email(),
				website: props.website,
				humanizedWebsite: humanizeUrl(props.website),
				superb: superb()
			};

			this.fs.copy(this.templatePath('editorconfig'), this.destinationPath('.editorconfig'));
			this.fs.copy(this.templatePath('gitattributes'), this.destinationPath('.gitattributes'));
			this.fs.copy(this.templatePath('gitignore'), this.destinationPath('.gitignore'));
			this.fs.copy(this.templatePath('jshintrc'), this.destinationPath('.jshintrc'));
			this.fs.copy(this.templatePath('index.js'), this.destinationPath('index.js'));
			this.fs.copy(this.templatePath('index.html'), this.destinationPath('index.html'));
			this.fs.copy(this.templatePath('index.css'), this.destinationPath('index.css'));
			this.fs.copyTpl(this.templatePath('license'), this.destinationPath('license'), tmpl);
			// needed so npm doesn't try to use it and fail
			this.fs.copyTpl(this.templatePath('_package.json'), this.destinationPath('package.json'), tmpl);
			this.fs.copyTpl(this.templatePath('readme.md'), this.destinationPath('readme.md'), tmpl);

			cb();
		}.bind(this));
	},
	install: function () {
		this.installDependencies({bower: false});
	}
});
