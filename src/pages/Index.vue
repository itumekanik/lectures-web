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
            <div id="jxgbox" class="jxgbox"></div>
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
            <q-space />
            <span style="font-size:11px; opacity:0.85">
              dashed cross = reference &nbsp;|&nbsp; solid cross = deformed
            </span>
          </div>

          <q-card-section class="q-pa-md">
            <div class="row q-col-gutter-md items-start">

              <!-- Column 1: Point & Direction -->
              <div class="col-12 col-md-3">
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
              <div class="col-12 col-md-3">
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

              <!-- Column 3: Normal strains in n and s -->
              <div class="col-12 col-md-3">
                <div class="strain-section-label text-center">
                  Arm Lengths &amp; Normal Strains
                </div>

                <!-- n-arm (red) -->
                <div class="arm-box arm-box--n q-mb-sm">
                  <div class="arm-box-header" style="color:#E53935">
                    <span class="arm-dot arm-dot--n"></span>
                    n-arm &nbsp;(θ = {{ directionAngle }}°)
                  </div>
                  <div class="arm-row">
                    <span class="arm-key">stretch λ<sub>n</sub></span>
                    <span class="arm-val">{{ stretchN.toFixed(6) }}</span>
                  </div>
                  <div class="arm-row">
                    <span class="arm-key">ε<sub>n</sub> = λ−1</span>
                    <span class="arm-val">{{ eps_normal.toFixed(6) }}</span>
                  </div>
                </div>

                <!-- s-arm (purple) -->
                <div class="arm-box arm-box--s q-mb-sm">
                  <div class="arm-box-header" style="color:#7B1FA2">
                    <span class="arm-dot arm-dot--s"></span>
                    s-arm &nbsp;(θ+90° = {{ directionAngle + 90 }}°)
                  </div>
                  <div class="arm-row">
                    <span class="arm-key">stretch λ<sub>s</sub></span>
                    <span class="arm-val">{{ stretchS.toFixed(6) }}</span>
                  </div>
                  <div class="arm-row">
                    <span class="arm-key">ε<sub>s</sub> = λ−1</span>
                    <span class="arm-val">{{ eps_normal_s.toFixed(6) }}</span>
                  </div>
                </div>

                <div class="text-center">
                  <q-chip dense color="deep-orange-1" text-color="deep-orange-9" size="sm">
                    Max shear &nbsp;γ<sub>max</sub>/2 = {{ eps_max_shear.toFixed(5) }}
                  </q-chip>
                </div>
              </div>

              <!-- Column 4: Angle change (gamma) -->
              <div class="col-12 col-md-3">
                <div class="strain-section-label text-center">
                  Angle Between Arms
                </div>

                <!-- Angle visual -->
                <div class="angle-visual-box q-mb-sm">
                  <div class="angle-arc-display">
                    <!--
                      Schematic: n-arm fixed pointing right (+x).
                      s-arm at deformedAngleDeg CCW from n-arm.
                      Reference 90° shown as dashed vertical.
                      Orange arc = actual deformed angle between arms.
                    -->
                    <svg viewBox="0 0 90 90" width="90" height="90">
                      <!-- reference 90°: horizontal (n ref) + vertical (s ref) dashed -->
                      <line x1="40" y1="45" x2="75" y2="45"
                            stroke="#ccc" stroke-width="1.5" stroke-dasharray="3,2" />
                      <line x1="40" y1="45" x2="40" y2="10"
                            stroke="#ccc" stroke-width="1.5" stroke-dasharray="3,2" />
                      <!-- small square marker for 90° reference -->
                      <rect x="40" y="37" width="6" height="6"
                            fill="none" stroke="#ccc" stroke-width="1" />

                      <!-- orange arc = deformed angle between arms -->
                      <path :d="svgArcPath" fill="rgba(230,74,25,0.15)" stroke="#E64A19" stroke-width="1.5" />

                      <!-- n-arm: fixed pointing right (red) -->
                      <line x1="40" y1="45" x2="75" y2="45"
                            stroke="#E53935" stroke-width="2.5" />
                      <!-- s-arm: deformedAngleDeg CCW from n-arm (purple) -->
                      <line x1="40" y1="45"
                            :x2="40 + 32 * Math.cos(deformedAngleDeg * Math.PI / 180)"
                            :y2="45 - 32 * Math.sin(deformedAngleDeg * Math.PI / 180)"
                            stroke="#7B1FA2" stroke-width="2.5" />

                      <!-- labels -->
                      <text x="76" y="48" font-size="10" fill="#E53935" font-weight="bold">n</text>
                      <text
                        :x="40 + 36 * Math.cos(deformedAngleDeg * Math.PI / 180)"
                        :y="45 - 36 * Math.sin(deformedAngleDeg * Math.PI / 180)"
                        font-size="10" fill="#7B1FA2" font-weight="bold" text-anchor="middle">s</text>

                      <!-- angle value -->
                      <text x="45" y="72" text-anchor="middle" font-size="11" fill="#E64A19" font-weight="bold">
                        {{ deformedAngleDeg.toFixed(2) }}°
                      </text>
                    </svg>
                  </div>
                </div>

                <div class="angle-info-box q-mb-xs">
                  <div class="angle-info-row">
                    <span class="angle-info-key">Reference angle</span>
                    <span class="angle-info-val">90.000°</span>
                  </div>
                  <div class="angle-info-row">
                    <span class="angle-info-key">Deformed angle</span>
                    <span class="angle-info-val text-deep-orange">{{ deformedAngleDeg.toFixed(4) }}°</span>
                  </div>
                  <div class="angle-info-row">
                    <span class="angle-info-key">Δ angle (= −γ<sub>ns</sub>·180/π)</span>
                    <span class="angle-info-val" :class="gammaNsDeg >= 0 ? 'text-negative' : 'text-positive'">
                      {{ (deformedAngleDeg - 90).toFixed(4) }}°
                    </span>
                  </div>
                  <div class="angle-info-row">
                    <span class="angle-info-key">γ<sub>ns</sub> (eng. shear)</span>
                    <span class="angle-info-val text-deep-orange">{{ gammaNs.toFixed(6) }}</span>
                  </div>
                  <div class="angle-info-row">
                    <span class="angle-info-key">2ε<sub>xy,θ</sub> (tensor×2)</span>
                    <span class="angle-info-val text-grey-7">{{ (2 * eps_shear).toFixed(6) }}</span>
                  </div>
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
        '$$1$$', '$$X$$', '$$Y$$', '$$X^2$$', '$$Y^2$$', '$$XY$$',
      ],
      coeffs: {
        A1: 0.5,  A2: 0.2,   A3: 0.25, A4: 0,
        A5: 0,    A6: 0,
        B1: 0.25, B2: -0.10, B3: 0,    B4: 0.15,
        B5: 0,    B6: -0.2,
      },
      strainPointX: 0.5,
      strainPointY: 0.5,
      directionAngle: 0,
      strainLen: 0.18,
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

    // Strain tensor components at P
    // εxx = ∂u/∂X, εyy = ∂v/∂Y, εxy = ½(∂u/∂Y + ∂v/∂X)
    eps_xx() {
      const X = this.strainPointX; const Y = this.strainPointY;
      return this.A2 + 2 * this.A4 * X + this.A6 * Y;
    },
    eps_yy() {
      const X = this.strainPointX; const Y = this.strainPointY;
      return this.B3 + 2 * this.B5 * Y + this.B6 * X;
    },
    eps_xy() {
      const X = this.strainPointX; const Y = this.strainPointY;
      const dudy = this.A3 + 2 * this.A5 * Y + this.A6 * X;
      const dvdx = this.B2 + 2 * this.B4 * X + this.B6 * Y;
      return 0.5 * (dudy + dvdx);
    },

    nxDisplay() { return Math.cos(this.directionAngle * Math.PI / 180).toFixed(3); },
    nyDisplay() { return Math.sin(this.directionAngle * Math.PI / 180).toFixed(3); },

    // Normal strain in n=(cosθ, sinθ): εn = εxx·cos²θ + 2εxy·cosθ·sinθ + εyy·sin²θ
    eps_normal() {
      const theta = this.directionAngle * Math.PI / 180;
      const c = Math.cos(theta); const s = Math.sin(theta);
      return this.eps_xx * c * c + 2 * this.eps_xy * c * s + this.eps_yy * s * s;
    },

    // Normal strain in s=(-sinθ, cosθ): εs = εxx·sin²θ − 2εxy·cosθ·sinθ + εyy·cos²θ
    eps_normal_s() {
      const theta = this.directionAngle * Math.PI / 180;
      const c = Math.cos(theta); const s = Math.sin(theta);
      return this.eps_xx * s * s - 2 * this.eps_xy * c * s + this.eps_yy * c * c;
    },

    // Tensor shear component: γns/2 = (εyy−εxx)·cosθ·sinθ + εxy·(cos²θ−sin²θ)
    eps_shear() {
      const theta = this.directionAngle * Math.PI / 180;
      const c = Math.cos(theta); const s = Math.sin(theta);
      return (this.eps_yy - this.eps_xx) * c * s + this.eps_xy * (c * c - s * s);
    },

    // Principal strains
    eps_radius() {
      return Math.sqrt(((this.eps_xx - this.eps_yy) / 2) ** 2 + this.eps_xy ** 2);
    },
    eps_principal_1() { return (this.eps_xx + this.eps_yy) / 2 + this.eps_radius; },
    eps_principal_2() { return (this.eps_xx + this.eps_yy) / 2 - this.eps_radius; },
    eps_principal_angle() {
      return 0.5 * Math.atan2(2 * this.eps_xy, this.eps_xx - this.eps_yy) * 180 / Math.PI;
    },
    eps_max_shear() { return this.eps_radius; },

    // Deformation gradient helpers at P
    _F() {
      const X = this.strainPointX; const Y = this.strainPointY;
      return {
        dudx: this.A2 + 2 * this.A4 * X + this.A6 * Y,
        dudy: this.A3 + 2 * this.A5 * Y + this.A6 * X,
        dvdx: this.B2 + 2 * this.B4 * X + this.B6 * Y,
        dvdy: this.B3 + 2 * this.B5 * Y + this.B6 * X,
      };
    },

    // Stretch λₙ = |F·n|
    stretchN() {
      const theta = this.directionAngle * Math.PI / 180;
      const cn = Math.cos(theta); const sn = Math.sin(theta);
      const { dudx, dudy, dvdx, dvdy } = this._F;
      const Fnx = (1 + dudx) * cn + dudy * sn;
      const Fny = dvdx * cn + (1 + dvdy) * sn;
      return Math.sqrt(Fnx * Fnx + Fny * Fny);
    },

    // Stretch λₛ = |F·s|
    stretchS() {
      const theta = this.directionAngle * Math.PI / 180;
      const cs = -Math.sin(theta); const ss = Math.cos(theta);
      const { dudx, dudy, dvdx, dvdy } = this._F;
      const Fsx = (1 + dudx) * cs + dudy * ss;
      const Fsy = dvdx * cs + (1 + dvdy) * ss;
      return Math.sqrt(Fsx * Fsx + Fsy * Fsy);
    },

    // Actual angle between deformed n and s arms (degrees)
    deformedAngleDeg() {
      const theta = this.directionAngle * Math.PI / 180;
      const cn = Math.cos(theta); const sn = Math.sin(theta);
      const cs = -sn; const ss = cn;
      const { dudx, dudy, dvdx, dvdy } = this._F;
      const Fnx = (1 + dudx) * cn + dudy * sn;
      const Fny = dvdx * cn + (1 + dvdy) * sn;
      const Fsx = (1 + dudx) * cs + dudy * ss;
      const Fsy = dvdx * cs + (1 + dvdy) * ss;
      const dot = Fnx * Fsx + Fny * Fsy;
      const mag1 = Math.sqrt(Fnx * Fnx + Fny * Fny);
      const mag2 = Math.sqrt(Fsx * Fsx + Fsy * Fsy);
      return Math.acos(Math.max(-1, Math.min(1, dot / (mag1 * mag2)))) * 180 / Math.PI;
    },

    // Engineering shear strain γns = π/2 − angle(F·n, F·s) [radians, dimensionless]
    gammaNs() {
      return (Math.PI / 2) - this.deformedAngleDeg * Math.PI / 180;
    },

    gammaNsDeg() {
      return 90 - this.deformedAngleDeg;
    },

    // SVG arc path: sector from 0° (n-arm, pointing right) to deformedAngleDeg (CCW).
    // SVG origin (40,45), y-axis flipped → subtract sin for y.
    svgArcPath() {
      const angleDeg = this.deformedAngleDeg;
      const r = 18;
      const cx = 40; const cy = 45;
      // start = 0° (right)
      const x1 = cx + r;
      const y1 = cy;
      // end = deformedAngleDeg CCW
      const rad = angleDeg * Math.PI / 180;
      const x2 = cx + r * Math.cos(rad);
      const y2 = cy - r * Math.sin(rad);
      const largeArc = angleDeg > 180 ? 1 : 0;
      return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 0 ${x2} ${y2} Z`;
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
      this.updateStrainGauge(false);
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

    this.boardObj = brd;

    // ── Draggable reference point P ──────────────────────────────────────────
    this.strainPt = brd.create('point', [0.5, 0.5], {
      name: 'P',
      size: 6,
      fillColor: '#FF6D00',
      strokeColor: '#BF360C',
      fillOpacity: 0.9,
      strokeWidth: 2,
      label: { offset: [8, 6], fontSize: 13, fontWeight: 'bold', strokeColor: '#FF6D00' },
      cursor: 'pointer',
      zIndex: 10,
    });

    // ── Strain gauge cross ───────────────────────────────────────────────────
    const len = this.strainLen;
    const th0 = this.directionAngle * Math.PI / 180;
    const cx0 = this.strainPointX;
    const cy0 = this.strainPointY;

    const ptOpts = { visible: false, fixed: false, name: '' };
    const dotOpts = () => ({
      visible: false, fixed: false, name: '',
    });

    // Reference cross anchor points (gray dashed, always at P + initial directions)
    this.refA = brd.create('point', [cx0 - len * Math.cos(th0), cy0 - len * Math.sin(th0)], ptOpts);
    this.refB = brd.create('point', [cx0 + len * Math.cos(th0), cy0 + len * Math.sin(th0)], ptOpts);
    this.refC = brd.create('point', [cx0 - len * Math.sin(th0), cy0 + len * Math.cos(th0)], ptOpts);
    this.refD = brd.create('point', [cx0 + len * Math.sin(th0), cy0 - len * Math.cos(th0)], ptOpts);

    // Deformed cross tip points (colored, animated)
    this.tipA = brd.create('point', [cx0 - len * Math.cos(th0), cy0 - len * Math.sin(th0)], dotOpts());
    this.tipB = brd.create('point', [cx0 + len * Math.cos(th0), cy0 + len * Math.sin(th0)], dotOpts());
    this.tipC = brd.create('point', [cx0 - len * Math.sin(th0), cy0 + len * Math.cos(th0)], dotOpts());
    this.tipD = brd.create('point', [cx0 + len * Math.sin(th0), cy0 - len * Math.cos(th0)], dotOpts());

    // Reference segments — gray dashed
    brd.create('segment', [this.refA, this.refB], {
      strokeColor: '#bbb', strokeWidth: 1.5, dash: 2, strokeOpacity: 0.75,
      highlight: false,
    });
    brd.create('segment', [this.refC, this.refD], {
      strokeColor: '#bbb', strokeWidth: 1.5, dash: 2, strokeOpacity: 0.75,
      highlight: false,
    });

    // Deformed segments — colored solid
    brd.create('segment', [this.tipA, this.tipB], {
      strokeColor: '#E53935', strokeWidth: 2.5, highlight: false,
    });
    brd.create('segment', [this.tipC, this.tipD], {
      strokeColor: '#7B1FA2', strokeWidth: 2.5, highlight: false,
    });

    // Center of cross = midpoint of n-arm (reactive in JSXGraph)
    this.pCenter = brd.create('midpoint', [this.tipA, this.tipB], { visible: false, name: '' });

    // Angle arc between deformed arms (tipB → pCenter → tipC, counterclockwise)
    brd.create('angle', [this.tipB, this.pCenter, this.tipC], {
      type: 'sector',
      radius: 0.055,
      fillColor: 'rgba(230, 74, 25, 0.18)',
      strokeColor: '#E64A19',
      strokeWidth: 1.5,
      label: { visible: false },
      highlight: false,
    });

    // Arm end labels (function-based → JSXGraph auto-updates during animation)
    brd.create('text', [
      () => this.tipB.X() + 0.02,
      () => this.tipB.Y(),
      'n',
    ], { fontSize: 11, color: '#E53935', anchorX: 'left', highlight: false });

    brd.create('text', [
      () => this.tipC.X() + 0.01,
      () => this.tipC.Y() + 0.02,
      's',
    ], { fontSize: 11, color: '#7B1FA2', anchorX: 'left', highlight: false });

    // ── Drag handler ─────────────────────────────────────────────────────────
    this.strainPt.on('drag', () => {
      this.strainPointX = this.strainPt.X();
      this.strainPointY = this.strainPt.Y();
      this.updateStrainGauge(false);
    });

    setTimeout(() => { this.CLICK_FINAL(); }, 1000);
  },

  methods: {
    SET_ZERO() {
      Object.keys(this.coeffs).forEach((k) => { this.coeffs[k] = 0; });
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
      this.updateStrainGauge(false);
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
      this.updateStrainGauge(true);
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
      this.updateStrainGauge(true);
    },

    // Returns positions for reference cross and deformed cross tips
    computeStrainGaugeTips(final) {
      const len = this.strainLen;
      const theta = this.directionAngle * Math.PI / 180;
      const cn = Math.cos(theta); const sn = Math.sin(theta);
      // s = n rotated 90° CCW
      const cs = -sn; const ss = cn;

      const X = this.strainPointX; const Y = this.strainPointY;

      // Reference cross always at P
      const ref = {
        A: [X - len * cn, Y - len * sn],
        B: [X + len * cn, Y + len * sn],
        C: [X + len * cs, Y + len * ss],
        D: [X - len * cs, Y - len * ss],
      };

      if (!final) {
        return { ref, def: { A: ref.A, B: ref.B, C: ref.C, D: ref.D } };
      }

      // Deformed P position
      const {
        A1, A2, A3, A4, A5, A6, B1, B2, B3, B4, B5, B6,
      } = this;
      const ux = A1 + A2 * X + A3 * Y + A4 * X * X + A5 * Y * Y + A6 * X * Y;
      const uy = B1 + B2 * X + B3 * Y + B4 * X * X + B5 * Y * Y + B6 * X * Y;
      const Px = X + ux; const Py = Y + uy;

      // Deformation gradient F at P
      const dudx = A2 + 2 * A4 * X + A6 * Y;
      const dudy = A3 + 2 * A5 * Y + A6 * X;
      const dvdx = B2 + 2 * B4 * X + B6 * Y;
      const dvdy = B3 + 2 * B5 * Y + B6 * X;

      // F·n (deformed n-direction vector, scaled by len)
      const Fnx = ((1 + dudx) * cn + dudy * sn) * len;
      const Fny = (dvdx * cn + (1 + dvdy) * sn) * len;

      // F·s (deformed s-direction vector, scaled by len)
      const Fsx = ((1 + dudx) * cs + dudy * ss) * len;
      const Fsy = (dvdx * cs + (1 + dvdy) * ss) * len;

      return {
        ref,
        def: {
          A: [Px - Fnx, Py - Fny],
          B: [Px + Fnx, Py + Fny],
          C: [Px + Fsx, Py + Fsy],
          D: [Px - Fsx, Py - Fsy],
        },
      };
    },

    // Update all strain gauge points; animate = true uses 800 ms
    updateStrainGauge(animate) {
      if (!this.tipA || !this.refA) return;
      const final = this.state === 'FINAL';
      const { ref, def } = this.computeStrainGaugeTips(final);
      const dur = animate ? 800 : 1;

      // Reference cross — always immediate (no animation needed)
      this.refA.setPosition(JXG.COORDS_BY_USER, ref.A);
      this.refB.setPosition(JXG.COORDS_BY_USER, ref.B);
      this.refC.setPosition(JXG.COORDS_BY_USER, ref.C);
      this.refD.setPosition(JXG.COORDS_BY_USER, ref.D);

      // Deformed cross — animate
      this.tipA.moveTo(def.A, dur);
      this.tipB.moveTo(def.B, dur);
      this.tipC.moveTo(def.C, dur);
      this.tipD.moveTo(def.D, dur);

      if (!animate) {
        this.boardObj.update();
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
.section-header--primary  { background: linear-gradient(90deg, #1565C0, #1976D2); }
.section-header--secondary {
  background: linear-gradient(90deg, #00695C, #00897B);
  border-radius: 8px 8px 0 0;
}
.section-header--strain { background: linear-gradient(90deg, #BF360C, #E64A19); }

.formula-strip {
  background: #E8F5E9;
  border-top: 1px solid rgba(0,0,0,0.1);
  font-size: 12px;
  overflow-x: auto;
}

/* Cards */
.coeff-card, .viz-card, .strain-card {
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  overflow: hidden;
}

/* Coefficient table */
.coeff-table { width: 100%; }
.coeff-table thead tr { background: #F8F9FF; }
.term-col {
  font-weight: 600; font-size: 12px;
  text-transform: uppercase; letter-spacing: 0.5px;
}
.coeff-col-a { background: #EEF2FF; font-size: 13px; padding: 8px 4px; }
.coeff-col-b { background: #E8FAF5; font-size: 13px; padding: 8px 4px; }
.col-label { font-size: 10px; font-weight: 400; color: #888; margin-top: 2px; }
.coeff-row:hover { background: #FAFBFF; }
.term-cell   { background: #FAFAFA; }
.input-cell-a { background: #F7F9FF; }
.input-cell-b { background: #F4FBF8; }

/* State toggle */
.state-toggle-group {
  display: flex;
  background: rgba(255,255,255,0.15);
  border-radius: 6px;
  overflow: hidden;
}
.state-btn        { color: rgba(255,255,255,0.7) !important; border-radius: 0 !important; font-size: 11px; }
.state-btn-active { color: white !important; background: rgba(255,255,255,0.25) !important; border-radius: 0 !important; font-size: 11px; }
.result-badge     { font-size: 11px; min-width: 28px; text-align: center; }

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
.jxgbox svg text { cursor: default; user-select: none; }

/* ── Strain analysis ──────────────────────────────────────────────────── */

.strain-section-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #BF360C;
  margin-bottom: 6px;
}

.strain-hint { font-size: 11px; color: #999; line-height: 1.4; }

.angle-display {
  font-size: 17px;
  font-weight: 700;
  color: #E64A19;
  min-width: 44px;
  font-family: 'Roboto Mono', monospace;
}

/* Tensor matrix */
.tensor-wrapper { display: flex; align-items: center; justify-content: center; margin: 8px 0 4px; }
.tensor-bracket-left  { width: 8px; height: 80px; border: 2px solid #8D6E63; border-right: none; border-radius: 3px 0 0 3px; margin-right: 4px; }
.tensor-bracket-right { width: 8px; height: 80px; border: 2px solid #8D6E63; border-left:  none; border-radius: 0 3px 3px 0; margin-left:  4px; }
.tensor-table { border-collapse: separate; border-spacing: 5px; }
.tensor-table td { text-align: center; padding: 6px 14px; background: #FFF3E0; border-radius: 4px; min-width: 90px; }
.tensor-label { font-size: 10px; color: #A1887F; margin-bottom: 2px; }
.tensor-value { font-size: 14px; font-weight: 700; color: #BF360C; font-family: 'Roboto Mono', monospace; }

/* Arm boxes */
.arm-box {
  border-radius: 8px;
  padding: 8px 12px;
  border-left: 4px solid;
}
.arm-box--n { background: #FFEBEE; border-color: #E53935; }
.arm-box--s { background: #F3E5F5; border-color: #7B1FA2; }

.arm-box-header {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
}
.arm-dot {
  display: inline-block;
  width: 8px; height: 8px;
  border-radius: 50%;
  margin-right: 5px;
  flex-shrink: 0;
}
.arm-dot--n { background: #E53935; }
.arm-dot--s { background: #7B1FA2; }

.arm-row {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  padding: 2px 0;
}
.arm-key { color: #888; }
.arm-val { font-family: 'Roboto Mono', monospace; font-weight: 600; }

/* Angle column */
.angle-visual-box {
  display: flex;
  justify-content: center;
}

.angle-info-box {
  background: #FFF3E0;
  border-radius: 8px;
  padding: 8px 12px;
  border-left: 4px solid #E64A19;
}

.angle-info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  padding: 2px 0;
  border-bottom: 1px solid rgba(0,0,0,0.04);
}
.angle-info-row:last-child { border-bottom: none; }
.angle-info-key { color: #A1887F; }
.angle-info-val { font-family: 'Roboto Mono', monospace; font-weight: 700; font-size: 12px; }
</style>
