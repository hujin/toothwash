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
            allQuestions:[]


        }
    },

    methods: {
        getQuestionTypes(obj) {
            let url = '/Brush/weixin/questionType/queryQuestionType?' + util.getParam(obj);
            this.$http.post(url).then((response) => {
                //问题类型
                console.log(response.body.result.questionTypes)
                this.options = response.body.result.questionTypes;

            }, (err) => {
                console.log(err)
            });
        },
        getAllQuestion(obj) {
            let url = '/Brush/weixin/questionInfo/queryQuestionInfo?' + util.getParam(obj);
            this.$http.post(url).then((response) => {
                //问题类型
                console.log(response.body.result.questionInfos)
                this.allQuestions = response.body.result.questionInfos;

            }, (err) => {
                console.log(err)
            });
        },
        search() {

        }

    },

    mounted() {

        this.getQuestionTypes({userId: 13})
        this.getAllQuestion({userId: 1})

    }
});
