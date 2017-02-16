import Vue from 'vue';
import Mint from 'mint-ui';
import VueResource from 'vue-resource';
import util from '../../../lib/util/util';

import "./phone.scss";

Vue.use(Mint);
Vue.use(VueResource);

new Vue({
    el:'#app',
    data(){
        return {
            phoneStatus: false,
            btnText: '点击获取验证码',
            t:180,
            timePromise:null,
            inverseStatus:false,

        }
    },
    methods:{
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