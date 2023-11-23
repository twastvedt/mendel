<script setup lang="ts">
import { ref } from "vue";
import { useTheme } from "vuetify";

const theme = useTheme();

const themeOptions = [
  { value: "system", title: "System", icon: "mdi-theme-light-dark" },
  {
    value: "dark",
    title: "Dark",
    icon: "mdi-weather-night",
  },
  { value: "light", title: "Light", icon: "mdi-weather-sunny" },
];

const currentTheme = ref("system");

function setTheme(value: string) {
  if (value === "system") {
    theme.global.name.value = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";
  } else {
    theme.global.name.value = value;
  }
}
</script>
<template>
  <v-list density="comfortable" nav>
    <v-list-item link to="/" prepend-icon="mdi-map" title="Map" />
    <v-list-item
      link
      to="/summary"
      prepend-icon="mdi-view-list"
      title="Summary"
    />

    <v-list-subheader>Settings</v-list-subheader>

    <v-list-item
      link
      to="/settings/families"
      prepend-icon="mdi-cog"
      title="Families"
    />

    <v-list-item
      link
      to="/settings/varieties"
      prepend-icon="mdi-cog"
      title="Varieties"
    />

    <v-list-item>
      <v-select
        label="Theme"
        :items="themeOptions"
        v-model="currentTheme"
        @update:model-value="setTheme"
        density="comfortable"
        variant="outlined"
      >
        <template v-slot:item="{ item, props }">
          <v-list-item v-bind="props">
            <template v-slot:prepend>
              <v-icon :icon="item.raw.icon"></v-icon>
            </template>
          </v-list-item>
        </template>
      </v-select>
    </v-list-item>
  </v-list>
</template>
