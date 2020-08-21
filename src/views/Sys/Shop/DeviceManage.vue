<template>
    <div class="point-loss-analysis-pages">  
        <div class="boxtitle">设置 > 设备管理</div>
        <el-container>
            <search-tree v-model="Treeid" :valuelist="true"></search-tree>
            <el-main>
                <div class="formBG">
                    <el-form ref="form"  label-width="90px">
                        <el-button class="buttonInit" icon="el-icon-plus" @click="addDevice">{{ $t('button.add') }}</el-button>
                    </el-form>
                    <div class="boxList" v-loading="listLoading">
                        <el-table :data="deviceList.rows" border max-height="575">
                            <!-- <el-table-column type="selection" width="55"></el-table-column> 
                            <el-table-column type="index"  label="序号" width="55" align="center" :index="indexMethod"></el-table-column>-->
                            <el-table-column prop="deviceName" label="设备名称"  min-width="150"/>
                            <el-table-column prop="deviceTypeName" label="类型" min-width="150"/>
                            <el-table-column label="状态" >
                                <template slot-scope="scope">                                    
                                    <span v-if="scope.row.status == 0">停用</span>
                                    <span v-if="scope.row.status == 1">使用</span>
                                    <span v-if="scope.row.status == 2">维修</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="温显" >
                                <template slot-scope="scope">
                                    <span >{{scope.row.isTempDevice == 1?'是':'否'}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column :label="$t('button.Do')" width="380">
                                <template slot-scope="scope">
                                    <el-button size="mini" plain @click="dealDevice(scope.row,1)" v-if="scope.row.status != 1">
                                        {{ $t('button.start') }}
                                    </el-button>
                                    <el-button size="mini" plain @click="dealDevice(scope.row,3)">
                                        {{ $t('button.delete') }}
                                    </el-button>
                                    <el-button size="mini" plain @click="dealDevice(scope.row,0)" v-if="scope.row.status != 0">
                                        {{ $t('button.stop') }}
                                    </el-button>
                                    <el-button size="mini" plain @click="dealDevice(scope.row,2)" v-if="scope.row.status != 2">
                                        {{ $t('button.repair') }}
                                    </el-button>
                                    <el-button size="mini" plain @click="editDevice(scope.row)" 
                                        v-if="scope.row.deviceTypeName.indexOf('冷冻库') != -1 || scope.row.deviceTypeName.indexOf('冷藏库') != -1">
                                        {{ $t('button.edit') }}
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
                                :total="deviceList.records==''?0:deviceList.records">
                            </el-pagination>
                        </div>
                    </div>
                </div>
            </el-main>
        </el-container>
        <!--新增编辑弹窗-->
        <el-dialog :close-on-click-modal='false' :title="dialogTit" :visible.sync="dialogVisible" width="40%">
            <el-form :model="form"
                ref="form"
                @keyup.enter.native="saveDevice('form')"
                label-width="130px"
                :size="size"
                style="text-align:left;"
            >
                <el-form-item label="设备名称">
                    <el-select v-model="form.deviceName" placeholder="请选择" @change="handleChangeDevice">
                        <el-option
                            v-for="item in selectList"
                            :key="item.id"
                            :label="item.id"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="设备类型">
                    <el-input v-model.trim="form.deviceTypeName" readonly></el-input>
                </el-form-item>
                <el-form-item label="温显" v-if="isShowTemp">
                    <el-select v-model="form.isTempDevice" placeholder="请选择">
                        <el-option label="否" :value="0"></el-option>
                        <el-option label="是" :value="1"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible=false">{{ $t('button.cancel') }}</el-button>
                <el-button type="primary" @click="saveDevice('form')">{{ $t('button.save') }}</el-button>
            </span>
        </el-dialog>        
    </div>
</template>

<script>
export default {
    data(){
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
            deviceList:{
                rows: [],
                records: 0
            },
            selectList:[],
            dialogVisible:false,
            dialogTit:"新增设备",
            size: 'small',
            form:{
                orgId:"",
                id:"",
                deviceName:"",
                deviceTypeName:"",
                isTempDevice:0
            },
            formRule: {
                deviceName: [
                    { required: true, message: '请选择设备名称', trigger: 'blur' }
                ]
            },
            isShop:false,
            isShowTemp:true
        }
    },
    watch: {
        Treeid(val) {
            //console.log("Treeid："+JSON.stringify(val));
            if(val.isLeaf == "1"){ 
                this.isShop = true 
                this.form.orgId = val.id;              
                this.getList();                
                this.getSelect()  
            }else{
                this.isShop = false 
            }
        }
    },
    methods:{
        //获取选择框设备列表数据
        getSelect(){
            this.$api.shopSetting.getSelect({orgId:this.form.orgId}).then(res=>{
                if(res.data.resCode == 0){
                    this.selectList = res.data.data
                    if(this.selectList.length>0){
                        this.form.deviceName =  this.selectList[0].id
                        this.form.deviceTypeName = this.selectList[0].text
                        if(this.selectList[0].text == '冷冻库' || this.selectList[0].text == '冷藏库'){
                            this.isShowTemp = true
                        }else{
                            this.isShowTemp = false
                        }
                    }
                }else{
                    this.$message({
                        message: res.message,
                        type: 'error'
                    })
                }
            }).catch((res) => {
                this.$message({
                    message: res.message,
                    type: 'error'
                })
            });
        },
        //初始化数据列表
        getList(){
            //debugger
            this.listLoading = true
            this.params.filters.rules[0].data = this.form.orgId
            this.$api.shopSetting.getDeviceList(this.params).then(res=>{
                this.listLoading = false
                if(res.data.resCode == 0){
                    this.deviceList = res.data.data
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
        addDevice(){
            if(this.isShop){           
                this.dialogVisible = true
                this.dialogTit="新增设备"
                if(this.selectList.length>0){
                    this.form.deviceName =  this.selectList[0].id
                    this.form.deviceTypeName = this.selectList[0].text
                    if(this.selectList[0].text == '冷冻库' || this.selectList[0].text == '冷藏库'){
                        this.isShowTemp = true
                    }else{
                        this.isShowTemp = false
                    }
                }
            }else{
                this.$message({
                    message: this.$t('message.storeSelect'),
                    type: 'error'
                }) 
            }
        },
        //编辑
        editDevice(row){
            this.dialogVisible = true
            this.dialogTit="编辑设备"
            this.form.deviceName = row.deviceName
            this.form.deviceTypeName = row.deviceTypeName
            this.form.isTempDevice = row.isTempDevice
            if(row.deviceTypeName == '冷冻库' || row.deviceTypeName == '冷藏库'){
                this.isShowTemp = true
            }else{
                this.isShowTemp = false
            }
        },
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
        //下拉框选择
        handleChangeDevice(val){
            for (let i = 0; i < this.selectList.length; i++) {
                if (this.selectList[i].id === val) {
                    this.form.deviceTypeName = this.selectList[i].text
                    if(this.selectList[i].text == '冷冻库' || this.selectList[i].text == '冷藏库'){
                        this.isShowTemp = true
                    }else{
                        this.isShowTemp = false
                        this.form.isTempDevice = 0
                    }
                }
            }
        },
        // 保存
        saveDevice(){
            let that = this
            this.$confirm('确认提交吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(() => {
                this.$api.shopSetting.saveDevice(this.form).then((res)=>{
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
        },
        //启用、删除、停用、维修设备
        dealDevice(row,status){
            let params = {
                orgId:this.form.orgId,
                id:row.id,
                deviceName:row.deviceName,
                status:status
            }
            if(status == 3){
                this.$confirm('确定要删除吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(() => {
                    this.$api.shopSetting.dealDevice(params).then(res=>{
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
            }else{
                this.$api.shopSetting.dealDevice(params).then(res=>{
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
            }
            
        }
    }
    
}
</script>