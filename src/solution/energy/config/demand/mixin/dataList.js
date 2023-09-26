export default {
    data() {
      return {
        valueList: [
          //數值設定
          {
            key: "contractCap_value",
            translation: this.$t("GENERAL.ATTR_CONTRACT_CAPACITY"),
          },
          {
            key: "alarmValue_value",
            translation: this.$t("GENERAL.ATTR_ALARM_VALUE"),
          },
          {
            key: "offloadValue_value",
            translation: this.$t("GENERAL.ATTR_UNLOAD_VALUE"),
          },
          {
            key: "resetValue_value",
            translation: this.$t("GENERAL.ATTR_RETURN_VALUE"),
          },
        ],
        sourceSelect: [
          //來源判斷
          {
            text: this.$t("GENERAL.CURRENT_DEMAND"),
            value: "1",
          },
          {
            text: this.$t("GENERAL.DEMAND_PRED"),
            value: "0",
          },
        ],
        alarmList: [
          //警報設定
          {
            text: this.$t("GENERAL.SYSTEM_ALARM"),
            src: require("@/assets/images/guard_lamp.png"),
            value: "systemAlarm",
          },
          {
            text: this.$t("GENERAL.ENTITY_ALARM"),
            src: require("@/assets/images/guard_lamp_r.png"),
            value: "entityAlarm",
          },
        ],
        demandUnload: [
          //卸載模式
          {
            text: this.$t("GENERAL.DEMAND_UNLOAD_MODE_1"),
            value: "1",
          },
          {
            text: this.$t("GENERAL.DEMAND_UNLOAD_MODE_2"),
            value: "2",
          },
          {
            text: this.$t("GENERAL.DEMAND_UNLOAD_MODE_3"),
            value: "3",
          },
          {
            text: this.$t("GENERAL.DEMAND_UNLOAD_MODE_4"),
            value: "4",
          },
        ],
        forecastMode: [
          //需量預測模式
          {
            text: this.$t("GENERAL.DEMAND_PRED_MODE_1"),
            value: "1",
          },
          {
            text: this.$t("GENERAL.DEMAND_PRED_MODE_2"),
            value: "2",
          },
        ],
      };
    },
  };