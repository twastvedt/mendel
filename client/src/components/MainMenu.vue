<template>
  <v-list dense nav>
    <v-list-item link to="/">
      <v-list-item-icon>
        <v-icon>mdi-map</v-icon>
      </v-list-item-icon>
      <v-list-item-title>Map</v-list-item-title>
    </v-list-item>

    <v-list-item link to="/summary">
      <v-list-item-icon>
        <v-icon>mdi-view-list</v-icon>
      </v-list-item-icon>
      <v-list-item-title>Summary</v-list-item-title>
    </v-list-item>

    <v-list-group prepend-icon="mdi-cog" :value="true">
      <template #activator>
        <v-list-item-title>Settings</v-list-item-title>
      </template>

      <v-list-item link to="/settings/families">
        <v-list-item-icon>
          <v-icon>mdi-sprout</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Families</v-list-item-title>
      </v-list-item>

      <v-list-item link to="/settings/varieties">
        <v-list-item-icon>
          <v-icon>mdi-dots-hexagon</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Varieties</v-list-item-title>
      </v-list-item>
    </v-list-group>
  </v-list>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({})
export defineComponent({
  name: "MainMenu",}
</script>
