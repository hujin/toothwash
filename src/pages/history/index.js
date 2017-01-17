import Vue from 'vue';
import Mint from 'mint-ui';
import Echart from '../../../lib/component/echarts';
import VueResource from 'vue-resource';
import util from '../../../lib/util/util';
Vue.component('Echart', Echart);

Vue.use(Mint);
Vue.use(VueResource);

import './index.scss';

var lineOptions = {

    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data: ['邮件营销'],

    },

    toolbox: {
        feature: {
            saveAsImage: {},
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
            data: ['1', '5', '10', '15', '20', '25', '30'],
            axisLine: {
                lineStyle: {
                    color: '#d2d2d2'
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
                    color: '#d2d2d2'
                }
            }
        },

    ],
    series: [{
        legendHoverLink: false,
        type: 'line',
        smooth:true,
        data: [120, 132, 101, 134, 90, 230, 210],
        itemStyle: {
            normal: {
                areaStyle: {
                    type: 'default',
                    color: 'rgba(255,255,255,0.3)'
                },
                color: '#66bbb4',
                lineStyle: {
                    color: '#66bbb4',
                    width: 2
                }
            }
        },
    }],

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
            dayDatas: [],
            datePickerData: dateArr,
            lineOptions: lineOptions,
            datePickerStyle: {
                marginLeft: '2.6rem',
                transition: 'all 0.2s ease-in'
            },
            dateActiveIndex: 0,
            dragState: {
                startX: 0,
                endX: 0
            },

        }
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
                this.datePickerStyle.marginLeft = (parseInt(this.datePickerStyle.marginLeft.replace('rem', '')) + 2.6) + 'rem',

                    this.datePickerData[this.dateActiveIndex + 1].isActive = false;
                this.datePickerData[this.dateActiveIndex].isActive = true;
            }
        },
        slideRight: function () {
            if (this.dateActiveIndex < this.datePickerData.length - 1) {
                this.dateActiveIndex = this.dateActiveIndex + 1;
                this.datePickerStyle.marginLeft = (parseInt(this.datePickerStyle.marginLeft.replace('rem', '')) - 2.6) + 'rem',
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
        },
        
        getDate: function (time) {
            let date = new Date(time);
            console.log(date.getMonth()+'月'+date.getDate()+'日');
            if (date==new Date()){
                return '今天'
            }else {
                return date.getMonth()+1+'月'+date.getDate()+'日'
            }

        },

        getHours: function (time) {
            let date = new Date(time);

            return date.getHours()+':'+date.getMinutes();
        },

        getMinutes: function (seconds) {

               return parseInt(seconds/60)+'分'+parseInt(seconds%60)+'秒'

        },

        getDayData: function(obj) {
            let url = '/Brush/weixin/allUserRecord/queryFourteenDaysUserRecord?' + util.getParam(obj);
            this.$http.post(url).then((response) =>  {
                console.log(response.body.result)
                this.dayDatas = response.body.result.infos;

            }, (err) => {
                console.log(err)
            });
        },

        getMonthData: function(obj) {
            let url = '/Brush/weixin/allUserRecord/queryEveryMonthUserRecord?' + util.getParam(obj);
            this.$http.post(url).then((response) =>  {
                console.log(response.body.result)
                this.todayHealthData = response.body.result.healthSummary;

            }, (err) => {
                console.log(err)
            });
        },



    },

    mounted(){
        this.getDayData({userId: 1});
        this.getMonthData({userId: 14})
    }

});