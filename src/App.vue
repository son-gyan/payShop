<template>
    <div id="app">
        <router-view />
    </div>
</template>


<style lang="less">
#app {
    .boxtitle {
        color: #888;
        font-size: 17px;
        height: 30px;
        line-height: 30px;
        background-color: #f4f4f4;
        padding-left: 10px;
        position: relative;
        &:after {
            content: "";
            display: block;
            clear: both;
            width: 4px;
            height: 25px;
            background-color: #ffb427;
            left: 0;
            top: 2px;
            position: absolute;
        }
    }
    /* .el-form.el-form--inline {
        .timesWrap .el-form-item__content{
            max-width: 255px;
        }
    } */
    .timesWrap .el-form-item__content{
        max-width: 255px;
    }
    .boxList {
        .el-table__body,.el-table__header{
            width: 100% !important;
        }
        .el-table .cell{
            white-space:pre-line;
        }
    }
}
</style>
