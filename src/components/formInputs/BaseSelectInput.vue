<template>
  <div class="my-5" :class="col ? `col-lg-${col}` : ''">
    <!-- :class="{ disabled_input: disabled }" -->
    <div class="input_wrapper top_label select_wrapper">
      <label class="form-label">
        {{ placeholder }}
        <span class="text-danger" v-if="required">*</span>
      </label>
      <multiselect :options="optionsList" label="name" track-by="id" placeholder=" " :searchable="true"
        :allow-empty="false" :show-labels="false" :open-direction="'bottom'" :value="value" @input="
          updateValue($event);
        $emit('fireInputEvent');
        " :multiple="multiple" :readonly="readonly" :disabled="disabled">
      </multiselect>
    </div>
  </div>
</template>

<script>
export default {
  name: "BaseSelectInput",

  emits: ["fireInputEvent"],

  props: {
    // ====== Start:: General Inputs Props ====== //
    col: {
      required: false,
      type: String,
    },
    optionsList: {
      required: true,
    },
    value: {
      required: true,
    },
    placeholder: {
      required: false,
      type: String,
    },
    multiple: {
      required: false,
      type: Boolean,
      default: false,
    },
    required: {
      required: false,
      type: Boolean,
      default: false,
    },
    readonly: {
      required: false,
      type: Boolean,
      default: false,
    },
    disabled: {
      required: false,
      type: Boolean,
      default: false,
    },
    // ====== End:: General Inputs Props ====== //
  },

  methods: {
    updateValue(e) {
      this.$emit("input", e);
    },
  },
};
</script>
