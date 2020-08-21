<template>
    <div class="point-loss-analysis-pages"> 
        <div class="boxtitle">数据档案 > 全国故障统计</div>
        <el-container>
            <el-main>
                <div style=" width: 100%; height: 500px; margin: 0 auto">
                    <div id="container" style="height: 100%"></div>
                </div>
                <div style="width:100%; height:400px; margin: 0 auto" >
                    <div id="container1" style="height:100%"></div>
                </div>
            </el-main>
        </el-container>  
    </div>
</template>
<script>
import echarts from 'echarts'
export default {
    data(){
        return {
            data:new Array(),
            colData:[],
            dataNormal:[],
            dataFault:[]
        }
    },
    created() {
        this.init()
    },
    methods:{
        //初始化数据
        init(){
            this.$api.data.queryDevicestateByProc().then(res=>{
                if(res.data.resCode === 0){
                    for(var i=0;i<res.data.length;i++)	{
                        var xyL=[res.data[i].point_x,res.data[i].point_y];
                        var dataMap={name:res.data[i].short_name,value:res.data[i].fault_count,total:res.data[i].normal_count+res.data[i].fault_count,xy:xyL};
                        this.data.push(dataMap);
                        this.colData.push(res.data[i].org_name);
                        this.dataNormal.push(res.data[i].normal_count);
                        this.dataFault.push(res.data[i].fault_count);
                        
                    }
                    /* var xyL=[121.1,30.8];
                    var dataMap={name:"沪",value:5,total:20,xy:xyL};
                    this.data.push(dataMap);
                    this.colData.push("A");
                    this.dataNormal.push("5");
                    this.dataFault.push("15"); */
                    this.drawMap();
                    this.drawLine();
                }else{
                    this.$message({
                        message: res.data.resMsg,
                        type: 'error'
                    })
                }
            }).catch((res) => {
                /* this.$message({
                    message: res.resMsg,
                    type: 'error'
                }) */
            });
        },
        //绘制图表1
        drawMap(){
            var myChart = echarts.init(document.getElementById("container"));
            let option1 = {
                backgroundColor: '#CCC',
                animation: true,
                animationDuration: 1000,
                animationEasing: 'cubicInOut',
                animationDurationUpdate: 1000,
                animationEasingUpdate: 'cubicInOut',
                tooltip: {
                    trigger: 'item',
                    formatter: function (params,ticket,callback){  //  提示文字
                        return '<span style="color:red;">'+params.data.name1 +": "+params.data.value[2]+"/"+params.data.value[3]+'</span>'
                    }
                },
                geo: {
                    map: 'china',
                    center: [104.114129, 37.550339],
                    zoom: 1,
                    roam: true,
                    label: {
                        emphasis: {
                            show: false
                        }
                    },
                    itemStyle: {
                        normal: {
                            areaColor: '#017054',               // 地图颜色 两种深黑灰
                            borderColor: '#ccc'
                        },
                        emphasis: {
                            areaColor: '#1b654f'  // hover 的颜色 深黑灰
                        }
                    }
                },
                series: [
                    {
                        // name: 'pm2.5',
                        type: 'scatter',
                        mapType: 'china',
                        coordinateSystem: 'geo',
                        //地理坐标系
                        data: this.convertData(this.data),          //填充的数据  myChart.setOption({ data :data}})
                        symbolSize: function(val) {
                            return Math.max(val[2] / 10, 8); // //标记的大小
                        },
                        label: {
                            normal: {
                                formatter: '{b}',
                                position: 'right',
                                show: true //站点地名的直接显示
                            },
                            emphasis: {
                                show: true //悬浮显示
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: 'red', //字体颜色
                                shadowBlur: 10,
                                shadowColor: '#333'   // 阴影
                            }
                        }
                    }
                ]
            };
            
            myChart.setOption(option1, true);
        },
        //处理数据
        convertData(data) {
            var res = [];
            for (var i = 0; i < data.length; i++) {
                var geoCoord = data[i].xy;
                if (geoCoord) {
                    res.push({
                    	name:'',
                        name1: data[i].name,
                        value: geoCoord.concat(data[i].value).concat(data[i].total)
                    });
                }
            }
            return res;
        },
        //绘制图表2
        drawLine(){
            var my_Chart = echarts.init(document.getElementById("container1"));
            var seriesLabel = {
                normal: {
                    show: true,
                    textBorderColor: '#333',
                    textBorderWidth: 2,
                    formatter: function (params) {
                        if (params.value > 0) {
                            return params.value;
                        } else {
                            return '';
                        }
                    },
                }
            }

            let option2 = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                color : ['#2f4554','#c23531'],
                legend: {
                    orient: 'vertical',
                    x: 'right',
                    y: 'center',
                    data: ['正常','故障'],      // 可填充 myChart.setOption({ legend :{data:data}})

                },
                grid: {
                    left: 100
                },
                toolbox: {
                    show: true,
                    right: '30',
                    itemSize:20,
                    feature: {
                        saveAsImage: {}
                    }
                },
                xAxis: {
                    type: 'value',
                    // name: 'Days',
                    axisLabel: {
                        formatter: '{value}'
                    }
                },
                yAxis: {
                    type: 'category',
                    inverse: true,
                    //data: ['上海分公司', '成都分公司', '北京分公司','广州分公司','郑州分公司'],    //可填充 myChart.setOption({ yAxis :{data:data}})
                    data:this.colData,
                },
                series: [
                    {
                        name: '正常',
                        type: 'bar',
                        stack:'总量',
                        label: seriesLabel,
                        //data: [150, 105, 110,200,300]
                        data:this.dataNormal
                    },
                    {
                        name: '故障',
                        type: 'bar',
                        stack:'总量',
                        //data: [10, 20, 30,40,20],
                        data:this.dataFault,
                        label: seriesLabel,
                    },

                ]
            };
            my_Chart.setOption(option2, true);
        }
    }
}
</script>