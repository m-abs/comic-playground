import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import * as CopyPlugin from 'copy-webpack-plugin';
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';
import * as webpack from 'webpack';
import { ProvidePlugin } from 'webpack';
import { merge } from 'webpack-merge';
import devConfig from './webpack.dev';
import prodConfig from './webpack.prod';
import { outputPath, resolveApp } from './webpack.tools';

export default function (): webpack.Configuration {
  const isEnvProduction = process.env.NODE_ENV === 'production';

  const commonConfig = <webpack.Configuration>{
    entry: {
      index: './src/index.ts',
    },
    output: {
      filename: '[name].js',
      path: outputPath,
      library: '[name]',
      libraryTarget: 'var',
    },
    plugins: [
      new ProvidePlugin({
        process: 'process/browser',
      }),  
      new CopyPlugin({
        patterns: [
          {
            from: 'public/.gitkeep'
          },
        ],
      }),
      new webpack.ProgressPlugin(),
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({ filename: '[name].css' }),
    ],
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          loader: 'ts-loader',
          include: [resolveApp('src')],
          exclude: [/node_modules/]
        },
        {
          test: /.(scss|css)$/,

          use: [
            {
              loader: MiniCssExtractPlugin.loader
            },
            {
              loader: "css-loader",

              options: {
                sourceMap: true
              }
            },
            {
              loader: "sass-loader",

              options: {
                sourceMap: true
              }
            }]
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: [
            'file-loader',
          ],
        },]
    },

    resolve: {
      extensions: ['.tsx', '.ts', '.js']
    },
  }

  if (isEnvProduction) {
    return merge(commonConfig, prodConfig);
  }
  else {
    return merge(commonConfig, devConfig);
  }
}
