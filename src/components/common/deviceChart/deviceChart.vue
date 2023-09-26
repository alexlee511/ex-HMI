<template>
  <div>
    <div class="DEVICEINFO_CONTENT_PAGE">
      <div class="content_page__title">
        <span class="content_page__title__text" name="device_name"></span>
      </div>
      <div style="display: flex;">
        <div>
          <input type="text" id="st_datepicker" class="filter__picker_item" style="width:10vw" />
          <select id="st_timepicker" class="filter__picker_item"></select>
          <span>~</span>
          <select id="et_timepicker" class="filter__picker_item"></select>
          <input type="text" id="et_datepicker" class="filter__picker_item" style="width:10vw" />
          <select id="attrid_select" class="filter__picker_item"></select>
        </div>
        <div style="display: flex;flex: 8;justify-content: flex-end;align-self: center;">
          <button
            id="get_history_data_btn"
            class="filter__picker_item"
            onclick="get_history_data()"
            style="margin-left: 10vmin;"
          >{{ $t('GENERAL.SEARCH') }}</button>
        </div>
      </div>
      <div class="content_page__chart_view">
      <canvas id="history_chart" width="400px" height="400px"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from 'chart.js';

export default {
  data() {
    return {
    }
  },
  mounted() {
    this.init_history_chart();
  },
  
  methods: {
    init_history_chart() {
      //歷史圖表
      var HistoryChart;
      var ctx = document.getElementById("history_chart").getContext("2d");
      HistoryChart = new Chart(ctx, {
        type: "line",
        data: {
          datasets: [
            {
              label: this.$t('GENERAL.HISTORY_CHART'),
              data: [{x: Date.parse("2019/1/16  09:14:01 AM"),y: 500},
                     {x: Date.parse("2019/1/16  09:24:01 AM"),y: 200}],
              backgroundColor: "rgba(0, 240, 240, 0.1)",
              borderColor: "rgba(0, 240, 240, 1)",
              pointBackgroundColor: "rgba(178, 255, 89, 1)", //正常
              pointBorderWidth: 0.1,
              lineTension: 0, // 曲線
              borderJoinStyle: "round", //彎角
              borderCapStyle: "round",
              borderWidth: 4,
              pointRadius: 6,
              pointHoverRadius: 10,
            },
          ],
        },
        options: {
          scales: {
            xAxes: [
              {
                type: "time",
                distribution: "linear",
                time: {
                  displayFormats: {
                    day: "YYYY/MM/DD",
                    hour: "YYYY/MM/DD hA",
                  },
                },
                bounds: "ticks",
                gridLines: {
                  color: "rgba(240, 240, 240, 0.1)",
                },
                ticks: {
                  fontColor: "#ffff00",
                  fontSize: 12,
                  source: "auto",
                },
              },
            ],
            yAxes: [
              {
                ticks: {
                  fontColor: "#ffff00",
                  fontSize: 12,
                  // 顯示單位
                  callback: function (value, index, values) {
                    return value;
                  },
                },
                gridLines: {
                  color: "rgba(240, 240, 240, 0.1)",
                },
              },
            ],
          },
          legend: {
            display: false,
          },
          tooltips: {
            mode: "index",
            intersect: false,
            titleFontSize: 20,
            bodyFontSize: 18,
          },
          hover: {
            mode: "index",
            intersect: false,
          },
          animation: false,
          maintainAspectRatio: false,
          annotation: {
            annotations: [],
          },
        },
      });
    },
  }

};
</script>

<style scoped>

.DEVICEINFO_CONTENT_PAGE {
  width: 75vw;
}

.content_page__title {
  display: flex;
  height: 15vh;
}
.content_page__view {
  display: flex;
  flex-direction: row;
  height: 63vh;
}

.attrname__type1,
.attrname__type3 {
  font-size: 4vmin;
}

.attrvalue__type1 {
  font-size: 7vmin;
}

.attrunit__type1,
.attrunit__type3 {
  font-size: 3.5vmin;
}

.attrname__type2 {
  font-size: 3.5vmin;
  display: inline-block;
  width: 8vw;
}

.attrvalue__type2 {
  font-size: 4vmin;
  display: inline-block;
  width: 10vw;
}

.attrunit__type2 {
  font-size: 3.5vmin;
}

.attrvalue__type3 {
  font-size: 8vmin;
  margin: 0vh 4vw 0vh 0vw;
}

.attrname__type4 {
  font-size: 3.5vmin;
  display: inline-block;
  width: 15vw;
}

.attrvalue__type4 {
  font-size: 4vmin;
  display: inline-block;
  width: 15vw;
}

.content_page__attrvalue {
  color: #ffff33;
}

.content_page__attrunit {
  color: #c9c9c9;
}

.content_page__attr__view {
  width: 80%;
  border-width: 0px 0px 1px 0px;
  border-style: solid;
  border-image: linear-gradient(to right, #01ffff, #2160b8);
  border-image-slice: 1;
}

.content_page__attr__view--type1 {
  margin: 3vh 0vw;
}

.content_page__attr__view--type2 {
  margin: 2vh 0vw;
}

.content_page__attr__view--type3 {
  margin: 1vh 0vw;
}

.content_page__attr__view--type4 {
  margin: 3vh 0vw;
  width: 90%;
  display: flex;
  justify-content: center;
  margin-left: 2vw;
}

.content_page__fieldset {
  width: 100%;
  height: 90%;
  border-width: 2px !important;
  border-style: solid;
  border-color: #01ffff;
}

.content_page__fieldset--left {
  border-right-width: 0px !important;
  border-radius: 10% 0px 0px 10%;
}

.content_page__fieldset--right {
  border-left-width: 0px !important;
  border-radius: 0px 10% 10% 0px;
}

.content_page__fieldset__legend {
  color: #01ffff;
  font-size: 3.5vmin;
  text-align: center;
  width: auto;
}

.content_page__title__text {
  font-size: 5vmin;
  align-self: center;
}

.content_page__icon_view {
  position: absolute;
  bottom: 3vh;
  right: 3vw;
}

.content_page__icon {
  height: 40vh;
}

.content_page__chart_view {
  height: 45vh;
  padding-top: 2vh;
  margin-top: 3vh;
  background-color: rgba(234, 234, 234, 0.3);
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

option {
  background-color: rgba(33, 96, 184, 1);
  color: #ffffff;

  font-weight: bold;
}
</style>