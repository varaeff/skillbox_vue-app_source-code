<template>
  <Teleport v-if="open" to="#teleport-target">
    <div id="blackout" class="teleport-blackout" :style="{ 'top': `${this.offset}px` }">
      <div ref="contentElement" class="teleport-modal__container" @click="onOutsideClick">
        <div class="teleport-modal">
          <div class="teleport-modal__content">
            <button type="button" class="teleport-modal__close" @click="doClose">X</button>
            <slot></slot>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script>
import { defineComponent, ref, watch } from 'vue';
import useModal from '@/hooks/useModal';

export default defineComponent({
  props: {
    open: { type: Boolean },
    offset: { type: Number },
  },

  setup(props, { emit: $emit }) {
    const contentElement = ref(null);

    const { doOpen, doClose } = useModal();

    const doCloseModal = () => {
      $emit('update:open', false);
    };

    const onOutsideClick = ($event) => {
      if ($event.target === contentElement.value) {
        doCloseModal();
      }
    };

    watch(() => props.open, (isOpen) => {
      if (isOpen) {
        doOpen();
      } else {
        doClose();
      }
    }, { immediate: true });

    return {
      onOutsideClick,
      doClose: doCloseModal,

      contentElement,
    };
  },
});
</script>

<style scoped>
  @import '@/assets/css/modal.css';
</style>
