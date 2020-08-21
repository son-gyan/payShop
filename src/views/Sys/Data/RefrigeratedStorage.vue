<template>
    <div class="point-loss-analysis-pages">  
        <div class="boxtitle">数据档案 > 冷藏库温度(每日任务)监控记录</div>
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
                                :picker-options="pickerOptions"
                                >
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item>
                            <el-button class="buttonInit" icon="el-icon-search" @click="searchFreezer">{{ $t('button.query') }}</el-button>
                        </el-form-item>
                    </el-form>
                    <div class="boxList" v-loading="listLoading">
                        <el-table :data="freezerList2"  empty-text="暂无数据" >
                            <el-table-column 
                                type="index" 
                                label="序号" 
                                width="100" 
                                align="center" 
                                :index="indexMethod">
                            </el-table-column>
                            <el-table-column
                                prop="dt_date"
                                label="日期"
                                min-width="180"
                                height="30">
                            </el-table-column>
                            <el-table-column :label="'记录时间（开店）：'+(freezerList1.shopOpen||'')" min-width="300" v-if="freezerList1.options.length>0&&freezerList1.shopOpen">
                                <el-table-column
                                    prop="name"
                                    label="显示温度℃">
                                    <el-table-column
                                        :prop="'devoption'+(index==0?'':index)"
                                        :label="item"  v-for="(item,index) in freezerList1.options" :key="index">
                                    </el-table-column>
                                </el-table-column>
                            </el-table-column>
                            <el-table-column :label="'记录时间（换班）：'+(freezerList1.shopChange||'')" min-width="300" v-if="freezerList1.options.length>0&&freezerList1.shopChange">
                                    <el-table-column
                                        prop="province"
                                        label="显示温度℃">
                                        <el-table-column
                                            :prop="'devoption'+(index+freezerList1.options.length)"
                                            :label="item"
                                            v-for="(item,index) in freezerList1.options" :key="index">
                                        </el-table-column>
                                    </el-table-column>
                                </el-table-column>
                        </el-table>
                        <!-- <div class="noData" style="text-align:center" >
                            暂无数据
                        </div> -->
                    </div>
                </div>
            </el-main>
        </el-container>       
    </div>
</template>

<script>
export default {
    data(){
        return {
            Treeid: {},
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
                            field: "shopId", 
                            data: ""
                        }, 
                        {
                            field: "chartType",
                            data: 1
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
                chartType:2,
                shopId:"",
                startDate:"",
                endDate:""
            },
            listLoading:false,
            freezerList1:{
                options:[]
            },
            freezerList2:[
            ],
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
        this.getTime();
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
                this.params.filters.rules[3].data = dataRange[0]
                this.params.filters.rules[4].data  = dataRange[1]
                this.paramsForm.startDate = dataRange[0]
                this.paramsForm.endDate = dataRange[1]
            }
            this.listLoading = true
            this.params.filters.rules[0].data = this.orgId
            this.params.filters.rules[1].data = this.orgId
            this.paramsForm.shopId = this.orgId 
            this.$api.data.queryfreezerForHead(this.paramsForm).then(res=>{
                if(res.data.resCode == 0){
                    //debugger
                    this.freezerList1 = res.data.data
                }else{
                    this.$message({
                        message: res.data.resMsg,
                        type: 'error'
                    })
                }
            }).catch((res) => {
                this.listLoading = false
                this.$message({
                    message: res.data.resMsg,
                    type: 'error'
                })
            });
            this.$api.data.queryfreezerForContent(this.params).then(res=>{
                this.listLoading = false
                if(res.data.resCode == 0){
                    //debugger
                    this.freezerList2 = res.data.data.rows
                }else{
                    this.$message({
                        message: res.data.resMsg,
                        type: 'error'
                    })
                }
            }).catch((res) => {
                this.listLoading = false
                this.$message({
                    message: res.data.resMsg,
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
        //
        
    }
    
}
</script>