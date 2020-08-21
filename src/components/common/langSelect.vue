<template>
    <span>
        <el-dropdown trigger="hover" class="international" @command="handleSetLanguage">
            <div class="lang">{{ $t('home.langSwitch') }}</div>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :disabled="language === 'en'" command="en">English</el-dropdown-item>
                <el-dropdown-item :disabled="language === 'cn'" command="cn">中文</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </span>
</template>
<script>
export default {
    data(){
        return {
            
        }
    },
    computed: {
        language() {
            // console.log(this.$store.getters.language)
            return this.$store.getters.language
        }
    },
    methods:{
        handleSetLanguage(lang){
            this.$i18n.locale = lang
            this.$store.dispatch('setLanguage', lang);
            window.parent.postMessage({
                language: lang
            }, '*')
        },
    }
}
</script>
<style lang="less" scoped>
div.lang {
  font-size: 16px;
  color: #fff;
  margin-right: 5px;
}
.el-dropdown-menu {
  top: 30px !important;
  z-index: 999999 !important;
}
</style>