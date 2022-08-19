import { createApp } from 'vue';
import App from './App.vue';

import { message1, message2 } from './data_3_2';
import PrintAllert from './function_3_2';

createApp(App).mount('#app');

PrintAllert(message1);
PrintAllert(message2);
