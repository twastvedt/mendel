<script setup lang="ts"></script>
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
  </v-list>
</template>
