<template>
  <v-alert border="top" color="blue lighten-2" dark>
    The auction is over.

    <v-btn v-if="hasTokens" color="blue darker-5" class="float-right" @click="transferTokens">
      click here to get your tokens
    </v-btn>
  </v-alert>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from "vue-property-decorator";
  import { TokensService } from "@/services";

  @Component
  export default class BiddingOver extends Vue {
    @Prop({ required: true }) readonly hasTokens!: boolean;

    transferTokens(): void {
      TokensService.transferTokens();
    }
  }
</script>
