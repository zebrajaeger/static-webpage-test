// ---------- Dictionary ----------
// g: gulp
// p: plugins
// c: config = project-config.json

// ---------- gulp ----------
var g = require('gulp');

// ---------- plugins ---------- 
p = require('gulp-load-plugins')();
p.path = require('path');
p.bs = require('browser-sync').create();
p.runSequence = require('run-sequence');

p.hbhelpers = {
    helpers: require('handlebars-helpers'),
    layouts: require('handlebars-layouts'),
    repeat: require('handlebars-helper-repeat')
};
console.log("HELPERS", p.hbhelpers)

// ---------- config ---------- 
var c = require('./project-config.json');
p.m = p.mode({
    modes: ["prod", "dev"],
    default: "dev",
    verbose: false
});
p.dev = p.m.dev;
p.prod = p.m.prod;

// ---------- helpers ----------
var resolveAll = function (prefix, parts) {
    var result = [];

    if (parts.forEach) {
        parts.forEach(function (part) {
            result.push(p.path.resolve(prefix, part));
        });
    } else {
        result.push(p.path.resolve(prefix, parts));
    }
    return result;
};

var resolveSingle = function (prefix, part) {
    if (part.forEach) {
        throw 'No iterables are allowed as parts.'
    } else {
        return p.path.resolve(prefix, part);
    }
};

// ---------- tasks ---------- 
g.task('clean', function () {
    return g
        .src(p.path.resolve(c.target), {read: false})
        .pipe(p.plumber())
        .pipe(p.clean());
});

g.task('assets', function () {
    return g
        .src(resolveAll(c.src, c.assets.src))
        .pipe(g.dest(resolveSingle(c.target, c.assets.target)))
        .pipe(p.fn(function (file, enc) {
            console.log("assets: " + file.path);
        }))
});

g.task('html', function () {
    var hb = p
        .hb({
            cwd: p.path.resolve(),
            debug: c.html.debug | 0
        })
        .data(resolveAll(c.src, c.html.data))
        .data({timestamp: Date.now()})
        .helpers(resolveAll(c.src, c.html.helpers))
        .helpers(p.hbhelpers)
        .partials(resolveAll(c.src, c.html.partials));

    return g
        .src(resolveAll(c.src, c.html.src))
        .pipe(p.plumber())

        .pipe(p.frontMatter({property: 'data.page'}))
        .pipe(hb)
        .pipe(p.htmlBeautify())

        .pipe(p.extname('.html'))
        .pipe(g.dest(resolveSingle(c.target, c.html.target)))
        .pipe(p.fn(function (file, enc) {
            console.log("html: " + file.path);
        }))
});

g.task('css-app', function () {
    return g
        .src(p.path.resolve(c.src, c.css.app.src))
        .pipe(p.plumber())

        .pipe(p.rename('app.css'))
        .pipe(p.sassGlob())
        .pipe(p.sass().on('error', p.sass.logError))
        .pipe(p.cssbeautify())

        .pipe(g.dest(p.path.resolve(c.target, c.css.app.target)))
        .pipe(p.bs.stream())
        .pipe(p.fn(function (file, enc) {
            console.log("css-app: " + file.path);
        }))

        .pipe(p.prod(p.sourcemaps.init()))
        .pipe(p.prod(p.cleanCss({compatibility: 'ie8'})))
        .pipe(p.prod(p.rename('app.min.css')))
        .pipe(p.prod(p.sourcemaps.write('.')))
        .pipe(p.prod(g.dest(p.path.resolve(c.target, c.css.app.target))))
        .pipe(p.prod(p.bs.stream()))
        .pipe(p.prod(p.fn(function (file, enc) {
            console.log("css-app: " + file.path);
        })));
});

g.task('css-vendor', function () {
    return g
        .src(p.path.resolve(c.src, c.css.vendor.src))
        .pipe(p.plumber())


        .pipe(p.rename('vendor.css'))
        .pipe(p.sassGlob())
        .pipe(p.sass().on('error', p.sass.logError))
        .pipe(p.cssbeautify())

        .pipe(g.dest(p.path.resolve(c.target, c.css.vendor.target)))
        .pipe(p.bs.stream())
        .pipe(p.fn(function (file, enc) {
            console.log("css-vendor: " + file.path);
        }))

        .pipe(p.prod(p.sourcemaps.init()))
        .pipe(p.prod(p.cleanCss({compatibility: 'ie8'})))
        .pipe(p.prod(p.rename('vendor.min.css')))
        .pipe(p.prod(p.sourcemaps.write('.')))
        .pipe(p.prod(g.dest(p.path.resolve(c.target, c.css.app.target))))
        .pipe(p.prod(p.bs.stream()))
        .pipe(p.prod(p.fn(function (file, enc) {
            console.log("css-vendor: " + file.path);
        })));
});

g.task('js-app', function () {
    return g
        .src(p.path.resolve(c.src, c.js.app.src))
        .pipe(p.plumber())

        .pipe(p.concat('app.js'))
        .pipe(g.dest(p.path.resolve(c.target, c.js.app.target)))
        .pipe(p.bs.stream())
        .pipe(p.fn(function (file, enc) {
            console.log("js-app: " + file.path);
        }))

        .pipe(p.prod(p.sourcemaps.init()))
        .pipe(p.prod(p.uglify()))
        .pipe(p.prod(p.rename('app.min.js')))
        .pipe(p.prod(p.sourcemaps.write('.')))
        .pipe(p.prod(g.dest(p.path.resolve(c.target, c.js.app.target))))
        .pipe(p.prod(p.bs.stream()))
        .pipe(p.prod(p.fn(function (file, enc) {
            console.log("js-app: " + file.path);
        })));
});

g.task('js-vendor', function () {
    return g
        .src(p.path.resolve(c.src, c.js.vendor.src))
        .pipe(p.plumber())

        .pipe(p.concat('vendor.js'))
        .pipe(g.dest(p.path.resolve(c.target, c.js.vendor.target)))
        .pipe(p.bs.stream())
        .pipe(p.fn(function (file, enc) {
            console.log("js-vendor: " + file.path);
        }))

        .pipe(p.prod(p.sourcemaps.init()))
        .pipe(p.prod(p.uglify()))
        .pipe(p.prod(p.rename('vendor.min.js')))
        .pipe(p.prod(p.sourcemaps.write('.')))
        .pipe(p.prod(g.dest(p.path.resolve(c.target, c.js.vendor.target))))
        .pipe(p.prod(p.bs.stream()))
        .pipe(p.prod(p.fn(function (file, enc) {
            console.log("js-vendor: " + file.path);
        })));
});

g.task('bs-reload', function (done) {
    p.bs.reload();
    done();
});

g.task('develop', ['default'], function () {
    p.bs.init({
        server: c.target,
        ui: {
            port: 3001
        },
        ghostMode: {
            clicks: true,
            forms: true,
            scroll: false
        },
        logLevel: "info",
        open: false,
        reloadOnRestart: true
    });

    g.watch(resolveAll(c.src, c.html.watch), function () {
        p.runSequence('html', 'bs-reload')
    });

    g.watch(resolveAll(c.src, c.css.app.watch), function () {
        p.runSequence('css-app')
    });

    g.watch(resolveAll(c.src, c.css.vendor.watch), function () {
        p.runSequence('css-vendor')
    });

    g.watch(resolveAll(c.src, c.js.app.watch), function () {
        p.runSequence('js-app')
    });

    g.watch(resolveAll(c.src, c.js.vendor.watch), function () {
        p.runSequence('js-vendor')
    });
});

// ---------- default ---------- 
g.task('default', p.sequence('clean', ['assets', 'html', 'css-app', 'css-vendor', 'js-app', 'js-vendor']));