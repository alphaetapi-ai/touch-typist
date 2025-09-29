const path = require('path');

module.exports = {
  entry: './src/App.tsx',
  output: {
    path: path.resolve(__dirname, 'dist/public'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  performance: {
    maxAssetSize: 500000, // 500 KiB instead of default 244 KiB
    maxEntrypointSize: 500000, // 500 KiB instead of default 244 KiB
    hints: 'warning', // Keep as warnings, not errors
  },
};