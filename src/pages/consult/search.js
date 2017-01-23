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

            window.location.href = 'searchResult.html?'+this.searchText
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

        del(index) {
            console.log(this.history[index])

            let url = '/Brush/weixin/searchInfo/deleteSearchInfo?id='+this.history[index].id;
            this.$http.post(url).then((response) =>  {
                console.log(response)

                this.history.splice(index,1)

            }, (err) => {
                console.log(err)
            });
        },

        goSearch(text){
            window.location.href = 'searchResult.html?'+text

        }


    },

    mounted() {

        this.getHistory({userId:1})

    }
});
