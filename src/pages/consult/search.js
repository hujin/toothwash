import Vue from 'vue';
import Mint from 'mint-ui';
import VueResource from 'vue-resource';
import util from '../../../lib/util/util';

Vue.use(Mint);
Vue.use(VueResource);

import './search.scss';

new Vue({
    el:'#search',

    data(){
        return {
            searchText: '',
            history: []


        }
    },

    methods:{
        search() {

            var obj = {userId:13}
            let url = '/Brush/weixin/questionInfo/queyMyQuestion?' + util.getParam(obj);
            this.$http.post(url).then((response) =>  {
                console.log(response.body.result.healthSummary)
                this.todayHealthData = response.body.result.healthSummary;

            }, (err) => {
                console.log(err)
            });
        },

        getHistory(obj) {

            let url = '/Brush/weixin/searchInfo/querySearchInfo?' + util.getParam(obj);
            this.$http.post(url).then((response) =>  {
                console.log(response.body.result.searchInfos)
                this.history = response.body.result.searchInfos;

            }, (err) => {
                console.log(err)
            });
        },

        delete(index) {

            let url = '/Brush/weixin/searchInfo/deleteSearchInfo?'+this.history[index].Id;
            this.$http.post(url).then((response) =>  {

                this.history.splice(index,1)

            }, (err) => {
                console.log(err)
            });
        }


    },

    mounted() {

        this.getHistory({userId:13})

    }
});
