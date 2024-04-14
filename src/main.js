import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import axios from 'axios'
import 'element-ui/lib/theme-chalk/index.css';

const axiosInstance = axios.create ({
  baseURL:"http://localhost:8081"
})
Vue.prototype.$axios = axiosInstance
Vue.use(ElementUI)
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
