import Vue from 'vue';
import Mint from 'mint-ui';
import VueResource from 'vue-resource';
import util from '../../../lib/util/util';

Vue.use(Mint);
Vue.use(VueResource);

import './searchResult.scss';

new Vue({
    el:'#searchResult',

    data(){
        return {
            searchData:[]

        }
    },

    methods:{
        getData() {
            let url = '/Brush/weixin/searchInfo/searchQuestionInfo?' + 'keywords='+ util.getQueryString('keyword')+'&userId='+util.getQueryString('userId');
            this.$http.post(url).then((response) =>  {
                this.searchData = response.body.result.questionInfos;

            }, (err) => {
                console.log(err)
            });
        }

    },

    mounted() {
        console.log(util.getQueryString('keyword'))

        this.getData()

    }
});
