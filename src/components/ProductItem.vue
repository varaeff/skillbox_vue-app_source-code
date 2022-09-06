<template>
  <div>
    <router-link class="catalog__pic" :to="{name: 'product', params: {id: product.id}}">
      <img :src="product.image" :alt="product.title">
    </router-link>

    <h3 class="catalog__title">
      <a href="#">
        {{ product.title }}
      </a>
    </h3>

    <span class="catalog__price">
      {{ numberFormat(product.price) }} ₽
    </span>

    <ul class="colors colors--black">
      <li class="colors__item" v-for="color in this.colors" :key="color">
        <label :for=this.product.id+color class="colors__label">
          <input :id=this.product.id+color class="colors__radio sr-only" type="radio"
            :value="color" v-model="selectColor">
          <span class="colors__value" :style="{ 'background-color': color }">
          </span>
        </label>
      </li>
    </ul>
  </div>
</template>

<script>
import numberFormat from '@/helpers/numberFormat';

export default {
  data() {
    return {
      selectColor: this.product.colors[0].code,
    };
  },
  props: ['product'],
  computed: {
    colors() {
      return this.product.colors.map((color) => color.code);
    },
    numberFormat,
  },
};
</script>
