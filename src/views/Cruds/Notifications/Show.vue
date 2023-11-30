<template>
  <div class="crud_form_wrapper">
    <!-- Start:: Title -->
    <div class="form_title_wrapper">
      <h4>{{ $t("TITLES.showNotification") }}</h4>
    </div>
    <!-- End:: Title -->

    <!-- Start:: Single Step Form Content -->
    <div class="single_step_form_content_wrapper">
      <form @submit.prevent="validateFormInputs">
        <div class="row justify-content-center">
          <!-- Start:: Receiver Type Input -->
          <base-input col="6" type="text" :placeholder="$t('PLACEHOLDERS.receiverType')" v-model.trim="data.sender_type"
            required readonly />
          <!-- End:: Receiver Type Input -->

          <!-- Start:: Clients Type Input -->

          <!-- <base-input col="6" type="text" :placeholder="$t('PLACEHOLDERS.clients')" v-model.trim="data.clients"
            required /> -->
          <!-- End:: Clients Type Input -->


          <div class="col-12">
            <div class="row">
              <!-- Start:: Title Ar Input -->
              <base-input col="6" type="text" :placeholder="$t('PLACEHOLDERS.titleAr')" v-model.trim="data.titleAr"
                required readonly />
              <!-- End:: Title Ar Input -->

              <!-- Start:: Title En Input -->
              <base-input col="6" type="text" :placeholder="$t('PLACEHOLDERS.titleEn')" v-model.trim="data.titleEn"
                required readonly />
              <!-- End:: Title En Input -->

              <!-- Start:: Content Ar Input -->
              <base-input col="6" rows="7" type="textarea" :placeholder="$t('PLACEHOLDERS.contentAr')"
                v-model.trim="data.contentAr" required readonly />
              <!-- End:: Content Ar Input -->

              <!-- Start:: Content En Input -->
              <base-input col="6" rows="7" type="textarea" :placeholder="$t('PLACEHOLDERS.contentEn')"
                v-model.trim="data.contentEn" required readonly />
              <!-- End:: Content En Input -->
            </div>
          </div>

          <!-- End:: Submit Button Wrapper -->
        </div>
      </form>
    </div>
    <!-- END:: Single Step Form Content -->
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "CreateNotification",

  computed: {
    // Start:: Vuex Getters
    ...mapGetters({
      allClientsData: "ApiGetsModule/allClientsData",
      allDriversData: "ApiGetsModule/allDriversData",
    }),
    // End:: Vuex Getters

    receiverTypes() {
      return [
        {
          id: 1,
          name: this.$t("PLACEHOLDERS.clients"),
          value: "clients",
        },
        {
          id: 2,
          name: this.$t("PLACEHOLDERS.drivers"),
          value: "drivers",
        },
        {
          id: 3,
          name: this.$t("PLACEHOLDERS.both"),
          value: "both",
        },
      ];
    },
  },

  data() {
    return {
      // Start:: Loader Control Data
      isWaitingRequest: false,
      // End:: Loader Control Data

      // Start:: Data Collection To Send
      // data: {
      //   receiverType: {
      //     id: 1,
      //     name: this.$t("PLACEHOLDERS.clients"),
      //     value: "clients",
      //   },

      // },

      data: {
        sender_type: null,
        drivers: null,
        titleAr: null,
        titleEn: null,
        contentAr: null,
        contentEn: null,
      }
      // End:: Data Collection To Send
    };
  },

  methods: {
    // Start:: Vuex Actions
    ...mapActions({
      getClients: "ApiGetsModule/getClients",
      getDrivers: "ApiGetsModule/getDrivers",
    }),
    // End:: Vuex Actions

    // get notification with id
    async getNotificationData() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `main/show-send-notification?notification_id=${this.$route.params.id}`
        });


        console.log(res.data.data)
        this.data.sender_type = res.data.data.sender_type;
        this.data.titleAr = res.data.data.title_ar;
        this.data.titleEn = res.data.data.title_en;
        this.data.contentAr = res.data.data.content_ar;
        this.data.contentEn = res.data.data.content_en;

      } catch (error) {
        this.loading = false;
        console.log(error.response.data.message);
      }
    },
  },

  created() {
    // Start:: Fire Methods
    this.getNotificationData()
    // End:: Fire Methods
  },
};
</script>
