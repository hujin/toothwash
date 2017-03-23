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
            history: [],
            userId: null
        }
    },

    methods:{
        getUserData(){
            let url = '/Brush/weixin/userInfo/queryUserInfo?'+'code='+util.getQueryString('code');
            this.$http.get(url).then((response) => {

                this.userId = response.body.result.userInfo.id;
                this.getHistory({userId: this.userId})
            }, (err) => {
                console.log(err)
            });
        },
        search() {

            window.location.href = 'searchResult.html?keyword='+this.searchText+'&userId='+this.userId
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

        goResult(text){
            window.location.href = 'searchResult.html?keyword='+text

        }


    },

    mounted() {
        this.getUserData()


    }
});
