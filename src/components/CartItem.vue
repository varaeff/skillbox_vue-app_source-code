<template>
  <li class="cart__item product">
    <div class="product__pic">
      <img :src="item.product.image" width="120" height="120"
        :alt="item.product.title">
    </div>
    <h3 class="product__title">
      {{ item.product.title }}
    </h3>
    <span class="product__code">
      Артикул: {{ item.productId }}
    </span>

    <div class="product__counter form__counter">
      <button type="button" aria-label="Убрать один товар"
        @click.prevent="removeProduct">
        <svg width="10" height="10" fill="currentColor">
          <use xlink:href="#icon-minus"></use>
        </svg>
      </button>

      <label for="count2">
        <input readonly id="count2" type="text" v-model.number="amount" name="count">
      </label>

      <button type="button" aria-label="Добавить один товар"
        @click.prevent="addProduct">
        <svg width="10" height="10" fill="currentColor">
          <use xlink:href="#icon-plus"></use>
        </svg>
      </button>
    </div>

    <b class="product__price">
      {{ numberFormat(item.amount * item.product.price) }} ₽
    </b>

    <button class="product__del button-del" type="button"
      aria-label="Удалить товар из корзины" @click.prevent="deleteCartProduct(item.productId)">
      <svg width="20" height="20" fill="currentColor">
        <use xlink:href="#icon-close"></use>
      </svg>
    </button>
  </li>
</template>

<script>
import numberFormat from '@/helpers/numberFormat';
import { mapActions } from 'vuex';

export default {
  props: ['item'],
  computed: {
    numberFormat,
    amount: {
      get() {
        return this.item.amount;
      },
      set(value) {
        this.updateCartProductAmount({ productId: this.item.productId, amount: value });
      },
    },
  },
  methods: {
    ...mapActions(['updateCartProductAmount', 'deleteCartProduct']),
    addProduct() {
      this.amount += 1;
    },
    removeProduct() {
      if (this.amount > 1) this.amount -= 1;
    },
  },
};
</script>
