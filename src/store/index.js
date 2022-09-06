import { createStore } from 'vuex';
import axios from 'axios';
import API_BASE_URL from '@/config';

const store = createStore({
  state: {
    cartProducts: [],

    userAccessKey: null,

    cartProductsData: [],

    cartLoading: false,
  },
  mutations: {
    updateCartProductAmount(state, { productId, amount }) {
      const item = state.cartProducts.find((itm) => itm.productId === productId);

      if (item) {
        item.amount = amount;
      }
    },
    deleteCartProduct(state, productId) {
      state.cartProducts = state.cartProducts.filter((item) => item.productId !== productId);
    },
    updateUserAccessKey(state, accessKey) {
      state.userAccessKey = accessKey;
    },
    updateCartLoading(state, cartLoading) {
      state.cartLoading = cartLoading;
    },
    updatecartProductsData(state, items) {
      state.cartProductsData = items;
    },
    syncCartProducts(state) {
      state.cartProducts = state.cartProductsData.map((item) => (
        {
          productId: item.product.id,
          amount: item.quantity,
        }
      ));
    },
  },
  getters: {
    cartDetailProducts(state) {
      return state.cartProducts.map((item) => {
        const { product } = state.cartProductsData.find((p) => p.product.id === item.productId);
        return {
          ...item,
          product: {
            ...product,
            image: product.image.file.url,
          },
        };
      });
    },
    cartTotalPrice(state, getters) {
      return getters.cartDetailProducts.reduce((acc, item) => (
        item.product.price * item.amount) + acc, 0);
    },
    cartTotalAmount(state) {
      return state.cartProducts.reduce((acc, item) => (
        item.amount) + acc, 0);
    },
  },
  actions: {
    loadCart(context) {
      context.commit('updateCartLoading', true);
      return axios
        .get(`${API_BASE_URL}/api/baskets`, {
          params: {
            userAccessKey: context.state.userAccessKey,
          },
        })
        .then((response) => {
          if (context.state.userAccessKey) {
            localStorage.setItem('userAccessKey', response.data.user.accessKey);
            context.commit('updateUserAccessKey', response.data.user.accessKey);
          }

          context.commit('updatecartProductsData', response.data.items);
          context.commit('syncCartProducts');
        })
        .then(context.commit('updateCartLoading', false));
    },
    addProductToCart(context, { productId, amount }) {
      return axios
        .post(`${API_BASE_URL}/api/baskets/products`, {
          productId,
          quantity: amount,
        }, {
          params: {
            userAccessKey: context.state.userAccessKey,
          },
        })
        .then((response) => {
          context.commit('updatecartProductsData', response.data.items);
          context.commit('syncCartProducts');
        });
    },
    updateCartProductAmount(context, { productId, amount }) {
      context.commit('updateCartProductAmount', { productId, amount });
      return axios
        .put(`${API_BASE_URL}/api/baskets/products`, {
          productId,
          quantity: amount,
        }, {
          params: {
            userAccessKey: context.state.userAccessKey,
          },
        })
        .then((response) => {
          context.commit('updatecartProductsData', response.data.items);
        })
        .catch(() => context.commit('syncCartProducts'));
    },
    deleteCartProduct(context, productId) {
      context.commit('deleteCartProduct', productId);
      return axios
        .delete(`${API_BASE_URL}/api/baskets/products`, {
          params: {
            userAccessKey: context.state.userAccessKey,
          },
          data: {
            productId,
          },
        })
        .then((response) => {
          context.commit('updatecartProductsData', response.data.items);
        })
        .catch(() => context.commit('syncCartProducts'));
    },
  },
});

export default store;
