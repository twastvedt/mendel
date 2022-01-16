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
          :items="state.families"
          item-text="name"
          return-object
          label="Family"
          persistent-hint
          :rules="[requiredRule]"
          @input="updateColor"
        ></v-select>
        <template v-if="formValue.family">
          <v-row>
            <v-col>
              <div class="text-caption">Color</div>
              <v-menu :close-on-content-click="false" :offset-y="true">
                <template #activator="{ on, attrs }">
                  <v-btn
                    x-large
                    v-bind="attrs"
                    class="bigSquareButton"
                    v-on="on"
                  >
                    <svg class="svgicon">
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
        </template>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" :disabled="!valid" @click="save"> Save </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from "vue-property-decorator";

import { Family } from "@/entity/Family";
import Store from "../Store";
import { Variety } from "@/entity/Variety";
import type { VueForm } from "../vueTypes";

@Component({})
export default class EditVariety extends Vue {
  $refs!: {
    form: VueForm;
  };

  @Prop()
  value?: Variety;

  state = Store.state;

  formValue = this.default;
  families: Family[] = [];
  valid = true;
  requiredRule = (v: unknown) => !!v || "Value required";

  updateColor(): void {
    if (this.formValue.family) {
      this.formValue.color = this.formValue.family.color;
    }
  }

  get isNew(): boolean {
    return !this.value;
  }

  created(): void {
    this.resetForm();
  }

  get default(): Variety {
    return new Variety("", "#FFFFFF");
  }

  @Watch("value")
  resetForm(): void {
    this.formValue = this.value ? Variety.clone(this.value) : this.default;

    this.$refs.form?.resetValidation();
  }

  save(): void {
    if (this.$refs.form.validate()) {
      this.formValue.familyId = this.formValue.family?.id;

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
