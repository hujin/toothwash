/**
 * Created by yuanxiaowei on 2017/1/2.
 */
import Vue from 'vue';
import Mint from 'mint-ui';
import VueResource from 'vue-resource';
import util from '../../../lib/util/util';

Vue.use(Mint);
Vue.use(VueResource);

import './index.scss';

new Vue({
    el:'#app',

    data(){
        return {
            healthData: ''

        }
    },

    methods:{
        getData(obj) {
            let url = '/Brush/weixin/allUserRecord/healthCenter?' + util.getParam(obj);
            this.$http.post(url).then((response) =>  {
                console.log(response)
                this.healthData = response.body.result;

            }, (err) => {
                console.log(err)
            });
        }

    },

    mounted() {

        this.getData({userId:13})

    }
});