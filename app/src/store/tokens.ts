import { ActionContext, Module } from 'vuex';
import { TokensService, TokensServiceEvents } from '@/services';
import { TokenModel } from '@/models';
import { Address, NewBid, Refund } from '@/interfaces';

interface State {
  tokens: TokenModel[];
  toRefund: number;
  endOfBiddingDate: number | null;
}

interface Getters {
  tokens: (state: State) => TokenModel[] | null;
  toRefund: (state: State) => number;
  endOfBiddingDateFormatted: (state: State) => Date | null;
  endOfBiddingDate: (state: State) => number | null;
  isBiddingActive: (state: State, getters: Getters) => boolean;
  hasTokensToTransfer: (state: State, glob: any) => boolean;
}

function subscribeForNewBidEvents(context: ActionContext<State, null>): void {
  TokensService.subscribeForEvent(
    TokensServiceEvents.NewBid,
    (value: number, tokenIndex: number, bidder: Address, prevBidder: Address) => {
      const payload: NewBid = {
        value: +value.toString(),
        tokenIndex: +tokenIndex.toString(),
        bidder,
        prevBidder
      };
      
      const userAddress = context.rootGetters['UserStore/currentUser'];
      if (userAddress === payload.prevBidder) {
        context.commit(
          'NotificationsStore/showError',
          'Someone overbid you for token ' + payload.tokenIndex,
          { root: true }
        );
      }

      context.commit('updateToken', payload);
    }
  );
}

function subscribeForRefundEvents(context: ActionContext<State, null>): void {
  TokensService.subscribeForEvent(TokensServiceEvents.Refund, 
    (value: number, bidder: Address) => {
    const userAddress = context.rootGetters['UserStore/currentUser'];
    if (userAddress === bidder) {
      context.dispatch('getRefundValue');
    }
  });
}

export const TokensStore: Module<State, any> = {
  namespaced: true,

  state: {
    tokens: [],
    toRefund: 0,
    endOfBiddingDate: null
  },

  getters: {
    tokens: (state: State): TokenModel[] | null => state.tokens,
    toRefund: (state: State): number => state.toRefund,
    endOfBiddingDateFormatted: (state: State): Date | null => state.endOfBiddingDate ? new Date(state.endOfBiddingDate * 1000) : null,
    endOfBiddingDate: (state: State): number | null => state.endOfBiddingDate && state.endOfBiddingDate * 1000,
    isBiddingActive: (state: State, getters: Getters): boolean => Boolean(+getters.endOfBiddingDate > (new Date()).getTime()),
    hasTokensToTransfer: (state: State, getters: Getters, { UserStore }: any): boolean =>
      !!UserStore?.address && state.tokens.some(token => token.bidder === UserStore.address)
  },

  mutations: {
    setTokens(state: State, token: TokenModel[]): void {
      state.tokens = token;
    },

    updateToken(state: State, newBid: NewBid): void {
      const tokens = [...state.tokens];
      const token = tokens.find(_token => _token.tokenId === newBid.tokenIndex);

      if (!token) {
        return 
      }

      token.value = newBid.value;
      token.bidder = newBid.bidder;

      state.tokens = tokens;
    },

    setRefundValue(state: State, value: number): void {
      state.toRefund = value;
    },

    setEndOfBiddingDate(state: State, value: number): void {
      state.endOfBiddingDate = value;
    }
  },

  actions: {
    init(context: ActionContext<State, null>): void {
      context.dispatch('getTokensList');
      context.dispatch('getEndOfBiddingDate');

      subscribeForNewBidEvents(context);
      subscribeForRefundEvents(context);
    },

    async getTokensList(context: ActionContext<State, null>): Promise<void> {
      const tokens = await TokensService.getTokensList();
      tokens && context.commit('setTokens', tokens);
    },

    async getRefundValue(context: ActionContext<State, null>): Promise<void> {
      const refund = await TokensService.getRefundValue();
      context.commit('setRefundValue', refund);
    },

    async getEndOfBiddingDate(context: ActionContext<State, null>): Promise<void> {
      const endOfBiddingDate = await TokensService.endOfBiddingDate();
      context.commit('setEndOfBiddingDate', endOfBiddingDate);
    }
  }
}
