<template>
  <div class="crud_form_wrapper">
    <!-- Start:: Title -->
    <div class="form_title_wrapper">
      <h4>{{ $t("SIDENAV.Advertisements.show") }}</h4>
    </div>
    <!-- End:: Title -->

    <!-- Start:: Single Step Form Content -->
    <div class="single_step_form_content_wrapper">
      <form @submit.prevent="validateFormInputs">
        <div class="row">
          <!-- Start:: number Input -->
          <base-input col="6" type="number" :placeholder="$t('SIDENAV.Advertisements.number')"
            v-model.trim="data.number" disabled />
          <!-- End:: number Input -->

          <!-- Start:: nameAds Input -->
          <base-input col="6" type="text" :placeholder="$t('SIDENAV.Advertisements.nameAds')"
            v-model.trim="data.nameAds" disabled />
          <!-- End:: nameAds Input -->

          <!-- Start:: dispartment Input -->
          <base-input col="6" type="text" :placeholder="$t('SIDENAV.Advertisements.dispartment')"
            v-model.trim="data.dispartment" disabled />
          <!-- End:: dispartment Input -->

          <!-- Start:: StatusRescive Input -->
          <base-input col="6" type="text" :placeholder="$t('SIDENAV.Advertisements.StatusRescive')"
            v-model.trim="data.StatusRescive" disabled />
          <!-- End:: StatusRescive Input -->

          <!-- Start:: desc Input -->
          <base-input col="6" type="text" :placeholder="$t('SIDENAV.Advertisements.desc')" v-model.trim="data.desc"
            disabled />
          <!-- End:: desc Input -->

          <!-- Start:: Defects Input -->
          <base-input col="6" type="text" :placeholder="$t('SIDENAV.Advertisements.Defects')"
            v-model.trim="data.Defects" disabled />
          <!-- End:: Defects Input -->

          <!-- Start:: status Input -->
          <base-select-input col="6" :optionsList="activeStatuses" :placeholder="$t('SIDENAV.Advertisements.status')"
            v-model="data.status" disabled />
          <!-- End:: status Input -->

          <!-- Start:: date Input -->
          <base-input col="6" type="text" :placeholder="$t('SIDENAV.Advertisements.date')" v-model.trim="data.date"
            disabled />
          <!-- End:: date Input -->

          <div class="title_text_wrapper mt-10">
            <h5 style="color: #57009B;">{{ $t("SIDENAV.Advertisements.loaction") }}</h5>
          </div>

          <!-- Start:: district Input -->
          <base-input col="6" type="text" :placeholder="$t('SIDENAV.Advertisements.district')"
            v-model.trim="data.district" disabled />
          <!-- End:: district Input -->

          <!-- Start:: city Input -->
          <base-input col="6" type="text" :placeholder="$t('SIDENAV.Advertisements.city')" v-model.trim="data.city"
            disabled />
          <!-- End:: city Input -->

          <!-- Start:: Area Input -->
          <base-input col="6" type="text" :placeholder="$t('SIDENAV.Advertisements.Area')" v-model.trim="data.Area"
            disabled />
          <!-- End:: Area Input -->

          <!-- Start:: pleace Input -->
          <base-input col="6" type="text" :placeholder="$t('SIDENAV.Advertisements.pleace')" v-model.trim="data.pleace"
            disabled />
          <!-- End:: pleace Input -->


          <!-- Start:: Image Upload Input -->
          <base-image-upload-input col="6" identifier="admin_image" :preSelectedImage="data.image.path"
            :placeholder="$t('SIDENAV.Advertisements.image')" @selectImage="selectImage" disabled />
          <!-- End:: Image Upload Input -->

          <!-- Start:: Name Input -->
          <v-col col="12" sm="6" md="6">
            <uploadPhotos :urls="imgUrls" disabled>
              {{ $t("SIDENAV.Advertisements.imageSub") }}
            </uploadPhotos>
          </v-col>


        </div>
      </form>
    </div>
    <!-- END:: Single Step Form Content -->
  </div>
</template>

<script>
import moment from "moment";
import UploadPhotos from "@/components/ui/UploadPhotos.vue";


export default {
  name: "CreateAdditionalFields",
  components: {
    UploadPhotos,
  },
  data() {
    return {
      // Start:: Loader Control Data
      isWaitingRequest: false,
      // End:: Loader Control Data

      // Start:: Data Collection To Send
      data: {
        image: {
          path: null,
          file: null,
        },
        number: null,
        nameAds: null,
        dispartment: null,
        StatusRescive: null,
        desc: null,
        Defects: null,
        status: null,
        date: null,
        district: null,
        city: null,
        Area: null,
        pleace: null
      },
      additionalImages: [],
      imgUrls: [],
    };
  },

  computed: {

    activeStatuses() {
      return [
        {
          id: 1,
          name: this.$t("STATUS.active"),
          value: 1,
        },
        {
          id: 2,
          name: this.$t("STATUS.notActive"),
          value: 0,
        },
      ];
    },
  },

  methods: {
    disabledDate(current) {
      return current && current < moment().startOf("day");
    },
    selectImage(selectedImage) {
      this.data.image = selectedImage;
    },

    async getDataToEdit() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `advertisements/${this.$route.params.id}`,
        });

        this.data.number = res.data.data.Advertisement.code;
        this.data.date = res.data.data.Advertisement.created_at.split(" ")[0];
        this.data.nameAds = res.data.data.Advertisement.name;
        this.data.dispartment = res.data.data.Advertisement.category_name;
        this.data.StatusRescive = res.data.data.Advertisement.status;
        this.data.desc = res.data.data.Advertisement.description;
        this.data.Defects = res.data.data.Advertisement.defect;
        this.data.status = res.data.data.Advertisement.is_active;
        this.data.district = res.data.data.Advertisement.neighborhood;
        this.data.city = res.data.data.Advertisement.city_name;
        this.data.Area = res.data.data.Advertisement.region_name;
        this.data.pleace = res.data.data.Advertisement.location;
        
        this.data.image.path = res.data.data.Advertisement.main_image;
        this.additionalImages = res.data.data.Advertisement.additional_images;
        this.imgUrls =
          res.data.data.Advertisement.additional_images &&
          res.data.data.Advertisement.additional_images.map((item) => item);
        if (!this.data.status) {
          this.data.status =
          {
            id: 0,
            name: this.$t("STATUS.notActive"),
            value: 0,
          }
        } else {
          this.data.status =
          {
            id: 1,
            name: this.$t("STATUS.active"),
            value: 1,
          }
        }



      } catch (error) {
        console.log(error.response.data.message);
      }
    },
    // Start:: validate Form Inputs

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
  padding: 8px;
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

  .fa-trash {
    color: #ff2159;
    cursor: pointer
  }
}
</style>