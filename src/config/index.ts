import { type PluginConfig, pluginConfigSchema } from './schema.ts'

export default {
  default: ({ _env }): PluginConfig => {
    return {
      blurSize: 8,
      generationChunkSize: 4,
      regenerateOnStart: false,
      generateMissingOnStart: true,
    }
  },
  validator: (config) => {
    pluginConfigSchema.parse(config)
  },
}
