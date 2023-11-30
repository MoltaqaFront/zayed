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
              <!-- Start:: Phone Input -->
              <base-input col="4" type="text" :placeholder="$t('PLACEHOLDERS.question_text')"
                v-model.trim="filterOptions.question_text" />

              <base-input col="4" type="text" :placeholder="$t('PLACEHOLDERS.answer_text')"
                v-model.trim="filterOptions.answer_text" />
              <!-- End:: Phone Input -->

              <!-- Start:: Message Status Input -->
              <base-select-input col="4" :optionsList="messageStatuses" :placeholder="$t('PLACEHOLDERS.status')"
                v-model="filterOptions.status" />
              <!-- End:: Message Status Input -->
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
          <h5>{{ $t("PLACEHOLDERS.faq") }}</h5>
          <button v-if="!filterFormIsActive" class="filter_toggler"
            @click.stop="filterFormIsActive = !filterFormIsActive">
            <i class="fal fa-search"></i>
          </button>
        </div>
        <div class="title_route_wrapper" v-if="$can('questions create', 'questions')">
          <router-link to="/faq/create">
            {{ $t("PLACEHOLDERS.add_question_data") }}
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

        <template v-slot:[`item.id`]="{ item, index }">
          <div class="table_image_wrapper">
            <h6 class="text-danger" v-if="!item.id"> {{ $t("TABLES.noData") }} </h6>
            <h6 v-else>{{ index + 1 }}</h6> <!-- Display the index for each row -->
          </div>
        </template>

        <!-- Start:: Phone -->
        <template v-slot:[`item.phone`]="{ item }">
          <span dir="ltr"> {{ item.phone }} </span>
        </template>
        <!-- Start:: Phone -->

        <template v-slot:[`item.answer`]="{ item }">
          <template>
            <h6 class="text-danger" v-if="item.answer.length === 0"> {{ $t("TABLES.noData") }} </h6>
            <div class="actions" v-else>
              <button class="btn_show" @click="showQuestionModal(item.answer)">
                <i class="fal fa-file-alt"></i>
              </button>
            </div>
          </template>
        </template>

        <template v-slot:[`item.body`]="{ item }">
          <template>
            <h6 class="text-danger" v-if="item.body.length === 0"> {{ $t("TABLES.noData") }} </h6>
            <div class="actions" v-else>
              <button class="btn_show" @click="showReplayModal(item.body)">
                <i class="fal fa-file-alt"></i>
              </button>
            </div>
          </template>
        </template>



        <!-- Start:: Message Type -->
        <template v-slot:[`item.type`]="{ item }">
          <h6 class="text-danger" v-if="!item.type"> {{ $t("TABLES.noData") }} </h6>
          <v-chip v-else color="blue-grey darken-3" text-color="white" small>
            {{ item.type }}
          </v-chip>
        </template>
        <!-- End:: Message Type -->

        <!-- Start:: Activation -->
        <template v-slot:[`item.is_active`]="{ item }">
          <!-- v-if="permissions.activate" -->
          <div class="activation" dir="ltr" style="z-index: 1" v-if="$can('questions activate', 'questions')">
            <v-switch class="mt-2" color="success" v-model="item.is_active" hide-details
              @change="changeActivationStatus(item)"></v-switch>
          </div>
        </template>
        <!-- End:: Activation -->

        <!-- Start:: Actions -->
        <template v-slot:[`item.actions`]="{ item }">
          <div class="actions">

            <a-tooltip placement="bottom" v-if="$can('questions show', 'questions')">
              <template slot="title">
                <span>{{ $t("BUTTONS.show") }}</span>
              </template>
              <button class="btn_show" @click="showItem(item)">
                <i class="fal fa-eye"></i>
              </button>
            </a-tooltip>

            <a-tooltip placement="bottom" v-if="$can('questions edit', 'questions')">
              <template slot="title">
                <span>{{ $t("BUTTONS.edit") }}</span>
              </template>
              <button class="btn_edit" @click="editItem(item)">
                <i class="fal fa-edit"></i>
              </button>
            </a-tooltip>

            <a-tooltip placement="bottom" v-if="$can('questions delete', 'questions')">
              <template slot="title">
                <span>{{ $t("BUTTONS.delete") }}</span>
              </template>
              <button class="btn_delete" @click="selectDeleteItem(item)">
                <i class="fal fa-trash-alt"></i>
              </button>
            </a-tooltip>

            <template v-else>
              <i class="fal fa-lock-alt fs-5 blue-grey--text text--darken-1"></i>
            </template>
          </div>
        </template>

        <!-- ======================== Start:: Dialogs ======================== -->
        <template v-slot:top>

          <!-- Start:: Question Modal -->
          <description-modal v-if="dialogQuestion" :modalIsOpen="dialogQuestion" :modalDesc="selectedQuestionTextToShow"
            @toggleModal="dialogQuestion = !dialogQuestion" />
          <!-- End:: Question Modal -->

          <!-- Start:: Replay Modal -->
          <description-modal v-if="dialogReplay" :modalIsOpen="dialogReplay" :modalDesc="selectedReplayTextToShow"
            @toggleModal="dialogReplay = !dialogReplay" />
          <!-- End:: Replay Modal -->

          <!-- Start:: Delete Modal -->
          <v-dialog v-model="dialogDelete">
            <v-card>
              <v-card-title class="text-h5 justify-center" v-if="itemToDelete">
                {{ $t("TITLES.DeleteConfirmingMessage", { name: itemToDelete.id }) }}
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
import { mapGetters } from "vuex";

export default {
  name: "AllContactMessages",

  computed: {
    ...mapGetters({
      getAppLocale: "AppLangModule/getAppLocale",
    }),

    messageStatuses() {
      return [
        {
          id: 3,
          name: this.$t("STATUS.all"),
          value: null,
        },
        {
          id: 1,
          name: this.$t("STATUS.active"),
          value: 1,
        },
        {
          id: 2,
          name: this.$t("STATUS.notActive"),
          value: 0,
        }
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
        question_text: null,
        answer_text: null,
        status: null,
      },
      // End:: Filter Data

      // Start:: Table Data
      searchValue: "",
      tableHeaders: [
        {
          text: this.$t("TABLES.ContactMessages.serialNumber"),
          value: "id",
          align: "center",
          width: "80",
          sortable: false,
        },
        {
          text: this.$t("PLACEHOLDERS.question_text"),
          value: "body",
          align: "center",
          width: "80",
          sortable: false,
        },
        {
          text: this.$t("PLACEHOLDERS.answer_text"),
          value: "answer",
          align: "center",
          width: "80",
          sortable: false,
        },
        {
          text: this.$t("TABLES.ContactMessages.status"),
          value: "is_active",
          align: "center",
          width: "80",
          sortable: false,
        },
        {
          text: this.$t("TABLES.ContactMessages.actions"),
          value: "actions",
          sortable: false,
          align: "center",
          width: "80",
        },
      ],
      tableRows: [],
      // End:: Table Data

      // Start:: Dialogs Control Data
      dialogReplay: false,
      selectedReplayTextToShow: "",
      dialogSendReplay: false,
      itemToSendReplay: null,
      messageReplay: null,

      dialogQuestion: false,
      selectedQuestionTextToShow: "",
      dialogSendQuestion: false,
      itemToSendQuestion: null,
      messageQuestion: null,

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
        await this.$router.push({ path: '/faq/all', query: { page: 1 } });
      }
      this.setTableRows();
    },
    async resetFilter() {
      this.filterOptions.question_text = null;
      this.filterOptions.answer_text = null;
      this.filterOptions.status = null;
      if (this.$route.query.page !== '1') {
        await this.$router.push({ path: '/faq/all', query: { page: 1 } });
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
          url: "questions",
          params: {
            page: this.paginations.current_page,
            body: this.filterOptions.question_text,
            answer: this.filterOptions.answer_text,
            is_active: this.filterOptions.status?.value,
          },
        });
        this.loading = false;
        // console.log("All Data ==>", res.data.data);
        this.tableRows = res.data.data;
        this.paginations.last_page = res.data.meta.last_page;
        this.paginations.items_per_page = res.data.meta.per_page;
      } catch (error) {
        this.loading = false;
        console.log(error.response.data.message);
      }
    },
    // End:: Set Table Rows

    // Start:: Control Modals
    showQuestionModal(Question) {
      this.dialogQuestion = true;
      this.selectedQuestionTextToShow = Question;
    },
    // End:: Control Modals

    // Start:: Control Modals
    showReplayModal(replay) {
      this.dialogReplay = true;
      this.selectedReplayTextToShow = replay;
    },
    // End:: Control Modals

    // ===== Start:: End
    editItem(item) {
      this.$router.push({ path: `/faq/edit/${item.id}` });
    },

    showItem(item) {
      this.$router.push({ path: `/faq/show/${item.id}` });
    },
    // ===== End:: End

    // ===== Start:: Delete
    selectDeleteItem(item) {
      this.dialogDelete = true;
      this.itemToDelete = item;
    },

    async confirmDeleteItem() {
      try {
        await this.$axios({
          method: "DELETE",
          url: `questions/${this.itemToDelete.id}`,
        });
        this.dialogDelete = false;
        this.setTableRows();
        this.$message.success(this.$t("MESSAGES.deletedSuccessfully"));
      } catch (error) {
        this.dialogDelete = false;
        this.$message.error(error.response.data.message);
      }
    },
    // ===== End:: Delete

    // Start:: Change Activation Status
    async changeActivationStatus(item) {
      try {
        await this.$axios({
          method: "POST",
          url: `questions/activate/${item.id}`,
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
    this.setTableRows();
    // End:: Fire Methods
  },
};
</script>
