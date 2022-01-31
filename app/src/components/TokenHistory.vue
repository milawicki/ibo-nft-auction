<template>
 <div class="text-center">
    <v-dialog :value="true" width="700">
      <v-card>
        <v-card-title class="text-h5">
          Bidding History
        </v-card-title>

        <v-card-text>
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">
                    Bidder
                  </th>
                  <th class="text-left">
                    Value
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in biddingHistory" :key="index">
                  <td>{{ item.bidder }}</td>
                  <td>{{ item.value | toEth }} ETH</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="$emit('close')">
            close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from "vue-property-decorator";
  import { NewBid } from "@/interfaces";
  import { TokensService } from "@/services";

  @Component
  export default class TokenHistory extends Vue {
    @Prop({ required: true }) readonly tokenId!: number;

    biddingHistory: NewBid[] = [];

    async mounted(): Promise<void> {
      this.biddingHistory = (await TokensService.getAllBids(this.tokenId))?.reverse() || [];
    }
  }
</script>
