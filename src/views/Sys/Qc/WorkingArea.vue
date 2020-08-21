<template>
    <div class="WorkArea"> 
        <div class="boxtitle">任务清单管理 > 工作区域配置</div>
        <div class="search">
            <el-button @click="addWorkArea" icon="el-icon-plus" class="buttonInit">{{$t('button.add')}}</el-button>
            <el-button @click="delWorkArea" icon="el-icon-delete" class="buttonInit">{{$t('button.delete')}}</el-button>
        </div>
        <div class="box2 clearfix" v-loading="listLoading">
            <el-table :data="WorkAreaList.rows" border max-height="575" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column type="index"  label="序号" width="55" align="center" :index="indexMethod"></el-table-column>
                <el-table-column prop="name" :label="$t('task.areaName')" />
                <!-- <el-table-column prop="showIndex" label="排序" /> -->
                <el-table-column :label="$t('button.Do')" width="350">
                <template slot-scope="scope">
                    <el-button size="mini" icon="el-icon-edit" plain @click="editWorkArea(scope.row)">{{ $t('button.edit') }}</el-button>
                    <el-button size="mini" plain @click="upWorkArea(scope.row)">{{ $t('button.up') }}</el-button>
                    <el-button size="mini" plain @click="downWorkArea(scope.row)">{{ $t('button.down') }}</el-button>
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
                    :total="WorkAreaList.records==''?0:WorkAreaList.records">
                </el-pagination>
            </div>
        </div>
        <!--新增编辑弹窗-->
        <el-dialog :close-on-click-modal='false' :title="dialogTit" :visible.sync="dialogVisible" width="40%">
            <el-form
                :model="form"
                :rules="formRule"
                ref="form"
                @keyup.enter.native="save('form')"
                label-width="130px"
                :size="size"
                style="text-align:left;"
            >
                <el-form-item label="工作区域名称" prop="name">
                    <el-input v-model.trim="form.name" :placeholder="$t('placeholder.input')" maxlength=20 ></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible=false">{{ $t('button.cancel') }}</el-button>
                <el-button type="primary" @click="save('form')">{{ $t('button.save') }}</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data(){
        return {
            params:{
                page:1,
                rows:10
            },
            WorkAreaList:{
                rows: [],
                records: 0
            },
            dialogVisible:false,
            dialogTit:"新增工作区域",
            size: 'small',
            form:{
                id:"",
                name:""
            },
            formRule: {
                name: [
                    { required: true, message: '工作区域名称不能为空', trigger: 'blur' }
                ]
            },
            selectNodes:[],
            listLoading: false,
        }
    },
    created(){
        this.init();
    },
    methods:{
        //序号转换
        indexMethod(index){
            return (index+1)+((this.params.page-1)*this.params.rows);
        },
        //table上的全选
        handleSelectionChange(val) {
            this.selectNodes=[]
            let obj = {}
            val.map((item)=>{    
                this.selectNodes.push(item.id)
            })
            this.selectNodes = [...new Set(this.selectNodes)]
        },
        //初始化列表
        init(){
            this.listLoading = true
            let params = {
                page: this.params.page,
                rows: this.params.rows,
                sidx: "showIndex",
                sord: "asc"
            }
            this.$api.qcTask.getWorkAreaList(params).then((res) => {
                this.listLoading = false
                if(!res){
                    return
                }
                let data = res.data;
                if(data.resCode == 0){
                    this.WorkAreaList = data.data
                }else{
                    this.WorkAreaList = {}
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
        addWorkArea(){
            this.dialogVisible = true
            this.dialogTit = "新增工作区域"
            this.form = {
                id:"",
                name:""
            }
            if (this.$refs.form) {
                this.$refs.form.clearValidate();
            }
        },
        //删除
        delWorkArea(){
            let ids = ""
            this.selectNodes.map((item)=>{
                ids += item+","
            })
            ids = ids.substr(0, ids.length - 1)
            if(ids == ""){
                this.$message({
                    message: this.$t('message.selectDelete'),
                    type: "error"
                });
                return
            }else{
                this.$api.qcTask.delWorkArea({ id: ids }).then((res) => {
                    if (res.data.resCode == 0) {                        
                        if(this.params.page>1&&this.WorkAreaList.rows.length==this.selectNodes.length){
                            this.params.page--
                        }
                        this.init();
                    } else {
                        this.$message({
                          message: res.data.resMsg,
                          type: "error"
                        });
                    }
                }).catch((res) => {
                    this.$message({
                        message: res.message,
                        type: 'error'
                    })
                });
            }
        },
        //编辑
        editWorkArea(row){
            this.dialogVisible = true
            this.dialogTit = "编辑工作区域"
            this.form.name = row.name
            this.form.id = row.id
            if (this.$refs.form) {
                this.$refs.form.clearValidate();
            }
        },
        //上移
        upWorkArea(row){
            this.$api.qcTask.moveUpWorkArea({ id: row.id }).then((res) => {
                if (res.data.resCode == 0) {                        
                    /* if(this.params.page>1&&this.taskTypeList.rows.length==this.selectNodes.length){
                        this.params.page--
                    } */
                    this.init();
                } else {
                    this.$message({
                        message: res.data.resMsg,
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
        //下移
        downWorkArea(row){
            this.$api.qcTask.moveDownWorkArea({ id: row.id }).then((res) => {
                if (res.data.resCode == 0) {
                    this.init();
                } else {
                    this.$message({
                        message: res.data.resMsg,
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
        //分页项切换
        handleSizeChange(val) {
            this.params.rows = val;
            this.init();
        },
        //分页页码切换
        handleCurrentChange(val) {
            this.params.page = val;
            this.init();
        },
        //提交
        save(){
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.$confirm('确认提交吗？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                    }).then(() => {
                        this.$api.qcTask.saveWorkArea(this.form).then((res) => {
                            //debugger
                            if (res.data.resCode == 0) {
                                this.dialogVisible = false;
                                this.init();
                                this.$refs["form"].resetFields();
                            } else {
                                this.$message({
                                    message: res.resMsg,//this.$t('message.addFail'),
                                    type: "error"
                                });
                            }
                        }).catch((res) => {
                            debugger
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
        }
    }
}
</script>
<style lang="less" scoped>
    .WorkArea{
        height: 100%;
        background: #fff;
    }
</style>