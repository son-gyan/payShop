<template>
    <div class="point-loss-analysis-pages">  
        <div class="boxtitle">数据档案 > 单店手册下载</div>
        <el-container>
            <search-tree v-model="Treeid" :valuelist="true"></search-tree>
            <el-main>
                <div class="formBG">
                    <el-form ref="form"  label-width="90px">
                        <el-form-item label="类型：">
                            <el-checkbox-group v-model="typeArry">
                                <el-checkbox label="2" name="type" >冷冻库温度记录</el-checkbox>
                                <el-checkbox label="1" name="type">冷藏库温度记录</el-checkbox>
                                <el-checkbox label="3" name="type">设备温度</el-checkbox>
                                <el-checkbox label="4" name="type">健康证</el-checkbox>
                                <el-checkbox label="5" name="type">教育训练</el-checkbox>
                                <el-checkbox label="6" name="type">虫鼠害防治记录</el-checkbox>
                                <el-checkbox label="7" name="type">台账预警及告警</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>                        
                        <el-form-item label="时间段：" class="timesWrap">
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
                            <el-button class="buttonInit"  @click="downloadFile">{{ $t('button.downloadReport') }}</el-button>
                        </el-form-item>
                    </el-form>
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
            orgId:"",
            isShop:false,
            times:[],
            typeArry:[]
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
        downloadFile(){
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
            if(this.typeArry.length<1){
                this.$message({
                    message: this.$t('message.typeSelect'),
                    type: 'error'
                })
                return
            }
            debugger
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
        }
    }
    
}
</script>
