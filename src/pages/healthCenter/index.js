/**
 * Created by yuanxiaowei on 2017/1/2.
 */
import Vue from 'vue';
import Mint from 'mint-ui';
import Circle from '../../../lib/component/circle';

Vue.use(Mint);

import './index.scss';

Vue.component('Circle', Circle);

new Vue({
    el:'#app',
    data(){
        return {

        }
    },
    methods:{

    }
});