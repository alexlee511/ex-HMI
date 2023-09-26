<template>
    <div class="main" :id='"dataselectmain" + sid' >
        <div class="slaveC" :Style="stylerwd()" v-show='nowMode=="day"'>
            <div    class="slaveM _24 text divfocus" id='dataselecbox' :Style="stylerwd(size[0],size[1],0,100)" v-show="flag">
                <div class="slaveC selectMain _24" :Style="stylerwd(20,14,0 ,0)"                   @click="_sub('month')"  ><</div>
                <div class="slaveC selectMain _24" :Style="stylerwd(20,14,80,0)" id='dataselecadd' @click="_add('month')"  v-show="!select_flag||!(month == today.getMonth()+1 && year == today.getFullYear())">></div>
                <div class="slaveC selectMain"     :Style="stylerwd(56,16,22,0)"                   @click="__onup('day' ,year ,month)">{{year}}-{{month}}</div>
                <div class="slaveC" :Style="stylerwd(14,12,ind*14 + 1,14)+'color:#01FFFF;'" v-for="(item2,ind) in weekindex" :key="item2">{{item2}}</div>
                <div v-for="(itemY,Y) in y" :key="itemY">
                    <div v-for="(itemX,X) in x" :key="itemX">
                        <div v-if="X+Y*x <item.length && item[X+Y*x] != ''">
                            <div class="slaveC selectMain" :Style="stylerwd(14,12,1 + X * 14 ,26 + Y * 12)" v-if="item[X+Y*x]< dateflag" @click="__ondown('day' , year , month , item[X+Y*x])">{{item[X+Y*x]}}</div>
                            <div class="slaveC todayMain"  :Style="stylerwd(14,12,1 + X * 14 ,26 + Y * 12)" v-if="item[X+Y*x]==dateflag" @click="__ondown('day' , year , month , item[X+Y*x])">{{item[X+Y*x]}}</div>
                            <div class="slaveC noselMain " :Style="stylerwd(14,12,1 + X * 14 ,26 + Y * 12)" v-if="item[X+Y*x]> dateflag">{{item[X+Y*x]}}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="slaveC" :Style="stylerwd()" v-show='nowMode=="week"'>
            <div    class="slaveM _24 text divfocus" id='dataselecbox' :Style="stylerwd(size[0],size[1],0,100)" v-show="flag">
                <div class="slaveC selectMain _24" :Style="stylerwd(20,14,0 ,0)"                   @click="_sub('month')" ><</div>
                <div class="slaveC selectMain _24" :Style="stylerwd(20,14,80,0)" id='dataselecadd' @click="_add('month')"  v-show="!select_flag||!(month == today.getMonth()+1 && year == today.getFullYear())">></div>
                <div class="slaveC selectMain" :Style="stylerwd(56,16,22,0)"                       @click="__onup('week' ,year ,month)">{{year}}-{{month}}</div>
                <div class="slaveC" :Style="stylerwd(14,12,ind*14 + 1,14)" v-for="(item2,ind) in weekindex" :key="item2">{{item2}}</div>
                <div v-for="(itemY,Y) in y" :key="itemY">
                    <div class='slaveC' v-if="Y*x<item.length" :Style="stylerwd(100,12,0 ,26 + Y * 12)">
                        <div class='selectMain':Style="stylerwd()" v-if='item[Y*x]<=dateflag' @click="__ondown('week' , year , month , item[Y*x])" >
                            <div v-for="(itemX,X) in x" :key="itemX">
                                <div v-if="X+Y*x <item.length && item[X+Y*x] != ''">
                                    <div class="slaveC " :Style="stylerwd(14,100,1 + X * 14 ,0)" >{{item[X+Y*x]}}</div>
                                </div>
                            </div>
                        </div>
                        <div class='noselMain':Style="stylerwd()" v-else>
                            <div v-for="(itemX,X) in x" :key="itemX">
                                <div v-if="X+Y*x <item.length && item[X+Y*x] != ''">
                                    <div class="slaveC " :Style="stylerwd(14,100,1 + X * 14 ,0)">{{item[X+Y*x]}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        
        <div class="slaveC" :Style="stylerwd()" v-show='nowMode=="month"'>
            <div    class="slaveM _24 text divfocus" id='dataselecbox' :Style="stylerwd(size[0],size[1],0,100)" v-show="flag">
                <div class="slaveC selectMain _24" :Style="stylerwd(20,14,0 ,0)"                   @click="_sub('year')" ><</div>
                <div class="slaveC selectMain _24" :Style="stylerwd(20,14,80,0)" id='dataselecadd' @click="_add('year')"  v-show="!select_flag||year != today.getFullYear()">></div>
                <div class="slaveC selectMain" :Style="stylerwd(56,16,22,0)"      id='noclick'                 @click="__onup('month' ,year)">{{year}}</div>
                <div class="slaveC" v-for="(itemMonth,index) in monthindex" :Style="stylerwd(25,28,(index%4)*25,parseInt(index/4) * 28 + 16)" :key="itemMonth" >
                    <div class="slaveC selectMain" :Style="stylerwd()" v-if='!select_flag||!(index > today.getMonth() && year >= today.getFullYear())' @click="__ondown('month' , year , index+1)">{{itemMonth}}</div>
                    <div class="slaveC noselMain " :Style="stylerwd()" v-else>{{itemMonth}}</div>
                </div>
            </div>
        </div>
        
        
        <div class="slaveC" :Style="stylerwd()" v-show='nowMode=="year"'>
            <div    class="slaveM _24 text divfocus" id='dataselecbox' :Style="stylerwd(size[0],size[1],0,100)" v-show="flag">
                <div class="slaveC" v-for="(itemMonth,index) in parseInt(4)" :Style="stylerwd(25,28,(index%4)*25,parseInt(index/4) * 28 + 16)" :key="itemMonth" >
                    <div class="slaveC selectMain" :Style="stylerwd()" v-if='!select_flag' @click="__ondown('year' , nowyear - 4  + index)">{{nowyear - 4 + index}}</div>
                    <div class="slaveC selectMain " :Style="stylerwd()" v-else             @click="__ondown('year' , nowyear - 2 + index)">{{nowyear  - 2 + index}}</div>
                </div>
                
            </div>
        </div>
        <div    class="slaveC _24 text display"  id='dataselecbutt':Style="stylerwd()" @click="_on(!flag)">{{show_date}}</div>
    </div>
</template>

<script>


export default {
    components: {

    },
	data() {
		return {

            flag : false,
            show_date : new Date().getFullYear() + '-' +  (new Date().getMonth()+1) + '-' + new Date().getDate(),
            today : new Date(),
            dateflag : 0,
            //當前模式
            nowMode : 'day',
            //模式比重(大的不能超過小的)
            Modepr : {
                        'day'   : 0,
                        'week'  : 1,
                        'month' : 2,
                        'year'  : 3
                    },
            item:[],
            x : 7,
            y : 6,
            year  :0,
            nowyear : 0,
            yearMAX  :[],
            month :0,
            
		};
	},
    props: {
        sid: {
            type: String,
            default: ''
        },
        //模式，支援 day , week , month , year
        mode: {
            type: String,
            default: 'day'
        },
        //選擇的時間
        select_date: {
            type: Object,
            default: function () {
                return {'year' : 0, 'month' : 0, 'day': 0 }
            }
        }, 
        //周顯示的文字
        weekindex: {
            type: Array,
            default: function () {
                return ["Mon" ,"Tue","Wed","Thu","Fri","Sat","Sun"]
            }
        }, 
        //周顯示的文字
        monthindex: {
            type: Array,
            default: function () {
                return ["JAN" ,"FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"]
            }
        }, 
        //大小 用百分比算，100等於按鈕的大小 ，格式[w,h]
        size: {
            type: Array,
            default: function () {
                return [120,700]
            }
        }, 
        //是否今天以後不能選 true = 是，預設是
        select_flag: {
            type: Boolean,
            default: true,
        }    
    },
	mixins: [],
	created() {
        //判斷按離開事件
        document.addEventListener("click" , e =>{
            let need = ['dataselecbox','dataselecadd','dataselecbutt' , 'dataselectmain' + this.sid]
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
        this.select_date.year  = this.today.getFullYear()
        this.select_date.month = this.today.getMonth()+1
        this.select_date.day   = this.today.getDate()
		this.__init__();
	},
	computed:{
        stylerwd: function(){
            return function(w=100,h=100,k=0,t=0 ,f =0){
                /*
                    f = 0 不做事情
                    f = 1 根據 max & percentage 百分比 去調整 長度
                */
                switch(f){
                    case 1:
                        if(this.item.length > this.max ){
                            h = this.max * this.percentage
                        }else if(this.item.length == 0){
                            h = this.percentage
                        }else{
                            h = this.item.length * this.percentage
                        }
                        break ;
                }
                return "width: "+w+"%;height:"+h+"%;left:"+k+"%;top:"+t+"%;"; 
            }
        },
    },
	methods: {
        //初始化
        __init__(){
            
            this.year  = this.select_date.year
            this.month = this.select_date.month
            let data = 32
            if(this.select_flag && this.month == this.today.getMonth()+1 && this.year == this.today.getFullYear()){
                
                data =  this.today.getDate()
            }
            this.nowyear = this.today.getFullYear()
            this._change(this.select_date.year , this.select_date.month , data );
            
        },
        //轉換樣板
        _change(year , month , day = 32, week){
            if(this.select_flag){
                if(this.month == this.today.getMonth()+1 && this.year == this.today.getFullYear()){
                    day = this.today.getDate()
                }
            }
            switch(this.nowMode){
                case 'day':
                case 'week':
                    this.item = []
                    //計算1號為星期幾，-1是因為月份從1月開始算
                    var tmp = new Date(year , month - 1 , 1).getDay()
                    //周一為0
                    if(tmp == 0){
                        tmp = 6
                    }else{
                        tmp -- ;
                    }
                    for(let i = 0 ; i <  tmp ; i ++){
                        this.item.push('')
                    }
                    let last = new Date(year , month  , 1)
                    
                    last.setDate(0)
                    last = last.getDate()
                    for(let i = 0 ; i <  last ; i ++){
                        this.item.push(i + 1)
                    }
                    this.dateflag = day;
                    console.log(this.item)
                    break;
                
            }
            
        },
		//+月/年 (month,year)
        _add(mode){
            switch(mode){
                case 'month':
                    this.month ++;
                    if(this.month > 12){
                        this.month = 1;
                        this.year ++;
                    }
                    
                    this._change(this.year , this.month );
                    break;
                case 'year':
                    
                    if(this.select_flag){
                        if(this.year != this.today.getFullYear()){
                            this.year ++;
                        }
                    }else{
                        this.year ++;
                    }
                    this._change(this.year , this.month);
                    break;
            }
        },
        //-月/年 (month,year)
        _sub(mode){
            switch(mode){
                case 'month':
                    this.month --;
                    if(this.month == 0){
                        this.month = 12;
                        this.year --;
                    }
                    let day = 32 
                    if(this.select_flag){
                        if(this.month == this.today.getMonth()+1 && this.year == this.today.getFullYear()){
                            day = this.today.getDate()
                        }
                    }
                    this._change(this.year , this.month , day);
                    break;
                case 'year':
                    this.year --;
                    this._change(this.year , this.month);
                    break;
            }
        },
        _on(item){
            this.nowMode = this.mode
            this.__init__();
            this.flag = item
        },
        __ondown(mode , year = 1 , month = 1, day = 1){
            //如果當前模式是最後模式
            if(mode == this.mode){
                let tmp = []
                if(mode == 'year'){
                    month = 12
                    day = 31
                    tmp = [year]
                }else if(mode == 'month'){
                    let last = new Date(year , month  , 1)
                    last.setDate(0)
                    last = last.getDate()
                    day = last
                    tmp = [year,month,]
                }else{
                    tmp = [year , month , day]
                }
                this.show_date = tmp.join('-')
                //紀錄目前選擇的
                this.select_date.year  = year;
                this.select_date.month = month;
                this.select_date.day   = day;
                this.flag = false
            }else{
                switch(mode){
                    case 'year':
                        this.nowMode = 'month'
                        break;
                    case 'month':
                        this.nowMode = this.mode
                        break;
                }
                this.year = year
                this.month = month
                this._change(year , month )
            }
            
        },
        __onup(mode, year = 1 , month = 1, day = 1){
            switch(mode){
                case 'month':
                    this.nowMode = 'year'
                    break;
                case 'week':
                    this.nowMode = 'month'
                    break;
                case 'day':
                    this.nowMode = 'month'
                    break;
            }
            this._change(year , month , day)
        },
	}
};
</script>

<style scoped>
.display{
    display: flex;
    align-items: center;
    justify-content: space-around;
    color:#ffffff;
}
.selectMain {
    box-shadow:inset 0px 0px 0px 2px #103971;
    color:#ffffff;
    background: #103971;
    display: flex;
    align-items: center;
    justify-content: space-around;
    
}
.selectMain:hover {
  box-shadow:inset 0px 0px 0px 2px #02d7d7;
  color:#ffff33;
}
.noselMain {
    color:#808004;
    display: flex;
    align-items: center;
    justify-content: space-around;
}
.todayMain {
    box-shadow:inset 0px 0px 0px 2px #A0B9BF;
    color:#103971;
    background: #A0B9BF;
    display: flex;
    align-items: center;
    justify-content: space-around;
    
}
.todayMain:hover {
  box-shadow:inset 0px 0px 0px 2px #000000;
  color:#000000;
}
.divfocus{
    border-style:outset;
    border-color:#aaaaee;
    background: inherit;
    background:#103971;
}
.boxnb {
    box-shadow: 0px 0px 0px 3px #192f6e;
}
.boxnb:hover {
  background: #9F9F92;
}
.boxitem {
    background: #357ce0;
    color:#FFFFFF;
}
.boxitem_cli {
  background: #2160b8;
  color:#ffff33;
  
}
.divfocus::-webkit-scrollbar {
  width: 10px;
}

.divfocus::-webkit-scrollbar-thumb {
  background-color: #4285f4 !important;
  border-radius: 10px !important;
}
.divfocus::-webkit-scrollbar-track {
  background: #f5f5f5 !important;
  border-radius: 10px !important;
}
</style>