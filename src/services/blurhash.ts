import p from 'node:path'
import type { Core } from '@strapi/strapi'
import type { File } from '@strapi/upload/dist/server/src/types.d.ts'
import sharp from 'sharp'
import type { PluginConfig } from '../config/schema.ts'
import { supportedMimeTypes } from '../utils.ts'

const blurhash = ({ strapi }: { strapi: Core.Strapi }) => ({
  generate: async (url: string): Promise<string | undefined> => {
    const srcDir = strapi.dirs.static.public
    const config = strapi.config.get<PluginConfig>(
      'plugin::strapi-nextjs-blurhash'
    )

    // sanity check because strapi is crapy
    if (typeof url !== 'string') {
      strapi.log.warn(`blurhash: invalid blurhash url ${typeof url} ${url}`)
      return
    }

    try {
      const path = p.join(srcDir, url)

      const buffer = await sharp(path)
        .resize({
          height: config.blurSize,
          width: config.blurSize,
          fit: 'inside',
        })
        .png()
        .toBuffer()
      const blurImageBase64 = buffer.toString('base64')
      const blurHash = `data:image/png;base64,${blurImageBase64}`

      return blurHash
    } catch (error) {
      strapi.log.error(`blurhash: Error generating blurhash: ${error.message}`)
    }
  },

  generateMissing: async () => {
    const service = strapi.plugin('strapi-nextjs-blurhash').service('blurhash')
    const config = strapi.config.get<PluginConfig>(
      'plugin::strapi-nextjs-blurhash'
    )

    strapi.log.info(
      config.regenerateOnStart
        ? 'blurhash: regenerating all blurs'
        : 'blurhash: generate missing'
    )

    const images: Array<Partial<File>> = await strapi.db
      .query('plugin::upload.file')
      .findMany({
        select: ['id', 'url'],
        where: {
          mime: {
            $in: supportedMimeTypes,
          },
          blurhash: config.regenerateOnStart
            ? undefined
            : {
                $null: true,
              },
        },
      })

    strapi.log.info(
      `blurhash: found missing ${JSON.stringify(
        images.map((i) => {
          return i.id
        })
      )}`
    )

    const chunkSize = config.generationChunkSize
    for (let i = 0; i < images.length; i += chunkSize) {
      const chunk = images
        .slice(i, i + chunkSize)
        .map(async ({ id, url }: Partial<File>) => {
          const blurhash = await service.generate(url)

          await strapi.db.query('plugin::upload.file').update({
            where: { id: id },
            data: {
              blurhash: blurhash,
            },
          })
        })

      // biome-ignore lint/performance/noAwaitInLoops: we need chunking to avoid an OOM
      await Promise.all(chunk)
    }

    strapi.log.info(
      config.regenerateOnStart
        ? 'blurhash: all blurs re generated'
        : 'blurhash: missing blurs generated'
    )
  },
})

export default blurhash
