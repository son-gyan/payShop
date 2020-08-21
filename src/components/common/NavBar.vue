<template>
    <div class="menu-bar-container">
        <!-- logo -->
        <!-- <div class="logo"  :class="collapse?'menu-bar-collapse-width':'menu-bar-width'"
            @click="$router.push('/index')" >
            <img v-if="collapse" src="@/assets/logo.png"/> <div>{{collapse?'':appName}}</div>
        </div> -->
        <!-- 导航菜单 -->
        <el-scrollbar wrap-class="list">
            <el-menu ref="navmenu" :default-active="defaultActive" :class="collapse?'menu-bar-collapse-width':'menu-bar-width'"
                :collapse="collapse" :collapse-transition="false" :unique-opened="true"
                @open="handleopen" @close="handleclose" @select="handleselect"
                > <!-- background-color="#000" text-color="#fff" -->
                <!-- 导航菜单树组件，动态加载菜单 -->
                <menu-tree v-for="item in navTree" :key="item.menuId" :menu="item"></menu-tree>
                <!-- <img src="@/assets/u123.png" class="menuImg"/> -->
            </el-menu>
        </el-scrollbar>
	</div>
</template>
<script>
    import { mapState } from 'vuex'
    import MenuTree from "@/components/MenuTree"
    export default {
        components:{
            MenuTree
        },
        data(){
            return {
                defaultActive : ""
            }
        },
        computed: {
            ...mapState({
                appName: state=>state.app.appName,
                collapse: state=>state.app.collapse,
                navTree: state=>state.menu.navTree
            })
        },
        watch: {
            $route: 'handleRoute'
        },
        created () {
            this.handleRoute(this.$route)
            //debugger
            if(this.$route.path == '/index'){                
                this.defaultActive = ''+(this.$route.meta.index+1);
            }else{
                this.defaultActive = ''+this.$route.meta.index;
            }
            
            
        },
        methods: {
            handleopen() {
                //console.log('handleopen')
            },
            handleclose() {
                //console.log('handleclose')
            },
            handleselect(a, b) {
                //console.log(this.navTree)
                //debugger
            },
            // 路由操作处理
            handleRoute (route) {  
                // 切换标签页时同步更新高亮菜单
                let self = this;
                this.$nextTick(() => {  
                    if(self.$refs.navmenu != null) {
                        if(route.path == '/index'){
                            self.$refs.navmenu.activeIndex = '' + (route.meta.index+1);
                        }else{                            
                            self.$refs.navmenu.activeIndex = '' + route.meta.index
                        }
                        self.$refs.navmenu.initOpenedMenu()
                    }
                })
            }
        }
    }
</script>
<style scoped lang="scss">
    .menu-bar-container {
        position: fixed;
        /* width: 200px; */
        top: 0px;
        left: 0;
        bottom: 0;
        z-index: 1020;
        background-color: #222;        
        .el-menu {
            padding-bottom: 20px;
            text-align: left;
        }
        .logo {
            position:absolute;
            top: 0px;
            height: 56px;   
            line-height: 56px;
            //background: #545c64;
            background: #000;
            cursor:pointer;
            img {
                width: 40px;
                height: 40px;
                border-radius: 0px;
                margin: 10px 10px 10px 10px;
                float: left;
            }
            div {
                font-size: 25px;
                color: white;
                text-align: left;
                margin:0 20px;
            }
        }
        .menu-bar-width {
            width: 200px;
            border-right: none;
        }
        .menu-bar-collapse-width {
            width: 65px;
        }
        .menuImg{
            position:absolute;
            bottom: 20px;
            width: 100%; 
            margin-top: 40px;
        }
    } 
</style>
<style lang="scss"> 
.menu-bar-container {       
    .list{
        position: relative;
        margin-top: 56px;
        width: 218px;
        height: calc(100vh - 40px);
    }
    //隐藏横向滚动条
    .el-scrollbar__wrap{
        overflow-x: hidden;
    }
    .el-menu{
        background-color: #30373d;
    }
    .el-submenu__title i{
        color:#fff;
        &.icon-sidebar_1{
            display: inline-block;
            width: 24px;
            height:22px;
            margin-right: 5px;
        } 
    }
    .el-menu-item i{
        display: inline-block;
        width: 24px;
        margin-right: 5px;
        color:#fff;          
        &.icon-sidebar_2{
            display: inline-block;
            width: 24px;
            height:22px;
            //background: url('../../assets/images/sidebar_02.png') center no-repeat;
        }  
        &.icon-sidebar_3{
            display: inline-block;
            width: 24px;
            height:22px;
            //background: url('../../assets/images/sidebar_03.png') center no-repeat;
        }  
        &.icon-sidebar_4{
            display: inline-block;
            width: 24px;
            height:22px;
            //background: url('../../assets/images/sidebar_04.png') center no-repeat;
        } 
    }
    .fa.fa-lg {
        font-size: 18px;
        line-height: 1;
        vertical-align: middle;
        width: 24px;
        margin-right: 5px;
        text-align: center;
    }
    .el-menu.menu-bar-width{        
        //border-top: 3px solid #fff;
        background-color: #222;
        color:#fff;
    }
    .el-menu-item,.el-submenu__title{
        color:#fff;
        padding-left: 20px !important;
        // border-left: 5px solid transparent;
        box-sizing: border-box;
    }
    .el-submenu__icon-arrow{
        right: 7px;
        margin-top: -6px;
    }
    .el-submenu__title{
        &:hover{
            color: #ffb427;
            background-color: #282d33;
            // border-left: 5px solid #ffb427;
        }
    }
    .el-menu-item:focus, .el-menu-item:hover{
        color: #ffb427;
        background-color: #282d33;
        // border-left: 5px solid #ffb427;
    }
    .el-menu-item.is-active {
        color: #ffb427;
        background-color: #282d33;
        // border-left: 5px solid #ffb427;
    }
}
</style>