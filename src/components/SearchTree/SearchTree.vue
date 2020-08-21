<template>
    <div class="SearchTree">
        <!-- tree -->
        <div style="width:300px;height: 100%;overflow: hidden;padding-left:6px">
            <el-input class="filterTreeInput" :placeholder="$t('home.orgSearch')" v-model="filterText" suffix-icon="el-icon-search"></el-input>
            <!-- 组织架构列表 -->
            <el-scrollbar class="scrollbar">
                <el-tree class="filter-tree" 
                    :data="treeList.list" 
                    :props="defaultProps" 
                    :highlight-current="highlightTree" 
                    node-key="id" 
                    :filter-node-method="filterNode" 
                    ref="tree" 
                    style="margin-top :20px;" 
                    @node-click="nodeClick"
                    v-loading="loadTree"
                    >
                    <!--加图标 -->
                    <span class="organBox" slot-scope="{ node, data }">
                        <img v-if="data.isLeaf == '0'" src="@/assets/images/organization.png" alt="organization" style="margin-top: 3px" />
                        <img v-else src="@/assets/images/store.png" alt="store" style="margin-top: 5px" />
                        <span class="one-txt-cut organName" :title="data.name">{{data.name}}</span>
                    </span>
                </el-tree>
            </el-scrollbar>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { changeTreeData } from '@/utils/changeTree'
export default {
    name: "SearchTree",
    data() {
        return {
            filterText: "",
            defaultProps: {
                children: "children",
                label: "name"
            },
            highlightTree: true, // 选中树高亮
            allShops: [],
            widths: {
                width:
                this.inputHeight > 100
                    ? this.inputHeight + "px"
                    : this.inputHeight + "%"
            },
            treeList:{
                list:[]
            },
            loadTree:false
        };
    },
    props: {
        value: {},
        last: {
            type: Boolean,
            default: false
        },
        valuelist: {
            type: Boolean,
            default: false
        },
        inputHeight: {
            type: String,
            default: "300"
        }
    },
    watch: {
        filterText(val) {
            this.$refs.tree.filter(val);
        },
        language(val) { }
    },
    /* computed: {
        ...mapGetters({
            treelist: "getOrgantreelists"
        })
    }, */
    created() {
        //this.$store.dispatch('getOrgTreeList', 2) 
        this.init()
    },
    methods: {
        init(){
            this.loadTree = true
            let formData = new FormData();
            formData.append('type', 1)
            this.$api.orgTree.getTreeList(formData).then(res=>{
                this.loadTree = false
                if(res.data.resCode == 0){ 
                    let treeOrg = changeTreeData(res.data.data.data); 
                    //console.log("treeOrg:"+JSON.stringify(treeOrg))             
                    this.treeList.list = treeOrg;
                } else {
                    this.treeList.list = []
                }
            }).catch((er) => {
                setTimeout(() => {
                    this.loadTree = false
                }, 3000)
            })
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },
        nodeClick(data, node, current) {
            /* this.$store.commit('curTreeNode',data) */
            const treeNode = {
                id: data.id,
                isLeaf: data.isLeaf,
                name: data.name,
                open: data.open,
                pId: data.pId,                
                checked: data.checked,
                icon: data.icon,
            }
            this.$emit("input", treeNode);
        }
    }
};
</script>
<style lang="less" scoped>
.SearchTree {
    /*width:300px;*/
    height: 100%;
    border-right: solid 20px #f4f4f4;
    padding-top: 10px;
    background: #fff;
    .disappear {
        display: none;
    }
    .query {
        width: 100%;
        height: auto;
        padding: 20px 10px 0;
    }
    section {
        height: calc(100% + 60px);
        aside {
            box-sizing: border-box;
            padding: 20px 2px 10px;
            height: 100%;
            overflow: hidden;
            position: relative;
            .cutOrg {
                margin-top: 15px;
                padding-left: 5px;
                img {
                    cursor: pointer;
                    width: 24px;
                    height: 24px;
                    margin-top: 3px;
                }
                i {
                    cursor: pointer;
                    font-size: 30px;
                }
            }
            .filter-tree,
            .shop-tree {
                padding-top: 10px;
                height: calc(100% - 45px);
                overflow-y: auto;
                width: 300px;
                li {
                    height: 26px;
                    img {
                        width: 14px;
                        height: 14px;
                        margin: 6px 5px 0 0;
                    }
                    span {
                        font-size: 16px;
                        line-height: 26px;
                    }
                    &:hover {
                        cursor: pointer;
                        background: #f5f5f5;
                    }
                }
            }
            .filter-tree {
                div:nth-last-child(3) {
                    padding-bottom: 0px;
                }
            }
            .organBox {
                width: calc(100% - 38px);
                .organName {
                    padding-left: 4px;
                    display: inline-block;
                    width: calc(100% - 15px);
                }
                .one-txt-cut {
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
            }
            .card {
                position: absolute;
                top: 0;
                left: 0;
                z-index: 9;
                .item {
                    font-size: 14px;
                    padding: 8px 15px;
                    &:hover {
                        cursor: pointer;
                        background: #f4f4f4;
                    }
                }
            }
            // 弹框
            .modeDia {
                .uploadBox.flex {
                    span.box1 {
                        min-width: auto;
                        line-height: 34px;
                        padding-right: 20px;
                        margin-left: 120px;
                        font-size: 16px;
                        @media screen and (min-width: 1024px) and (max-width: 1100px) {
                            padding-right: 10px;
                            margin-left: -5px;
                        }
                        @media screen and (min-width: 1100px) and (max-width: 1600px) {
                            margin-left: 4%;
                        }
                    }
                }
                .flex {
                    span {
                        display: inline-block;
                        min-width: 100px;
                        line-height: 40px;
                    }
                }
                .moveBox {
                    width: 100%;
                    height: auto;
                    .boxLeft {
                        min-width: 50%;
                        padding-left: 20px;
                        overflow-x: scroll;
                        p {
                            padding-bottom: 10px;
                        }
                    }
                    .left {
                        border-right: solid 1px #e1e1e1;
                    }
                }
            }
        }
        main {
            overflow: hidden;
        }
    }
    .scrollbar {
        position: relative;
        width: 100%;
        height: calc(100vh - 150px);
        overflow: hidden;
    }
}
</style>
<style lang="less">
.SearchTree {
    .el-scrollbar__wrap{
        overflow-x: hidden;
    }
}
</style>