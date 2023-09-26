export default {
    data() {
      return {
        quarterTimer: null,
        reciprocalTime: null,
        minutes_value: -1,
        flagQuarterDone: false,
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
  
        let hours_value = Today.getHours();
        hours_value = (hours_value < 10 ? "0" + hours_value : hours_value);
  
        let reciprocal_minutes_value = 0;
        if(this.minutes_value === -1){
            return this.reciprocalTime = " --:--"
            // this.minutes_value = Today.getMinutes();
            // reciprocal_minutes_value = 14 - (this.minutes_value % 15);
        }else{ 
            reciprocal_minutes_value = this.minutes_value;
        }
        
        let seconds_value = Today.getSeconds();
        let reciprocal_seconds_value = (60 - seconds_value) % 60;

        //解決API延遲導致倒數計時顯示錯誤
        if (reciprocal_seconds_value == 0 && reciprocal_minutes_value == 0) {
          reciprocal_minutes_value = 15
          this.flagQuarterDone = true;
        }else if(this.flagQuarterDone && reciprocal_minutes_value == 0){
          reciprocal_minutes_value = 14
        }else if(this.flagQuarterDone && reciprocal_minutes_value == 14){
          this.flagQuarterDone = false;
        }
        
        reciprocal_minutes_value = reciprocal_minutes_value.toString().padStart(2, '0');
        reciprocal_seconds_value = reciprocal_seconds_value.toString().padStart(2, '0');
        this.reciprocalTime = reciprocal_minutes_value + ":" + reciprocal_seconds_value;
      }
    },
  }