<template>
  <aside class="filter">
    <h2 class="filter__title">Фильтры</h2>

    <form class="filter__form form" action="#" method="get" @submit.prevent="submit">
      <fieldset class="form__block">
        <legend class="form__legend">Цена</legend>
        <label for="minprc" class="form__label form__label--price">
          <input id="minprc" class="form__input" type="text" name="min-price"
            v-model.number="currentPriceFrom">
          <span class="form__value">От</span>
        </label>
        <label for="maxprc" class="form__label form__label--price">
          <input id="maxprc" class="form__input" type="text" name="max-price"
            v-model.number="currentPriceTo">
          <span class="form__value">До</span>
        </label>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Категория</legend>
        <label for="slct" class="form__label form__label--select">
          <select id="slct" class="form__select" name="category"
            v-model.number="currentcategoryId">
            <option value="0">Все категории</option>
            <option :value="category.id" v-for="category in categories" :key="category.id">
              {{ category.title }}
            </option>
          </select>
        </label>
      </fieldset>

      <fieldset class="form__block" v-show="colors.length && categoryId">
        <legend class="form__legend">Цвет</legend>
        <ul class="colors">
          <li class="colors__item" v-for="color in colors" :key="color.id">
            <label :for="color.id" class="colors__label">
              <input :id="color.id" class="colors__radio sr-only" type="checkbox" name="color"
                :value="color.id" v-model="currentColors">
              <span class="colors__value" :style="{ 'background-color': color.code }">
              </span>
            </label>
          </li>
        </ul>
      </fieldset>

      <fieldset class="form__block" v-for="prop in currentCategoryProps" :key="prop.id">
        <CheckBoxBlock :item="prop" v-model:checked-props="currentProps[prop.id]"/>
      </fieldset>

      <button class="filter__submit button button--primery" type="submit">
        Применить
      </button>
      <button v-show="filtered" class="filter__reset button button--second" type="button"
        @click.prevent="reset">
        Сбросить
      </button>
    </form>
  </aside>
</template>

<script>
import { useStore } from 'vuex';
import axios from 'axios';
import { API_DIPLOMA_URL } from '@/config';
import {
  defineComponent, ref, computed, watch, reactive,
} from 'vue';
import CheckBoxBlock from './CheckBoxBlock.vue';

export default defineComponent({
  props: ['priceFrom', 'priceTo', 'categoryId', 'startColor', 'loadProps', 'availableColors'],
  setup(props, { emit: $emit }) {
    const $store = useStore();
    const currentPriceFrom = ref(0);
    const currentPriceTo = ref(0);
    const currentcategoryId = ref(0);
    const currentColors = ref([]);
    const currentProps = ref([]);
    let tempProps = reactive({});

    const categoriesData = ref(null);
    const loadCategories = () => {
      axios.get(`${API_DIPLOMA_URL}/api/productCategories`)
        .then((response) => { categoriesData.value = response.data; });
    };
    const categories = computed(() => (categoriesData.value ? categoriesData.value.items : []));
    const currentCategoryProps = ref([]);
    const LoadCategoryProps = () => {
      axios.get(`${API_DIPLOMA_URL}/api/productCategories/${currentcategoryId.value}`)
        .then((response) => {
          if (response.data.productProps) {
            currentCategoryProps.value = response.data.productProps;
          }
        });
    };

    const filterColors = ref(null);
    const loadColors = () => {
      axios.get(`${API_DIPLOMA_URL}/api/colors`)
        .then((response) => { filterColors.value = response.data; });
    };
    const colors = computed(() => (
      filterColors.value ? filterColors.value.items.filter(
        (item) => props.availableColors.includes(item.id),
      ) : []
    ));

    const exportProps = computed(() => {
      const output = {};
      if (currentProps.value) {
        currentProps.value.forEach((value, index) => {
          let categoryProp = '';
          currentCategoryProps.value.forEach((val) => {
            if (val.id === index) {
              categoryProp = val.code;
            }
          });
          output[categoryProp] = value;
        });
      }
      return output;
    });

    const filtered = ref($store.state.categoryId !== 0);

    const submit = () => {
      $emit('update:priceFrom', currentPriceFrom.value);
      $emit('update:priceTo', currentPriceTo.value);
      $emit('update:categoryId', currentcategoryId.value);
      $emit('update:startColor', currentColors.value);
      $emit('update:loadProps', {});
      $emit('update:loadProps', tempProps);
      if (currentPriceFrom.value
        || currentPriceTo.value
        || currentcategoryId.value) {
        filtered.value = true;
      }
    };
    const reset = () => {
      $emit('update:priceFrom', 0);
      $emit('update:priceTo', 0);
      $emit('update:categoryId', 0);
      $emit('update:startColor', []);
      $emit('update:loadProps', {});
      filtered.value = false;
      currentCategoryProps.value = [];
      currentProps.value = [];
      $store.dispatch('updateCategory', 0);
    };
    watch(() => props.priceFrom, (value) => {
      currentPriceFrom.value = value;
    }, { immediate: true });
    watch(() => props.priceTo, (value) => {
      currentPriceTo.value = value;
    }, { immediate: true });
    watch(() => props.categoryId, (value) => {
      currentcategoryId.value = value;
    }, { immediate: true });
    watch(() => props.startColor, (value) => {
      currentColors.value = value;
    }, { immediate: true });
    watch(() => currentcategoryId.value, (value) => {
      currentProps.value = [];
      if (value !== 0) {
        LoadCategoryProps();
      }
    }, { immediate: true });
    watch(() => exportProps.value, (value) => {
      tempProps = value;
    }, { immediate: true });

    loadCategories();
    loadColors();

    return {
      currentPriceFrom,
      currentPriceTo,
      currentcategoryId,
      currentColors,
      currentProps,
      currentCategoryProps,

      categories,
      colors,
      filtered,

      submit,
      reset,
    };
  },
  components: { CheckBoxBlock },
});
</script>
