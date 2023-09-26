<template>
    <datepicker
      :value.sync="date"
      :disabled-dates="disabledDates"
      :format="DatePickerFormat"
      :highlighted="highlighted"
      @input="pickDate"
      ref="datePick"
      calendar-class="calendarCss" input-class="filter__picker_item item" wrapper-class="pickerWrapperCss"
    ></datepicker>
</template>

<script>
import Datepicker from "vuejs-datepicker";
import { formatDate } from "common/utile/utile";

export default {
  props: {
    nextWeek: {
      type: Date,
    },
    firstDay: {
      type: Date,
    },
    big: {
      type: Boolean,
      defaule() {
        return false
      }
    },
    date: {
      type: String,
      default() {
        return formatDate(new Date(), "yyyy-MM-dd")
      }
    }
  },
  components: {
    Datepicker,
  },
  data() {
    return {
      now: "",
      DatePickerFormat: "yyyy-MM-dd",
      disabledDates: !this.big ? {
          to: this.firstDay ? new Date(`${this.today()}`) : this.lastYear(), // Disable all dates up to specific date
          from: this.nextWeek ? new Date() : new Date(), // Disable all dates after specific date
      } : {},
      highlighted: {
        to: this.today(), // Highlight all dates up to specific date
        from: this.today(), // Highlight all dates after specific date
      },
    };
  },
  mounted() {
    if(this.big) {
      this.$refs.datePick.$el.querySelector('.item').style.height="3vw"
      this.$refs.datePick.$el.querySelector('.item').style.fontSize="2vw"
      this.$refs.datePick.$el.querySelector('.item').style.width="100%"
    }
  },
  computed: {

  },
  methods: {
    today() {
      return new Date(formatDate(new Date(), "yyyy-MM-dd"));
    },
    lastYear() {
      var d1 = new Date();
      var d2 = new Date(d1);
      d2.setFullYear(d2.getFullYear() - 1);

      return d2;
    },
    pickDate(value) {
      // console.log(value)
      // formatDate(value, "yyyy-MM-dd")
      this.$emit("pickDate", formatDate(value, "yyyy-MM-dd"));
    },
  },
  watch: {
    nextWeek() {
      if(this.nextWeek > new Date()) {
        this.disabledDates.from = new Date()
        this.date = new Date();
      }else {
        this.disabledDates.from = this.nextWeek;
        this.date = this.nextWeek;
      }      
    },
    firstDay() {
      this.disabledDates.to = this.firstDay;     
    }
  },
};
</script>

<style>
.vdp-datepicker {
 font-size: 2vmin; 
}
.filter__picker_item {
  background: linear-gradient(rgba(1, 255, 255, 0.5), rgba(33, 96, 184, 0.5));
  border: none;
  color: #ffffff;
  font-weight: bold;
  text-align: center;
  font-size: 2vmin;
  height: 4vh;
}
.item{
  width: 10vw;
  margin-right: 10px;
}
.calendarCss {
  background-color: rgba(71, 146, 252, 0.8) !important;
}
.disabled {
  color: rgba(221, 221, 221, 0.5) !important;
}

</style>
