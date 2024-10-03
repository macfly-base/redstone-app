const path = require('path');

module.exports = {
  productionSourceMap: true,

  chainWebpack: config => {
    // Resolve paths once
    const nodeModulesPath = path.resolve(__dirname, 'node_modules');
    const srcPath = path.resolve(__dirname, 'src');

    // Vue loader configuration with vue-template-babel-compiler
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap(options => ({
        ...options,
        compiler: require('vue-template-babel-compiler')
      }));

    // Babel loader for node_modules (excluding core-js)
    config.module
      .rule('babel-for-node-modules')
      .test(/\.m?js$/)
      .include.add(nodeModulesPath).end()
      .exclude.add(/core-js/).end()
      .use('babel-loader')
      .loader('babel-loader')
      .options({
        presets: [['@babel/preset-env', { modules: 'auto' }]],
        plugins: [
          '@babel/plugin-proposal-private-methods',
          '@babel/plugin-proposal-class-properties',
          '@babel/plugin-transform-modules-commonjs'
        ]
      });

    // Add alias for '@' pointing to 'src'
    config.resolve.alias.set('@', srcPath);
  },

  // Consolidate alias configuration in configureWebpack
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    }
  }
};
