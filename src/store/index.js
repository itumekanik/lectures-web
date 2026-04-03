import { store } from 'quasar/wrappers';
import { createStore } from 'vuex';

export default store(function (/* { ssrContext } */) {
  return createStore({
    modules: {},
    strict: process.env.DEBUGGING,
  });
});
