import del from "del";
import gulp from "gulp";
import gulpIf from "gulp-if";
import sass from "gulp-sass";
sass.compiler = require("node-sass");
import postcss from "gulp-postcss";
import sourcemaps from "gulp-sourcemaps";
import pug from "gulp-pug";
import fs from "fs";
import rename from "gulp-rename";
import imagemin from "gulp-imagemin";
import svgstore from "gulp-svgstore";
import cssnano from "cssnano";
import webp from "gulp-webp";
import imageminMozjpeg from "imagemin-mozjpeg";
import pngquant from "imagemin-pngquant";
import webpackStream from "webpack-stream";
import browserSync from "browser-sync";

const server = browserSync.create();
const env = process.env.NODE_ENV;

const config = {
  root: "./public",
  styles: {
    src: "./src/scss/main.scss",
    watch: "./src/scss/**/*.scss",
    dest: "./public/css/"
  },
  templates: {
    src: "./src/pug/pages/*.pug",
    watch: "./src/pug/**/*.pug",
    dest: "./public/"
  },
  data: {
    src: "./src/data/content.json"
  },
  scripts: {
    src: "./src/js/index.js",
    watch: "./src/js/**/*.js",
    dest: "./public/js/"
  },
  images: {
    src: "./src/images/**/*.{png,jpg,jpeg,svg}",
    dest: "./public/images"
  },
  svg: {
    src: "./src/images/svg/sprite/*.svg",
    dest: "./src/images/svg/sprite/"
  },
  fonts: {
    src: "./src/fonts/**/*.*",
    dest: "./public/fonts"
  }
};

export const serve = () => {
  server.init({
    server: config.root,
    open: false,
    notify: false,
    logPrefix: "PARIMATCH"
  });
};

export const reload = done => {
  server.reload();
  done();
};

export const watch = () => {
  gulp.watch(config.styles.watch, gulp.series(styles, reload));
  gulp.watch(config.scripts.watch, gulp.series(scripts, reload));
  gulp.watch(config.templates.watch, gulp.series(templates, reload));
  gulp.watch(config.images.src, gulp.series(images, reload));
  gulp.watch(config.svg.src, gulp.series(svg, reload));
  gulp.watch(config.fonts.src, gulp.series(fonts, reload));
};

export const clean = () => del(config.root);
export const cleanHtml = () => del(config.templates.html);

export const fonts = () =>
  gulp.src(config.fonts.src).pipe(gulp.dest(config.fonts.dest));

export const styles = () => {
  return gulp
    .src(config.styles.src)
    .pipe(
      sourcemaps.init({
        loadMaps: true
      })
    )
    .pipe(sass())
    .pipe(postcss(require("./postcss.config")))
    .pipe(gulpIf(env === "production", postcss([cssnano])))
    .pipe(gulpIf(env === "development", sourcemaps.write()))
    .pipe(gulp.dest(config.styles.dest));
};

export const templates = () => {
  return gulp
    .src(config.templates.src)
    .pipe(
      pug({
        locals: {
          data: JSON.parse(fs.readFileSync(config.data.src, "utf8"))
        }
      })
    )
    .pipe(gulp.dest(config.templates.dest));
};

export const images = () => {
  return gulp
    .src(config.images.src)
    .pipe(
      gulpIf(
        env === "production",
        imagemin([
          pngquant({
            quality: [0.7, 0.7]
          }),
          imageminMozjpeg({
            quality: 75
          })
        ])
      )
    )
    .pipe(gulp.dest(config.images.dest))
    .pipe(webp())
    .pipe(gulp.dest(config.images.dest));
};

export const scripts = () => {
  return gulp
    .src(config.scripts.src)
    .pipe(webpackStream(require("./webpack.config")))
    .pipe(gulp.dest(config.scripts.dest));
};

export const svg = () => {
  return gulp
    .src(config.svg.src)
    .pipe(
      svgstore({
        inlineSvg: true
      })
    )
    .pipe(rename("icon-sprite.svg"))
    .pipe(gulp.dest(config.svg.dest));
};

export const dev = gulp.series(
  clean,
  svg,
  gulp.parallel(templates, styles, fonts, images),
  scripts,
  gulp.parallel(serve, watch)
);

export const build = gulp.series(
  clean,
  svg,
  gulp.parallel(templates, styles, fonts, images),
  scripts
);

export default dev;
