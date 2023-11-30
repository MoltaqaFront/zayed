<template>
  <div class="home_page_wrapper">
    <!-- <ComingSoon /> -->

    <div class="statics mt-4">
      <div class="row">
        <div class="col-lg-4 col-md-6 col-12" v-for="(value, key) in statics" :key="'i' + key">
          <div class="box">
            <div class="icon">
              <i v-if="key === 'new'" class="fas fa-newspaper"></i>

              <i v-else-if="key === 'accepted'" class="fas fa-cart-plus"></i>
              <i v-else-if="key === 'processing'" class="fas fa-toolbox"></i>


              <i v-else-if="key === 'completed'" class="fas fa-clipboard-check"></i>
              <i v-else-if="key === 'cancelled'" class="fas fa-newspaper"></i>
              <i v-else-if="key === 'rejected'" class="fas fa-ban"></i>

              <i v-else-if="key === 'total'" class="fas fa-concierge-bell"></i>

            </div>
            <div class="info_box">
              <span v-if="key == 'new'">{{ $t('PLACEHOLDERS.new_requests_count') }}</span>

              <span v-else-if="key === 'accepted'">{{ $t('PLACEHOLDERS.number_of_accepted_orders')
              }}</span>

              <span v-else-if="key === 'processing'">{{ $t('PLACEHOLDERS.ongoing_requests_count') }}</span>

              <span v-else-if="key === 'completed'">{{ $t('PLACEHOLDERS.completed_requests_count') }}</span>
              <span v-else-if="key === 'cancelled'">{{ $t('PLACEHOLDERS.canceled_requests_count') }}</span>
              <span v-else-if="key === 'rejected'">{{ $t('PLACEHOLDERS.rejected_requests_count') }}</span>

              <span v-else-if="key === 'total'">{{ $t('PLACEHOLDERS.total_requests') }}</span>

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
          url: "home-statistics"
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
      background: aliceblue;
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
      }

      .icon {
        height: 60px;
        min-width: 60px;
        width: 60px;
        border-radius: 60px;
        background: rgba(0, 123, 255, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;

        i {
          font-size: 25px
        }
      }

      .info_box {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-end;

        span {
          font-size: 19px;
          color: #6c757d;
        }

        p.number_box {
          font-size: 30px;
          color: #000;
          font-weight: bold;
        }
      }
    }
  }
}
</style>