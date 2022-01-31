<template>
  <v-snackbar v-model="isVisible" top :timeout="3000" :color="type">
    {{ message }}
  </v-snackbar>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { MessageType } from '@/interfaces';

  @Component
  export default class Notification extends Vue {
    get message(): string | null {
      return this.$store.getters['NotificationsStore/getMessage'];
    }

    get type(): MessageType | null {
      return this.$store.getters['NotificationsStore/getType'];
    }

    get isVisible(): boolean {
      return !!this.message;
    }

    set isVisible(value: boolean) {
      !value && this.resetNotification();
    }
  }
</script>
