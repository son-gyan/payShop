<template>
    <div class="pages">
        <!-- 头部区域 -->
        <v-header></v-header>
        <div class="f-main">
            <!-- 导航菜单栏 -->
            <div class="nav">
                <nav-bar></nav-bar>
            </div>
            <!-- 主内容区域 -->
            <main-content></main-content>
        </div>
    </div>
</template>
<script>
import vHeader from "@/components/common/header";
import NavBar from "@/components/common/NavBar"
import MainContent from "@/components/common/MainContent"
export default {
    components:{
        vHeader,
        NavBar,
        MainContent
    }
}
</script>
<style scoped lang="less" scoped>
.v-header {
    width: 100%;
}
.f-main {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: calc(100vh - 68px);
    overflow: hidden;
    .nav {
        flex: none;    
    }
    .nav * {
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
    }
    .f-content {
        width: calc(100% - 250px);
        flex: 1;
        padding-bottom: 40px;
        background-color: #ffffff;
        height: calc(100vh - 68px);
        overflow-y: auto;
    }
}
</style>