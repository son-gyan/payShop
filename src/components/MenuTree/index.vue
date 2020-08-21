<template>
  <el-submenu v-if="menu.children && menu.children.length >= 1" :index="'' + menu.menuId">
    <template slot="title">
      <i :class="menu.iconUrl" ></i>
      <span slot="title">{{$t(menu.menuName)}}</span>
    </template>
    <MenuTree v-for="item in menu.children" :key="item.menuId" :menu="item"></MenuTree>
  </el-submenu>
  <el-menu-item v-else :index="'' + menu.menuId" @click="handleRoute(menu)">
    <i :class="menu.iconUrl"></i>
    <span slot="title">{{$t(menu.menuName)}}</span>
  </el-menu-item>
</template>
<script>
    //import { getIFrameUrl, getIFramePath } from '@/utils/iframe'
    export default {
        name: 'MenuTree',
        props: {
            menu: {
                type: Object,
                required: true
            }
        },
        methods: {
            handleRoute (menu) {
                // 如果是嵌套页面，转换成iframe的path
                let path //= getIFramePath(menu.menuUrl)
                if(!path) {
                    path = menu.menuUrl
                }
                // 通过菜单URL跳转至指定路由
                this.$router.push("/" + path)
            }
        }
    }
</script>
<style lang="less" >
.el-submenu .el-menu-item{
    display: flex;
    line-height: 1.5;
    align-items: center;
    justify-content: flex-start;
    white-space: initial;
    padding-left: 10px !important;
    padding-right: 10px;
    box-sizing: border-box;
}
  
</style>