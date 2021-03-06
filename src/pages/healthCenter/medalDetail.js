import Vue from 'vue';
import Mint from 'mint-ui';
import VueResource from 'vue-resource';
import util from '../../../lib/util/util';

Vue.use(Mint);
Vue.use(VueResource);

import './medalDetail.scss';

new Vue({
    el: '#medalDetail',
    data(){
        return {
            result: '',
            desc: '',
            id: 0,
            medalClass: '',
            greyClass: '',
            isSuccess: false
        }
    },
    methods: {
        getUserData(){
            let url = '/Brush/weixin/userInfo/queryUserInfo?' + 'code=' + util.getQueryString('code');
            this.$http.get(url).then((response) => {

                this.userId = response.body.result.userInfo.id;

                this.getData()
            }, (err) => {
                console.log(err)
            });

        },
        getData() {

            let obj = {userId: this.userId};
            let url = '/Brush/weixin/obtainMedalIllustrate/queryIsObtainMedal?' + util.getParam(obj) + '&medalId=' + util.getQueryString('id');
            this.$http.post(url).then((response) => {
                this.result = response.body.result;

                if(this.result=='未完成'){
                    this.isSuccess = false;
                }else {
                    this.isSuccess = true;
                }

                if(!this.isSuccess){
                    this.greyClass = 'grey-filter';
                }

            }, (err) => {
                console.log(err)
            });
            this.getDesc();
        },
        getDesc() {
            let obj = {userId: this.userId};
            let url = '/Brush/weixin/UserMedalInfo/queryAllMedalInfo?' + util.getParam(obj);
            this.$http.post(url).then((response) => {

                 this.desc = response.body.result.medalInfos[util.getQueryString('id')-1].medalDescription;


            }, (err) => {
                console.log(err)
            });
        },
        setImg(){

            switch (parseInt(util.getQueryString('id'))) {
                case 1:
                    this.medalClass = 'medal1'
                    break;
                case 2:
                    console.log(util.getQueryString('id'))
                    this.medalClass = 'medal2'
                    break;
                case 3:
                    this.medalClass = 'medal3'
                    break;
                case 4:
                    this.medalClass = 'medal4'
                    break;
                case 5:
                    this.medalClass = 'medal5'
                    break;
                case 6:
                    this.medalClass = 'medal6'
                    break;
                case 7:
                    this.medalClass = 'medal7'
                    break;
                case 8:
                    this.medalClass = 'medal8'
                    break;
                case 9:
                    this.medalClass = 'medal9'
                    break;

            }


        }

    },

    mounted() {
        this.getUserData();
        this.setImg()

    }
});