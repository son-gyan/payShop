// 开发环境网址
let devUrl = {
    apiBase: 'http://139.9.121.98:8763', // api地址
    staticUrl: 'http://139.9.121.98' // 静态文件地址
}

// 生产环境网址
let proUrl = {
    // 测试环境
    // apiBase: 'http://139.9.121.98:8763',
    // staticUrl: 'http://139.9.121.98'
    // // 正式环境
    apiBase: 'https://www.six-armscloud.com:9080',
    staticUrl: 'https://www.six-armscloud.com'
}

let config = {
    apiBase: 'http://139.9.121.98:8763', // api地址
    staticUrl: 'http://139.9.121.98' // 静态文件地址
}
  
let variable = "ys"  // "ys-localDebug"  // "lh-localDebug" // "yx-localDebug" // "ys" // "dev-localDebug" // 


if(variable == "dev"){
    config = {
        apiBase: 'http://139.9.121.98:8763', // api地址
        staticUrl: 'http://139.9.121.98', // 静态文件地址,
        imgBaseUrl: 'https://sixarms-dt.obs.cn-east-2.myhuaweicloud.com/'
    }
}else if(variable == "prod"){
    config = {
        apiBase: 'https://www.six-armscloud.com:9080',
        staticUrl: 'https://www.six-armscloud.com',
        imgBaseUrl: 'https://sixarms-dt.obs.cn-east-2.myhuaweicloud.com/'
    }
}else if(variable == "lh"){
    config = {
        apiBase: 'http://192.168.102.33:9080/fsrmanage',
        staticUrl: 'http://192.168.102.33',
        imgBaseUrl: 'https://sixarms-dt.obs.cn-east-2.myhuaweicloud.com/'
    }
}else if(variable == "ys"){
    config = {
        apiBase: 'http://192.168.102.115:9080/fsrmanage',
        staticUrl: 'http://192.168.102.115',
        imgBaseUrl: 'https://sixarms-dt.obs.cn-east-2.myhuaweicloud.com/'
    }
}

let currentUrl = null // 当前的网址
// 通用的网址
const commonUrl = {}

let AES_KEY = null // aes加密的key
const env = process.env.NODE_ENV
if (env === 'production') {
    currentUrl = Object.assign(commonUrl, config)
    AES_KEY = 'Diveo@Ct&#9rootn'
} else if (env === 'development') {
    currentUrl = Object.assign(commonUrl, config)
    AES_KEY = 'Diveo@Ct&#9rootn'
}
  
export default {
    currentUrl,
    AES_KEY,
}