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
            myQuestion:'',
            userId: null
        }
    },

    methods:{
        getUserData(){
            let url = '/Brush/weixin/userInfo/queryUserInfo?code='+util.getQueryString('code');
            this.$http.get(url).then((response) => {

                this.userId = response.body.result.userInfo.id;
                this.getMyQuestion()

            }, (err) => {
                console.log(err)
            });
        },
        getMyQuestion() {
            var obj ={userId: this.userId};
            let url = '/Brush/weixin/questionInfo/queryMyQuestion?' + util.getParam(obj);
            this.$http.post(url).then((response) =>  {
                console.log(response.body.result)
                this.myQuestion = response.body.result.questionInfos2.concat(response.body.result.questionInfos1);

            }, (err) => {
                console.log(err)
            });
        }

    },

    mounted() {
        this.getUserData()

    }
});
