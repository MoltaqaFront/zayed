<template>
  <div class="show_all_content_wrapper">
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
              <base-input col="6" type="text" :placeholder="$t('SIDENAV.Advertisements.number')"
                v-model.trim="filterOptions.number" />
              <!-- End:: Name Input -->

              <!-- Start:: nameAds Input -->
              <base-input col="6" type="tel" :placeholder="$t('SIDENAV.Advertisements.nameAds')"
                v-model.trim="filterOptions.nameAds" />
              <!-- End:: nameAds Input -->

              <!-- Start:: Start dispartment Input -->
              <base-select-input col="6" :optionsList="Allcategories"
                :placeholder="$t('SIDENAV.Advertisements.dispartment')" v-model.trim="filterOptions.dispartment" />
              <!-- End:: Start dispartment Input -->

              <!-- Start:: userName Input -->
              <base-input col="6" type="text" :placeholder="$t('SIDENAV.Advertisements.userName')"
                v-model.trim="filterOptions.userName" />
              <!-- End:: userName Input -->

              <!-- Start:: UserBenfit Input -->
              <base-input col="6" type="text" :placeholder="$t('SIDENAV.Advertisements.UserBenfit')"
                v-model.trim="filterOptions.UserBenfit" />
              <!-- End:: UserBenfit Input -->

              <!-- Start:: End StatusRescive Input -->
              <base-select-input col="6" :optionsList="AllStatusRescive"
                :placeholder="$t('SIDENAV.Advertisements.StatusRescive')" v-model.trim="filterOptions.StatusRescive" />
              <!-- End:: End StatusRescive Input -->

              <!-- Start:: End status Input -->
              <base-select-input col="6" :optionsList="activeStatuses"
                :placeholder="$t('SIDENAV.Advertisements.status') " v-model="filterOptions.status" />

              <!-- End:: End status Input -->

            </div>

            <div class="btns_wrapper">

              <a-tooltip placement="bottom">
                <template slot="title">
                  <span>{{ $t("BUTTONS.search") }}</span>
                </template>
                <span class="submit_btn" @click="submitFilterForm" :disabled="isWaitingRequest">
                  <i class="fal fa-search"></i>
                </span>
              </a-tooltip>

              <a-tooltip placement="bottom">
                <template slot="title">
                  <span>{{ $t("BUTTONS.rseet_search") }}</span>
                </template>
                <span class="reset_btn" :disabled="isWaitingRequest" @click="resetFilter">
                  <i class="fal fa-redo"></i>
                </span>
              </a-tooltip>

            </div>
          </form>
        </div>
      </div>
      <!--  =========== End:: Filter Form =========== -->

      <!--  =========== Start:: Table Title =========== -->
      <div class="table_title_wrapper">
        <div class="title_text_wrapper">
          <h5>{{ $t("SIDENAV.Advertisements.title") }}</h5>
          <button v-if="!filterFormIsActive" class="filter_toggler"
            @click.stop="filterFormIsActive = !filterFormIsActive">
            <i class="fal fa-search"></i>
          </button>
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

        <template v-slot:[`item.serialNumber`]="{ item, index }">
          <div class="table_image_wrapper">
            <h6 class="text-danger" v-if="!item.serialNumber"> {{ $t("TABLES.noData") }} </h6>
            <p v-else>{{ (paginations.current_page - 1) * paginations.items_per_page + index + 1 }}</p>
          </div>
        </template>

        <!-- Start:: Name -->
        <template v-slot:[`item.name`]="{ item }">
          <h6 class="text-danger" v-if="!item.name"> {{ $t("TABLES.noData") }} </h6>
          <h6 v-else> {{ item.name }} </h6>
        </template>
        <!-- End:: Name -->

        <!-- Start:: Status -->
        <template v-slot:[`item.status`]="{ item }">
          <h6 class="text-danger" v-if="!item.status"> {{ $t("TABLES.noData") }} </h6>
          <v-chip v-else color="blue-grey darken-3" text-color="white" small>
            {{ item.status }}
          </v-chip>
        </template>
        <!-- End:: status -->

        <!-- Start:: Activation Status -->
        <template v-slot:[`item.is_active`]="{ item }">
          <span class="text-success text-h5" v-if="item.is_active">
            <i class="far fa-check"></i>
          </span>
          <span class="text-danger text-h5" v-else>
            <i class="far fa-times"></i>
          </span>
        </template>
        <!-- End:: Activation Status -->

        <!-- Start:: Actions -->
        <template v-slot:[`item.actions`]="{ item }">
          <div class="actions">
            <a-tooltip placement="bottom">
              <template slot="title">
                <span>{{ $t("BUTTONS.show") }}</span>
              </template>
              <button class="btn_show" @click="showItem(item)">
                <i class="fal fa-eye"></i>
              </button>
            </a-tooltip>

            <template v-if="$can('advertisements activate', 'advertisements')">
              <a-tooltip placement="bottom" v-if="!item.is_active">
                <template slot="title">
                  <span>{{ $t("BUTTONS.activate") }}</span>
                </template>
                <button class="btn_activate" @click="HandlingItemActivationStatus(item)">
                  <i class="fad fa-check-circle"></i>
                </button>
              </a-tooltip>
              <a-tooltip placement="bottom" v-if="item.is_active">
                <template slot="title">
                  <span>{{ $t("BUTTONS.deactivate") }}</span>
                </template>
                <button class="btn_deactivate" @click="selectDeactivateItem(item)">
                  <i class="fad fa-times-circle"></i>
                </button>
              </a-tooltip>
            </template>

            <a-tooltip placement="bottom">
              <template slot="title">
                <span>{{ $t("BUTTONS.download_invoice") }}</span>
              </template>
              <!-- @click="DownloadInvoice(item)" -->
              <button class="btn_show" @click="downloadPdf(item)">
                <i class="fal fa-download"></i>
              </button>
            </a-tooltip>
          </div>
        </template>
        <!-- End:: Actions -->
        <!-- ======================== Start:: Dialogs ======================== -->
        <template v-slot:top>

          <!-- Start:: Deactivate Modal -->
          <v-dialog v-model="dialogDeactivate">
            <v-card>
              <v-card-title class="text-h5 justify-center" v-if="itemToChangeActivationStatus">
                {{
                  $t("TITLES.DeactivateConfirmingMessage", {
                    name: itemToChangeActivationStatus.name,
                  })
                }}
              </v-card-title>

              <form class="w-100">
                <base-input col="12" rows="3" type="textarea" :placeholder="$t('PLACEHOLDERS.deactivateReason')"
                  v-model.trim="deactivateReason" required />
              </form>

              <v-card-actions>
                <v-btn class="modal_confirm_btn" @click="HandlingItemActivationStatus" :disabled="!!!deactivateReason">
                  {{ $t("BUTTONS.ok") }}
                </v-btn>

                <v-btn class="modal_cancel_btn" @click="dialogDeactivate = false">{{ $t("BUTTONS.cancel") }}</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- End:: Deactivate Modal -->

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

    <!-- Start:: Generate PDF Template Content -->
    <vue-html2pdf :show-layout="false" :float-layout="true" :enable-download="true" :preview-modal="true"
      filename="report" :pdf-quality="2" pdf-format="a4" :manual-pagination="false" :paginate-elements-by-height="1400"
      pdf-content-width="100%" @progress="bdfDownloadBtnIsLoading = true"
      @hasGenerated="$message.success($t('MESSAGES.generatedSuccessfully'))" ref="html2Pdf">
      <section slot="pdf-content">
        <div class="pdf_file_content">
          <!-- <tr v-for="(value, key) in itemReport" :key="key">
                <td>{{ key }}</td>
                <td>{{ value }}</td>
              </tr> -->

          <table class="table table-striped">
            <tbody>
              <tr class="text-center">
                <td>
                  <span v-html="qr"></span>
                  <span class="mx-5">{{ $t("PLACEHOLDERS.qr") }}</span>
                </td>
              </tr>
              <tr class="text-center">
                <td>{{ $t("SIDENAV.Advertisements.number") }}</td>
                <td>{{ number }}</td>
              </tr>

              <tr class="text-center">
                <td>{{ $t("SIDENAV.Advertisements.count") }}</td>
                <td>{{ count }}</td>
              </tr>

              <tr class="text-center">
                <td>{{ $t("SIDENAV.Advertisements.nameAds") }}</td>
                <td>{{ nameAds }}</td>
              </tr>

              <tr class="text-center">
                <td>{{ $t("SIDENAV.Advertisements.dispartment") }}</td>
                <td>{{ dispartment }}</td>
              </tr>

              <tr class="text-center">
                <td>{{ $t("SIDENAV.Advertisements.userName") }}</td>
                <td>{{ userName }}</td>
              </tr>

              <tr class="text-center">
                <td>{{ $t("SIDENAV.Advertisements.UserBenfit") }}</td>
                <td>{{ UserBenfit }}</td>
              </tr>

              <tr class="text-center">
                <td>{{ $t("SIDENAV.Advertisements.cost") }}</td>
                <td>{{ cost }}</td>
              </tr>

              <tr class="text-center">
                <td>{{ $t("SIDENAV.Advertisements.TaxSalery") }}</td>
                <td>{{ TaxSalery }}</td>
              </tr>

              <tr class="text-center">
                <td>{{ $t("SIDENAV.Advertisements.total") }}</td>
                <td>{{ total }}</td>
              </tr>

              <tr class="text-center">
                <td>{{ $t("SIDENAV.Advertisements.date") }}</td>
                <td>{{ date }}</td>
              </tr>

            </tbody>
          </table>

        </div>
      </section>
    </vue-html2pdf>
    <!-- End:: Generate PDF Template Content -->
  </div>
</template>

<script>
import VueHtml2pdf from 'vue-html2pdf';
import { mapGetters } from "vuex";
import moment from 'moment';

export default {
  name: "AllOrders",

 components: {
    VueHtml2pdf
  
  },
  computed: {
    ...mapGetters({
      getAppLocale: "AppLangModule/getAppLocale",
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
    AllStatusRescive() {
      return [
        {
          id: 1,
          name: this.$t("SIDENAV.Advertisements.available"),
          value: "available",
        },
        {
          id: 2,
          name: this.$t("SIDENAV.Advertisements.block"),
          value: "booked",
        },
        {
          id: 3,
          name: this.$t("SIDENAV.Advertisements.done"),
          value: "sold",
        },
        {
          id: 4,
          name: this.$t("SIDENAV.Advertisements.disconnent"),
          value: "missed",
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
        number: null,
        nameAds: null,
        userName: null,
        dispartment: null,
        UserBenfit: null,
        StatusRescive: null,
        status: null
      },
      // End:: Filter Data
      Allcategories :[],
      // Start:: Table Data
      searchValue: "",
      tableHeaders: [
        {
          text: this.$t("TABLES.Clients.serialNumber"),
          value: "serialNumber",
          align: "center",
          width: "80",
          sortable: false,
        },
        {
          text: this.$t("SIDENAV.Advertisements.number"),
          value: "code",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("SIDENAV.Advertisements.nameAds"),
          value: "name",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("SIDENAV.Advertisements.dispartment"),
          value: "category_name",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("SIDENAV.Advertisements.userName"),
          value: "clinet_name",
          align: "center",
          sortable: false,
        },
         {
           text: this.$t("SIDENAV.Advertisements.UserBenfit"),
           value: "user_name",
          align: "center",
          sortable: false,
        },
         {
           text: this.$t("SIDENAV.Advertisements.StatusRescive"),
           value: "status",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("SIDENAV.Advertisements.status"),
          value: "is_active",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("SIDENAV.Advertisements.date"),
          value: "created_at",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("TABLES.Clients.actions"),
          value: "actions",
          sortable: false,
          align: "center",
        },
      ],
      tableRows: [],
      // End:: Table Data

      dialogDelete: false,
      itemToDelete: null,
      dialogDeactivate: false,
      itemToChangeActivationStatus: null,
      deactivateReason: null,

      // Start:: Pagination Data
      paginations: {
        current_page: 1,
        last_page: 1,
        items_per_page: 6,
      },
       permissions: null,
      file: null,
      date: null,
      serialNumber: null,
      qr:null,
      number: null,
      nameAds: null,
      dispartment: null,
      userName: null,
      UserBenfit: null,
      total: null,
      TaxSalery: null,
      cost: null,
      date: null,
      count: null
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
        await this.$router.push({ path: '/Advertisements/all', query: { page: 1 } });
      }
      this.setTableRows();
    },
    async resetFilter() {
      this.filterOptions.number = null;
      this.filterOptions.nameAds = null;
      this.filterOptions.dispartment = null;
      this.filterOptions.userName = null;
      this.filterOptions.UserBenfit = null;
      this.filterOptions.StatusRescive = null;
      this.filterOptions.status = null;
      if (this.$route.query.page !== '1') {
        await this.$router.push({ path: '/Advertisements/all', query: { page: 1 } });
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
          url: "advertisements",
          params: {
            page: this.paginations.current_page,
            code: this.filterOptions.number ,
            name: this.filterOptions.nameAds,
            category_id: this.filterOptions.dispartment?.id,
            user_id: this.filterOptions.userName,
            client_id: this.filterOptions.UserBenfit,
            status: this.filterOptions.StatusRescive?.value,
            is_active: this.filterOptions.status?.value
          },
        });
        this.loading = false;
         res.data.data.forEach((item, index) => {
          item.serialNumber = (this.paginations.current_page - 1) * this.paginations.items_per_page + index + 1;
        });
        // console.log("All Data ==>", res.data.data);
        this.tableRows = res.data.data;
        this.paginations.last_page = res.data.meta.last_page;
        this.paginations.items_per_page = res.data.meta.per_page;;
      } catch (error) {
        this.loading = false;
        console.log(error.response.data.message);
      }
    },
    // End:: Set Table Rows
    // Start:: Change Activation Status
    selectDeactivateItem(item) {
      this.dialogDeactivate = true;
      this.itemToChangeActivationStatus = item;
    },
    async HandlingItemActivationStatus(selectedItem) {
      this.dialogDeactivate = false;
      let targetItem = this.itemToChangeActivationStatus
        ? this.itemToChangeActivationStatus
        : selectedItem;
      const REQUEST_DATA = new FormData();
      // Start:: Append Request Data
      REQUEST_DATA.append("reason", this.deactivateReason);
      // Start:: Append Request Data
      // REQUEST_DATA.append("_method", "PUT");

      try {
        await this.$axios({
          method: "POST",
          url: `advertisements/activate/${targetItem.id}`,
          data: REQUEST_DATA,
        });
        this.$message.success(this.$t("MESSAGES.changeActivation"));
        let filteredElemet = this.tableRows.find(
          (element) => element.id === targetItem.id
        );
        filteredElemet.is_active = !filteredElemet.is_active;

        this.itemToChangeActivationStatus = null;
        this.deactivateReason = null;
      } catch (error) {
        this.$message.error(error.response.data.message);
      }
    },
    // End:: Change Activation Status
  
    // End:: Control Modals

    // ==================== Start:: Crud ====================
    // ===== Start:: End
    showItem(item) {
      this.$router.push({ path: `/Advertisements/show/${item.id}` });
    },
    // ===== End:: End

    // ===== Start:: Delete
    async downloadPdf(item) {
      // console.log(item);
     if (item) {
       this.number = item.code;
       this.count = item.id;
        this.date = item.created_at;
       this.nameAds = item.name;
       this.dispartment = item.category_name;
       this.userName = item.user_name;
        this.qr = item.qrcode;
       this.UserBenfit = item.clinet_name;
       this.total = item.tax;
       this.TaxSalery = item.total;
       this.cost = item.commission;

        await this.$refs.html2Pdf.generatePdf();
        this.pdfDownloadBtnIsLoading = false;
      } else {
        console.error("Item is undefined or null.");
      }
    },
    async getCatogeries() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `categories`,
        });
        // console.log("Cities =>", res.data.data);
        this.Allcategories = res.data.data;
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
    // ===== End:: Delete
    handleFileUpload(event) {
      this.file = event.target.files[0];
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
    this.getCatogeries();
    // End:: Fire Methods
  },
};
</script>
<style>
span.submit_btn {
  width: 45px;
  height: 45px;
  font-size: 16px;
  border-radius: 10px;
  color: var(--white_clr);
  transition: all 0.3s linear;
  background-color: #F6A513;
  display: flex;
  justify-content: center;
  align-items: center;
}

</style>