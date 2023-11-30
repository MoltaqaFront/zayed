import router from "../../../router/index.js";
import axios from "axios";

export default {
  // Start:: Set Authenticated User Data
  setAuthenticatedUserData(context, payload) {
    context.commit("setAuthenticatedUserData", payload);
  },
  // End:: Set Authenticated User Data

  // Start:: Logout
  async logout() {
    try {
      await axios({
        method: "POST",
        url: `auth/logout`,
      });
      localStorage.removeItem("Zayed_provider_dashboard_user_id");
      localStorage.removeItem("Zayed_provider_dashboard_user_token");
      localStorage.removeItem("Zayed_provider_dashboard_userName");
      localStorage.removeItem("Zayed_provider_roles");
      router.replace("/");
      location.reload();
    } catch (error) {
      console.log(error.response.data.message);
    }
  },
  // END:: Logout
};
