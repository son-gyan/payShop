<template>
    <div class="head">
        <el-header style="height:56px">
            <div class="sysName">
                <div class="flex">
                    <img @click="toIndex" class="pointer" src="@/assets/images/common/logoLeftTop.png" />
                </div>
                <i class="el-icon-arrow-down" @mouseover="hoverArrow('in')"></i>
            </div>
            <div class="sysHead" @mouseover="hoverArrow('out')">
                <el-row>
                    <el-col :span="24">
                        <div class="fr">
                            <lang></lang>
                            <i class="el-icon-message-solid"></i>
                            <i class="el-icon-more" style="transform:rotate(90deg)"></i>
                            <i class="el-icon-s-custom"></i>
                            <log-out></log-out>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </el-header>
    </div>
</template>
<script>
import Lang from "@/components/common/langSelect";
import LogOut from "@/components/common/logOut";
export default {
    data() {
        return {

        };
    },
    methods:{
        toIndex() { },
        hoverArrow(type) {
            if (type == "in") {
                window.parent.postMessage({
                    showMenu: true
                },"*");
            } else {
                window.parent.postMessage({
                    showMenu: false
                }, "*");
            }
        },
    },
    components: { Lang, LogOut }
}
</script>
<style lang="less" scoped >
@import '../../assets/css/color.less';
.head {
  position: relative;
  z-index: 9999;
}
.el-header {
  height: 56px;
  line-height: 56px;
  background-color: @main1;
  overflow: hidden;
  color: #fff;
  font-size: 16px;
  .sysName {
    // position: absolute;
    // top: 0;
    // left: 0;
    // z-index: 999;
    float: left;
    min-width: 200px;
    display: flex;
    text-align: center;
    ul {
      width: 740px;
      height: auto;
      background: #fff;
      position: absolute;
      top: 56px;
      left: 0;
      z-index: 999;
      padding: 18px 10px 0 10px;
      border-radius: 10px;
      li {
        margin-bottom: 20px;
      }
      p {
        color: #333;
      }
      img {
        width: 120px;
        height: 120px;
        margin-top: 0;
      }
    }
    img {
      width: 100px;
      height: 30px;
      margin-top: 14px;
    }
    i {
      width: 100px;
      margin-left: 10px;
      line-height: 56px;
      text-align: left;
      &:hover {
        cursor: pointer;
      }
    }
  }
  .sysHead {
    float: right;
    i {
      font-size: 22px;
    }
  }
}
</style>