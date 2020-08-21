<template>
    <div class="point-loss-analysis-pages">  
        <div class="boxtitle">数据档案 > 员工健康申报记录报表</div>
        <el-container>
            <search-tree v-model="Treeid" :valuelist="true"></search-tree>
            <el-main>
                <div class="formBG">
                    <el-form ref="form" :inline="true" label-width="90px">
                        <el-form-item label="统计时间">
                            <el-date-picker
                                v-model="times"
                                value-format="yyyy-MM"
                                type="month"
                                placeholder="统计时间"
                                >
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item>
                            <el-button class="buttonInit" icon="el-icon-search" @click="searchData">{{ $t('button.query') }}</el-button>
                            <el-button class="buttonInit"  @click="downLoadFile">{{ $t('button.downloadReport') }}</el-button>
                        </el-form-item>
                    </el-form>
                    <div class="boxList" v-loading="listLoading"> 
                        <el-table :data="tableData1" border  empty-text="暂无数据" >
                            <el-table-column 
                                type="index" 
                                label="序号" 
                                width="70" 
                                align="center" 
                                :index="indexMethod">
                            </el-table-column>
                            <el-table-column
                                prop="employee_name"
                                label="员工姓名">
                            </el-table-column>
                            <el-table-column :label="''+n" v-for="n in 31" :key="n">
                                <template slot-scope="scope">
                                    <span v-if="scope.row['date'+n]=='是'" style="color:#40c47a;font-size:30px"><i class="fa fa-smile-o"></i></span>
                                    <span v-if="scope.row['date'+n]=='否'" style="color:red;font-size:30px"><i class="fa fa-frown-o"></i></span>
                                    <span v-if="scope.row['date'+n]=='未上班'">/</span>
                                </template>
                            </el-table-column>
                        </el-table>
                        <br>
                        <el-table :data="tableData2" border  empty-text="暂无数据" >
                            <el-table-column 
                                type="index" 
                                label="序号" 
                                width="70" 
                                align="center" 
                                :index="indexMethod">
                            </el-table-column>
                            <el-table-column
                                prop="employee_name"
                                label="患病员工姓名"
                                min-width="180">
                            </el-table-column>
                            <el-table-column
                                prop="report_date"
                                label="患病日期"
                                min-width="180">
                            </el-table-column>
                            <el-table-column
                                prop="emergency_measures"
                                label="紧急处理措施"
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
export default {
    data(){
        return {
            Treeid: {},
            listLoading:false,
            orgId:"",
            isShop:false,
            times:'',
            params:{
                rows: -1, 
                page: 1,  
                filters: {
                    rules: [
                        {
                            field: "shopId", 
                            data: ""
                        },
                        {
                            field: "startDate", 
                            data: ""
                        }
                    ]
                }
            },
            tableData1:[],
            tableData2:[],
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
            starttime = `${year}-${month}`
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
            this.listLoading = true
            this.params.filters.rules[0].data = this.orgId
            this.params.filters.rules[1].data = this.times
            this.$api.data.queryHealthCondReport(this.params).then(res=>{
                this.listLoading = false
                if(res.data.resCode == 0){
                    //debugger
                    this.tableData1 = res.data.data.rows
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
            this.$api.data.queryHealthCondReport1(this.params).then(res=>{
                this.listLoading = false
                if(res.data.resCode == 0){
                    //debugger
                    this.tableData2 = res.data.data.rows
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
        //下载
        downLoadFile(){
            //window.location.href = "https://sixarms-dt.obs.cn-east-2.myhuaweicloud.com/model/account.xlsx"
        }
    }
}
</script>
