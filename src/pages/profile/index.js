import Vue from 'vue';
import Mint from 'mint-ui';
import VueResource from 'vue-resource';
import util from '../../../lib/util/util';

import "./index.scss";

Vue.use(Mint);
Vue.use(VueResource);

new Vue({
    el: '#app',
    data(){
        return {
            loadClass:'',
            userId: null,
            profile: {
                name: null,
                email: '789234111@qq.com',
                phone: null
            },
            modifyRealName: '',
            modifyEmailAddress: '',
            emailStatus:false,
            emailErrorStatus:false,
            nameStatus: false,
            nameErrorStatus: false,
            phoneStatus: false,
            phoneErrorStatus: false,
            phoneBindStatus: false,
            btnText: '点击获取验证码',
            t: 180,
            timePromise: null,
            inverseStatus: false,
            mobile: null,
            modifyPhone: null,
            verificationCode: null,
            status1: false,
            status2: false,
            status3: false,
            activeIndex: 0
        }
    },
    methods: {
        getUserData(){
            setTimeout(() => {
                this.loadClass = 'hide'
            },300)
            let url = '/Brush/weixin/userInfo/queryUserInfo?' + 'code=' + util.getQueryString('code');
            this.$http.get(url).then((response) => {


                this.userId = response.body.result.userInfo.id;

                if (response.body.result.userInfo.toothDecay == 5) {
                    response.body.result.userInfo.toothDecay = '4颗以上';
                }
                this.profile = response.body.result.userInfo;

            }, (err) => {
                console.log(err)
                alert('服务器异常请重新进入！')
            });
        },
        showName(){
            this.nameStatus = true;
        },
        dialogNameClose(){
            this.nameStatus = false;
        },
        showEmail(){
            this.emailStatus = true;
        },
        dialogEmailClose(){
            this.emailStatus = false;
        },
        showPhone(){
            this.phoneStatus = true;
        },
        dialogPhoneClose(){
            this.phoneStatus = false;
        },
        //发送验证码
        sendCode(){
            let phone = this.mobile;
            this.phoneErrorStatus = false;
            if (this.inverseStatus) {
                return;
            }
            if (!phone) {
                return;
            }

            var telReg = !!phone.match(/(^0{0,1}1[3|4|5|6|7|8|9][0-9]{9}$)/);
            if (telReg == false) {
                this.phoneBindStatus = false;
                this.phoneErrorStatus = true;

                return;
            }

            let url = '/Brush/weixin/userInfo/sendMessage?mobile=' + phone;
            this.$http.post(url).then((response) => {
                console.log(response)
                // this.userDatas = response.body.result.infos;

            }, (err) => {
                console.log(err)
            });

            this.runTiming();
            this.inverseStatus = true;
        },
        runTiming(){
            this.timePromise = setInterval(() => {
                this.t -= 1;
                this.btnText = this.t + 's重新获取';
                if (this.t <= 1) {
                    clearInterval(this.timePromise);
                    this.t = 180;
                    this.btnText = '重新获取';
                    this.inverseStatus = false;
                }
            }, 1000);

        },
        //修改名字
        modifyName(){
            let url = '/Brush/weixin/userInfo/updateRealName?id=' + this.userId + '&realName=' + this.modifyRealName;
            this.$http.post(url).then((response) => {
                this.dialogNameClose();
                this.getUserData();

            }, (err) => {
                console.log(err)
            });
        },
        modifyEmail(){
            this.emailErrorStatus = false;
            let reg =  /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z]{2,4})+$/;
            console.log(this.emailErrorStatus,reg.test(this.modifyEmailAddress))
            if (reg.test(this.modifyEmailAddress)) {
                let url = '/Brush/weixin/userInfo/updateUserEmail?id=' + this.userId + '&userEmail=' + this.modifyEmailAddress;
                this.$http.post(url).then((response) => {
                    this.dialogEmailClose();
                    this.getUserData();

                }, (err) => {
                    console.log(err)
                });
            }else {
                this.emailErrorStatus = true;
            }
            console.log(this.emailErrorStatus,reg.test(this.modifyEmailAddress))


        },
        //首次绑定手机号
        bindMobile(){
            if(this.verificationCode.length!=6){
                this.phoneErrorStatus = false;
                this.phoneBindStatus = true;
                return;
            }

            let url = '/Brush/weixin/userInfo/changeMobile?id=' + this.userId + '&mobile=' + this.mobile + '&yzm=' + this.verificationCode;
            this.$http.post(url).then((response) => {
                console.log(response)
                // this.userDatas = response.body.result.infos;
                this.dialogPhoneClose();
                this.getUserData();

            }, (err) => {
                console.log(err)
            });

        },
        //设置是否有牙结石
        setToothStone(status){


            let url = '/Brush/weixin/userInfo/updateDentalCalculus?id=' + this.userId + '&dentalCalculus=' + status;
            this.$http.post(url).then((response) => {
                this.getUserData();
                this.status3 = false;

            }, (err) => {
                console.log(err)
            });
        },
        setToothNum(num){
            this.activeIndex = num
        },
        //填写蛀牙数
        confirmToothNum(){
            let url = '/Brush/weixin/userInfo/updateToothDecay?id=' + this.userId + '&toothDecay=' + this.activeIndex;
            this.$http.post(url).then((response) => {
                this.status2 = false;
                this.getUserData();
            }, (err) => {
                console.log(err)
            });


        },
        setToothStatus(status){
            let url = '/Brush/weixin/userInfo/updateSpurTooth?id=' + this.userId + '&spurTooth=' + status;
            this.$http.post(url).then((response) => {
                console.log(response)
                // this.userDatas = response.body.result.infos;
                this.status1 = false;
                this.getUserData();
            }, (err) => {
                console.log(err)
            });


        },

        dialogCustomClose(){
            this.status1 = false;
            this.status2 = false;
            this.status3 = false;

        }

    },
    mounted(){
        this.getUserData();
    }
});