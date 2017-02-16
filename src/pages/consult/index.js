import Vue from 'vue';
import Mint from 'mint-ui';
import VueResource from 'vue-resource';
import util from '../../../lib/util/util';

Vue.use(Mint);
Vue.use(VueResource);

import './index.scss';

new Vue({
    el: '#app',

    data(){
        return {
            selected: 0,
            options: [],
            allQuestions:[],
            num: 0


        }
    },

    methods: {
        getQuestionTypes() {
            let url = '/Brush/weixin/questionType/queryQuestionType';
            this.$http.post(url).then((response) => {
                //问题类型
                console.log(response.body.result.questionTypes)
                this.options = response.body.result.questionTypes;

            }, (err) => {
                console.log(err)
            });
        },
        getAllQuestion(obj) {
            let url = '/Brush/weixin/questionInfo/queryQuestionInfo?'+util.getParam(obj)+'&code='+util.getQueryString('code');
            this.$http.post(url).then((response) => {
                //问题类型
                console.log(response.body.result.questionInfos2)
                this.num = response.body.result.num;
                if (!response.body.result.questionInfos2){
                    this.allQuestions = response.body.result.questionInfos;
                }else {
                    this.allQuestions = response.body.result.questionInfos2;
                }


            }, (err) => {
                console.log(err)
            });
        },

        goWrite(){
            window.location.href = 'writeConsult.html'
        },

        goSearch(){
            window.location.href = 'search.html'
        },

        goMy() {
            window.location.href = 'myConsult.html'
        }

    },

    mounted() {

        this.getQuestionTypes()
        this.getAllQuestion({typeId:0})



    }
});
