import Vue from 'vue';
import Mint from 'mint-ui';

Vue.use(Mint);

import './detail.scss';

new Vue({
   el:'#app',
   data(){
      return {
         tipsStatus:false
      }
   },
   methods:{
      show(){
         this.tipsStatus = true;
      },
      hide(){
         this.tipsStatus = false
      }
   }
});