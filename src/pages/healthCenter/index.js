/**
 * Created by yuanxiaowei on 2017/1/2.
 */
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
            healthData: '',
            starData: ['null-star', 'null-star', 'null-star', 'null-star', 'null-star']


        }
    },

    methods: {
        goTodayHealth(){
            window.location.href = 'todayHealth.html'
        },
        goWeekHealth(){
            window.location.href = 'weekHealth.html'
        },
        goMedalWall(){
            window.location.href = 'medalWall.html'
        },

        getData(obj) {
            let url = '/Brush/weixin/allUserRecord/healthCenter?' + util.getParam(obj);
            this.$http.post(url).then((response) => {
                console.log(response)
                this.healthData = response.body.result;
                let rate = this.healthData.healthRate;
                this.healthData.healthRate = 0;
                setInterval(() => {
                    if(this.healthData.healthRate<rate){
                        this.healthData.healthRate = this.healthData.healthRate+1
                    }
                },5)
                this.setStarData();
                window.circleAnim(rate);

            }, (err) => {
                console.log(err)
            });
        },
        setStarData() {
            let starNum = this.healthData.starNum * 2;
            for (let i = 1; i <= 5; i++) {
                console.log(starNum - (2 * i))
                if (starNum - (2 * i) == -1) {
                    this.starData[i - 1] = 'half-star'
                }
                if (starNum - (2 * i) >= 0) {
                    this.starData[i - 1] = 'full-star'
                }
                if (starNum - (2 * i) < -1) {
                    this.starData[i - 1] = 'null-star'
                }
            }
        }

    },

    mounted() {

        this.getData({userId: 13})

    }
});