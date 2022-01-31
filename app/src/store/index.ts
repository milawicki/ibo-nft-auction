import Vue from 'vue'
import Vuex from 'vuex'
import { NotificationsStore } from './notifications'
import { TokensStore } from './tokens'
import { UserStore } from './user'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    UserStore,
    TokensStore,
    NotificationsStore
  }
})
