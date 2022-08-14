<template>
	<view class="bg-white py-2 px-3 rounded-lg flex flex-col">
		<h2 class="mb-2" style="font-size: 22px">登录</h2>
		<uni-forms :model="form" ref="form" style="width: 234.37rpx">
			<uni-forms-item name="username" :required="false">
				<view class="flex flex-row border border-solid border-blue-500 rounded-sm" style="padding: 4.69rpx">
					<!-- <uni-easyinput v-model="form.username" placeholder="请输入账号" /> -->
					<input class="uni-input" focus v-model.trim="form.username" placeholder="请输入账号" style="width: 146.48rpx" />
				</view>
			</uni-forms-item>

			<uni-forms-item name="password" :required="false">
				<view class="flex flex-row border border-solid border-blue-500 rounded-sm" style="padding: 4.69rpx">
					<!-- <uni-easyinput v-model="form.password" placeholder="请输入密码" /> -->
					<input class="uni-input" password v-model="form.password" placeholder="请输入密码" />
				</view>
			</uni-forms-item>
		</uni-forms>
		<view class="flex flex-col">
			<view class="uni-btn-v"><button class="w-full" type="primary" @click="submit()" size="mini">登录</button></view>
			<view class="uni-btn-v mt-1 text-center"><text @click="submit('Register')">注册账户</text></view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			form: {
				username: '',
				password: ''
			},
			rules: {
				username: {
					rules: [
						{
							required: true,
							errorMessage: '请输入账号'
						}
					]
				},
				password: {
					rules: [
						{
							required: true,
							errorMessage: '请输入密码'
						}
					]
				}
			}
		};
	},
	mounted() {
		this.$nextTick(() => {
			// 需要在onReady中设置规则
			this.$refs.form.setRules(this.rules);
		});
	},
	methods: {
		submit(v) {
			if (!v) {
				this.$refs.form.validate().then(() => {
					this.$emit('submit', this.form, 0, true);
				});
			} else {
				this.$emit('submit', this.form, v);
			}
		}
	}
};
</script>

<style></style>
