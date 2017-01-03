import Vue from 'vue';
import Mint from 'mint-ui';
import Echart from '../../../lib/component/echarts';
Vue.component('Echart', Echart);

Vue.use(Mint);

import './index.scss';

//折线图
var lineOptions = {

    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data: ['邮件营销']
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
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
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

var dateArr = [
    {
        date: "2016年1月",
        isActive: true
    },
    {
        date: "2016年2月",
        isActive: false
    },
    {
        date: "2016年3月",
        isActive: false
    },
    {
        date: "2016年4月",
        isActive: false
    },

]


new Vue({
    el: '#app',
    data(){
        return {
            active: 'tab-day',
            datePickerData: dateArr,
            lineOptions: lineOptions,
            datePickerStyle: {
                marginLeft: '2rem',
                transition: 'all 0.2s ease-in'
            },
            dateActiveIndex: 0,
            dragState: {
                startX: 0,
                endX: 0
            }
        }
    },
    mounted(){

    },
    methods: {
        chooseTab: function (tab) {
            this.active = tab;
        },
        swipeStart: function (event) {
            this.dragState.startX = event.changedTouches[0].clientX;
        },
        slideLeft: function () {
            if (this.dateActiveIndex > 0) {
                this.dateActiveIndex = this.dateActiveIndex - 1;
                this.datePickerStyle.marginLeft = (parseInt(this.datePickerStyle.marginLeft.replace('rem', '')) + 2.8) + 'rem',

                    this.datePickerData[this.dateActiveIndex + 1].isActive = false;
                this.datePickerData[this.dateActiveIndex].isActive = true;
            }
        },
        slideRight: function () {
            if (this.dateActiveIndex < this.datePickerData.length - 1) {
                this.dateActiveIndex = this.dateActiveIndex + 1;
                this.datePickerStyle.marginLeft = (parseInt(this.datePickerStyle.marginLeft.replace('rem', '')) - 2.5) + 'rem',
                    this.datePickerData[this.dateActiveIndex - 1].isActive = false;
                this.datePickerData[this.dateActiveIndex].isActive = true;
            }
        },
        swipeEnd: function (event) {
            this.dragState.endX = event.changedTouches[0].clientX;

            let moveX = this.dragState.endX - this.dragState.startX;

            if (moveX > 0 && Math.abs(moveX) > 100) {
                this.slideLeft();
            }
            if (moveX < 0 && Math.abs(moveX) > 100) {
                this.slideRight();
            }
        }

    }
});