import Vue from 'vue';
import Mint from 'mint-ui';
import VueResource from 'vue-resource';
import util from '../../../lib/util/util';

Vue.use(Mint);
Vue.use(VueResource);

import './writeConsult.scss';

new Vue({
    el: '#writeConsult',

    data(){
        return {
            options: [],
            selected: 1,
            question: '',
            userId:null


        }
    },

    methods: {
        getUserData(){
            let url = '/Brush/weixin/userInfo/queryUserInfo?'+'code='+util.getQueryString('code');
            this.$http.get(url).then((response) => {

                this.userId = response.body.result.userInfo.id;

            }, (err) => {
                console.log(err)
            });
        },
        getQuestionTypes() {
            let url = '/Brush/weixin/questionType/queryQuestionType';
            this.$http.post(url).then((response) => {
                //问题类型
                this.options = response.body.result.questionTypes;

            }, (err) => {
                console.log(err)
            });
        },

        commit() {
            var obj = {userId: this.userId}
            let url = '/Brush/weixin/questionInfo/submitMyQuestion?' + util.getParam(obj)+"&typeId="+this.selected+"&question="
                +this.question;
            this.$http.post(url).then((response) => {
                //问题类型
                console.log(response.body.result)
                Mint.Toast({
                    message: 'operation success',
                    iconClass: 'icon icon-success',
                    className:'icom',
                    duration:3000
                });
                this.question = ''
                window.location.href = document.referrer

            }, (err) => {
                console.log(err)
            })

        }

    },

    mounted() {

        this.getQuestionTypes()
        this.getUserData();

    }
});
