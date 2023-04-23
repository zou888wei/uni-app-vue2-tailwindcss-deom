import {
	getToken
} from '@/util/auth';
let baseURL;

if (process.env.NODE_ENV === 'development') {
	baseURL = '/webapi' //测试
} else {
	baseURL = 'http://47.100.78.166:8224' //正式
	// baseURL = 'http://47.100.78.166:8089' //正式
	// baseURL = 'http://58i64u9459.goho.co:23635' //正式
}

let headers = {
	'X-Requested-With': 'XMLHttpRequest',
	'Content-Type': 'application/json; charset=UTF-8'
}
const http = (obj, isLoading = true) => {
	return new Promise((resolve, reject) => {
		let options = Object.assign({}, obj)
		let header = {}
		if (options.headers) header = {
			...headers,
			...options.headers
		}
		if (options.method == 'POST') {
			header.Accept = "application/json"
		}

		if (getToken()) header.token = getToken()
		if (options.dataType !== 'form-data' && options.params) {
			const list = []
			for (const [key, value] of Object.entries(options.params)) {
				list.push(key + '=' + value)
			}
			options.url = options.url + '?' + list.join('&')
		}

		if (isLoading) {
			uni.showLoading({
				title: '加载中...',
				mask: options.load || false // 默认遮罩出现可继续操作
			});
		}
		try {
			uni.request({
				url: (options.baseURL || baseURL) + options.url,
				method: options.method || 'POST', // 默认为POST请求
				data: options.data || {}, //请求超时在manifest.json配置
				dataType: options.dataType || '',
				sslVerify: false,
				header: header,
				success: res => {
					if (res.data.code == 200) {
						resolve(res.data.data);
					} else if (res.data.code == 500) {
						uni.showToast({
							title: res.data.data || res.data.message || res.data
								.error || '请求错误',
							icon: 'none'
						})
						reject(res);
					} else {
						uni.showToast({
							title: res.data.message || res.data.error || '请求错误',
							icon: 'none'
						})
						reject(res);
					}

				},
				fail: (err) => {
					reject(err);

					uni.showToast({
						title: '请检查网络连接',
						icon: 'none'
					})
					/*错误码处理
					let code = err.data.code; 
					switch (code) {
					    case 500:
					        break;
					    default:
					        break;
					} */
				},
				complete: () => {
					uni.hideLoading();
				}
			});
		} catch (e) {
			uni.hideLoading();
			uni.showToast({
				title: '服务端异常',
				icon: 'none'
			})
		}

	})
}

export default http
