export default {
  data() {
    return {
      quarterTimer: null,
      reciprocalTime: null
    }
  },
  created() {
    this.quarterTimer = setInterval(() => {
      this.checkQuaterDate()
    }, 1000)
  },
  beforeDestroy() {
    clearInterval(this.quarterTimer)
    this.quarterTimer = null
  },
  methods: {
    checkQuaterDate() {
      var Today = new Date();
      var hours_value = Today.getHours();
      var minutes_value = Today.getMinutes();
      var seconds_value = Today.getSeconds();
      hours_value = (hours_value < 10 ? "0" + hours_value : hours_value);
      minutes_value = (minutes_value < 10 ? "0" + minutes_value : minutes_value);
      seconds_value = (seconds_value < 10 ? "0" + seconds_value : seconds_value);

      var reciprocal_minutes_value = 14 - (Number(minutes_value) % 15);
      var reciprocal_seconds_value = (60 - Number(seconds_value)) % 60;
      if (reciprocal_seconds_value == 0) {
        reciprocal_minutes_value++
      }
      reciprocal_minutes_value = (reciprocal_minutes_value < 10 ? "0" + reciprocal_minutes_value : reciprocal_minutes_value);
      reciprocal_seconds_value = (reciprocal_seconds_value < 10 ? "0" + reciprocal_seconds_value : reciprocal_seconds_value);
      this.reciprocalTime = reciprocal_minutes_value + ":" + reciprocal_seconds_value;
    }
  },
}