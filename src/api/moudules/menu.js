import axios from '../axios'

// 查找导航菜单树
export const getMenu = () => {
    return axios({
        url: '/saasController/getDataByTokenNew',
        method: 'get'
    })
}