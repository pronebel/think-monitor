module.exports = {
  module: {
    loaders: [
      { test: /\.vue$/, loader: "vue-loader" },
    ]
  },
  resolve: {
    modulesDirectories: ['node_modules', 'bower_components'],
  },
  node: {
    fs: 'empty'
  }
}
