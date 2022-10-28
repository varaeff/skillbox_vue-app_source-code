<template>
  <div>
    <router-link class="catalog__pic" :to="{name: 'product', params: {id: product.id}}">
      <img :src="product.image" :alt="product.title">
    </router-link>

    <h3 class="catalog__title">
      <router-link :to="{name: 'product', params: {id: product.id}}">
        {{ product.title }}
      </router-link>
    </h3>

    <span class="catalog__price">
      {{ numberFormat(price) }} ₽
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

    <ul class="sizes sizes--primery">
      <li class="sizes__item" v-for="offer, index in this.product.offers" :key="index"
        @change="doUpdateCurrentProduct(offer.price, offer.id)">
        <label :for="offer.propValue" class="sizes__label">
          <input :id="offer.propValue" class="sizes__radio sr-only" type="radio"
            name="sizes-item" :value="offer.propValue" :checked="index == 0">
          <span class="sizes__value">
            {{ offer.propValues[0].value }}
          </span>
        </label>
      </li>
    </ul>

    <button class="item_button" type="button" @click.prevent="doOpenQickView">
      Быстрый просмотр
    </button>
    <button class="item_button" type="button">В корзину</button>
  </div>

  <BaseModal v-model:open="isQickViewOpen" :offset="offsetY">
    <ProductQickView :product-id="product.id" />
  </BaseModal>
</template>

<script>
import numberFormat from '@/helpers/numberFormat';
import {
  defineAsyncComponent, defineComponent, ref, h, computed,
} from 'vue';
import BaseModal from './BaseModal.vue';

export default defineComponent({
  props: {
    product: Object,
  },

  computed: {
    numberFormat,
  },

  components: {
    BaseModal,
    ProductQickView: defineAsyncComponent({
      loader: () => import('@/components/ProductQickView.vue'),
      delay: 0,
      loadingComponent: () => h('div', 'загрузка'),
    }),
  },

  setup(props) {
    const selectColor = ref(props.product.colors[0].code);
    const isQickViewOpen = ref(false);
    const offsetY = ref(0);
    const price = ref(props.product.price);

    const colors = computed(() => (props.product.colors.map((color) => color.color.code)));

    const doOpenQickView = () => {
      offsetY.value = window.pageYOffset;
      isQickViewOpen.value = true;
    };

    return {
      selectColor,
      isQickViewOpen,
      offsetY,
      colors,
      price,

      doOpenQickView,
    };
  },
});
</script>

<style>
  .item_button {
    margin: 5px;
  }
</style>
