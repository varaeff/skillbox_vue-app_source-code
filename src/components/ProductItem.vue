<template>
  <div>
    <a class="catalog__pic" href="#">
      <img :src="product.image" :alt="product.title">
    </a>

    <h3 class="catalog__title">
      <a href="#">
        {{ product.title }}
      </a>
    </h3>

    <span class="catalog__price">
      {{ product.price }} ₽
    </span>

    <ul class="colors colors--black">
      <li class="colors__item">
        <label :for=id[0] class="colors__label">
          <input :id=id[0] class="colors__radio sr-only" type="radio"
            value="#73B6EA" v-model="color">
          <span class="colors__value" style="background-color: #73B6EA;">
          </span>
        </label>
      </li>
      <li class="colors__item">
        <label :for=id[1] class="colors__label">
          <input :id=id[1] class="colors__radio sr-only" type="radio"
            value="#8BE000" v-model="color">
          <span class="colors__value" style="background-color: #8BE000;">
          </span>
        </label>
      </li>
      <li class="colors__item">
        <label :for=id[2] class="colors__label">
          <input :id=id[2] class="colors__radio sr-only" type="radio"
            value="#222" v-model="color">
          <span class="colors__value" style="background-color: #222;">
          </span>
        </label>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      color: '#73B6EA',
    };
  },
  props: ['product'],
  computed: {
    id() {
      return [`clr1_prod${this.product.id}`, `clr4_prod${this.product.id}`, `clr7_prod${this.product.id}`];
    },
  },
};
</script>
