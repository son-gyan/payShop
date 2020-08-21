<template>
    <div class="point-loss-analysis-pages">  
        <div class="boxtitle">数据档案 > 台账预警及告警报表</div>
        <el-container>
            <search-tree v-model="Treeid" :valuelist="true"></search-tree>
            <el-main>
                <div class="formBG">
                    <el-form ref="form" :inline="true" label-width="90px">
                        <el-form-item class="radioWrap">
                            <el-radio-group v-model="radioVal" >
                                <el-radio :label="'0'">全部</el-radio>
                                <el-radio :label="'1'">30天预警</el-radio>
                                <el-radio :label="'2'">过期告警</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="时间段" class="timesWrap">
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
                            <el-button class="buttonInit" icon="el-icon-search" @click="searchData">{{ $t('button.query') }}</el-button>
                        </el-form-item>
                    </el-form>
                    <div class="boxList" v-loading="listLoading">                        
                        <div id="echartWrap"></div>
                        <el-table :data="tableData.rows" border  empty-text="暂无数据" >
                            <el-table-column 
                                type="index" 
                                label="序号" 
                                width="70" 
                                align="center" 
                                :index="indexMethod">
                            </el-table-column>
                            <el-table-column
                                prop="stock_date"
                                label="进货日期"
                                min-width="120">
                            </el-table-column>
                            <el-table-column
                                prop="product_name"
                                label="产品名称">
                            </el-table-column>
                            <el-table-column
                                prop="specification"
                                label="规格">
                            </el-table-column>
                            <el-table-column
                                prop="pro_count"
                                label="数量">
                            </el-table-column>
                            <el-table-column
                                prop="manufacturer"
                                label="生产厂商名称">
                            </el-table-column>
                            <el-table-column
                                prop="manufacturer_addr"
                                label="厂商地址">
                            </el-table-column>
                            <el-table-column
                                prop="contact_way"
                                label="联系方式"
                                min-width="120">
                            </el-table-column>
                            <el-table-column
                                prop="produced_date"
                                label="生产日期"
                                min-width="120">
                            </el-table-column>
                            <el-table-column
                                prop="guarantee_period"
                                label="保质期(天)">
                            </el-table-column>
                            <el-table-column
                                prop="check_accept"
                                label="验收情况">
                            </el-table-column>
                            <el-table-column
                                prop="check_accept_signature"
                                label="验收人签名">
                            </el-table-column>
                            <el-table-column
                                prop="status"
                                label="状态">
                                <template  slot-scope="scope">
                                    <span v-if="scope.row.status == '1'">正常</span>
                                    <span v-if="scope.row.status == '2'">预警</span>
                                    <span v-if="scope.row.status == '3'">告警</span>
                                    <span v-if="scope.row.status == '4'">已更新</span>
                                    <span v-if="scope.row.status == '5'">已处理</span>
                                    <span v-if="scope.row.status == '6'">已用完</span>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="fenye">
                            <span class="demonstration"></span>
                            <el-pagination background 
                                @size-change="handleSizeChange" 
                                @current-change="handleCurrentChange" 
                                :current-page="params.page"
                                :page-sizes="[10, 20, 30, 40,50]" 
                                :page-size="10" 
                                layout="total, sizes, prev, pager, next, jumper" 
                                :total="tableData.records==''?0:tableData.records">
                            </el-pagination>
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
            radioVal:"0",
            params:{
                rows: 10, 
                page: 1,  
                filters: {
                    rules: [
                        {
                            field: "shopId", 
                            data: ""
                        }, 
                        {
                            field: "chartType", 
                            data: "0"
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
                chartType: "",
                endDate: "",
                shopId: "",
                startDate: "",
            },
            listLoading:false,
            chartHeight:0,
            chartData:[],
            tableData:{
                rows:[],
                records:0
            },
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
        this.getTime()
    },
    methods:{
        //设置默认时间段
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
        //初始化数据列表
        searchData(){
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
            this.params.filters.rules[1].data = this.radioVal
            this.paramsForm.shopId = this.orgId 
            this.paramsForm.chartType = this.radioVal 
            this.$api.data.queryAcountInfoSndAll(this.paramsForm).then(res=>{
                if(res.data.resCode == 0){
                    //debugger
                    this.chartHeight = 400;
                    this.chartData = res.data.data.tables
                    this.echartList(this.chartData)
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
            this.$api.data.queryAcountInfoSndWeb(this.params).then(res=>{
                this.listLoading = false
                if(res.data.resCode == 0){
                    //debugger
                    this.tableData = res.data.data
                }else{
                    this.$message({
                        message: res.data.resMsg,
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
            this.searchData();
        },
        //分页页码切换
        handleCurrentChange(val) {
            this.params.page = val;
            this.searchData();
        },
        //图表
        echartList(data){
            var dom = document.getElementById("echartWrap");
            var myChart = echarts.init(dom);
            myChart.resize({height:400}); 
            var arr1= new Array();
            var arr2= new Array();
            var arr3= new Array();
            var arr4= new Array();
            // var arr5= new Array();
            // var arr6= new Array();
            var arr7= new Array();
            if (!data){return }
            for(var i=0;i<data.length;i++){
                arr1.push(data[i].normal_number);
                arr2.push(data[i].org_name);
                arr3.push(data[i].pre_warn_number);
                arr4.push(data[i].alarm_number);
                // arr5.push(data[i].updated_number);
                // arr6.push(data[i].prod_number);
                arr7.push(data[i].run_out_number );
            }

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
            let option = {
			    tooltip: {
			        trigger: 'axis',
			        axisPointer: {
			            type: 'shadow'
			        }
			    },
			    color : ['#4f81bd','#e8bf09','#c0504d','#09e841','#9bbb59','#9e9e9e'],
			    legend: {
			    	orient: 'vertical',
			        x: 'right',
			        y: 'center',
			        data: ['正常','预警','告警','已用完'],      // 可填充 myChart.setOption({ legend :{data:data}})
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
			        //data: ['第一区域', '第二区域', '第三区域','第四区域','第五区域'],   // 可填充 myChart.setOption({ yAxis :{data:data}})
			    },
			    series: [
			        {
			            name: '正常',
			            type: 'bar',
			            label: seriesLabel,
			            stack:'总量',
			            data: []
			        },
			        {
			            name: '预警',
			            type: 'bar',
			            label: seriesLabel,
			            stack:'总量',
			            data: []
			        },
			        {
			            name: '告警',
			            type: 'bar',
			            label: seriesLabel,
			            stack:'总量',
			            data: []
			        },
			        //    {
			        //     name: '已更新',
			        //     type: 'bar',
			        //     label: seriesLabel,
			        //     stack:'总量',
			        //     data: []
			        // },
			        //   {
			        //     name: '已处理',
			        //     type: 'bar',
			        //     label: seriesLabel,
			        //     stack:'总量',
			        //     data: []
			        //  },
                    {
                        name: '已用完',
                        type: 'bar',
                        label: seriesLabel,
                        stack:'总量',
                        data: []
                    }
			    ]
			};
            var title =  '台账预警告警统计';
            myChart.setOption(option, true);
            myChart.showLoading();
            myChart.setOption({
                title  : {
                    text : title,
                    x:'center'
                },
                yAxis: {
                    data:  arr2
                },
                series : [
                    {
                        data : arr1
                    },
                    {
                        data : arr3
                    },
                    {
                        data : arr4
                    },
                    // {
                    // 	data : arr5
                    // },
                    // {
                    // 	data : arr6
                    // },
                    {
                        data : arr7
                    }
                ]
            });
            myChart.hideLoading();
        }
    }
    
}
</script>