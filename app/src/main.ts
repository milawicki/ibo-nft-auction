import Vue from 'vue'
import App from './App.vue'
import store from './store'
import vuetify from './plugins/vuetify'
import notifications from './plugins/notifications'
import { toEth } from './helpers/number'

Vue.config.productionTip = false;

Vue.use(notifications);

Vue.filter('toEth', toEth);

new Vue({
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
