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
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            textStyle: {
                fontSize: 100 // 用 legend.textStyle.fontSize 更改示例大小
            }
        }
    ],
    yAxis: [
        {
            type: 'value'
        }
    ],
    series: [
        {
            name: '邮件营销',
            type: 'line',
            stack: '总量',
            data: [120, 132, 101, 134, 90, 230, 210]
        }
    ]
};

new Vue({
    el: '#weekHealth',
    data(){
        return {
            lineOptions: lineOptions,
            weekHealthData: ''

        }
    },
    methods:{

        getData(obj){
            let url = '/Brush/weixin/queryHealthSummary/queryLastWeekHealthSummary?' + util.getParam(obj);

            this.$http.post(url).then((response) =>  {

                console.log(response.body.result)
                this.weekHealthData = response.body.result.healthSummary;

            }, (err) => {
                console.log(err)
            });
        }

    },
    mounted(){
        this.getData({userId:13})

    }
});