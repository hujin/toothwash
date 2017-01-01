import Vue from 'vue';
import Mint from 'mint-ui';

Vue.use(Mint);

import './index.scss';

new Vue({
    el:'#app',
    data(){
        return {
            value:false,
            headerStatus:false,
            deviceList:[
                {name:'设备A',value:1},
                {name:'设备B',value:2}
            ],
            currentDevice:{
                name:'设备A',
                value:1
            },
            waterValue:0,
            intervalValue:0,
            useStatus:false
        }
    },
    methods:{
        showHeader(){
            this.headerStatus = !this.headerStatus;
        },
        addCustom(){

        },
        dialogClose(){
            console.log('xxxxx');
        }
    }
});