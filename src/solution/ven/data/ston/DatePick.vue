<template>
  <div class="calendar">
    <section class="header">
      {{ selectData.year }}/{{ selectData.month }}/{{ selectData.day }}
    </section>
    <ul class="week-area">
      <li
        class="week-item"
        v-for="(item, index) in weekArr"
        :key="index">
        <span class="week-font calendar-item">{{$t(item) }}</span>
      </li>
    </ul>
    <section
      ref="calendar"
      class="data-container"
      :style="{
        height: isWeekView ? `${itemHeight + touchAreaHeight}px` : `${lineNum * itemHeight + touchAreaHeight}px`,
        transitionDuration: `${needHeightAnimation ? transitionDuration : 0}s`,
      }"
      @touchstart="touchStart"
      @touchmove.stop.prevent="touchMove"
      @touchend="touchEnd"
    >
      <section
        class="month-area"
        :style="{
          transform: `translateX(${-(translateIndex + 1) * 100}%)`,
          transitionDuration: `${needAnimation ? transitionDuration : 0}s`
        }">
        <div
          class="banner-area"
          :style="{
            transform: `translateY(${offsetY}px)`,
            transitionDuration: `${needHeightAnimation ? transitionDuration : 0}s`
          }">
          <ul
            v-for="(monthItem, monthIndex) in allDataArr"
            :key="monthIndex"
            class="data-area"
            :style="{
              transform: `translateX(${(translateIndex + isTouching ? touch.x : 0) * 100}%)`,
              transitionDuration: `${isTouching ? 0 : transitionDuration}s`
            }">
            <li
              v-for="(item, index) in monthItem"
              :key="index"
              :class="[
                'data-item',
                
                { 'tmp': notEnv.indexOf(item.year + '-' +addz(item.month)+ '-' +addz(item.day))!== -1},
                { 'select': selectEnv.indexOf(item.year + '-' +addz(item.month)+ '-' +addz(item.day))!== -1},
                { 'nomor': item.year <= nowdate.year && item.month <= nowdate.month && item.day < nowdate.day},
                { 'other-item': item.type !== 'normal' && !isWeekView },
              ]"
              :style="`height: ${itemHeight}px`"
              @click="checkoutDate(item , true)">
              <span class="data-font calendar-item">{{ item.day }}</span>
            </li>
          </ul>
        </div>
      </section>
    </section>
  </div>
</template>

<script>
export default {
  name: 'calender',
  props:{
    notEnv: {
      type: Array,
    },
    selectEnv: {
      type: Array,
    }
  },
  data() {
    return {
      weekArr: ['VEN.SUN', 'VEN.MON', 'VEN.TUE', 'VEN.WED', 'VEN.THU', 'VEN.FRI', 'VEN.SAT'], 
      dataArr: [],
      allDataArr: [],
      selectData: {}, 
      isSelectedCurrentDate: false, 
      translateIndex: 0, 
      transitionDuration: 0.3,
      needAnimation: true, 
      isTouching: false, 
      touchStartPositionX: null,
      touchStartPositionY: null,
      touch: { 
        x: 0,
        y: 0
      },
      isWeekView: false,
      itemHeight: 40,
      needHeightAnimation: false, 
      offsetY: 0,
      lineNum: 0,
      lastWeek: [],
      nextWeek: [],
      isDelay: true,
      touchAreaHeight: 40, 
      touchAreaPadding: 10, 
      isClicked: false, 
      nowdate:{},
    }
  },
  created() {

    this.checkoutCurrentDate()
  },
  watch: {
    dataArr: {
      handler (val) {
        this.changeAllData(val)
      },
      deep: true,
    },
    isWeekView(val) {
      if (!val) {
        this.isSelectedCurrentDate = false
        this.changeAllData(this.dataArr)
      }
    },
  },
  methods: {
    set_time(notEnv){
        let time_tmp = {};
        time_tmp.day   =  new Date().getDate()   ;
        time_tmp.month   =  new Date().getMonth() + 1 ;
        time_tmp.year   =  new Date().getFullYear()   ;
        this.nowdate = this.findNotEnv(time_tmp , notEnv)
        
        
        this.selectData = JSON.parse(JSON.stringify(this.nowdate));
        if(this.selectData.month != new Date().getMonth()+1){
            this.selectData.type = "next";
            this.selectData.month -= 1;
            
        }else{
            this.selectData.type = "normal";
            this.selectData.isSelected = false;
            this.selectData.spisSelected = true;
        }
        
        
        
        this.checkoutDate(this.selectData);
    },
    returninenv(){
        return this.notEnv.concat(this.selectEnv);
    },
    addz(nb){
        return nb < 10? '0'+nb : nb;
    },
    findNotEnv(fistTime , notEnv = this.returninenv){
        let time = {};
        let timevalue = (new Date(fistTime.year, fistTime.month, fistTime.day)).valueOf();
        let tmp = "" ;
        let n = 0 ;
        while(notEnv.indexOf(tmp) != -1 || tmp == ""){
            time.year  = new Date(timevalue + n * (1000*3600*24)).getFullYear()   ;
            time.month = new Date(timevalue + n * (1000*3600*24)).getMonth() ;
            time.day   = new Date(timevalue + n * (1000*3600*24)).getDate()   ;
            time.year  = time.month == 0 ? time.year -1 : time.year ;
            time.month = time.month ==0 ? 12 : time.month
            n ++ ;
            tmp = (time.year )+ '-' +this.addz(time.month)+ '-' +this.addz(time.day)
        }
        return time;
        
    },
    changeAllData(val) {
      if (this.isSelectedCurrentDate && !this.isWeekView) return
      const preDate = this.getPreMonth()
      const preDataArr = this.getMonthData(preDate, true)
      const nextDate = this.getNextMonth()
      const nextDataArr = this.getMonthData(nextDate, true)
      if (this.isWeekView) {
        const sliceStart = this.dealWeekViewSliceStart()
        preDataArr.splice(sliceStart, 7, ...this.lastWeek)
        nextDataArr.splice(sliceStart, 7, ...this.nextWeek)
      }
      const delayHandle = (isDelay) => {
        this.allDataArr = [preDataArr, val, nextDataArr]
        this.needAnimation = false
        this.translateIndex = 0
        if (isDelay) this.isDelay = false
      }
      if (this.isDelay) {
        delayHandle(this.isDelay)
        return
      }
      setTimeout(() => {
        delayHandle()
      }, this.isClicked && this.isWeekView ? 0 : this.transitionDuration * 1000)
    },
    getCurrentDate() {
      this.selectData = {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: new Date().getDate(),
      }
    },
    getMonthData(date, unSelected = false) {
      const { year, month, day } = date
      let dataArr = []
      let daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
      if ((year % 4 == 0 && year % 100 !== 0) || year % 400 == 0) {
        daysInMonth[1] = 29
      }
      const monthStartWeekDay = new Date(year, month - 1, 1).getDay()
      const monthEndWeekDay = new Date(year, month, 1).getDay() || 7
      const preInfo = this.getPreMonth(date)
      const nextInfo = this.getNextMonth()
      for (let i =  0; i < monthStartWeekDay; i++) {
        let preObj = {
          type: 'pre',
          day: daysInMonth[preInfo.month - 1] - (monthStartWeekDay - i - 1),
          month: preInfo.month,
          year: preInfo.year,
        }
        dataArr.push(preObj)
      }
      for (let i = 0; i < daysInMonth[month - 1]; i++) {
        let itemObj = {
          type: 'normal',
          day: i + 1,
          month,
          year,
          isSelected: day == i + 1 && !unSelected,
        }
        dataArr.push(itemObj)
      }
      for (let i = 0; i < 7 - monthEndWeekDay; i++) {
        let nextObj = {
          type: 'next',
          day: i + 1,
          month: nextInfo.month,
          year: nextInfo.year,
        }
        dataArr.push(nextObj)
      }
      return dataArr
    },
    checkoutDate(selectData , flag = false) {
        let tmp = selectData.year + '-' +this.addz(selectData.month)+ '-' +this.addz(selectData.day)
        if(this.notEnv.indexOf(tmp)> -1){
            return;
        }
        if(selectData.year <= this.nowdate.year && selectData.month <= this.nowdate.month && selectData.day < this.nowdate.day ){
            return;
        }
        
      this.isSelectedCurrentDate = true
      this.isClicked = true
      if (this.isWeekView && selectData.type !== 'normal') {
        this.needAnimation = false
        this.needHeightAnimation = false
      }
      if (selectData.type == 'next') {
        this.translateIndex += 1
        this.dealMonthData('NEXT_MONTH', selectData.day)
        return
      }
      if (selectData.type == 'pre') {
        this.translateIndex -= 1
        this.dealMonthData('PRE_MONTH', selectData.day)
        return
      }
      this.selectData.day = selectData.day
      if(flag){
          let nb = this.selectEnv.indexOf(tmp);
          if(nb == -1){
              this.selectEnv.push(tmp);
          }else{
              this.selectEnv.splice(nb,1);
          }
      }
      const oldSelectIndex = this.dataArr.findIndex(item => item.isSelected && item.type == 'normal')
      const newSelectIndex = this.dataArr.findIndex(item => item.day == selectData.day && item.type == 'normal')
      if (this.dataArr[oldSelectIndex]) this.$set(this.dataArr[oldSelectIndex], 'isSelected', false)
      if (this.dataArr[newSelectIndex]) this.$set(this.dataArr[newSelectIndex], 'isSelected', true)
    },
    getPreMonth(date, appointDay = 1) {
      let { year, month } = date || this.selectData
      if (month == 1) {
        year -= 1
        month = 12
      } else {
        month -= 1
      }
      return { year, month, day: appointDay }
    },
    getNextMonth(appointDay = 1) {
      let { year, month } = this.selectData
      if (month == 12) {
        year += 1
        month = 1
      } else {
        month += 1
      }
      return { year, month, day: appointDay }
    },
    handlePreMonth() {
        let appointDay = this.findNotEnv(this.getPreMonth('',1) , this.notEnv).day
        appointDay = (this.selectData.year == this.nowdate.year && this.selectData.month - 1== this.nowdate.month )? this.nowdate.day:appointDay ;
        
        
        this.dealMonthData('PRE_MONTH' , appointDay)
    },
    handleNextMonth() {
        let appointDay = this.findNotEnv(this.getNextMonth() , this.notEnv).day
        this.dealMonthData('NEXT_MONTH' , appointDay)
    },
    checkenv(year , month ){
        let tmp = this.nowdate.year + '-' +this.addz(this.nowdate.month)+ '-' +this.addz(this.nowdate.day)
    },
    dealMonthData(type, appointDay = 1) {
      this.isSelectedCurrentDate = false
      switch(type) {
        case 'PRE_MONTH':
          this.selectData = this.getPreMonth('', appointDay)
          break
        case 'NEXT_MONTH':
          this.selectData = this.getNextMonth(appointDay)
          break
        default:
          break
      }
      this.dataArr = this.getMonthData(this.selectData)
      this.lineNum = Math.ceil(this.dataArr.length / 7)
    },
    checkoutCurrentDate() {
      this.isDelay = true
      this.getCurrentDate()
      this.dealMonthData()
    },
    touchStart(event) {
      this.isTouching = true
      this.needAnimation = true
      this.isClicked = false
      this.touchStartPositionX = event.touches[0].clientX
      this.touchStartPositionY = event.touches[0].clientY
      this.touch = {
        x: 0
      }
    },
    touchMove(event) {
      const moveX = event.touches[0].clientX - this.touchStartPositionX
      const moveY = event.touches[0].clientY - this.touchStartPositionY
      
      if (Math.abs(moveX) > Math.abs(moveY)) { // 左右
        
        this.needHeightAnimation = false
        this.touch = {
          x: moveX / this.$refs.calendar.offsetWidth,
          y: 0
        }
      } else {
        this.needHeightAnimation = true
        this.touch = {
          x: 0,
          y: moveY / this.$refs.calendar.offsetHeight
        }
      }
    },
    touchEnd() {
      this.isTouching = false
      const { x, y } = this.touch
      if (Math.abs(x) > Math.abs(y) && Math.abs(x) > 0.3) {
        if (x > 0) { 
          if(this.nowdate.year == this.selectData.year &&  this.nowdate.month >= this.selectData.month){   
          }else{
            this.translateIndex -= 1
            this.isWeekView ? this.handlePreWeek() : this.handlePreMonth()
          }
        }
        else if (x < 0) { 
          this.translateIndex += 1
          this.isWeekView ? this.handleNextWeek() : this.handleNextMonth()
        }
      }
      if (Math.abs(y) > Math.abs(x) && Math.abs(y * this.$refs.calendar.offsetHeight) > 50) {
        if (y > 0) { 
          this.isWeekView = false
          this.offsetY = 0
        }
        else if (y < 0) { 
          this.isWeekView = true
          this.dealWeekViewData()
        }
      }
      this.touch = {
        x: 0,
        y: 0
      }
    },
    getInfoOfWeekView(selectedIndex, length) {
      const indexOfLine = Math.ceil((selectedIndex + 1) / 7)
      const totalLine = Math.ceil(length / 7)
      const sliceStart = (indexOfLine - 1) * 7
      const sliceEnd = sliceStart + 7
      return { indexOfLine, totalLine, sliceStart, sliceEnd }
    },
    dealWeekViewSliceStart() {
      const selectedIndex = this.dataArr.findIndex(item => item.isSelected)
      const {
        indexOfLine,
        totalLine,
        sliceStart,
        sliceEnd
      } = this.getInfoOfWeekView(selectedIndex, this.dataArr.length)
      this.offsetY = -((indexOfLine - 1) * this.itemHeight)
      if (indexOfLine == 1) {
        const preInfo = this.getPreMonth()
        const preDataArr = this.getMonthData(preInfo, true)
        const preDay = this.dataArr[0].day - 1 || preDataArr[preDataArr.length - 1].day
        const preIndex = preDataArr.findIndex(item => item.day == preDay && item.type == 'normal')
        const { sliceStart: preSliceStart, sliceEnd: preSliceEnd } = this.getInfoOfWeekView(preIndex, preDataArr.length)
        this.lastWeek = preDataArr.slice(preSliceStart, preSliceEnd)
      } else {
        this.lastWeek = this.dataArr.slice(sliceStart - 7, sliceEnd - 7)
      }
      if (indexOfLine >= totalLine) {
        const nextInfo = this.getNextMonth()
        const nextDataArr = this.getMonthData(nextInfo, true)
        const nextDay = this.dataArr[this.dataArr.length - 1].type == 'normal' ? 1 : this.dataArr[this.dataArr.length - 1].day + 1
        const nextIndex = nextDataArr.findIndex(item => item.day == nextDay)
        const { sliceStart: nextSliceStart, sliceEnd: nextSliceEnd } = this.getInfoOfWeekView(nextIndex, nextDataArr.length)
        this.nextWeek = nextDataArr.slice(nextSliceStart, nextSliceEnd)
      } else {
        this.nextWeek = this.dataArr.slice(sliceStart + 7, sliceEnd + 7)
      }
      return sliceStart
    },
    handlePreWeek() {
      this.dealWeekData('PRE_WEEK')
    },
    handleNextWeek() {
      this.dealWeekData('NEXT_WEEK')
    },
    dealWeekData(type) {
      const { year, month, day } = type == 'PRE_WEEK' ? this.lastWeek.find(item => item.type == 'normal') : this.nextWeek[0]
      this.selectData = { year, month, day }
      this.dataArr = this.getMonthData(this.selectData)
      this.lineNum = Math.ceil(this.dataArr.length / 7)
      this.offsetY -= this.itemHeight
      this.dealWeekViewData()
    },
    dealWeekViewData() {
      const sliceStart = this.dealWeekViewSliceStart()
      this.allDataArr[0].splice(sliceStart, 7, ...this.lastWeek)
      this.allDataArr[2].splice(sliceStart, 7, ...this.nextWeek)
    },
  }
}
</script>

<style scoped>
@import "~assets/css/cardItem.css";
.calendar {
  overflow-x: hidden;
  height : 100%;
  width : 100%;
}
.header {
  padding: 0 5px;
  font-size: 3vmin;
  font-weight: 500;
  color: #fff;
  line-height: 44px;
  margin: 0 calc((14.285% - 40px) / 2 + 6px);
}
.calendar-item {
  display: block;
  width: 40px;
  height: 40px;
  text-align: center;
  line-height: 40px;
}
.selected .calendar-item {
  background: #ff5d43;
  border-radius: 100%;
  color: #FFF;
}
.tmp .calendar-item {
  background: #ff2e0be6;
  border-radius: 100%;
  color: #999898;
}

.nomor .calendar-item {
  background: #0F52BA;
  opacity:0.5;
  border-radius: 35%;
  color: #bec1af;
}
.select .calendar-item {
  background: #FFDAB9;
  opacity:0.5;
  border-radius: 35%;
  color: #bec1af;
}
.week-area {
  width: 100%;
  display: flex;
}
.week-item {
  height: 100%;
  flex: 0 0 14.285%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.week-font {
  font-size: 3vmin;
  color: #f1f51b;
  font-weight: 500;
}
.data-container {
  overflow: hidden;
  position: relative;
}
.banner-area {
  width: 300%;
  display: flex;
}
.data-area {
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: row wrap;
}
.data-item {
  flex: 0 0 14.285%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.data-font {
  color: #FFF;
  font-size: 3vmin;
  font-weight: 400;
}
.other-item .data-font {
  color: #000;
}
.touch-area {
  width: 100%;
  box-sizing: border-box;
  background-color: #000;
  position: absolute;
  left: 0;
  bottom: 0;
}
.touch-container {
  width: 100%;
  box-sizing: border-box;
  border-top: .5px solid #0F0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.touch-item {
  width: 40px;
  height: 5px;
  background: #2b4450;
  border-radius: 100px;
  opacity: 0.6;
}
</style>