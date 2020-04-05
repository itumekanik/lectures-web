<template>
  <q-page class="flex flex-center">
    <div class="q-pa-xl">
      <div class="colunm">
        <div class="col">
          u(X, Y) = 2 + 0.1*X + 0.2*Y (Horizontal Displacement)
          <br />v(X, Y) = 1 + 0.02*X*X (Vertical Displacement)
        </div>
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
        <div id="jxgbox" class="jxgbox col" style="width:500px; height:300px"></div>
      </div>
    </div>
  </q-page>
</template>

<script>
import JXG from "jsxgraph";
const points = [];

export default {
  name: "PageIndex",
  data() {
    return {
      state: "INITIAL"
    };
  },
  computed: {
    INITIAL() {
      return this.state === "INITIAL";
    },
    FINAL() {
      return this.state === "FINAL";
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

          let ux = 2 + 0.1 * xx + 0.2 * yy;
          let uy = 1 + 0.02 * xx * xx;
          points[k].moveTo([xx + ux, yy + uy], 1000);
          k += 1;
        }
      }
    }
  }
};
</script>

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
