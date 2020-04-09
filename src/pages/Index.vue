<template>
  <q-page class="flex my_page">
    <div class="page_container">
      <div class="row">
        <div class="col-xs-12 col-md-4 col-lg-4">
          <div class="q-pa-xs">
            <div class="col">
              (Horizontal Displacement)
              <br />u(X, Y) = A1 + A2 X + A3 Y + A4 X
              <sup>2</sup> + A5 Y
              <sup>2</sup> + A6 X Y
              <br />(Vertical Displacement)
              <br />v(X, Y) = B1 + B2 X + B3 Y + B4 X
              <sup>2</sup> + B5 Y
              <sup>2</sup> + B6 X Y
              <q-markup-table>
                <thead>
                  <tr>
                    <th class="text-left">i - Coeff</th>
                    <th class="text-left">
                      A
                      <sub>i</sub>
                    </th>
                    <th class="text-left">
                      B
                      <sub>i</sub>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(i, index) in [1,2,3,4,5,6]" :key="index">
                    <td class="text-left">({{i}}) {{str[i-1]}}</td>
                    <td class="text-left">
                      <input type="number" v-model="coeffs['A' + i]" />
                    </td>
                    <td class="text-left">
                      <input type="number" v-model="coeffs['B' + i]" />
                    </td>
                  </tr>
                </tbody>
              </q-markup-table>
            </div>
          </div>
        </div>
        <div class="col-xs-12 col-md-8 col-lg-8">
          <div class="q-pa-xs">
            <div class="col">
              <q-btn
                @click="CLICK_INITIAL"
                :disable="INITIAL"
                :color="INITIAL?'primary':'grey'"
              >Initial Configuration</q-btn>
              <q-btn
                @click="CLICK_FINAL"
                :disable="FINAL"
                :color="FINAL?'primary':'grey'"
              >Final Configuration</q-btn>
            </div>
          </div>
          <div class="q-pa-xs">
            <div>
              u(X, Y) =
              <span v-if="A1">{{A1}}</span>
              <span v-if="A2">+{{A2}}X</span>
              <span v-if="A3">+{{A3}}Y</span>
              <span v-if="A4">
                +{{A4}}X
                <sup>2</sup>
              </span>
              <span v-if="A5">
                +{{A5}}Y
                <sup>2</sup>
              </span>
              <span v-if="A6">+{{A6}}X Y</span>
            </div>
            <div>
              v(X, Y) =
              <span v-if="B1">{{B1}}</span>
              <span v-if="B2">+{{B2}}X</span>
              <span v-if="B3">+{{B3}}Y</span>
              <span v-if="B4">
                +{{B4}}X
                <sup>2</sup>
              </span>
              <span v-if="B5">
                +{{B5}}Y
                <sup>2</sup>
              </span>
              <span v-if="B6">+{{B6}}X Y</span>
            </div>
            <div id="jxgbox" class="jxgbox col" style="width:500px; height:300px"></div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import JXG from "jsxgraph";
const points = [];
const PF = val => {
  return val ? parseFloat(val) : 0;
};

export default {
  name: "PageIndex",
  data() {
    return {
      state: "INITIAL",
      coeffs: {
        A1: 4,
        A2: 0.3,
        A3: 0.2,
        A4: 0,
        A5: 0,
        A6: 0,
        B1: 2,
        B2: 0.5,
        B3: 0,
        B4: 0,
        B5: 0,
        B6: -0.02
      },
      str: ["Const", "X", "Y", "X^2", "Y^2", "X*Y"]
    };
  },
  computed: {
    INITIAL() {
      return this.state === "INITIAL";
    },
    FINAL() {
      return this.state === "FINAL";
    },
    A1() {
      return PF(this.coeffs.A1);
    },
    A2() {
      return PF(this.coeffs.A2);
    },
    A3() {
      return PF(this.coeffs.A3);
    },
    A4() {
      return PF(this.coeffs.A4);
    },
    A5() {
      return PF(this.coeffs.A5);
    },
    A6() {
      return PF(this.coeffs.A6);
    },
    B1() {
      return PF(this.coeffs.B1);
    },
    B2() {
      return PF(this.coeffs.B2);
    },
    B3() {
      return PF(this.coeffs.B3);
    },
    B4() {
      return PF(this.coeffs.B4);
    },
    B5() {
      return PF(this.coeffs.B5);
    },
    B6() {
      return PF(this.coeffs.B6);
    }
  },

  watch: {
    coeffs: {
      deep: true,
      handler(n) {
        this.SET_INITIAL();
      }
    }
  },
  mounted() {
    var brd = JXG.JSXGraph.initBoard("jxgbox", {
      boundingbox: [-5, 30, 30, -5],
      keepaspectratio: true,
      axis: true
    });

    for (let y = 0; y < 6; y += 1) {
      for (let x = 0; x < 11; x += 1) {
        points.push(
          brd.create("point", [2 * x, 2 * y], {
            name: "",
            face: "o",
            size: 2,
            strokeColor: "red",
            fillOpacity: 1,
            strokeOpacity: 1
          })
        );
      }
    }

    setTimeout(() => {
      this.CLICK_FINAL();
    }, 1000);
  },

  methods: {
    SET_INITIAL() {
      this.state = "INITIAL";
      let k = 0;
      for (let y = 0; y < 6; y += 1) {
        for (let x = 0; x < 11; x += 1) {
          points[k].moveTo([2 * x, 2 * y], 1);
          k += 1;
        }
      }
    },
    CLICK_INITIAL() {
      this.state = "INITIAL";
      let k = 0;
      for (let y = 0; y < 6; y += 1) {
        for (let x = 0; x < 11; x += 1) {
          points[k].moveTo([2 * x, 2 * y], 1000);
          k += 1;
        }
      }
    },
    CLICK_FINAL() {
      this.state = "FINAL";
      let k = 0;
      for (let y = 0; y < 6; y += 1) {
        for (let x = 0; x < 11; x += 1) {
          let xx = 2 * x;
          let yy = 2 * y;

          let { A1, A2, A3, A4, A5, A6, B1, B2, B3, B4, B5, B6 } = this;

          let ux =
            A1 + A2 * xx + A3 * yy + A4 * xx * xx + A5 * yy * yy + A6 * xx * yy;
          let uy =
            B1 + B2 * xx + B3 * yy + B4 * xx * xx + B5 * yy * yy + B6 * xx * yy;

          // let ux = 4 + 0.3 * xx + 0.2 * yy;
          // let uy = 2 + 0.5*xx - 0.02 * xx * yy;
          points[k].moveTo([xx + ux, yy + uy], 1000);
          k += 1;
        }
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
.my_page {
  background-color: $grey-1;
}

.page_container {
  width: 100%;
}

div {
  /* border: 1px solid blue; */
}

.row {
  margin: 5px;
}
</style>

<style scoped>
/*
    Copyright 2008-2016
        Matthias Ehmann,
        Michael Gerhaeuser,
        Carsten Miller,
        Bianca Valentin,
        Alfred Wassermann,
        Peter Wilfahrt

    This file is part of JSXGraph.

    JSXGraph is free software dual licensed under the GNU LGPL or MIT License.

    You can redistribute it and/or modify it under the terms of the

      * GNU Lesser General Public License as published by
        the Free Software Foundation, either version 3 of the License, or
        (at your option) any later version
      OR
      * MIT License: https://github.com/jsxgraph/jsxgraph/blob/master/LICENSE.MIT

    JSXGraph is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License and
    the MIT License along with JSXGraph. If not, see <http://www.gnu.org/licenses/>
    and <http://opensource.org/licenses/MIT/>.
 */

.jxgbox {
  /* for IE 7 */
  position: relative;
  overflow: hidden;
  background-color: #ffffff;
  border-style: solid;
  border-width: 1px;
  border-color: #356aa0;
  border-radius: 10px;
  -webkit-border-radius: 10px;
  -ms-touch-action: none;
  /* touch-action: none; */ /* Set with JavaScript */
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
  /**
     * The default font family is now set in
     * JXG.Options.text.cssdefaultstyle = 'font-family: Arial, Helvetica, Geneva, sans-serif;'
     */
  /*
        font-family: Arial, Helvetica, Geneva, sans-serif;
    */

  /* "background-color: transparent;" may produce artefacts in IE. Solution: setting a color explicitly. */
  background-color: transparent;
  padding: 0;
  margin: 0;
}

.JXGinfobox {
  border-style: none;
  border-width: 1px;
  border-color: black;
}

/* 
    CSS attributes will (permantely) overwrite attributes set in JSXGraph 
*/
.JXGimage {
  /* opacity: 1.0; */
}

.JXGimageHighlight {
  /* opacity: 0.6; */
}

/*
    CSS rules for the navigation bar 
*/

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

.JXG_navigation:hover {
}

.JXG_navigation_button {
  color: #666666;
}

.JXG_navigation_button:hover {
  border-radius: 2px;
  background-color: #c0c0c0;
  background-color: rgba(184, 184, 184, 0.5);
}

/* 
    CSS rules for the wrapping div in fullscreen mode 
*/

.JXG_wrap_private:-moz-full-screen {
  background-color: #cccccc;
  padding: 0px;
  width: 100%;
  height: 100%;
}

.JXG_wrap_private:-webkit-full-screen {
  background-color: #cccccc;
  padding: 0px;
  width: 100%;
  height: 100%;
}

.JXG_wrap_private:fullscreen {
  background-color: #cccccc;
  padding: 0px;
  width: 100%;
  height: 100%;
}

.JXG_wrap_private:-ms-fullscreen {
  background-color: #cccccc;
  padding: 0px;
  width: 100%;
  height: 100%;
}
</style>
