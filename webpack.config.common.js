console.log('hi');

module.exports = {
  module: {
    rules: [{
      test: /\.svg$/,
      use: [ { loader: 'svg-sprite-loader' } ],
    }]
  }
};
