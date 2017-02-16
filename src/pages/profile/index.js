import Vue from 'vue';
import Mint from 'mint-ui';
import VueResource from 'vue-resource';
import util from '../../../lib/util/util';

import "./index.scss";

Vue.use(Mint);
Vue.use(VueResource);

new Vue({
    el:'#app',
    data(){
        return {

            userId: null,
            profile:{
                name:null,
                email:'789234111@qq.com',
                phone:null
            },
            modifyRealName: '',
            modifyEmailAddress: '',
            nameStatus:false,
            emailStatus:false,
            phoneStatus:false,
            btnText:'点击获取验证码',
            t:180,
            timePromise:null,
            inverseStatus:false,
            mobile:null,
            modifyPhone: null,
            verificationCode: null,
            status1:false,
            status2:false,
            status3:false,
            activeIndex:0
        }
    },
    methods:{
        getUserData(){
            let url = '/Brush/weixin/userInfo/queryUserInfo?'+'code='+util.getQueryString('code');
            this.$http.get(url).then((response) => {

                this.userId = response.body.result.userInfo.id;

                if(response.body.result.userInfo.toothDecay==5){
                    response.body.result.userInfo.toothDecay='4颗以上';
                }
                this.profile = response.body.result.userInfo;

            }, (err) => {
                console.log(err)
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
            let url = '/Brush/weixin/userInfo/sendMessage?mobile='+phone;
            this.$http.post(url).then((response) => {
                console.log(response)
                // this.userDatas = response.body.result.infos;

            }, (err) => {
                console.log(err)
            });



            if(this.inverseStatus){
                return;
            }
            if(!phone){
                return;
            }

            var telReg = !!phone.match(/^(((1[0-9]{1}))+\d{9})$/);

            if(telReg == false){
                return;
            }

            this.runTiming();
            this.inverseStatus = true;
        },
        runTiming(){
            console.log('xxx');
            this.timePromise = setInterval(() => {
                this.t -= 1;
                this.btnText = this.t + 's重新获取';
                if(this.t <= 1){
                    clearInterval(this.timePromise);
                    this.t = 180;
                    this.btnText = '重新获取';
                    this.inverseStatus = false;
                }
            },1000);

        },
        //修改名字
        modifyName(){
            let url = '/Brush/weixin/userInfo/updateRealName?id='+this.userId+'&realName='+this.modifyRealName;
            this.$http.post(url).then((response) => {
                this.dialogNameClose();
                this.getUserData();

            }, (err) => {
                console.log(err)
            });
        },
        modifyEmail(){
            let url = '/Brush/weixin/userInfo/updateUserEmail?id='+this.userId+'&userEmail='+this.modifyEmailAddress;
            this.$http.post(url).then((response) => {
                this.dialogEmailClose();
                this.getUserData();

            }, (err) => {
                console.log(err)
            });
        },
        //首次绑定手机号
        bindMobile(){

            let url = '/Brush/weixin/userInfo/changeMobile?id='+this.userId+'&mobile='+this.mobile+'&yzm=' + this.verificationCode;
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



            let url = '/Brush/weixin/userInfo/updateDentalCalculus?id='+this.userId+'&dentalCalculus='+status;
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
            let url = '/Brush/weixin/userInfo/updateToothDecay?id='+this.userId+'&toothDecay='+this.activeIndex;
            this.$http.post(url).then((response) => {
                this.status2 = false;
                this.getUserData();
            }, (err) => {
                console.log(err)
            });


        },
        setToothStatus(status){
            let url = '/Brush/weixin/userInfo/updateSpurTooth?id='+this.userId+'&spurTooth='+status;
            this.$http.post(url).then((response) => {
                console.log(response)
                // this.userDatas = response.body.result.infos;
                this.status1= false;
                this.getUserData();
            }, (err) => {
                console.log(err)
            });


        }

    },
    mounted(){
        this.getUserData();
    }
});