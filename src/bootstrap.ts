import type { Core } from '@strapi/types'
import type { File } from '@strapi/upload/dist/server/src/types.d.ts'
import type { PluginConfig } from './config/schema.ts'
import { supportedMimeTypes } from './utils.ts'

type Subscriber = Parameters<Core.Strapi['db']['lifecycles']['subscribe']>[0]
// biome-ignore lint/suspicious/noExplicitAny: that's how types work
type DBEvent = Parameters<Extract<Subscriber, (...args: any) => any>>[0]

const bootstrap = async ({ strapi }: { strapi: Core.Strapi }) => {
  const service = strapi.plugin('strapi-nextjs-blurhash').service('blurhash')
  const config = strapi.config.get<PluginConfig>(
    'plugin::strapi-nextjs-blurhash'
  )

  const generateBlurhash = async (event: DBEvent) => {
    const photo: Partial<File & { blurhash: string }> | undefined =
      event.params.data

    if (
      photo === undefined ||
      photo.url === undefined ||
      !supportedMimeTypes.includes(photo.mime ?? '')
    ) {
      strapi.log.debug(`blurhash: upload event has insufficient data ${photo}`)
      return
    }

    strapi.log.debug(
      `blurhash: generating blur for id: ${photo.id} - url: ${photo.url}`
    )
    photo.blurhash = await service.generate(photo.url)
  }

  strapi.log.debug(
    `blurhash: plugin loaded with config ${JSON.stringify(config)}`
  )

  // generate before setting up the lister to avoid infinite loops
  if (config.generateMissingOnStart || config.regenerateOnStart) {
    await service.generateMissing()
  }

  strapi.db.lifecycles.subscribe({
    models: ['plugin::upload.file'],
    beforeCreate: generateBlurhash,
    beforeUpdate: generateBlurhash,
  })

  strapi.log.debug('blurhash: bootstrap completed')
}

export default bootstrap
