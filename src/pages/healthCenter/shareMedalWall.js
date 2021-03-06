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
            medalNum: 0,
            medalData:[true,true,true,true,true,true,true,true,true]

        }
    },
    methods: {

        getData() {
            let url = "/Brush/weixin/UserMedalInfo/queryUserObtainMedal?userId=" +
            util.getQueryString("userId");
            this.$http.post(url).then((response) =>  {
                console.log()

                this.medalNum = response.body.result.userMedals.length;
                for (let data of response.body.result.userMedals) {
                    console.log(data)
                    this.medalData[data.medalId-1] = false;
                }

            }, (err) => {

                console.log(err)

            });
        }

    },

    mounted() {
        this.getData();
    }
});