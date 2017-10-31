// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular/cli'],
    plugins: [
      require('karma-jasmine'),
      require('karma-phantomjs-launcher' ),
      require('karma-junit-reporter'),
      require('@angular/cli/plugins/karma')
    ],
    junitReporter : {
      // .../beetle-studio/target/karma-reports/*.xml
      outputDir : '../../target/karma-reports/'
    },
    angularCli: {
      environment: 'dev'
    },
    reporters: ['junit', 'progress'],
    autoWatch: false,
    browsers: [ 'PhantomJS' ],
    singleRun: true
  });
};
