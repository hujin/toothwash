/**
 * Created by yuanxiaowei on 2017/1/2.
 */
import Vue from 'vue';
import Mint from 'mint-ui';
import VueResource from 'vue-resource';
import util from '../../../lib/util/util';

Vue.use(Mint);
Vue.use(VueResource);

import './medalWall.scss';

new Vue({
    el:'#medalWall',
    data(){
        return {
            medalNum: 0,
            medalData:[true,true,true,true,true,true,true,true,true]

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
                    title: "未豆Vtooth口腔健康勋章墙",
                    desc: "未豆Vtooth口腔水疗护理新体验", // 分享描述
                    link: "http://weixin.vtooth.com/pages/healthCenter/shareMedalWall.html?userId=" +
                    this.userId+ "&code=" +
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
                    title: "未豆Vtooth口腔健康勋章墙", // 分享标题
                    desc: "未豆Vtooth口腔水疗护理新体验", // 分享描述
                    link: "http://weixin.vtooth.com/pages/healthCenter/shareMedalWall.html?userId=" +
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
            let url = '/Brush/weixin/userInfo/queryUserInfo?'+'code='+util.getQueryString('code');
            this.$http.get(url).then((response) => {

                this.userId = response.body.result.userInfo.id;
                this.getData()
                this.getShareData();
            }, (err) => {
                console.log(err)
            });
        },

        medalDetail(id,isShow){
            window.location.href = 'medalDetail.html?id='+id;
        },

        getData() {
            var obj ={userId: this.userId};
            let url = '/Brush/weixin/UserMedalInfo/queryUserObtainMedal?' + util.getParam(obj);
            this.$http.post(url).then((response) =>  {

                this.medalNum = response.body.result.userMedals.length;
                for (let data of response.body.result.userMedals) {
                    console.log(data)
                    this.medalData[data.medalId-1] = false;
                }


            }, (err) => {

                console.log(err)

            });
        }

    },

    mounted() {
        this.getUserData();
    }
});