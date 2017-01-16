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
    signature:'47f564e3b6da81241a1dde8d2384bc9611f6b75f',
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
        'openCard','openWXDeviceLib']
});

import './index.scss';

new Vue({
    el:'#app',
    data(){
        return {
            value:false,
            headerStatus:false,
            deviceList:[],
            deviceInfo:{
                shelfLife:0,
                electricQuantity:0,
                sputtering:false,
                patternId:0,
                equipmentName:'',
                equipmentId:0,
                remindTime:0,
                remindTimeName:'关闭'
            },
            form:{
                equipmentId:0,
                patternName:'',
                hydraulicPressure:0,
                frequency:0
            },
            patternList:[],
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
        getDeviceList(obj){
            if(!obj.openId){
                return;
            }
            let url= '/Brush/weixin/MyEquipment/queryEquipmentInfo?' + util.getParam(obj);
            this.$http.post(url).then(res => {
                if(res.data.isSuccess){
                    this.deviceList = res.data.result.equipmentInfos;
                    if(this.deviceInfo.equipmentId == 0){
                        this.getDevice({id:this.deviceList[0].equipmentId});
                    }

                }
            });
        },
        getDevice(obj){
            if(!obj.id){
                return
            }
            let url = '/Brush/weixin/MyEquipment/selectEquipmentInfo?' + util.getParam(obj);
            this.$http.post(url).then(res => {
                if(res.data.isSuccess){
                    const data = res.data.result;
                    this.deviceInfo.shelfLife = data.equipmentInfo.shelfLife;
                    this.deviceInfo.electricQuantity = data.equipmentInfo.electricQuantity;
                    this.deviceInfo.sputtering = data.equipmentInfo.sputtering;
                    this.deviceInfo.patternId = data.equipmentInfo.patternId;
                    this.deviceInfo.equipmentName = data.equipmentInfo.equipmentName;
                    this.deviceInfo.equipmentId = data.equipmentInfo.equipmentId;
                    this.deviceInfo.remindTime = data.equipmentInfo.remindTime;
                    this.deviceInfo.remindTimeName = this.setRemind(this.deviceInfo.remindTime);
                    this.form.equipmentId = data.equipmentInfo.equipmentId;
                    this.patternList = data.patternInfos;
                    this.headerStatus = false;
                }
            });
        },
        addPattern(){
            if(!this.form.patternName){
                alert('请填写模式名称!');
                return;
            }
            let url = '/Brush/weixin/myPattern/addDefinePattern?' + util.getParam(this.form);
            this.$http.post(url).then(res => {
                if(res.data.isSuccess){
                    this.customAddStatus = false;
                    const obj = this.form;
                    this.patternList.push({
                        equipmentId:obj.equipmentId,
                        patternName:obj.patternName,
                        hydraulicPressure:obj.hydraulicPressure,
                        frequency:obj.frequency,
                        id:res.data.result.id
                    });
                    this.form.patternName='';
                    this.form.hydraulicPressure=0;
                    this.form.frequency=0
                }
            });
        },
        deletePattern(id,index){
            var obj = {
                equipmentId:this.form.equipmentId,
                deleteId:id,
                updateId:0
            }
            if(this.deviceInfo.patternId == id){
                if(this.patternList.length <= 1 || index == 0){
                    obj.updateId = 1
                }else{
                    obj.updateId = this.patternList[index-1].id;
                }
            }
            let url = '/Brush/weixin/myPattern/deleteDefinePattern?' + util.getParam(obj);
            this.$http.post(url).then(res => {
                if(res.data.isSuccess){
                    if(obj.updateId != 0){
                        this.deviceInfo.patternId = obj.updateId;
                    }
                    this.patternList.splice(index,1);
                }
            });

        },
        choosePattern(id){
            if(!id){
                return;
            }
            let url ='/Brush/weixin/myPattern/selectPattern?id=' + id + '&equipmentId=' + this.deviceInfo.equipmentId;
            this.$http.post(url).then(res => {
               if(res.data.isSuccess){
                   this.deviceInfo.patternId = id;
               }
            });

        },
        setRemindTime(){
            let obj = {
                id:this.deviceInfo.equipmentId,
                remindTime:this.deviceInfo.remindTime,
                isRemind:false
            }

            if(obj.remindTime != 0){
                obj.isRemind = true;
            }

            let url = '/Brush/weixin/MyEquipment/updateEquipmentRemindTime?' + util.getParam(obj);

            this.$http.post(url).then(res => {
                if(res.data.isSuccess){
                    this.clockStatus = false;
                    this.deviceInfo.remindTimeName = this.setRemind(this.deviceInfo.remindTime);
                }
            });
        },
        setRemind(kind){
            kind = parseInt(kind);
            let str = '';
            switch (kind){
                case 0:
                    str = '关闭';
                    break;
                case 1:
                    str = '15秒';
                    break;
                case 2:
                    str = '30秒';
                    break;
                case 3:
                    str = '60秒';
                    break;
            }
            return str;
        },
        setSputtering(status){
            let obj = {
                id:this.deviceInfo.equipmentId,
                sputtering:status
            }
            let url = '/Brush/weixin/MyEquipment/updateEquipmentSputtering?' + util.getParam(obj);
            this.$http.post(url).then(res => {

            });
        },
        setEquipmentName(){
            let obj = {
                id:this.deviceInfo.equipmentId,
                equipmentName:this.deviceInfo.equipmentName
            }
            let url ='/Brush/weixin/MyEquipment/updateEquipmentName?' + util.getParam(obj);
            this.$http.post(url).then(res => {
                if(res.data.isSuccess){
                    this.deviceStatus = false;
                }
            });
        }
    },
    mounted(){
        this.getDeviceList({openId:1});

        wx.ready(function () {
            wx.invoke('openWXDeviceLib',{'connType':'blue'},function (res) {
               console.log(res);
            });
        });
    }
});