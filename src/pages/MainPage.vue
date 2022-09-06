<template>
  <main class="content container">
    <div class="content__top content__top--catalog">
      <h1 class="content__title">
        Каталог
      </h1>
      <span class="content__info">
        152 товара
      </span>
    </div>

    <div class="content__catalog">
      <ProductFilter v-model:price-from="filterPriceFrom" v-model:price-to="filterPriceTo"
        v-model:category-id="filterCategoryId" v-model:start-color="filterColor"/>
      <section class="catalog">

        <div class="loader" v-if="productsLoading"></div>

        <div v-else-if="productsLoadingFailed">
          Произошла ошибка при загрузке товаров.
          <button @click.prevent="loadProducts">Попробовать ещё раз</button>
        </div>

        <ProductList v-else :products="products"/>
        <BasePagination v-model:page="page" :count="countProducts" :perPage="productsPerPage"/>
      </section>
    </div>
  </main>
</template>

<script>
import API_BASE_URL from '@/config';
import ProductList from '@/components/ProductList.vue';
import BasePagination from '@/components/BasePagination.vue';
import ProductFilter from '@/components/ProductFilter.vue';
import axios from 'axios';

export default {
  components: { ProductList, BasePagination, ProductFilter },
  data() {
    return {
      filterPriceFrom: 0,
      filterPriceTo: 0,
      filterCategoryId: 0,
      filterColor: '',

      page: 1,
      productsPerPage: 6,

      productsData: null,

      productsLoading: false,
      productsLoadingFailed: false,
    };
  },
  computed: {
    products() {
      return this.productsData
        ? this.productsData.items.map((product) => (
          {
            ...product,
            image: product.image.file.url,
          }
        ))
        : [];
    },
    countProducts() {
      return this.productsData ? this.productsData.pagination.total : 0;
    },
  },
  watch: {
    page() {
      this.loadProducts();
    },
    filterPriceFrom() {
      this.loadProducts();
    },
    filterPriceTo() {
      this.loadProducts();
    },
    filterCategoryId() {
      this.loadProducts();
    },
    filterColor() {
      this.loadProducts();
    },
  },
  methods: {
    loadProducts() {
      this.productsLoading = true;
      this.productsLoadingFailed = false;
      clearTimeout(this.loadProductsTimer);
      this.loadProductsTimer = setTimeout(() => {
        (axios
          .get(`${API_BASE_URL}/api/products`, {
            params: {
              page: this.page,
              limit: this.productsPerPage,
              categoryId: this.filterCategoryId,
              minPrice: this.filterPriceFrom,
              maxPrice: this.filterPriceTo,
              colorId: this.filterColor,
            },
          })
          .then((response) => { this.productsData = response.data; })
          .catch(() => { this.productsLoadingFailed = true; })
          .then(this.productsLoading = false)
        );
      }, 500);
    },
  },
  created() {
    this.loadProducts();
  },
};
</script>

<style lang="scss">
  @import '@/assets/css/preloader.css';
</style>
