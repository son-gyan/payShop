<template>
    <div class="point-loss-analysis-pages">  
        <div class="boxtitle">数据档案 > 冷冻库温度单日详情</div>
        <el-container>
            <search-tree v-model="Treeid" :valuelist="true"></search-tree>
            <el-main>
                <div class="formBG">
                    <el-form ref="form" :inline="true" label-width="90px">
                        <el-form-item label="统计时间">
                            <el-date-picker
                                v-model="time"
                                value-format="yyyy-MM-dd"
                                type="date"
                                placeholder="选择日期"
                                >
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item>
                            <el-button class="buttonInit" icon="el-icon-search" @click="searchFreezer">{{ $t('button.query') }}</el-button>
                        </el-form-item>
                    </el-form>
                    <div class="boxList" v-loading="listLoading">
                        <el-table :data="freezerReportList.rows" empty-text="暂无数据" >
                            <el-table-column label="开店" min-width="300">
                                <el-table-column
                                    prop="amDeviceName"
                                    label="设备名称">
                                </el-table-column>
                                <el-table-column
                                    prop="amDeviceTemperature"
                                    label="温度">
                                </el-table-column>
                                <el-table-column
                                    prop="amCorrectMeasure"
                                    label="纠偏措施">
                                </el-table-column>
                                <el-table-column
                                    prop="amPhotoVideoUrl"
                                    label="照片">
                                    <template slot-scope="scope">
                                        <!-- <b class="column" @click="viewPhoto(scope.row.amPhotoVideoUrl)" v-if="scope.row.amPhotoVideoUrl!=''&&scope.row.amPhotoVideoUrl!=null">
                                            <i class="el-icon-picture-outline"></i>
                                        </b> -->
                                        <el-button size="mini" icon="el-icon-view" type="primary"
                                            @click="viewPhoto(scope.row.amPhotoVideoUrlNew)" 
                                            v-if="scope.row.amPhotoVideoUrlNew!=''&&scope.row.amPhotoVideoUrlNew!=null">
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table-column>
                            <el-table-column label="交班" min-width="300" >
                                <el-table-column
                                    prop="pmDeviceName"
                                    label="设备名称">
                                </el-table-column>
                                <el-table-column
                                    prop="pmDeviceTemperature"
                                    label="温度">
                                </el-table-column>
                                <el-table-column
                                    prop="pmCorrectMeasure"
                                    label="纠偏措施">
                                </el-table-column>
                                <el-table-column
                                    prop="pmPhotoVideoUrl"
                                    label="照片">
                                    <template slot-scope="scope">
                                        <!-- <b class="column" @click="viewPhoto(scope.row.pmPhotoVideoUrl)" v-if="scope.row.pmPhotoVideoUrl!=''&&scope.row.pmPhotoVideoUrl!=null">
                                            <i class="el-icon-picture-outline"></i>
                                        </b> -->
                                        <el-button size="mini" icon="el-icon-view" type="primary"
                                            @click="viewPhoto(scope.row.pmPhotoVideoUrlNew)" 
                                            v-if="scope.row.pmPhotoVideoUrlNew!=''&&scope.row.pmPhotoVideoUrlNew!=null">
                                        </el-button>
                                    </template>
                                </el-table-column>
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
                                :total="freezerReportList.records==''?0:freezerReportList.records">
                            </el-pagination>
                        </div>
                    </div>
                </div>
            </el-main>
        </el-container>
        <el-dialog :visible.sync="dialogImgVisible" :close-on-click-modal='false' title="图片预览" >
            <!-- <img width="100%" :src="dialogImageUrl" alt=""> -->
            <el-carousel indicator-position="outside" :height="imgHeight+'px'" style="text-align:center">
                <el-carousel-item v-for="item in imageUrlList" :key="item">
                    <img ref="image" :src="item" alt="">
                </el-carousel-item>
            </el-carousel>
        </el-dialog>
               
    </div>
</template>

<script>
import config from '@/api/config'
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
                            data: 2
                        }, 
                        {
                            field: "startDate", 
                            data: ""
                        }
                    ]
                }
            },
            listLoading:false,
            freezerReportList:{
                records:1,
                rows:[]
            },
            orgId:"",
            isShop:false,
            isShowTemp:true,
            time:"",
            dialogImgVisible:false,
            imageUrlList:[],
            imgHeight: "400"
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
    mounted() {
        this.getTime()
    },
    methods:{
        //设置默认时间
        getTime(){
            let starttime = new Date();
            let year = starttime.getFullYear();
            let month = starttime.getMonth() + 1;
            let day = starttime.getUTCDate();
            starttime = `${year}-${month}-${day}`
            this.time = starttime
        },
        // 获取轮播图高度
        imgLoad() {
            setTimeout(()=>{
                this.$nextTick(()=> {
                    this.imgHeight = this.$refs.image[0].height;
                });
            },200)
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
            if(this.time==""){
                this.$message({
                    message: this.$t('message.timeSelect'),
                    type: 'error'
                })
                return
            }else{                
                this.params.filters.rules[3].data = this.time                
                this.listLoading = true
                this.params.filters.rules[0].data = this.orgId
                this.params.filters.rules[1].data = this.orgId
                this.$api.data.queryFreezerReport(this.params).then(res=>{
                    if(res.data.resCode == 0){
                        this.listLoading = false
                        this.freezerReportList = res.data.data
                    }else{
                        this.listLoading = false
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
        //查看图片
        viewPhoto(photoVideoUrl){
            /* this.imageUrlList = photoVideoUrl.split(',')
            this.imageUrlList = this.imageUrlList.filter(n => n)
            this.imageUrlList = this.imageUrlList.map(i=>config.currentUrl.imgBaseUrl+i) */
            this.imageUrlList.push(photoVideoUrl)
            // 获取到图片后，调用this.imgLoad()方法定义图片初始高度
            //this.imgLoad();
            setTimeout(()=>{
                this.dialogImgVisible = true
            },200)
        }
    }
    
}
</script>