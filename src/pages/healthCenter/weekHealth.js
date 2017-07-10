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
                    show: false
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
                        splitArea: {show: true},
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
                            symbolSize: 10
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
                            symbolSize: 10
                        },
                        {
                            lte: 60,
                            color: "#ff5c5c",
                            symbol: "circle",
                            symbolSize: 10
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
            loadClass: '',
        };
    },
    methods: {
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
                    title: "未豆Vtooth口腔健康周报告",
                    desc: "未豆Vtooth口腔水疗护理新体验", // 分享描述
                    link: "http://weixin.vtooth.com/pages/healthCenter/shareWeekHealth.html?userId=" +
                    util.getQueryString("userId")+"&code=" +
                        util.getQueryString("code"),// 分享链接
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
                    title: "未豆Vtooth口腔健康周报告", // 分享标题
                    desc: "未豆Vtooth口腔水疗护理新体验", // 分享描述
                    link: "http://weixin.vtooth.com/pages/healthCenter/shareWeekHealth.html?userId=" +
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
        getUserData() {
            let url =
                "/Brush/weixin/userInfo/queryUserInfo?" +
                "code=" +
                util.getQueryString("code");
            this.$http.get(url).then(
                response => {
                    this.userId = response.body.result.userInfo.id;
                    this.profile = response.body.result.userInfo;
                    this.getData();
                    this.loadClass = 'hide';
                    this.getShareData();
                },
                err => {
                    console.log(err);
                    alert("服务器异常请重新进入！");
                }
            );
        },

        getData() {
            var obj = {userId: this.userId};
            let url = "/Brush/weixin/queryHealthSummary/queryLastWeekHealthSummary?" +
                util.getParam(obj);

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
        getDate: function (date) {
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
    }
});
