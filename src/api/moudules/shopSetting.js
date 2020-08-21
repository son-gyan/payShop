/* 
 * 设置板块
 */

import axios from '../axios'


/* 
 *  设备管理
 *  2020/8/6
 */
// 获取设备列表
export const getDeviceList = (data) => {
    return axios({
        url: '/shop/device/list',
        method: 'post',
        data
    })
}
// 获取选择框设备列表数据
export const getSelect = (params) => {
    return axios({
        url: '/shop/device/getSelect',
        method: 'get',
        params
    })
}

// 新增修改设备
export const saveDevice = (data) => {
    return axios({
        url: '/shop/device/save',
        method: 'post',
        data
    })
}

// 维修、启用、停用、删除设备
export const dealDevice = (params) => {
    return axios({
        url: '/shop/device/dealDevice',
        method: 'get',
        params
    })
}


/* 
 *  店员管理
 *  2020/8/7
 */

// 获取设备列表
export const getSalesPersonList = (data) => {
    return axios({
        url: '/shop/employee/list',
        method: 'post',
        data
    })
}
// 获取设备列表
export const quitSalesPerson = (params) => {
    return axios({
        url: '/shop/employee/dealEmployee',
        method: 'get',
        params
    })
}
// 新增店员
export const saveSalesPerson = (data) => {
    return axios({
        url: '/shop/employee/save',
        method: 'post',
        data
    })
}
// 导入店员
export const uploadSalesPerson = (data) => {
    return axios({
        url: '/shop/employee/upload',
        method: 'post',
        data
    })
}


/* 
 *  回收厂商管理
 *  2020/8/7
 */
// 获取回收厂商信息
export const getRecyle = (orgId) => {
    return axios({
        url: '/shop/recycling/'+orgId,
        method: 'get'
    })
}

// 保存回收厂商
export const saveRecyle = (data) => {
    return axios({
        url: '/shop/recycling/save',
        method: 'post',
        data
    })
}

// 上传图片
export const uploadCompanyId = (data) => {
    return axios({
        url: '/qc/task/uploadCompanyId',
        method: 'post',
        data
    })
}

/* 
 *  消杀厂商管理
 *  2020/8/7
 */
// 获取回收厂商信息
export const getSter = (orgId) => {
    return axios({
        url: '/shop/ster/'+orgId,
        method: 'get'
    })
}

// 保存消杀厂商
export const saveSter = (data) => {
    return axios({
        url: '/shop/ster/save',
        method: 'post',
        data
    })
}

