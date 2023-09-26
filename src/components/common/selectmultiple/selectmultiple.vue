<template>
    <div class="main">
        <div    class="slaveC _24 textcolor textpx"  id='butt' :Style="stylerwd()" @click="_on(!flag)">{{$t("GENERAL.SELECT_TEXT")}}{{select_item.length}}</div>
        <div    class="slaveM _24 textcolor divfocus textpx" id='box' :Style="stylerwd(200,800,0,100,1)" v-show="flag">
            <div class="slaveC boxnb" :class="classwd(index)" v-for="(value,index) in show_item" :key="value" :Style="stylerwd(100,10,0,index , 2)" @click='__onclick(index)'>
                <div class='slaveC _24' :Style="stylerwd(80,100,10,0)">{{value}}</div>
                <div class='slaveL _24' :Style="stylerwd(8,100,2,0)" v-if='checksel(index)'>✔</div>
                
            </div>
            <div class="slaveC textcolor boxitem textpx" v-if="show_item.length==0" :Style="stylerwd(100,800,0,0,2)">{{$t("GENERAL.NO_DEVICE")}}</div>
        </div>
    </div>
</template>

<script>

export default {
	data() {
		return {
            flag : false,
		};
	},
    props: {
        item: {
            type: Array,
            default: function () {
                return []
            }
        },  
        show_item : {
            type: Array,
            default: function () {
                return []
            }
        },
        select_item: {
            type: Array,
            default: function () {
                return []
            }
        }, 
        item_max: {
            type: Number,
            default: 8,
        },
        select_max:{
            type: Number,
            default: 10,
        },
        percentage: {
            type: Number,
            default: 100,
        },        
    },
	mixins: [],
	created() {
        document.addEventListener("click" , e =>{
            let need = ['box','butt']
            let _flager = true
            for(let s of need){
                try{
                    if(document.getElementById(s).contains(e.target)){
                        _flager = false
                        
                        break;
                    }  
                }catch (n){
                }
            }
            
            
            if(_flager){
                this.flag = false
            }
        })
        console.log(this.show_item)
	},
	computed:{
        classwd: function(){
            return function(index){
                //先做顯示的交換
                if(index > this.item.length){
                    return
                }
                if( this.select_item.indexOf(this.item[index]) !== -1){
                    return 'boxitem_cli' ;
                }else{
                    return 'boxitem' ;
                }
            }
        },
        checksel: function(){
            return function(index){
                //先做顯示的交換
                if(index > this.item.length){
                    return
                }
                if( this.select_item.indexOf(this.item[index]) == -1){
                    return false
                }else{
                    return true
                }
            }
        },
        stylerwd: function(){
            return function(w=100,h=100,k=0,t=0 ,f =0){
                /*
                    f = 0 不做事情
                    f = 1 根據 item_max & percentage 百分比 去調整 長度
                    f = 2 方塊內部百分比調整 t = index
                */
                switch(f){
                    case 1:
                        if(this.show_item.length > this.item_max ){
                            h = this.item_max * this.percentage
                        }else if(this.show_item.length == 0){
                            h = this.percentage
                        }else{
                            h = this.show_item.length * this.percentage
                        }
                        break ;
                    case 2:
                        if(this.show_item.length > this.item_max ){
                            h = 100 / this.item_max
                        }else if(this.show_item.length == 0){
                            h = 100
                        }else{
                            h = 100 / (this.show_item.length )
                        }
                        t = t * h ;
                        break ;
                }
                return "width: "+w+"%;height:"+h+"%;left:"+k+"%;top:"+t+"%;"; 
            }
        },
    },
	methods: {
		_on(item){
            console.log(item)
            this.flag = item
        },
        __onclick(index){
            //先做顯示的交換
            if(index > this.item.length){
                return
            }
            let clickitem = this.item[index]
            console.log(clickitem)
            let nb =  this.select_item.indexOf(clickitem)
            if(nb !== -1){
                console.log('del')
                this.select_item.splice(nb, 1 );
            }else{
                if(this.select_item.length < this.select_max){
                    this.select_item.push(clickitem)
                }
                
            }
            console.log(this.select_item)
        },
	}
};
</script>

<style scoped>
.textcolor{
    color:#ffffff;
}

.textpx{
    display: flex;
    align-items: center;
    justify-content: space-around;
}
.divfocus{
    border-style:solid;
    border-color:#aaaaee;
    background: inherit;
    overflow:auto;
}
.boxnb {
    box-shadow: 0px 0px 0px 1px #192f6e;
}
.boxnb:hover {
  background: #9F9F92;
}
.boxitem {
    background: #0a4aa5;
    color:#01FFFF;
}
.boxitem_cli {
  background: #101b9d;
  color:#ffff33;
  
}
.divfocus::-webkit-scrollbar {
  width: 10px;
}

.divfocus::-webkit-scrollbar-thumb {
  background-color: #8888FF !important;
}
.divfocus::-webkit-scrollbar-track {
  background: #101b9d !important;
}
</style>