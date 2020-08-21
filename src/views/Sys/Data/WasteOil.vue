<template>
    <div class="point-loss-analysis-pages">  
        <div class="boxtitle">数据档案 > 废油回收报表</div>
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
                        <el-table :data="tableData.rows" border  empty-text="暂无数据" >
                            <el-table-column
                                prop="retrieve_date"
                                label="日期"
                                min-width="120">
                            </el-table-column>
                            <el-table-column
                                label="废油回收"
                                min-width="120">
                                <el-table-column
                                    prop="waste_weight"
                                    label="废油回收量( Kg )"
                                    min-width="120">
                                </el-table-column>
                                <el-table-column
                                    prop="shipper_sign"
                                    label="废油收运人签名"
                                    min-width="120">
                                </el-table-column>
                            </el-table-column>
                            <el-table-column
                                prop="manager_sign"
                                label="值班经理签名"
                                min-width="100">
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
                            data: "2"
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
            listLoading:false,
            tableData:{
                rows:[],
                records:0
            },
            orgId:"",
            isShop:false,
            times:[]
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
            }
            this.listLoading = true
            this.params.filters.rules[0].data = this.orgId
            this.$api.data.queryRubbishRecycleOrWasteOil(this.params).then(res=>{
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
        //下载报告
        downloadFile(){

        }
    }
    
}
</script>
