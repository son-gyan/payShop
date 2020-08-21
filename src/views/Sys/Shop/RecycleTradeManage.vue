<template>
    <div class="point-loss-analysis-pages">  
        <div class="boxtitle">设置 > 回收厂商管理</div>
        <el-container>
            <search-tree v-model="Treeid" :valuelist="true"></search-tree>
            <el-main>
                <div class="formBG" v-loading="listLoading" >
                    <el-form ref="recycleForm" :rules="formRule" label-width="150px" class="elForm" >
                        <el-form-item label="回收厂商名称" >
                            <el-input v-model="recycleForm.name" class="elInput"></el-input>
                        </el-form-item>
                        <el-form-item label="营业执照到期时间">
                            <!-- <el-input v-model="recycleForm.busLicExprTime" class="elInput"></el-input> -->
                            <el-date-picker v-model="recycleForm.busLicExprTime" type="date" placeholder="选择日期" class="elInput" :editable="false">
                            </el-date-picker>
                            <el-button type="primary" @click="eyePhoto(recycleForm.busLicExprTimeUrl,1)" icon="el-icon-view" size="small"></el-button>
                        </el-form-item>
                        <el-form-item label="合同到期时间">
                            <el-date-picker v-model="recycleForm.cntrExprTime" type="date" placeholder="选择日期" class="elInput" :editable="false">
                            </el-date-picker>
                            <el-button type="primary" @click="eyePhoto(recycleForm.cntrExprTimeUrl,2)" icon="el-icon-view" size="small"></el-button>
                        </el-form-item>
                        <el-form-item label="健康证复印件" >
                            <el-button type="primary" @click="eyePhoto(recycleForm.hlthCertTimeUrl,3)" icon="el-icon-view" size="small"></el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="saveForm('recycleForm')">{{ $t('button.save') }}</el-button>
                        </el-form-item>
                        <!-- <el-button class="buttonInit" icon="el-icon-plus" @click="addSalesPerson">{{ $t('button.add') }}</el-button>
                        <el-button class="buttonInit" @click="importSalesPerson">{{ $t('button.import') }}</el-button>
                        <el-button class="buttonInit" @click="downloadSalesPerson">{{ $t('button.download') }}</el-button> -->
                    </el-form>
                </div>
            </el-main>
        </el-container>
        <!-- 上传照片弹窗 -->
        <el-dialog :close-on-click-modal='false' :title="dialogTit" :visible.sync="dialogVisible" width="60%" @close="dialogClose">
            <div>
                <el-upload
                    v-loading="fileLoading"
                    :action="''"
                    ref="upload"
                    list-type="picture-card"
                    :accept="'image/*'"
                    :file-list="fileList"
                    multiple
                    :limit="limit"
                    :on-exceed="handleExceed"
                    :http-request="handleUpload"
                    :on-change="handleChange"
                    :auto-upload="false"
                    >  <!-- :on-preview="handlePreview" :http-request="handleUpload" :on-remove="handleRemove"  -->
                    <i slot="default" class="el-icon-plus"></i>
                    <div slot="file" slot-scope="{file}" >
                        <div class="imgWrap">        
                            <img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
                        </div>
                        <!-- <span v-if="file.type!='uploaded'">{{file.name}}</span> -->
                        <span class="el-upload-list__item-actions">
                            <span class="el-upload-list__item-preview" @click="handlePreview(file)">
                                <i class="el-icon-zoom-in"></i>
                            </span>
                            <span v-if="file.type!='uploaded'" class="el-upload-list__item-upload" @click="handleUpload(file)">
                                <i class="el-icon-upload2"></i>
                            </span>
                            <span  class="el-upload-list__item-delete" @click="handleRemove(file)">  
                                <i class="el-icon-delete"></i>
                            </span>
                        </span>
                    </div>
                        
                </el-upload>        
                <el-dialog :visible.sync="dialogImgVisible" :close-on-click-modal='false' title="图片预览" append-to-body>
                    <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>  
            </div>
            <!-- <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible=false">{{ $t('button.cancel') }}</el-button>
                <el-button type="primary" @click="savePhoto">{{ $t('button.save') }}</el-button>
            </span> -->
        </el-dialog>   
    </div>
</template>

<script>
import config from '@/api/config'
export default {    
    data(){
        return {
            Treeid: {},
            listLoading:false,
            recycleInfo:{},
            dialogVisible:false,
            dialogTit:"新增店员",
            size: 'small',
            dialogImgVisible:false,
            dialogImageUrl:"",
            dialogType:-1,
            recycleForm:{
                orgId:"",
                name:"",
                busLicExprTime:"",
                busLicExprTimeUrl:"",
                cntrExprTime:"",
                cntrExprTimeUrl:"",
                hlthCertTime:"",
                hlthCertTimeUrl:""
            },
            formRule: {
                name: [
                    { required: true, message: '请输入人员名称', trigger: 'blur' }
                ],
                telephone: [
                    { required: true, message: '请输入电话', trigger: 'blur' }
                ],
            },
            isShop:false,
            isShowTemp:true,
            fileList:[],
            limit:10,
            fileLoading:false
        }
    },
    watch: {
        Treeid(val) {
            //console.log("Treeid："+JSON.stringify(val));
            if(val.isLeaf == "1"){ 
                this.isShop = true 
                this.recycleForm.orgId = val.id;              
                this.getList(); 
            }else{
                this.isShop = false 
            }
        }
    },
    methods:{
        //初始化数据列表
        getList(){
            this.listLoading = true
            this.$api.shopSetting.getRecyle(this.recycleForm.orgId).then(res=>{
                this.listLoading = false
                if(res.data.resCode == 0){
                    let result = res.data.data
                    this.recycleForm.name = result.name
                    this.recycleForm.busLicExprTime = result.busLicExprTime
                    this.recycleForm.busLicExprTimeUrl = result.busLicExprTimeUrl
                    this.recycleForm.cntrExprTime = result.cntrExprTime
                    this.recycleForm.cntrExprTimeUrl = result.cntrExprTimeUrl
                    this.recycleForm.hlthCertTime = result.hlthCertTime
                    this.recycleForm.hlthCertTimeUrl = result.hlthCertTimeUrl
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
        //预览图片
        eyePhoto(urlArry,type){            
            if(this.isShop){  
                if(type==1){
                    this.dialogTit = "营业执照到期时间"                    
                }else if(type==2){
                    this.dialogTit = "合同到期时间"
                }else if(type==3){
                    this.dialogTit = "健康证复印件"
                }
                this.dialogType = type
                let photoList = urlArry && urlArry.split(",");
                photoList = photoList.filter(n => n)
                if (photoList.length > 0) {
                    photoList.forEach((item, index) => {
                        var obj = {};
                        this.$set(obj, "name", index);
                        this.$set(obj, "type", 'uploaded');
                        this.$set(obj,"url",
                            config.currentUrl.imgBaseUrl+item //拼接是的图片的url地址
                        ); //修改files里面的结构（name,url）
                        //debugger
                        this.fileList.push(obj);
                    });
                }
                setTimeout(()=>{this.dialogVisible = true},200)
            }else{
                this.$message({
                    message: this.$t('message.storeSelect'),
                    type: 'error'
                }) 
            }
        },
        //弹窗关闭
        dialogClose(){
            this.fileList=[]
        },
        //上传限制
        handleExceed(file, fileList){
            this.$message.warning(`请最多上传 ${this.limit} 张图片。`);
        },
        //图片上传前
        handleChange(file,fileList){
            var testmsg = /^image\/(jpeg|png|jpg|bmp)$/.test(file.raw.type);
            const isLt4M = file.size / 1024 / 1024 <= 4; //图片大小不超过2MB
            if (!testmsg) {
                this.$message.error("上传图片格式不对!");
                this.$refs.upload.clearFiles();
                return;
            }
            if (!isLt4M) {
                this.$message.error("上传图片大小不能超过 4M!");
                return;
            }
            return testmsg && isLt4M;
        },
        //图片删除
        handleRemove(file) {            
            //console.log(file, "delete");
            //debugger
            let arrPic = this.$refs.upload.uploadFiles;
            let index = arrPic.indexOf(file);
            arrPic.splice(index, 1);
            if(this.dialogType == 1){
                this.recycleForm.busLicExprTimeUrl = this.recycleForm.busLicExprTimeUrl.replace(file.url.replace(config.currentUrl.imgBaseUrl,"")+',',"");
            }else if(this.dialogType == 2){
                this.recycleForm.cntrExprTimeUrl = this.recycleForm.cntrExprTimeUrl.replace(file.url.replace(config.currentUrl.imgBaseUrl,"")+',',"");
            }else if(this.dialogType == 3){
                this.recycleForm.hlthCertTimeUrl = this.recycleForm.hlthCertTimeUrl.replace(file.url.replace(config.currentUrl.imgBaseUrl,"")+',',"");
            }
        },
        //图片预览
        handlePreview(file) { 
            this.dialogImageUrl = file.url;
            this.dialogImgVisible = true;
        },
        //上传
        handleUpload(file) {
            if (!file) {
                this.$utils.$message({
                    message: this.$t('message.selectImport'),
                    type: 'warning'
                })
                return
            }
            let formData = new FormData();
            formData.append('file', file.raw)
            formData.append('companyId', sessionStorage.getItem('companyId'))
            this.fileLoading = true           
            this.$api.shopSetting.uploadCompanyId(formData).then(res=>{
                if(res.data.resCode == 0){
                    file.type = 'uploaded'
                    this.fileLoading = false
                    if(this.dialogType == 1){
                        this.recycleForm.busLicExprTimeUrl = this.recycleForm.busLicExprTimeUrl + res.data.resMsg +',';
                    }else if(this.dialogType == 2){
                        this.recycleForm.cntrExprTimeUrl = this.recycleForm.cntrExprTimeUrl + res.data.resMsg +',';
                    }else if(this.dialogType == 3){
                        this.recycleForm.hlthCertTimeUrl = this.recycleForm.hlthCertTimeUrl + res.data.resMsg +',';
                    }
                }else{      
                    this.fileLoading = false    
                    this.$message({
                        message: res.data.resMsg,
                        type: 'error'
                    })
                }
            }).catch((res) => {
                this.fileLoading = false
                this.$refs.upload.clearFiles();  //上传失败后清除当前上传的图片
                this.$message({
                    message: res.message,
                    type: 'error'
                })
            });
        },
        //图片保存
        savePhoto(){                       
            console.log(this.dialogType)
            console.log(this.fileList)
            debugger
        },
        //保存
        saveForm(formName){
            if(!this.isShop){ 
                this.$message({
                    message: this.$t('message.storeSelect'),
                    type: 'error'
                }) 
                return
            }
            console.log("recyleForm:"+JSON.stringify(this.recycleForm))
            this.$api.shopSetting.saveRecyle(this.recycleForm).then(res=>{
                if(res.data.resCode == 0){
                    this.$message({
                        message: res.data.resMsg,
                        type: 'success'
                    })
                }else{          
                    this.$message({
                        message: res.data.resMsg,
                        type: 'error'
                    })
                }
            }).catch((res) => {
                this.$message({
                    message: res.message,
                    type: 'error'
                })
            });
        }
    }
    
}
</script>
<style lang="less" scoped>
    .formBG{
        .elForm{
            //display: block;
            width: 550px;
            margin-top: 50px;
            .elInput{
                width: 300px;
            }
        }
    }
</style>