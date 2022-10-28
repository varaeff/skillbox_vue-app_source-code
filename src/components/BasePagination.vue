<template>
  <ul class="catalog__pagination pagination">
    <li class="pagination__item">
      <a href="#" class="pagination__link pagination__link--arrow" :class="{
        'pagination__link--disabled': page === 1}" aria-label="Предыдущая страница"
        @click.prevent="doPaginate(page - 1)">
        <svg width="8" height="14" fill="currentColor">
          <use xlink:href="#icon-arrow-left"></use>
        </svg>
      </a>
    </li>
    <li class="pagination__item" v-for="pageNumber in pages" :key="pageNumber">
      <a href="#" class="pagination__link" :class="{'pagination__link--current':
        pageNumber === page}" @click.prevent="doPaginate(pageNumber)">
        {{ pageNumber }}
      </a>
    </li>
    <li class="pagination__item">
      <a href="#" class="pagination__link pagination__link--arrow" :class="{
        'pagination__link--disabled': page === pages}" aria-label="Следующая страница"
        @click.prevent="doPaginate(page + 1)">
        <svg width="8" height="14" fill="currentColor">
          <use xlink:href="#icon-arrow-right"></use>
        </svg>
      </a>
    </li>
  </ul>
</template>

<script>
import { defineComponent, computed } from 'vue';

export default defineComponent({
  props: {
    page: Number,
    count: Number,
    perPage: Number,
  },

  setup(props, { emit: $emit }) {
    const pages = computed(() => (Math.ceil(props.count / props.perPage)));

    const doPaginate = (page) => {
      if (page >= 1 && page <= pages.value) {
        $emit('update:page', page);
      }
    };

    return {
      pages,
      doPaginate,
    };
  },
});
</script>
