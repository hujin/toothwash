import Vue from 'vue';
import Mint from 'mint-ui';
import Resource from 'vue-resource';
import util from '../../../lib/util/util';

Vue.use(Mint);
Vue.use(Resource);

import './detail.scss';

new Vue({
    el: '#app',
    data(){
        return {
            tipsStatus: false,
            lastDayNum: null,
            usedDayNum: null,
            attritionRate: null,
            photo: '../../assets/avatar.png'
        }
    },
    methods: {
        show(){
            this.tipsStatus = true;
        },
        hide(){
            this.tipsStatus = false
        },
        confirm(){
            let equipmentId = util.getQueryString('equipmentId');
            let url = '/Brush/weixin/equipmentSprayer/replaceEquipmentSprayer?equipmentId=' + equipmentId + '&isReplace=true';
            this.$http.get(url).then(res => {
               this.hide();
               this.getDetail();
            });

        },
        getDetail(){
            let equipmentId = util.getQueryString('equipmentId');
            let url = '/Brush/weixin/equipmentSprayer/queryEquipmentSprayer?equipmentId=' + equipmentId;
            this.$http.get(url).then(res => {
                if (res.data.isSuccess) {

                    this.attritionRate = res.data.result.attritionRate;
                    // this.usedDayNum = res.data.result.usedDayNum;
                    this.getUsedDay();
                }
            });

        },
        getUsedDay(){
            var equipmentId = util.getQueryString('equipmentId');
            var openId = util.getQueryString('openId');
            let url = '/Brush/weixin/equipmentSprayer/queryEquipmentSprayer?equipmentId=' + util.getQueryString('equipmentId');
            this.$http.post(url).then(res => {
                this.usedDayNum = res.data.result.usedDayNum;
                this.attritionRate = res.data.result.attritionRate;
                this.photo = res.data.result.photo;

            });
        }
    },
    mounted(){
        this.getUsedDay();
    }
});