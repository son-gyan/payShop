<template>
    <div class="point-loss-analysis-pages">  
        <div class="boxtitle">数据档案 > 详细故障统计</div>
        <el-container>
            <search-tree v-model="Treeid" :valuelist="true"></search-tree>
            <el-main>
                <div class="formBG">
                    <el-form ref="form" :inline="true" label-width="90px">
                        <el-form-item label="设备名称">
                            <el-select v-model="deviceName" placeholder="请选择"  @change="handleChangeDevice">
                                <el-option
                                    v-for="item in selectList"
                                    :key="item.id"
                                    :label="item.id"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="时间段"  class="timesWrap">
                            <el-date-picker
                                v-model="times"
                                value-format="yyyy-MM-dd"
                                type="daterange"
                                range-separator="-"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                :picker-options="pickerOptions"
                                >
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item>
                            <el-button class="buttonInit" icon="el-icon-search" @click="searchFreezer">{{ $t('button.query') }}</el-button>
                        </el-form-item>
                    </el-form>
                    <div class="boxList" v-loading="listLoading">
                        <div style="width:100%;height:400px; margin: 0 auto" >
                            <div id="container" style="height:100%"></div>
                        </div>
                        <div style="width:100%;height:300px; margin: 0 auto" >
                            <div id="container1" style="height:100%"></div>
                        </div>
                    </div>
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
            Treeid: {},
            selectList:[],
            deviceName:"",
            paramsForm:{
                deviceName: "",
                endDate: "",
                groupId: "",
                startDate: "",
            },
            listLoading:false,
            orgId:"",
            isShop:false,
            isShowTemp:true,
            times:[],
            pickerOptions:{
                shortcuts: [
                    {
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, 
                    {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }
                ]
            }
        }
    },
    watch: {
        Treeid(val) {
            if(val.isLeaf == "1"){ 
                this.isShop = true 
                this.orgId = val.id;
            }else{
                this.isShop = false 
            }
        }
    },
    created(){
        this.getSelect();
        this.getTime();
    },
    methods:{
        //设置默认时间
        getTime(){
            let starttime = new Date();
            starttime.setTime(starttime.getTime() - 3600 * 1000 * 24 * 7);
            let dt = new Date(starttime);
            let year = dt.getFullYear();
            let month = dt.getMonth() + 1;
            let day = dt.getUTCDate();
            starttime = `${year}-${month}-${day}`
            let endtime = new Date()
            let yearEnd = endtime.getFullYear();
            let monthEnd = endtime.getMonth() + 1;
            let dayEnd = endtime.getUTCDate();
            endtime = `${yearEnd}-${monthEnd}-${dayEnd}`
            this.times.push(starttime)
            this.times.push(endtime)
        },
        //获取选择框设备列表数据
        getSelect(){
            this.$api.data.getDeviceSelect().then(res=>{
                if(res.data.resCode == 0){
                    this.selectList = res.data.data
                    if(this.selectList.length>0){
                        this.deviceName =  this.selectList[0].id
                    }
                }else{
                    this.$message({
                        message: res.data.resMsg,
                        type: 'error'
                    })
                }
            }).catch((res) => {
                this.$message({
                    message: res.data.resMsg,
                    type: 'error'
                })
            });
        },
        //初始化数据列表
        searchFreezer(){
            //debugger
            if(!this.isShop){           
                this.$message({
                    message: this.$t('message.storeSelect'),
                    type: 'error'
                })
                return
            }
            if(this.times==null||this.times.length==0){
                this.$message({
                    message: this.$t('message.timesSelect'),
                    type: 'error'
                })
                return
            }
            var dataRange = this.times
            if (dataRange && dataRange.length > 0) {
                let ts = this.$utils.dateDiff('D', dataRange[0], dataRange[1])
                if(ts>30){
                    this.$message({
                        message: this.$t('message.overtime'),
                        type: 'error'
                    })
                    return
                }
                this.paramsForm.startDate = dataRange[0]
                this.paramsForm.endDate = dataRange[1]
            }
            this.listLoading = true
            this.paramsForm.groupId = this.orgId 
            this.paramsForm.deviceName = this.deviceName 
            this.$api.data.queryFaultDetailByProc(this.paramsForm).then(res=>{
                if(res.data.resCode == 0){
                    this.listLoading = false
                    this.echartList(res.data.data.charts,res.data.data.measures)
                }else{
                    this.listLoading = false
                    this.$message({
                        message: res.data.message,
                        type: 'error'
                    })
                }
            }).catch((res) => {
                this.listLoading = false
                this.$message({
                    message: res.message,
                    type: 'error'
                })
            });
        },
        // 下拉框切换
        handleChangeDevice(val){
            this.deviceName = val
        },
        //图表
        echartList(echartsData,measures){
            var dom = document.getElementById("container");
            var dom1 = document.getElementById("container1");
            var myChart = echarts.init(dom);
            var my_Chart = echarts.init(dom1);
            let option =null;
            let option1 =null;
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
            option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                color : ['#4f81bd ','#c0504d'],
                legend: {							 // 可填充 myChart.setOption({ legend :{data:data}})
                    orient: 'vertical',
                    x: 'right',
                    y: 'center',
                    data: ['正常','故障'],

                },
                grid: {
                    left: 100
                },
                toolbox: {
                    show: true,
                    right: '30',
                    itemSize:20,
                    feature: {
                        saveAsImage: {
                            }
                    }
                },
                xAxis: {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value}'
                    }
                },
                yAxis: {
                    type: 'category',
                    inverse: true
                },
                series: [
                    {
                        name: '正常',
                        type: 'bar',
                        stack:'总量',
                        label: seriesLabel,
                        data: []
                    },

                    {
                        name: '故障',
                        type: 'bar',
                        stack:'总量',
                        data: [],
                        label: seriesLabel,
                    }

                ]
            };
            option1 = {
                title : {
                    text: '',
                    x:'center'
                },
                tooltip : {       // 提示文字
                    trigger: 'item',
                    formatter: "{b} : {c} ({d}%)",
                },
                legend: {
                    orient: 'vertical',
                    left: 'right',
                    top : 'center'
                },
                series : [
                    {
                        type: 'pie',
                        radius : '55%',
                        center: ['50%', '60%'],
                        data:[],
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
            var title= [],
                arr1 =  [],   // 故障
                arr2 =  []; // 正常
            for(var i=0;i<echartsData.length;i++){
                title.push(echartsData[i].orgName);
                arr1.push(echartsData[i].defautNumber);
                arr2.push(echartsData[i].normalNumber);
            }
            myChart.setOption(option, true);
            my_Chart.setOption(option1, true);
            myChart.showLoading();
            my_Chart.showLoading();
            myChart.setOption({
                    title: {
                        text: this.deviceName+'-故障统计图表',
                        x:'center'
                    },
                    yAxis: {
                        data:  title
                    },
                    series : [
                        {
                            data : arr2
                        },
                        {
                            data : arr1
                        }
                    ]
                });
            var measuresList=[];
            var legenddata=[];
            for(var i=0;i<measures.length;i++){
                legenddata.push(measures[i].correctMeasure);
                measuresList.push({
                    name:measures[i].correctMeasure,
                    value:measures[i].mMumber
                })
            }
            my_Chart.setOption({
                title  : {
                    text : this.deviceName+'-纠偏措施占比',
                    x:'center'
                },
                legend: {
                    data: legenddata,    // 可填充 myChart.setOption({ legend :{data:data}})

                },
                series : [
                    {
                        data : measuresList
                    }
                ]
            });
            myChart.hideLoading();
            my_Chart.hideLoading();
        }
    }
    
}
</script>