import store from '@/store'
import { VueConstructor } from 'vue';

export default {
  install(Vue: VueConstructor) {
    Vue.prototype.showNotification = (message: string): void  => {
      store.commit('NotificationsStore/showNotification', message);
    },
  
    Vue.prototype.showError = (message: string): void => {
      store.commit('NotificationsStore/showError', message);
    },
  
    Vue.prototype.resetNotification = (): void => {
      store.commit('NotificationsStore/resetNotification');
    }
  },
}
