<template>
    <div class="point-loss-analysis-pages">  
        <div class="boxtitle">数据档案 > 设备温度(每周任务)监控记录</div>
        <el-container>
            <search-tree v-model="Treeid" :valuelist="true"></search-tree>
            <el-main>
                <div class="formBG">
                    <el-form ref="form" :inline="true" label-width="90px">
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
                        <el-table :data="freezerList2" border empty-text="暂无数据" >
                            <el-table-column 
                                type="index" 
                                label="序号" 
                                width="100" 
                                align="center" 
                                :index="indexMethod">
                            </el-table-column>
                            <el-table-column
                                label="星期"
                                min-width="180">
                                <el-table-column
                                    prop="device_name"
                                    label="设备名称"
                                    min-width="180">
                                </el-table-column>
                            </el-table-column>
                            <el-table-column
                                prop="standard"
                                label="标准温度"
                                min-width="180">
                            </el-table-column>
                            <el-table-column label="实测温度" min-width="300">
                                <el-table-column
                                    v-for="(item,index) in freezerList1"
                                    :key="index"
                                    prop="name"
                                    :label="'第'+(index+1)+'周 \n 日期：'+item">
                                    <el-table-column
                                        :prop="'firstvalue'+(index+1)"
                                        label="初测">
                                    </el-table-column>
                                    <el-table-column
                                        :prop="'secondvalue'+(index+1)"
                                        label="复核">
                                    </el-table-column>
                                    <el-table-column
                                        :prop="'correctmeasure'+(index+1)"
                                        label="纠偏措施">
                                    </el-table-column>
                                </el-table-column>
                            </el-table-column>
                        </el-table>
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
            this.$api.data.queryDeviceTemp2ForHead(this.paramsForm).then(res=>{
                if(res.data.resCode == 0){
                    //debugger
                    this.freezerList1 = res.data.data
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
            this.$api.data.queryDeviceTemp2ForContent(this.params).then(res=>{
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
        //
        
    }
    
}
</script>