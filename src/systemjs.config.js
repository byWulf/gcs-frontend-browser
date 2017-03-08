/**
 * System configuration for Angular samples
 * Adjust as necessary for your application needs.
 */
(function (global) {
    System.config({
        paths: {
            // paths serve as alias
            'npm:': 'node_modules/'
        },
        // map tells the System loader where to look for things
        map: {
            // our app is within the app folder
            app: 'app',

            // angular bundles
            '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
            '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
            '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
            '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
            '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
            '@angular/http': 'npm:@angular/http/bundles/http.umd.js',
            '@angular/router': 'npm:@angular/router/bundles/router.umd.js',
            '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',

            // other libraries
            'rxjs': 'npm:rxjs',
            'angular-in-memory-web-api': 'npm:angular-in-memory-web-api/bundles/in-memory-web-api.umd.js',
            'socket.io-client': 'npm:socket.io-client',
            'angular2-cookie': 'npm:angular2-cookie',
            'tinycolor2': 'npm:tinycolor2',
            'three': 'npm:three',
            'tween.js': 'npm:tween.js'
        },
        // packages tells the System loader how to load when no filename and/or no extension
        packages: {
            app: {
                defaultExtension: 'js'
            },
            rxjs: {
                defaultExtension: 'js'
            },
            'socket.io-client': {
                main: './dist/socket.io.js'
            },
            'angular2-cookie': {
                main: './core.js',
                defaultExtension: 'js'
            },
            'tinycolor2': {
                main: './dist/tinycolor-min.js'
            },
            'three': {
                main: './build/three.js',
                defaultExtension: 'js'
            },
            'tween.js': {
                main: './src/Tween.js',
                defaultExtension: 'js'
            }
        }
    });
})(this);
