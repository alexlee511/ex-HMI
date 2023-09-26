<template>
  <div>
    <div class="block" v-for="(advance, index1) in moduleAdvanceInfo.adv_list" :key="index1">
      <span class="adv-name">{{ advance.adv_name }}</span>
      <div v-if="advance.adv_type == 0">
        <ul id="adv-type-0">
          <li v-for="(item, index2) in advance.set_list" :key="index2">
            <div class="adv-item-title">
              <span class="adv-item-name">{{ item.name }}</span>
              <span class="adv-item-desc" v-if="item.description">({{ item.description }})</span>
            </div>
            <div class="adv-options" v-if="item.mode == 1">
              <span v-for="(range, index3) in item.range" :key="index3">
                <input type="radio" :id="`${advance.adv_key}-${index2}-${index3}`" :value="range.value" v-model="advanceSettings[index1].values[index2].value" />
                <label :for="`${advance.adv_key}-${index2}-${index3}`">{{ range.name }}</label>
              </span>
            </div>
            <div class="adv-options" v-if="item.mode == 2">
              <select v-model="advanceSettings[index1].values[index2].value">
                <option v-for="(range, index3) in item.range" :key="index3" :value="range.value">{{ range.name }}</option>
              </select>
            </div>
            <div class="adv-options" v-if="item.mode == 3">
              <input type="text" v-model="advanceSettings[index1].values[index2].value" @change="onType0InputChange($event, advanceSettings[index1].values[index2])" />
            </div>
          </li>
        </ul>
      </div>
      <div v-if="advance.adv_type == 1">
        <ul id="adv-type-1">
          <li>
            <div class="adv-list-header" v-for="(item, index2) in advance.set_list" :key="index2">
              <span class="adv-item-name">{{ item.name }}</span>
              <span class="adv-item-desc">{{ item.description }}</span>
            </div>
          </li>
          <li v-for="(fieldList, index2) in advanceSettings[index1].values" :key="index2">
            <div class="adv-item-div" v-for="(field, index3) in fieldList" :key="index3">
              <input type="text" v-model="field.value" @change="onType1InputChange($event, advanceSettings[index1], fieldList, field, index2 == advanceSettings[index1].values.length - 1)" />
            </div>
            <div class="delete-button" v-if="index2 != advanceSettings[index1].values.length - 1" @click="onDeleteClick($event, advanceSettings[index1].values, index2)">
              <img src="~assets/images/remove.png" />
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import { Notification } from "element-ui";
import otherConfigStoreMixin from "../../mixin/otherConigStoreMixin";

export default {
  mixins: [otherConfigStoreMixin],
  components: { Notification },
  data() {
    return {
      deviceId: this.$route.query.devId,
    };
  },
  created() {
    console.log(this.moduleAdvanceInfo)
    let deviceInfo = this.deviceList.find((item) => item.dev_id == this.deviceId);
    let advList = this.moduleAdvanceInfo.adv_list;
    let advanceDeviceList = this.moduleAdvanceInfo.device_list;
    let advanceDeviceInfo = advanceDeviceList[this.deviceId];

    if (this.advanceSettings.length > 0) return;

    for (let advance of advList) {
      let advKey = advance.adv_key;
      let advType = advance.adv_type;
      let ranges = advance.set_list.map((item) => item.range);
      let defValues = advance.set_list.map((item) => (item.default_value ? item.default_value : ""));
      let item = { key: advance.adv_key, type: advType, values: [] };

      if (advType == 0) {
        if (deviceInfo && deviceInfo.isChangInfo) {
          let dataList = deviceInfo.otherData.data.filter((item) => item.key == advKey).map((item) => item.values);
          item.values = dataList[0];
        } else {
          if (advanceDeviceInfo) {
            let isKeyExists = advKey in advanceDeviceInfo;
            if (isKeyExists) {
              item.values = advanceDeviceInfo[advKey][0].map((item, index) => {
                return { correct: true, value: item, range: ranges[index], default_value: defValues[index] };
              });
            } else {
              item.values = advance.set_list.map((item) => {
                return { correct: true, value: item.default_value, range: item.range, default_value: item.default_value };
              });
            }
          } else {
            item.values = advance.set_list.map((item) => {
              return { correct: true, value: item.default_value, range: item.range, default_value: item.default_value };
            });
          }
        }
      } else if (advType == 1) {
        if (deviceInfo && deviceInfo.isChangInfo) {
          let dataList = deviceInfo.otherData.data.filter((item) => item.key == advKey).map((item) => item.values);
          item.values = dataList[0];
        } else {
          if (advanceDeviceInfo) {
            item.values = advanceDeviceInfo[advKey].map((item) =>
              item.map((item, index) => {
                return { correct: true, value: item, range: ranges[index], default_value: defValues[index] };
              })
            );

            let newArray = [];
            for (let index in ranges) {
              newArray.push({ correct: false, value: "", range: ranges[index], default_value: defValues[index] });
            }
            item.values.push(newArray);
          } else {
            let dataList = advance.set_list.map((item, index) => {
              return { correct: false, value: defValues[index], range: ranges[index], default_value: defValues[index] };
            });
            item.values.push(dataList);
          }
        }
      }
      this.advanceSettings.push(item);
    }
  },
  mounted() {
    this.$bus.$on("previousPage", () => {
      this.$bus.$emit("getSomeModify", {
        modify: true,
        action: null,
        showConfirm: false,
      });

      if (this.isSetupCorrect) {
        let outpurt = [];
        for(let key of this.advanceSettings){
          let notEmpty = true;
          for(let option of key.values){
            if(option.value.toString().length == 0){
              notEmpty = false;
              break;
            }
          }
          if(notEmpty) outpurt.push(key);
        }

        this.handleOtherData({ type: "advance", data: outpurt });
        this.$router.back();
      } else {
        Notification({ message: this.$t("GENERAL.ERROR_MSG_012") });
      }
    });
  },
  beforeDestroy() {
    this.$bus.$off("previousPage");
  },
  computed: {
    ...mapState({
      deviceList: (state) => state.configInfo.trueList,
      isCreate: (state) => state.otherConfigModule.configData.isCreate,
      moduleAdvanceInfo: (state) => state.otherConfigModule.configData.moduleAdvanceInfo,
      advanceSettings: (state) => state.otherConfigModule.configData.advanceSettings,
    }),
    isSetupCorrect() {
      let result = true;
      for (let setting of this.advanceSettings) {
        let type = setting.type;
        if (type == 1) {
          let size = setting.values.length;

          for (const [index, fieldList] of setting.values.entries()) {
            if (index < size - 1) {
              let filterList = fieldList.filter((field) => field.correct == true);
              if (filterList.length < fieldList.length) {
                result = false;
                break;
              }
            } else {
              let filterList = fieldList.filter((field) => field.value == "" || field.value == null);
              if (filterList.length == fieldList.length) {
                result = true;
              } else {
                result = false;
              }
            }
          }
        }
      }
      return result;
    },
  },
  methods: {
    ...mapMutations({
      handleOtherData: "otherConfigModule/handleOtherData",
    }),
    onType0InputChange(event, field) {
      const regex = new RegExp(field.range, "gm");
      let text = event.target.value;
      let m;

      field.correct = false;

      while ((m = regex.exec(text)) !== null) {
        if (m.index === regex.lastIndex) {
          regex.lastIndex++;
        }

        m.forEach((match, groupIndex) => {
          field.correct = true;
        });
      }

      if (!field.correct) {
        Notification({ message: this.$t("GENERAL.ERROR_MSG_011") });
        field.value = field.default_value;
      }
    },
    onType1InputChange(event, dataList, fieldList, field, isLast) {
      const regex = new RegExp(field.range, "gm");
      let text = event.target.value;
      let m;

      field.correct = false;

      while ((m = regex.exec(text)) !== null) {
        if (m.index === regex.lastIndex) {
          regex.lastIndex++;
        }

        m.forEach((match, groupIndex) => {
          field.correct = true;
        });
      }

      if (!field.correct) {
        Notification({ message: this.$t("GENERAL.ERROR_MSG_011") });
        field.value = field.default_value;
      }

      if (isLast) {
        let correctCounter = 0;
        let newArray = [];
        for (let item of fieldList) {
          if (item.correct) correctCounter++;
          newArray.push({ correct: false, value: "", range: item.range, default_value: item.default_value });
        }

        if (correctCounter == fieldList.length) {
          dataList.values.push(newArray);
        }
      }
    },
    onDeleteClick(event, dataList, index2) {
      dataList.splice(index2, 1);
    },
  },
};
</script>

<style scoped src="../../../../assets/css/otherConfigAdvance.css" />