<template>
  <div class="loader" v-if="productStatus.isLoading"></div>
  <div v-else-if="productStatus.isLoadingFaled">
    Произошла ошибка при загрузке товара.
  </div>
  <div v-else>
    <section class="item">
      <div class="item__pics pics">
        <div class="pics__wrapper">
          <img width="300" height="300" :src="product.image.file.url" :alt="product.title">
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
              {{ product.pricePretty }} ₽
            </b>

            <fieldset class="form__block">
              <legend class="form__legend">Цвет:</legend>
              <ul class="colors">
                <li class="colors__item" v-for="color in this.colors" :key="color">
                  <label :for="color" class="colors__label">
                    <input :id="color" class="colors__radio sr-only" type="radio" name="color-item"
                      :value="color" checked="">
                    <span class="colors__value" :style="{ 'background-color': color }">
                    </span>
                  </label>
                </li>
              </ul>
            </fieldset>

            <fieldset class="form__block">
              <legend class="form__legend">Объемб в ГБ:</legend>

              <ul class="sizes sizes--primery">
                <li class="sizes__item">
                  <label for="32gb" class="sizes__label">
                    <input id="32gb" class="sizes__radio sr-only" type="radio" name="sizes-item"
                      value="32">
                    <span class="sizes__value">
                      32gb
                    </span>
                  </label>
                </li>
                <li class="sizes__item">
                  <label for="64gb" class="sizes__label">
                    <input id="64gb" class="sizes__radio sr-only" type="radio" name="sizes-item"
                      value="64">
                    <span class="sizes__value">
                      64gb
                    </span>
                  </label>
                </li>
                <li class="sizes__item">
                  <label for="128gb" class="sizes__label">
                    <input id="128gb" class="sizes__radio sr-only" type="radio" name="sizes-item"
                      value="128" checked="">
                    <span class="sizes__value">
                      128gb
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
            <a class="tabs__link tabs__link--current">
              Описание
            </a>
          </li>
          <li class="tabs__item">
            <a class="tabs__link" href="#">
              Характеристики
            </a>
          </li>
          <li class="tabs__item">
            <a class="tabs__link" href="#">
              Гарантия
            </a>
          </li>
          <li class="tabs__item">
            <a class="tabs__link" href="#">
              Оплата и доставка
            </a>
          </li>
        </ul>

        <div class="item__content">
          <p>
            Навигация GPS, ГЛОНАСС, BEIDOU Galileo и QZSS<br>
            Синхронизация со смартфоном<br>
            Связь по Bluetooth Smart, ANT+ и Wi-Fi<br>
            Поддержка сторонних приложений<br>
          </p>

          <a href="#">
            Все характеристики
          </a>

          <h3>Что это?</h3>

          <p>
            Wahoo ELEMNT BOLT GPS – это велокомпьютер, который позволяет оптимизировать свои
            велотренировки, сделав их максимально эффективными. Wahoo ELEMNT BOLT GPS
            синхронизируется с датчиками по ANT+, объединяя полученную с них информацию.
            Данные отображаются на дисплее, а также сохраняются на смартфоне.
            При этом на мобильное устройство можно установить как фирменное приложение,
            так и различные приложения сторонних разработчиков. Велокомпьютер точно
            отслеживает местоположение, принимая сигнал с целого комплекса спутников.
            Эта информация позволяет смотреть уже преодоленные маршруты и планировать
            новые велопрогулки.
          </p>

          <h3>Дизайн</h3>

          <p>
            Велокомпьютер Wahoo ELEMNT BOLT очень компактный. Размеры устройства составляют
            всего 74,6 x 47,3 x 22,1 мм. что не превышает габариты смартфона. Корпус гаджета
            выполнен из черного пластика. На обращенной к пользователю стороне расположен
            дисплей диагональю 56 мм. На дисплей выводятся координаты и скорость, а также
            полученная со смартфона и синхронизированных датчиков информация: интенсивность,
            скорость вращения педалей, пульс и т.д. (датчики не входят в комплект поставки).
            Корпус велокомпьютера имеет степень защиты от влаги IPX7. Это означает, что
            устройство не боится пыли, а также выдерживает кратковременное (до 30 минут)
            погружение в воду на глубину не более 1 метра.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { defineComponent, ref } from 'vue';
import useProduct from '@/hooks/useProduct';
import BaseModal from '@/components/BaseModal.vue';

export default defineComponent({
  props: {
    productId: { type: [Number, String], required: true },
  },

  components: { BaseModal },

  setup(props) {
    const $store = useStore();
    const {
      product, category, colors, status: productStatus, fetchProduct,
    } = useProduct();

    const productAmount = ref(1);
    const productAdded = ref(false);
    const productAddSending = ref(false);
    const isShowAddedMessage = ref(false);
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

    fetchProduct(props.productId);

    return {
      productAmount,
      productData: product,
      productStatus,
      productAdded,
      productAddSending,
      isShowAddedMessage,

      product,
      category,
      colors,

      doAddToCart,
      doAddProduct,
      doRemoveProduct,
    };
  },
});
</script>

<style lang="scss" scoped>
  @import '@/assets/css/preloader.css';

  .item {
    grid-template-columns: 1fr;
  }

  .item__form {
    padding: 25px;
  }
</style>
