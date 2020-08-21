import i18n from '@/lang'
const app = {
    state: {
        appName: "付店长",  // 应用名称        
        collapse:false,  // 导航栏收缩状态
        language: i18n.locale, //语言
        companyId: '', //企业id
        collapse:false,  // 导航栏收缩状态
        userInfo:{},  //用户信息
        firstEnter:false
    },
    mutations: {
        LANGUAGE: (state, language) => {
            i18n.locale = language
            state.language = language
            sessionStorage.setItem('language', language)
        },
        COMPANY_ID: (state, companyId) => {
            state.companyId = companyId
            sessionStorage.setItem('companyId', companyId)
        },
        onCollapse(state){
            state.collapse = !state.collapse
        },
        USERINFO: (state,userInfo) => {
            state.userInfo = userInfo
            sessionStorage.setItem('USERINFO', userInfo)
        },
        FIRSTENTER:(state,firstEnter) => {
            state.firstEnter = firstEnter
            sessionStorage.setItem('FIRSTENTER', firstEnter)
        }
    },
    actions: {
        setLanguage({ commit }, language) {
            commit('LANGUAGE', language)
        },
        setCompanyId({ commit }, companyId) {
            commit('COMPANY_ID', companyId)
        },
        setUserInfo({ commit }, userInfo){
            commit('USERINFO', userInfo)
        },
        setFirstEnter({ commit }, firstEnter){
            commit('FIRSTENTER', firstEnter)
        }
    }
}
export default app