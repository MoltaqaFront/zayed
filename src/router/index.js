import Vue from "vue";
import VueRouter from "vue-router";

// Start:: Importing Middleware
import auth from "../middleware/auth.js";
// End:: Importing Middleware

// Start:: Importing Router Components
import Authentication from "../pages/Authentication.vue";
import LoginForm from "../views/Auth/LoginForm.vue";
import ResetPasswordEmailForm from "../views/Auth/ResetPasswordEmailForm.vue";
import EmailVerificationForm from "../views/Auth/EmailVerificationForm.vue";
import ChangePhoneNumberForm from "../views/Auth/ChangePhoneNumber.vue";
import ResetPasswordForm from "../views/Auth/ResetPasswordForm.vue";
import AppContentWrapper from "../pages/AppContentWrapper.vue";

// ============== Start:: Home Page Route
import HomePage from "../pages/HomePage.vue";
// ============== End:: Home Page Route

// ============== Start:: Clients Routes
import ClientsHome from "../views/Cruds/Clients/Home.vue";
import AllClients from "../views/Cruds/Clients/ShowAll.vue";
import ShowClient from "../views/Cruds/Clients/Show.vue";
// ============== End:: Clients Routes

// ============== Start:: Category Routes
import CategoryHome from "../views/Cruds/Category/Home.vue";
import AllCategory from "../views/Cruds/Category/ShowAll.vue";
import CreateCategory from "../views/Cruds/Category/Create.vue";
import EditCategory from "../views/Cruds/Category/Edit.vue";
import ShowCategory from "../views/Cruds/Category/Show.vue";
// ============== End:: Category Routes

// ============== Start:: Faq Routes
import FaqHome from "../views/Cruds/Faq/Home.vue";
import AllFaq from "../views/Cruds/Faq/ShowAll.vue";
import CreateFaq from "../views/Cruds/Faq/Create.vue";
import EditFaq from "../views/Cruds/Faq/Edit.vue";
import ShowFaq from "../views/Cruds/Faq/Show.vue";
// ============== End:: Faq Routes

// ============== Start:: Rates Routes
import RatesHome from "../views/Cruds/Rates/Home.vue";
import AllRates from "../views/Cruds/Rates/ShowAll.vue";
import ShowRates from "../views/Cruds/Rates/Show.vue";
// ============== End:: Rates Routes

// ============== Start:: Financial Reports Routes
import FinancialReportsHome from "../views/Cruds/FinancialReports/Home.vue";
import AllFinancialReports from "../views/Cruds/FinancialReports/ShowAll.vue";
import ShowFinancialReport from "../views/Cruds/FinancialReports/Show.vue";
// ============== End:: Financial Reports Routes

// ============== Start:: Contact Messages Routes
import ContactMessagesHome from "../views/Cruds/ContactMessages/Home.vue";
import AllContactMessages from "../views/Cruds/ContactMessages/ShowAll.vue";
// ============== End:: Contact Messages Routes

// ============== Start:: App Content Routes
import AppContentHome from "../views/Cruds/AppContent/Home.vue";
import AboutUs from "../views/Cruds/AppContent/AboutUs.vue";
import Terms from "../views/Cruds/AppContent/Terms.vue";
import PrivacyPolicy from "../views/Cruds/AppContent/PrivacyPolicy.vue";
// ============== End:: App Content Routes

// ============== Start:: App Settings Routes
import AppSettingsHome from "../views/Cruds/AppSettings/Home.vue";
import GeneralSettings from "../views/Cruds/AppSettings/GeneralSettings.vue";
import AppSettings from "../views/Cruds/AppSettings/AppSettings.vue";
// ============== End:: App Settings Routes

// ============== Start:: Countries Routes
import CountriesHome from "../views/Cruds/Countries/Home.vue";
import AllCountries from "../views/Cruds/Countries/ShowAll.vue";
import CreateCountries from "../views/Cruds/Countries/Create.vue";
import EditCountries from "../views/Cruds/Countries/Edit.vue";
import ShowCountries from "../views/Cruds/Countries/Show.vue";
// ============== End:: Countries Routes

// ============== Start:: Cities Routes
import CitiesHome from "../views/Cruds/Cities/Home.vue";
import AllCities from "../views/Cruds/Cities/ShowAll.vue";
import CreateCities from "../views/Cruds/Cities/Create.vue";
import EditCities from "../views/Cruds/Cities/Edit.vue";
import ShowCities from "../views/Cruds/Cities/Show.vue";
// ============== End:: Cities Routes

// ============== Start:: Areas Routes
import AreasHome from "../views/Cruds/Areas/Home.vue";
import AllAreas from "../views/Cruds/Areas/ShowAll.vue";
import CreateAreas from "../views/Cruds/Areas/Create.vue";
import EditAreas from "../views/Cruds/Areas/Edit.vue";
import ShowAreas from "../views/Cruds/Areas/Show.vue";
// ============== End:: Areas Routes

// ============== Start:: Districts Routes
import DistrictsHome from "../views/Cruds/Districts/Home.vue";
import AllDistricts from "../views/Cruds/Districts/ShowAll.vue";
import CreateDistricts from "../views/Cruds/Districts/Create.vue";
import EditDistricts from "../views/Cruds/Districts/Edit.vue";
import ShowDistricts from "../views/Cruds/Districts/Show.vue";
// ============== End:: Districts Routes

// ============== Start:: Roles Routes
import RolesHome from "../views/Cruds/Roles/Home.vue";
import AllRoles from "../views/Cruds/Roles/ShowAll.vue";
import CreateRole from "../views/Cruds/Roles/Create.vue";
import EditRole from "../views/Cruds/Roles/Edit.vue";
// ============== End:: Roles Routes

// ============== Start:: Admins Routes
import AdminsHome from "../views/Cruds/Admins/Home.vue";
import AllAdmins from "../views/Cruds/Admins/ShowAll.vue";
import CreateAdmin from "../views/Cruds/Admins/Create.vue";
import EditAdmin from "../views/Cruds/Admins/Edit.vue";
import ShowAdmin from "../views/Cruds/Admins/Show.vue";
// ============== End:: Admins Routes

// ============== Start:: All Notifications Routes
import NotificationsHome from "../views/Cruds/Notifications/Home.vue";
import AllNotifications from "../views/Cruds/Notifications/ShowAll.vue";
import ShowNotification from "../views/Cruds/Notifications/Show.vue";
import CreateNotifications from "../views/Cruds/Notifications/Create.vue";
// ============== End:: All Notifications Routes

// ============== Start:: Advertisements Routes
import AdvertisementsHome from "../views/Cruds/Advertisments/Home.vue";
import AllAdvertisements from "../views/Cruds/Advertisments/ShowAll.vue";
import ShowAdvertisements from "../views/Cruds/Advertisments/Show.vue";
// ============== Start:: Forbidden Route
import ForbiddenPage from "../pages/ForbiddenPage.vue";
// ============== End:: Forbidden Route

// ============== Start:: Not Found Route
import NotFoundPage from "../pages/NotFound.vue";
// ============== End:: Not Found Route
// End:: Importing Router Components

Vue.use(VueRouter);
const routes = [
  // ***************** Start:: Auth Routes Config
  {
    path: "/",
    component: Authentication,
    children: [
      {
        path: "/",
        component: LoginForm,
        name: "LoginForm",
      },
      {
        path: "/reset-password-email",
        name: "ResetPasswordEmailForm",
        component: ResetPasswordEmailForm,
      },
      {
        path: "/email-verification/:verification_type",
        name: "EmailVerificationForm",
        component: EmailVerificationForm,
      },
      {
        path: "/chang-phone-number",
        name: "ChangePhoneNumberForm",
        component: ChangePhoneNumberForm,
      },
      {
        path: "/reset-password",
        name: "ResetPasswordForm",
        component: ResetPasswordForm,
      },
    ],
  },
  // ***************** End:: Auth Routes Config

  // ***************** Start:: Content Routes Config
  {
    path: "/home",
    component: AppContentWrapper,
    children: [
      // Start:: Home Route Config
      {
        path: "/home",
        component: HomePage,
        meta: {
          middleware: [auth],
        },
      },
      // End:: Home Route Config

      // Start:: Clients Routes Config
      {
        path: "/clients",
        name: "ClientsHome",
        component: ClientsHome,
        meta: {
          middleware: [auth],
        },
        children: [
          {
            path: "all",
            name: "AllClients",
            component: AllClients,
            meta: {
              middleware: [auth],
              requiresPermission: {
                action: "clients index",
                subject: "clients",
              },
            },
          },
          {
            path: "show/:id",
            name: "ShowClient",
            component: ShowClient,
            props: true,
            meta: {
              middleware: [auth],
              requiresPermission: {
                action: "clients show",
                subject: "clients",
              },
            },
          },
        ],
      },
      // End:: Clients Routes Config

      // Start:: Advertisments Routes Config
      {
        path: "/Advertisements",
        name: "AdvertisementsHome",
        component: AdvertisementsHome,
        meta: {
          middleware: [auth],
        },
        children: [
          {
            path: "all",
            name: "AllAdvertisements",
            component: AllAdvertisements,
            meta: {
              middleware: [auth],
              requiresPermission: {
                action: "advertisements index",
                subject: "advertisements",
              },
            },
          },
          {
            path: "show/:id",
            name: "ShowAdvertisements",
            component: ShowAdvertisements,
            props: true,
            meta: {
              middleware: [auth],
              requiresPermission: {
                action: "advertisements show",
                subject: "advertisements",
              },
            },
          },
        ],
      },
      // End:: Advertisments Routes Config

      // Start:: Category  Config
      {
        path: "/category",
        name: "CategoryHome",
        component: CategoryHome,
        meta: {
          middleware: [auth],
        },
        children: [
          {
            path: "all",
            name: "AllCategory",
            component: AllCategory,
            meta: {
              middleware: [auth],
              requiresPermission: {
                action: "categories index",
                subject: "categories",
              },
            },
          },
          {
            path: "create",
            name: "CreateCategory",
            component: CreateCategory,
            meta: {
              middleware: [auth],
              requiresPermission: {
                action: "categories create",
                subject: "categories",
              },
            },
          },
          {
            path: "edit/:id",
            name: "EditCategory",
            component: EditCategory,
            props: true,
            meta: {
              middleware: [auth],
              requiresPermission: {
                action: "categories edit",
                subject: "categories",
              },
            },
          },
          {
            path: "show/:id",
            name: "ShowCategory",
            component: ShowCategory,
            props: true,
            meta: {
              middleware: [auth],
              requiresPermission: {
                action: "categories show",
                subject: "categories",
              },
            },
          },
        ],
      },
      // End:: Category Config

      // Start:: Rates Routes Config
      {
        path: "/rates",
        name: "RatesHome",
        component: RatesHome,
        meta: {
          middleware: [auth],
        },
        children: [
          {
            path: "all",
            name: "AllRates",
            component: AllRates,
            meta: {
              middleware: [auth],
              requiresPermission: {
                action: "rates index",
                subject: "rates",
              },
            },
          },
          {
            path: "show/:id",
            name: "ShowRates",
            component: ShowRates,
            meta: {
              middleware: [auth],
              requiresPermission: {
                action: "rates show",
                subject: "rates",
              },
            },
          },
        ],
      },
      // End:: Rates Routes Config

      // Start:: Financial Reports Routes Config
      {
        path: "/financial-reports",
        name: "FinancialReportsHome",
        component: FinancialReportsHome,
        meta: {
          middleware: [auth],
        },
        children: [
          {
            path: "all",
            name: "AllFinancialReports",
            component: AllFinancialReports,
            meta: {
              middleware: [auth],
            },
          },
          // {
          //   path: "show/:id",
          //   name: "ShowFinancialReport",
          //   component: ShowFinancialReport,
          //   props: true,
          //   meta: {
          //     middleware: [auth],
          //   },
          // },
        ],
      },
      // End:: Financial Reports Routes Config

      // Start:: Countries  Config
      {
        path: "/countries",
        name: "CountriesHome",
        component: CountriesHome,
        meta: {
          middleware: [auth],
        },
        children: [
          {
            path: "all",
            name: "AllCountries",
            component: AllCountries,
            meta: {
              middleware: [auth],
              requiresPermission: {
                action: "countries index",
                subject: "countries",
              },
            },
          },
          {
            path: "create",
            name: "CreateCountries",
            component: CreateCountries,
            meta: {
              middleware: [auth],
              requiresPermission: {
                action: "countries create",
                subject: "countries",
              },
            },
          },
          {
            path: "edit/:id",
            name: "EditCountries",
            component: EditCountries,
            props: true,
            meta: {
              middleware: [auth],
              requiresPermission: {
                action: "countries edit",
                subject: "countries",
              },
            },
          },
          {
            path: "show/:id",
            name: "ShowCountries",
            component: ShowCountries,
            props: true,
            meta: {
              middleware: [auth],
              requiresPermission: {
                action: "countries show",
                subject: "countries",
              },
            },
          },
        ],
      },
      // End:: Countries Config

      // Start:: Cities  Config
      {
        path: "/cities",
        name: "CitiesHome",
        component: CitiesHome,
        meta: {
          middleware: [auth],
        },
        children: [
          {
            path: "all",
            name: "AllCities",
            component: AllCities,
            meta: {
              middleware: [auth],
              requiresPermission: {
                action: "cities index",
                subject: "cities",
              },
            },
          },
          {
            path: "create",
            name: "CreateCities",
            component: CreateCities,
            meta: {
              middleware: [auth],
              requiresPermission: {
                action: "cities create",
                subject: "cities",
              },
            },
          },
          {
            path: "edit/:id",
            name: "EditCities",
            component: EditCities,
            props: true,
            meta: {
              middleware: [auth],
              requiresPermission: {
                action: "cities edit",
                subject: "cities",
              },
            },
          },
          {
            path: "show/:id",
            name: "ShowCities",
            component: ShowCities,
            props: true,
            meta: {
              middleware: [auth],
              requiresPermission: {
                action: "cities show",
                subject: "cities",
              },
            },
          },
        ],
      },
      // End:: Cities Config

      // Start:: Districts  Config
      {
        path: "/districts",
        name: "DistrictsHome",
        component: DistrictsHome,
        meta: {
          middleware: [auth],
        },
        children: [
          {
            path: "all",
            name: "AllDistricts",
            component: AllDistricts,
            meta: {
              middleware: [auth],
              requiresPermission: {
                action: "neighborhoods index",
                subject: "neighborhoods",
              },
            },
          },
          {
            path: "create",
            name: "CreateDistricts",
            component: CreateDistricts,
            meta: {
              middleware: [auth],
              requiresPermission: {
                action: "neighborhoods create",
                subject: "neighborhoods",
              },
            },
          },
          {
            path: "edit/:id",
            name: "EditDistricts",
            component: EditDistricts,
            props: true,
            meta: {
              middleware: [auth],
              requiresPermission: {
                action: "neighborhoods edit",
                subject: "neighborhoods",
              },
            },
          },
          {
            path: "show/:id",
            name: "ShowDistricts",
            component: ShowDistricts,
            props: true,
            meta: {
              middleware: [auth],
              requiresPermission: {
                action: "neighborhoods show",
                subject: "neighborhoods",
              },
            },
          },
        ],
      },
      // End:: Districts Config

      // Start:: Areas  Config
      {
        path: "/areas",
        name: "AreasHome",
        component: AreasHome,
        meta: {
          middleware: [auth],
        },
        children: [
          {
            path: "all",
            name: "AllAreas",
            component: AllAreas,
            meta: {
              middleware: [auth],
              requiresPermission: {
                action: "regions index",
                subject: "regions",
              },
            },
          },
          {
            path: "create",
            name: "CreateAreas",
            component: CreateAreas,
            meta: {
              middleware: [auth],
              requiresPermission: {
                action: "regions create",
                subject: "regions",
              },
            },
          },
          {
            path: "edit/:id",
            name: "EditAreas",
            component: EditAreas,
            props: true,
            meta: {
              middleware: [auth],
              requiresPermission: {
                action: "regions edit",
                subject: "regions",
              },
            },
          },
          {
            path: "show/:id",
            name: "ShowAreas",
            component: ShowAreas,
            props: true,
            meta: {
              middleware: [auth],
              requiresPermission: {
                action: "regions show",
                subject: "regions",
              },
            },
          },
        ],
      },
      // End:: Areas Config

      // Start:: Ads  Config
      // {
      //   path: "/ads",
      //   name: "AdsHome",
      //   component: AdsHome,
      //   meta: {
      //     middleware: [auth],
      //   },
      //   children: [
      //     {
      //       path: "all",
      //       name: "AllAds",
      //       component: AllAds,
      //       meta: {
      //         middleware: [auth],
      //         requiresPermission: {
      //           action: "sliders index",
      //           subject: "sliders",
      //         },
      //       },
      //     },
      //     {
      //       path: "create",
      //       name: "CreateAds",
      //       component: CreateAds,
      //       meta: {
      //         middleware: [auth],
      //         requiresPermission: {
      //           action: "sliders create",
      //           subject: "sliders",
      //         },
      //       },
      //     },
      //     {
      //       path: "edit/:id",
      //       name: "EditAds",
      //       component: EditAds,
      //       props: true,
      //       meta: {
      //         middleware: [auth],
      //         requiresPermission: {
      //           action: "sliders edit",
      //           subject: "sliders",
      //         },
      //       },
      //     },
      //     {
      //       path: "show/:id",
      //       name: "ShowAds",
      //       component: ShowAds,
      //       props: true,
      //       meta: {
      //         middleware: [auth],
      //         requiresPermission: {
      //           action: "sliders show",
      //           subject: "sliders",
      //         },
      //       },
      //     },
      //   ],
      // },
      // End:: Ads Config

      // Start:: Faq  Config
      {
        path: "/faq",
        name: "FaqHome",
        component: FaqHome,
        meta: {
          middleware: [auth],
        },
        children: [
          {
            path: "all",
            name: "AllFaq",
            component: AllFaq,
            meta: {
              middleware: [auth],
              requiresPermission: {
                action: "questions index",
                subject: "questions",
              },
            },
          },
          {
            path: "create",
            name: "CreateFaq",
            component: CreateFaq,
            meta: {
              middleware: [auth],
              requiresPermission: {
                action: "questions create",
                subject: "questions",
              },
            },
          },
          {
            path: "edit/:id",
            name: "EditFaq",
            component: EditFaq,
            props: true,
            meta: {
              middleware: [auth],
              requiresPermission: {
                action: "questions edit",
                subject: "questions",
              },
            },
          },
          {
            path: "show/:id",
            name: "ShowFaq",
            component: ShowFaq,
            props: true,
            meta: {
              middleware: [auth],
              requiresPermission: {
                action: "questions show",
                subject: "questions",
              },
            },
          },
        ],
      },
      // End:: Faq Config

      // Start:: Contact Messages Routes Config
      {
        path: "/contact-messages",
        name: "ContactMessagesHome",
        component: ContactMessagesHome,
        meta: {
          middleware: [auth],
        },
        children: [
          {
            path: "all",
            name: "AllContactMessages",
            component: AllContactMessages,
            meta: {
              middleware: [auth],
              requiresPermission: {
                action: "contacts index",
                subject: "contacts",
              },
            },
          },
        ],
      },
      // End:: Contact Messages Routes Config

      // Start:: App Content Routes Config
      {
        path: "/app-content",
        name: "AppContentHome",
        component: AppContentHome,
        meta: {
          middleware: [auth],
        },
        children: [
          {
            path: "about-us",
            name: "AboutUs",
            component: AboutUs,
            meta: {
              middleware: [auth],
              requiresPermission: {
                action: "settings create",
                subject: "settings",
              },
            },
          },
          {
            path: "terms",
            name: "Terms",
            component: Terms,
            meta: {
              middleware: [auth],
              requiresPermission: {
                action: "settings create",
                subject: "settings",
              },
            },
          },
          {
            path: "policy",
            name: "PrivacyPolicy",
            component: PrivacyPolicy,
            meta: {
              middleware: [auth],
              requiresPermission: {
                action: "settings create",
                subject: "settings",
              },
            },
          },
        ],
      },
      // End:: App Content Routes Config

      // Start:: App Settings Routes Config
      {
        path: "/settings",
        component: AppSettings,
        meta: {
          middleware: [auth],
          requiresPermission: {
            action: "settings create",
            subject: "settings",
          },
        },
      },
      // End:: App Settings Routes Config

      // Start:: App Settings Routes Config
      {
        path: "/contact_settings",
        component: GeneralSettings,
        meta: {
          middleware: [auth],
          requiresPermission: {
            action: "settings create",
            subject: "settings",
          },
        },
      },
      // End:: App Settings Routes Config

      // Start:: Roles Routes Config
      {
        path: "/roles",
        name: "RolesHome",
        component: RolesHome,
        meta: {
          middleware: [auth],
        },
        children: [
          {
            path: "all",
            name: "AllRoles",
            component: AllRoles,
            meta: {
              middleware: [auth],
              requiresPermission: {
                action: "roles index",
                subject: "roles",
              },
            },
          },
          {
            path: "create",
            name: "CreateRole",
            component: CreateRole,
            meta: {
              middleware: [auth],
              requiresPermission: {
                action: "roles create",
                subject: "roles",
              },
            },
          },
          {
            path: "edit/:id",
            name: "EditRole",
            component: EditRole,
            props: true,
            meta: {
              middleware: [auth],
              requiresPermission: {
                action: "roles edit",
                subject: "roles",
              },
            },
          },
        ],
      },
      // End:: Roles Routes Config

      // Start:: Admins Routes Config
      {
        path: "/admins",
        name: "AdminsHome",
        component: AdminsHome,
        meta: {
          middleware: [auth],
        },
        children: [
          {
            path: "all",
            name: "AllAdmins",
            component: AllAdmins,
            meta: {
              middleware: [auth],
              requiresPermission: {
                action: "users create",
                subject: "users",
              },
            },
          },
          {
            path: "create",
            name: "CreateAdmin",
            component: CreateAdmin,
            meta: {
              middleware: [auth],
              requiresPermission: {
                action: "users create",
                subject: "users",
              },
            },
          },
          {
            path: "edit/:id",
            name: "EditAdmin",
            component: EditAdmin,
            props: true,
            meta: {
              middleware: [auth],
              requiresPermission: {
                action: "users create",
                subject: "users",
              },
            },
          },
          {
            path: "show/:id",
            name: "ShowAdmin",
            component: ShowAdmin,
            props: true,
            meta: {
              middleware: [auth],
              requiresPermission: {
                action: "users create",
                subject: "users",
              },
            },
          },
        ],
      },
      // End:: Admins Routes Config

      // Start:: All Notifications Route Config
      {
        path: "/all-notifications",
        name: "NotificationsHome",
        component: NotificationsHome,
        meta: {
          middleware: [auth],
        },
        children: [
          {
            path: "all",
            name: "AllNotifications",
            component: AllNotifications,
            meta: {
              middleware: [auth],
            },
          },
          {
            path: "create",
            name: "CreateNotifications",
            component: CreateNotifications,
            meta: {
              middleware: [auth],
              requiresPermission: {
                action: "notifications create",
                subject: "notifications",
              },
            },
          },
          {
            path: "show",
            name: "ShowNotification",
            component: ShowNotification,
            meta: {
              middleware: [auth],
              requiresPermission: {
                action: "notifications index",
                subject: "notifications",
              },
            },
          },
        ],
      },
      // End:: All Notifications Route Config
    ],
  },
  // ***************** End:: Content Routes Config

  // ***************** Start:: Forbidden Route Config
  {
    path: "/forbidden",
    name: "ForbiddenPage",
    component: ForbiddenPage,
  },
  // ***************** End:: Forbidden Route Config

  // ***************** Start:: Not Found Route Config
  {
    path: "/:notFound(.*)",
    name: "NotFoundPage",
    component: NotFoundPage,
  },
  // ***************** End:: Not Found Route Config
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  scrollBehavior(to) {
    document.getElementById("app").scrollIntoView({ behavior: "smooth" });
    if (to.hash) {
      return {
        selector: to.hash,
      };
    }
  },
  routes,
});

// Start:: Middleware And Router Guards
function nextFactory(context, middleware, index) {
  const subsequentMiddleware = middleware[index];
  if (!subsequentMiddleware) return context.next;

  return (...parameters) => {
    context.next(...parameters);
    const nextMiddleware = nextFactory(context, middleware, index + 1);
    subsequentMiddleware({ ...context, next: nextMiddleware });
  };
}

// permissions

router.beforeEach((to, from, next) => {
  // console.log(to);
  // Check if the route requires permission
  if (to.meta && to.meta.requiresPermission) {
    const { action, subject } = to.meta.requiresPermission;

    // Retrieve permissions from localStorage
    const storedPermissions = JSON.parse(
      localStorage.getItem("Zayed_provider_roles")
    )?.permissions;

    // Check if the user has the required permission
    if (
      storedPermissions.some(
        (permission) =>
          permission.action === action && permission.subject === subject
      )
    ) {
      next(); // User has permission, allow access to the route
    } else {
      // User doesn't have permission, redirect to a fallback route or show an error message
      next("/forbidden"); // Replace '/fallback' with the route path or name of your fallback route
    }
  } else {
    next(); // Route doesn't require permission, allow access to the route
  }
});

// authentication
router.beforeEach((to, from, next) => {
  if (to.meta.middleware) {
    const middleware = Array.isArray(to.meta.middleware)
      ? to.meta.middleware
      : [to.meta.middleware];

    const context = {
      from,
      next,
      router,
      to,
    };
    const nextMiddleware = nextFactory(context, middleware, 1);
    return middleware[0]({ ...context, next: nextMiddleware });
  } else if (localStorage.getItem("Zayed_provider_dashboard_user_token")) {
    if (
      to.name == "LoginForm" ||
      to.name == "ResetPasswordEmailForm" ||
      to.name == "PhoneVerification" ||
      to.name == "ChangePhoneNumberForm" ||
      to.name == "ResetPasswordForm"
    ) {
      return next("/home");
    } else {
      return next();
    }
  }
  return next();
});
// End:: Middleware And Router Guards

export default router;
