<template>
  <div>
<div class="content_page__icon_view">
      <img
        src="~assets/images/meter_basic_icon.png"
        class="content_page__icon"
      />
    </div>
    <div class="DEVICEINFO_CONTENT_PAGE">
      <div class="content_page__title">
        <span class="content_page__title__text">{{$t(card.Type)}}</span>
      </div>
      <div class="content_page__view">
        <div
          style="
            width: 60%;
            display: flex;
            flex-direction: column;
            align-items: center;
          "
        >
          <div class="content_page__attr__view content_page__attr__view--type1">
            <div>
              <span class="attrname__type1">{{ $t("VEN.STATE") }}</span>
            </div>
            <div>
              <span
                class="content_page__attrvalue attrvalue__type1"
                >{{ translation(card.status) }}</span
              >
              <span class="content_page__attrunit attrunit__type1">{{ card.unit }}</span>
            </div>
          </div>
          <div class="content_page__attr__view content_page__attr__view--type1">
            <div>
              <span class="attrname__type1">{{
                $t("VEN.TIME")
              }}</span>
            </div>
            <div>
              <span
                class="content_page__attrvalue attrvalue__type1"
                >{{ translation(card.time) }}</span
              >
              <span class="content_page__attrunit attrunit__type1">{{$t("VEN.MIN")}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { ven_card , runupdate } from '../../../../../data/ston/data.js'
export default {
  data() {
    return {
      devId: this.$route.query.devId,
      data: [],
			infoState: false,
			devName: "",
            card:{},
    };
	},
	mixins: [],
	async created() {
        runupdate().then(res => {
            for(let i of ven_card){
                if(i.venId == this.devId){
                    this.card = i;
                    break;
                }
            }
        })
    }, 
    methods: {
        translation(value) {
            return this.$t(`${value}`)
        }
    }

}
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
</style>