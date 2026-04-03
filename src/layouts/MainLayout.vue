<template>
  <q-layout view="hHh LpR fFf">

    <q-header class="bg-primary text-white" elevated>
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="left = !left" />
        <q-avatar size="32px" class="q-mx-sm">
          <q-icon name="functions" size="28px" />
        </q-avatar>
        <q-toolbar-title>
          Finite Elements
          <template v-slot:subtitle>Displacement Field Visualizer</template>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="left" side="left" bordered :width="220">
      <q-list padding>
        <q-item-label header class="text-grey-8 text-weight-bold">Links</q-item-label>
        <EssentialLink v-for="link in essentialLinks" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
import EssentialLink from 'components/EssentialLink.vue';

export default {
  name: 'MainLayout',

  components: {
    EssentialLink,
  },

  data() {
    return {
      left: false,
      essentialLinks: [
        {
          title: 'Author',
          caption: 'Murat Yilmaz — ITU',
          icon: 'school',
          link: 'https://akademi.itu.edu.tr/en/yilmazmura/',
        },
        {
          title: 'Quasar Framework',
          caption: 'quasar.dev',
          icon: '3d_rotation',
          link: 'https://quasar.dev',
        },
        {
          title: 'JSXGraph',
          caption: 'jsxgraph.uni-bayreuth.de',
          icon: 'show_chart',
          link: 'https://jsxgraph.uni-bayreuth.de/wp/',
        },
        {
          title: 'MathJax',
          caption: 'mathjax.org',
          icon: 'format_shapes',
          link: 'https://www.mathjax.org/',
        },
      ],
    };
  },
};
</script>
