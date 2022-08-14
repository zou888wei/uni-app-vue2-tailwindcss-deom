<template>
	<view class="bg-white py-2 px-3 rounded-lg flex flex-col">
		<h2 class="mb-2" style="font-size: 22px">注册</h2>
		<uni-forms :model="form" ref="form">
			<uni-forms-item name="username" :required="false">
				<view class="flex flex-row border border-solid border-blue-500 rounded-sm" style="padding: 4.69rpx">
					<input class="uni-input" focus v-model.trim="form.username" placeholder="请输入账号" style="width: 146.48rpx" />
				</view>
			</uni-forms-item>

			<uni-forms-item name="password" :required="false">
				<view class="flex flex-row border border-solid border-blue-500 rounded-sm" style="padding: 4.69rpx">
					<input class="uni-input" password v-model.trim="form.password" placeholder="请输入密码" />
				</view>
			</uni-forms-item>
			
			<uni-forms-item name="mobile" :required="false">
				<view class="flex flex-row items-center border border-solid border-blue-500 rounded-sm" style="padding: 4.69rpx">
					<span class="mr-1">+86</span>
					<input class="uni-input" v-model.trim="form.mobile" focus placeholder="请输入手机号" />
				</view>
			</uni-forms-item>

			<uni-forms-item name="smsCode" :required="false">
				<view class="flex flex-row items-center border border-solid border-blue-500 rounded-sm" style="padding: 4.69rpx">
					<input class="uni-input" v-model="form.smsCode" placeholder="请输入验证码" style="width:130px" />
					<button class="bg-success leading-normal" :class="{'text-white': !isCode}" @click="send" :disabled="isCode" style="width:150px; font-size: initial">
						{{ isCode ? countDown + 's后重新获取' : countDown }}
					</button>
				</view>
			</uni-forms-item>
		</uni-forms>
		<view class="flex flex-col">
			<view class="uni-btn-v"><button class="w-full" type="primary" @click="submit()" size="mini">注册</button></view>
			<view class="uni-btn-v mt-1 text-center"><text @click="submit('Login')">返回登录</text></view>
		</view>
	</view>
</template>

<script>
import { checkMobile } from '@/util/validator';

export default {
	data() {
		return {
			isCode: false,
			countDown: '获取验证码',
			form: {
				username: '',
				password: '',
				mobile: '',
				smsCode: ''
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
				},
				mobile: {
					rules: [
						{
							required: true,
							errorMessage: '请输入手机号'
						},
						{
							validateFunction: (rule, value, data, callback) => {
								if (!!value && !checkMobile(value)) {
									callback('请输入正确的手机号');
								}
								return true;
							}
						}
					]
				},
				smsCode: {
					rules: [
						{
							required: true,
							errorMessage: '请输入验证码'
						},
						{
							minLength: 6,
							maxLength: 6,
							errorMessage: '请输入正确的验证码'
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
					this.$emit('submit', this.form, 1, true);
				});
			} else {
				this.$emit('submit', this.form, v);
			}
		},
		async send() {
			this.$refs.form.validateField(['mobile']).then(res => {
				if (this.isCode) return;
				this.isCode = true;
				let countDown = 59;
				this.countDown = countDown;
				const auth_time = setInterval(() => {
					this.countDown = countDown--;
					if (this.countDown <= 0) {
						this.isCode = false;
						this.countDown = '获取验证码';
						clearInterval(auth_time);
					}
				}, 1000);
				this.$http({
					method: 'get',
					url: '/snedSms',
					data: {
						phone: this.form.mobile
					}
				})
			});
		}
	}
};
</script>

<style></style>
