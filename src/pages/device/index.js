import Vue from 'vue';
import Mint from 'mint-ui';
import Checkbox from '../../../lib/component/checkbox';

Vue.use(Mint);

Vue.component('i-checkbox',Checkbox);

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
            useStatus:false,
            customAddStatus:false,
            deleteStatus:false,
            clockStatus:false,
            deviceStatus:false
        }
    },
    methods:{
        showHeader(){
            this.headerStatus = !this.headerStatus;
        },
        addCustom(){
            this.customAddStatus = true;
        },
        dialogCustomClose(){
            this.customAddStatus = false;
        },
        dialogClockClose(){
            this.clockStatus = false;
        },
        setClock(){
            this.clockStatus = !this.clockStatus
        },
        deleteCustom(){
            this.deleteStatus = !this.deleteStatus;
        },
        dialogDeviceClose(){
            this.deviceStatus = false;
        },
        setDeviceName(){
            this.deviceStatus = true;
        },
        goDetail(){
            window.location.href = 'detail.html'
        }
    }
});