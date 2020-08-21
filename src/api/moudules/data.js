/* 
 * 数据档案板块
 */

import axios from '../axios'

/* 
 *  冷冻库温度(每日任务)监控记录
 *  2020/8/7
 */
// 获取冷冻库、冷藏库温度(每日任务)监控记录table表头
export const queryfreezerForHead = (data) => {
    return axios({
        url: '/data/queryfreezerForHead',
        method: 'post',
        data
    })
}
// 获取冷冻库、冷藏库温度(每日任务)监控记录table内容
export const queryfreezerForContent = (data) => {
    return axios({
        url: '/data/queryfreezerForContent',
        method: 'post',
        data
    })
}
//冷冻库、冷藏库温度单日详情
export const queryFreezerReport = (data) => {
    return axios({
        url: '/data/queryFreezerReport',
        method: 'post',
        data
    })
}

// 获取设备温度(每周任务)监控记录table表头
export const queryDeviceTemp2ForHead = (data) => {
    return axios({
        url: '/data/queryDeviceTemp2ForHead',
        method: 'post',
        data
    })
}
// 获取设备温度(每周任务)监控记录table内容
export const queryDeviceTemp2ForContent = (data) => {
    return axios({
        url: '/data/queryDeviceTemp2ForContent',
        method: 'post',
        data
    })
}

// 获取设备名称列表 qc/task/getSelect
export const getDeviceSelect = () => {
    return axios({
        url: '/qc/task/getSelect',
        method: 'get'
    })
}

// 获取设备温度(每周任务)监控记录table表头
export const queryDeviceTempByProc = (data) => {
    return axios({
        url: '/data/queryDeviceTempByProc',
        method: 'post',
        data
    })
}
// 获取设备温度(每周任务)监控记录table内容
export const pageDeviceTempByProc = (data) => {
    return axios({
        url: '/data/pageDeviceTempByProc',
        method: 'post',
        data
    })
}

//获取全国故障统计图表数据
export const queryDevicestateByProc = (data) => {
    return axios({
        url: '/data/queryDevicestateByProc',
        method: 'post',
        data
    })
}

//获取详细故障统计图表数据
export const queryFaultDetailByProc = (data) => {
    return axios({
        url: '/data/queryFaultDetailByProc',
        method: 'post',
        data
    })
}

//获取当前台账报表数据
export const queryAccountDataReport = (data) => {
    return axios({
        url: '/data/queryAccountDataReport',
        method: 'post',
        data
    })
}

//当前台账报表用完操作
export const updateAccountData = (params) => {
    return axios({
        url: '/data/updateAccountData',
        method: 'get',
        params
    })
}

//导入当前台账报表 uploadAccountDate
export const uploadAccountDate = (data) => {
    return axios({
        url: '/data/uploadAccountDate',
        method: 'post',
        data
    })
}

//获取台账预警及告警报表table数据
export const queryAcountInfoSndWeb = (data) => {
    return axios({
        url: '/data/queryAcountInfoSndWeb',
        method: 'post',
        data
    })
}

//获取台账预警及告警报表图表数据
export const queryAcountInfoSndAll = (data) => {
    return axios({
        url: '/data/queryAcountInfoSndAll',
        method: 'post',
        data
    })
}

//获取健康证记录报表数据
export const queryHealthData = (data) => {
    return axios({
        url: '/data/queryHealthData',
        method: 'post',
        data
    })
}

//获取台账预警及告警报表table数据
export const queryHealthWarnData = (data) => {
    return axios({
        url: '/data/queryHealthWarnData',
        method: 'post',
        data
    })
}

//获取台账预警及告警报表图表数据
export const queryHealthChart = (data) => {
    return axios({
        url: '/data/queryHealthChart',
        method: 'post',
        data
    })
}

//获取员工健康申报记录报表tableData1数据
export const queryHealthCondReport = (data) => {
    return axios({
        url: '/data/queryHealthCondReport',
        method: 'post',
        data
    })
}

//获取员工健康申报记录报表tableData2数据
export const queryHealthCondReport1 = (data) => {
    return axios({
        url: '/data/queryHealthCondReport1',
        method: 'post',
        data
    })
}

//获取教育培训记录报表图表数据
export const queryEduDataJz = (data) => {
    return axios({
        url: '/data/queryEduDataJz',
        method: 'post',
        data
    })
}

//获取教育培训记录报表table数据
export const queryEduData = (data) => {
    return axios({
        url: '/data/queryEduData',
        method: 'post',
        data
    })
}

//获取教育培训记录报表详情数据
export const queryEduDataDetails = (data) => {
    return axios({
        url: '/data/queryEduDataDetails',
        method: 'post',
        data
    })
}


//获取教育培训记录报表图表数据
export const queryFdaSampleReportHead = (data) => {
    return axios({
        url: '/data/queryFdaSampleReportHead',
        method: 'post',
        data
    })
}

//获取FDA门店取样统计报表table数据
export const queryFdaSampleReport = (data) => {
    return axios({
        url: '/data/queryFdaSampleReport',
        method: 'post',
        data
    })
}

//获取FDA门店检查统计报表table数据
export const queryFdaCheckReport = (data) => {
    return axios({
        url: '/data/queryFdaCheckReport',
        method: 'post',
        data
    })
}

//获取垃圾回收、废油回收报表table数据
export const queryRubbishRecycleOrWasteOil = (data) => {
    return axios({
        url: '/data/queryRubbishRecycleOrWasteOil',
        method: 'post',
        data
    })
}

//获取虫鼠害防治记录报表table数据
export const queryInsectProofData = (data) => {
    return axios({
        url: '/data/queryInsectProofData',
        method: 'post',
        data
    })
}