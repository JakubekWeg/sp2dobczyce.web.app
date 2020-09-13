import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import './misc/firebase'

import router from './misc/router'
import store from './misc/state'


Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
