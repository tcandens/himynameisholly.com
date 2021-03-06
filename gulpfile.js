"use strict";

var gulp = require("gulp");
// Loads the plugins without having to list all of them, but you need
// to call them as $.pluginname
var $ = require("gulp-load-plugins")();
// "del" is used to clean out directories and such
var del = require("del");
// BrowserSync isn"t a gulp package, and needs to be loaded manually
var browserSync = require("browser-sync");
// merge is used to merge the output from two different streams into the same stream
var merge = require("merge-stream");
// Need a command for reloading webpages using BrowserSync
var reload = browserSync.reload;
// And define a variable that BrowserSync uses in it"s function
var bs;
var sprity = require('sprity');
var sourcemaps = require('gulp-sourcemaps');

// Deletes the directory that is used to serve the site during development
gulp.task("clean:dev", del.bind(null, ["serve"]));

// Deletes the directory that the optimized site is output to
gulp.task("clean:prod", del.bind(null, ["site"]));

// Runs the build command for Jekyll to compile the site locally
// This will build the site with the production settings
gulp.task("jekyll:dev", $.shell.task("jekyll build"));
gulp.task("jekyll-rebuild", ["jekyll:dev"], function () {
  reload;
});

// Almost identical to the above task, but instead we load in the build configuration
// that overwrites some of the settings in the regular configuration so that you
// don"t end up publishing your drafts or future posts
gulp.task("jekyll:prod", $.shell.task("jekyll build --config _config.yml,_config.build.yml"));

// Compiles the SASS files and moves them into the "assets/stylesheets" directory
gulp.task("styles", function () {
  // Looks at the style.scss file for what to include and creates a style.css file
  return gulp.src("src/assets/scss/style.scss")
    .pipe(sourcemaps.init())
    .pipe($.sass())
    // AutoPrefix your CSS so it works between browsers
    .pipe($.autoprefixer("last 1 version", { cascade: true }))
    // Directory your CSS file goes to
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest("serve/assets/stylesheets/"))
    .pipe(gulp.dest("src/assets/stylesheets/"))
    // Outputs the size of the CSS file
    .pipe($.size({title: "styles"}))
    // Injects the CSS changes to your browser since Jekyll doesn"t rebuild the CSS
    .pipe(reload({stream: true}));
});

// Optimizes the images that exists
gulp.task("images", function () {
  return gulp.src("src/assets/images/**")
    .pipe($.changed("site/assets/images"))
    .pipe($.imagemin({
      optimizationLevel: 8,
      // Lossless conversion to progressive JPGs
      progressive: true,
      // Interlace GIFs for progressive rendering
      interlaced: true,
      // Optimize SVGs
      multipass: true
    }))
    .pipe(gulp.dest("site/assets/images"))
    .pipe($.size({title: "images"}));
});

gulp.task('sprites:png', function() {
  return sprity.src({
    src: './src/assets/images/projects/**/icon.png',
    style: '_sprite.scss',
    out: './src/assets/images/icons/',
    opacity: 100,
    prefix: 'sprite',
    cssPath: '../images/'
  })
    .pipe($.if('*.png', gulp.dest('./src/assets/images/'), gulp.dest('./src/assets/scss/')))
});
gulp.task('sprites:svg', function() {
  return gulp.src('./src/assets/images/icons/*.svg')
    .pipe($.imagemin({
      multipass: true
    }))
    .pipe($.svgstore())
    .pipe(gulp.dest('./src/_includes'));
});

// Copy over fonts to the "site" directory
gulp.task("fonts", function () {
  return gulp.src("src/assets/fonts/**")
    .pipe(gulp.dest("site/assets/fonts"))
    .pipe($.size({ title: "fonts" }));
});

// Copy xml and txt files to the "site" directory
gulp.task("copy", function () {
  return gulp.src(["serve/*.txt", "serve/*.xml"])
    .pipe(gulp.dest("site"))
    .pipe($.size({ title: "xml & txt" }))
});
gulp.task("htaccess", function() {
  return gulp.src("serve/.htaccess")
    .pipe(gulp.dest("site"))
});

gulp.task("concat", function() {
  return gulp.src("serve/assets/javascript/**/*.js")
    .pipe(gulp.dest("site/assets/javascript/"));
});

gulp.task("minify", function() {
  return gulp.src("serve/assets/stylesheets/**.css")
    .pipe(gulp.dest('site/assets/stylesheets/'));
});

gulp.task("html", function() {
  return gulp.src("serve/**/*.html")
    .pipe($.usemin())
    .pipe(gulp.dest("site/"));
});


// Task to upload your site via Rsync to your server
gulp.task("deploy", [ 'publish' ], function () {
  // Load in the variables needed for our Rsync synchronization
  var secret = require("./rsync-credentials.json");

  return gulp.src("site/**")
    .pipe($.rsync({
      // This uploads the contenst of "root", instead of the folder
      root: "site",
      // Find your username, hostname and destination from your rsync-credentials.json
      hostname: secret.hostname,
      username: secret.username,
      password: secret.password,
      destination: secret.destination,
      // Incremental uploading, adds a small delay but minimizes the amount of files transferred
      incremental: true,
      // Shows the progress on your files while uploading
      progress: true
  }));
});

// Run JS Lint against your JS
gulp.task("jslint", function () {
  gulp.src("./serve/assets/javascript/*.js")
    // Checks your JS code quality against your .jshintrc file
    .pipe($.jshint(".jshintrc"))
    .pipe($.jshint.reporter());
});

// Runs "jekyll doctor" on your site to check for errors with your configuration
// and will check for URL errors a well
gulp.task("doctor", $.shell.task("jekyll doctor"));

// BrowserSync will serve our site on a local server for us and other devices to use
// It will also autoreload across all devices as well as keep the viewport synchronized
// between them.
gulp.task("serve:dev", [ "build" ], function () {
  bs = browserSync({
    notify: true,
    // tunnel: "",
    server: {
      baseDir: "serve"
    }
  });
});

// These tasks will look for files that change while serving and will auto-regenerate or
// reload the website accordingly. Update or add other files you need to be watched.
gulp.task("watch", function () {
  gulp.watch(["src/**/*.md", "src/**/*.html", "src/**/*.xml", "src/**/*.txt", "src/**/*.js"], ["jekyll-rebuild"]);
  gulp.watch(["serve/assets/stylesheets/*.css"], reload);
  gulp.watch(["src/assets/scss/**/*.scss"], ["styles"]);
});

// Serve the site after optimizations to see that everything looks fine
gulp.task("serve:prod", function () {
  bs = browserSync({
    notify: false,
    // tunnel: true,
    server: {
      baseDir: "site"
    }
  });
});

// Default task, run when just writing "gulp" in the terminal
gulp.task("default", ["serve:dev", "watch"]);

// Checks your CSS, JS and Jekyll for errors
gulp.task("check", ["jslint", "doctor"], function () {
  // Better hope nothing is wrong.
});

// Builds the site but doesn"t serve it to you
gulp.task("build", ["jekyll:prod","sprites:svg", "sprites:png", "styles"], function () {});

// Builds your site with the "build" command and then runs all the optimizations on
// it and outputs it to "./site"
gulp.task("publish", ["build"], function () {
  gulp.start("html", "minify", "copy", "htaccess", "images", "fonts");
});
