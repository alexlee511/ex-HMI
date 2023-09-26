<template>
    <div id="chartId" style="width: 100%; height: 100%"></div>
</template>

<script>
import echarts from "echarts"

const colors = [
    "#43f018",
    "#f0ec18",
    "#18f0ba",
    "#18daf0",
    "#f018f0",
    "#3ba272",
    "#fc8452",
    "#9a60b4",
    "#ea7ccc"
];

const colors2 = [
    "#5A7D7C",
    "#DADFF7",
    "#A0C1D1",
    "#B5B2C2",
    "#F7DBA7",
    "#EDD4B2",
    "#D0A98F",
    "#CAC2B5",
    "#ECDCC9",
    "#ACBDBA"
];
export default{
    name: "dataChart",
    data(){
        return{
            chart_type: null,   // 圖形樣式
            x_val: null,        // Array: 時間列表
            y_val: null,        // Object: key -> 項目名稱, value -> 項目數據列表
        }
    },
    methods: {
        clearChart(){
            echarts.init(document.getElementById('chartId')).dispose();
        },
        autoFontSize(){
            let width = document.getElementById('chartId').offsetWidth;
            let newFontSize = Math.round(width / 40);;
            return newFontSize;
        },
        //datalist  = [{value:"百分比",name:"名稱"}]
        //item      = series 裡面的數據
        //ex        = 剩下的設定
        createPie(datalist , item = {} , ex = {}){
            var chart = echarts.init(document.getElementById('chartId'));
            // resize the chart size
            window.onresize = function(){
                chart.resize();
            }
            var option = {
                tooltip: {
                    trigger: 'item',
                    formatter:"{a}<br\/>{b}:{c}%",
                },
                legend: {
                    top: '5%',
                    left: 'left',
                    orient:'vertical',
                    textStyle:{
                        fontSize    : this.autoFontSize(),
                        color       :'#01FFFF'
                    }
                    
                },
                series: [
                    {
                    name: 'Kwh',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    label: {
                        show: false,
                        position: 'center',
                    },
                    emphasis: {
                        label: {
                        show: true,
                        fontSize: '40',
                        fontWeight: 'bold',
                        color :'#01FFFF'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data:[],
                    }
                ]
                };
            //option.series[0] = Object.assign(option.series[0], item)
            let index = 0;
            for(let data of datalist){
                option.series[0].data.push(Object.assign(data, {itemStyle:{color:colors2[index]}}))
                index ++ ;
            }
            
            option.series[0] = Object.assign(option.series[0], item)
            option = Object.assign(option, ex)
            chart.setOption(option );
        },
        //datalist = [{name:"本期/去年同期" , data: [{y_val:"數值",x_val:"裝置名稱"}],}]
        //item = x_val的順序
        createBar(datalist ,item = [] , type = 'bar', seriess = {}, ex = {}){
            var chart = echarts.init(document.getElementById('chartId'));
            // resize the chart size
            window.onresize = function(){
                chart.resize();
            }
            let series = []
            let tmp = {}
            for(let i of item){
                tmp[i] = {product:i}
            }
            
            let dataset =  {
                dimensions: ['product'],
                source: []
            }
            let index = 0;
            for(let i of datalist){
                dataset.dimensions.push(i.name)
                series.push({connectNulls: true,type: type ,itemStyle:{color:colors[index]}})
                for(let j of i.data){
                    if(tmp[j.x_val] != undefined){
                        tmp[j.x_val][i.name] = j.y_val
                    }
                }
                series[index] = Object.assign(series[index], seriess);
                index ++;
            }
            for(let i of item){
                dataset.source.push(tmp[i])
            }
            
            var option = {
                legend: {   top: '5%',
                            textStyle: {
                                color: '#01ffff',
                                fontSize: 16,
                            }},
                tooltip: {
                    axisPointer: {
                        type: 'cross'
                    }
                },
                textStyle: {
                    color: "#01ffff",
                    height: '55'
                },
                dataset : dataset,
                xAxis: { 
                    type: 'category' 
                    
                },
                yAxis: {
                    axisLabel: {
                        show: true,
                        fontSize: 16
                    }
                },
                series: series
                
            }
            //合併但只會有一層
            for(let i of Object.keys(ex)){
                if(option[i] != undefined){
                    option[i] = Object.assign(option[i], ex[i])
                }else{
                    option[i] = Object.assign({}, ex[i])
                }
            }
            //let option2 = Object.assign(option, ex)
            console.log(option)
            chart.setOption(option );
            return chart
            
        },
        
        
        createChart(){
            if(this.x_val.length == 0)
                return;

            let index = 0;
            let seriesArr = [];
            let labelArr = Object.keys(this.y_val); // define all of the obj's key as label
            for(let [dataName, dataArr] of Object.entries(this.y_val)){
                seriesArr.push({
                    type: this.chart_type,
                    name: dataName,
                    data: dataArr,
                    symbolSize: 8,
                    itemStyle: {
                        normal: {
                            color: colors[index],
                            lineStyle: {
                                width: 4,
                                color: colors[index++]
                                // if there are mutiple line chart, it can display different color
                            }
                        }
                    }
                })
            }

            var chart = echarts.init(document.getElementById('chartId'));
            // resize the chart size
            window.onresize = function(){
                chart.resize();
            }
            var option = {
                grid : {
                    top: "5%",
                    left: 80,
                    right: "3%",
                    bottom: "10%"
                },
                tooltip: {
                    mode: 'index',
                    trigger: 'axis',
                    intersect: false,
                    titleFontSize: 20,
                    bodyFontSize: 18
                },
                legend: {
                    data: labelArr,
                    textStyle: {
                        color: '#ffffff',
                        fontSize: 16,
                    }
                },
                textStyle: {
                    color: "#ffff03"
                },
                xAxis: {
                    type: 'category',
                    data: this.x_val,
                    boundaryGap: false,
                },
                yAxis: {
                    type: 'value',
                    axisLabel: { formatter: "{value}" }
                },
                series: seriesArr,
            }

            chart.setOption(option);
        }
    }
}
</script>
