import Vue from 'vue'
import App from './App.vue'
import 'quasar/dist/quasar.min.css'
import 'quasar/dist/quasar.umd'
import router from './router'
import '@fortawesome/fontawesome-free/css/all.css'
import './global'
import excel from 'vue-excel-export'
 
Vue.use(excel)
 
Vue.config.productionTip = false
new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
 