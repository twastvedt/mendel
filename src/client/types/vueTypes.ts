import Vue from "vue";

export interface VueForm extends Vue {
  validate: () => boolean;
  resetValidation: () => void;
  reset: () => void;
}
