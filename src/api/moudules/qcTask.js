import axios from '../axios'

// 获取任务分类列表
export const getTaskTypeList = (data) => {
    return axios({
        url: '/qc/workingtype/list',
        method: 'post',
        data
    })
}
// 保存任务分类
export const saveTaskType = (data) => {
    return axios({
        url: '/qc/workingtype/save',
        method: 'post',
        data
    })
}
// 删除任务分类
export const delTaskType = (params) => {
    return axios({
        url: '/qc/workingtype/delete',
        method: 'get',
        params
    })
}
// 上移任务分类
export const moveUpTaskType = (params) => {
    return axios({
        url: '/qc/workingtype/moveUp',
        method: 'get',
        params
    })
}
// 下移任务分类
export const moveDownTaskType = (params) => {
    return axios({
        url: '/qc/workingtype/moveDown',
        method: 'get',
        params
    })
}

// 获取工作区域列表
export const getWorkAreaList = (data) => {
    return axios({
        url: '/qc/workingarea/list',
        method: 'post',
        data
    })
}
// 保存工作区域
export const saveWorkArea = (data) => {
    return axios({
        url: '/qc/workingarea/save',
        method: 'post',
        data
    })
}
// 删除工作区域
export const delWorkArea = (params) => {
    return axios({
        url: '/qc/workingarea/delete',
        method: 'get',
        params
    })
}

// 上移工作区域
export const moveUpWorkArea = (params) => {
    return axios({
        url: '/qc/workingarea/moveUp',
        method: 'get',
        params
    })
}
// 下移工作区域
export const moveDownWorkArea = (params) => {
    return axios({
        url: '/qc/workingarea/moveDown',
        method: 'get',
        params
    })
}