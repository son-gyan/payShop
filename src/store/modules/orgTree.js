import api from '@/api/api'

const orgTree = {
    state:{
        treelist: {
            list: []
        },
        curTreeNode:{}
    },

    /* getters:{
        getOrgantreelists() {
            return state.treelist;
        }
    },*/

    mutations:{
        GET_ORGANTREE(state, data) {
            state.treelist.list = data;
        },
        curTreeNode(state,data){
            state.curTreeNode = data
        }
    },

    actions:{
    }
}
export default orgTree