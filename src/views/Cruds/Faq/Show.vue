<template>
  <div class="crud_form_wrapper">
    <!-- Start:: Title -->
    <div class="form_title_wrapper">
      <h4>{{ $t("PLACEHOLDERS.view_question_data") }}</h4>
    </div>
    <!-- End:: Title -->

    <!-- Start:: Single Step Form Content -->
    <div class="single_step_form_content_wrapper">
      <form @submit.prevent="validateFormInputs">
        <div class="row">

          <!-- Start:: Name Input -->
          <base-input col="6" cols="4" rows="4" type="textarea" :placeholder="$t('PLACEHOLDERS.question_text_arabic')"
            v-model.trim="data.question_text_arabic" disabled />

          <base-input col="6" cols="4" rows="4" type="textarea" :placeholder="$t('PLACEHOLDERS.question_text_english')"
            v-model.trim="data.question_text_english" disabled />

          <base-input col="6" cols="4" rows="4" type="textarea" :placeholder="$t('PLACEHOLDERS.answer_text_arabic')"
            v-model.trim="data.answer_text_arabic" disabled />

          <base-input col="6" cols="4" rows="4" type="textarea" :placeholder="$t('PLACEHOLDERS.answer_text_english')"
            v-model.trim="data.answer_text_english" disabled />
          <!-- End:: Name Input -->

        </div>
      </form>
    </div>
    <!-- END:: Single Step Form Content -->
  </div>
</template>

<script>

export default {
  name: "EditFaq",

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

    // start show data
    async showData() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `questions/${this.$route.params.id}`,
        });
        this.data.question_text_arabic = res.data.data.Question.body_ar;
        this.data.question_text_english = res.data.data.Question.body_en;
        this.data.answer_text_arabic = res.data.data.Question.answer_ar;
        this.data.answer_text_english = res.data.data.Question.answer_en;

        // this.data.active = res.data.data.Country.is_active;
      } catch (error) {
        this.loading = false;
        console.log(error.response.data.message);
      }
    },
    // end show data

  },

  created() {
    this.showData()
  },
};
</script>
