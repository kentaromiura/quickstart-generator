'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');

function substitute(string, obj){
    return string.replace(/\{\[(.+?)\]\}/g, function(a,b){
        return obj[b] || ''
    })
}

var QuickstartGeneratorGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = require('../package.json');
    var me = this
    this.on('end', function () {
      if (!this.options['skip-install']) {
        this.installDependencies({
          bower: false,
          npm: true,
          skipInstall: false,
          callback: function () {
            console.log('Running make');
            var temp = me.spawnCommand('make')

            if(temp.stdout) temp.stdout.pipe(process.stdout);
            temp = me.spawnCommand('./node_modules/.bin/polpetta', ['0.0.0.0:1337'])
            if(temp.stdout) {
              temp.stdout.pipe(process.stdout);
            } else {
              console.log('Running polpetta on 1337')
            }
          }
        });

      }
    });
  },

  askFor: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay('Welcome to the marvelous QuickstartGenerator generator!'));

    var prompts = [{
      type: 'input',
      name: 'name',
      message: 'What is the project name?',
      default: 'name'
    }];

    this.prompt(prompts, function (props) {
      this.name = props.name

      done();
    }.bind(this));
  },

  app: function () {
    //this.mkdir('app');
    //this.mkdir('app/templates');
    var me = this
    this.copy('_package.json', 'package.json', function(body, source, destination, options){
      return substitute(body, me)
    });
    this.copy('_Makefile', 'Makefile')
    this.copy('_index.html', 'index.html')
    this.copy('_index.js', 'index.js')
    this.copy('_test.js', 'test.js')

    //this.copy('_bower.json', 'bower.json');
  },

  projectfiles: function () {
    this.copy('editorconfig', '.editorconfig');
    this.copy('jshintrc', '.jshintrc');
  }
});

module.exports = QuickstartGeneratorGenerator;
