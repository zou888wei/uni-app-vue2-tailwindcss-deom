<script>
// (function() {
// 	if (typeof WeixinJSBridge == 'object' && typeof WeixinJSBridge.invoke == 'function') {
// 		//判断程序运行环境是否是微信浏览器(微信内置的浏览器)
// 		handleFontSize();
// 	} else {
// 		if (document.addEventListener) {
// 			document.addEventListener('WeixinJSBridgeReady', handleFontSize, false);
// 		} else if (document.attachEvent) {
// 			document.attachEvent('WeixinJSBridgeReady', handleFontSize);
// 			document.attachEvent('onWeixinJSBridgeReady', handleFontSize);
// 		}
// 	}

// 	function handleFontSize() {
// 		// 设置网页字体为默认大小
// 		WeixinJSBridge.invoke('setFontSizeCallback', {
// 			fontSize: 0
// 		});
// 		// 重写设置网页字体大小的事件
// 		WeixinJSBridge.on('menu:setfont', function() {
// 			WeixinJSBridge.invoke('setFontSizeCallback', {
// 				fontSize: 0
// 			});
// 		});
// 	}
// })();
import { getToken } from '@/util/auth';
export default {
	onLaunch: function() {
		// #ifdef APP-PLUS
		plus.screen.lockOrientation('landscape-primary'); //锁定横屏
		plus.navigator.setFullscreen(true); //隐藏状态栏(应用全屏:只能隐藏状态栏，标题栏和虚拟返回键都还可以显示)
		// #endif
		console.log('App Launch');
		//判断是否登录
		let token = getToken();
		if (!token) {
			//不存在则跳转至登录页
			uni.reLaunch({
				url: '/pages/login/index'
			});
		} else {
			this.$http({ url: '/loginByToken', params: { token: token } })
				.then(res => {
					if (res.roomInfo && res.roomInfo.roomId) {
						uni.navigateTo({
							url:
								'/pages/game/index?roomId=' +
								res.roomInfo.roomId +
								'&pwd=' +
								res.roomInfo.password +
								'&maxNum=' +
								res.roomInfo.maxNum +
								'&createUser=' +
								res.roomInfo.creator
						});
					} else {
						uni.reLaunch({
							url: '/pages/play/index'
						});
					}
				})
				.catch(() => {
					uni.reLaunch({
						url: '/pages/login/index'
					});
				});
		}
	},
	onShow: function() {
		console.log('App Show');
	},
	onHide: function() {
		console.log('App Hide');
	}
};
</script>

<style>
/*每个页面公共css */
/* tailwindcss */
@import 'tailwindcss/tailwind.css';
</style>
<style lang="scss">
@import '@/assets/styles/index.scss';
</style>
