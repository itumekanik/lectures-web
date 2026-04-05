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
    <div class="row q-px-lg q-pt-md q-pb-sm q-col-gutter-md">

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

          <div class="section-header--secondary">
            <div class="row items-center q-px-md q-py-xs">
              <q-icon name="scatter_plot" size="18px" class="q-mr-xs text-white" />
              <span class="text-white text-weight-semibold" style="font-size:13px">Visualization</span>
              <q-space />
              <div class="state-toggle-group">
                <q-btn
                  dense flat icon="grid_on" label="Initial"
                  :class="INITIAL ? 'state-btn-active' : 'state-btn'"
                  size="sm" @click="CLICK_INITIAL"
                />
                <q-btn
                  dense flat icon="blur_on" label="Deformed"
                  :class="FINAL ? 'state-btn-active' : 'state-btn'"
                  size="sm" @click="CLICK_FINAL"
                />
              </div>
            </div>
            <!-- Live formulas strip -->
            <div class="formula-strip row items-center q-px-md q-py-xs no-wrap">
              <div class="row items-center no-wrap q-mr-md">
                <q-badge color="primary" class="q-mr-xs result-badge">u</q-badge>
                <vue-mathjax :formula="field_u" />
              </div>
              <div class="row items-center no-wrap">
                <q-badge color="secondary" class="q-mr-xs result-badge">v</q-badge>
                <vue-mathjax :formula="field_v" />
              </div>
            </div>
          </div>

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

    <!-- Strain Analysis Row -->
    <div class="row q-px-lg q-pb-lg q-col-gutter-md">
      <div class="col-12">
        <q-card class="strain-card">

          <div class="section-header section-header--strain">
            <q-icon name="grid_3x3" size="18px" class="q-mr-xs" />
            Infinitesimal Strain Tensor — Point P
          </div>

          <q-card-section class="q-pa-md">
            <div class="row q-col-gutter-md items-start">

              <!-- Column 1: Point & Direction -->
              <div class="col-12 col-md-4">
                <div class="strain-section-label">Reference Point P</div>
                <div class="row q-gutter-sm q-mb-xs">
                  <div class="col">
                    <q-input
                      label="X"
                      :model-value="strainPointX.toFixed(3)"
                      dense outlined readonly
                      label-color="deep-orange"
                    />
                  </div>
                  <div class="col">
                    <q-input
                      label="Y"
                      :model-value="strainPointY.toFixed(3)"
                      dense outlined readonly
                      label-color="deep-orange"
                    />
                  </div>
                </div>
                <div class="strain-hint q-mb-md">
                  <q-icon name="touch_app" size="14px" class="q-mr-xs" />
                  Drag the orange point P on the visualization
                </div>

                <div class="strain-section-label">Direction Angle θ</div>
                <div class="row items-center no-wrap q-mb-xs">
                  <span class="angle-display q-mr-sm">{{ directionAngle }}°</span>
                  <q-slider
                    v-model="directionAngle"
                    :min="0"
                    :max="180"
                    :step="1"
                    color="deep-orange"
                    class="col"
                  />
                </div>
                <div class="strain-hint">
                  n = ({{ nxDisplay }}, {{ nyDisplay }})
                </div>
              </div>

              <!-- Column 2: Strain Tensor -->
              <div class="col-12 col-md-4">
                <div class="strain-section-label text-center">Strain Tensor [ε]</div>
                <div class="tensor-wrapper">
                  <div class="tensor-bracket-left"></div>
                  <table class="tensor-table">
                    <tbody>
                      <tr>
                        <td>
                          <div class="tensor-label">ε<sub>xx</sub></div>
                          <div class="tensor-value">{{ eps_xx.toFixed(5) }}</div>
                        </td>
                        <td>
                          <div class="tensor-label">ε<sub>xy</sub></div>
                          <div class="tensor-value">{{ eps_xy.toFixed(5) }}</div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div class="tensor-label">ε<sub>xy</sub></div>
                          <div class="tensor-value">{{ eps_xy.toFixed(5) }}</div>
                        </td>
                        <td>
                          <div class="tensor-label">ε<sub>yy</sub></div>
                          <div class="tensor-value">{{ eps_yy.toFixed(5) }}</div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div class="tensor-bracket-right"></div>
                </div>

                <q-separator class="q-my-sm" />

                <div class="strain-section-label text-center">Principal Strains</div>
                <div class="row justify-center q-gutter-xs">
                  <q-chip dense size="sm" color="blue-1" text-color="blue-9">
                    ε<sub>1</sub> = {{ eps_principal_1.toFixed(5) }}
                  </q-chip>
                  <q-chip dense size="sm" color="green-1" text-color="green-9">
                    ε<sub>2</sub> = {{ eps_principal_2.toFixed(5) }}
                  </q-chip>
                  <q-chip dense size="sm" color="orange-1" text-color="orange-9">
                    θ<sub>p</sub> = {{ eps_principal_angle.toFixed(1) }}°
                  </q-chip>
                </div>
              </div>

              <!-- Column 3: Normal & Shear Strain -->
              <div class="col-12 col-md-4">
                <div class="strain-section-label text-center">
                  Strain in Direction θ = {{ directionAngle }}°
                </div>

                <div class="normal-strain-box q-mb-sm">
                  <div class="normal-strain-formula">
                    ε<sub>n</sub> = ε<sub>xx</sub>cos²θ + 2ε<sub>xy</sub>cosθ sinθ + ε<sub>yy</sub>sin²θ
                  </div>
                  <div class="normal-strain-label">Normal strain</div>
                  <div class="normal-strain-value">{{ eps_normal.toFixed(6) }}</div>
                </div>

                <div class="shear-strain-box q-mb-sm">
                  <div class="shear-formula">
                    γ<sub>ns</sub>/2 = (ε<sub>yy</sub>−ε<sub>xx</sub>)cosθ sinθ + ε<sub>xy</sub>(cos²θ−sin²θ)
                  </div>
                  <div class="shear-strain-label">Shear strain</div>
                  <div class="shear-value">{{ eps_shear.toFixed(6) }}</div>
                </div>

                <div class="text-center">
                  <q-chip dense color="deep-orange-1" text-color="deep-orange-9" size="sm">
                    Max shear: γ<sub>max</sub>/2 = {{ eps_max_shear.toFixed(5) }}
                  </q-chip>
                </div>
              </div>

            </div>
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
      // Strain analysis
      strainPointX: 0.5,
      strainPointY: 0.5,
      directionAngle: 0,
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

    // Strain tensor at point P
    // u = A1 + A2*X + A3*Y + A4*X² + A5*Y² + A6*X*Y
    // v = B1 + B2*X + B3*Y + B4*X² + B5*Y² + B6*X*Y
    // εxx = ∂u/∂X = A2 + 2*A4*X + A6*Y
    // εyy = ∂v/∂Y = B3 + 2*B5*Y + B6*X
    // εxy = ½(∂u/∂Y + ∂v/∂X) = ½(A3 + 2*A5*Y + A6*X + B2 + 2*B4*X + B6*Y)
    eps_xx() {
      const X = this.strainPointX;
      const Y = this.strainPointY;
      return this.A2 + 2 * this.A4 * X + this.A6 * Y;
    },
    eps_yy() {
      const X = this.strainPointX;
      const Y = this.strainPointY;
      return this.B3 + 2 * this.B5 * Y + this.B6 * X;
    },
    eps_xy() {
      const X = this.strainPointX;
      const Y = this.strainPointY;
      const dudy = this.A3 + 2 * this.A5 * Y + this.A6 * X;
      const dvdx = this.B2 + 2 * this.B4 * X + this.B6 * Y;
      return 0.5 * (dudy + dvdx);
    },

    // Direction vector components
    nxDisplay() { return Math.cos(this.directionAngle * Math.PI / 180).toFixed(3); },
    nyDisplay() { return Math.sin(this.directionAngle * Math.PI / 180).toFixed(3); },

    // Normal strain in direction n=(cosθ, sinθ)
    // εn = εxx*cos²θ + 2*εxy*cosθ*sinθ + εyy*sin²θ
    eps_normal() {
      const theta = this.directionAngle * Math.PI / 180;
      const c = Math.cos(theta);
      const s = Math.sin(theta);
      return this.eps_xx * c * c + 2 * this.eps_xy * c * s + this.eps_yy * s * s;
    },

    // Shear strain γns/2 in direction n, perpendicular s=(-sinθ, cosθ)
    // γns/2 = (εyy - εxx)*cosθ*sinθ + εxy*(cos²θ - sin²θ)
    eps_shear() {
      const theta = this.directionAngle * Math.PI / 180;
      const c = Math.cos(theta);
      const s = Math.sin(theta);
      return (this.eps_yy - this.eps_xx) * c * s + this.eps_xy * (c * c - s * s);
    },

    // Principal strains: ε1,2 = (εxx+εyy)/2 ± R, R = √[((εxx-εyy)/2)² + εxy²]
    eps_radius() {
      return Math.sqrt(((this.eps_xx - this.eps_yy) / 2) ** 2 + this.eps_xy ** 2);
    },
    eps_principal_1() {
      return (this.eps_xx + this.eps_yy) / 2 + this.eps_radius;
    },
    eps_principal_2() {
      return (this.eps_xx + this.eps_yy) / 2 - this.eps_radius;
    },
    // Principal angle: θp = ½ arctan(2εxy / (εxx - εyy))
    eps_principal_angle() {
      return 0.5 * Math.atan2(2 * this.eps_xy, this.eps_xx - this.eps_yy) * 180 / Math.PI;
    },
    // Max shear strain (half)
    eps_max_shear() {
      return this.eps_radius;
    },
  },

  watch: {
    coeffs: {
      deep: true,
      handler() {
        this.SET_INITIAL();
      },
    },
    directionAngle() {
      this.updateDirArrow();
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

    // Analysis point P (orange, draggable)
    this.boardObj = brd;
    this.strainPt = brd.create('point', [0.5, 0.5], {
      name: 'P',
      size: 6,
      fillColor: '#FF6D00',
      strokeColor: '#BF360C',
      fillOpacity: 0.9,
      strokeWidth: 2,
      label: {
        offset: [8, 6],
        fontSize: 13,
        fontWeight: 'bold',
        strokeColor: '#FF6D00',
      },
      cursor: 'pointer',
    });

    // Hidden anchor point for direction arrow tip
    this.dirEndPt = brd.create('point', [0.65, 0.5], {
      visible: false,
      fixed: false,
    });

    // Direction arrow
    brd.create('arrow', [this.strainPt, this.dirEndPt], {
      strokeColor: '#FF6D00',
      strokeWidth: 2.5,
      lastArrow: { type: 1, size: 8 },
      fixed: true,
    });

    this.strainPt.on('drag', () => {
      this.strainPointX = this.strainPt.X();
      this.strainPointY = this.strainPt.Y();
      this.updateDirArrow();
    });

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
    updateDirArrow() {
      if (!this.dirEndPt || !this.boardObj) return;
      const len = 0.18;
      const theta = this.directionAngle * Math.PI / 180;
      const ex = this.strainPointX + len * Math.cos(theta);
      const ey = this.strainPointY + len * Math.sin(theta);
      this.dirEndPt.setPosition(JXG.COORDS_BY_USER, [ex, ey]);
      this.boardObj.update();
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
  border-radius: 8px 8px 0 0;
}
.section-header--strain {
  background: linear-gradient(90deg, #BF360C, #E64A19);
}

.formula-strip {
  background: #E8F5E9;
  border-top: 1px solid rgba(0,0,0,0.1);
  font-size: 12px;
  overflow-x: auto;
}

/* Cards */
.coeff-card,
.viz-card,
.strain-card {
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

/* ── Strain analysis ── */

.strain-section-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #BF360C;
  margin-bottom: 6px;
}

.strain-hint {
  font-size: 11px;
  color: #999;
  line-height: 1.4;
}

.angle-display {
  font-size: 17px;
  font-weight: 700;
  color: #E64A19;
  min-width: 44px;
  font-family: 'Roboto Mono', monospace;
}

/* Tensor matrix */
.tensor-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 8px 0 4px;
}

.tensor-bracket-left {
  width: 8px;
  height: 80px;
  border: 2px solid #8D6E63;
  border-right: none;
  border-radius: 3px 0 0 3px;
  margin-right: 4px;
}

.tensor-bracket-right {
  width: 8px;
  height: 80px;
  border: 2px solid #8D6E63;
  border-left: none;
  border-radius: 0 3px 3px 0;
  margin-left: 4px;
}

.tensor-table {
  border-collapse: separate;
  border-spacing: 5px;
}

.tensor-table td {
  text-align: center;
  padding: 6px 14px;
  background: #FFF3E0;
  border-radius: 4px;
  min-width: 90px;
}

.tensor-label {
  font-size: 10px;
  color: #A1887F;
  margin-bottom: 2px;
}

.tensor-value {
  font-size: 14px;
  font-weight: 700;
  color: #BF360C;
  font-family: 'Roboto Mono', monospace;
}

/* Normal strain box */
.normal-strain-box {
  background: #FFF3E0;
  border-radius: 8px;
  padding: 10px 14px;
  text-align: center;
  border-left: 4px solid #E64A19;
}

.normal-strain-formula {
  font-size: 10px;
  color: #A1887F;
  margin-bottom: 4px;
}

.normal-strain-label {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  color: #BF360C;
  letter-spacing: 0.3px;
  margin-bottom: 2px;
}

.normal-strain-value {
  font-size: 22px;
  font-weight: 700;
  color: #BF360C;
  font-family: 'Roboto Mono', monospace;
  letter-spacing: 1px;
}

/* Shear strain box */
.shear-strain-box {
  background: #FBE9E7;
  border-radius: 8px;
  padding: 10px 14px;
  text-align: center;
  border-left: 4px solid #FF7043;
}

.shear-formula {
  font-size: 10px;
  color: #A1887F;
  margin-bottom: 4px;
}

.shear-strain-label {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  color: #D84315;
  letter-spacing: 0.3px;
  margin-bottom: 2px;
}

.shear-value {
  font-size: 22px;
  font-weight: 700;
  color: #D84315;
  font-family: 'Roboto Mono', monospace;
  letter-spacing: 1px;
}
</style>
