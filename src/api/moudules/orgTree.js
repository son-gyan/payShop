
import axios from '../axios'

// 查找导航菜单树
export const getTreeList = (data) => {
    return axios({
        url: '/admin/org/getOrgTreeList',
        method: 'post',
        data
    })
}