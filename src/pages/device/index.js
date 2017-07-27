import Vue from 'vue';
import Mint from 'mint-ui';
import Checkbox from '../../../lib/component/checkbox';
import Resource from 'vue-resource';
import util from '../../../lib/util/util';


Vue.use(Mint);
Vue.use(Resource);

Vue.component('i-checkbox', Checkbox);


import './index.scss';

new Vue({
    el: '#app',
    data() {
        return {
            deviceConnectDialog: false,
            deviceConnect: false,
            bundleStatus: false,
            loadClass: '',
            value: false,
            headerStatus: false,
            deviceList: [],
            reEquipmentName: '',
            openId: null,
            deviceInfo: {
                shelfLife: 0,
                electricQuantity: 0,
                sputtering: false,
                patternId: 0,
                equipmentName: '',
                equipmentNum: '',
                equipmentId: 0,
                remindTime: 0,
                remindTimeName: '关闭',
                lastDayNum: 0
            },
            form: {
                equipmentId: 0,
                patternName: '新增模式',
                hydraulicPressure: 40,
                frequency: 0
            },
            patternList: [],
            useStatus: false,
            customAddStatus: false,
            deleteStatus: false,
            clockStatus: false,
            deviceStatus: false,
            settingStatus: false
        }
    },
    methods: {
        showHeader() {
            this.headerStatus = !this.headerStatus;
        },
        addCustom() {
            this.customAddStatus = true;
            this.deleteStatus = false;
        },
        dialogCustomClose() {
            this.customAddStatus = false;
        },
        dialogClockClose() {
            this.clockStatus = false;
        },
        setClock() {
            this.checkBlueTooth(() => {
                this.clockStatus = !this.clockStatus
            }, () => {
                this.openDeviceConnectDialog()
            });
        },
        deleteCustom() {
        
            this.deleteStatus = !this.deleteStatus;
        },
        dialogDeviceClose() {
            this.deviceStatus = false;
        },
        setDeviceName() {
            window.location.href = 'equipment.html?equipmentName=' + this.deviceInfo.equipmentName + '&equipmentId=' + this.deviceInfo.equipmentId + '&openId=' + this.openId + '&equipmentNum=' + this.deviceInfo.equipmentNum
        },
        closeDeviceConnectDialog() {
            this.deviceConnectDialog = false

        },
        openDeviceConnectDialog() {

            this.deviceConnectDialog = true

        },
        goDetail() {
            this.checkBlueTooth(() => {
                window.location.href = 'detail.html?equipmentId=' + this.deviceInfo.equipmentId + '&openId' + this.openId;
            }, () => {
                this.openDeviceConnectDialog()
            });


        },

        getShareData() {
            let url =
                "/Brush/admin/sharepage?url=" +
                encodeURIComponent(window.location.href);
            this.$http.get(url).then(
                response => {
                    let data = response.body.result;
                    console.log(data);

                    wx.config({
                        debug: false,
                        appId: data.appId,
                        timestamp: data.timestamp,
                        nonceStr: data.nonceStr,
                        signature: data.signature,
                        beta: true,
                        jsApiList: [
                            'openWXDeviceLib',
                            'onMenuShareTimeline',
                            'onMenuShareAppMessage',
                            'getWXDeviceInfos',
                            'closeWXDeviceLib'
                        ]
                    });

                    setTimeout(() => {
                        this.checkBlueTooth();
                    }, 300)



                },
                err => {
                    console.log(err);
                }
            );
        },

        checkBlueTooth(success, error) {
            // alert('0')
            // wx.ready(() => {
            wx.invoke('openWXDeviceLib', {
                'brandUserName': 'gh_9002006202f2'
            }, function (res) {
                //alert(res.err_msg+"  "+res.bluetoothState);
            });
            // alert('1')
            wx.invoke('getWXDeviceInfos', {}, (res) => {
                // alert('2')
                if (res.err_msg == "getWXDeviceInfos:ok") {
                    if (res.deviceInfos.length > 0) {

                        // alert(res.deviceInfos[0].state)
                        if (res.deviceInfos[0].state == "connected") {
                            //"设备已连接"
                            // alert("设备已连接")
                            this.deviceConnect = true;
                            success();
                        } else {
                            //    this.deviceConnect = false;
                            //    alert("设备未连接")
                            error();
                        }
                    } else {
                        // this.deviceConnect = false;
                        // alert("您当前暂时没有绑定的设备");
                        error();
                    }
                }

            });
            // })

        },
        getDeviceList(obj) {
            if (!obj.openId) {
                return;
            }
            let url = '/Brush/weixin/MyEquipment/queryEquipmentInfo?' + util.getParam(obj) + '&code=' + util.getQueryString('code');
            this.$http.post(url).then(res => {
                if (res.data.isSuccess) {

                    this.deviceList = res.data.result.equipmentInfos;
                    if (this.deviceInfo.equipmentId == 0) {
                        this.getDevice({
                            id: this.deviceList[0].id
                        });
                    }
                    console.log(this.deviceList)
                    if (this.deviceList.length <= 0) {
                        this.bundleStatus = true;
                    }
                }
            });
        },
        getDevice(obj) {
            if (!obj.id) {
                return
            }
            let url = '/Brush/weixin/MyEquipment/selectEquipmentInfo?' + util.getParam(obj);
            this.$http.post(url).then(res => {
                if (res.data.isSuccess) {
                    const data = res.data.result;
                    this.deviceInfo.shelfLife = data.equipmentInfo.shelfLife;
                    this.deviceInfo.electricQuantity = data.equipmentInfo.electricQuantity;
                    this.deviceInfo.sputtering = data.equipmentInfo.sputtering;
                    this.deviceInfo.patternId = data.equipmentInfo.patternId;
                    this.deviceInfo.equipmentName = data.equipmentInfo.equipmentName;
                    this.deviceInfo.equipmentId = data.equipmentInfo.id;
                    this.deviceInfo.equipmentNum = data.equipmentInfo.equipmentNum
                    this.deviceInfo.remindTime = data.equipmentInfo.remindTime;
                    this.deviceInfo.remindTimeName = this.setRemind(this.deviceInfo.remindTime);
                    this.form.equipmentId = data.equipmentInfo.id;
                    this.patternList = data.patternInfos;
                    this.headerStatus = false;
                    this.setEquipmentData();
                    setInterval(() => {
                        this.getelectricQuantity();
                    }, 3000)
                }
            });
        },
        getelectricQuantity() {
            let url = '/Brush/weixin/MyEquipment/electricQuantity?equipmentId=' + this.deviceInfo.equipmentId + '&openId=' + this.openId;

            this.$http.get(url).then(res => {
                this.deviceInfo.electricQuantity = res.data.result.electricQuantity

            });
        },

        setEquipmentData() {

            let url0 = '/Brush/weixin/equipmentSprayer/queryEquipmentSprayer?equipmentId=' + this.deviceInfo.equipmentId;

            this.$http.post(url0).then(res => {
                this.deviceInfo.lastDayNum = res.data.result.lastDayNum

            });
            let url1 = '/Brush/comparingTime?equipmentNum=' + this.deviceInfo.equipmentNum + '&openId=' + this.openId;
            this.$http.post(url1).then(res => {
                let url2 = '/Brush/battery?equipmentNum=' + this.deviceInfo.equipmentNum + '&openId=' + this.openId;
                this.$http.post(url2).then(res => {

                    let url3 = '/Brush/insertUserRecord?equipmentNum=' + this.deviceInfo.equipmentNum + '&openId=' + this.openId;
                    this.$http.post(url3).then(res => {

                    });

                });
            });
        },

        addPattern() {
            if (!this.form.patternName) {
                alert('请填写模式名称!');
                return;
            }
            let url = '/Brush/weixin/myPattern/addDefinePattern?' + util.getParam(this.form);
            this.$http.post(url).then(res => {
                if (res.data.isSuccess) {
                    this.customAddStatus = false;
                    const obj = this.form;
                    this.patternList.push({
                        equipmentId: obj.equipmentId,
                        patternName: obj.patternName,
                        hydraulicPressure: obj.hydraulicPressure,
                        frequency: obj.frequency,
                        id: res.data.result.id
                    });
                    this.form.patternName = '';
                    this.form.hydraulicPressure = 40;
                    this.form.frequency = 0
                }
            });
        },
        deletePattern(id, index) {
            var obj = {
                equipmentId: this.form.equipmentId,
                deleteId: id,
                updateId: 0
            }
            if (this.deviceInfo.patternId == id) {
                if (this.patternList.length <= 1 || index == 0) {
                    obj.updateId = 1
                } else {
                    obj.updateId = this.patternList[index - 1].id;
                }
            }
            let url = '/Brush/weixin/myPattern/deleteDefinePattern?' + util.getParam(obj);
            this.$http.post(url).then(res => {
                if (res.data.isSuccess) {
                    if (obj.updateId != 0) {
                        this.deviceInfo.patternId = obj.updateId;
                    }
                    this.patternList.splice(index, 1);
                }
            });

        },
        choosePattern(id) {
            if (!id) {
                return;
            }
            this.checkBlueTooth(() => {
                this.settingStatus = !this.settingStatus;
                let url = '/Brush/weixin/myPattern/selectPattern?id=' + id + '&equipmentId=' + this.deviceInfo.equipmentId;
                this.$http.post(url).then(res => {
                    if (res.data.isSuccess) {
                        setTimeout(() => {
                            this.settingStatus = false;
                        }, 1000)

                        this.deviceInfo.patternId = id;

                        let url4 = '/Brush/pattern?openId=' + this.openId + '&equipmentNum=' + this.deviceInfo.equipmentNum + '&id=' + id;
                        this.$http.post(url4).then(res => {

                        });
                    }
                }, err => {
                    setTimeout(() => {
                        this.settingStatus = false;
                    }, 1000)
                });

            }, () => {


                this.openDeviceConnectDialog()


            });




        },
        setRemindTime() {
            let obj = {
                id: this.deviceInfo.equipmentId,
                remindTime: this.deviceInfo.remindTime,
                isRemind: false
            }

            if (obj.remindTime != 0) {
                obj.isRemind = true;
            }

            let url = '/Brush/weixin/MyEquipment/updateEquipmentRemindTime?' + util.getParam(obj);

            this.$http.post(url).then(res => {
                if (res.data.isSuccess) {
                    this.clockStatus = false;
                    this.deviceInfo.remindTimeName = this.setRemind(this.deviceInfo.remindTime);
                }
            });
        },
        setRemind(kind) {
            kind = parseInt(kind);
            let str = '';
            switch (kind) {
                case 0:
                    str = '关闭';
                    break;
                case 1:
                    str = '15秒';
                    break;
                case 2:
                    str = '30秒';
                    break;
                case 3:
                    str = '60秒';
                    break;
            }
            return str;
        },
        setSputtering(status) {
            console.log(status)
            this.checkBlueTooth(() => {
                let obj = {
                    id: this.deviceInfo.equipmentId,
                    sputtering: status
                }
                let url = '/Brush/weixin/MyEquipment/updateEquipmentSputtering?' + util.getParam(obj);
                this.$http.post(url).then(res => {
                    this.deviceInfo.sputtering = status;
                }, (err) => {
                    this.deviceInfo.sputtering = !status;
                });
            }, () => {
                this.openDeviceConnectDialog()
                setTimeout(() => {
                    this.deviceInfo.sputtering = !status;
                }, 300)
            });
        },
        setEquipmentName() {
            let obj = {
                id: this.deviceInfo.equipmentId,
                equipmentName: this.reEquipmentName
            }
            let url = '/Brush/weixin/MyEquipment/updateEquipmentName?' + util.getParam(obj);
            this.$http.post(url).then(res => {
                if (res.data.isSuccess) {
                    this.deviceStatus = false;
                    this.deviceInfo.equipmentName = this.reEquipmentName
                }
            });
        },
        getOneDevice(obj) {

            let url = '/Brush/weixin/MyEquipment/queryOneEquipmentInfo?' + util.getParam(obj);
            this.$http.get(url).then(res => {
                this.loadClass = 'hide'
                this.openId = res.body.result.equipmentInfo.openId;
                this.getDeviceList({
                    openId: this.openId
                });
            }, err => {
                this.loadClass = 'hide'
                 this.bundleStatus = true;
        });
        },
        closeBundleDialog() {
            this.bundleStatus = false;
        },
        goToBundle() {
            location.href = 'http://weixin.vtooth.com/pages/bangding/bangding.html'
        }
    },
    mounted() {

        this.getOneDevice({
            code: util.getQueryString('code')
        })
        this.getShareData()

    }
});