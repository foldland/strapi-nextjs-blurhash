import bootstrap from './bootstrap.ts'
import config from './config/index.ts'
import destroy from './destroy.ts'
import register from './register.ts'

import services from './services/index.ts'

export default {
  register: register,
  bootstrap: bootstrap,
  destroy: destroy,
  config: config,
  services: services,
}
