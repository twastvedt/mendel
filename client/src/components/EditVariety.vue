<script setup lang="ts">
import { watch, ref, computed } from "vue";
import { Variety } from "@mendel/common";
import { state } from "../state/State";
import type { VueForm } from "../types/vueTypes";

const emit = defineEmits<{
  (e: 'close'): void, 
  (e: 'input', formValue: unknown): void,
}>();

const form = ref<VueForm>();

const props = defineProps<{
  value?: Variety
}>();

let formValue = getDefault();
const families = state.db?.families ?? [];
let valid = true;
const requiredRule = (v: unknown) => !!v || "Value required";

function updateColor(): void {
  if (formValue.family) {
    formValue.color = formValue.family.color;
  }
}

const isNew = computed(() => !props.value);

function getDefault(): Variety {
  return new Variety("", "#FFFFFF");
}

watch(() => props.value, resetForm);

function resetForm(): void {
  formValue = props.value ? Object.assign({}, props.value) : getDefault();

  form.value?.resetValidation();
}

function save(): void {
  if (form.value?.validate()) {
    formValue.familyId = formValue.family?.id;

    emit("input", formValue);
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
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-card-title>{{ isNew ? "New" : "Edit" }} Variety</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="formValue.name"
          label="Name"
          :rules="[requiredRule]"
        ></v-text-field>
        <v-select
          v-model="formValue.family"
          :items="families"
          item-text="name"
          return-object
          label="Family"
          persistent-hint
          :rules="[requiredRule]"
          @input="updateColor"
        ></v-select>
        <v-row>
          <v-col>
            <div class="text-caption">Color</div>
            <v-menu :close-on-content-click="false" :offset-y="true">
              <template #activator="{ on, attrs }">
                <v-btn x-large v-bind="attrs" class="bigSquareButton" v-on="on">
                  <svg v-if="formValue.family" class="svgicon">
                    <use
                      :href="`#family-${formValue.family.id}`"
                      :fill="formValue.color"
                    />
                  </svg>
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
        <v-btn color="primary" :disabled="!valid" @click="save"> Save </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>
<style scoped lang="scss">
.svgicon {
  stroke: black;
  height: 44px;
}

.bigSquareButton {
  width: 52px !important;
  padding: 0 !important;
  min-width: 0 !important;
}
</style>
