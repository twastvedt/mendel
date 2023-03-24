<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { Plan } from "@mendel/common/src";
import { VForm } from "vuetify/components";

const emit = defineEmits<{
  (e: "close"): void;
  (e: "input", formValue: Plan): void;
}>();

const form = ref<VForm>();

const props = defineProps<{
  value?: Plan;
}>();

const isNew = computed(() => !props.value);

function getDefault(): Plan {
  return new Plan();
}

const formValue = ref(getDefault());
const requiredRule = (v: unknown) => !!v || "Value required";

watch(() => props.value, resetForm);

function resetForm(): void {
  formValue.value = props.value ? Object.assign({}, props.value) : getDefault();

  form.value?.resetValidation();
}

async function save(): Promise<void> {
  const result = await form.value?.validate();
  if (result?.valid) {
    emit("input", formValue.value);
    emit("close");

    resetForm();
  }
}

resetForm();
</script>
<template>
  <v-card>
    <v-form ref="form" @submit.prevent="save">
      <v-card-title>{{ isNew ? "New" : "Edit" }} Plan</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="formValue.name"
          label="Name"
          :rules="[requiredRule]"
        />

        <v-textarea
          v-model="formValue.description"
          label="Description"
          auto-grow
        />

        <v-text-field
          v-model="formValue.year"
          :rules="[requiredRule]"
          label="Year"
        />

        <v-checkbox v-model="formValue.draft" label="Draft" />
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" type="submit"> Save </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>
