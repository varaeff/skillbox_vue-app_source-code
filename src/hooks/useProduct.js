import { API_DIPLOMA_URL } from '@/config';
import axios from 'axios';
import {
  ref, computed, reactive,
} from 'vue';

export default function () {
  const productData = ref(null);
  const category = computed(() => (productData.value.category));
  const colors = computed(() => (productData.value.colors.map((color) => color.color.code)));

  const offers = computed(() => (productData.value.offers.map(
    (value) => (
      {
        price: new Intl.NumberFormat().format(value.price),
        title: value.title,
        propValue: value.propValues[0].value,
        id: value.id,
      }
    ),
  )));

  const fetchStatus = reactive({
    isLoading: false,
    isLoadingFaled: false,
  });

  const fetchProduct = (productId) => {
    fetchStatus.isLoading = true;
    fetchStatus.isLoadingFaled = false;
    if (productId) {
      axios
        .get(`${API_DIPLOMA_URL}/api/products/${productId}`)
        .then((response) => {
          const product = response.data;

          productData.value = Object.assign(product, {
            pricePretty: new Intl.NumberFormat().format(product.price),
          });
        })
        .catch(() => { fetchStatus.isLoadingFaled = true; })
        .then(() => { fetchStatus.isLoading = false; });
    }
  };

  return {
    product: productData,
    category,
    colors,
    status: fetchStatus,
    offers,

    fetchProduct,
  };
}
