import type { Decorator } from '@storybook/react'
import { DevicePreview } from './DevicePreview'

/** Story parameter that opts a story into the device preview on docs pages. */
export type DevicePreviewParameter = {
  /** Frame height in px. Defaults to 360. */
  height?: number
  /** Key of a preset in `.storybook/viewports.ts`. Defaults to `phone`. */
  initialDevice?: string
}

/**
 * On a docs page, shows a story that sets `parameters.devicePreview` inside a
 * `DevicePreview` (an iframe at a device preset's width), so the responsive
 * spacing media queries respond to the chosen device. The docs page has no
 * viewport tool of its own. Story view and the smoke tests render the story
 * as usual.
 */
export const withDevicePreview: Decorator = (Story, context) => {
  const options = context.parameters.devicePreview as DevicePreviewParameter | undefined
  if (!options || context.viewMode !== 'docs') return <Story />
  return (
    <DevicePreview
      storyId={context.id}
      height={options.height ?? 360}
      initialDevice={options.initialDevice}
    />
  )
}
