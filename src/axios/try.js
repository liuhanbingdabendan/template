import axios from 'axios'
import { message } from 'antd';

// 请求列表
const requestList = []
// 取消列表
const CancelToken = axios.CancelToken
let sources = {}

// axios.defaults.timeout = 10000
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'

axios.defaults.baseURL = 'http://172.16.20.161:8081/';

axios.interceptors.request.use((config) => {
  const request = JSON.stringify(config.url) + JSON.stringify(config.data)

  config.cancelToken = new CancelToken((cancel) => {
    sources[request] = cancel
  })

  if(requestList.includes(request)){
    sources[request]('取消重复请求')
  }else{
    requestList.push(request)
  }

//   if (token) {
//     config.headers.token = token
//   }

  return config
}, function (error) {
  return Promise.reject(error)
})

axios.interceptors.response.use(function (response) {
  const request = JSON.stringify(response.config.url) + JSON.stringify(response.config.data)
  requestList.splice(requestList.findIndex(item => item === request), 1)
  if (response.data.code === 900401) {
    window.ELEMENT.Message.error('认证失效，请重新登录！', 1000)
    this.props.history.push('/login')
  }
  return response
}, function (error) {
  if (axios.isCancel(error)) {
    throw new axios.Cancel('cancel request')
  } else {
    message.error('网络请求失败')
  }
  return Promise.reject(error)
})

const request = function (url, params, config, method) {
  return new Promise((resolve, reject) => {
    axios[method](url, params, Object.assign({}, config)).then(response => {
      resolve(response.data)
    }, err => {
      if (err.Cancel) {
        console.log(err)
      } else {
        reject(err)
      }
    }).catch(err => {
      reject(err)
    })
  })
}

const post = (url, params, config = {}) => {
  return request(url, params, config, 'post')
}

const get = (url, params, config = {}) => {
  return request(url, params, config, 'get')
}

// export {sources, post, get}
export default axios