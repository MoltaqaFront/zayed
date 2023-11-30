<template>
  <div class="crud_form_wrapper">
    <!-- Start:: Title -->
    <div class="form_title_wrapper">
      <h4>{{ $t("TITLES.editDistrict") }}</h4>
    </div>
    <!-- End:: Title -->

    <!-- Start:: Single Step Form Content -->
    <div class="single_step_form_content_wrapper">
      <form @submit.prevent="validateFormInputs">
        <div class="row">
          <!-- Start:: Ar Name Input -->
          <base-input col="6" type="text" :placeholder="$t('PLACEHOLDERS.nameAr')" v-model.trim="data.nameAr" required />
          <!-- End:: Ar Name Input -->

          <!-- Start:: En Name Input -->
          <base-input col="6" type="text" :placeholder="$t('PLACEHOLDERS.nameEn')" v-model.trim="data.nameEn" required />
          <!-- End:: En Name Input -->

          <!-- Start:: Area Input -->
          <base-select-input v-if="allAreasData" col="6" :optionsList="allAreasData"
            :placeholder="$t('PLACEHOLDERS.area')" v-model="data.area" @fireInputEvent="
              getCitiesByAreaId(data.area.id);
            data.city = null;
            " required />
          <!-- End:: Area Input -->

          <!-- Start:: City Input -->
          <base-select-input v-if="allCitiesByAreaIdData" col="6" :optionsList="allCitiesByAreaIdData"
            :placeholder="$t('PLACEHOLDERS.city')" v-model="data.city" :disabled="!data.area" required />
          <!-- End:: City Input -->

          <div class="row">
            <div class="col-md-4 col-12" v-for="(item, index) in items" :key="index">
              <div class="form-group">
                <input class="form-check-input" type="checkbox" :value="item.id" :id="item.name" v-model="selected">
                <label class="form-check-label" :for="item.name">
                  {{ item.name }}
                </label>
              </div>
            </div>
          </div>

          <!-- Start:: Deactivate Switch Input -->
          <div class="input_wrapper switch_wrapper my-5">
            <v-switch color="green" :label="data.active ? $t('PLACEHOLDERS.active') : $t('PLACEHOLDERS.notActive')"
              v-model="data.active" hide-details></v-switch>
          </div>
          <!-- End:: Deactivate Switch Input -->

          <div class="row">
            <div class="col-12">
              <div class="form-group">
                <input class="form-check-input" type="checkbox" id="select_map" v-model="select_map">
                <label class="form-check-label" for="select_map">
                  {{ $t('PLACEHOLDERS.select_map') }}
                </label>
              </div>

              <div class="map_content" v-if="select_map">
                <div class="form-group">
                  <div class="w-100">
                    <div class="row">
                      <div class="col-lg-6 col-12">
                        <GmapAutocomplete @place_changed="setPlace" :placeholder="$t('PLACEHOLDERS.search_place')" />
                      </div>

                      <div class="col-lg-6 col-12">
                        <base-input col="12" type="text" :placeholder="$t('PLACEHOLDERS.radius')" v-model.trim="Radius"
                          required />
                      </div>

                    </div>

                  </div>
                </div>

                <div class="form-group mt-4">
                  <GmapMap :center="center" :zoom="zoom" map-type-id="terrain" style="width: 100%; height: 300px"
                    @click="handleMapClick">
                    <GmapMarker :position="marker.position" :clickable="true" :draggable="true" @click="markerClicked"
                      @dragend="markerDragged($event)" />
                    <GmapCircle v-if="circle" :center="circle.center" :radius="circle.radius" :options="circleOptions" />
                  </GmapMap>

                </div>
              </div>

            </div>
          </div>

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

export default {
  name: "EditDistrict",

  props: {
    id: {
      type: String,
      required: true,
    },
  },

  computed: {
    // Start:: Vuex Getters
    ...mapGetters({
      allAreasData: "ApiGetsModule/allAreasData",
      allCitiesByAreaIdData: "ApiGetsModule/allCitiesByAreaIdData",
    }),
    // End:: Vuex Getters
  },

  data() {
    return {
      // Start:: Loader Control Data
      isWaitingRequest: false,
      // End:: Loader Control Data

      // Start:: Data Collection To Send
      data: {
        nameAr: null,
        nameEn: null,
        area: null,
        city: null,
        active: false,
      },
      items: [],

      selected: [],
      service_types: [],

      // google maps

      select_map: 0,

      center: { lat: 24.7136, lng: 46.6753 },
      zoom: 11,
      currentPlace: null,
      AllCategories: [],
      marker: {
        position: { lat: 24.7136, lng: 46.6753 }, // Initial marker position (Riyadh)
      },

      Latitude: '',
      Longitude: '',
      Radius: '',
      place: '',

      circle: null,
      circleOptions: {
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        strokeWeight: 1,
        clickable: false,
        editable: false,
        zIndex: 1,
      },
      // End:: Data Collection To Send
    };
  },

  watch: {
    Radius: 'getCircle',
  },


  methods: {
    // Start:: Vuex Actions
    ...mapActions({
      getAreas: "ApiGetsModule/getAreas",
      getCitiesByAreaId: "ApiGetsModule/getCitiesByAreaId",
    }),
    // End:: Vuex Actions

    getCircle() {
      // Parse the Radius to ensure it's a valid number
      const radius = parseFloat(this.Radius);

      // Check if radius is a valid number
      if (!isNaN(radius)) {
        this.circle = {
          center: this.marker.position,
          radius: radius,
        };
      } else {
        // Handle invalid input (optional)
        this.circle = null;
      }
    },

    // Start:: Get Data To Edit
    async getDataToEdit() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `main/show-town`,
          params: {
            town_id: this.id,
          }
        });
        // console.log( "DATA TO EDIT ==>", res.data.data );

        this.data.nameAr = res.data.data.name_ar;
        this.data.nameEn = res.data.data.name_en;
        this.data.area = res.data.data.city.region;
        this.data.active = res.data.data.status;
        this.data.city = res.data.data.city;

        this.select_map = res.data.data.check_map;

        this.Latitude = +res.data.data.lat;
        this.Longitude = +res.data.data.lon;

        this.center.lat = +res.data.data.lat;
        this.center.lng = +res.data.data.lon;

        this.marker.position.lat = +res.data.data.lat;
        this.marker.position.lng = +res.data.data.lon;

        this.Radius = res.data.data.radius;

        // this.items = res.data.data.service_types;
        this.selected = res.data.data.service_types.map(item => item.service_type_id);;
        this.getCitiesByAreaId(res.data.data.city.region.id);
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
    // End:: Get Data To Edit

    // Start:: Get Data To show
    async getDataServices() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `main/service-type`,
        });
        // console.log( "DATA TO show ==>", res.data.data );

        this.items = res.data.data;
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
    // End:: Get Data To Edit

    // Start:: validate Form Inputs
    validateFormInputs() {
      this.isWaitingRequest = true;

      if (!this.data.nameAr) {
        this.isWaitingRequest = false;
        this.$message.error(this.$t("VALIDATION.nameAr"));
        return;
      } else if (!this.data.nameEn) {
        this.isWaitingRequest = false;
        this.$message.error(this.$t("VALIDATION.nameEn"));
        return;
      } else if (!this.data.area) {
        this.isWaitingRequest = false;
        this.$message.error(this.$t("VALIDATION.area"));
        return;
      } else if (!this.data.city) {
        this.isWaitingRequest = false;
        this.$message.error(this.$t("VALIDATION.city"));
        return;
      } else {
        this.submitForm();
        return;
      }
    },
    // End:: validate Form Inputs

    // Start:: Submit Form
    async submitForm() {
      const REQUEST_DATA = new FormData();
      // Start:: Append Request Data
      REQUEST_DATA.append("name_ar", this.data.nameAr);
      REQUEST_DATA.append("name_en", this.data.nameEn);
      REQUEST_DATA.append("city_id", this.data.city.id);
      REQUEST_DATA.append("status", +this.data.active);


      REQUEST_DATA.append("check_map", +this.select_map);
      REQUEST_DATA.append("lat", this.Latitude);
      REQUEST_DATA.append("lon", this.Longitude);
      REQUEST_DATA.append("radius", this.Radius);

      this.selected.forEach((element, i) => {
        REQUEST_DATA.append(`service_type_id[${i}]`, element);
      });
      // Start:: Append Request Data

      try {
        await this.$axios({
          method: "POST",
          url: `main/update-town/${this.id}`,
          data: REQUEST_DATA,
        });
        this.isWaitingRequest = false;
        this.$message.success(this.$t("MESSAGES.editedSuccessfully"));
        this.$router.push({ path: "/districts/all" });
      } catch (error) {
        this.isWaitingRequest = false;
        this.$message.error(error.response.data.message);
      }
    },
    // End:: Submit Form

    updateSelected(value) {
      const index = this.selected.indexOf(value);
      if (index > -1) {
        // Value already exists, remove it
        this.selected.splice(index, 1);
      } else {
        // Value doesn't exist, add it
        this.selected.push(value);
      }
    },
    isSelected(serviceTypeId) {
      return this.selected.includes(serviceTypeId);
    },

    // google maps

    getCircle() {
      // Parse the Radius to ensure it's a valid number
      const radius = parseFloat(this.Radius) * 1000;

      // Check if radius is a valid number
      if (!isNaN(radius)) {
        this.circle = {
          center: this.marker.position,
          radius: radius,
        };
      } else {
        // Handle invalid input (optional)
        this.circle = null;
      }
    },

    handleMapClick(event) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();

      // const radius = this.calculateDistance(lat, lng, this.center.lat, this.center.lng);

      const geocoder = new google.maps.Geocoder();
      const latLng = new google.maps.LatLng(lat, lng);

      geocoder.geocode({ location: latLng }, (results, status) => {
        if (status === 'OK' && results[0]) {
          this.Latitude = lat;
          this.Longitude = lng;
          // this.Radius = radius;
          this.place = results[0].formatted_address;

          console.log('Latitude:', lat);
          console.log('Longitude:', lng);
          // console.log('Radius:', radius);
          console.log('Place:', results[0].formatted_address);

          this.marker.position = { lat, lng }; // Update the marker's position

          this.getCircle();

        }
      });
    },

    calculateDistance(lat1, lng1, lat2, lng2) {
      const R = 6371; // Radius of the earth in kilometers
      const dLat = this.deg2rad(lat2 - lat1);
      const dLng = this.deg2rad(lng2 - lng1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c; // Convert to kilometers
      return distance;
    },

    deg2rad(deg) {
      return deg * (Math.PI / 180);
    },

    setPlace(place) {
      this.currentPlace = place;
      this.addMarker()
    },

    addMarker() {
      if (this.currentPlace) {
        this.marker.position.lat = this.currentPlace.geometry.location.lat();
        this.marker.position.lng = this.currentPlace.geometry.location.lng();

        this.Latitude = this.currentPlace.geometry.location.lat();
        this.Longitude = this.currentPlace.geometry.location.lng();

        this.center.lat = this.currentPlace.geometry.location.lat();
        this.center.lng = this.currentPlace.geometry.location.lng();
        this.currentPlace = null;
      }
    },

    markerClicked() {
      // Handle marker click event
      const lat = this.marker.position.lat;
      const lng = this.marker.position.lng;
      // const radius = this.calculateDistance(lat, lng, this.center.lat, this.center.lng);
      console.log('Marker clicked:', lat, lng);
      // console.log(radius);
    },

    async markerDragged(event) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();

      // const radius = this.calculateDistance(lat, lng, this.center.lat, this.center.lng);

      try {
        const geocoder = new google.maps.Geocoder();
        const latLng = new google.maps.LatLng(lat, lng);
        const results = await this.reverseGeocode(lat, lng, geocoder);

        if (results.length > 0) {
          this.Latitude = lat;
          this.Longitude = lng;
          // this.Radius = radius;
          this.place = results[0].formatted_address;

          console.log('Latitude:', lat);
          console.log('Longitude:', lng);
          // console.log('Radius:', radius); 
          console.log('Place:', results[0].formatted_address);

          this.marker.position = { lat, lng }; // Update the marker's position

          this.getCircle();
        }
      } catch (error) {
        console.error('Error fetching location:', error);
      }
    },

    reverseGeocode(lat, lng, geocoder) {
      return new Promise((resolve, reject) => {
        const latLng = new google.maps.LatLng(lat, lng);
        geocoder.geocode({ location: latLng }, (results, status) => {
          if (status === 'OK') {
            resolve(results);
          } else {
            reject(new Error('Geocoder failed'));
          }
        });
      });
    },


  },

  async created() {
    // Start:: Fire Methods
    await this.$store.dispatch("PermissionsModule/checkRoutePermissions", "towns edit");
    this.getAreas();
    this.getDataToEdit();
    this.getDataServices()
    // End:: Fire Methods
  },
};
</script>

<style lang="scss"scoped>
.form-group {
  display: flex;
  align-items: center;
  gap: 30px;

  input {
    width: 30px;
    height: 30px;
  }
}

.map_content {
  .w-100 {
    input {
      width: 100%;
      border: 1px solid #249ad5;
      margin: 30px 0;
      padding: 20px;
      min-height: 46px;
      border-radius: 10px;
    }
  }
}
</style>