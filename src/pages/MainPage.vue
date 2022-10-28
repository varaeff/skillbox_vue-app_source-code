<template>
  <main class="content container">
    <div class="content__top content__top--catalog">
      <h1 class="content__title">
        Каталог
      </h1>
      <span class="content__info">
        Найдено товаров: {{ countProducts }}
      </span>
    </div>

    <div class="content__catalog">
      <ProductFilter v-model:price-from="filterPriceFrom" v-model:price-to="filterPriceTo"
        v-model:category-id="filterCategoryId" v-model:start-color="filterColor"
        v-model:load-props="filterProps" :available-colors="availableColors"/>

      <section class="catalog">
        <div class="loader" v-if="status.isLoading"></div>

        <div v-else-if="status.isLoadingFaled">
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
import { useStore } from 'vuex';
import { API_DIPLOMA_URL } from '@/config';
import ProductList from '@/components/ProductList.vue';
import BasePagination from '@/components/BasePagination.vue';
import ProductFilter from '@/components/ProductFilter.vue';
import axios from 'axios';
import qs from 'qs';
import {
  defineComponent, ref, watch, computed, reactive,
} from 'vue';

export default defineComponent({
  components: { ProductList, BasePagination, ProductFilter },

  setup() {
    const $store = useStore();

    const status = reactive({
      isLoading: false,
      isLoadingFaled: false,
    });

    const filterPriceFrom = ref(0);
    const filterPriceTo = ref(0);
    const filterCategoryId = ref($store.state.categoryId);
    const filterColor = ref([]);
    const filterProps = ref({});

    const page = ref(1);
    const productsPerPage = ref(12);

    const productsData = ref(null);

    const loadParams = computed(() => {
      const output = {};
      output.page = page.value;
      output.limit = productsPerPage.value;
      output.categoryId = filterCategoryId.value;
      if (filterPriceFrom.value !== 0) { output.minPrice = filterPriceFrom.value; }
      if (filterPriceTo.value !== 0) { output.maxPrice = filterPriceTo.value; }
      if (filterColor.value.length !== 0) { output.colorId = filterColor.value; }
      if (filterProps.value) {
        output.props = filterProps.value;
      }
      return output;
    });

    const loadProducts = () => {
      status.isLoading = true;
      status.isLoadingFaled = false;
      axios
        .get(`${API_DIPLOMA_URL}/api/products`, {
          params: loadParams.value,
          paramsSerializer: (params) => (qs.stringify(params)),
        })
        .then((response) => { productsData.value = response.data; })
        .catch(() => { status.isLoadingFaled = true; })
        .then(() => { status.isLoading = false; });
    };

    const products = computed(() => (productsData.value ? productsData.value.items
      .map((product) => (
        {
          ...product,
          image: product.preview.file.url,
        }
      )) : []));
    const countProducts = computed(() => (
      productsData.value ? productsData.value.pagination.total : 0
    ));

    const availableColors = computed(() => {
      const output = [];
      products.value.forEach((element) => {
        element.colors.forEach((el) => {
          if (!(output.includes(el.color.id))) {
            output.push(el.color.id);
          }
        });
      });
      return output;
    });

    watch(() => [page.value, filterPriceFrom.value, filterPriceTo.value,
      filterCategoryId.value, filterColor.value, filterProps.value], () => {
      loadProducts();
    }, { immediate: true });

    return {
      status,
      filterPriceFrom,
      filterPriceTo,
      filterCategoryId,
      filterColor,
      page,
      productsPerPage,
      products,
      countProducts,
      filterProps,
      availableColors,
    };
  },
});
</script>

<style lang="scss">
  @import '@/assets/css/preloader.css';
</style>
