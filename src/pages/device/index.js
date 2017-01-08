import Vue from 'vue';
import Mint from 'mint-ui';
import Checkbox from '../../../lib/component/checkbox';
import Resource from 'vue-resource';
import util from '../../../lib/util/util';


Vue.use(Mint);
Vue.use(Resource);

Vue.component('i-checkbox',Checkbox);

wx.config({
    beta:true,
    debug:true,
    appId: 'wxf67c994040b19368',
    timestamp:1483844878,
    noncestr:'Tr4O7u0RTWCle42weF9bQBFTaX1VTlBb',
    signature:'c77a4f4ad5749bf5b568536668d1b252fce02f42',
    jsApiList:['checkJsApi',
        'onMenuShareTimeline',
        'onMenuShareAppMessage',
        'onMenuShareQQ',
        'onMenuShareWeibo',
        'hideMenuItems',
        'showMenuItems',
        'hideAllNonBaseMenuItem',
        'showAllNonBaseMenuItem',
        'translateVoice',
        'startRecord',
        'stopRecord',
        'onRecordEnd',
        'playVoice',
        'pauseVoice',
        'stopVoice',
        'uploadVoice',
        'downloadVoice',
        'chooseImage',
        'previewImage',
        'uploadImage',
        'downloadImage',
        'getNetworkType',
        'openLocation',
        'getLocation',
        'hideOptionMenu',
        'showOptionMenu',
        'closeWindow',
        'scanQRCode',
        'chooseWXPay',
        'openProductSpecificView',
        'addCard',
        'chooseCard',
        'openCard']
});

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
        },
        getDevice(obj){
            if(!obj.id){
                return
            }
            let url = '/Brush/weixin/MyEquipment/selectEquipmentInfo?' + util.getParam(obj);
            this.$http.post(url).then(res => {
                console.log(res);
            });
        }
    },
    mounted(){
        this.getDevice({id:1});

    }
});