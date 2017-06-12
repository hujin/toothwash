/**
 * Created by yuanxiaowei on 2017/1/2.
 */
import Vue from 'vue';
import Mint from 'mint-ui';
import VueResource from 'vue-resource';
import util from '../../../lib/util/util';

Vue.use(Mint);
Vue.use(VueResource);

import './todayHealth.scss';

new Vue({
    el: '#todayHealth',
    data(){
        return {
            healthRate: 0,
            healthSummary: {
                updateTime:'2017-02-15 09:22:02'
            },
            sumTime: 0,
            healthStateClass: 'state-img',
            userId: null,
            profile: {}
        }
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
                    this.rejectWechat();
                    wx.config({
                        debug: false,
                        appId: data.appId,
                        timestamp: data.timestamp,
                        nonceStr: data.nonceStr,
                        signature: data.signature,
                        beta: true,
                        jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage"]
                    });
                    console.log('wechat')
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
                    title: "未豆Vtooth口腔健康日报告",
                    desc: "未豆Vtooth口腔水疗护理新体验", // 分享描述
                    link: "http://weixin.vtooth.com/pages/healthCenter/shareTodayHealth.html?userId=" +
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
                    title: "未豆Vtooth口腔健康日报告", // 分享标题
                    desc: "未豆Vtooth口腔水疗护理新体验", // 分享描述
                    link: "http://weixin.vtooth.com/pages/healthCenter/shareTodayHealth.html?userId=" +
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
        getUserData(){
            let url = '/Brush/weixin/userInfo/queryUserInfo?' + 'code=' + util.getQueryString('code');
            this.$http.get(url).then((response) => {

                this.userId = response.body.result.userInfo.id;
                this.profile = response.body.result.userInfo;
                this.getData({userId: this.userId});

            }, (err) => {
                console.log(err)
            });
        },
        getData(obj) {
            let url = '/Brush/weixin/queryHealthSummary/queryTodayHealthSummary?' + util.getParam(obj);
            this.$http.post(url).then((response) => {
                console.log(response.body.result)
                this.todayHealthData = response.body.result;
                this.healthRate = response.body.result.healthRate;
                this.healthSummary = response.body.result.healthSummary;
                this.sumTime = response.body.result.sumTime;

                this.getShareData();
            }, (err) => {
                console.log(err)
            });
        },
        getDate(date){

            var d = new Date(date);
            d = d.getFullYear() > 0 ? d : new Date(Date.parse(date.replace(/-/g, "/")));

            return d.getMonth() + 1 + '月' + d.getDate() + '日'
        }

    },

    mounted() {

        this.getUserData()

    }
});