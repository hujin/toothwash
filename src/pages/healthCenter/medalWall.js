/**
 * Created by yuanxiaowei on 2017/1/2.
 */
import Vue from 'vue';
import Mint from 'mint-ui';
import VueResource from 'vue-resource';
import util from '../../../lib/util/util';

Vue.use(Mint);
Vue.use(VueResource);

import './medalWall.scss';

new Vue({
    el:'#medalWall',
    data(){
        return {
            medalNum: 0

        }
    },
    methods: {
        getData(obj) {
            let url = '/Brush/weixin/UserMedalInfo/queryUserObtainMedal?' + util.getParam(obj);
            this.$http.post(url).then((response) =>  {

                this.medalNum = response.body.userMedals.length;

            }, (err) => {

                console.log(err)

            });
        }

    },

    mounted() {
        this.getData({userId:1})

    }
});