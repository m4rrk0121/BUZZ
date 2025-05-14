const { purgeCSSPlugin } = require('@fullhuman/postcss-purgecss');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Remove source-map-loader for @reown/appkit-ui
      webpackConfig.module.rules = webpackConfig.module.rules.map(rule => {
        if (rule.oneOf) {
          rule.oneOf = rule.oneOf.map(oneOfRule => {
            if (oneOfRule.loader && oneOfRule.loader.includes('source-map-loader')) {
              // Skip source map loading for @reown/appkit-ui
              oneOfRule.exclude = /@reown\/appkit-ui/;
            }
            return oneOfRule;
          });
        }
        return rule;
      });
      return webpackConfig;
    }
  },
  style: {
    postcss: {
      plugins: [
        require('autoprefixer'),
        purgeCSSPlugin({
          content: [
            './src/**/*.js',
            './src/**/*.jsx',
            './src/**/*.tsx',
            './src/**/*.ts',
            './public/index.html'
          ],
          safelist: [
            // Add classes that might be added dynamically
            /^token-/,
            /^connect-/,
            /^lock-/,
            /^withdraw-/,
            /^validating-/,
            /^error-/,
            // Add any other dynamic classes or patterns
            /^wagmi/,
            /^reown/
          ],
          defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
        })
      ]
    }
  }
}; 