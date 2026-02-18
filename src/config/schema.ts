import { z } from 'zod'

const pluginConfigSchema = z.object({
  blurSize: z.number().default(8),
  regenerateOnStart: z.boolean().default(false),
  generateMissingOnStart: z.boolean().default(true),
})
export type PluginConfig = z.infer<typeof pluginConfigSchema>

export { pluginConfigSchema }
