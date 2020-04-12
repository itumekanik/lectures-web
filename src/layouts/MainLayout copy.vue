<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>Finite Elements</q-toolbar-title>

        <div>v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen"  bordered content-class="bg-grey-1">
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
      leftDrawerOpen: false,
      essentialLinks: [
        {
          title: "Author",
          caption: "murat yilmaz",
          icon: "school",
          link: "https://akademi.itu.edu.tr/en/yilmazmura/"
        },
        {
          title: "Many thanks to Quasar Framework",
          caption: "quasar.dev",
          icon: "school",
          link: "https://quasar.dev"
        }
      ]
    };
  },
};
</script>
