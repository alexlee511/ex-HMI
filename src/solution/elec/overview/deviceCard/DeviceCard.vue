<template>
    <div class="grid-container" v-if="isCardExist">
      <component
        :is="item.cardType"
        v-for="item in pageCard[this.$store.state.pageNum - 1]"
        :key="item.deviceId"
        :item-info="item"
      ></component>
       <div class="content__devcard content__devcard__view">
            <span class="devcard__devname _48">
                <slot name="dev-name">重新搜尋</slot>
            </span>
            <div class="devcard__devattr__carousel main" Style="width: 100%; height: 100%; left: 0%; top: 0%;">
                        <button class="slaveC buttonMain _36"   Style="width: 80%     ; height: 40%  ; left: 10%   ; top: 20%  ; " @click='_onclick()'>重新搜尋</button>
                </div>
        </div>
    </div>
    </div>
    <div v-else-if='dataflag=="0"'>
        <div />
        <div class="la-ball-scale-ripple-multiple la-3x">
            <div v-for="item of 5"/>
        </div>
        <span class='readdata_img' style="">搜尋中</span>
    </div>
    <div v-else>
      <no-data-back></no-data-back>
    </div>
</template>

<script>
import elecCard from "./elecCard/elecCard";

import deviceCardMixin from "common/mixin/deviceCardMixin";
//清除要抓取得ID與建立需取得的ist
import { update_dev , delete_all} from "common/constant/ist";
import {devicelist , dataflag , getadb} from '@/solution/elec/data/ston/data.js';
export default {
  components: {
    elecCard,
  },
  data(){
    return {
		flag:null,
		dataflag:null,
	};
  },
  mixins: [deviceCardMixin],
  created() {
        this.pageCard = []
        this.max = 7
        this.isCardExist = false
        this.dataflag = dataflag;
        this.getData()

  },
  methods: {
        async getData(){
            if(dataflag == 0){
                setTimeout(this.getData,5000);
                return
            }
            this.dataflag = dataflag;
            //console.log("🚼🚼🚼🚼🚼🚼🚼🚼🚼🚼🚼🚼🚼")
            //console.log(devicelist)
            let tmp = JSON.parse(JSON.stringify(devicelist));
            let flag  = 0
            let index = 0
            let i = ''
            let g = 0
            while((i = tmp.shift()) !== undefined){
                if(flag == 0){
                    this.pageCard.push([])
                }
                this.pageCard[index].push(i)
                flag++
                g++
                if(flag == this.max){
                    flag  = 0 ;
                    index ++ ;
                }
            }
            if(g!=0)this.isCardExist=true
            //console.log(this.pageCard)
            },
        _onclick(){
            getadb();
            this.pageCard = []
            this.max = 7
            this.isCardExist = false
            this.dataflag = dataflag;
            this.getData();
        }

    },
};
</script>

<style scoped>
.buttonMain {
    box-shadow: 0px 0px 0px 2px #192f6e;
    background: linear-gradient(rgba(1, 255, 255, 0.5), rgba(33, 96, 184, 0.5));
    border-radius:20px;
    color : #FFFF00
}
.buttonMain:hover {
  background: linear-gradient( rgba(33, 96, 184, 0.5) , rgba(1, 255, 255, 0.5));
}
.readdata_img {
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  color: #00fafa;
  font-size: 6vmin;
  font-weight: bold;
  display: flex;
}
.grid-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-column-gap: 5px;
  grid-row-gap: 1em;
  color: #ffffff;
  font-weight: bold;
  margin-left: 20px;
  margin-right: 20px;
}

.la-ball-scale-ripple-multiple,
.la-ball-scale-ripple-multiple > div {
    position: relative;
    -webkit-box-sizing: border-box;
       -moz-box-sizing: border-box;
            box-sizing: border-box;
}
.la-ball-scale-ripple-multiple {
    display: block;
    font-size: 0;
    color: #fff;
    width: 100vw;
    height: 50vh;
    
}
.la-ball-scale-ripple-multiple.la-dark {
    color: #333;
}
.la-ball-scale-ripple-multiple > div {
    display: inline-block;
    float: none;
    background-color: currentColor;
    border: 0 solid currentColor;
}
.la-ball-scale-ripple-multiple {
    width: 32px;
    height: 32px;
}
.la-ball-scale-ripple-multiple > div {
    position: absolute;
    top: 0;
    left: 0;
    width: 32px;
    height: 32px;
    background: transparent;
    border-width: 2px;
    border-radius: 100%;
    opacity: 0;
    -webkit-animation: ball-scale-ripple-multiple 1.25s 0s infinite cubic-bezier(.21, .53, .56, .8);
       -moz-animation: ball-scale-ripple-multiple 1.25s 0s infinite cubic-bezier(.21, .53, .56, .8);
         -o-animation: ball-scale-ripple-multiple 1.25s 0s infinite cubic-bezier(.21, .53, .56, .8);
            animation: ball-scale-ripple-multiple 1.25s 0s infinite cubic-bezier(.21, .53, .56, .8);
}
.la-ball-scale-ripple-multiple > div:nth-child(1) {
    -webkit-animation-delay: 0s;
       -moz-animation-delay: 0s;
         -o-animation-delay: 0s;
            animation-delay: 0s;
}
.la-ball-scale-ripple-multiple > div:nth-child(2) {
    -webkit-animation-delay: .25s;
       -moz-animation-delay: .25s;
         -o-animation-delay: .25s;
            animation-delay: .25s;
}
.la-ball-scale-ripple-multiple > div:nth-child(3) {
    -webkit-animation-delay: .5s;
       -moz-animation-delay: .5s;
         -o-animation-delay: .5s;
            animation-delay: .5s;
}
.la-ball-scale-ripple-multiple > div:nth-child(4) {
    -webkit-animation-delay: .75s;
       -moz-animation-delay: .75s;
         -o-animation-delay: .75s;
            animation-delay: .75s;
}
.la-ball-scale-ripple-multiple > div:nth-child(5) {
    -webkit-animation-delay: .100s;
       -moz-animation-delay: .100s;
         -o-animation-delay: .100s;
            animation-delay: .100s;
}
.la-ball-scale-ripple-multiple.la-3x {
    width: 70%;
    height: 416px;
    left : 15%;
}
.la-ball-scale-ripple-multiple.la-3x > div {
    width: 70%;
    height: 416px;
    left : 15%;
    border-width: 6px;
}
@-webkit-keyframes ball-scale-ripple-multiple {
    0% {
        opacity: 1;
        -webkit-transform: scale(.1);
                transform: scale(.1);
    }
    70% {
        opacity: .5;
        -webkit-transform: scale(1);
                transform: scale(1);
    }
    95% {
        opacity: 0;
    }
}
@-moz-keyframes ball-scale-ripple-multiple {
    0% {
        opacity: 1;
        -moz-transform: scale(.1);
             transform: scale(.1);
    }
    70% {
        opacity: .5;
        -moz-transform: scale(1);
             transform: scale(1);
    }
    95% {
        opacity: 0;
    }
}
@-o-keyframes ball-scale-ripple-multiple {
    0% {
        opacity: 1;
        -o-transform: scale(.1);
           transform: scale(.1);
    }
    70% {
        opacity: .5;
        -o-transform: scale(1);
           transform: scale(1);
    }
    95% {
        opacity: 0;
    }
}
@keyframes ball-scale-ripple-multiple {
    0% {
        opacity: 1;
        -webkit-transform: scale(.1);
           -moz-transform: scale(.1);
             -o-transform: scale(.1);
                transform: scale(.1);
    }
    70% {
        opacity: .5;
        -webkit-transform: scale(1);
           -moz-transform: scale(1);
             -o-transform: scale(1);
                transform: scale(1);
    }
    95% {
        opacity: 0;
    }
}
</style>
