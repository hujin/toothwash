import Vue from 'vue';
import Mint from 'mint-ui';
import Resource from 'vue-resource';
import util from '../../../lib/util/util';

Vue.use(Mint);
Vue.use(Resource);

import './equipment.scss';

new Vue({
    el: '#app',
    data(){
        return {
            removeStatus:false,
            deviceStatus:false,
            equipmentName:'',
            reEquipmentName:''
        }
    },
    methods: {
        show(){
            this.deviceStatus = true;
        },
        showRemove(){
            this.removeStatus = true;
        },
        hide(){
            this.deviceStatus = false;
            this.removeStatus = false;
        },
         setEquipmentName(){
            let obj = {
                id: util.getQueryString('equipmentId'),
                equipmentName: this.reEquipmentName
            }
            let url ='/Brush/weixin/MyEquipment/updateEquipmentName?' + util.getParam(obj);
            this.$http.post(url).then(res => {
                if(res.data.isSuccess){
                    this.deviceStatus = false;
                    this.equipmentName =  this.reEquipmentName
                }
            });
        },
        confirm(){

            let url = '/Brush/weixin/MyEquipment/unBindEquipment?openId='+util.getQueryString('openId')+'&equipmentNum='+util.getQueryString('equipmentNum') 
            this.$http.get(url).then(res => {
              window.location.href = 'index.html'
            });

        }
    },
    mounted(){
        this.equipmentName = decodeURIComponent(util.getQueryString('equipmentName'))
    }
});