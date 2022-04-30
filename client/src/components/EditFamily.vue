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
        <v-menu :close-on-content-click="false" :offset-y="true">
          <template #activator="{ on, attrs }">
            <v-btn x-large v-bind="attrs" class="bigSquareButton" v-on="on">
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
        <v-btn color="primary" :disabled="!valid" @click="save"> Save </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from "vue-property-decorator";

import { Family } from "@mendel/common";
import { state } from "../state/State";
import type { VueForm } from "../types/vueTypes";

@Component({})
export default class EditFamily extends Vue {
  $refs!: {
    form: VueForm;
  };

  @Prop()
  value?: Family;

  state = state;

  formValue = this.default;
  valid = true;
  requiredRule = (v: unknown) => !!v || "Value required";

  get isNew(): boolean {
    return !this.value;
  }

  get icon(): string {
    return this.formValue.icon.replace("symbol ", `symbol id="edit-icon" `);
  }

  created(): void {
    this.resetForm();
  }

  get default(): Family {
    return new Family("", "#FFFFFF", "", 6);
  }

  @Watch("value")
  resetForm(): void {
    this.formValue = this.value ? Object.assign({}, this.value) : this.default;

    this.$refs.form?.resetValidation();
  }

  save(): void {
    if (this.$refs.form.validate()) {
      this.$emit("input", this.formValue);
      this.$emit("close");

      this.resetForm();
    }
  }

  cancel(): void {
    this.$emit("close");

    this.resetForm();
  }
}
</script>

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
