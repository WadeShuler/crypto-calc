const mix = require('laravel-mix');
const fs = require('fs');
const path = require('path');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel applications. By default, we are compiling the CSS
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.setPublicPath('public');

if (mix.inProduction()) {

    mix.js('src/js/app.js', 'assets/js/app.min.js').vue()
        .postCss('src/css/app.css', 'assets/css/app.min.css', [
            require('postcss-import'),
            require('autoprefixer'),
        ])
        .sourceMaps();

} else {

    mix.js('src/js/app.js', 'assets/js').vue()
        .postCss('src/css/app.css', 'assets/css', [
            require('postcss-import'),
            require('autoprefixer'),
        ]);

}

mix.copy('src/index.html', 'public')
    .after(stats => {
        // webpack compilation has completed
        fs.readFile(path.resolve(__dirname, 'public/index.html'), 'utf8' , (readError, data) => {
            if (readError) {
                console.error("\x1b[31mError: \x1b[0m" + readError);
                return;
            }

            var result = data.replace('../public/assets/css/app.css', 'assets/css/app.min.css')
                .replace('../public/assets/js/app.js', 'assets/js/app.min.js');

            fs.writeFile(path.resolve(__dirname, 'public/index.html'), result, writeError => {
                if (writeError) {
                    console.error("\x1b[31mError: \x1b[0m" + writeError);
                    return;
                }

                console.log("Index file asset references corrected!");
            });
        })
    });
