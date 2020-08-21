// mutations尽量与getters名一样，只不过一个全大写，一个驼峰AREA1_OPTIONS => area1Options
const getters = {
    language: state => state.app.language, // 语言
    companyId: state => state.app.companyId, // 企业id
    userInfo: state => state.app.userInfo, // 用户信息
    getOrgantreelists: state => state.orgTree.treelist, //获取组织架构树
    firstEnter: state => state.app.firstEnter, // 用户信息
}
export default getters