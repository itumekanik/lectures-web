<template>
  <q-layout view="hHh LpR fFf">

    <q-header elevated class="main-header">
      <q-toolbar class="q-px-md" style="min-height: 56px">
        <q-btn dense flat round icon="menu" @click="left = !left" class="q-mr-sm" />

        <div class="header-brand row items-center no-wrap">
          <q-icon name="functions" size="26px" class="q-mr-sm text-white" style="opacity: 0.9" />
          <div>
            <div class="text-weight-bold text-white" style="font-size: 15px; line-height: 1.2">
              Finite Elements
            </div>
            <div class="text-white" style="font-size: 11px; opacity: 0.7; letter-spacing: 0.5px">
              DISPLACEMENT FIELD VISUALIZER
            </div>
          </div>
        </div>

        <q-space />

        <q-chip
          icon="school"
          label="ITU"
          color="white"
          text-color="primary"
          dense
          class="q-mr-xs"
          style="font-size: 11px"
        />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="left"
      side="left"
      bordered
      :width="240"
      class="drawer-sidebar"
    >
      <div class="drawer-header q-pa-md">
        <div class="text-weight-bold text-primary" style="font-size: 13px; letter-spacing: 0.5px">
          REFERENCES
        </div>
      </div>

      <q-separator />

      <q-list padding class="q-pt-sm">
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>

      <div class="absolute-bottom q-pa-md">
        <q-separator class="q-mb-md" />
        <div class="text-caption text-grey-5 text-center">
          Murat Yilmaz &copy; {{ new Date().getFullYear() }}
        </div>
      </div>
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
          icon: 'functions',
          link: 'https://www.mathjax.org/',
        },
      ],
    };
  },
};
</script>

<style scoped>
.main-header {
  background: linear-gradient(135deg, #1565C0 0%, #1976D2 60%, #1E88E5 100%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
}

.drawer-sidebar {
  background: #fafafa;
}

.drawer-header {
  background: #f0f4ff;
  border-bottom: 2px solid #e3eaff;
}
</style>
