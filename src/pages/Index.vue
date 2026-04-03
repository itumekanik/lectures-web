<template>
  <q-page class="page-bg">

    <!-- Page title bar with formulas -->
    <div class="page-title-bar q-px-lg q-py-sm row items-center no-wrap">
      <div class="col-auto q-mr-lg">
        <div class="text-subtitle1 text-weight-bold text-primary">Displacement Field</div>
        <div class="text-caption text-grey-5">polynomial functions</div>
      </div>
      <q-separator vertical class="q-mr-lg" />
      <div class="col row items-center q-gutter-x-md no-wrap">
        <div class="row items-center no-wrap">
          <q-badge color="primary" class="q-mr-sm badge-label">u</q-badge>
          <vue-mathjax :formula="formula_u" />
        </div>
        <div class="row items-center no-wrap">
          <q-badge color="secondary" class="q-mr-sm badge-label">v</q-badge>
          <vue-mathjax :formula="formula_v" />
        </div>
      </div>
    </div>

    <!-- Main content -->
    <div class="row q-px-lg q-pt-md q-pb-lg q-col-gutter-md">

      <!-- Left: Coefficients -->
      <div class="col-12 col-md-5">
        <q-card class="coeff-card">

          <div class="section-header section-header--primary">
            <q-icon name="tune" size="18px" class="q-mr-xs" />
            Coefficients
          </div>

          <q-card-section class="q-pa-sm">
            <q-markup-table flat dense separator="cell" class="coeff-table">
              <thead>
                <tr>
                  <th class="text-center term-col text-grey-7" style="width: 80px">Term</th>
                  <th class="text-center coeff-col-a">
                    <span class="text-primary text-weight-bold">A</span><sub>i</sub>
                    <div class="col-label">u-field</div>
                  </th>
                  <th class="text-center coeff-col-b">
                    <span class="text-secondary text-weight-bold">B</span><sub>i</sub>
                    <div class="col-label">v-field</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(i, index) in [1, 2, 3, 4, 5, 6]"
                  :key="index"
                  class="coeff-row"
                >
                  <td class="text-center term-cell">
                    <vue-mathjax :formula="termLabels[index]" />
                  </td>
                  <td class="q-pa-xs input-cell-a">
                    <q-input
                      v-model.number="coeffs['A' + i]"
                      type="number"
                      dense
                      outlined
                      input-class="text-center"
                      class="input-a"
                      :step="0.05"
                      color="primary"
                    />
                  </td>
                  <td class="q-pa-xs input-cell-b">
                    <q-input
                      v-model.number="coeffs['B' + i]"
                      type="number"
                      dense
                      outlined
                      input-class="text-center"
                      class="input-b"
                      :step="0.05"
                      color="secondary"
                    />
                  </td>
                </tr>
              </tbody>
            </q-markup-table>
          </q-card-section>

          <q-separator />

          <q-card-actions class="q-pa-sm">
            <q-btn
              label="Reset to Zero"
              @click="SET_ZERO"
              color="negative"
              flat
              icon="restart_alt"
              size="sm"
              class="full-width"
            />
          </q-card-actions>

        </q-card>
      </div>

      <!-- Right: Visualization -->
      <div class="col-12 col-md-7">
        <q-card class="viz-card">

          <div class="section-header section-header--secondary row items-center">
            <q-icon name="scatter_plot" size="18px" class="q-mr-xs" />
            <span>Visualization</span>
            <q-space />
            <div class="state-toggle-group">
              <q-btn
                dense
                flat
                icon="grid_on"
                label="Initial"
                :class="INITIAL ? 'state-btn-active' : 'state-btn'"
                size="sm"
                @click="CLICK_INITIAL"
              />
              <q-btn
                dense
                flat
                icon="blur_on"
                label="Deformed"
                :class="FINAL ? 'state-btn-active' : 'state-btn'"
                size="sm"
                @click="CLICK_FINAL"
              />
            </div>
          </div>

          <!-- Current field formulas (live) -->
          <q-card-section class="q-pa-sm q-pb-xs">
            <div class="result-formula-box">
              <div class="row items-center q-mb-xs">
                <q-badge
                  color="primary"
                  class="q-mr-sm result-badge"
                >u =</q-badge>
                <vue-mathjax :formula="field_u" />
              </div>
              <div class="row items-center">
                <q-badge
                  color="secondary"
                  class="q-mr-sm result-badge"
                >v =</q-badge>
                <vue-mathjax :formula="field_v" />
              </div>
            </div>
          </q-card-section>

          <!-- JSXGraph board -->
          <q-card-section class="q-pa-md q-pt-sm">
            <div
              id="jxgbox"
              class="jxgbox"
            ></div>
          </q-card-section>

        </q-card>
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
    INITIAL() { return this.state === 'INITIAL'; },
    FINAL() { return this.state === 'FINAL'; },
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
      showCopyright: false,
      showNavigation: true,
    });

    for (let y = 0; y < 5; y += 1) {
      for (let x = 0; x < 9; x += 1) {
        points.push(
          brd.create('point', [2.5 * x * 0.1, 2.5 * y * 0.1], {
            name: '',
            face: 'o',
            size: 2,
            strokeColor: '#1565C0',
            fillColor: '#1565C0',
            fillOpacity: 0.8,
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
          points[k].moveTo([2.5 * x * 0.1, 2.5 * y * 0.1], 800);
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
          points[k].moveTo([xx + ux, yy + uy], 800);
          k += 1;
        }
      }
    },
  },
};
</script>

<style scoped>
.page-bg {
  background-color: #F3F5F9;
  min-height: 100vh;
}

.page-title-bar {
  border-bottom: 1px solid #e0e6f0;
  background: #fff;
  min-height: 52px;
  overflow-x: auto;
}

.badge-label {
  font-size: 11px;
  min-width: 20px;
  text-align: center;
}

/* Section headers */
.section-header {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  font-weight: 600;
  font-size: 13px;
  letter-spacing: 0.3px;
  color: white;
  border-radius: 8px 8px 0 0;
}
.section-header--primary {
  background: linear-gradient(90deg, #1565C0, #1976D2);
}
.section-header--secondary {
  background: linear-gradient(90deg, #00695C, #00897B);
}

/* Cards */
.coeff-card,
.viz-card {
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  overflow: hidden;
}

/* Coefficient table */
.coeff-table {
  width: 100%;
}
.coeff-table thead tr {
  background: #F8F9FF;
}
.term-col {
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.coeff-col-a {
  background: #EEF2FF;
  font-size: 13px;
  padding: 8px 4px;
}
.coeff-col-b {
  background: #E8FAF5;
  font-size: 13px;
  padding: 8px 4px;
}
.col-label {
  font-size: 10px;
  font-weight: 400;
  color: #888;
  margin-top: 2px;
}
.coeff-row:hover {
  background: #FAFBFF;
}
.term-cell {
  background: #FAFAFA;
}
.input-cell-a {
  background: #F7F9FF;
}
.input-cell-b {
  background: #F4FBF8;
}

/* State toggle inside visualization header */
.state-toggle-group {
  display: flex;
  background: rgba(255,255,255,0.15);
  border-radius: 6px;
  overflow: hidden;
}
.state-btn {
  color: rgba(255,255,255,0.7) !important;
  border-radius: 0 !important;
  font-size: 11px;
}
.state-btn-active {
  color: white !important;
  background: rgba(255,255,255,0.25) !important;
  border-radius: 0 !important;
  font-size: 11px;
}

/* Live result formulas */
.result-formula-box {
  background: #F8FEFF;
  border: 1px solid #B2DFDB;
  border-radius: 8px;
  padding: 10px 14px;
}
.result-badge {
  font-size: 11px;
  min-width: 28px;
  text-align: center;
}

/* JSXGraph board */
.jxgbox {
  position: relative;
  overflow: hidden;
  background-color: #ffffff;
  border: 1px solid #CFD8DC;
  border-radius: 8px;
  width: 100%;
  aspect-ratio: 1.1 / 1;
  max-height: 420px;
  -ms-touch-action: none;
  touch-action: none;
}

.jxgbox svg text {
  cursor: default;
  user-select: none;
}
</style>
