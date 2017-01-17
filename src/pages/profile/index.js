import Vue from 'vue';
import Mint from 'mint-ui';

import "./index.scss";

Vue.use(Mint);

new Vue({
    el:'#app',
    data(){
        return {
            profile:{
                name:null,
                email:'789234111@qq.com',
                phone:null
            },
            nameStatus:false,
            emailStatus:false,
            phoneStatus:false,
            btnText:'点击获取验证码',
            t:180,
            timePromise:null,
            inverseStatus:false,
            mobile:null,
            status1:false,
            status2:false,
            status3:false,
            activeIndex:0
        }
    },
    methods:{
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
        sendCode(){
            let phone = this.mobile;
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
        bindMobile(){
            this.dialogPhoneClose();
        }
    }
});