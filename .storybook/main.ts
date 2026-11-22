import type { StorybookConfig } from '@storybook/react-vite'
import type { InlineConfig, Plugin } from 'vite'
import remarkGfm from 'remark-gfm'

const config: StorybookConfig = {
  stories: [
    // Top level only: src/docs/guidelines/*.mdx are snippets imported by
    // pages, not pages themselves.
    '../src/docs/*.mdx',
    '../src/**/*.stories.@(ts|tsx)',
    // Live blocks for the Getting Started pages (token browser, theme matrix).
    './docs/*.stories.@(ts|tsx)',
  ],
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
  // Hide Storybook's "Level up" onboarding checklist in the sidebar.
  features: {
    sidebarOnboardingChecklist: false,
  },
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
      plugins: [...(config.plugins ?? []), agentDocs()],
      server: {
        ...config.server,
        headers: {
          'X-Frame-Options': 'ALLOWALL',
        },
      },
    }
  },
}

/**
 * Serves the agent-facing API reference (the same files the package ships in
 * dist/) from the site root, so an agent can read /llms.txt from the Storybook
 * URL before installing anything. Generated from src on demand: on each
 * request in dev, once in `storybook build`. Vitest never requests or bundles
 * them, so the test run pays nothing.
 */
function agentDocs(): Plugin {
  const render = async () => {
    // @ts-expect-error: untyped .mjs build scripts
    const { buildManifest } = await import('../scripts/component-docs.mjs')
    // @ts-expect-error: untyped .mjs build scripts
    const { renderMarkdown } = await import('../mcp/render.mjs')
    const api = buildManifest()
    return {
      'llms.txt': renderMarkdown(api, { full: false }),
      'llms-full.txt': renderMarkdown(api),
      'components.json': JSON.stringify(api, null, 2) + '\n',
    } as Record<string, string>
  }
  const types: Record<string, string> = {
    'llms.txt': 'text/plain; charset=utf-8',
    'llms-full.txt': 'text/plain; charset=utf-8',
    'components.json': 'application/json; charset=utf-8',
  }
  return {
    name: 'rudiment-agent-docs',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const file = req.url?.split('?')[0].replace(/^\//, '') ?? ''
        if (!(file in types)) return next()
        try {
          const body = (await render())[file]
          res.setHeader('Content-Type', types[file])
          res.end(body)
        } catch (error) {
          next(error)
        }
      })
    },
    async generateBundle() {
      for (const [fileName, source] of Object.entries(await render())) {
        this.emitFile({ type: 'asset', fileName, source })
      }
    },
  }
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
