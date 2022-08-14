<template>
	<view class="play-box--room w-full h-full flex flex-col">
		<view class="bg-blue-600 h-5 flex items-center px-2">
			<view class="flex-1 flex items-center">
				<view class="flex items-center w-3"><image class="w-full" mode="widthFix" src="@/static/images/avatar.png" alt=""></image></view>
				<!-- 				<view class="flex flex-col ml-1 text-white" style="font-size: 7.03rpx;">
					<span>姓名</span>
					<span>金币</span>
				</view> -->
			</view>
			<uni-icons type="gear-filled" size="30" style="color:white" @click="open()"></uni-icons>
		</view>
		<view class="flex-1 p-4 flex flex-row flex-wrap">
			<template v-if="options.length">
				<view v-for="item in options" :key="item.roomId" class="bg-white mx-1 rounded flex flex-col" style="width: 87.89rpx; height:58.59rpx" @click="handlerPwd(item)">
					<view class="bg-blue-600 text-white rounded-t" style="padding: 5px">
						<span class="float-left">{{ item.roomName }}</span>
						<span class="float-right">{{ item.currentNum }}</span>
					</view>
					<view class="flex-1 flex items-center justify-center"><span>加入房间</span></view>
				</view>
			</template>
			<template v-else>
				<view class="flex items-center justify-center w-full text-gray-300">暂无房间列表</view>
			</template>
		</view>
		<view class="fixed" style="bottom: -5px;right: -10px;">
			<view class="w-16"><image class="w-full" mode="widthFix" src="@/static/images/play.png" alt="" @click="open('popupCreate', true)"></image></view>
		</view>
		<uni-popup type="center" ref="popup" class="play-box--room-setting">
			<view class="w-full h-full flex flex-col">
				<view class="h-5 bg-blue-700 border-0 border-b border-solid border-blue-400 flex justify-end items-center px-2">
					<uni-icons type="closeempty" size="30" style="color:white" @click="close()"></uni-icons>
				</view>
				<view class="flex-1 bg-blue-600 overflow-y-auto px-4">
					<view class="flex flex-row bg-blue-500 text-white items-center my-1 py-1 px-2">
						<view class="flex-1">手机号 帐号</view>
						<button type="warn" class="leading-normal" style="width: 120px;" @click="handlerClear()">帐号退出</button>
					</view>
				</view>
			</view>
		</uni-popup>
		<uni-popup type="center" ref="popupCreate" class="play-box--room-create">
			<view class="bg-gray-200 w-1/2 py-2 px-4 rounded">
				<h2 class="mb-2" style="font-size: 22px">创建房间</h2>
				<uni-row :gutter="20">
					<uni-forms :model="form" ref="form" class="max-w-full" :label-width="80" label-align="right">
						<uni-col :span="12" v-for="(item, index) in data">
							<uni-forms-item :name="item.name" :label="item.label" :required="false">
								<view class="flex flex-row border border-solid border-blue-500 rounded-sm" style="padding: 4.69rpx">
									<input v-if="item.type" type="number" class="uni-input" focus v-model.trim="form[item.name]" :placeholder="'请输入' + item.label" />
									<input v-else class="uni-input" focus v-model.trim="form[item.name]" :placeholder="'请输入' + item.label" />
									<text v-if="item.unit">{{ item.unit }}</text>
								</view>
							</uni-forms-item>
						</uni-col>
					</uni-forms>
				</uni-row>
				<view class="flex flex-row justify-center">
					<view class="uni-btn-v"><button type="info" @click="close('popupCreate')" size="mini">取消</button></view>
					<view class="uni-btn-v ml-2"><button type="primary" @click="submit()" size="mini">确认</button></view>
				</view>
			</view>
		</uni-popup>
		<uni-popup type="center" ref="popupPwd" class="play-box--room-create">
			<view class="bg-gray-200 py-2 px-4 rounded">
				<h2 class="mb-2" style="font-size: 22px">请输入房间密码</h2>
				<uni-forms :model="formPwd" ref="formPwd" class="max-w-full">
					<view class="flex flex-row border border-solid border-blue-500 rounded-sm" style="padding: 4.69rpx">
						<input class="uni-input" focus v-model.trim="formPwd.pwd" placeholder="请输入房间密码" />
					</view>
				</uni-forms>
				<view class="flex flex-row justify-center mt-1">
					<view class="uni-btn-v"><button type="info" @click="close('popupPwd')" size="mini">取消</button></view>
					<view class="uni-btn-v ml-2"><button type="primary" @click="handlerGoStart(formPwd)" size="mini">确认</button></view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
import { removeToken, removeUser, getUser } from '@/util/auth';
export default {
	data() {
		return {
			time: '',
			options: [],
			data: [
				{ name: 'roomName', label: '房间名称' },
				{ name: 'pwd', label: '房间密码' },
				{ name: 'num', label: '房间人数', type: 'number', max: 9, tip: '人数' },
				{ name: 'blindsAmount', label: '盲注', type: 'number' },
				{ name: 'score', label: '每人筹码', type: 'number' },
				{ name: 'maxScore', label: '最大筹码', type: 'number' },
				{ name: 'timeout', label: '操作时间', type: 'number', unit: '秒' },
				{ name: 'gameTime', label: '游戏时长', type: 'number', unit: '分' }
			],
			form: {
				blindsAmount: 0,
				gameTime: 7,
				num: 6,
				pwd: '',
				roomName: '',
				score: 1000,
				timeout: 10,
				maxScore: ''
			},
			formPwd: {
				roomId: '',
				pwd: '',
				maxNum: '',
				createUser: ''
			},
			rules: {}
		};
	},
	onReady() {
		if (this.time) {
			clearInterval(this.time);
		}
		this.init();
		this.time = setInterval(() => {
			this.init();
		}, 5000);
	},
	mounted() {
		let rules = {};
		this.data.forEach(item => {
			if (!rules[item.name]) {
				rules[item.name] = {};
				rules[item.name].rules = [];
				let res = {
					required: true,
					format: item.type ? item.type : 'string',
					errorMessage: '请输入' + item.label
				};
				rules[item.name].rules.push(res);
				if (item.max)
					rules[item.name].rules.push({
						maximum: item.max,
						errorMessage: '最大' + item.tip + '限制为' + item.max
					});
			}
		});
		this.rules = rules;
	},
	methods: {
		init() {
			this.$http(
				{
					url: '/game/room/list'
				},
				false
			)
				.then(res => {
					this.options = Object.assign([], res);
				})
				.catch(err => {
					if (err.statusCode == 401) {
						this.handlerClear();
					}
				});
		},
		open(v, rules) {
			if (v) {
				this.$refs[v].open();
				if (rules) {
					this.$nextTick(() => {
						// 需要在onReady中设置规则
						this.$refs.form.setRules(this.rules);
					});
				}
			} else {
				this.$refs.popup.open();
			}
		},
		close(v) {
			if (v) {
				this.$refs[v].close();
			} else {
				this.$refs.popup.close();
			}
		},
		handlerClear() {
			removeToken();
			removeUser();
			uni.redirectTo({
				url: '/pages/login/index'
			});
		},
		handlerPwd(v) {
			this.formPwd.roomId = v.roomId;
			this.formPwd.maxNum = v.maxNum;
			this.open('popupPwd');
		},
		handlerGoStart(v) {
			if (v) {
				this.$http({
					url: '/game/room/join',
					params: {
						pwd: v.pwd,
						roomId: v.roomId
					}
				}).then(() => {
					this.goGame();
				});
			} else {
				this.goGame();
			}
		},
		goGame() {
			if (this.time) {
				clearInterval(this.time);
			}
			uni.navigateTo({
				url: '/pages/game/index?roomId=' + this.formPwd.roomId + '&pwd=' + this.formPwd.pwd + '&maxNum=' + this.formPwd.maxNum + '&createUser=' + this.formPwd.createUser
			});
		},
		submit() {
			this.$refs.form.validate().then(() => {
				this.$http({
					url: '/game/room/create',
					params: this.form
				}).then(res => {
					if (res) {
						this.formPwd.roomId = res;
						this.formPwd.pwd = this.form.pwd;
						this.formPwd.maxNum = this.form.num;
						this.formPwd.createUser = getUser().userName;
					}
					this.handlerGoStart();
				});
			});
		}
	},
	destroyed() {
		if (this.time) {
			clearInterval(this.time);
		}
	}
};
</script>

<style></style>
