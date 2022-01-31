<template>
  <v-app>
    <v-app-bar app flat color="white">
      <v-app-bar-title>IBO - Initial Bottle Offering - NFT auction</v-app-bar-title>
      <v-spacer></v-spacer>
      
      <refund v-if="toRefund" :value="toRefund" />
      <v-spacer></v-spacer>

      <current-user :user="currentUser" @walletConnected="onWalletConnected" />
    </v-app-bar>

    <v-main>
      <v-container class="py-8 px-6">
        <notification />
        <v-row>
          <v-col cols="12">
            <h1>What is IBO?</h1>
            <p>IBO (Initial Bottle Offering) is a way for alcohol producers to tokenize thier production. You as a producer can create token that'll represent bottles you'll provide in the future. Customers can buy tokends with discount and exchange them to real bottles when they'll be ready.</p>
            <p><small>ps. this app is not production ready</small></p>

            <h2 class="mt-7 my-4">
              Current offers 
              <small v-if="endOfBiddingDate" class="caption">
                <template v-if="isBiddingActive">
                  auction ends at {{ endOfBiddingDate.toLocaleString() }}
                </template>
                <template v-else>
                  bidding is over
                </template>
              </small>
            </h2>

            <bidding-over v-if="!isBiddingActive" :hasTokens="hasTokensToTransfer" />
              
            <v-row dense v-if="tokens">
              <v-col v-for="token in tokens" :key="token.tokenId" cols="3">
                <token :currentUser="currentUser" :token="token" :isBiddingActive="isBiddingActive"
                  @history="showHistoryModal" />
              </v-col>
            </v-row>

          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <no-wallet v-if="!isWalletDetected" />
    <token-history v-if="showTokenHistory" :tokenId="showTokenHistory" 
      @close="hideHistoryModal" @click:outside="hideHistoryModal" />
  </v-app>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { Address } from '@/interfaces';
  import { TokenModel } from '@/models';
  import CurrentUser from '@/components/CurrentUser.vue';
  import NoWallet from '@/components/NoWallet.vue';
  import Token from '@/components/Token.vue';
  import Notification from '@/components/Notification.vue';
  import Refund from '@/components/Refund.vue';
  import TokenHistory from '@/components/TokenHistory.vue';
  import BiddingOver from '@/components/BiddingOver.vue';

  @Component({ components: { BiddingOver, CurrentUser, Notification, NoWallet, Token, TokenHistory, Refund } })
  export default class App extends Vue {
    showTokenHistory: number | null = null;

    async mounted(): Promise<void> {
      this.loadData();
      this.$store.dispatch('TokensStore/init');

      window?.ethereum?.on('accountsChanged', () => {
        this.loadData();
      });
    }

    get currentUser(): Address | null {
      return this.$store.getters['UserStore/currentUser'];
    }

    get isWalletDetected(): boolean {
      return !!window.ethereum;
    }

    get tokens(): TokenModel[] | null {
      return this.$store.getters['TokensStore/tokens'];
    }

    get toRefund(): number {
      return this.$store.getters['TokensStore/toRefund'];
    }

    get endOfBiddingDate(): Date | null {
      return this.$store.getters['TokensStore/endOfBiddingDateFormatted'];
    }

    get isBiddingActive(): boolean {
      return this.$store.getters['TokensStore/isBiddingActive'];
    }

    get hasTokensToTransfer(): boolean {
      return this.$store.getters['TokensStore/hasTokensToTransfer'];
    }

    async loadData(): Promise<void> {
      this.$store.dispatch('UserStore/getCurrentUser');
      this.$store.dispatch('TokensStore/getRefundValue');
    }

    onWalletConnected(): void {
      this.$store.dispatch('UserStore/connect');
    }

    showHistoryModal(tokenId: number): void {
      this.showTokenHistory = tokenId;
    }

    hideHistoryModal(): void {
      this.showTokenHistory = null;
    }
  }
</script>
