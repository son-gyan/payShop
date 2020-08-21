<template>
    <div class="point-loss-analysis-pages">  
        <div class="boxtitle">数据档案 > 虫鼠害防治记录报表</div>
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
                                type="index" 
                                label="序号" 
                                width="70" 
                                align="center" 
                                :index="indexMethod">
                            </el-table-column>
                            <el-table-column
                                prop="taskDate"
                                label="日期"
                                min-width="120">
                            </el-table-column>
                            <el-table-column
                                prop="targetPests"
                                label="害虫">
                            </el-table-column>                            
                            <el-table-column
                                prop="pesticide"
                                label="使用产品">
                            </el-table-column>
                            <el-table-column
                                prop="dilutionRate"
                                label="稀释比例">
                            </el-table-column>
                            <el-table-column
                                prop="dosage"
                                label="用量">
                            </el-table-column>
                            <el-table-column
                                prop="applyMethod"
                                label="应用方法">
                            </el-table-column>
                            <el-table-column
                                prop="applyPosition"
                                label="用药位置">
                            </el-table-column>
                            <el-table-column
                                prop="findPests"
                                label="是否发现害虫">
                            </el-table-column>
                            <el-table-column
                                prop="pcFeedback"
                                label="防治公司意见反馈">
                            </el-table-column>
                            <el-table-column
                                prop="shopFeedback"
                                label="意见反馈">
                            </el-table-column>
                            <el-table-column
                                label="问题点照片">
                                <template slot-scope="scope">
                                    <el-button size="mini" icon="el-icon-view" type="primary" @click="viewPhoto(scope.row)"></el-button>
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
            listLoading:false,
            tableData:{
                rows:[],
                records:0
            },
            orgId:"",
            isShop:false,
            times:[],
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
            this.$api.data.queryInsectProofData(this.params).then(res=>{
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
        //查看照片
        viewPhoto(row){
            this.imageUrlList =  []
            this.imageUrlList = row.photoList
            if(row.photoList.length>0){                
                this.imageUrlList = this.imageUrlList.map(i=>i.filePath)
            }
            setTimeout(()=>{
                this.dialogVisible = true
            },200)
        },
        //下载报告
        downloadFile(){

        }
    }
    
}
</script>
