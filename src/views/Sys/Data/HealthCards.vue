<template>
    <div class="point-loss-analysis-pages">  
        <div class="boxtitle">数据档案 > 健康证记录报表</div>
        <el-container>
            <search-tree v-model="Treeid" :valuelist="true"></search-tree>
            <el-main>
                <div class="formBG">
                    <el-form ref="form" :inline="true" label-width="90px">
                        <el-form-item label="时间段" class="timesWrap">
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
                            <el-button class="buttonInit" icon="el-icon-search" @click="searchData">{{ $t('button.query') }}</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="boxList" v-loading="listLoading">
                    <el-table :data="tableData.rows" border  empty-text="暂无数据" >
                        <el-table-column 
                            type="index" 
                            label="序号" 
                            width="100" 
                            align="center" 
                            :index="indexMethod">
                        </el-table-column>
                        <el-table-column
                            prop="name"
                            label="姓名"
                            min-width="180">
                        </el-table-column>
                        <el-table-column
                            prop="phoneCode"
                            label="电话号码"
                            min-width="180">
                        </el-table-column>
                        <el-table-column
                            prop="expiringDate"
                            label="到期日期"
                            min-width="180">
                        </el-table-column>
                        <el-table-column
                            prop="remark"
                            label="备注"
                            min-width="180">
                        </el-table-column>
                        <el-table-column label="照片" >
                            <template slot-scope="scope">
                                <el-button size="mini" icon="el-icon-view" plain @click="viewPhoto(scope.row)"></el-button>
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
                            :total="tableData.records==''?0:tableData.records">
                        </el-pagination>
                    </div>
                </div>
            </el-main>
        </el-container>
        <!-- 查看照片-->
        <el-dialog class="dialogWrap" 
            :close-on-click-modal='false' 
            :title="dialogTit" 
            :visible.sync="dialogVisible" 
            width="60%">
            <el-carousel indicator-position="outside" :height="imgHeight+'px'" style="text-align:center">
                <el-carousel-item v-for="item in imageUrlList" :key="item">
                    <img ref="image" :src="item" alt="" height="100%">
                </el-carousel-item>
            </el-carousel>
        </el-dialog> 
    </div>
</template>
<script>
    export default {
        data(){
            return {
                Treeid: {},
                orgId:"",
                isShop:false,
                tableData:{
                    rows:[],
                    records:0
                },
                listLoading:false,
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
                },
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
                                data: "1"
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
                dialogTit:"查看照片",
                dialogVisible:false,
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
        created(){
            this.getTime()
        },
        methods:{
            // 获取轮播图高度
            imgLoad() {
                setTimeout(()=>{
                    this.$nextTick(()=> {
                        //this.imgHeight = this.$refs.image?this.$refs.image[0].height:'400';
                    });
                },200)
            },
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
            searchData(){
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
                    this.params.filters.rules[2].data = dataRange[0]
                    this.params.filters.rules[3].data  = dataRange[1]
                }
                this.listLoading = true
                this.params.filters.rules[0].data = this.orgId
                this.params.filters.rules[1].data = '1'
                this.$api.data.queryHealthData(this.params).then(res=>{
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
            //查看图片
            viewPhoto(row){
                this.imageUrlList =  []
                this.imageUrlList = row.photoList
                this.imageUrlList = this.imageUrlList.map(i=>i.filePath)
                // 获取到图片后，调用this.imgLoad()方法定义图片初始高度
                this.imgLoad();
                setTimeout(()=>{
                    this.dialogVisible = true
                },200)
            }
        }
    }
</script>