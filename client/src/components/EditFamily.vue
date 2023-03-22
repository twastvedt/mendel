<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { Family } from "@mendel/common/src";
import { VForm } from "vuetify/components";

const emit = defineEmits<{
  (e: "close"): void;
  (e: "input", formValue: unknown): void;
}>();

const form = ref<VForm>();

const props = defineProps<{
  value?: Family;
}>();

const isNew = computed(() => !props.value);

function getDefault(): Family {
  return new Family("", "#FFFFFF", "", 6);
}

let formValue = getDefault();
let valid = true;
const requiredRule = (v: unknown) => !!v || "Value required";

const icon = computed(() =>
  formValue.icon.replace("symbol ", `symbol id="edit-icon" `)
);

watch(() => props.value, resetForm);

function resetForm(): void {
  formValue = props.value ? Object.assign({}, props.value) : getDefault();

  form.value?.resetValidation();
}

async function save(): Promise<void> {
  const result = await form.value?.validate();
  if (result?.valid) {
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
      <v-card-title>{{ isNew ? "New" : "Edit" }} Family</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="formValue.name"
          label="Name"
          :rules="[requiredRule]"
        />

        <v-text-field
          v-model="formValue.spacing"
          :rules="[requiredRule]"
          label="Spacing (inches)"
        />

        <v-text-field
          v-model="formValue.icon"
          :rules="[requiredRule]"
          label="Icon SVG"
        />

        <v-text-field v-model="formValue.nitrogen" label="Nitrogen" />

        <div class="text-caption">Color</div>
        <v-menu :close-on-content-click="false" location="bottom">
          <template #activator="{ props }">
            <v-btn x-large v-bind="props" class="bigSquareButton">
              <svg class="svgicon">
                <!-- eslint-disable-next-line vue/no-v-html -->
                <defs v-html="icon" />
                <use href="#edit-icon" :fill="formValue.color" />
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
      </v-card-text>
      <v-card-actions>
        <v-btn color="text-primary" :disabled="!valid" @click="save">
          Save
        </v-btn>
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
