export default {
  data() {
    return {
      timer: null,
    }
  },
  methods: {
    async recursive(x = 2000) {
      // this.$forceUpdate();
      clearTimeout(this.timer);
      this.timer = null 

      this.timer = setTimeout(async () => {
        let getData = this.getDeviceData;
        await getData()
        getData = null
        await this.recursive();
      }, x);
    },
    clearTimer() {
      clearTimeout(this.timer)
      this.timer = null
      this.timer = setTimeout(async () => {
        console.log(this.IRStatus.power)
        await this.getDeviceData();
        console.log(this.IRStatus.power)
        this.recursive();
        console.log(this.IRStatus.power)
      }, 5000);
    }
  },
  beforeDestroy() {
    clearTimeout(this.timer);
    this.timer = null
  },
}