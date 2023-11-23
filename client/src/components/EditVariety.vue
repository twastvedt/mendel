<script setup lang="ts">
import { watch, ref, computed } from "vue";
import type { FamilyLocal, VarietyLocal } from "@mendel/common";
import { useGardenStore } from "../state/gardenStore";
import { VForm } from "vuetify/components";
import PlantIcon from "./PlantIcon.vue";

const gardenStore = useGardenStore();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "input", formValue: VarietyLocal): void;
}>();

const form = ref<VForm>();

const props = defineProps<{
  value?: VarietyLocal;
}>();

const formValue = ref(getDefault());
const requiredRule = (v: unknown) => !!v || "Value required";

function updateColor(): void {
  if (formValue.value.family) {
    formValue.value.color = formValue.value.family.color;
  }
}

const isNew = computed(() => !props.value);

function getDefault(): VarietyLocal {
  return {
    name: "",
    color: "#FFFFFF",
    plantings: [],
  };
}

watch(() => props.value, resetForm);

function resetForm(): void {
  formValue.value = props.value ? Object.assign({}, props.value) : getDefault();

  form.value?.resetValidation();
}

async function save(): Promise<void> {
  const result = await form.value?.validate();
  if (result?.valid) {
    formValue.value.familyId = formValue.value.family?.id;

    emit("input", formValue.value);
    emit("close");

    resetForm();
  }
}

function cancel(): void {
  emit("close");
  resetForm();
}

resetForm();
</script>
<template>
  <v-card>
    <v-form ref="form" @submit.prevent="save" lazy-validation>
      <v-card-title>{{ isNew ? "New" : "Edit" }} Variety</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="formValue.name"
          label="Name"
          :rules="[requiredRule]"
        ></v-text-field>
        <v-autocomplete
          v-model="formValue.family"
          :items="gardenStore.families as FamilyLocal[]"
          auto-select-first
          item-title="name"
          return-object
          label="Family"
          persistent-hint
          :rules="[requiredRule]"
          @update:model-value="updateColor"
        ></v-autocomplete>
        <v-row>
          <v-col>
            <div class="text-caption">Color</div>
            <v-menu :close-on-content-click="false" location="bottom">
              <template #activator="{ props }">
                <v-btn x-large v-bind="props" class="bigSquareButton">
                  <plant-icon
                    v-if="formValue.family"
                    :size="44"
                    :color="formValue.color"
                    :family-id="formValue.family.id"
                  />
                </v-btn>
              </template>
              <v-card>
                <v-color-picker
                  v-model="formValue.color"
                  dot-size="25"
                  hide-inputs
                  mode="hexa"
                  swatches-max-height="200"
                ></v-color-picker>
              </v-card>
            </v-menu>
          </v-col>
          <v-col align-self="end">
            <v-btn @click="updateColor">Reset</v-btn>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" type="submit"> Save </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>
<style scoped>
.bigSquareButton {
  width: 52px !important;
  height: 52px !important;
  padding: 0 !important;
  min-width: 0 !important;
}
</style>
