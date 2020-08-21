<template>
    <div class="point-loss-analysis-pages">  
        <div class="boxtitle">数据档案 > 教育培训记录报表</div>
        <el-container>
            <search-tree v-model="Treeid" :valuelist="true"></search-tree>
            <el-main>
                <div class="formBG">
                    <el-form ref="form" :inline="true" label-width="90px">
                        <el-form-item label="时间段" class="timesWrap">
                            <el-date-picker
                                v-model="times"
                                value-format="yyyy-MM-dd"
                                type="daterange"
                                range-separator="-"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
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
                                prop="trn_date"
                                label="日期"
                                min-width="120">
                            </el-table-column>
                            <el-table-column
                                prop="trn_place"
                                label="地点"
                                min-width="180">
                            </el-table-column>
                            <el-table-column
                                prop="trn_theme"
                                label="培训主题">
                            </el-table-column>
                            <el-table-column
                                prop="lecturer"
                                label="讲师签字">
                            </el-table-column>
                            <el-table-column
                                prop="duration"
                                label="授课时长">
                            </el-table-column>
                            <el-table-column
                                prop="emp_name"
                                label="听课人签字">
                            </el-table-column>
                            <el-table-column
                                prop="numb"
                                label="听课人数">
                            </el-table-column>
                            <el-table-column
                                prop="remarks"
                                label="备注">
                            </el-table-column>
                            <el-table-column
                                prop="status"
                                label="详情">
                                <template  slot-scope="scope">
                                    <el-button size="mini" type="primary" @click="viewDetail(scope.row.id)">详情</el-button>
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
        <!--详情弹窗-->
        <el-dialog :close-on-click-modal='false' :title="dialogTit" :visible.sync="dialogVisible" width="40%">
            <div class="mainDialog" >
                <el-row class="elRow" v-if="dialogData.table.length>0">
                    <el-col :span="12">
                        <div class="li">
                            <span>培训日期 :</span>
                            <span>{{dialogData.table[0].trn_date}}</span>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="li">
                            <span>讲师签字 : </span>
                            <span>{{dialogData.table[0].lecturer}}</span>
                        </div>
                    </el-col>
                </el-row>
                <el-row class="elRow" >
                    <el-col :span="8" v-for="(item,index) in dialogData.tables1" :key="index">
                        <el-col :span="12">
                            <div class="smBlock">
                                <p>人员签到</p>
                                <p>{{item.emp_name}}</p>
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div class="smBlock">
                                <p>考核成绩</p>
                                <p>{{item.emp_score}}</p>
                            </div>
                        </el-col>
                    </el-col>                    
                </el-row>
                <el-row class="elRow borderTop" v-if="dialogData.table.length>0">
                    <el-col :span="16">
                        <el-row>
                            <div class="ftLi">
                                <span>培训主题 :</span><span>{{dialogData.table[0].trn_theme}}</span>
                            </div>
                        </el-row>
                        <el-row>
                            <div class="ftLi noBorderBottom">
                                <span>培训内容 : </span>
                                <p>{{dialogData.table[0].trn_content}}</p>
                            </div>
                        </el-row>
                    </el-col>
                    <el-col :span="8" class="ftLi noBorderBottomRight">
                        <span >备注: </span>
                        <p>{{dialogData.table[0].remarks}}</p>
                    </el-col>
                </el-row>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible=false">{{ $t('button.cancel') }}</el-button>
                <el-button type="primary" @click="downloadFile">{{ $t('button.downloadReport') }}</el-button>
            </span>
        </el-dialog>         
    </div>
</template>

<script>
import echarts from 'echarts'
export default {
    data(){
        return {
            Treeid: {},
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
                            data: "1"
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
                chartType: "1",
                endDate: "",
                shopId: "",
                startDate: "",
            },
            listLoading:false,
            chartData:[],
            tableData:{
                rows:[],
                records:0
            },
            dialogData:{
                table:[],
                tables1:[]
            },
            orgId:"",
            isShop:false,
            times:[],
            dialogTit:"教育培训报表详情",
            dialogVisible:false
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
            this.paramsForm.shopId = this.orgId 
            this.$api.data.queryEduDataJz(this.paramsForm).then(res=>{
                if(res.data.resCode == 0){
                    //debugger
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
            this.$api.data.queryEduData(this.params).then(res=>{
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
        //详情
        viewDetail(id){
            let param = {
                excute_id: id
            }
            this.$api.data.queryEduDataDetails(param).then(res=>{
                if(res.data.resCode == 0){
                    this.dialogData = res.data.data
                    this.dialogVisible = true
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
        //下载报告
        downloadFile(){

        },
        //图表
        echartList(data){
            var dom = document.getElementById("echartWrap");
            var myChart = echarts.init(dom);
            myChart.resize({height:400}); 
            myChart.clear();
            var arr1= new Array();
            var arr2= new Array();
            for(var i=0;i<data.length;i++){
                arr1.push(data[i].numb);
                arr2.push(data[i].org_name);
            }

            var seriesLabel = {
			    normal: {
			        show: true,
			        textBorderColor: '#333',
			        textBorderWidth: 2
			    }
			}
            let option = {
			    tooltip: {
			        trigger: 'axis',
			        axisPointer: {
			            type: 'shadow'
			        }
			    },
			    color : ['#4f81bd'],
			    legend: {
			    	orient: 'vertical',
			        x: 'right',
			        y: 'center',
			        data: ['培训次数'],      // 可填充 myChart.setOption({ legend :{data:data}})
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
			            name: '培训次数',
			            type: 'bar',
			            label: seriesLabel,
			            data: []
			        },

			    ]
			};
            var title = '教育培训统计';
            myChart.setOption(option, true);
            myChart.showLoading();
            myChart.setOption({
                title  : {
                    text : title,
                    x:'center'
                },
                yAxis: {
                    data:arr2
                },
                series : [
                    {
                        data : arr1
                    },
                ]
            });
            myChart.hideLoading();
        }
    }
    
}
</script>
<style lang="less" scoped>
    .mainDialog{
        border: 1px solid #eee;
        .elRow{
            line-height: 36px;
            .li{
                padding-left: 20px;
                border-bottom: 1px solid #eee;
                border-right:1px solid #eee;
            }
            .ftLi{
                padding-left: 15px;
                border-right:1px solid #eee;
                border-bottom: 1px solid #eee;
                &.noBorderBottom{
                    border-bottom: none;
                }
                &.noBorderBottomRight{
                    border-bottom: none;
                    border-right: none;
                }
                p{
                    min-height:200px;
                    line-height:14px;
                }
            }            
            .smBlock{
                p{                    
                    border-bottom: 1px solid #eee;
                    border-right:1px solid #eee;
                    text-align: center;
                }
            }
        }

        .borderTop{
            border-top: 1px solid #eee;
        }        
        .borderBottom{
            border-bottom: 1px solid #eee;
        }
    }
</style>
