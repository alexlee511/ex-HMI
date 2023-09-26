<template>
  <div class="LANG_CHANGE">
    <div>
      <span>{{ $t("GENERAL.LANG") }} </span>
      <select
        id="select_lang"
        style="width: 10vw; height: 5vh"
        @change="setLang"
        v-model="lang"
      >
        <option v-for="item in option" :key="item.value" :value="item.value">
          {{ item.selectText }}
        </option>
      </select>
    </div>
  </div>
</template>

<script>
import { setBackData } from "network/solution"
import { setLang } from "common/constant/profile"

export default {
  data() {
    return {
      lang: "",
      index: 0,
      option: [
        {
          value: "TW",
          selectText: "繁體中文",
        },
        {
          value: "EN",
          selectText: "English",
        },
      ],
    };
  },
  methods: {
    setLang(e) {
      let index = e.target.options.selectedIndex;
      this.$store.commit("setLang", this.option[index].value);
      this.$i18n.locale = this.option[index].value.toLowerCase();
      //更新profile裡面的語系設定
      setLang(this.$store.state.backData)
      //寫入BackData資料
      setBackData(this.$store.state.backData)
    },
  },
  mounted() {
    this.lang = this.$store.state.backData.lang;
  },
};
</script>

<style scoped>
.LANG_CHANGE select {
  background: linear-gradient(rgba(1, 255, 255, 0.8), rgba(33, 96, 184, 0.8));
  background-color: rgba(33, 96, 184, 0.8);
  border-width: 0px;
  color: #ffffff;

  font-weight: bold;
  border-radius: 2px;
}
</style>