import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// Import CSS
import './assets/main.css'

// Import Font Awesome
import FontAwesomeIcon from './plugins/fontawesome'
import './assets/sweetalert.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Register Font Awesome global component
app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')
