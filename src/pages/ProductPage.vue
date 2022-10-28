<template>
  <main class="loader" v-if="productStatus.isLoading"></main>
  <main v-else-if="productStatus.isLoadingFaled">
    Произошла ошибка при загрузке товаров.
  </main>
  <main class="content container" v-else>
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" @click.prevent="doResetFilterCategory"
            :to="{name: 'main'}">
            Каталог
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" @click.prevent="doUpdateFilterCategory"
            :to="{name: 'main'}">
            {{ category.title }}
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link">
            {{ product.title }}
          </a>
        </li>
      </ul>
    </div>

    <section class="item">
      <div class="item__pics pics">
        <div class="pics__wrapper">
          <img width="450" height="450" :src="product.preview.file.url" :alt="product.title">
        </div>
      </div>

      <div class="item__info">
        <span class="item__code">Артикул: {{ product.id }}</span>
        <h2 class="item__title">
          {{ product.title }}
        </h2>
        <div class="item__form">
          <form class="form" action="#" method="POST" @submit.prevent="doAddToCart">
            <b class="item__price">
              {{ currentProduct.price }} ₽
            </b>

            <fieldset class="form__block">
              <legend class="form__legend">Цвет:</legend>
              <ul class="colors">
                <li class="colors__item" v-for="color, index in product.colors" :key="index">
                  <label :for="color.id" class="colors__label">
                    <input :id="color.id" class="colors__radio sr-only" type="radio"
                      name="color-item" :value="color.id" :checked="index == 0">
                    <span class="colors__value" :style="{ 'background-color': color.color.code }"
                    @click="doUpdateProductColor(color.color.id)">
                    </span>
                  </label>
                </li>
              </ul>
            </fieldset>

            <fieldset class="form__block">
              <legend class="form__legend">{{ product.mainProp.title }}</legend>

              <ul class="sizes sizes--primery">
                <li class="sizes__item" v-for="offer, index in offers" :key="index"
                  @change="doUpdateCurrentProduct(offer.price, offer.id)">
                  <label :for="offer.propValue" class="sizes__label">
                    <input :id="offer.propValue" class="sizes__radio sr-only" type="radio"
                      name="sizes-item" :value="offer.propValue" :checked="index == 0">
                    <span class="sizes__value">
                      {{ offer.propValue }}
                    </span>
                  </label>
                </li>
              </ul>
            </fieldset>

            <div class="item__row">
              <div class="form__counter">
                <button type="button" aria-label="Убрать один товар"
                  @click.prevent="doRemoveProduct">
                  <svg width="12" height="12" fill="currentColor">
                    <use xlink:href="#icon-minus"></use>
                  </svg>
                </button>

                <label for="someid">
                  <input readonly id="someid" type="text" v-model.number="productAmount">
                </label>

                <button type="button" aria-label="Добавить один товар"
                  @click.prevent="doAddProduct">
                  <svg width="12" height="12" fill="currentColor">
                    <use xlink:href="#icon-plus"></use>
                  </svg>
                </button>
              </div>

              <button class="button button--primery" type="submit" :disabled="productAddSending">
                В корзину
              </button>

              <BaseModal v-model:open="isShowAddedMessage">
                <div v-show="productAdded">Товар добавлен в корзину</div>
                <div v-show="productAddSending">Добавляем товар в корзину...</div>
              </BaseModal>
            </div>
          </form>
        </div>
      </div>

      <div class="item__desc">
        <ul class="tabs">
          <li class="tabs__item">
            <a :class="[{'tabs__link--current': tab == 1}, 'tabs__link']" @click="tab = 1">
              Описание
            </a>
          </li>
          <li class="tabs__item">
            <a :class="[{'tabs__link--current': tab == 2}, 'tabs__link']" @click="tab = 2">
              Характеристики
            </a>
          </li>
          <li class="tabs__item">
            <a :class="[{'tabs__link--current': tab == 3}, 'tabs__link']" @click="tab = 3">
              Гарантия
            </a>
          </li>
          <li class="tabs__item">
            <a :class="[{'tabs__link--current': tab == 4}, 'tabs__link']" @click="tab = 4">
              Оплата и доставка
            </a>
          </li>
        </ul>

        <div class="item__content">
          <p v-show="tab == 1">
            {{ product.content }}
          </p>

          <ul v-show="tab == 2">
            <li v-for="spec in product.specifications" :key="spec.id">
              <h3>{{ spec.title }}</h3>
              <p>{{ spec.value }}</p>
            </li>
          </ul>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import { useStore } from 'vuex';
import BaseModal from '@/components/BaseModal.vue';
import {
  defineComponent, ref, reactive, watch,
} from 'vue';
import { useRoute } from 'vue-router';
import useProduct from '@/hooks/useProduct';
// import store from '@/store';

export default defineComponent({
  components: { BaseModal },

  setup() {
    const $store = useStore();
    const $route = useRoute();
    const {
      product, category, status: productStatus, offers, fetchProduct,
    } = useProduct();

    const productAmount = ref(1);
    const productAdded = ref(false);
    const productAddSending = ref(false);
    const isShowAddedMessage = ref(false);
    const currentProduct = reactive({});
    const tab = ref(1);

    const doAddToCart = () => {
      productAdded.value = false;
      productAddSending.value = true;
      isShowAddedMessage.value = true;
      $store.dispatch('addProductToCart', { productId: product.value.id, amount: productAmount.value })
        .then(() => {
          productAdded.value = true;
          productAddSending.value = false;
        });
    };
    const doAddProduct = () => {
      productAmount.value += 1;
    };
    const doRemoveProduct = () => {
      if (productAmount.value > 1) productAmount.value -= 1;
    };

    fetchProduct($route.params.id);

    const doUpdateCurrentProduct = (price, id) => {
      currentProduct.price = price;
      currentProduct.id = id;
    };

    const doUpdateProductColor = (id) => {
      currentProduct.colorId = id;
    };

    const doUpdateFilterCategory = () => {
      $store.dispatch('updateCategory', category.value.id);
    };

    const doResetFilterCategory = () => {
      $store.dispatch('updateCategory', 0);
    };

    watch(() => product.value, () => {
      currentProduct.price = offers.value[0].price;
      currentProduct.id = offers.value[0].id;
      currentProduct.colorId = product.value.colors[0].color.id;
    }, { deep: true });

    return {
      productAmount,
      productStatus,
      productAdded,
      productAddSending,
      isShowAddedMessage,
      tab,

      product,
      currentProduct,
      category,
      offers,

      doUpdateCurrentProduct,
      doUpdateProductColor,
      doUpdateFilterCategory,
      doResetFilterCategory,

      doAddToCart,
      doAddProduct,
      doRemoveProduct,
    };
  },
});
</script>

<style lang="scss" scoped>
  @import '@/assets/css/preloader.css';
</style>
