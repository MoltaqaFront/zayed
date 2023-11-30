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

              <base-select-input col="4" :optionsList="allStores" :placeholder="$t('PLACEHOLDERS.store')"
                v-model="filterOptions.store_id" required />

              <!-- Start:: Start Date Input -->
              <base-picker-input col="4" type="date" :placeholder="$t('PLACEHOLDERS.startDate')"
                v-model.trim="filterOptions.from_date" />
              <!-- End:: Start Date Input -->

              <!-- Start:: End Date Input -->
              <base-picker-input col="4" type="date" :placeholder="$t('PLACEHOLDERS.endDate')"
                v-model.trim="filterOptions.to_date" />
              <!-- End:: End Date Input -->

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
          <h5>{{ $t("PLACEHOLDERS.order_report") }}</h5>
          <button v-if="!filterFormIsActive" class="filter_toggler"
            @click.stop="filterFormIsActive = !filterFormIsActive">
            <i class="fal fa-search"></i>
          </button>
        </div>

        <div class="title_route_wrapper">
          <!-- <base-button class="mt-0 pdf_btn" styleType="solid_btn" :btnText="$t('BUTTONS.downloadPdf')"
            @fireClick="downloadPdf" :disabled="pdfDownloadBtnIsLoading">
            <template v-slot:btn_icon>
              <i class="fal fa-file-pdf"></i>
            </template>
          </base-button> -->

          <!-- <base-button
            class="mt-0 excel_btn"
            styleType="solid_btn"
            :btnText="$t('BUTTONS.downloadExcel')"
          >
            <template v-slot:btn_icon>
              <i class="fal fa-file-excel"></i>
            </template>
          </base-button> -->
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

        <template v-slot:[`item.id`]="{ item, index }">
          <div class="table_image_wrapper">
            <h6 class="text-danger" v-if="!item.id"> {{ $t("TABLES.noData") }} </h6>
            <p v-else>{{ (paginations.current_page - 1) * paginations.items_per_page + index + 1 }}</p>
          </div>
        </template>

        <!-- Start:: Total Services In Progress -->
        <!-- <template v-slot:[`item.bookingServicesInProcessing`]="{ item }">
          <router-link :to="{
            path: `/main/report-details`, query: {
              driver_id: item.driver,
              booking_type: 'service',
              status: 'processing',
              from_date: filterOptions.from_date,
              to_date: filterOptions.to_date
            }
          }" :disabled="item.bookingServicesInProcessing == '0.00' || item.bookingServicesInProcessing == '0'">
            {{ item.bookingServicesInProcessing }} {{ $t("SYSTEM_CURRENCY") }}
          </router-link>
        </template> -->
        <!-- End:: Total Services In Progress -->

        <!-- Start:: Total Finished Services -->
        <!-- <template v-slot:[`item.bookingServicesEnded`]="{ item }">
          <router-link :to="{
            path: `/main/report-details`,
            query: {
              driver_id: item.driver,
              booking_type: 'service',
              status: 'ended',
              from_date: filterOptions.from_date,
              to_date: filterOptions.to_date
            }
          }" :disabled="item.bookingServicesEnded == '0.00' || item.bookingServicesEnded == '0'">
            {{ item.bookingServicesEnded }} {{ $t("SYSTEM_CURRENCY") }}
          </router-link>
        </template> -->
        <!-- End:: Total Finished Services -->

        <!-- Start:: Total Products In Progress -->
        <!-- <template v-slot:[`item.bookingProductsInProcessing`]="{ item }">
          <router-link :to="{
            path: `/main/report-details`,
            query: {
              driver_id: item.driver,
              order_type: 'product',
              status: 'processing',
              from_date: filterOptions.from_date,
              to_date: filterOptions.to_date
            }
          }" :disabled="item.bookingProductsInProcessing == '0.00' || item.bookingProductsInProcessing == '0'">
            {{ item.bookingProductsInProcessing }} {{ $t("SYSTEM_CURRENCY") }}
          </router-link>
        </template> -->
        <!-- End:: Total Products In Progress -->

        <!-- Start:: Total Finished Products -->
        <!-- <template v-slot:[`item.bookingProductsEnded`]="{ item }">
          <router-link :to="{
            path: `/main/report-details`,
            query: {
              driver_id: item.driver,
              order_type: 'product',
              status: 'ended',
              from_date: filterOptions.from_date,
              to_date: filterOptions.to_date
            }
          }" :disabled="item.bookingProductsEnded == '0.00' || item.bookingProductsEnded == '0'">
            {{ item.bookingProductsEnded }} {{ $t("SYSTEM_CURRENCY") }}
          </router-link>
        </template> -->
        <!-- End:: Total Finished Products -->
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

    <!-- Start:: Generate PDF Template Content -->
    <!-- <vue-html2pdf :show-layout="false" :float-layout="true" :enable-download="true" :preview-modal="true"
      :filename="$t('TITLES.financialReports')" :pdf-quality="2" pdf-format="a4" :manual-pagination="false"
      :paginate-elements-by-height="1400" pdf-content-width="100%" @progress="bdfDownloadBtnIsLoading = true"
      @hasGenerated="$message.success($t('MESSAGES.generatedSuccessfully'))" ref="html2Pdf">
      <section slot="pdf-content">
        <div class="pdf_file_content">
          <h1 class="file_title"> {{ $t('TITLES.financialReports') }} </h1>

          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th v-for="header in tableHeaders" :key="header.value">
                    {{ header.text }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in tableRows" :key="row.id">
                  <td>{{ row.id }}</td>
                  <td>{{ row.driver_name }}</td>
                  <td>{{ row.phone_number }}</td>
                  <td>{{ row.bookingServicesInProcessing }} {{ $t("SYSTEM_CURRENCY") }}</td>
                  <td>{{ row.bookingServicesEnded }} {{ $t("SYSTEM_CURRENCY") }}</td>
                  <td>{{ row.bookingProductsInProcessing }} {{ $t("SYSTEM_CURRENCY") }}</td>
                  <td>{{ row.bookingProductsEnded }} {{ $t("SYSTEM_CURRENCY") }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </div>
      </section>
    </vue-html2pdf> -->
    <!-- End:: Generate PDF Template Content -->
  </div>
</template>

<script>
// import VueHtml2pdf from 'vue-html2pdf';
import { mapGetters } from "vuex";

export default {
  name: "AllFinancialReports",

  components: {
    // VueHtml2pdf
  },

  computed: {
    ...mapGetters({
      getAppLocale: "AppLangModule/getAppLocale",
    }),
  },

  data() {
    return {
      // Start:: Loading Data
      loading: false,
      isWaitingRequest: false,
      pdfDownloadBtnIsLoading: false,
      excelDownloadBtnIsLoading: false,
      // End:: Loading Data

      // Start:: Filter Data
      filterFormIsActive: false,
      filterOptions: {
        store_id: null,
        from_date: null,
        to_date: null
      },
      allStores: [],
      // End:: Filter Data

      // Start:: Table Data
      searchValue: "",
      tableHeaders: [
        {
          text: this.$t("TABLES.FinancialReports.serialNumber"),
          value: "id",
          align: "center",
          width: "80",
          sortable: false,
        },
        {
          text: this.$t("PLACEHOLDERS.store"),
          value: "store.name",
          sortable: false,
          align: "center",
        },
        {
          text: this.$t("TABLES.FinancialReports.totalProductsInProcessing"),
          value: "order_not_finished_count",
          sortable: false,
          align: "center",
        },
        {
          text: this.$t("TABLES.FinancialReports.totalProductsEnded"),
          value: "order_finished_count",
          sortable: false,
          align: "center",
        },
        {
          text: this.$t("TABLES.Orders.totalPrice"),
          value: "total_price",
          sortable: false,
          align: "center",
        },
      ],
      tableRows: [],
      // End:: Table Data

      // Start:: Pagination Data
      paginations: {
        current_page: 1,
        last_page: 1,
        items_per_page: 6,
      },
      // End:: Pagination Data

      // Start:: Page Permissions
      permissions: null,
      // Start:: Page Permissions
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
    // Start:: Handel Filter
    async submitFilterForm() {
      if (this.$route.query.page !== '1') {
        await this.$router.push({ path: '/financial-reports/all', query: { page: 1 } });
      }
      this.setTableRows();
    },
    async resetFilter() {
      this.filterOptions.store_id = null;
      this.filterOptions.from_date = null;
      this.filterOptions.to_date = null;
      if (this.$route.query.page !== '1') {
        await this.$router.push({ path: '/financial-reports/all', query: { page: 1 } });
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
          url: "admin/orders-report",
          params: {
            page: this.paginations.current_page,
            store_id: this.filterOptions.store_id?.id,
            from: this.filterOptions.from_date,
            to: this.filterOptions.to_date,
          },
        });
        this.loading = false;
        // console.log("All Data ==>", res.data.data);
        this.tableRows = res.data.body.reports;
        this.paginations.last_page = res.data.body.meta.last_page;
        this.paginations.items_per_page = res.data.body.meta.per_page;
        this.permissions = res.data.body.permissions;
      } catch (error) {
        this.loading = false;
        console.log(error.response.data.message);
      }
    },
    // End:: Set Table Rows

    // Start:: Handling Download Files
    async downloadPdf() {
      await this.$refs.html2Pdf.generatePdf();
      this.pdfDownloadBtnIsLoading = false;
    },
    // End:: Handling Download Files

    // ==================== Start:: Crud ====================
    // ===== Start:: Show
    showItem(item) {
      this.$router.push({ path: `/financial-reports/show/${item.id}` });
    },
    // ===== End:: Show

    async getAllStores() {
      this.loading = true;
      try {
        let res = await this.$axios({
          method: "GET",
          url: "admin/stores",
        });
        this.allStores = res.data.body.stores;
        this.allStores.unshift({ name: this.$t('STATUS.all'), id: null, value: null });
        console.log(res.data.body.stores)
      } catch (error) {
        this.loading = false;
        console.log(error.response.data.message);
      }
    },

    // ==================== End:: Crud ====================
  },

  created() {
    // Start:: Fire Methods
    window.addEventListener("click", () => {
      this.filterFormIsActive = false;
    });
    if (this.$route.query.page) {
      this.paginations.current_page = +this.$route.query.page;
    }
    this.setTableRows();
    this.getAllStores()
    // End:: Fire Methods
  },
};
</script>
