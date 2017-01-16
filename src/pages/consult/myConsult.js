import Vue from 'vue';
import Mint from 'mint-ui';
import VueResource from 'vue-resource';
import util from '../../../lib/util/util';

Vue.use(Mint);
Vue.use(VueResource);

import './myConsult.scss';

new Vue({
    el:'#myConsult',

    data(){
        return {


        }
    },

    methods:{
        getMyQuestion(obj) {
            let url = '/Brush/weixin/questionInfo/queryMyQuestion' + util.getParam(obj);
            this.$http.post(url).then((response) =>  {
                console.log(response.body.result.questionInfos2)
                this.myQuestion = response.body.result.questionInfos2;

            }, (err) => {
                console.log(err)
            });
        }

    },

    mounted() {

        this.getMyQuestion({userId:13})

    }
});
