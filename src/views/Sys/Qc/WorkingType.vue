<template>
    <div class="taskType"> 
        <div class="boxtitle">任务清单管理 > 任务分类配置</div>
        <div class="search">
            <el-button @click="addTaskType" icon="el-icon-plus" class="buttonInit">{{$t('button.add')}}</el-button>
            <el-button @click="delTaskType" icon="el-icon-delete" class="buttonInit">{{$t('button.delete')}}</el-button>
        </div>
        <div class="box2 clearfix" v-loading="listLoading">
            <el-table :data="taskTypeList.rows"  max-height="575" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column type="index"  label="序号" width="55" align="center" :index="indexMethod"></el-table-column>
                <el-table-column prop="name" :label="$t('task.typeName')" />
                <el-table-column :label="$t('button.Do')" width="350">
                <template slot-scope="scope">
                    <el-button size="mini" icon="el-icon-edit" plain @click="editTaskType(scope.row)">{{ $t('button.edit') }}</el-button>
                    <el-button size="mini" plain @click="upTaskType(scope.row)">{{ $t('button.up') }}</el-button>
                    <el-button size="mini" plain @click="downTaskType(scope.row)">{{ $t('button.down') }}</el-button>
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
                    :total="taskTypeList.records==''?0:taskTypeList.records">
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
                <el-form-item label="任务分类名称" prop="name">
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
            taskTypeList:{
                rows: [],
                records: 0
            },
            dialogVisible:false,
            dialogTit:"新增任务分类",
            size: 'small',
            form:{
                id:"",
                name:""
            },
            formRule: {
                name: [
                    { required: true, message: '任务分类名称不能为空', trigger: 'blur' }
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
            this.$api.qcTask.getTaskTypeList(params).then((res) => {
                this.listLoading = false
                if(!res){
                    return
                }
                let data = res.data;
                if(data.resCode == 0){
                    this.taskTypeList = data.data
                }else{
                    this.taskTypeList = {}
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
        addTaskType(){
            this.dialogVisible = true
            this.dialogTit = "新增任务分类"
            this.form = {
                id:"",
                name:""
            }
            if (this.$refs.form) {
                this.$refs.form.clearValidate();
            }
        },
        //删除
        delTaskType(){
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
                this.$api.qcTask.delTaskType({ id: ids }).then((res) => {
                    if (res.data.resCode == 0) {                        
                        if(this.params.page>1&&this.taskTypeList.rows.length==this.selectNodes.length){
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
        editTaskType(row){
            this.dialogVisible = true
            this.dialogTit = "编辑任务分类"
            this.form.name = row.name
            this.form.id = row.id
            if (this.$refs.form) {
                this.$refs.form.clearValidate();
            }
        },
        //上移
        upTaskType(row){
            this.$api.qcTask.moveUpTaskType({ id: row.id }).then((res) => {
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
        //下移
        downTaskType(row){
            this.$api.qcTask.moveDownTaskType({ id: row.id }).then((res) => {
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
                        this.$api.qcTask.saveTaskType(this.form).then((res) => {
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
    .taskType{
        height: 100%;
        background: #fff;
    }
</style>