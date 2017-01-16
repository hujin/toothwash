/**
 * Created by yuanxiaowei on 2017/1/2.
 */
import Vue from 'vue';
import Mint from 'mint-ui';
import Echart from '../../../lib/component/echarts';
import VueResource from 'vue-resource';
import util from '../../../lib/util/util';

Vue.component('Echart', Echart);

Vue.use(Mint);
Vue.use(VueResource);

import './weekHealth.scss';

//折线图
var lineOptions = {

    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data: ['邮件营销'],

    },

    toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },


    xAxis: [
        {
            type: 'category',
            boundaryGap: false,
            axisTick: false,
            splitArea: {show: true},
            data: ['一', '二', '三', '四', '五', '六', '日'],
            axisLine: {
                lineStyle: {
                    color: '#fff'
                }
            }
        }
    ],
    yAxis: [
        {
            type: 'value',
            axisTick: false,

            axisLine: {
                lineStyle: {
                    color: '#fff'
                }
            }
        },

    ],
    series: [{
        legendHoverLink: false,
        type: 'line',
        data: [120, 132, 101, 134, 90, 230, 210],
        itemStyle: {
            normal: {
                areaStyle: {
                    type: 'default',
                    color: 'rgba(255,255,255,0.3)'
                },
                color: '#ffff',
                lineStyle: {
                    color: '#fff'
                }
            }
        },
    }],

};

new Vue({
    el: '#weekHealth',
    data(){
        return {
            lineOptions: lineOptions,
            weekHealthData: '',
            starData: ['null-star', 'null-star', 'null-star', 'null-star', 'null-star']

        }
    },
    methods: {

        getData(obj){
            let url = '/Brush/weixin/queryHealthSummary/queryLastWeekHealthSummary?' + util.getParam(obj);

            this.$http.post(url).then((response) => {

                console.log(response.body.result)
                this.weekHealthData = response.body.result.healthSummary;

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
    mounted(){
        this.getData({userId: 13})

    }
});