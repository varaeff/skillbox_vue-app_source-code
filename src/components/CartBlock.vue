<template>
  <div class="cart__block">
    <ul class="cart__orders">
      <li v-for="item in products" :key="item.productId" class="cart__order">
        <h3>{{ item.product.title }}, {{ item.amount }} ед.</h3>
        <b>{{ numberFormat(item.product.price * item.amount) }} ₽</b>
        <span>Артикул: {{ item.productId }}</span>
      </li>
    </ul>

    <div class="cart__total">
      <p>Доставка: <b>500 ₽</b></p>
      <p>Итого товаров: <b>{{ totalAmount }}</b> на сумму
        <b>{{ numberFormat(totalPrice) }} ₽</b></p>
    </div>

    <button v-show="button" class="cart__button button button--primery" type="submit">
      Оформить заказ
    </button>
  </div>
</template>

<script>
import numberFormat from '@/helpers/numberFormat';

export default {
  props: ['products', 'totalAmount', 'totalPrice', 'button'],
  computed: {
    numberFormat,
  },
};
</script>
