const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'production',
  entry: {
    'block-eleve/index': './src/block-eleve/index.js',
    'block-eleve/view': './src/block-eleve/view.js',
    'block-login/index': './src/block-login/index.js',
    'block-login/view': './src/block-login/view.js',
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js',
    clean: true,
  },
  resolve: {
    alias: {
			'@shared': path.resolve(__dirname, 'vendor/shared'),
			'@competence/shared': path.resolve(__dirname, 'vendor/shared'),
		},
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: require.resolve('babel-loader'),
					options: {
						presets: [
							[require.resolve('@wordpress/babel-preset-default'), {
								reactRuntime: 'classic',
							}],
						],
        },
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.s[ac]ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
  ],
	externals: {
		  react: 'React',
			'react-dom': 'ReactDOM',
			'@wordpress/element': ['wp', 'element'],
			'@wordpress/i18n': ['wp', 'i18n'],
			'@wordpress/blocks': ['wp', 'blocks'],
			'@wordpress/block-editor': ['wp', 'blockEditor'],
			}
};
