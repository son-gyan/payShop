<template>
    <div class="point-loss-analysis-pages">  
        <div class="boxtitle">设置 > 店员管理</div>
        <el-container>
            <search-tree v-model="Treeid" :valuelist="true"></search-tree>
            <el-main>
                <div class="formBG">
                    <el-form ref="form"  label-width="90px">
                        <el-button class="buttonInit" icon="el-icon-plus" @click="addSalesPerson">{{ $t('button.add') }}</el-button>
                        <el-button class="buttonInit" @click="importSalesPerson">{{ $t('button.import') }}</el-button>
                        <el-button class="buttonInit" @click="downloadSalesPerson">{{ $t('button.download') }}</el-button>
                    </el-form>
                    <div class="boxList" v-loading="listLoading">
                        <el-table :data="salesPersonList.rows"  max-height="575">
                            <el-table-column prop="name" label="员工姓名"  min-width="150"/>
                            <el-table-column prop="telephone" label="员工电话" min-width="150"/>
                            <el-table-column label="到期日期" min-width="150">
                                <template slot-scope="scope">                                    
                                    <span>{{$utils.formatDate(scope.row.expiryDate, 'YYYY-MM-DD')}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column :label="$t('button.Do')" width="380">
                                <template slot-scope="scope">
                                    <el-button size="mini" plain @click="quitSalesPerson(scope.row)">
                                        {{ $t('button.quit') }}
                                    </el-button>
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
                                :page-size="100" 
                                layout="total, sizes, prev, pager, next, jumper" 
                                :total="salesPersonList.records==''?0:salesPersonList.records">
                            </el-pagination>
                        </div>
                    </div>
                </div>
            </el-main>
        </el-container>
        <!--新增编辑弹窗-->
        <el-dialog :close-on-click-modal='false' :title="dialogTit" :visible.sync="dialogVisible" width="40%">
            <el-form 
                :model="form"
                :rules="formRule"
                ref="form"
                @keyup.enter.native="saveDevice('form')"
                label-width="130px"
                :size="size"
                style="text-align:left;"
            >
                <el-form-item label="人员名称" prop="name">
                    <el-input v-model.trim="form.name" ></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="telephone">
                    <el-input v-model.trim="form.telephone" ></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible=false">{{ $t('button.cancel') }}</el-button>
                <el-button type="primary" @click="saveDevice('form')">{{ $t('button.save') }}</el-button>
            </span>
        </el-dialog> 
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
export default {    
    data(){
        var validateName = (rule, value, callback) => {
            const namereg = /^[\u4E00-\u9FA5A-Za-z\s]+(·[\u4E00-\u9FA5A-Za-z]+)*$/;
            if (value === '') {
                callback(new Error('请输入真实姓名'));
            }else if(!namereg.test(value)){
                callback(new Error('真实姓名格式为中文或英文字母组合'));
            } else {
                callback();
            }
        };
        var CheckTel = (rule, value, callback) => {
            const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
            var numReg = /^[0-9]*$/
            const numRe = new RegExp(numReg)
            if (!value) {
                callback(new Error('请输入手机号码'));
            }else if (value.toString().length != 11 || !numRe.test(value)) {
                callback(new Error('手机号码必须是11位数字'));
            } /* else if (!reg.test(value)) {
                callback(new Error('请输入正确的手机号码'));
            } */ else {
                callback();
            }
        };
        return {
            Treeid: {},
            params:{
                page:1,
                row:10,
                sidx: "id",
                sord: "asc", 
                filters: {
                    groupOp: "AND", 
                    rules: [
                        {
                            field: "orgId", 
                            op: "eq", 
                            data: ""
                        }
                    ]
                }
            },
            selectNodes:[],
            listLoading:false,
            salesPersonList:{
                rows: [],
                records: 0
            },
            selectList:[],
            dialogVisible:false,
            dialogTit:"新增店员",
            dialogImportTit:"导入信息",
            dialogImportVisible:false,
            size: 'small',
            form:{
                orgId:"",
                name:"",
                telephone:""
            },
            formRule: {
                name: [
                    { required: true, message: '请输入人员名称', trigger: 'blur' },
                    { required: true, validator: validateName, trigger: 'blur' }
                ],
                telephone: [
                    { required: true, message: '请输入电话', trigger: 'blur' },
                    { required: true, validator: CheckTel,trigger: 'blur' }
                ],
            },
            isShop:false,
            isShowTemp:true,
            importFile:"",
        }
    },
    watch: {
        Treeid(val) {
            //console.log("Treeid："+JSON.stringify(val));
            if(val.isLeaf == "1"){ 
                this.isShop = true 
                this.form.orgId = val.id;              
                this.getList(); 
            }else{
                this.isShop = false 
            }
        }
    },
    methods:{
        //初始化数据列表
        getList(){
            //debugger
            this.listLoading = true
            this.params.filters.rules[0].data = this.form.orgId
            this.$api.shopSetting.getSalesPersonList(this.params).then(res=>{
                this.listLoading = false
                if(res.data.resCode == 0){
                    this.salesPersonList = res.data.data
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
        //新增
        addSalesPerson(){
            if(this.isShop){           
                this.dialogVisible = true
                this.dialogTit = "新增店员"
                this.form.name = ""
                this.form.telephone = ""
            }else{
                this.$message({
                    message: this.$t('message.storeSelect'),
                    type: 'error'
                }) 
            }
        },
        //点击批量导入按钮
        importSalesPerson(){
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
            formData.append('file', this.importFile)
            formData.append('orgId', this.form.orgId)            
            this.$api.shopSetting.uploadSalesPerson(formData).then((res)=>{
                if (res.data.resCode == 0) {                  
                    this.dialogImportVisible = false;
                    this.getList();
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
        //下载
        downloadSalesPerson(){
            window.location.href = "https://sixarms-dt.obs.cn-east-2.myhuaweicloud.com/model/employee.xls"
        },
        //编辑
        editDevice(row){
            this.dialogVisible = true
            this.dialogTit = "编辑店员"
            this.form.name = row.name
            this.form.telephone = row.telephone
        },
        //序号转换
        indexMethod(index){
            return (index+1)+((this.params.page-1)*this.params.rows);
        },
        //分页项切换
        handleSizeChange(val) {
            this.params.rows = val;
            this.getList();
        },
        //分页页码切换
        handleCurrentChange(val) {
            this.params.page = val;
            this.getList();
        },
        // 保存
        saveDevice(){
            let that = this
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.$confirm('确认提交吗？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                    }).then(() => {
                        this.$api.shopSetting.saveSalesPerson(this.form).then((res)=>{
                            if (res.data.resCode == 0) {
                                this.dialogVisible = false;
                                this.getList();
                                this.$refs["form"].resetFields();
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
                    }).catch((res) => {
                        this.$message({
                            type: "info",
                            message: this.$t('message.cancelSubmit')
                        });
                    }); 
                }
            })
        },
        //启用、删除、停用、维修设备
        quitSalesPerson(row){
            let params = {
                id:row.id,
                status:0
            }
            this.$confirm('确定要离职吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(() => {
                this.$api.shopSetting.quitSalesPerson(params).then(res=>{
                    if(res.data.resCode == 0){
                        this.getList();
                    } else {
                        this.$message({
                            message: res.data.resMsg,
                            type: "error"
                        });
                    }
                }).catch(res=>{
                    this.$message({
                        message: res.message,
                        type: 'error'
                    })
                })
            }).catch((res) => {
                this.$message({
                    type: "info",
                    message: this.$t('message.cancelSubmit')
                });
            });
            
        }
    }
    
}
</script>