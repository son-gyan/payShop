<template>
    <div class="point-loss-analysis-pages">  
        <div class="boxtitle">数据档案 > 温度统计图表</div>
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
                        <div id="echartWrap" style="height:400px;"></div>
                        <el-table :data="freezerList2" border  empty-text="暂无数据"  v-if="freezerList2.length>0">
                            <el-table-column 
                                type="index" 
                                label="序号" 
                                width="100" 
                                align="center" 
                                :index="indexMethod">
                            </el-table-column>
                            <el-table-column
                                prop="dt_date"
                                label="记录时间"
                                min-width="180">
                            </el-table-column>
                            <el-table-column
                                v-for="(item,index) in freezerList1.options"
                                :key="index"
                                :prop="'devoption'+(index+1)"
                                :label="item"
                                min-width="180">
                            </el-table-column>
                        </el-table>
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
            params:{
                rows: 100, 
                page: 1,  
                filters: {
                    rules: [
                        {
                            field: "groupId", 
                            data: ""
                        }, 
                        {
                            field: "deviceName", 
                            data: ""
                        }, 
                        {
                            field: "startDate", 
                            data: ""
                        }, 
                        {
                            field: "endDate",  
                            data: ""
                        }
                    ]
                }
            },
            paramsForm:{
                deviceName: "",
                endDate: "",
                groupId: "",
                startDate: "",
            },
            listLoading:false,
            freezerList1:[],
            freezerList2:[],
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
                    message: res.response.data.content.resMsg,
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
                this.params.filters.rules[2].data = dataRange[0]
                this.params.filters.rules[3].data  = dataRange[1]
                this.paramsForm.startDate = dataRange[0]
                this.paramsForm.endDate = dataRange[1]
            }
            this.listLoading = true
            this.params.filters.rules[0].data = this.orgId
            this.params.filters.rules[1].data = this.deviceName
            this.paramsForm.groupId = this.orgId 
            this.paramsForm.deviceName = this.deviceName 
            this.$api.data.queryDeviceTempByProc(this.paramsForm).then(res=>{
                if(res.data.resCode == 0){
                    //debugger
                    this.freezerList1 = res.data.data
                    this.echartList(this.deviceName,this.freezerList1.x,this.freezerList1.y,this.freezerList1.options)
                }else{
                    this.$message({
                        message: res.message,
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
            this.$api.data.pageDeviceTempByProc(this.params).then(res=>{
                this.listLoading = false
                if(res.data.resCode == 0){
                    //debugger
                    this.freezerList2 = res.data.data.rows
                }else{
                    this.$message({
                        message: res.message,
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
        //序号转换
        indexMethod(index){
            return (index+1)+((this.params.page-1)*this.params.rows);
        },
        //分页项切换
        handleSizeChange(val) {
            this.params.rows = val;
            this.searchFreezer();
        },
        //分页页码切换
        handleCurrentChange(val) {
            this.params.page = val;
            this.searchFreezer();
        },
        // 下拉框切换
        handleChangeDevice(val){
            this.deviceName = val
        },
        //图表
        echartList(title,xList,yList,colNList){
            var dom = document.getElementById("echartWrap");
            var myChart = echarts.init(dom);
            var listCol=[];
            for(var i=0;i<colNList.length;i++){
                listCol.push({
                    name:colNList[i],
                    data:yList[i][colNList[i]]
                });
            }
            var  json = {
                week : xList,
                list : listCol
            }
            let option = {
                title: {
                    text: title
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data:[]       // 可填充 myChart.setOption({ legend :{data:data}})
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                toolbox: {
                    right: '30',
                    itemSize:20,
                    feature: {
                        saveAsImage: {}
                    }
                },
                xAxis: {                  // x 下面的值  如 ： ['7.1 12:00','7.2 12:00','7.3 12:00','7.4 12:00'],
                    type: 'category',
                    boundaryGap: false,
                    data: []              // 可填充 myChart.setOption({ xAxis :{data:data}})
                },
                yAxis: {
                    type: 'value',
                    name:'摄氏度'
                },
                series: [
                    /**
                        可填充 myChart.setOption({ series : data}});
                        series:填充数据是每一条 一个对象{};
                    **/
                ]
            }
            myChart.setOption(option, true);
			myChart.showLoading();
            var name = [],
                week =[],
                applySeriesdata = {},
                arrdata = [],
                week  =  json.week;
            for (var i = 0; i < json.list.length; i++) {
                name.push(json.list[i].name);
                applySeriesdata = {
                    name : json.list[i].name,
                    type:'line',
                    data : json.list[i].data
                }
                arrdata.push(applySeriesdata);
            };
            myChart.setOption({
                title  : {
                    text : title
                },
                legend : {
                    data : name
                },
                xAxis:{
                    data: week
                },
                yAxis:{
                    name:'摄氏度',
                },
                series : arrdata
            });
            myChart.hideLoading();
        }
    }
    
}
</script>