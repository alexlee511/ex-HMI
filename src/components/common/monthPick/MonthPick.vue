<template>
  <datepicker
    :minimumView="'month'"
    :maximumView="'month'"
    v-model="state.date"
    :disabled-dates="state.disabledDates"
    :format="DatePickerFormat"
    :highlighted="state.highlighted"
    @select="pickMonth"
    calendar-class="calendarCss"
    input-class="filter__picker_item item"
    wrapper-class="pickerWrapperCss"
  ></datepicker>
</template>

<script>
import Datepicker from "vuejs-datepicker";
import { formatDate } from "common/utile/utile";

export default {
  components: {
    Datepicker,
  },
  data() {
    return {
      DatePickerFormat: "yyyy-MM",
      state: {
        date: `${this.today()}`,
        disabledDates: {
          to: this.firstDay ? new Date(`${this.today()}`) : this.lastYear(), // Disable all dates up to specific date
          from: this.nextWeek ? new Date() : new Date(), // Disable all dates after specific date
        },
        highlighted: {
          to: this.today(), // Highlight all dates up to specific date
          from: this.today(), // Highlight all dates after specific date
        },
      },
    };
  },
  computed: {
    nextMonth() {
      var d1 = this.state.date;
      var d2 = new Date(d1);
      d2.setMonth(d2.getMonth() + 1);
      return formatDate(d2, "yyyy-MM") + '-01T00:00:00'
    }
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
    pickMonth(){
      this.$nextTick(() => {
        this.$emit("pickMonth", this.state.data.getMonth());
      })
    }
  },
};
</script>

<style>
.filter__picker_item {
  background: linear-gradient(rgba(1, 255, 255, 0.5), rgba(33, 96, 184, 0.5));
  border: none;
  color: #ffffff;
  font-weight: bold;
  text-align: center;
  font-size: 2vmin;
  height: 4vh;
}
.item {
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