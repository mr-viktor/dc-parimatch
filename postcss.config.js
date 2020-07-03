import postcssImport from "postcss-import";
import postcssPresetEnv from "postcss-preset-env";
import autoprefixer from "autoprefixer";
import webpcss from "webpcss";
import postcss2rem from "2rem";
import postcssEasingGradients from "postcss-easing-gradients";
import postcssInlineSvg from "postcss-inline-svg";
import cssMqpacker from "css-mqpacker";
import postcssSorting from "postcss-sorting";

import sortingConfigAlphabetically from "./configs/alphabetically.json";

module.exports = {
  plugins: [
    postcssImport(),
    postcssPresetEnv(),
    autoprefixer(),
    postcssInlineSvg(),
    postcssEasingGradients(),
    webpcss(),
    postcss2rem({
      base: 16,
      mini: 2
    }),
    cssMqpacker({
      sort: sortMediaQueries
    }),
    postcssSorting(sortingConfigAlphabetically)
  ]
};

function isMax(mq) {
  return /max-width/.test(mq);
}

function isMin(mq) {
  return /min-width/.test(mq);
}

function sortMediaQueries(a, b) {
  var A = a.replace(/\D/g, "");
  var B = b.replace(/\D/g, "");

  if (isMax(a) && isMax(b)) {
    return B - A;
  } else if (isMin(a) && isMin(b)) {
    return A - B;
  } else if (isMax(a) && isMin(b)) {
    return 1;
  } else if (isMin(a) && isMax(b)) {
    return -1;
  }
  return 1;
}
