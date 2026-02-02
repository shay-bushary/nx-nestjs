const { NxAppRspackPlugin } = require('@nx/rspack/app-plugin');
const { join, resolve } = require('path');

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  entry: {
    main: join(__dirname, 'src/main.ts'),
  },
  output: {
    path: join(__dirname, '../../dist/apps/nx-nest'),
    clean: isProd,
    ...(isProd
      ? {}
      : {
          devtoolModuleFilenameTemplate: (info) => {
            return resolve(info.absoluteResourcePath).replace(/\\/g, '/');
          },
        }),
  },
  resolve: {
    alias: {
      '@nx-shay/shared': join(__dirname, '../../libs/shared/src/index.ts'),
      '@nx-shay/backend-filters': join(__dirname, '../../libs/backend/filters/src/index.ts'),
    },
  },

  target: 'node20',

  ...(isProd
    ? {
        optimization: {
          minimize: true,
          usedExports: true,
          sideEffects: true,
          providedExports: true,
          innerGraph: true,
          concatenateModules: true,
          nodeEnv: 'production',
        },
      }
    : {
        watchOptions: {
          ignored: [/node_modules/, /dist/],
          aggregateTimeout: 300,
        },
      }),

  plugins: [
    new NxAppRspackPlugin({
      target: 'node',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: ['./src/assets'],
      optimization: isProd,
      sourceMap: isProd ? 'hidden' : true,
      outputHashing: 'none',
      generatePackageJson: isProd,
      extractLicenses: isProd,
      externalDependencies: 'all',
    }),
    // Set SWC target to es2021 so async/await and classes are preserved (not downleveled to ES5).
    // NxAppRspackPlugin configures builtin:swc-loader without a target, defaulting to ES5.
    // This fixes: breakpoint source maps (no generator state machines) and
    // "cannot call a class as a function" errors (native classes kept intact).
    {
      apply(compiler) {
        compiler.hooks.afterEnvironment.tap('SetSWCTarget', () => {
          for (const rule of compiler.options.module.rules) {
            if (rule.loader === 'builtin:swc-loader' && rule.options?.jsc) {
              rule.options.jsc.target = 'es2021';
            }
          }
        });
      },
    },
    // Plugin to modify externals after NxAppRspackPlugin - bundle @nx-shay/shared
    {
      apply(compiler) {
        compiler.hooks.afterEnvironment.tap('BundleSharedPlugin', () => {
          const originalExternals = compiler.options.externals;

          compiler.options.externals = async function (ctx, callback) {
            const request = ctx.request;

            // Bundle @nx-shay/shared (resolve via alias)
            if (request === '@nx-shay/shared' || request.startsWith('@nx-shay/shared/')) {
              return callback();
            }

            // Bundle @nx-shay/backend-filters (resolve via alias)
            if (request === '@nx-shay/backend-filters' || request.startsWith('@nx-shay/backend-filters/')) {
              return callback();
            }

            // Call original externals for everything else
            if (typeof originalExternals === 'function') {
              return originalExternals(ctx, callback);
            } else if (Array.isArray(originalExternals)) {
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
                } else if (typeof ext === 'object' && ext[request]) {
                  return callback(null, ext[request]);
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
      },
    },
  ],
};
