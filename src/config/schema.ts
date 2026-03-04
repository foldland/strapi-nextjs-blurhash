import { z } from 'zod'

const pluginConfigSchema = z.object({
  /**
   * Height of the output image.
   *
   * Output images are always scaled, keeping their aspect ratio.
   */
  blurSize: z.coerce.number().default(8),

  /**
   * Format of the output image (blur)
   * Benchmark sample size: 1
   *
   * |      | 8px | 5px |
   * |------|-----|-----|
   * | jpeg | 432 | 408 |
   * | png  | 516 | 268 |
   * | webp | 128 | 108 |
   * | avif | 396 | 380 |
   */
  format: z.enum(['jpeg', 'png', 'webp', 'avif']).default('webp'),

  /**
   * Chunks size for batch blur generation.
   *
   * Used on on start when images have no blurData or regenerate is enabled.
   */
  generationChunkSize: z.coerce.number().default(4),

  /**
   * Force regenerates all images on start.
   */
  regenerateOnStart: z.coerce.boolean().default(false),

  /**
   * Generate blur data when missing.
   */
  generateMissingOnStart: z.coerce.boolean().default(true),
})
export type PluginConfig = z.infer<typeof pluginConfigSchema>

export { pluginConfigSchema }
