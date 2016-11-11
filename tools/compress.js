/**
 * Created by houdong on 16/8/26.
 */
var fs = require('fs');
var UglifyJS = require("uglify-js");
var CleanCSS = require('clean-css');

async function compress() {

    //css 压缩
    let minified = new CleanCSS({rebase:false}).minify(
        [
            'public/build/css/swiper.css',
            'public/build/css/swiper.animate.css'
        ]).styles;
    fs.writeFileSync('src/main/webapp/public/build/css/common.min.css', minified);

    //js打包压缩
    let jsFiles = [
        'public/build/js/swiper.js',
        'public/build/js/common.js',
        'public/build/js/index.js',
        'public/build/js/swiper.animate.js'
    ];

    let result = UglifyJS.minify(jsFiles);
    fs.writeFileSync('public/build/js/common.min.js', result.code, 'utf8');
}

export default compress;