import Vue from 'vue';

declare module 'vue/types/vue' {
  interface Vue {
    showNotification(message: string): void;
    showError(message: string): void;
    resetNotification(): void;
  }
}
