const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');

module.exports = {
  output: {
    path: join(__dirname, 'dist'),
    clean: true,
    ...(process.env.NODE_ENV !== 'production' && {
      devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    }),
  },
  resolve: {
    alias: {
      '@nx-shay/shared': join(__dirname, '../../libs/shared/src/index.ts'),
    },
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: ["./src/assets"],
      optimization: false,
      outputHashing: 'none',
      generatePackageJson: false,
      sourceMap: true,
    }),
    // Custom plugin to modify externals after NxAppWebpackPlugin
    {
      apply: (compiler) => {
        compiler.hooks.afterEnvironment.tap('BundleSharedPlugin', () => {
          const originalExternals = compiler.options.externals;

          // Wrap the externals to allow @nx-shay/shared to be bundled
          compiler.options.externals = function(ctx, callback) {
            const request = ctx.request;

            // Bundle @nx-shay/shared (resolve via alias)
            if (request === '@nx-shay/shared' || request.startsWith('@nx-shay/shared/')) {
              return callback();
            }

            // Call original externals for everything else
            if (typeof originalExternals === 'function') {
              return originalExternals(ctx, callback);
            } else if (Array.isArray(originalExternals)) {
              // Process array of externals
              const processNext = (index) => {
                if (index >= originalExternals.length) {
                  return callback();
                }
                const ext = originalExternals[index];
                if (typeof ext === 'function') {
                  ext(ctx, (err, result) => {
                    if (err || result) return callback(err, result);
                    processNext(index + 1);
                  });
                } else if (typeof ext === 'object') {
                  if (ext[request]) return callback(null, ext[request]);
                  processNext(index + 1);
                } else {
                  processNext(index + 1);
                }
              };
              processNext(0);
            } else {
              callback();
            }
          };
        });
      }
    }
  ],
};
