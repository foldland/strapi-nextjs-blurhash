import { type PluginConfig, pluginConfigSchema } from './schema.ts'

export default {
  default: ({ _env }): PluginConfig => {
    return {
      blurSize: 8,
      regenerateOnStart: false,
      generateMissingOnStart: true,
    }
  },
  validator: (config) => {
    pluginConfigSchema.parse(config)
  },
}
