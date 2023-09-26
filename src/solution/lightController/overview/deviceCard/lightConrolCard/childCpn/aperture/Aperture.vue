<template>
    <svg
        ref="svg"
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        x="0px"
        y="0px"
        viewBox="0 0 260 260"
        class="svg-content"
    >
        <defs>
            <linearGradient
                id="gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
                gradientUnits="userSpaceOnUse"
            >
                <stop offset="0%" stop-color="#FFB600" />
                <stop offset="16%" stop-color="#FFE600" />
                <stop offset="33%" stop-color="#FFE700" />
                <stop offset="50%" stop-color="#FFFB09" />
                <stop offset="66%" stop-color="#FFFF6E" />
                <stop offset="83%" stop-color="#FFFD6B" />
                <stop offset="100%" stop-color="#FFFC76" />
            </linearGradient>
            <filter height="200%" width="200%" y="-50%" x="-50%" id="svg_2_blur">
                <feGaussianBlur stdDeviation="2" />
            </filter>
        </defs>
        <path
            fill-opacity="0"
            stroke-width="15"
            stroke="#bbb"
            d="m59.28934,200.35533a100,100 0 1 1 141.42136,0"
        />
        <path
            id="heart-path"
            fill-opacity="0"
            stroke-width="15"
            stroke="url(#gradient)"
            d="m59.28934,200.35533a100,100 0 1 1 141.42136,0"
            :style="`stroke-dasharray: 471.305, 471.305; stroke-dashoffset: ${lig};`"
        />
        <c-ellipse v-for="(item, index) in ellipseArr" :key="index" :info="item" :index="index" :current-index="currentIndex" />
    </svg>
</template>

<script>
import CEllipse from "./Ellipse";

export default {
    props: {
        lightValue: {
            type: Number,
            default: 0
        },
        arr:{
            type: Object,
            default: {
            }
        }
    },
    components: {
        CEllipse
    },
    data() {
        return {
            ellipseArr: [
                {
                    cx: "244.13",
                    cy: "167.08",
                },
                {
                    cx: "248.52",
                    cy: "111.23",
                },
                {
                    cx: "227.08",
                    cy: "59.47",
                },
                {
                    cx: "184.48",
                    cy: "23.08",
                },
                {
                    cx: "130",
                    cy: "10",
                },
                {
                    cx: "75.52",
                    cy: "23.08",
                },
                {
                    cx: "32.92",
                    cy: "59.47",
                },
                {
                    cx: "11.48",
                    cy: "111.23",
                },
                {
                    cx: "15.87",
                    cy: "167.08"
                }
            ],
            styleArr: [
                471.305, // 0%
                424.175,
                377.044,
                329.914,
                282.783,
                235.653,
                188.522,
                141.392,
                94.261,
                47.1305,
                0, // 100%
            ],
            lig : 0,
            last_ling : 0,
        };
    },
    mounted() {
    },
    methods: {
        async gogopower(tmp , move , end  , move_arr ,last , flag = 0){
                tmp = tmp + move ;
                this.lig = tmp ;
                let s = (last + (move_arr / ( 20 - flag ) ) ) * 27
                flag ++ ;
                this.arr.rotate.style.transform = `rotate(${s}deg)`
                if(tmp.toFixed() == end.toFixed()){
                        return
                }
                setTimeout(()=>{this.gogopower(tmp , move , end , move_arr , last, flag)},5 );
        },
    },
    computed: {
        currentIndex() {
            const i = this.lightValue - 9 > 0? 10: this.lightValue - 9
            return Math.abs(i)
        },
    },
    watch: {
            lightValue: function(){
                let move = (this.styleArr[this.lightValue] - this.styleArr[this.last_ling]) / 20;
                let move_arr = (this.lightValue - this.last_ling ) ;
                this.gogopower(this.styleArr[this.last_ling] , move , this.styleArr[this.lightValue] , move_arr , this.last_ling)
                this.last_ling = this.lightValue ;
            }
    }
};
</script>

<style>
.svg-content {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
</style>