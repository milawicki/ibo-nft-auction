<template>
  <v-card>
    <v-btn v-if="token.hasBidder()" icon small absolute right style="z-index: 9" class="mt-2 white--text"
      title="show bidding history" @click="$emit('history', token.tokenId)">
      <v-icon>mdi-history</v-icon>
    </v-btn>

    <v-img
      src="https://via.placeholder.com/200"
      class="white--text align-end"
      gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
      height="200px"
    >
      <v-card-title>{{ tokenName }}</v-card-title>
      <v-card-subtitle>bottle no #{{ token.tokenId + 1 }}</v-card-subtitle>
    </v-img>

    <v-card-text>
      <template v-if="token.hasBidder()">
        <div class="d-flex flex-columns justify-space-between">
          <span>current price:</span>
          <strong>{{ token.value | toEth }} ETH</strong>
        </div>
        <div class="d-flex flex-columns justify-space-between">
          <span>current bidder:</span>
          <strong>{{ token.isBidder(currentUser) ? '' : 'NOT' }} YOU</strong>
        </div>
      </template>
      <p v-else>no bids yet</p>
    </v-card-text>

    <v-card-actions>
      <template v-if="isBiddingActive">
        <v-text-field type="number" placeholder="your bid" suffix="ETH" v-model.trim="bidValue" :rules="[requiredNumber]" />
        
        <v-btn icon color="green" :disabled="!canBid" @click="bid">
          <v-icon>mdi-basket-plus</v-icon>
        </v-btn>
      </template>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from "vue-property-decorator";
  import { TokenModel } from "@/models";
  import { toEth } from '@/helpers/number';

  @Component
  export default class Token extends Vue {
    @Prop({ required: true }) readonly token!: TokenModel;
    @Prop({ default: null }) readonly currentUser!: string;
    @Prop({ default: false }) readonly isBiddingActive!: boolean;

    bidValue: number = toEth(this.token.value || 0);
    tokenName: string = '';

    async mounted(): Promise<void> {
      this.tokenName = (await this.token.getName()) || '';
    }

    get canBid(): boolean {
      return Boolean(this.currentUser && this.bidValue && this.isBiddingActive);
    }

    requiredNumber(value: string): boolean {
      return Boolean(value && !isNaN(+value));
    }

    bid(): void {
      if (!this.canBid) {
        return;
      }

      if (this.bidValue <= toEth(this.token.value)) {
        this.showError('Your bid must be higher than current one');
        return;
      }

      if (this.token.isBidder(this.currentUser)) {
        this.showError('Your cannot overbid yourself');
        return;
      }

      this.token.bid(this.bidValue);
    }
  }
</script>
