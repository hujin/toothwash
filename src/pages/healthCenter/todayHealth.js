/**
 * Created by yuanxiaowei on 2017/1/2.
 */
import Vue from 'vue';
import Mint from 'mint-ui';
import VueResource from 'vue-resource';
import util from '../../../lib/util/util';

Vue.use(Mint);
Vue.use(VueResource);

import './todayHealth.scss';

new Vue({
    el:'#todayHealth',
    data(){
        return {
            healthRate:0,
            healthSummary: '',
            sumTime:0,
            healthStateClass: 'state-img',
        }
    },

    methods: {
        getData(obj) {
            let url = '/Brush/weixin/queryHealthSummary/queryTodayHealthSummary?' + util.getParam(obj);
            this.$http.post(url).then((response) =>  {
                console.log(response.body.result)
                this.todayHealthData = response.body.result;
                this.healthRate = response.body.result.healthRate;
                this.healthSummary = response.body.result.healthSummary;
                this.sumTime = response.body.result.sumTime;
                
                console.log( this.todayHealthData.healthSummary.titleDetail)

            }, (err) => {
                console.log(err)
            });
        }

    },

    mounted() {

        this.getData({userId:13})

    }
});