<template>
  <div>
    You have {{ value | toEth }} ETH to refund 
    <v-btn color="blue white--text" @click="refund">refund</v-btn>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from "vue-property-decorator";
  import { TokensService } from "@/services";

  @Component
  export default class Refund extends Vue {
    @Prop({ required: true }) readonly value!: number;

    refund(): void {
      TokensService.refund();
    }
  }
</script>
