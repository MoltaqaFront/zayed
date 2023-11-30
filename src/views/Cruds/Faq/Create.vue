<template>
  <div class="crud_form_wrapper">
    <!-- Start:: Title -->
    <div class="form_title_wrapper">
      <h4>{{ $t("PLACEHOLDERS.add_question_data") }}</h4>
    </div>
    <!-- End:: Title -->

    <!-- Start:: Single Step Form Content -->
    <div class="single_step_form_content_wrapper">
      <form @submit.prevent="validateFormInputs">
        <div class="row">

          <!-- Start:: Name Input -->
          <base-input col="6" cols="4" rows="4" type="textarea" :placeholder="$t('PLACEHOLDERS.question_text_arabic')"
            v-model.trim="data.question_text_arabic" required />

          <base-input col="6" cols="4" rows="4" type="textarea" :placeholder="$t('PLACEHOLDERS.question_text_english')"
            v-model.trim="data.question_text_english" required />

          <base-input col="6" cols="4" rows="4" type="textarea" :placeholder="$t('PLACEHOLDERS.answer_text_arabic')"
            v-model.trim="data.answer_text_arabic" required />

          <base-input col="6" cols="4" rows="4" type="textarea" :placeholder="$t('PLACEHOLDERS.answer_text_english')"
            v-model.trim="data.answer_text_english" required />
          <!-- End:: Name Input -->

          <!-- Start:: Deactivate Switch Input -->
          <!-- <div class="input_wrapper switch_wrapper my-5">
            <v-switch color="green" :label="data.active ? $t('PLACEHOLDERS.active') : $t('PLACEHOLDERS.notActive')"
              v-model="data.active" hide-details></v-switch>
          </div> -->
          <!-- End:: Deactivate Switch Input -->

          <!-- Start:: Submit Button Wrapper -->
          <div class="btn_wrapper">
            <base-button class="mt-2" styleType="primary_btn" :btnText="$t('BUTTONS.save')" :isLoading="isWaitingRequest"
              :disabled="isWaitingRequest" />
          </div>
          <!-- End:: Submit Button Wrapper -->
        </div>
      </form>
    </div>
    <!-- END:: Single Step Form Content -->
  </div>
</template>

<script>

export default {
  name: "CreateFaq",

  data() {
    return {
      // Start:: Loader Control Data
      isWaitingRequest: false,
      // End:: Loader Control Data

      // Start:: Data Collection To Send
      data: {
        question_text_arabic: null,
        question_text_english: null,
        answer_text_arabic: null,
        answer_text_arabic: null,
        active: true,
      },
      // End:: Data Collection To Send
    };
  },

  computed: {
  },

  methods: {

    // Start:: validate Form Inputs
    validateFormInputs() {
      this.submitForm();
      // this.isWaitingRequest = true;

      // if (!this.data.nameAr) {
      //   this.isWaitingRequest = false;
      //   this.$message.error(this.$t("VALIDATION.nameAr"));
      //   return;
      // } else if (!this.data.nameEn) {
      //   this.isWaitingRequest = false;
      //   this.$message.error(this.$t("VALIDATION.nameEn"));
      //   return;
      // } else {
      //   this.submitForm();
      //   return;
      // }
    },
    // End:: validate Form Inputs

    // Start:: Submit Form
    async submitForm() {
      const REQUEST_DATA = new FormData();
      // Start:: Append Request Data
      REQUEST_DATA.append("body[ar]", this.data.question_text_arabic);
      REQUEST_DATA.append("body[en]", this.data.question_text_english);
      REQUEST_DATA.append("answer[ar]", this.data.answer_text_arabic);
      REQUEST_DATA.append("answer[en]", this.data.answer_text_english);
      // REQUEST_DATA.append("is_active", +this.data.active);
      // Start:: Append Request Data

      try {
        await this.$axios({
          method: "POST",
          url: `questions`,
          data: REQUEST_DATA,
        });
        this.isWaitingRequest = false;
        this.$message.success(this.$t("MESSAGES.addedSuccessfully"));
        this.$router.push({ path: "/faq/all" });
      } catch (error) {
        this.isWaitingRequest = false;
        this.$message.error(error.response.data.message);
      }
    },
    // End:: Submit Form


  },

  created() {
  },
};
</script>
