import type { Core } from '@strapi/strapi'

const register = ({ strapi }: { strapi: Core.Strapi }) => {
  // @ts-expect-error this somehow works
  strapi.plugin('upload').contentTypes.file.attributes.blurhash = {
    type: 'text',
  }
}

export default register
