import { withoutResponsive } from './responsive-categories.mjs'

export default {
  source: [
    'tokens/tokens.json',
    'tokens/responsive.json',
    'tokens/semantic.json',
    'tokens/components.json',
  ],
  platforms: {
    css: {
      transformGroup: 'css',
      prefix: 'rudi',
      buildPath: 'tokens/build/',
      files: [
        {
          destination: 'tokens.css',
          format: 'css/variables',
          filter: withoutResponsive(),
          options: {
            outputReferences: true,
          },
        },
      ],
    },
  },
}
