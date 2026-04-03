import { boot } from 'quasar/wrappers';
import { defineComponent, h } from 'vue';

const MathFormulaComponent = defineComponent({
  name: 'vue-mathjax',
  props: {
    formula: {
      type: String,
      required: true,
    },
  },
  render() {
    return h('div', this.formula);
  },
  mounted() {
    this.typeset();
  },
  watch: {
    formula(val) {
      this.$el.textContent = val;
      this.typeset();
    },
  },
  methods: {
    typeset() {
      if (window.MathJax && window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise([this.$el]);
      } else {
        window.addEventListener('mathjax-ready', () => {
          if (this.$el) {
            window.MathJax.typesetPromise([this.$el]);
          }
        }, { once: true });
      }
    },
  },
});

export default boot(({ app }) => {
  app.component('vue-mathjax', MathFormulaComponent);
});
