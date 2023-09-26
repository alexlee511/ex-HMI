<template>
    <div class="divfocus2" :Style='stylerwd()' id='main'>
        <table class='divcss' id='divfocus' >
            <thead class="Position">
                <tr class="Position">
                    <th class="titelCSS Position" style="display: table-cell" :class="'_'+size"  v-for="(item , index) in titel">{{item}}</th>
                </tr>
            </thead>
            <tbody>
                <tr class="Position" v-for="(tableitem , y) in table" >
                    <td  :Style='tablewd(x,y)' v-for="(value , x) in tableitem" @mouseover='mouseover(x,y)' @mouseout='mouseout(x,y)'  class="tableCSS" :class="'_'+size" >{{value}}</td>
                </tr>
            </tbody>
        </table>
    
        <!--
        <div class='slaveM divfocus' :Style='stylerwd()'id='divfocus' >
            
            <div v-for="(tableitem , y) in table" >
                <div v-for="(value , x) in tableitem" >
                    <div class="slaveC tableCSS" :class="'_'+size" v-if="x!=0"
                        :Style='tablewd(x,y)' @mouseover='mouseover(x,y)' @mouseout='mouseout(x,y)' >
                        <div class="slaveC" :style="stylerwd(100,50,0,20)">{{value}}</div>
                    </div>
                </div>
            </div>
            <div class='slaveM' :Style='titeldivY()'>
                <div class="slaveC titelCSS overFlowX" :class="'_'+size"  v-for="(item , index) in titel" :Style='titelsty(index,0)'>
                    <div class="slaveC" :style="stylerwd(100,50,0,20)">{{item}}</div>
                </div>
            </div>
            <div class='slaveM' :Style='titeldivX()'>
                
                <div class="slaveC tableCSS overFlowX" :class="'_'+size"  v-for="(item , index) in table" :Style='titelsty(0 , index + 1 )'>
                    <div class="slaveC" :style="stylerwd(100,50,0,20)">{{item[0]}}</div>
                </div>
            </div>
            
            
            
        </div>
        <div class="slaveC titelCSS " :Style='titeldiv()' :class="'_'+size" v-if='titel.length>0&&table.length>0'>
            <div class="slaveC" :style="stylerwd(100,50,0,20)">{{titel[0]}}</div>
        </div>
        -->
    </div>
</template>

<script>


export default {
    computed:{
        tablewd: function(){
            return function(x,y){
                let str_ = ""; 
                if(this.flag){
                    if(this.xy[0] == x || this.xy[1] == y){
                        str_ += 'background:#2a66be;'
                    }else{
                        str_ += 'background:#2c5694;'
                    }
                    
                }else{
                    str_ += 'background:#2c5694;'
                }
                
                
                return str_
            }
        },
        //左上的大小
        titeldiv: function(){
            return function(){
                //取得螢幕長寬，手動扣掉VW與VH
                let element = document.getElementById('main');
                let divfocus = document.getElementById('divfocus');
                let all = this.all
                let X = 1
                let Y = 1
                if(divfocus != undefined && element != undefined){
                    X -= (( element.clientWidth  - divfocus.clientWidth    )) / element.clientWidth
                    Y -= (( element.clientHeight  - divfocus.clientHeight  )) / element.clientHeight
                }else{
                    return
                }
                
                let height = all / this.lenX
                let YMAX = this.lenY
                if(this.titel.length <  YMAX){
                    YMAX = this.titel.length
                }
                let width  = all / YMAX
                let str_ = "width: "+(width * X)+"%;height:"+(height * Y)+"%;left:"+(0)+"%;top:"+(0)+"%;"; 

                return str_; 
            }
        },
        //Y標題總大小
        titeldivY: function(){
            return function(){
                let all = this.all
                let height = all / this.lenX
                let YMAX = this.lenY
                if(this.titel.length <  YMAX){
                    YMAX = this.titel.length
                }
                let width  = all / YMAX
                let str_ = "width: "+(width * this.titel.length)+"%;height:"+height+"%;left:"+(width)+"%;top:"+(0)+"%;position: sticky;"; 

                return str_; 
            }
        },
        //X標題總大小
        titeldivX: function(){
            return function(){
                let all = this.all
                let height = all / this.lenX
                let YMAX = this.lenY
                if(this.titel.length <  YMAX){
                    YMAX = this.titel.length
                }
                let width  = all / YMAX
                let str_ = "width: "+(width)+"%;height:"+(height * this.table.length)+"%;left:"+(0)+"%;top:"+(0)+"%;position: sticky;"; 

                return str_; 
            }
        },
        //標題每個大小
        titelsty: function(){
            return function(x = 0,y = 0){
                if(this.autosize.length != this.titel.length){
                    let all = this.all
                    let height = all / (this.table.length + 1)
                    let width  = all / this.titel.length
                    if(x == 0 && y != 0){
                        height = all / this.table.length 
                        width  = 100
                        y -- ;
                    }else if(y == 0 && x != 0){
                        height = 100
                        width  = all / this.titel.length
                    }
                    let str_ = "width: "+width+"%;height:"+height+"%;left:"+(x * width)+"%;top:"+(y * height)+"%;"; 
                    return str_; 
                }else{
                    let all = this.all
                    console.log(this.autosize.slice(0 , x) , x)
                    let height = all / (this.table.length + 1)
                    let totle = 0
                    if(this.autosize.slice(0 , x).length != 0){
                        totle = this.autosize.slice(0 , x).reduce((a,b)=>a+b);  
                    }
                    
                    let width = this.autosize[x]
                    if(x == 0 && y != 0){
                        height = all / this.table.length 
                        width  = 100
                        y -- ;
                    }else if(y == 0 && x != 0){
                        height = 100

                    }
                    
                    let str_ = "width: "+width+"%;height:"+height+"%;left:"+totle+"%;top:"+(y * height)+"%;"; 
                    return str_; 
                }
                
            }
        },
        stylerwd: function(){
            return function(w='100',h='100',k='0',t='0'){
                return "width: "+w+"%;height:"+h+"%;left:"+k+"%;top:"+t+"%;"; 
            }
        },
    },
	data() {
		return {
            all : 100,
            xy : [-1,-1],
            flag : false,
		};
	},
    props: {
        //內容
        table: {
            type: Array,
            default: function () {
                return []
            }
        }, 
        //標題
        titel: {
            type: Array,
            default: function () {
                return []
            }
        }, 
        //標題
        size: {
            type: Number,
            default: 24
        }, 
        //排順序
        autosize: {
            type: Array ,
            default: function () {
                return []
            }
        }, 
        //X會出現幾行(包含標題)
        lenX: {
            type: Number,
            default: 10
        }, 
        //Y會出現幾行(包含標題)
        lenY: {
            type: Number,
            default: 5
        }, 
    },
	mixins: [],
	created() {
        
	},
	methods: {
        mouseover(x,y){
            this.flag = true
            this.xy = [x,y]
        },
        mouseout(x,y){
            this.flag = false
        }
	},
    
};
</script>

<style scoped>
td:first-child, th:first-child {
 position:sticky;
 left:0; 
 z-index:1;
}
thead tr th {
    position:sticky;
    top:0; 
}
.Position{
 position:sticky;
 top:0;
}
.titelCSS{
    box-shadow:inset 0px 0px 0px 2px #103971;
    background :#072047;
    color:#27ff00;
    height:30px;
}
.tableCSS{
    display: table-cell ;
    padding:10px;
    box-shadow:inset 0px 0px 0px 2px #103971;
    background:#2c5694;
    color:#01ffff;
}
.divcss{
    table-layout: auto ;
    display: table;
    min-width : 200px;
    border-style:solid;
    border-color:#008593;
    border-width: 3px;
}
.divfocus2{
    background: inherit;
    overflow-y:scroll;
    overflow-x:scroll;
}
.divfocus2::-webkit-scrollbar {
  width  : 0.5vw;
  height : 1vh;
}

.divfocus2::-webkit-scrollbar-thumb {
  background-color: #49ff28!important;
  
}
.divfocus2::-webkit-scrollbar-track {
  background: #4285f4 !important;
}
</style>