import type { StorybookConfig } from '@storybook/react-vite'
import type { InlineConfig } from 'vite'
import remarkGfm from 'remark-gfm'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-vitest',
    '@storybook/addon-a11y',
    {
      name: '@storybook/addon-docs',
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm],
          },
        },
      },
    },
  ],
  framework: '@storybook/react-vite',
  // Brand assets for the Storybook chrome only (favicon.svg is picked up
  // automatically). Not part of the library build.
  staticDirs: ['./public'],
  // Social share tags. Crawlers (X, LinkedIn, Slack, iMessage…) need an
  // absolute og:image URL, so set STORYBOOK_SITE_URL to the deployed origin at
  // build time. Netlify's URL and Vercel's production URL are used as fallbacks.
  managerHead: (head) => `${head}\n${socialMeta()}`,
  async viteFinal(config: InlineConfig) {
    return {
      ...config,
      server: {
        ...config.server,
        headers: {
          'X-Frame-Options': 'ALLOWALL',
        },
      },
    }
  },
}

function socialMeta() {
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL
  const site = (
    process.env.STORYBOOK_SITE_URL ??
    process.env.URL ??
    (vercel ? `https://${vercel}` : '')
  ).replace(/\/+$/, '')
  const title = 'Rudiment UI'
  const description =
    'Accessible React components on React Aria, themed entirely by design tokens, with an API reference your coding agents can read.'
  const image = `${site}/social-card.png`
  const alt =
    'Rudiment UI: “Build from the rudiments.” Accessible React components on React Aria, themed entirely by design tokens.'
  return [
    `<meta name="description" content="${description}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${title}" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    site && `<meta property="og:url" content="${site}/" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:type" content="image/png" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${alt}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${description}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    `<meta name="twitter:image:alt" content="${alt}" />`,
  ]
    .filter(Boolean)
    .join('\n')
}

export default config
