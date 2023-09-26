export default {
  data() {
    return {
      nowDay: "",
      nowTime: "",
      copyrigt: ""
    };
  },
  methods: {
    // 得到當下時間
    timeFormate(timeStamp) {
      let newdate = new Date(timeStamp);
      let week = ["日", "一", "二", "三", "四", "五", "六"];
      let year = newdate.getFullYear();
      let month =
        newdate.getMonth() + 1 < 10
          ? "0" + (newdate.getMonth() + 1)
          : newdate.getMonth() + 1;
      let date =
        newdate.getDate() < 10 ? "0" + newdate.getDate() : newdate.getDate();
      let hh =
        newdate.getHours() < 10 ? "0" + newdate.getHours() : newdate.getHours();
      let mm =
        newdate.getMinutes() < 10
          ? "0" + newdate.getMinutes()
          : newdate.getMinutes();
      let ss =
        newdate.getSeconds() < 10
          ? "0" + newdate.getSeconds()
          : newdate.getSeconds();

      this.nowTime = hh + ":" + mm + ":" + ss;
      this.nowDay = year + " / " + month + " / " + date;
    },
    reloadToIndex() {
      
    },
  },
  mounted() {
    this.timeFormate(new Date());
    this.timer = setInterval(() => {
      this.timeFormate(new Date());
    }, 1000);
  },
  computed: {
    copyright() {
      return this.$store.getters.getCopyRight
    },
    preview() {
      if (this.$store.state.backData.footerIcon !== "") {
        return this.$store.state.backUrl + this.$store.state.backData.footerIcon ;
        // this.preview = this.$store.state.backData[this.title]
      } else {
        return require("@/assets/images/logo_2.png")
      }
    }
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
}