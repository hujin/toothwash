import Vue from 'vue';
import Mint from 'mint-ui';
import Resource from 'vue-resource';

Vue.use(Mint);
Vue.use(Resource);

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
   },
   mounted(){

   }
});