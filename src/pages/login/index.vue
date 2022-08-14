<template>
	<view class="content login-box w-full h-full flex items-center justify-center">
		<view><component :is="pages" @submit="submit" /></view>
	</view>
</template>

<script>
import Login from './login';
import Register from './register';
import { setToken, removeToken, setUser, removeUser } from '@/util/auth';

export default {
	components: {
		Login,
		Register
	},
	data() {
		return {
			pages: 'Login'
		};
	},
	onLoad() {
		removeToken();
		removeUser();
	},
	watch: {
		// isLogin: {
		// 	handler() {
		// 	},
		// 	deep: true
		// }
	},
	methods: {
		submit(data, v, isHttp) {
			if (!isHttp) {
				this.pages = v;
			} else {
				const url = v ? '/reg' : '/login';
				// const headers = { username: 'xao', password: '123456' };
				const options = { url: url, params: data };
				// if(!v) options.headers = headers
				this.$http(options).then(res => {
					if (v) {
						this.pages = 'Login';
					} else {
						setToken(res.token);
						setUser(res);
						uni.redirectTo({
							url: '/pages/play/index'
						});
					}
				});
			}
		}
	}
};
</script>

<style></style>
