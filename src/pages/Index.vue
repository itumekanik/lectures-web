<template>
  <q-page class="my_page">
    <div class="page_container">

      <div class="text-h5 text-weight-medium text-primary q-pa-md q-pb-none">
        Displacement Field
      </div>
      <div class="text-caption text-grey-6 q-px-md q-pb-sm">
        u(X,Y) and v(X,Y) polynomial displacement functions
      </div>

      <div class="row q-pa-md q-col-gutter-md">

        <!-- Left: Coefficients -->
        <div class="col-12 col-md-6">
          <q-card flat bordered class="full-height">
            <q-card-section class="q-pb-xs">
              <div class="text-subtitle2 text-grey-7 q-mb-sm">Coefficients</div>
              <vue-mathjax :formula="formula_u" />
              <vue-mathjax :formula="formula_v" />
            </q-card-section>

            <q-card-section class="q-pt-xs">
              <q-markup-table flat dense>
                <thead>
                  <tr>
                    <th class="text-left text-grey-7">Term</th>
                    <th class="text-center text-primary">A<sub>i</sub></th>
                    <th class="text-center text-secondary">B<sub>i</sub></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(i, index) in [1, 2, 3, 4, 5, 6]" :key="index">
                    <td class="text-left">
                      <vue-mathjax :formula="termLabels[index]" />
                    </td>
                    <td class="text-center">
                      <q-input
                        v-model.number="coeffs['A' + i]"
                        type="number"
                        dense
                        outlined
                        input-class="text-center"
                        style="min-width: 80px"
                        :step="0.05"
                      />
                    </td>
                    <td class="text-center">
                      <q-input
                        v-model.number="coeffs['B' + i]"
                        type="number"
                        dense
                        outlined
                        input-class="text-center"
                        style="min-width: 80px"
                        :step="0.05"
                      />
                    </td>
                  </tr>
                </tbody>
              </q-markup-table>
            </q-card-section>

            <q-card-actions class="q-px-md q-pb-md">
              <q-btn
                label="Reset to Zero"
                @click="SET_ZERO"
                color="negative"
                outline
                icon="restart_alt"
                size="sm"
              />
            </q-card-actions>
          </q-card>
        </div>

        <!-- Right: Visualization -->
        <div class="col-12 col-md-6">
          <q-card flat bordered class="full-height">
            <q-card-section class="q-pb-xs">
              <div class="text-subtitle2 text-grey-7 q-mb-sm">Visualization</div>

              <div class="row q-gutter-sm q-mb-sm">
                <q-btn
                  @click="CLICK_INITIAL"
                  :color="INITIAL ? 'primary' : 'grey-4'"
                  :text-color="INITIAL ? 'white' : 'grey-8'"
                  :unelevated="INITIAL"
                  :outline="!INITIAL"
                  icon="grid_on"
                  label="Initial"
                  size="sm"
                />
                <q-btn
                  @click="CLICK_FINAL"
                  :color="FINAL ? 'secondary' : 'grey-4'"
                  :text-color="FINAL ? 'white' : 'grey-8'"
                  :unelevated="FINAL"
                  :outline="!FINAL"
                  icon="blur_on"
                  label="Deformed"
                  size="sm"
                />
                <q-space />
                <q-btn
                  @click="CLICK_FINAL"
                  flat
                  round
                  dense
                  icon="refresh"
                  color="grey-6"
                  size="sm"
                >
                  <q-tooltip>Re-apply deformation</q-tooltip>
                </q-btn>
              </div>

              <q-card flat bordered class="formula-card q-mb-sm">
                <q-card-section class="q-pa-sm">
                  <vue-mathjax :formula="field_u" />
                  <vue-mathjax :formula="field_v" />
                </q-card-section>
              </q-card>
            </q-card-section>

            <q-card-section class="q-pt-xs">
              <div
                id="jxgbox"
                class="jxgbox"
                style="width: 100%; max-width: 500px; min-height: 400px"
              ></div>
            </q-card-section>
          </q-card>
        </div>

      </div>
    </div>
  </q-page>
</template>

<script>
import JXG from 'jsxgraph';

const points = [];
const PF = (val) => (val !== '' && val !== null && val !== undefined ? parseFloat(val) : 0);

const format = (a) => {
  if (a == 1) return '';
  if (a == -1) return '-';
  return `${a}`;
};

const helper = (prev, current, txt) => {
  if (current) {
    return (current > 0 && prev ? '+' : '') + format(current) + txt;
  }
  return '';
};

export default {
  name: 'PageIndex',
  components: {},
  data() {
    return {
      state: 'INITIAL',
      formula_u: '$$u(X,Y)=A_{1}+A_{2}X+A_{3}Y+A_{4}X^2+A_{5}Y^2+A_{6}XY$$',
      formula_v: '$$v(X,Y)=B_{1}+B_{2}X+B_{3}Y+B_{4}X^2+B_{5}Y^2+B_{6}XY$$',
      termLabels: [
        '$$1$$',
        '$$X$$',
        '$$Y$$',
        '$$X^2$$',
        '$$Y^2$$',
        '$$XY$$',
      ],
      coeffs: {
        A1: 0.5,
        A2: 0.2,
        A3: 0.25,
        A4: 0,
        A5: 0,
        A6: 0,
        B1: 0.25,
        B2: -0.10,
        B3: 0,
        B4: 0.15,
        B5: 0,
        B6: -0.2,
      },
    };
  },
  computed: {
    field_u() {
      let s = '';
      if (this.A1) s += this.A1;
      s += helper(s, this.A2, 'X');
      s += helper(s, this.A3, 'Y');
      s += helper(s, this.A4, 'X^2');
      s += helper(s, this.A5, 'Y^2');
      s += helper(s, this.A6, 'X Y');
      s += s ? '' : '0';
      s += '$$';
      return `$$u=${s}`;
    },
    field_v() {
      let s = '';
      if (this.B1) s += this.B1;
      s += helper(s, this.B2, 'X');
      s += helper(s, this.B3, 'Y');
      s += helper(s, this.B4, 'X^2');
      s += helper(s, this.B5, 'Y^2');
      s += helper(s, this.B6, 'X Y');
      s += s ? '' : '0';
      s += '$$';
      return `$$v=${s}`;
    },
    INITIAL() {
      return this.state === 'INITIAL';
    },
    FINAL() {
      return this.state === 'FINAL';
    },
    A1() { return PF(this.coeffs.A1); },
    A2() { return PF(this.coeffs.A2); },
    A3() { return PF(this.coeffs.A3); },
    A4() { return PF(this.coeffs.A4); },
    A5() { return PF(this.coeffs.A5); },
    A6() { return PF(this.coeffs.A6); },
    B1() { return PF(this.coeffs.B1); },
    B2() { return PF(this.coeffs.B2); },
    B3() { return PF(this.coeffs.B3); },
    B4() { return PF(this.coeffs.B4); },
    B5() { return PF(this.coeffs.B5); },
    B6() { return PF(this.coeffs.B6); },
  },

  watch: {
    coeffs: {
      deep: true,
      handler() {
        this.SET_INITIAL();
      },
    },
  },

  mounted() {
    const brd = JXG.JSXGraph.initBoard('jxgbox', {
      boundingbox: [-0.5, 2.5, 1.0, -0.5],
      keepaspectratio: true,
      axis: true,
    });

    for (let y = 0; y < 5; y += 1) {
      for (let x = 0; x < 9; x += 1) {
        points.push(
          brd.create('point', [2.5 * x * 0.1, 2.5 * y * 0.1], {
            name: '',
            face: 'o',
            size: 1,
            strokeColor: 'black',
            fillColor: 'black',
            fillOpacity: 1,
            strokeOpacity: 1,
          }),
        );
      }
    }

    setTimeout(() => {
      this.CLICK_FINAL();
    }, 1000);
  },

  methods: {
    SET_ZERO() {
      Object.keys(this.coeffs).forEach((k) => {
        this.coeffs[k] = 0;
      });
    },
    SET_INITIAL() {
      this.state = 'INITIAL';
      let k = 0;
      for (let y = 0; y < 5; y += 1) {
        for (let x = 0; x < 9; x += 1) {
          points[k].moveTo([2.5 * x * 0.1, 2.5 * y * 0.1], 1);
          k += 1;
        }
      }
    },
    CLICK_INITIAL() {
      this.state = 'INITIAL';
      let k = 0;
      for (let y = 0; y < 5; y += 1) {
        for (let x = 0; x < 9; x += 1) {
          points[k].moveTo([2.5 * x * 0.1, 2.5 * y * 0.1], 1000);
          k += 1;
        }
      }
    },
    CLICK_FINAL() {
      this.state = 'FINAL';
      let k = 0;
      for (let y = 0; y < 5; y += 1) {
        for (let x = 0; x < 9; x += 1) {
          const xx = 2.5 * x * 0.1;
          const yy = 2.5 * y * 0.1;
          const {
            A1, A2, A3, A4, A5, A6, B1, B2, B3, B4, B5, B6,
          } = this;
          const ux = A1 + A2 * xx + A3 * yy + A4 * xx * xx + A5 * yy * yy + A6 * xx * yy;
          const uy = B1 + B2 * xx + B3 * yy + B4 * xx * xx + B5 * yy * yy + B6 * xx * yy;
          points[k].moveTo([xx + ux, yy + uy], 1000);
          k += 1;
        }
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
.my_page {
  background-color: $grey-2;
}

.page_container {
  width: 100%;
}
</style>

<style scoped>
.formula-card {
  min-height: 60px;
  overflow: auto;
}

.jxgbox {
  position: relative;
  overflow: hidden;
  background-color: #ffffff;
  border-style: solid;
  border-width: 1px;
  border-color: #356aa0;
  border-radius: 10px;
  -webkit-border-radius: 10px;
  -ms-touch-action: none;
}

.jxgbox svg text {
  cursor: default;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.JXGtext {
  font-family: Courier, monospace;
  background-color: transparent;
  padding: 0;
  margin: 0;
}

.JXGinfobox {
  border-style: none;
  border-width: 1px;
  border-color: black;
}

.JXG_navigation {
  position: absolute;
  right: 5px;
  bottom: 5px;
  z-index: 100;
  background-color: transparent;
  padding: 2px;
  font-size: 14px;
  cursor: pointer;
}

.JXG_navigation_button {
  color: #666666;
}

.JXG_navigation_button:hover {
  border-radius: 2px;
  background-color: rgba(184, 184, 184, 0.5);
}

.JXG_wrap_private:-moz-full-screen { background-color: #cccccc; padding: 0; width: 100%; height: 100%; }
.JXG_wrap_private:-webkit-full-screen { background-color: #cccccc; padding: 0; width: 100%; height: 100%; }
.JXG_wrap_private:fullscreen { background-color: #cccccc; padding: 0; width: 100%; height: 100%; }
.JXG_wrap_private:-ms-fullscreen { background-color: #cccccc; padding: 0; width: 100%; height: 100%; }
</style>
