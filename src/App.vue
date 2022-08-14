<script>
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
				url: '/pages/login/login'
			});
		} else {
			uni.reLaunch({
				url: '/pages/play/index'
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
