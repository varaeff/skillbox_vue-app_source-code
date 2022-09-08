<template>
  <main class="content container">
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{name: 'main'}">
            Каталог
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{name: 'cart'}">
            Корзина
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link">
            Оформление заказа
          </a>
        </li>
      </ul>

      <h1 class="content__title">
        Корзина
      </h1>
      <span class="content__info">
        3 товара
      </span>
    </div>

    <section class="cart">
      <form class="cart__form form" action="#" method="POST">
        <div class="cart__field">
          <div class="cart__data">
            <BaseFormText v-model="formData.name" :error="formError.name" title="ФИО"
              placeholder="Введите ваше полное имя"/>

            <BaseFormText v-model="formData.address" :error="formError.address"
              title="Адрес доставки" placeholder="Введите ваш адрес"/>

            <BaseFormText v-model="formData.phone" :error="formError.phone" title="Телефон"
              placeholder="Введите ваш телефон" type="tel"/>

            <BaseFormText v-model="formData.email" :error="formError.email" title="Email"
              placeholder="Введи ваш Email" type="email"/>

            <BaseFromTextarea v-model="formData.comments" title="Комментарий к заказу"
              :error="formError.comments" placeholder="Ваши пожелания" />
          </div>

          <div class="cart__options">
            <h3 class="cart__title">Доставка</h3>
            <ul class="cart__options options">
              <li class="options__item">
                <label for="opt" class="options__label">
                  <input id="opt" class="options__radio sr-only" type="radio" name="delivery"
                    value="0" checked="">
                  <span class="options__value">
                    Самовывоз <b>бесплатно</b>
                  </span>
                </label>
              </li>
              <li class="options__item">
                <label for="deliv" class="options__label">
                  <input id="deliv" class="options__radio sr-only" type="radio"
                    name="delivery" value="500">
                  <span class="options__value">
                    Курьером <b>500 ₽</b>
                  </span>
                </label>
              </li>
            </ul>

            <h3 class="cart__title">Оплата</h3>
            <ul class="cart__options options">
              <li class="options__item">
                <label for="pay" class="options__label">
                  <input id="pay" class="options__radio sr-only" type="radio"
                    name="pay" value="card">
                  <span class="options__value">
                    Картой при получении
                  </span>
                </label>
              </li>
              <li class="options__item">
                <label for="cash" class="options__label">
                  <input id="cash" class="options__radio sr-only" type="radio"
                    name="pay" value="cash">
                  <span class="options__value">
                    Наличными при получении
                  </span>
                </label>
              </li>
            </ul>
          </div>
        </div>

        <div class="cart__block">
          <ul class="cart__orders">
            <li v-for="item in products" :key="item.productId" class="cart__order">
              <h3>{{ item.product.title }}, {{ item.amount }} ед.</h3>
              <b>{{ numberFormat(item.product.price * item.amount) }} ₽</b>
              <span>Артикул: {{ item.productId }}</span>
            </li>
          </ul>

          <div class="cart__total">
            <p>Доставка: <b>500 ₽</b></p>
            <p>Итого товаров: <b>{{ totalAmount }}</b> на сумму
              <b>{{ numberFormat(totalPrice) }} ₽</b></p>
          </div>

          <button class="cart__button button button--primery" type="submit">
            Оформить заказ
          </button>
        </div>
        <div class="cart__error form__error-block" style="display: none">
          <h4>Заявка не отправлена!</h4>
          <p>
            Похоже произошла ошибка. Попробуйте отправить снова или перезагрузите страницу.
          </p>
        </div>
      </form>
    </section>
  </main>
</template>

<script>
import numberFormat from '@/helpers/numberFormat';
import { mapGetters } from 'vuex';
import BaseFormText from '@/components/BaseFormText.vue';
import BaseFromTextarea from '@/components/BaseFromTextarea.vue';

export default {
  data() {
    return {
      formData: {},
      formError: {},
    };
  },
  computed: {
    ...mapGetters({ products: 'cartDetailProducts', totalPrice: 'cartTotalPrice', totalAmount: 'cartTotalAmount' }),
    numberFormat,
  },
  components: { BaseFormText, BaseFromTextarea },
};
</script>
