<template>
    <div class="point-loss-analysis-pages">  
        <div class="boxtitle">数据档案 > 当前台账报表</div>
        <el-container>
            <search-tree v-model="Treeid" :valuelist="true"></search-tree>
            <el-main>
                <div class="formBG">
                    <el-form ref="form" :inline="true" label-width="90px">
                        <el-form-item>
                            <el-button class="buttonInit" icon="el-icon-search" @click="searchData">{{ $t('button.query') }}</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button class="buttonInit" @click="importFileBtn">{{ $t('button.import') }}</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button class="buttonInit" @click="downloadFile">{{ $t('button.download') }}</el-button>
                        </el-form-item>
                    </el-form>
                    <div class="boxList" v-loading="listLoading">
                        <el-table :data="dataList.rows" border  empty-text="暂无数据" >
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
                                prop="erp_code"
                                label="erp码">
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
                                label="生产商名称">
                            </el-table-column>
                            <el-table-column
                                prop="manufacturer_addr"
                                label="厂商地址">
                            </el-table-column>
                            <el-table-column
                                prop="contact_way"
                                label="联系方式">
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
                                prop="expiry_date"
                                label="到期日期"
                                min-width="120">
                            </el-table-column>
                            <el-table-column :label="$t('button.Do')" min-width="120">
                                <template slot-scope="scope">
                                    <el-button size="mini" type="primary" @click="usedUp(scope.row)">{{ $t('button.usedUp') }}</el-button>
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
                                :total="dataList.records==''?0:dataList.records">
                            </el-pagination>
                        </div>
                    </div>
                </div>
            </el-main>
        </el-container> 
        <!-- 批量导入-->
        <el-dialog class="importDialog" 
            :close-on-click-modal='false' 
            :title="dialogImportTit" 
            :visible.sync="dialogImportVisible" 
            width="40%">
            <el-form
                ref="formImport"
                @keyup.enter.native="handleImport"
                label-width="130px"
                :size="size"
                style="text-align:left;"
            >
                <el-form-item label="选择文件">
                    <div class="importFileInfo">
                        <a class="el-upload-list__item-name" v-if="this.importFile">
                            <i class="el-icon-document"></i>{{this.importFile.name}}
                        </a>
                    </div>
                    <el-upload class="importUpload" 
                        :show-file-list="false" 
                        :before-upload="handleBeforeUpload" 
                        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" 
                        action="string">
                        <el-button size="small" type="primary">{{ $t('button.browse') }}</el-button>
                    </el-upload>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogImportVisible=false">{{ $t('button.cancel') }}</el-button>
                <el-button type="primary" @click="handleImport">{{ $t('button.save') }}</el-button>
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
                page:1, 
                rows:10, 
                filters: {
                    rules: [
                        {
                            field: "groupId", 
                            data: ""
                        }, 
                        {
                            field: "shopId", 
                            data: ""
                        }
                    ]
                }
            },
            listLoading:false,
            dataList:{
                rows: [],
                records: 0
            },
            orgId:"",
            isShop:false,
            dialogImportTit:"导入信息",
            dialogImportVisible:false,
            size: 'small',
            importFile:"",
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
    methods:{
        //初始化数据列表
        searchData(){
            //debugger
            if(!this.isShop){           
                this.$message({
                    message: this.$t('message.storeSelect'),
                    type: 'error'
                })
                return
            }
            this.listLoading = true
            this.params.filters.rules[0].data = this.orgId
            this.params.filters.rules[1].data = this.orgId
            this.$api.data.queryAccountDataReport(this.params).then(res=>{
                this.listLoading = false
                if(res.data.resCode == 0){
                    this.dataList = res.data.data
                }else{
                    this.$message({
                        message: res.data.message,
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
        // 导入
        importFileBtn(){
            if(this.isShop){       
                this.importFile=""    
                this.dialogImportVisible = true
            }else{
                this.$message({
                    message: this.$t('message.storeSelect'),
                    type: 'error'
                }) 
            }
        },
        //导入前
        handleBeforeUpload(file){
            const isExcel =
                file.type === '.csv' ||
                file.type ===
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                file.type === 'application/vnd.ms-excel'
            if (!isExcel) {
                this.$utils.$message({
                    message: this.$t('message.excel'),
                    type: 'error'
                })
            }
            if (isExcel) {
                this.importFile = file
            }
            return false
        },
        //文件导入
        handleImport(){
            if (!this.importFile) {
                this.$utils.$message({
                    message: this.$t('message.selectImport'),
                    type: 'warning'
                })
                return
            }
            let formData = new FormData();                     
            formData.append('id', '') 
            formData.append('shopId', this.orgId)            
            formData.append('orgId', '')  
            formData.append('file', this.importFile)                        
            this.$api.data.uploadAccountDate(formData).then((res)=>{
                if (res.data.resCode == -1) { 
                    this.$message({
                        message: res.data.resMsg,
                        type: "success"
                    });                 
                    this.dialogImportVisible = false;
                    this.searchData();
                } else {
                    this.$message({
                        message: res.data.resMsg,//this.$t('message.addFail'),
                        type: "error"
                    });
                }
            }).catch((res) => {
                this.$message({
                    message: res.message,
                    type: 'error'
                })
            });
        },
        //下载模板
        downloadFile(){
            window.location.href = "https://sixarms-dt.obs.cn-east-2.myhuaweicloud.com/model/account.xlsx"
        },
        // 已用完
        usedUp(row){
            let params = {
                userId:'',
                status:6,
                id:row.id
            }
            this.$api.data.updateAccountData(params).then(res=>{
                if(res.data.resCode == 0){
                    this.searchData()
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
        }
    }
}
</script>