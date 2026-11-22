/**
 * Dev entry for the agent layout demo.
 *
 * Kept out of `src/` so it never enters the plugin bundle. The token stylesheets are
 * imported through the `@tokens` alias (see vite.dev.config.js) because Vite resolves
 * module paths against `root`, which is `dev/`.
 */
import { createApp } from 'vue'
import '@tokens/spring-tokens.css'
import '@tokens/theme.css'
import AgentPageDemo from './AgentPageDemo.vue'

document.body.style.margin = '0'

createApp(AgentPageDemo).mount('#mount')