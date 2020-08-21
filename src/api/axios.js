import axios from 'axios'
import config from './config'
import { Loading, MessageBox, Upload } from 'element-ui'
import i18n from '../lang'
import api from './api'
import utils from '../utils'


export default function $axios(options) {
    return new Promise((resolve, reject) => {
        var baseURL = config.currentUrl.apiBase
        let setConfig = {
            method: 'get',
            // 基础url前缀
            baseUrl: config.currentUrl.apiBase,
            // 请求头信息
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Access-Control-Allow-Credentials':true,
                'X-Requested-With': 'XMLHttpRequest'
            },
            // 参数
            data: {},
            // 设置超时时间
            timeout: 100000,
            // 携带凭证
            withCredentials: true,
            // 返回数据类型
            responseType: 'json'
        }
        const instance = axios.create({
            baseURL: baseURL,//config.baseUrl,
            headers: setConfig.headers,
            timeout: setConfig.timeout,
            withCredentials: true//config.withCredentials
        });
        // 添加请求拦截器
        instance.interceptors.request.use(
            function(config) {
                let token = sessionStorage.getItem('Authorization')
                let companyId = sessionStorage.getItem('companyId')
                if (token) {
                    config.headers['Authorization'] = token
                }
                //debugger
                if (companyId) {
                    config.headers['company_id'] = companyId
                }
                // 时间戳 getOrgTreeList
                if (config.method === 'post') {
                    if(config.url.indexOf('upload') != -1||config.url.indexOf('getOrgTreeList') != -1){
                        config.headers['Content-Type'] = "multipart/form-data;charset=utf-8"
                    }else{
                        config.data = {
                          ...config.data,
                          t: Date.parse(new Date()) / 1000
                        }
                    }                    
                } else if (config.method === 'get') {
                    config.params = {
                        t: Date.parse(new Date()) / 1000,
                        ...config.params
                    }
                }
                return config
            },
            function(error) {
                // 对请求错误做点什么
                console.log(error)
                return Promise.reject(error)
            }
        )

        // 添加响应拦截器
        instance.interceptors.response.use(
            function(response) {
                // console.log(response)
                // 每一分钟更换一次token
                let newAuth = response.headers['authorization']
                if (newAuth !== undefined) {
                    sessionStorage.setItem('authorization', newAuth)
                }
                // console.log('response', response)
                // var loading = document.querySelector('#main .result>.el-loading-mask')
                // // console.log('index', loading)
                // if (loading) {
                //   loading.style.display = 'none'
                // }
                // console.log(response)
                return response
            },
            function(error) {
                // 对响应错误做点什么
                // console.log('error', error, error.response)
                // console.dir(error)
                var response = error.response
                if (response && response.status === 401) {
                    // console.log('token过期')
                    var i18nCode = i18n.t(`code.${error.response.data.resMsg}`)
                    MessageBox.alert(
                        i18nCode.startsWith('code.')
                        ? error.response.data.resMsg // 在code中没有找到，就用后台的提示语
                        : i18nCode, // 找到了，就用翻译的
                        i18n.t('message.sessionExp'),
                        {
                        confirmButtonText: i18n.t('message.toIndex'),
                        showClose: false,
                        callback: action => {
                            // action -> confirm/cancel
                            if (action === 'confirm') {
                                sessionStorage.clear()
                                const env = process.env.NODE_ENV
                            if (env === 'production') {
                                window.location.href = '/basicplatform'
                            } else if (env === 'development') {
                                window.location.href = '/'
                            }
                            }
                        }
                        }
                    )
                } else {
                    var erMsg
                    if (response && response.status === 400) {
                        erMsg = i18n.t('code.400')
                    } else if (response && response.status === 404) {
                        erMsg = i18n.t('code.404')
                    } else if (response && response.status === 406) {
                        erMsg = i18n.t('code.406')
                    } else if (response && response.status === 500) {
                        erMsg = i18n.t('code.500')
                    } else if (error.message.startsWith('timeout of')) {
                        erMsg = i18n.t('code.timeout')
                    } else if (error.message.startsWith('Network Error')) {
                        erMsg = i18n.t('code.network')
                    } else {
                        erMsg = i18n.t('code.500')
                    }
                    utils.$message({
                        // message: i18n.t('message.abnormal') + er,
                        message: erMsg,
                        type: 'error'
                    })
                }
                // var loading = document.querySelector('#main .result>.el-loading-mask')
                // // console.log('index', loading)
                // if (loading) {
                //   loading.style.display = 'none'
                // }
                // 对响应错误做点什么
                return Promise.reject(error)
            }
        )

        // 请求处理
        instance(options)
        .then(res => {
            if(res){              
              resolve(res);
            }
            return false;
        })
        .catch(error => {
          //debugger
            reject(error);
        }); 
    })

}
