module.exports = {
  // 'unambiguous' lets Babel detect CJS (require/exports) vs ESM (import/export)
  // from the file content. Without this, Babel assumes ESM and injects
  // `import "core-js/..."` polyfills into CJS files — webpack 5 then treats
  // those CJS files as ESM modules where `exports` is not defined.
  sourceType: 'unambiguous',
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: ['last 2 versions', '> 1%'],
          node: 'current',
        },
        useBuiltIns: 'usage',
        corejs: 3,
        modules: false,
      },
    ],
    [
      '@babel/preset-react',
      {
        // Use the new JSX transform (no need to import React in every file)
        runtime: 'automatic',
      },
    ],
    '@babel/preset-typescript',
  ],
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    ['@babel/plugin-transform-private-methods', { loose: true }],
    ['@babel/plugin-transform-private-property-in-object', { loose: true }],
  ],
  env: {
    // Keep CommonJS for server/Node targets when needed
    server: {
      presets: [
        [
          '@babel/preset-env',
          {
            targets: { node: 'current' },
            modules: 'commonjs',
          },
        ],
        ['@babel/preset-react', { runtime: 'automatic' }],
        '@babel/preset-typescript',
      ],
    },
  },
};
