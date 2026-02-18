/**
 * Application methods
 */
// biome-ignore assist/source/organizeImports: This is easier to understand
import bootstrap from './bootstrap.ts'
import destroy from './destroy.ts'
import register from './register.ts'

/**
 * Plugin server methods
 */
import config from './config/index.ts'

import services from './services/index.ts'

export default {
  register: register,
  bootstrap: bootstrap,
  destroy: destroy,
  config: config,
  services: services,
}
