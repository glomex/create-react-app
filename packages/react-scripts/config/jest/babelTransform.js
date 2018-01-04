// @remove-file-on-eject
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

const babelJest = require('babel-jest');

module.exports = babelJest.createTransformer({
  presets: [
    require.resolve('babel-preset-react-app'),
    require.resolve('babel-preset-es2015'),
    require.resolve('babel-preset-stage-0')
  ].map(require.resolve),
  plugins: [
    require.resolve('babel-plugin-transform-decorators-legacy'),
    require.resolve('babel-plugin-transform-runtime'),
    require.resolve('babel-plugin-add-module-exports'),
    require.resolve('babel-plugin-transform-react-display-name'),
  ].map(require.resolve),
  babelrc: false
});
