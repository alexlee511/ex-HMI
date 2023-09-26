<template>
    <div class="main">
        <!--<div v-if="show_drop_down" class="area_around" @click="show_drop_down=false"></div>-->
        <div ref="dropDownBox1" class="slaveM select-box" :style="stylerwd(100,100,0,0)"></div>

        <div ref="dropDownBox2" class="slaveL select-item overFlowY" v-if="show_drop_down" :style="stylerwd(100,max*100,0,100)">
            <div class="slaveL pick-box" v-for="(item,index) in list" :key="index" 
                :style="stylerwd(100,row_height,0,row_height*index)">
                <div class="slaveL overFlowX" :style="stylerwd(100,100,0,0)" @click="_onclick(index, item)" :class="pickedCSS(index)"> 
                    <span class="slaveL" :style="stylerwd(100,100,1,0)"> {{item}} </span> 
                </div>
            </div>
        </div>
        
        <div ref="dropDownBox3" class="slaveL overFlowX" :style="stylerwd(90,100,2,0)" 
            @click="show_drop_down=!show_drop_down"> 
                {{currentItem}} 
        </div>

        <div class="slaveM" :style="stylerwd(10,100,87,12)">
            <img ref="dropDownBox4" class="slaveM imgC" :style="stylerwd(100,100,0,0)" @click="show_drop_down=!show_drop_down" src="~assets/images/downward-arrow.png"/>
        </div>
        
    </div>
</template>

<script>
export default {
	data() {
		return {
            show_drop_down: false,
            currentItem: "",
            pickedIndex: -1,
            list: [],
            row_height: 0,
            max: 0,
		};

	},
    props: {
        defaultPicked:{
            type: Number,
            default: -1,
        },
        itemList:{
            type: Array,
            default: [],
        },
        attr:{
            type: String,
            default: ""
        },
        dropDownVisible :{
            type: Boolean,
            default: false
        },
        max_selection :{
            type: Number,
            default: 2,
        },
    },
	mixins: [],
	created() {
        // console.log("Props list:", this.itemList)
        if(this.attr!==""){
            for(let item of this.itemList){
                this.list.push(item[this.attr]);
            }
        }else{
            this.list = this.itemList;
        }

        this.max = this.max_selection
        while(this.list.length < this.max){
            this.max -= 1;
        }
        this.row_height = 100/this.max;

        if(this.defaultPicked >= 0){
            this.pickedIndex = this.defaultPicked;
            this.currentItem = this.list[this.pickedIndex];
        }else{
            if(this.list.length) this.currentItem = this.$t('GENERAL.PLEASE_SELECT');
            else this.currentItem = this.$t('GENERAL.NO_DEVICE');
        }
        this.show_drop_down = this.dropDownVisible;
        // console.log("In dropdown", this.list, this.currentItem)
	},
    mounted() {
        document.addEventListener("click", this.bodyCloseMenu);
    },
    beforeDestroy() {
        document.removeEventListener("click", this.bodyCloseMenu);
    },
	computed:{
        stylerwd: function(){
            return function(w=100,h=100,k=0,t=0){
                return "width: "+w+"%;height:"+h+"%;left:"+k+"%;top:"+t+"%;"; 
            }
        },
    },
	methods: {
		_onclick(index, item){
            this.currentItem = item;
            this.pickedIndex = index;
            this.$emit("itemClicked", [index, item]);
            console.log("已選擇：", this.currentItem, this.pickedIndex);
        },
        pickedCSS(index){
            if(index === this.pickedIndex){
                // console.log(index)
                return "picked-item"
            }
        },
        bodyCloseMenu(e) {
            //console.log("🍘🍘🍘",e.target)
            let dropDownBoxRefs = ["dropDownBox1","dropDownBox2","dropDownBox3","dropDownBox4"]
            let countUnequal = 0;
            for(let i of dropDownBoxRefs){
                //console.log("🍱🥡🥠",this.$refs[i])
                if(e.target !== this.$refs[i]){
                    countUnequal += 1;
                }
            }
            if(countUnequal === 4) this.show_drop_down = false;
        },
	},
    // watch:{
    //     show_drop_down(){
    //         if(!this.show_drop_down)
    //             console.log("close!")
    //         else console.log("open!")
    //     }
    // }
};
</script>

<style scoped>
.imgC{
    max-width: 30px;
    max-height: 30px;
    position: absolute;
    padding: auto;
}
.select-box{
    background: linear-gradient(#72c7f1dc,#0e7ebed9);
    border-radius: 3px;
}
.select-item{
    background: rgba(64, 70, 81, 0.796);
    display: flex;
    color:#ffffff;
}
.pick-box:hover{
    background: #0e7ebed9;
}
.picked-item{
    background: #72c7f1dc;
}
</style>