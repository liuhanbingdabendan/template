import axios from 'axios';
import { message } from 'antd';

const comm = require('../serverConfig');

const Axios = axios.create({
	// baseURL:'http://duomi-admin.trustrock.in/',
	baseURL:comm.baseURL,
	// baseURL:'http://172.16.20.161:8081/',
	// baseURL:"http://localhost:3000/web/",
	timeout: 10000,
   headers: {
	'Content-Type': 'application/x-www-form-urlencoded',
	// 'Content-Type': "application/json;charset=utf-8",
	// 'Authorization':"Basic ZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SjFhV1FpT2pFc0luTmpiM0JsSWpvNExDSnBZWFFpT2pFMU5qQTROakF5TXprc0ltVjRjQ0k2TVRVMk16UTFNakl6T1gwLlhxdlNvZDQ0aUtGZzY0cmF6cGRGUjZkRlVFZ0FJQmxPMVkxUkNyRHl2YkU6"
  },
	retry:4,
	retryDelay:1000,
	crossOrigin: true,
	withCredentials:true,
	crossDomain:true,
});
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.withCredentials = true;

const pending = {}
const CancelToken = axios.CancelToken
const removePending = (key, isRequest = false) => {
  if (pending[key] && isRequest) {
    //pending[key]('取消重复请求')
  }
  delete pending[key]
}
const getRequestIdentify = (config, isReuest = false) => {
  let url = config.url
  if (isReuest) {
	url = config.baseURL + config.url.substring(1, config.url.length)
  }
  return config.method === 'get' ? encodeURIComponent(url + JSON.stringify(config.params)) : encodeURIComponent(config.url + JSON.stringify(config.data))
}

//请求拦截
Axios.interceptors.request.use((config)=>{
		// 在发送请求之前做些什么
		// 通过reudx的store拿到拿到全局状态树的token ，添加到请求报文，后台会根据该报文返回status
		// 此处应根据具体业务写token
		// const token = store.getState().user.token || localStorage.getItem('token');
		// const token = 'FA2019';
		// config.headers['X-Token'] = token;

		// 拦截重复请求(即当前正在进行的相同请求)
		let requestData = getRequestIdentify(config, true)
		removePending(requestData, true)
		config.cancelToken = new CancelToken((c) => {
		  pending[requestData] = c
		})

		return config;
	},(error)=>{
		// 对请求错误做些什么
		// message.error(error);
		return Promise.reject(error);
	}
);


// 添加响应拦截器
Axios.interceptors.response.use((response)=>{
		//把已经完成的请求从 pending 中移除

		let requestData = getRequestIdentify(response.config)
		removePending(requestData)
		if (response.headers['content-type'].indexOf('multipart/form-data') > -1) {
			downFile(response);
			return
		}

		//console.log(response.data);
		if (response.headers['content-type'].indexOf('image/jpeg') > -1) {
			 console.log('img')
			 const base64 = new Buffer(response.data,'binary').toString('base64');
             return `data:image/png;base64,${base64}`
		}
		if(response.status === 200){
			return response.data
		}else{
			message.error(response.data.msg);
		}

	  	// if(response.data.code===0||response.data.code==='0'){
		// 	return response.data
		// }else{
		// 	message.error(response.data.msg);
		// }


	},(error)=>{
		console.log(error.code);
		console.log(error.message);
		if (error.message.indexOf('Network Error') !== -1) {
			window.location.href = "index.html#/login";
		}
		if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
			var config = error.config;
			config.__retryCount = config.__retryCount || 0;

			if (config.__retryCount >= config.retry) {
				//window.location.reload();
				return Promise.reject(error);
			}

			config.__retryCount += 1;

			var backoff = new Promise(function(resolve) {
				setTimeout(function() {
					resolve();
				}, config.retryDelay || 1);
			});

			return backoff.then(function() {
				return axios(config);
			});
		} else {
			return Promise.reject(error);
		}
		
	}
);


// GET下载文件
function downFile(response) {
	  let blob = new Blob([response.data], {type: '*'})
	  const a = window.document.createElement('a');
	  const downUrl = window.URL.createObjectURL(blob); // 获取 blob 本地文件连接 (blob 为纯二进制对象，不能够直接保存到磁盘上)
	  const filename = response.headers['content-disposition'].split('fileName=')[1].split('.');
	  a.download = `${decodeURI(filename[0])}.${filename[1]}`;
	  a.href = downUrl;
	  a.click();
	  window.URL.revokeObjectURL(downUrl);
      message.success('下载成功！');
  }

export default Axios;
