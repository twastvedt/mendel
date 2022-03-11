<template>
  <v-list dense nav>
    <v-list-item v-for="item in items" :key="item.title" link :to="item.route">
      <v-list-item-icon>
        <v-icon>{{ item.icon }}</v-icon>
      </v-list-item-icon>

      <v-list-item-content>
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class SettingsMenu extends Vue {
  items = [
    {
      title: "Home",
      icon: "mdi-arrow-left",
      route: "/",
    },
    {
      title: "Families",
      icon: "mdi-sprout",
      route: "/settings/families",
    },
    { title: "Varieties", icon: "mdi-sprout", route: "/settings/varieties" },
  ];
}
</script>
