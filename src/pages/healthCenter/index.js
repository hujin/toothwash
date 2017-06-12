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
      isShow: false,
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
        "/Brush/weixin/userInfo/queryUserInfo?" +
        "code=" +
        util.getQueryString("code");
      this.$http.get(url).then(
        response => {
          setTimeout(() => {
            this.loadClass = "hide";
          }, 300);

          this.userId = response.body.result.userInfo.id;
          this.profile = response.body.result.userInfo;
          this.getData();
          this.getShareData();
        },
        err => {
          console.log(err);
        }
      );
    },
    getShareData() {
      let url =
        "/Brush/admin/sharepage?url=" +
        encodeURIComponent(window.location.href);
      this.$http.get(url).then(
        response => {
          let data = response.body.result;
          console.log(data);
          wx.config({
            debug: false,
            appId: data.appId,
            timestamp: data.timestamp,
            nonceStr: data.nonceStr,
            signature: data.signature,
            beta: true,
            jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage"]
          });

          this.rejectWechat();
        },
        err => {
          console.log(err);
        }
      );
    },
    rejectWechat() {
      //分享到朋友圈
      wx.ready(()=>{
        wx.onMenuShareTimeline({
        title: "未豆Vtooth口腔健康中心",
        desc: "未豆Vtooth口腔水疗护理新体验", // 分享描述
        link: "http://weixin.vtooth.com/pages/healthCenter/shareHealthCenter.html?userId=" +
          this.userId +
          "&code=" +
          util.getQueryString("code"), // 分享链接
        imgUrl: "http://weixin.vtooth.com/Brush/resources/admin/store/vtooth_shareLogo.png",
        success: function(res) {
          console.log("已分享");
        },
        cancel: function(res) {
          console.log("已取消");
        },
        fail: function(res) {
          console.log(JSON.stringify(res));
        }
      });
      wx.onMenuShareAppMessage({
        //分享给微信朋友
        title: "未豆Vtooth口腔健康中心", // 分享标题
        desc: "未豆Vtooth口腔水疗护理新体验", // 分享描述
        link: "http://weixin.vtooth.com/pages/healthCenter/shareHealthCenter.html?userId=" +
          this.userId +
          "&code=" +
          util.getQueryString("code"), // 分享链接
        imgUrl: "http://weixin.vtooth.com/Brush/resources/admin/store/vtooth_shareLogo.png", // 分享图标
        success: function() {
          console.log("分享成功");
        },
        cancel: function() {
          console.log("取消分享");
        }
      });

      })
      
    },
    goTodayHealth() {
      window.location.href = "todayHealth.html";
    },
    goWeekHealth() {
      window.location.href = "weekHealth.html";
    },
    goMedalWall() {
      window.location.href = "medalWall.html";
    },

    getData() {
      var obj = { userId: this.userId };
      let url =
        "/Brush/weixin/allUserRecord/healthCenter?" +
        util.getParam(obj) +
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
    this.getUserData();
  }
});
