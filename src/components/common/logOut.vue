<template>
    <span clsss="flex">
        <span>{{ $t('home.user') }}：{{ userInfo.userName }} &nbsp;</span>
        <img class="pointer" style=" margin-top:17px;" src="../../assets/images/common/signOut.png" @click="dialogVisible = true" />
        <div class="logOut">
            <el-dialog :close-on-click-modal="dialogClose" :title="$t('dialog.tips')" :visible.sync="dialogVisible" width="30%">
                <span style="padding-left:20px">{{ $t('dialog.sureToExit') }}</span>
                <div class="line"></div>
                <span slot="footer" class="fr">
                    <el-button @click="dialogVisible = false">{{ $t('button.cancel') }}</el-button>
                    <el-button type="primary" @click="loginOut">{{ $t('button.confirm') }}</el-button>
                </span>
            </el-dialog>
        </div>
    </span>
</template>
<script>
import { mapState, mapGetters} from 'vuex'
export default {
    data() {
        return {
            userName: "123",
            dialogVisible: false,
            dialogClose: false
        };
    },
    computed: {
        /* ...mapState({
            userInfo: state=>state.app.userInfo
        }), */
        ...mapGetters(['userInfo'])
    },
    methods: {
        loginOut(){
            this.$api.common.loginOut().then((res)=>{
                if (res.data.resCode == 0) {
                    debugger
                    top.window.location.href=res.data.data;
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
        }
    }
}
</script>