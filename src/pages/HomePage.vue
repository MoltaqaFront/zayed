<template>
  <div class="home_page_wrapper">
    <!-- <ComingSoon /> -->

    <div class="statics mt-4">
      <div class="row">
        <div class="col-lg-6 col-md-6 col-12" v-for="(value, key) in statics" :key="'i' + key">
          <div class="box">
            <div class="icon">
              <i v-if="key === 'users'" class="fas fa-users"></i>

              <i v-else-if="key === 'total_adv'" class="fas fa-audio-description"></i>
              <i v-else-if="key === 'avaliable_adv'" class="fas fa-clipboard-check"></i>


              <i v-else-if="key === 'booked_adv'" class="fas fa-hourglass-half"></i>
              <i v-else-if="key === 'sold_adv'" class="fas fa-cart-plus"></i>
              <i v-else-if="key === 'missed_adv'" class="fas fa-window-close"></i>

              <i v-else-if="key === 'profit'" class="fas fa-dollar-sign"></i>

            </div>
            <div class="info_box">
              <span v-if="key == 'users'">{{ $t('SIDENAV.AppContent.users') }}</span>

              <span v-else-if="key === 'total_adv'">{{ $t('SIDENAV.AppContent.total_adv')
              }}</span>

              <span v-else-if="key === 'avaliable_adv'">{{ $t('SIDENAV.AppContent.avaliable_adv') }}</span>

              <span v-else-if="key === 'booked_adv'">{{ $t('SIDENAV.AppContent.booked_adv') }}</span>
              <span v-else-if="key === 'sold_adv'">{{ $t('SIDENAV.AppContent.sold_adv') }}</span>
              <span v-else-if="key === 'missed_adv'">{{ $t('SIDENAV.AppContent.missed_adv') }}</span>

              <span v-else-if="key === 'profit'">{{ $t('SIDENAV.AppContent.profit') }}</span>

              <p class="number_box">{{ value }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ComingSoon from "@/components/ui/ComingSoon.vue";

export default {
  name: "HomePage",

  components: {
    ComingSoon
  },

  data() {
    return {
      statics: []
    };
  },

  methods: {

    async getStatics() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: "setting/general-statistic"
        });

        // console.log("All Data ==>", res.data.data);
        this.statics = res.data.data;
      } catch (error) {
        this.loading = false;
        console.log(error.response.data.message);
      }
    },
    // End:: Set Table Rows

  },

  mounted() {

    this.getStatics()

  },
};
</script>

<style lang="scss" scoped>
.home_page_wrapper {
  position: relative;

  min-height: 500px;
  padding: 0 10px;
  overflow-y: auto;
  overflow-x: hidden;

 
  .statics {
    .box {
      background: #B32BCB;
      padding: 25px;
      margin-bottom: 10px;
      border-radius: 5px;
      overflow: hidden;
      display: flex;
      justify-content: space-between;

      cursor: pointer;
      transition: all 0.5s;

      &:hover {
        background: #fff;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

        .icon {
          i{
            color: #B32BCB;
          }
        }
        .info_box {

          span,
          p.number_box {
            color: #000
          }
        }
      }

      .icon {
        height: 60px;
        min-width: 60px;
        width: 60px;
        border-radius: 60px;
        background: #FFF;
        display: flex;
        align-items: center;
        justify-content: center;

        i {
          font-size: 25px ;
          color: #000;
        }
      }

      .info_box {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-end;

        span {
          font-size: 19px;
          color: #FFF;
        }

        p.number_box {
          font-size: 30px;
          color: #FFF;
          font-weight: bold;
        }
      }
    }
  }

}
</style>