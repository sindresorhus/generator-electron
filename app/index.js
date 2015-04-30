'use strict';
var path = require('path');
var fs = require('fs');
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
			this.appName = props.appName;
			this.classifiedAppName = _s.classify(props.appName);
			this.githubUsername = props.githubUsername;
			this.name = this.user.git.name();
			this.email = this.user.git.email();
			this.website = props.website;
			this.humanizedWebsite = humanizeUrl(this.website);
			this.superb = superb();

			this.template('editorconfig', '.editorconfig');
			this.template('gitattributes', '.gitattributes');
			this.template('gitignore', '.gitignore');
			this.template('jshintrc', '.jshintrc');
			this.template('index.js');
			this.template('index.html');
			this.template('index.css');
			this.template('license');
			// needed so npm doesn't try to use it and fail
			this.template('_package.json', 'package.json');
			this.template('readme.md');

			cb();
		}.bind(this));
	},
	install: function () {
		this.installDependencies({bower: false});
	}
});
