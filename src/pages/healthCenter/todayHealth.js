/**
 * Created by yuanxiaowei on 2017/1/2.
 */
import Vue from 'vue';
import Mint from 'mint-ui';
import VueResource from 'vue-resource';

Vue.use(Mint);
Vue.use(VueResource);

import './todayHealth.scss';

new Vue({
    el:'#todayHealth',
    data(){
        return {
            todayHealthData: ''

        }
    },

    methods() {

    },

    mounted() {
        this.$http.post('/Brush/weixin/queryHealthSummary/queryTodayHealthSummary?userId=13').then((response) =>  {
            console.log(response.body.result.healthSummary)
            this.todayHealthData = response.body.result.healthSummary;

        }, (err) => {
            console.log(err)
        });
    }
});