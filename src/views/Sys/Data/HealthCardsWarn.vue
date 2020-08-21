<template>
    <div class="point-loss-analysis-pages">  
        <div class="boxtitle">数据档案 > 健康证预警及告警报表</div>
        <el-container>
            <search-tree v-model="Treeid" :valuelist="true"></search-tree>
            <el-main>
                <div class="formBG">
                    <el-form ref="form" :inline="true" label-width="90px">
                        <el-form-item class="radioWrap">
                            <el-radio-group v-model="radioVal" >
                                <el-radio :label="'1'">30天预警</el-radio>
                                <el-radio :label="'2'">过期告警</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="统计时间">
                            <el-date-picker
                                v-model="times"
                                value-format="yyyy-MM-dd"
                                type="date"
                                placeholder="统计时间"
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
                                prop="p1"
                                label="品牌">
                            </el-table-column>
                            <el-table-column
                                prop="p2"
                                label="区域">
                            </el-table-column>
                            <el-table-column
                                prop="p3"
                                label="子公司">
                            </el-table-column>
                            <el-table-column
                                prop="p4"
                                label="事业部">
                            </el-table-column>
                            <el-table-column
                                prop="p5"
                                label="营运专区">
                            </el-table-column>
                            <el-table-column
                                prop="shopName"
                                label="门店">
                            </el-table-column>
                            <el-table-column
                                prop="name"
                                label="姓名">
                            </el-table-column>
                            <el-table-column
                                prop="phoneCode"
                                label="电话号码"
                                min-width="120">
                            </el-table-column>
                            <el-table-column
                                prop="expiringDate"
                                label="到期日期"
                                min-width="120">
                            </el-table-column>
                            <el-table-column
                                label="照片">
                                <template slot-scope="scope">
                                    <el-button size="mini" icon="el-icon-view" type="primary" @click="viewPhoto(scope.row)"></el-button>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="remark"
                                label="备注"
                                min-width="180">
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
        <!-- 查看照片-->
        <el-dialog class="dialogWrap" 
            :close-on-click-modal='false' 
            :title="dialogTit" 
            :visible.sync="dialogVisible" 
            width="60%">
            <el-carousel indicator-position="outside" :height="imgHeight+'px'" style="text-align:center">
                <el-carousel-item v-for="item in imageUrlList" :key="item">
                    <img ref="image" :src="item" alt="" height="100%">
                </el-carousel-item>
            </el-carousel>
        </el-dialog>       
    </div>
</template>

<script>
import echarts from 'echarts'
export default {
    data(){
        return {
            Treeid: {},
            selectList:[],
            radioVal:"1",
            params:{
                rows: 10, 
                page: 1,  
                filters: {
                    rules: [
                        {
                            field: "groupId", 
                            data: ""
                        }, 
                        {
                            field: "early", 
                            data: "0"
                        }, 
                        {
                            field: "startDate", 
                            data: ""
                        }
                    ]
                }
            },
            paramsForm:{
                early: "",
                endDate: "",
                groupId: "",
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
            times:'',
            dialogTit:"查看照片",
            dialogVisible:false,
            imageUrlList:[],
            imgHeight: "400"
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
            let year = starttime.getFullYear();
            let month = starttime.getMonth() + 1;
            let day = starttime.getUTCDate();
            starttime = `${year}-${month}-${day}`
            this.times = starttime
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
            if(this.times==null||this.times==''){
                this.$message({
                    message: this.$t('message.timeSelect'),
                    type: 'error'
                })
                return
            }
            this.params.filters.rules[2].data = this.times
            this.paramsForm.startDate = this.times
            this.listLoading = true
            this.params.filters.rules[0].data = this.orgId
            this.params.filters.rules[1].data = this.radioVal
            this.paramsForm.groupId = this.orgId 
            this.paramsForm.early = this.radioVal 
            this.$api.data.queryHealthChart(this.paramsForm).then(res=>{
                if(res.data.resCode == 0){
                    //debugger
                    this.chartHeight = 400;
                    this.chartData = res.data.data
                    this.echartList(this.chartData,this.radioVal)
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
            this.$api.data.queryHealthWarnData(this.params).then(res=>{
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
        //查看图片
        viewPhoto(row){
            this.imageUrlList =  []
            this.imageUrlList = row.photoList
            this.imageUrlList = this.imageUrlList.map(i=>i.filePath)
            setTimeout(()=>{
                this.dialogVisible = true
            },200)
        },
        //图表
        echartList(data,sel){
            var dom = document.getElementById("echartWrap");
            var myChart = echarts.init(dom);
            myChart.resize({height:400}); 
            var arr1= new Array();
            var arr2= new Array();
            for(var i=0;i<data.length;i++){
                arr1.push(data[i].hc_number);
                arr2.push(data[i].org_name);
            }

            var title;
            var seriesN;
            var colorLen;
            var col;
            if(sel=="1"){
                title =  '健康证预警图表';
                seriesN= '预警';
                colorLen=['预警'];
                col=['#e8bf09'];
            }else{
                title =  '健康证告警图表';
                seriesN= '告警';
                colorLen=['告警'];
                col=['#c0504d'];
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
			    color : ['#e8bf09'],
			    legend: {
			    	orient: 'vertical',
			        x: 'right',
			        y: 'center',
			        data: ['预警'],      // 可填充 myChart.setOption({ legend :{data:data}})
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
			            name: '预警',
			            type: 'bar',
			            label: seriesLabel,
			            data: []
			        },

			    ]
			};
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
                            data : arr1,
                            name:seriesN
                        },
                    ],
                    legend: {
                        data: colorLen,      // 可填充 myChart.setOption({ legend :{data:data}})
                    },
                    color : col,
                });
            myChart.hideLoading();
        }
    }
    
}
</script>