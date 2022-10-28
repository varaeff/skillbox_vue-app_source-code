<template>
  <legend class="form__legend">{{ item.title }}</legend>
  <ul class="check-list">
    <li class="check-list__item" v-for="value in item.availableValues" :key="value.value">
      <label :for="value.value" class="check-list__label">
        <input :id="value.value" class="check-list__check sr-only" type="checkbox" name="volume"
          :value="value.value" v-model="checked">
        <span class="check-list__desc">
          {{ value.value }}
          <span>({{ value.productsCount }})</span>
        </span>
      </label>
    </li>
  </ul>
</template>

<script>
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
  props: ['item', 'checkedProps'],
  setup(props, { emit: $emit }) {
    const checked = ref([]);
    watch(() => checked.value, (value) => {
      $emit('update:checkedProps', value);
    }, { immediate: true });

    return {
      checked,
    };
  },
});
</script>
