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
            question: ''


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

        commit() {
            var obj = {userId: 13}
            let url = '/Brush/weixin/questionInfo/submitMyQuestion?' + util.getParam(obj)+"&typeId="+this.selected+"&question="
                +this.question;
            this.$http.post(url).then((response) => {
                //问题类型
                console.log(response.body.result)
                Mint.Toast({
                    message: 'operation success',
                    iconClass: 'icon icon-success',
                    className:'icom',
                    duration:10000000000
                });
                this.question = ''

            }, (err) => {
                console.log(err)
            })

        }

    },

    mounted() {

        this.getQuestionTypes({userId: 13})

    }
});
