import urlConfig from './config.js'

const request = {}
const headers = {}
const PORT1 = '/baseinfo'
    
request.senddata = (url, method, data) => {
/*     权限判断 因为有的接口请求头可能需要添加的参数不一样，所以这里做了区分
    1 == 不通过access_token校验的接口
    2 == 文件下载接口列表
    3 == 验证码登录 */
        
    // switch (power){
    //     case 1:
    //         
    //         break;
    //     case 2:
    //         headers['Authorization'] = 'Basic a3N1ZGlfcGM6a3N1ZGlfcGM='
    //         break;
    //     case 3:
    //         responseType = 'blob'
    //         break;
    //     default:
    //         headers['Authorization'] = `Bearer ${
    //             this.$store.getters.userInfo
    //         }`
    //         headers['TENANT-ID'] = this.$store.getters.userInfo.tenant_id
    //         break;
    // }
    headers["content-type"]='application/x-www-form-urlencoded'
	
	// headers['Authorization'] = 'Basic a3N1ZGlfcGM6a3N1ZGlfcGM='
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

export default request