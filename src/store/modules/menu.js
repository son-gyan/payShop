const menu =  {
    state: {
        navTree: [],  // 导航菜单树
    },
    getters: {
   
    },
    mutations: {
        setNavTree(state, navTree){  // 设置导航菜单树
            //debugger
            sessionStorage.setItem('navTree', JSON.stringify(navTree));
            state.navTree = navTree;
        }
    },
    actions: {
        
    }
}
export default menu