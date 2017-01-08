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
                email:'789234111@qq.com'
            },
            nameStatus:false,
            emailStatus:false
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
        }
    }
});