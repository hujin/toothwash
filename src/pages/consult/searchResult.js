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


        getData(obj) {
            var obj = {userId:13}
            let searchText = document.URL.toString().split('?')[1];
            let url = '/Brush/weixin/searchInfo/searchQuestionInfo?' + 'keywords='+searchText+'&'+util.getParam(obj);
            this.$http.post(url).then((response) =>  {
                this.searchData = response.body.result.questionInfos;

            }, (err) => {
                console.log(err)
            });
        }

    },

    mounted() {

        this.getData({userId:13})

    }
});
