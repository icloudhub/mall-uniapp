import urlConfig from './config.js'

const request = {}
const headers = {}
const PORT1 = '/baseinfo'
    
request.senddata = (url, method, data) => {

    headers["content-type"]='application/x-www-form-urlencoded'
	let userInfo = uni.getStorageSync('userInfo') || '';
	if(userInfo.token){
		headers['Authorization'] = userInfo.token
	}

    return uni.request({
        url: urlConfig + url,
        method,
        data: data,
        header: headers
    }).then(res => {
		console.log('【Y】'+method+'|'+urlConfig + url+'|'+JSON.stringify(headers)+'|'+JSON.stringify(data)+'|'+JSON.stringify(res))
		return res[1].data; 
    }).catch(parmas => {
		console.log('【N】'+method+'|'+urlConfig + url+'|'+JSON.stringify(headers)+'|'+JSON.stringify(parmas))
　　　　　　switch (parmas.code) {
　　　　　　　　case 401:
　　　　　　　　　　uni.clearStorageSync()
　　　　　　　　　　break
　　　　　　　　default:
　　　　　　　　　　uni.showToast({
　　　　　　　　　　　　title: parmas.message,
　　　　　　　　　　　　icon: 'none'
　　　　　　　　　　})
　　　　　　　　　　return Promise.reject()
　　　　　　　　　　break
　　　　　　}
		return {
			code:-1,
			data:"error"
		}; 
　　})
 } 
 
 request.searchdata = (url, method, data) => {
 	console.log(url)
     headers["content-type"]='application/x-www-form-urlencoded'
 	let userInfo = uni.getStorageSync('userInfo') || '';
 	if(userInfo.token){
 		headers['Authorization'] = userInfo.token
 	}
 	let searchurl =  "http://120.77.202.156:15673"
     return uni.request({
         url:  searchurl + url,
         method,
         data: data,
         header: headers
     }).then(res => {
 		console.log('【Y】'+method+'|'+searchurl + url+'|'+JSON.stringify(headers)+'|'+JSON.stringify(data)+'|'+JSON.stringify(res))
 		return res[1].data; 
     }).catch(parmas => {
 		console.log('【N】'+method+'|'+searchurl + url+'|'+JSON.stringify(headers)+'|'+JSON.stringify(parmas))
 　　　　　　switch (parmas.code) {
 　　　　　　　　case 401:
 　　　　　　　　　　uni.clearStorageSync()
 　　　　　　　　　　break
 　　　　　　　　default:
 　　　　　　　　　　uni.showToast({
 　　　　　　　　　　　　title: parmas.message,
 　　　　　　　　　　　　icon: 'none'
 　　　　　　　　　　})
 　　　　　　　　　　return Promise.reject()
 　　　　　　　　　　break
 　　　　　　}
 		return {
 			code:-1,
 			data:"error"
 		}; 
 　　})
  }

export default request