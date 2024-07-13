import Vue from 'vue'
import App from './App.vue'
import store from './store/store'
import router from './router'
import ElementUI from 'element-ui';
import axios from 'axios'
import 'element-ui/lib/theme-chalk/index.css';

Vue.prototype.$globalRouter = router;
const axiosInstance = axios.create ({
  baseURL:"http://localhost:8081"
})
axiosInstance.interceptors.response.use(
  response=>{
    if(response.data.code == 401){
      Vue.prototype.$globalRouter.push('/login');
    }
    return response;
  },
)
Vue.prototype.$axios = axiosInstance
Vue.use(ElementUI)
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
