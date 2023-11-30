<template>
  <div class="show_all_content_wrapper" v-if="permissions">
    <!-- Start:: Main Section -->
    <main>
      <!--  =========== Start:: Filter Form =========== -->
      <div class="filter_content_wrapper" :class="{ active: filterFormIsActive }">
        <button class="filter_toggler" @click="filterFormIsActive = !filterFormIsActive">
          <i class="fal fa-times"></i>
        </button>
        <div class="filter_title_wrapper">
          <h5>{{ $t("TITLES.searchBy") }}</h5>
        </div>
        <div class="filter_form_wrapper">
          <form @submit.prevent="submitFilterForm">
            <div class="row justify-content-center align-items-center w-100">
              <!-- Start:: Name Input -->
              <base-input col="3" type="text" :placeholder="$t('PLACEHOLDERS.name')" v-model.trim="filterOptions.name" />
              <!-- End:: Name Input -->

              <!-- Start:: Area Input -->
              <base-select-input v-if="allAreasData" col="3" :optionsList="allAreasData"
                :placeholder="$t('PLACEHOLDERS.area')" v-model="filterOptions.area"
                @input="getCities(filterOptions.area.id), filterOptions.city = null" />
              <!-- End:: Area Input -->

              <!-- Start:: Cities Input -->
              <base-select-input v-if="allCitiesData" col="3" :optionsList="allCitiesData"
                :placeholder="$t('PLACEHOLDERS.city')" v-model="filterOptions.city" />
              <!-- End:: Cities Input -->

              <!-- Start:: Status Input -->
              <base-select-input col="3" :optionsList="activeStatuses" :placeholder="$t('PLACEHOLDERS.status')"
                v-model="filterOptions.status" />
              <!-- End:: Status Input -->
            </div>

            <div class="btns_wrapper">
              <button class="submit_btn" :disabled="isWaitingRequest">
                <i class="fal fa-search"></i>
              </button>
              <button class="reset_btn" type="button" :disabled="isWaitingRequest" @click="resetFilter">
                <i class="fal fa-redo"></i>
              </button>
            </div>
          </form>
        </div>
      </div>
      <!--  =========== End:: Filter Form =========== -->

      <!--  =========== Start:: Table Title =========== -->
      <div class="table_title_wrapper">
        <div class="title_text_wrapper">
          <h5>{{ $t("TITLES.districts") }}</h5>

          <button v-if="!filterFormIsActive" class="filter_toggler"
            @click.stop="filterFormIsActive = !filterFormIsActive">
            <i class="fal fa-search"></i>
          </button>
        </div>
        <div class="title_route_wrapper" v-if="permissions.create">
          <router-link to="/districts/create">
            {{ $t("BUTTONS.addDistrict") }}
          </router-link>
        </div>
      </div>
      <!--  =========== End:: Table Title =========== -->

      <!--  =========== Start:: Data Table =========== -->
      <v-data-table class="thumb" :loading="loading" :loading-text="$t('TABLES.loadingData')" :search="searchValue"
        :headers="tableHeaders" :items="tableRows" item-class="ltr" :items-per-page="paginations.items_per_page"
        hide-default-footer>
        <!-- Start:: No Data State -->
        <template v-slot:no-data>
          {{ $t("TABLES.noData") }}
        </template>
        <!-- Start:: No Data State -->

        <!-- Start:: Activation -->
        <template v-slot:[`item.status`]="{ item }">
          <div class="activation" dir="ltr" style="z-index: 1" v-if="permissions.activate">
            <v-switch class="mt-2" color="success" v-model="item.status" hide-details
              @change="changeActivationStatus(item)"></v-switch>
          </div>

          <template v-else>
            <span class="text-success text-h5" v-if="item.status">
              <i class="far fa-check"></i>
            </span>
            <span class="text-danger text-h5" v-else>
              <i class="far fa-times"></i>
            </span>
          </template>
        </template>
        <!-- End:: Activation -->

        <!-- Start:: Actions -->
        <template v-slot:[`item.actions`]="{ item }">
          <div class="actions">
            <a-tooltip placement="bottom" v-if="permissions.edit">
              <template slot="title">
                <span>{{ $t("BUTTONS.edit") }}</span>
              </template>
              <button class="btn_edit" @click="editItem(item)">
                <i class="fal fa-edit"></i>
              </button>
            </a-tooltip>

            <a-tooltip placement="bottom" v-if="permissions.delete">
              <template slot="title">
                <span>{{ $t("BUTTONS.delete") }}</span>
              </template>
              <button class="btn_delete" @click="selectDeleteItem(item)">
                <i class="fal fa-trash-alt"></i>
              </button>
            </a-tooltip>

            <template v-if="!permissions.edit && !permissions.delete">
              <i class="fal fa-lock-alt fs-5 blue-grey--text text--darken-1"></i>
            </template>
          </div>
        </template>
        <!-- End:: Actions -->

        <!-- ======================== Start:: Dialogs ======================== -->
        <template v-slot:top>
          <!-- Start:: Delete Modal -->
          <v-dialog v-model="dialogDelete">
            <v-card>
              <v-card-title class="text-h5 justify-center" v-if="itemToDelete">
                {{ $t("TITLES.DeleteConfirmingMessage", { name: itemToDelete.name }) }}
              </v-card-title>
              <v-card-actions>
                <v-btn class="modal_confirm_btn" @click="confirmDeleteItem">{{
                  $t("BUTTONS.ok")
                }}</v-btn>

                <v-btn class="modal_cancel_btn" @click="dialogDelete = false">{{ $t("BUTTONS.cancel") }}</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- End:: Delete Modal -->
        </template>
        <!-- ======================== End:: Dialogs ======================== -->
      </v-data-table>
      <!--  =========== End:: Data Table =========== -->
    </main>
    <!-- End:: Main Section -->

    <!-- Start:: Pagination -->
    <template>
      <div class="pagination_container text-center mt-3 mb-0">
        <v-pagination class="py-0" square v-model="paginations.current_page" :length="paginations.last_page"
          :total-visible="6" @input="updateRouterQueryParam($event)" :prev-icon="getAppLocale == 'ar' ? 'fal fa-angle-right' : 'fal fa-angle-left'
            " :next-icon="getAppLocale == 'ar' ? 'fal fa-angle-left' : 'fal fa-angle-right'
    " />
      </div>
    </template>
    <!-- End:: Pagination -->
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "AllDistricts",

  computed: {
    ...mapGetters({
      getAppLocale: "AppLangModule/getAppLocale",
      allAreasData: "ApiGetsModule/allAreasData",
      allCitiesData: "ApiGetsModule/allCitiesByAreaIdData",
    }),

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

  data() {
    return {
      // Start:: Loading Data
      loading: false,
      isWaitingRequest: false,
      // End:: Loading Data

      // Start:: Filter Data
      filterFormIsActive: false,
      filterOptions: {
        name: null,
        area: null,
        city: null,
        status: null,
      },
      // End:: Filter Data

      // Start:: Table Data
      searchValue: "",
      tableHeaders: [
        {
          text: this.$t("TABLES.Districts.serialNumber"),
          value: "id",
          align: "center",
          width: "80",
          sortable: true,
        },
        {
          text: this.$t("TABLES.Districts.nameAr"),
          value: "name_ar",
          align: "center",
        },
        {
          text: this.$t("TABLES.Districts.nameEn"),
          value: "name_en",
          align: "center",
        },
        {
          text: this.$t("TABLES.Districts.area"),
          value: "city.region.name",
          align: "center",
        },
        {
          text: this.$t("TABLES.Districts.city"),
          value: "city.name",
          align: "center",
        },
        {
          text: this.$t("TABLES.Districts.activation"),
          value: "status",
          align: "center",
          width: "120",
        },
        {
          text: this.$t("TABLES.Districts.actions"),
          value: "actions",
          sortable: false,
          align: "center",
        },
      ],
      tableRows: [],
      // End:: Table Data

      // Start:: Dialogs Control Data
      dialogDelete: false,
      itemToDelete: null,
      // End:: Dialogs Control Data

      // Start:: Pagination Data
      paginations: {
        current_page: 1,
        last_page: 1,
        items_per_page: 6,
      },
      // End:: Pagination Data

      permissions: []
    };
  },

  watch: {
    // Start:: Page Query Param Watcher To Get Page Data Based On It's Change
    ["$route.query.page"]() {
      this.paginations.current_page = +this.$route.query.page;
      this.setTableRows();
    },
    // End:: Page Query Param Watcher To Get Page Data Based On It's Change
  },

  methods: {
    // Start:: Vuex Actions
    ...mapActions({
      getAreas: "ApiGetsModule/getAreas",
      getCities: "ApiGetsModule/getCitiesByAreaId",
    }),
    // End:: Vuex Actions

    // Start:: Handel Filter
    async submitFilterForm() {
      if (this.$route.query.page !== '1') {
        await this.$router.push({ path: '/districts/all', query: { page: 1 } });
      }
      this.setTableRows();
    },
    async resetFilter() {
      this.filterOptions.name = null;
      this.filterOptions.area = null;
      this.filterOptions.city = null;
      this.filterOptions.status = null;
      if (this.$route.query.page !== '1') {
        await this.$router.push({ path: '/districts/all', query: { page: 1 } });
      }
      this.setTableRows();
    },
    // End:: Handel Filter

    // Start:: Set Table Rows
    updateRouterQueryParam(pagenationValue) {
      this.$router.push({
        query: {
          ...this.$route.query,
          page: pagenationValue,
        },
      });

      // Scroll To Screen's Top After Get Products
      document.body.scrollTop = 0; // For Safari
      document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    },
    async setTableRows() {
      this.loading = true;
      try {
        let res = await this.$axios({
          method: "GET",
          url: "main/get-towns",
          params: {
            page: this.paginations.current_page,
            keyword: this.filterOptions.name,
            region_id: this.filterOptions.area?.id,
            status: this.filterOptions.status?.value,
          },
        });
        this.loading = false;
        // console.log("All Data district  ==>", res.data);
        this.tableRows = res.data.data;
        this.paginations.last_page = res.data.meta.last_page;
        this.paginations.items_per_page = res.data.meta.per_page;
        this.permissions = res.data.permissions;

      } catch (error) {
        this.loading = false;
        console.log(error.response.data.message);
      }
    },
    // End:: Set Table Rows

    // ==================== Start:: Crud ====================
    // ===== Start:: Edit
    editItem(item) {
      this.$router.push({ path: `/districts/edit/${item.id}` });
    },
    // ===== End:: Edit

    // ===== Start:: Delete
    selectDeleteItem(item) {
      this.dialogDelete = true;
      this.itemToDelete = item;
    },
    async confirmDeleteItem() {
      try {
        await this.$axios({
          method: "POST",
          url: `main/delete-town`,
          params: {
            town_id: this.itemToDelete.id,
          },
        });
        this.dialogDelete = false;
        this.tableRows = this.tableRows.filter((item) => {
          return item.id != this.itemToDelete.id;
        });
        this.setTableRows();
        this.$message.success(this.$t("MESSAGES.deletedSuccessfully"));
      } catch (error) {
        this.dialogDelete = false;
        this.$message.error(error.response.data.message);
      }
    },
    // ===== End:: Delete
    // ==================== End:: Crud ====================

    // Start:: Change Activation Status
    async changeActivationStatus(item) {
      try {
        await this.$axios({
          method: "POST",
          url: `main/change-status`,
          params: {
            id: item.id,
            status: +item.status,
            type: "town",
          },
        });
        this.$message.success(this.$t("MESSAGES.changeActivation"));
      } catch (error) {
        this.$message.error(error.response.data.message);
      }
    },
    // End:: Change Activation Status
  },

  created() {
    // Start:: Fire Methods
    window.addEventListener("click", () => {
      this.filterFormIsActive = false;
    });
    if (this.$route.query.page) {
      this.paginations.current_page = +this.$route.query.page;
    }
    this.getAreas();
    this.getCities();
    this.setTableRows();
    // End:: Fire Methods
  },
};
</script>
