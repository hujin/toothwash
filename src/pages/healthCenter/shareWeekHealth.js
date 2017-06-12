/**
 * Created by yuanxiaowei on 2017/1/2.
 */
import Vue from "vue";
import Mint from "mint-ui";
import Echart from "../../../lib/component/echarts";
import VueResource from "vue-resource";
import util from "../../../lib/util/util";

Vue.component("Echart", Echart);

Vue.use(Mint);
Vue.use(VueResource);

import "./weekHealth.scss";

new Vue({
  el: "#weekHealth",
  data() {
    return {
      lineOptions: {
        tooltip: {
          trigger: "axis"
        },

        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },

        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            axisTick: false,
            splitArea: { show: true },
            data: ["一", "二", "三", "四", "五", "六", "日"],
            axisLine: {
              lineStyle: {
                color: "#ffffff"
              }
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            axisTick: false,
            scale: true,
            splitNumber: 5,
            min: 0,
            max: 100,
            axisLabel: {
              formatter: "{value}%"
            },
            axisLine: {
              lineStyle: {
                color: "#ffffff"
              }
            }
          }
        ],
        series: [
          {
            legendHoverLink: false,
            type: "line",
            smooth: true,
            data: [],
            itemStyle: {
              normal: {
                areaStyle: {
                  type: "default",
                  color: "rgba(255,255,255,0.3)"
                },
                color: "#fff",
                
                lineStyle: {
                  color: "#fff",
                  width: 2
                }
              }
            }
          }
        ],
        visualMap: {
          show: false,
          pieces: [
            {
              gt: 80,
              color: "#91ff91",
              symbol: "circle",
              symbolSize:10
            },
            {
              gt: 70,
              lte: 80,
              color: "#fff45c",
              symbol: "circle",
              symbolSize: 10,
            },
            {
              gt: 60,
              lte: 70,
              color: "#ffa95c",
              symbol: "circle",
              symbolSize:10
            },
            {
              lte: 60,
              color: "#ff5c5c",
              symbol: "circle",
              symbolSize:10
            }
          ]
        }
      },
      topHealthRate: 0,
      healthSummary: "",
      unHealthyTimes: 0,
      starNum: "",
      userRecords: "",
      starData: [
        "null-star",
        "null-star",
        "null-star",
        "null-star",
        "null-star"
      ],
      userId: null,
      profile: {},
      date: "",
      loadClass:''
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
      let url = "/Brush/weixin/queryHealthSummary/queryLastWeekHealthSummary?userId=" +
        util.getQueryString("userId");

      this.$http.post(url).then(
        response => {
          console.log(response.body.result);
          this.topHealthRate = response.body.result.topHealthRate;
          this.healthSummary = response.body.result.healthSummary;
          this.unHealthyTimes = response.body.result.unHealthyTimes;
          this.starNum = response.body.result.starNum;
          this.userRecords = response.body.result.userRecords;

          response.body.result.userRecords.forEach((data, index) => {
            this.lineOptions.series[0].data.push(data.healthRate);
          });

          this.setStarData();
          this.date = this.setStartEndDate(this.userRecords);

            this.loadClass = 'hide';
        },
        err => {
          console.log(err);
        }
      );
    },
    setStartEndDate(arr) {
      let startDate = arr[0].startTime;
      let endDate = arr[arr.length - 1].startTime;

      return this.getDate(startDate) + " - " + this.getDate(endDate);
    },
    getDate: function(date) {
      var d = new Date(date);
      d = d.getFullYear() > 0
        ? d
        : new Date(Date.parse(date.replace(/-/g, "/")));
      return d.getMonth() + 1 + "月" + d.getDate() + "日";
    },
    setStarData() {
      let starNum = this.starNum * 2;
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
    this.getData();
  }
});
