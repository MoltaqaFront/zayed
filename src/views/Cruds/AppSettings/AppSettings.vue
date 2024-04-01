<template>
  <div class="crud_form_wrapper">
    <!-- Start:: Single Step Form Content -->
    <div class="single_step_form_content_wrapper">
      <form @submit.prevent="validateFormInputs">
        <div class="row">

          <!-- Start:: Name Input -->
          <base-input col="6" type="number" :placeholder="$t('PLACEHOLDERS.VAT_percentage')"
            v-model.trim="data.VAT_percentage" />
          <!-- End:: Name Input -->

          <!-- Start:: Status Input -->
          <base-input col="6" type="number" :placeholder="$t('PLACEHOLDERS.app_commission_in_riyals')"
            v-model="data.app_commission_in_riyals" />
          <!-- End:: Status Input -->

          <base-input col="6" type="number" :placeholder="$t('PLACEHOLDERS.ad_deletion_duration_per_hour')"
            v-model="data.ad_deletion_duration_per_hour" />

          <base-input col="6" type="number" :placeholder="$t('PLACEHOLDERS.ad_deletion_duration_per_day')"
            v-model="data.ad_deletion_duration_per_day" />

          <base-text-editor col="6"   
            :placeholder="$t('PLACEHOLDERS.reservation_confirmation_message_ar')"
            v-model="data.reservation_confirmation_message_ar" />

          <base-text-editor col="6"  
            :placeholder="$t('PLACEHOLDERS.reservation_confirmation_message_en')"
            v-model="data.reservation_confirmation_message_en" />

          <!-- Start:: Submit Button Wrapper -->
          <div class="btn_wrapper">
            <base-button class="mt-2" styleType="primary_btn" :btnText="$t('BUTTONS.save')" :isLoading="isWaitingRequest"
              :disabled="isWaitingRequest" />
          </div>
          <!-- End:: Submit Button Wrapper -->
        </div>
      </form>
    </div>
    <!-- End:: Single Step Form Content -->
  </div>
</template>

<script>

import { mapGetters, mapActions } from "vuex";
import BaseTextEditor from '../../../components/formInputs/BaseTextEditor.vue';
export default {
	components: { BaseTextEditor },
  name: "GeneralSettings",

  data() {
    return {
      // Start:: Loader Control Data
      isWaitingRequest: false,
      // End:: Loader Control Data

      // Start:: Data
      data: {
        VAT_percentage: null,
        app_commission_in_riyals: null,
        ad_deletion_duration_per_hour: null,
        ad_deletion_duration_per_day: null,
        reservation_confirmation_message_ar: null,
        reservation_confirmation_message_en: null,
      },
      // End:: Data

    };
  },

  computed: {
    // Start:: Vuex Getters
    ...mapGetters({
      getAuthenticatedUserData: "AuthenticationModule/getAuthenticatedUserData"
    }),
    // End:: Vuex Getters
  },


  methods: {

    // Start:: Get Data To Edit
    async getDataToEdit() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `settings?key=dashboard_settings`,
        });
        // console.log("DATA =>", res.data.data);
        this.data.VAT_percentage = res.data.data[0].value.tax;
        this.data.app_commission_in_riyals = res.data.data[0].value.commission;
        this.data.ad_deletion_duration_per_hour = res.data.data[0].value.app_delete_time;
        this.data.ad_deletion_duration_per_day = res.data.data[0].value.cart_delete_time;
        this.data.reservation_confirmation_message_ar = res.data.data[0].value.message_ar;
        this.data.reservation_confirmation_message_en = res.data.data[0].value.message_en;

      } catch (error) {
        console.log(error.response.data.message);
      }
    },
    // End:: Get Data To Edit

    // Start:: Submit Form
    async submitForm() {
      this.isWaitingRequest = !this.isWaitingRequest;

      const REQUEST_DATA = new FormData();
      // Start:: Append Request Data
      REQUEST_DATA.append("key", "dashboard_settings");
      REQUEST_DATA.append("value[tax]", this.data.VAT_percentage);
      REQUEST_DATA.append("value[commission]", this.data.app_commission_in_riyals);
      REQUEST_DATA.append("value[app_delete_time]", this.data.ad_deletion_duration_per_hour);
      REQUEST_DATA.append("value[cart_delete_time]", this.data.ad_deletion_duration_per_day);
      REQUEST_DATA.append("value[message_ar]", this.data.reservation_confirmation_message_ar);
      REQUEST_DATA.append("value[message_en]", this.data.reservation_confirmation_message_en);

      // Start:: Append Request Data

      try {
        await this.$axios({
          method: "POST",
          url: `settings`,
          data: REQUEST_DATA,
        });
        this.isWaitingRequest = false;
        this.$message.success(this.$t("MESSAGES.savedSuccessfully"));
        this.getDataToEdit();
      } catch (error) {
        this.isWaitingRequest = false;
        this.$message.error(error.response.data.errors);
      }
    },
    // End:: Submit Form

    // Start:: validate Form Inputs
    validateFormInputs() {
      this.isWaitingRequest = true;
      if (!this.data.app_commission_in_riyals || this.data.app_commission_in_riyals === 'null') {
        this.isWaitingRequest = false;
        this.$message.error(this.$t("VALIDATION.commission_in_riyals_required"));
      }
      else if (this.data.app_commission_in_riyals < 1 || this.data.app_commission_in_riyals > 3) {
        this.isWaitingRequest = false;
        this.$message.error(this.$t("VALIDATION.commission_in_riyals"));
      }
    
      else if (!this.data.ad_deletion_duration_per_hour || this.data.ad_deletion_duration_per_hour === 'null') {
        this.isWaitingRequest = false;
        this.$message.error(this.$t("VALIDATION.duration_per_hour_required"));
      }
      else if (this.data.ad_deletion_duration_per_hour < 1 || this.data.ad_deletion_duration_per_hour > 3) {
        this.isWaitingRequest = false;
        this.$message.error(this.$t("VALIDATION.duration_per_hour"));
      }
      else if (!this.data.ad_deletion_duration_per_day || this.data.ad_deletion_duration_per_day === 'null') {
        this.isWaitingRequest = false;
        this.$message.error(this.$t("VALIDATION.notfieldday"));
      }
      else if (this.data.ad_deletion_duration_per_day < 1 || this.data.ad_deletion_duration_per_day > 3) {
        this.isWaitingRequest = false;
        this.$message.error(this.$t("VALIDATION.daycondition"));
      }
       else if (this.data.reservation_confirmation_message_ar.length  < 10 || this.data.reservation_confirmation_message_ar.length  > 300) {
        this.isWaitingRequest = false;
        this.$message.error(this.$t("VALIDATION.confirmation_message_ar"));
      }
       else if (this.data.reservation_confirmation_message_en.length  < 10 || this.data.reservation_confirmation_message_en.length  > 300) {
        this.isWaitingRequest = false;
        this.$message.error(this.$t("VALIDATION.confirmation_message_ar"));
      }
       else {
         this.submitForm();
         return;
      }
    },
    // End:: validate Form Inputs
  },

  created() {
    // Start:: Fire Methods
    this.getDataToEdit();
    // End:: Fire Methods
  },
};
</script>


<style lang="scss" scoped>
.all_action {
  display: flex;
  gap: 15px
}

.add_another {
  border: none;
  padding: 10px;
  width: 40px;
  height: 40px;
  border: 1px solid var(--light_gray_clr);
  border-radius: 50%;
  font-size: 18px;
  color: var(--light_gray_clr);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin: auto;

  .fa-trash {
    color: #ff2159;
    cursor: pointer
  }
}
</style>