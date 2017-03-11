import Vue from 'vue';
import Panel from './Panel.vue';
import BootstrapVue from 'bootstrap-vue';

// Globally register bootstrap-vue components
Vue.use(BootstrapVue);

new Vue({ // eslint-disable-line no-new
    el: '#panel',
    render: (h) => h(Panel)
});