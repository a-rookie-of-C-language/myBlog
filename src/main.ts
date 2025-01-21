import {createApp} from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import {createPinia} from "pinia"

const app = createApp(App)
const pinia = createPinia()

// 将 axios 挂载到全局属性中（如果需要的话）
app.config.globalProperties.$axios = axios

app.use(pinia)
app.use(router)
app.use(ElementPlus)

app.mount('#app')