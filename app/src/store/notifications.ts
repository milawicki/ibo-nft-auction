import { Module } from "vuex";
import { MessageType } from "@/interfaces";

interface State {
  type: MessageType | null,
  message: string | null
}

export const NotificationsStore: Module<State, null> = {
  namespaced: true,
  
  state: {
    type: null,
    message: null
  },

  getters: {
    getType: (state: State): MessageType | null => state.type,
    getMessage: (state: State): string | null => state.message,
  },

  mutations: {
    showNotification(state: State, message: string): void {
      state.message = message;
      state.type = MessageType.success;
    },

    showError(state: State, message: string): void {
      state.message = message;
      state.type = MessageType.error;
    },

    resetNotification(state: State): void {
      state.message = null;
      state.type = null;
    }
  }
}
