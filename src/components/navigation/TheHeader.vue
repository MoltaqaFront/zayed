<template>
  <nav id="navbar">
    <div class="container p-0">
      <div class="navbar_wrapper">
        <!-- Start:: Welcome Message -->
        <div class="welcome_message">
          <h4>
            {{ $t("TITLES.hi") }}
            {{ getAuthenticatedUserData.name }}
          </h4>
          <span> 🖐️ </span>
        </div>
        <!-- End:: Welcome Message -->

        <!-- Start:: Navbar Buttons -->
        <div class="navbar_btns_wrapper">
          <div class="group">


            <div class="group">
              <!-- ********** Start:: Theme Switcher Button ********** -->
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <button aria-label="theme_changer" class="theme_changer" @click="changeAppTheme" v-bind="attrs"
                    v-on="on">
                    <i class="fal fa-moon" v-if="getAppTheme == 'light_theme'"></i>
                    <i class="fal fa-sun" v-else></i>
                  </button>
                </template>
                <span class="toolTip">{{ $t("TOOLTIPS.change_theme") }}</span>
              </v-tooltip>
              <!-- ********** End:: Theme Switcher Button ********** -->

              <!-- ********** Start:: Language Switcher Button ********** -->
              <div class="lang_toggler_wrapper">
                <v-tooltip bottom v-if="getAppLocale == 'ar'">
                  <template v-slot:activator="{ on, attrs }">
                    <button class="lang_toggeler_btn" @click="changeAppLanguage('en')" v-bind="attrs" v-on="on">
                      En
                    </button>
                  </template>
                  <span class="toolTip">{{
                    $t("TOOLTIPS.change_language")
                  }}</span>
                </v-tooltip>
                <v-tooltip bottom v-else>
                  <template v-slot:activator="{ on, attrs }">
                    <button class="lang_toggeler_btn pb-3" @click="changeAppLanguage('ar')" v-bind="attrs" v-on="on">
                      ع
                    </button>
                  </template>
                  <span class="toolTip">{{
                    $t("TOOLTIPS.change_language")
                  }}</span>
                </v-tooltip>
              </div>
              <!-- ********** End:: Language Switcher Button ********** -->

              <!-- ********** Start:: Notification Button ********** -->
              <div class="user_notification_content_wrapper">
                <router-link to="/all-notifications/all">
                  <a-badge :count="notificationsData.unreadNotifications" :overflow-count="9">
                    <button aria-label="notification_btn" class="notification_btn">
                      <i class="fal fa-bell"></i>
                    </button>
                  </a-badge>
                </router-link>

                <!-- <a-badge :count="notificationsData.unreadNotifications" :overflow-count="9" >
                  <button aria-label="notification_btn" class="notification_btn" @click.stop="
                    toggleNotificationsMenu();
                  getNotifications();
                  ">
                    <i class="fal fa-bell"></i>
                  </button>
                </a-badge> -->

                <transition name="fadeInUp">
                  <!-- START:: NOTIFICATIONS LIST -->
                  <div class="notifications_menu_wrapper" v-if="notificationsMenuIsOpen">
                    <!-- ========== START:: NOTIFICATION HEADER ========== -->
                    <div class="notifications_menu_header">
                      <h5>
                        {{ $t("TITLES.notifications") }}
                      </h5>
                      <h3>
                        {{ notificationsData.unreadNotifications }}
                        {{ $t("TITLES.new") }}
                      </h3>
                    </div>
                    <!-- ========== END:: NOTIFICATION HEADER ========== -->

                    <!-- START:: EMPTY NOTIFICATIONS MESSAGE -->
                    <div class="empty_image" v-if="notificationsData.notificationsList.length == 0">
                      <img src="../../assets/media/empty_messages/snooze.png" alt="Empty Notifications" width="120"
                        height="120" />
                    </div>
                    <!-- END:: EMPTY NOTIFICATIONS MESSAGE -->

                    <ul class="notifications_menu" v-else>
                      <!-- START:: SINGLE NOTIFICATION -->
                      <li class="notifications_menu_item" v-for="item in notificationsData.notificationsList"
                        :key="item.id">
                        <!-- START:: NOTIFICATION BODY -->
                        <div class="notification_body_wrapper" @click="
                          redirectNotification(item.notify_type);
                        readSingleNotification(item.id);
                        ">
                          <p class="notification_title">
                            {{ item.title }}
                          </p>
                          <p class="notification_body">
                            {{ item.body }}
                          </p>
                          <p class="notification_date">
                            {{ item.created_at }}
                          </p>
                        </div>
                        <!-- END:: NOTIFICATION BODY -->

                        <!-- START:: DELETE NOTIFICATION BUTTON -->
                        <div class="delete_btn_wrapper">
                          <button class="delete_notification_btn" @click.stop="
                            deleteNotification({
                              id: item.id,
                              notificationType: 'notifications_menu',
                            })
                            ">
                            <i class="fal fa-trash-alt"></i>
                          </button>
                        </div>
                        <!-- END:: DELETE NOTIFICATION BUTTON -->
                      </li>
                      <!-- END:: SINGLE NOTIFICATION -->
                    </ul>

                    <router-link class="all_notifications_route" to="/all-notifications">
                      {{ $t("BUTTONS.allNotification") }}
                    </router-link>
                  </div>
                  <!-- END:: NOTIFICATIONS LIST -->
                </transition>
              </div>
              <!-- ********** End:: Notification Button ********** -->

              <!-- ********** Start:: Small Screens Navbar Drawer Button ********** -->
              <button class="small_screens_navbar_toggeler" @click="$emit('fireToggleNavDrawerEmit')">
                <i class="fal fa-bars"></i>
              </button>
              <!-- ********** End:: Small Screens Navbar Drawer Button ********** -->
            </div>

            <!-- ********** Start:: User Profile Button -->
            <div class="user_profile_menu_wrapper">
              <button class="user_profile_menu_btn" @click="userProfileModalIsOpen = true">
                <div class="name_wrapper">
                  <h3>{{ getAuthenticatedUserData.name }}</h3>
                </div>

                <div class="avatar_wrapper">
                  <AvatarPlaceholder :nameAvatar="getAuthenticatedUserData.name" />
                </div>
              </button>
            </div>

            <UserDataModal :modalIsOpen="userProfileModalIsOpen"
              @toggleModal="userProfileModalIsOpen = !userProfileModalIsOpen" />
            <!-- ********** End:: User Profile Button -->
          </div>


        </div>
        <!-- End:: Navbar Buttons -->
      </div>
    </div>
  </nav>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import AvatarPlaceholder from "@/components/ui/AvatarPlaceholder.vue";
import UserDataModal from "@/components/modals/UserDataModal.vue";

export default {
  name: "TheHeader",

  components: {
    AvatarPlaceholder,
    UserDataModal,
  },

  emits: ["fireToggleNavDrawerEmit"],

  computed: {
    // Start:: Vuex Getters
    ...mapGetters({
      getAppTheme: "AppThemeModule/getAppTheme",
      getAppLocale: "AppLangModule/getAppLocale",
      getAuthenticatedUserData: "AuthenticationModule/getAuthenticatedUserData",
      notificationsData: "NotificationsModule/notificationsData",
    }),
    // End:: Vuex Getters
  },

  data() {
    return {
      // Start:: Notifications Menu Control Data
      notificationsMenuIsOpen: false,
      // End:: Notifications Menu Control Data

      // Start:: User Profile Modal Controlling Data
      userProfileModalIsOpen: false,
      // End:: User Profile Modal Controlling Data
    };
  },

  methods: {
    // Start:: Vuex Actions
    ...mapActions({
      changeAppTheme: "AppThemeModule/changeAppTheme",
      changeAppLanguage: "AppLangModule/changeAppLanguage",
      getNotifications: "NotificationsModule/getNotifications",
      deleteNotification: "NotificationsModule/deleteNotification",
      readSingleNotification: "NotificationsModule/readSingleNotification",
    }),
    // End:: Vuex Actions

    // Start:: Toggle Notifications Menu
    toggleNotificationsMenu() {
      this.notificationsMenuIsOpen = !this.notificationsMenuIsOpen;
      this.chatsDrawerIsOpen = false;
    },
    // End:: Toggle Notifications Menu

    // Start:: Notification Redirect
    redirectNotification(notifyType) {
      if (notifyType == "new_user_register") {
        this.$router.push("/clients/all");
      } else if (
        notifyType == "add_shipment_attach" ||
        notifyType == "update_shipment_request" ||
        notifyType == "new_shipment_request"
      ) {
        this.$router.push("/shipment/all");
      } else if (notifyType == "new_authorization_for_user") {
        this.$router.push("/authorizations/all");
      }
    },
    // End:: Notification Redirect
  },

  created() {
    // Start:: Fire Methods
    this.getNotifications();
    window.addEventListener("click", () => {
      this.notificationsMenuIsOpen = false;
    });
    // End:: Fire Methods
  },
};
</script>
