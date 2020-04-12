<template>
  <q-layout view="hHh LpR fFf">

    <q-header class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="left = !left" />

        <q-toolbar-title>
          <!-- <q-avatar>
            <img src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg">
          </q-avatar> -->
          Finite Elements
        </q-toolbar-title>
      </q-toolbar>


    </q-header>

    <q-drawer v-model="left" side="left">
       <q-list>
        <q-item-label header class="text-grey-8">Essential Links</q-item-label>
        <EssentialLink v-for="link in essentialLinks" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
import EssentialLink from "components/EssentialLink";

export default {
  name: "MainLayout",

  components: {
    EssentialLink
  },

  data() {
    return {
      left: false,
      essentialLinks: [
        {
          title: "Author",
          caption: "murat yilmaz",
          icon: "school",
          link: "https://akademi.itu.edu.tr/en/yilmazmura/"
        },
        {
          title: "Many thanks to Quasar",
          caption: "quasar.dev",
          icon: "3d_rotation",
          link: "https://quasar.dev"
        },
        {
          title: "Many thanks to JSXGraph",
          caption: "jsxgraph.uni",
          icon: "video_label",
          link: "https://jsxgraph.uni-bayreuth.de/wp/"
        },
        {
          title: "Many thanks to MathJax",
          caption: "mathjax.uni",
          icon: "format_shapes",
          link: "https://www.mathjax.org/"
        }
      ]
    };
  },
};
</script>