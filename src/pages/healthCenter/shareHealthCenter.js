/**
 * Created by yuanxiaowei on 2017/1/2.
 */
import Vue from "vue";
import Mint from "mint-ui";
import VueResource from "vue-resource";
import util from "../../../lib/util/util";

Vue.use(Mint);
Vue.use(VueResource);

import "./index.scss";

new Vue({
  el: "#app",

  data() {
    return {
      userId: null,
      healthData: {
        medalNum: 0
      },
      starData: [
        "null-star",
        "null-star",
        "null-star",
        "null-star",
        "null-star"
      ],
      profile: {}
    };
  },

  methods: {
    getUserData() {
      let url =
        "/Brush/weixin/userInfo/queryShareOneUserInfo?userId=" +
        util.getQueryString("userId");
      this.$http.get(url).then(
        response => {
        
          this.profile = response.body.result;
       
        },
        err => {
          console.log(err);
        }
      );
    },
 

    getData() {

      let url =
        "/Brush/weixin/allUserRecord/healthCenter?userId=" +
        util.getQueryString("userId") +
        "&code=" +
        util.getQueryString("code");
      this.$http.post(url).then(
        response => {
          this.healthData = response.body.result;
          let rate = this.healthData.healthRate;
          this.healthData.healthRate = 0;
          setInterval(() => {
            if (this.healthData.healthRate < rate) {
              this.healthData.healthRate = this.healthData.healthRate + 1;
            }
          }, 5);
          this.setStarData();
          window.circleAnim(rate);
        },
        err => {
          console.log(err);
        }
      );
    },
    setStarData() {
      let starNum = this.healthData.starNum * 2;
      for (let i = 1; i <= 5; i++) {
        console.log(starNum - 2 * i);
        if (starNum - 2 * i == -1) {
          this.starData[i - 1] = "half-star";
        }
        if (starNum - 2 * i >= 0) {
          this.starData[i - 1] = "full-star";
        }
        if (starNum - 2 * i < -1) {
          this.starData[i - 1] = "null-star";
        }
      }
    }
  },

  mounted() {
    this.getData();
    this.getUserData();
  }
});
