import { createStore } from 'vuex';
import products from '@/data/products';

const store = createStore({
  state: {
    cartProducts: [],
  },
  mutations: {
    addProductToCart(state, { productId, amount }) {
      const item = state.cartProducts.find((itm) => itm.productId === productId);

      if (item) {
        item.amount += amount;
      } else {
        state.cartProducts.push({
          productId,
          amount,
        });
      }
    },
    updateCartProductAmount(state, { productId, amount }) {
      const item = state.cartProducts.find((itm) => itm.productId === productId);

      if (item) {
        item.amount = amount;
      }
    },
    deleteCartProduct(state, productId) {
      state.cartProducts = state.cartProducts.filter((item) => item.productId !== productId);
    },
  },
  getters: {
    cartDetailProducts(state) {
      return state.cartProducts.map((item) => (
        {
          ...item,
          product: products.find((p) => p.id === item.productId),
        }
      ));
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
});

export default store;
