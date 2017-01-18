import Vue from 'vue';
import Mint from 'mint-ui';
import Resource from 'vue-resource';
import util from '../../../lib/util/util';

Vue.use(Mint);
Vue.use(Resource);

import './detail.scss';

new Vue({
   el:'#app',
   data(){
      return {
         tipsStatus:false,
         lastDayNum:null,
         usedDayNum:null,
         consume:null
      }
   },
   methods:{
      show(){
         this.tipsStatus = true;
      },
      hide(){
         this.tipsStatus = false
      },
      getDetail(){
         var equipmentId = util.getQueryString('equipmentId');
         let url = '/Brush/weixin/MyEquipment/queryReplaceSprayerDays?equipmentId=' + equipmentId;
         this.$http.get(url).then(res => {
            if(res.data.isSuccess) {
               this.lastDayNum = res.data.result.lastDayNum;
               this.usedDayNum = res.data.result.usedDayNum;
               this.consume = Math.round(this.usedDayNum / 90 * 10000) / 100.00
            }
         });

      }
   },
   mounted(){
      this.getDetail();
   }
});