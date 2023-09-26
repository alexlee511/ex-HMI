<template>
    <div class="DEVICESETTING_CONTENT">  
        <div class="slaveM" :style='stylerSize(100,25,0,0)'>
            <span class="slaveL _40" :style='stylerSize(15,8,5,6)'>{{ $t("GENERAL.CUSTOM_NAME") }}:</span>
            <input class="slaveL _40" :style='stylerSize(40,30,5,37)' maxlength="20" v-model="deviceName" />
            
            <div class="slaveL _40" :style='stylerSize(15,8,58,38)'  v-if="checkException">
                <button @click="goOtherPage" >
                    {{ $t("GENERAL.ADVANCED_SETTING") }}
                </button>
            </div>
        </div>
        
        <div class="slaveM" :style='stylerSize(100,25,0,25)'>

            <span class="slaveL _40" :style='stylerSize(15,8,5,0)'>{{ $t("GENERAL.DEVICE_KIND") }}:</span>
            <select class="slaveL _40" :style='stylerSize(40,30,5,30)' v-model="deviceKind" :disabled="paramId">
                <option v-for="(item, key) in devKindList" :value="item" :key="key">
                    {{ translation(item) }}
                </option>
            </select>
            
            <span class="slaveL _40" :style='stylerSize(15,8,58,0)'>{{ $t("GENERAL.DEVICE_TYPE") }}:</span>
            <select class="slaveL _40" :style='stylerSize(35,30,58,30)' v-model="deviceTypeText" @change="changeDeviceTypeText" :disabled="paramId">
                <option v-for="(item, index) in devTypeList" :key="index">
                    {{ item }}
                </option>
            </select>
        </div>

        <div class="slaveM" :style='stylerSize(100,25,0,50)'>
            
            <span class="slaveL _40" :style='stylerSize(15,8,5,0)'>{{ $t("GENERAL.DEVICE_CONNECT_MODE") }}:</span>
            <select class="slaveL _40" :style='stylerSize(25,30,5,30)' v-model="deviceConnect">
                <option v-for="(item, index) in modbus" :key="index">
                    {{ item }}
                </option>
            </select>
            
            <span class="slaveL _40" :style='stylerSize(15,8,37,0)'>{{ $t("GENERAL.MODBUS_SLAVE") }}:</span>
            <input class="slaveL _40" :style='stylerSize(15,30,37,30)' maxlength="3" v-onlyNum="{ overNum: '255', model: 'deviceSlave' }" v-model="deviceSlave" />
            
            <span class="slaveL _40" :style='stylerSize(15,8,58,0)'>{{ $t("GENERAL.DEVICE_ID") }}:</span>
            <input class="slaveL _40" :style='stylerSize(30,30,58,30)' maxlength="20" v-model="deviceID" :disabled="paramId" :class="{ disabled: paramId }" />

        </div>

        <div class="slaveM" :style='stylerSize(100,25,0,75)'>

            <span class="slaveL _40" :style='stylerSize(15,8,5,0)' v-if="deviceConnect === 'Modbus-TCP'">IP:</span>
            <input class="slaveL _40" :style='stylerSize(30,30,5,30)' maxlength="15" v-model="deviceIP" v-if="deviceConnect === 'Modbus-TCP'"/>

            <span class="slaveL _40" :style='stylerSize(15,8,58,0)' v-if="deviceConnect === 'Modbus-TCP'">PORT:</span>
            <input class="slaveL _40" :style='stylerSize(30,30,58,30)' v-onlyNum="{ overNum: '65535', model: 'devicePort' }" maxlength="5" v-model="devicePort" v-if="deviceConnect === 'Modbus-TCP'"/>
            
            <span class="slaveL _40" :style='stylerSize(15,8,5,0)' v-if="deviceConnect === 'Modbus-RTU'">介面:</span>
            <select class="slaveL _40" :style='stylerSize(22,30,5,30)' v-model="deviceIntreface" v-if="deviceConnect === 'Modbus-RTU'">
                <option v-for="(item, index) in rtuList" :key="index">
                    {{ item }}
                </option>
            </select>

        </div>
    </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
import { getGetewayInfo } from "network/module";
import { update_temp, get_temp_obj } from "common/constant/genplc";
import exceptionChangeMixn from "./exceptionChangeMixn";
import otherConfigStoreMixin from "../mixin/otherConigStoreMixin";
import { typeToKind } from "common/constant/type"
import { module_filter } from "./module_filter"

export default {
    name: "deviceList",
    components: {},
    data() {
        return {
            initlist: [], //初始表單
            modbus: ["Modbus-TCP", "Modbus-RTU"],
            paramId: this.$route.query.devId,
            getewayID: "",

            // 同步輸入資料
            deviceName: "",
            deviceTypeText: "",
            deviceConnect: "",
            deviceID: "",
            deviceSlave: "",
            deviceIP: "",
            devicePort: "",
            deviceIntreface: "",

            deviceKind: "",

            // 呈現的表單
            devKindList: [],
            modulesList: [],
            isIOController: false,
            ioControllerSubList: [],
            isCreate: true,
            moduleAdvanceInfo: {},
            advanceSettings: [],
            hasAdvanced: false,
        };
    },
    mixins: [exceptionChangeMixn, otherConfigStoreMixin],
    async created() {
        //更新樣板
        await update_temp();
        // 判斷有沒有加載動態模塊
        if (!this.configData) {
            this.handleConfigData(this.$data);
            // 判斷有沒有儲存裝置資料
            if (!this.isGetInfo) {
                await this.$store.dispatch("configInfo/getConfigList").then(() => {
                    this.setInit();
                });
            } else {
                this.setInit();
            }
            this.getGetewayIDAndEnableModule();
        } else {
            for (let key in this.configData) {
                this[key] = this.configData[key];
            }
        }
        console.log(this.moduleAdavanceList)
    },
    async mounted() {
        this.$bus.$on("configLoad", () => {
            if (this.deviceID.length !== 20) return alert("ID must be at least 20 characters");
            if (this.checkSpace) {
                //對資料進行暫存
                if (this.paramId) {
                    //如果是修改
                    if (this.otherData) {
                        if (this.isIOController) {
                            let isNoItemChecked = true;
                            for (let item of this.otherData.data.subList) {
                                if (item.status) isNoItemChecked = false;
                            }
                            if (isNoItemChecked) return alert("未設定進階設定");

                            this.uploadInfo.isIOController = this.isIOController;
                            this.uploadInfo.otherData = this.otherData;
                        } else {
                            let isAdvancedSetted = true;
                            let list = this.otherData.data.filter((item) => item.type == 1).map((item) => item.values);
                            for (let item of list) {
                                if (item.length <= 1) {
                                    isAdvancedSetted = false;
                                    break;
                                }
                            }
                            if (isAdvancedSetted) {
                                this.uploadInfo.otherData = this.otherData;
                            } else {
                                return alert("未設定進階設定");
                            }
                        }
                    }

                    if (this.deviceIP !== "" && !this.checkDeviceIP) {
                        return alert("IP address format error.");
                    }

                    this.$store.commit("configInfo/changeTrueList", this.uploadInfo);
                    this.$store.unregisterModule("otherConfigModule");
                    this.$router.back();
                } else {
                    //如果是新增
                    if (this.checkSameID) {
                        if (this.deviceID.substring(2, 4) !== this.returnTypeNo) {
                            alert("Model does not match ID");
                            return;
                        }

                        // 如果有例外設定 判斷例外設定的模組和一般設定的模組
                        if (this.isIOController) {
                            if (this.otherData) {
                                let isNoItemChecked = true;
                                for (let item of this.otherData.data.subList) {
                                    if (item.status) isNoItemChecked = false;
                                }
                                if (isNoItemChecked) return alert("未設定進階設定");

                                this.uploadInfo.isIOController = this.isIOController;
                                this.uploadInfo.otherData = this.otherData;
                            } else {
                                return alert("未設定進階設定");
                            }
                        } else {
                            if (this.checkException) {
                                if (this.otherData) {
                                    let isAdvancedSetted = true;
                                    let list = this.otherData.data.filter((item) => item.type == 1).map((item) => item.values);
                                    for (let item of list) {
                                        if (item.length <= 1) {
                                            isAdvancedSetted = false;
                                            break;
                                        }
                                    }
                                    if (isAdvancedSetted) {
                                        this.uploadInfo.otherData = this.otherData;
                                    } else {
                                        return alert("未設定進階設定");
                                    }
                                } else {
                                    return alert("未設定進階設定");
                                }
                            }
                        }

                        if (this.deviceIP !== "" && !this.checkDeviceIP) {
                            return alert("IP address format error.");
                        }

                        this.$store.commit("configInfo/addTrueList", this.uploadInfo);
                        this.$store.unregisterModule("otherConfigModule");
                        this.$router.back();
                    } else {
                        alert("repeat ID");
                    }
                }
            } else {
                alert("Data missing");
            }
        });
        this.$bus.$on("previousPage", () => {
            this.$store.unregisterModule("otherConfigModule");
        });
    },
    beforeDestroy() {
        this.$bus.$off("configLoad");
        this.$bus.$off("previousPage");
    },
    computed: {
        ...mapState({
            isGetInfo: (state) => state.configInfo.isGetInfo, // 獲取狀態
            trueList: (state) => state.configInfo.trueList, // 裝置清單
            nameList: (state) => state.configInfo.nameList, // 名稱清單
            typeList: (state) => state.configInfo.typeList, // 型號清單
            exceptionList: (state) => state.configInfo.exceptionList,
            typeToModule: (state) => state.configInfo.typeToModule,
            rtuList: (state) => state.configInfo.rtuList,
            moduleAdavanceList: (state) => state.configInfo.moduleAdavanceList,

            configData: (state) => state.otherConfigModule.configData,
            otherData: (state) => state.otherConfigModule.otherData,
            childDev: (state) => state.otherConfigModule.childDev,
        }),
        ...mapGetters("configInfo", [
            //清單合併
            "allList",
        ]),
        deviceType() {
            return (this.typeToModule[this.deviceTypeText] && this.typeToModule[this.deviceTypeText].substring(3)) || this.deviceTypeText;
        },
        devTypeList() {
            const type = this.getKeyByValue(this.deviceKind);
            const list = this.modulesList.filter((item) => {
                // 能被選取的模組
                return item.enable === "yes" && item.type === type;
            });
            const newArr = [];
            for (let item of list) {
                const modulesname = item.type + "-" + item.name;
                const mlist = Object.entries(this.typeToModule).find(item => {
                    return item[1] === modulesname;
                });
                if(mlist) newArr.push(mlist[0]);
                else newArr.push(item.name);
            }
            return newArr;
        },
        checkSpace() {
            //檢查是否有空欄位
            if (this.deviceConnect === "Modbus-RTU") {
                if (this.deviceName && this.deviceType && this.deviceConnect && this.deviceID && this.deviceSlave && this.deviceIntreface) {
                    return true;
                } else {
                    return false;
                }
            } else if (this.deviceConnect === "Modbus-TCP") {
                if (this.deviceName && this.deviceType && this.deviceConnect && this.deviceID && this.deviceSlave && this.deviceIP && this.devicePort) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        },
        uploadInfo() {
            if (this.deviceConnect === "Modbus-RTU") {
                let obj = {};
                obj.deviceName = this.deviceName;
                obj.deviceType = this.deviceType;
                obj.deviceConnect = this.deviceConnect;
                obj.deviceID = this.deviceID;
                obj.deviceSlave = this.deviceSlave;
                obj.deviceIntreface = this.deviceIntreface;
                return obj;
            } else {
                let obj = {};
                obj.deviceName = this.deviceName;
                obj.deviceType = this.deviceType;
                obj.deviceConnect = this.deviceConnect;
                obj.deviceID = this.deviceID;
                obj.deviceSlave = this.deviceSlave;
                obj.deviceIP = this.deviceIP;
                obj.devicePort = this.devicePort;
                return obj;
            }
        },
        returnTypeNo() {
            const dev = this.typeToModule[this.deviceTypeText]?.substr(3) || this.deviceTypeText;
            return this.modulesList.find((x) => x.name === dev)?.type;
        },
        checkSameID() {
            for (let item of this.trueList) {
                if (this.deviceID === item.dev_id) {
                    return false;
                }
            }
            return true;
        },
        checkException() {
            let kind = this.deviceKind;
            let moduleName = this.typeToModule[this.deviceTypeText];
            let subList = get_temp_obj(this.deviceType);
            this.isIOController = false;
            this.ioControllerSubList = [];
            if (subList.length == 0) {
                let tmp = this.moduleAdavanceList[moduleName]
                if(tmp == undefined){
                    let name = this.deviceTypeText ;
                    let type = '' ;
                    for(let ltem of this.modulesList){
                        if(ltem.name == name){
                            type = ltem.type ;
                            break;
                        }
                    }
                    tmp = this.moduleAdavanceList[type + '-' + name ];
                }
                this.moduleAdvanceInfo = tmp;
                return this.moduleAdvanceInfo;
            } else {
                this.isIOController = true;
                this.ioControllerSubList = subList;
                return true;
            }
        },
        checkDeviceIP() {
            const regex = /^(?:25[0-5]|2[0-4]\d|[0-1]?\d{1,2})(?:\.(?:25[0-5]|2[0-4]\d|[0-1]?\d{1,2})){3}$/;
            let m;
            let result = false;
            if ((m = regex.exec(this.deviceIP)) !== null) {
                // The result can be accessed through the `m`-variable.
                m.forEach((match, groupIndex) => {
                    result = true;
                    return;
                });
            }
            return result;
        },
    },
    methods: {
        ...mapMutations({
            handleConfigData: "otherConfigModule/handleConfigData",
            handleOtherData: "otherConfigModule/handleOtherData",
            handleExceptionList: "configInfo/handleExceptionList",
            handleExceptionNameConfig: "configInfo/handleExceptionNameConfig",
        }),
        ...mapActions("configInfo", ["getConfigList"]),
        changeDeviceTypeText() {
            this.handleOtherData(null);
        },
        getKeyByValue(value) {
            return typeToKind(value);
        },
        goOtherPage() {
            this.handleConfigData(this.$data);
            const query = {
                module: this.deviceType,
                type: this.deviceTypeText,
            };
            if (this.paramId) {
                query["devId"] = this.paramId;
            }
            this.$router.push({
                path: "/changeConfig/deviceList/OtherConfig",
                query,
            });
        },
        setInit() {
            //清單初始化
            for (let item of this.allList) {
                if (item.dev_id === this.paramId) {
                    this.isCreate = "isAddInfo" in item;
                    this.deviceName = item.devName;

                    // 判斷類型
                    this.handleGetExceptionConfig(item.dev_id.substring(2, 4) + "-" + item.name);

                    if (this.checkException) {
                        if (this.isIOController) {
                            this.handleOtherData(item.otherData);
                        }
                    }

                    this.deviceID = item.dev_id;
                    this.deviceSlave = item.slave_id;
                    if (item.interface?.split(",").length < 3) {
                        this.deviceConnect = "Modbus-RTU";
                        this.deviceIntreface = item.interface;
                    } else {
                        this.deviceConnect = "Modbus-TCP";
                        this.deviceIP = item.addr;
                        this.devicePort = item.port;
                    }
                    return;
                }
            }
        },
        getGetewayIDAndEnableModule() {
            getGetewayInfo().then((res) => {
                this.getewayID = res.gw_id.substring(4);
                this.getewayID = this.getewayID.substring(0, this.getewayID.length - 2);

                // 透過型號找到所有類型過濾選擇
                this.modulesList = res.modules.filter(item => {
                    return !module_filter(item.type, item.name) && item.enable === 'yes';
                });
                const modules = this.modulesList.map((x) => x.type).filter((item, index, arr) => arr.indexOf(item) === index);
                for (let module of modules) {
                    if(typeToKind(module))
                        this.devKindList.push(typeToKind(module));
                }
            });
        },
        inputNum($event, model) {
            this[model] = $event.target.value.replace(/[^\d]/g, "");
        },
        updateDeviceIdAndName() {
            if (!this.paramId) {
                if (this.deviceType !== "" && this.deviceSlave !== "" && this.returnTypeNo) {
                    let slaveId = ("00" + this.deviceSlave).substr(this.deviceSlave.length);
                    this.deviceID = "IN" + this.returnTypeNo + this.getewayID + slaveId;
                }
            }
        },
    },
    watch: {
        deviceKind(value, oldValue) {
            if (oldValue != "") {
                this.deviceTypeText = "";
                this.advanceSettings = [];
            }
        },
        deviceTypeText(value, oldValue) {
            if (oldValue != "") {
                this.advanceSettings = [];
            }
            this.updateDeviceIdAndName();
        },
        deviceSlave(value, oldValue) {
            this.updateDeviceIdAndName();
        },
        deviceID(value, oldValue) {
            if (this.deviceName === oldValue) {
                this.deviceName = value;
            }
        },
    },
};
</script>

<style scoped>
select {
    margin: 0;
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    /* -webkit-writing-mode: horizontal-tb !important; */
    text-rendering: auto;
    color: -internal-light-dark(black, white);
    letter-spacing: normal;
    word-spacing: normal;
    text-transform: none;
    text-indent: 0px;
    text-shadow: none;
    display: inline-block;
    text-align: start;
    appearance: menulist;
    box-sizing: border-box;
    align-items: center;
    white-space: pre;
    -webkit-rtl-ordering: logical;
    background-color: -internal-light-dark(rgb(255, 255, 255), rgb(59, 59, 59));
    cursor: default;
    margin: 0em;
    /* font: 400 13.3333px Arial; */
    border-radius: 0px;
    border-width: 1px;
    border-style: solid;
    border-color: -internal-light-dark(rgb(118, 118, 118), rgb(195, 195, 195));
    border-image: initial;
}
input {
    margin: 0;
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
}
.DEVICESETTING_CONTENT {
    display: flex;
    color: #ffffff;
    font-weight: bold;
    height: 80vh;
    width: 90vw;
    margin: auto;
    flex-direction: column;
    justify-content: space-evenly;
    font-size: 2.5vw;
    line-height: 1.5;
}

.DEVICESETTING_CONTENT input {
    background-color: #9bebff;
    color: #000000;

    font-weight: bold;
    border-radius: 2px;
    border-width: 0px;
}

.DEVICESETTING_CONTENT button {
    background: linear-gradient(rgba(1, 255, 255, 0.8), rgba(33, 96, 184, 0.8));
    border-width: 0px;
    color: #ffffff;

    font-weight: bold;
    border-radius: 1vw;
}

.DEVICESETTING_CONTENT select {
    background: linear-gradient(rgba(1, 255, 255, 0.8), rgba(33, 96, 184, 0.8));
    background-color: rgba(33, 96, 184, 0.8);
    border-width: 0px;
    color: #ffffff;

    font-weight: bold;
    border-radius: 2px;
}

.DEVICESETTING_CONTENT input[type="checkbox"] {
    width: 4vmin;
    height: 4vmin;
}

.DEVICESETTING_CONTENT input[type="radio"] {
    width: 4vmin;
    height: 4vmin;
}

.row-no-padding > [class*="col-"] {
    padding-left: 0 !important;
    padding-right: 0 !important;
}
.disabled {
    color: rgb(100, 100, 100) !important;
}
</style>
