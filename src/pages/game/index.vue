<template>
	<view class="game-box--start w-full h-full relative">
		<view class="game-box--start-goBack absolute z-10"><button class="game-box--start-goBack-btn" plain size="mini" @click="$refs.popup.open('right')">菜单</button></view>
		<view class="game-box--start-fpg"><image class="w-full" mode="widthFix" src="@/static/images/fpg.png" alt=""></image></view>
		<view class="absolute w-full h-full" style="z-index: 9;" v-if="!gameStatus || (!totalNum && currentNum != totalNum)">
			<view class="w-full h-full flex items-center justify-center">
				<view class="bg-white px-4 py-2 rounded">
					<view class="">等待玩家加入...</view>
					<view>玩家人数：{{ currentNum }} / {{ totalNum }}</view>
					<button v-if="createUser == username" class="mt-1" type="primary" size="mini" @click="handleStartGame()">提前开始游戏</button>
				</view>
			</view>
		</view>
		<view class="absolute w-full h-full z-0">
			<view class="absolute" v-for="(item, index) in personPosition" :style="{ ...item.style }">
				<view
					class="w-8 border border-gray-200 border-solid rounded-full bg-gray-900"
					:class="personAction && personAction == item.username ? 'game-box--person-active border-red-600' : ''"
				>
					<image class="w-full" mode="widthFix" :src="item.personIamge" alt=""></image>
				</view>
				<view class="absolute bottom-0 w-full bg-gray-800 border border-gray-700 border-solid rounded-sm text-center" style="font-size: 7.03rpx;">
					<text class="text-white">￥ {{ item.money }}</text>
				</view>
				<view
					class="absolute right-0 bottom-0 bg-yellow-500 border border-gray-700 border-solid rounded-sm text-center px-1"
					style="font-size: 7.03rpx; transform: translate(0%, -100%);"
					v-if="item.opreate"
				>
					<text class="text-white">{{ item.opreate }}</text>
				</view>
				<view class="absolute flex flex-row" v-if="index != 0 && item.username && !item.poker.cards.cardA.ranking" :style="{ ...item.poker.style }">
					<Poker width="w-2" :decor="item.poker.cards.cardA.suit" :num="item.poker.cards.cardA.ranking" />
					<Poker width="w-2" :decor="item.poker.cards.cardB.suit" :num="item.poker.cards.cardA.ranking" />
				</view>
				<view
					class="absolute flex flex-row"
					v-if="index != 0 && item.username && item.poker.cards.cardA.ranking"
					:style="{ ...item.poker.styleLight, transform: 'scale(0.9)' }"
				>
					<Poker width="w-4" :decor="item.poker.cards.cardA.suit" :num="item.poker.cards.cardA.ranking" />
					<Poker width="w-4" :decor="item.poker.cards.cardB.suit" :num="item.poker.cards.cardA.ranking" />
				</view>
			</view>

			<view v-if="gameStatus" class="absolute flex flex-row" style="left: 35%; bottom: 46.87rpx; transform: translate(-50%, 0%);">
				<Poker :decor="personPosition[0].poker.cards.cardA.suit" :num="personPosition[0].poker.cards.cardA.ranking" />
				<Poker :decor="personPosition[0].poker.cards.cardB.suit" :num="personPosition[0].poker.cards.cardA.ranking" />
			</view>

			<view class="absolute flex flex-row" v-if="pokerFpg.length" style="left: 50%; top:50%; transform: translate(-50%, -75%);">
				<view v-for="i in 5">
					<view v-if="!pokerFpg[i - 1]" class="w-5"></view>
					<Poker v-else width="w-5" :decor="pokerFpg[i - 1].suit" :num="pokerFpg[i - 1].ranking" style="margin-right: 1rpx;" />
				</view>
			</view>
		</view>
		<view class="w-full absolute z-10 flex justify-center game-box--start-footer" style="bottom: 11.72rpx">
			<view class="flex flex-row w-2/3" v-if="btnList.length">
				<button
					v-for="(item, index) in btnList"
					class="game-box--start-footer-btn w-12 px-0 mx-1"
					:class="item.active ? 'btn-L' : 'btn-noL'"
					size="mini"
					@click="handleBtns(item)"
				>
					{{ item.label }}
				</button>
			</view>
		</view>

		<!-- 普通弹窗 -->
		<uni-popup ref="popup" background-color="#28465C">
			<uni-list class="bg-transparent">
				<template v-for="item in menuList">
					<uni-list-item
						class="bg-transparent"
						:show-extra-icon="true"
						:title="item.name"
						:extra-icon="{ color: 'white', size: '20', type: item.icon }"
						clickable
						@click="() => item.fn()"
					>
						<template v-slot:body>
							<text class="slot-box slot-text text-white">{{ item.name }}</text>
						</template>
					</uni-list-item>
				</template>
			</uni-list>
		</uni-popup>
	</view>
</template>

<script>
import { getToken, getUser } from '@/util/auth';
import Poker from '@/components/poker';
export default {
	components: {
		Poker
	},
	data() {
		return {
			totalNum: 0,
			createUser: '',
			currentNum: 1,
			gameStatus: false,
			username: getUser().userName,
			boy: require('@/static/images/boy.png'),
			zw: require('@/static/images/zw.png'),
			girl: require('@/static/images/girl.png'),
			pokerFpg: [],
			personAction: '',
			personPosition: [
				{
					style: {
						left: '117.19rpx',
						bottom: '46.87rpx'
					},
					personIamge: require('@/static/images/boy.png'),
					money: 0,
					username: '',
					poker: {
						style: {},
						styleLight: {
							top: 0
						},
						cards: {
							cardA: {
								ranking: '',
								suit: ''
							},
							cardB: {
								ranking: '',
								suit: ''
							}
						}
					},
					opreate: ''
				},
				{
					style: {
						left: '117.19rpx',
						top: '17.58rpx'
					},
					personIamge: require('@/static/images/zw.png'),
					money: 0,
					username: '',
					poker: {
						style: {
							left: '50%',
							transform: 'translate(-50%, 15%)'
						},
						styleLight: {
							top: 0
						},
						cards: {
							cardA: {
								ranking: '',
								suit: ''
							},
							cardB: {
								ranking: '',
								suit: ''
							}
						}
					},
					opreate: ''
				},
				{
					style: {
						right: '117.19rpx',
						top: '17.58rpx'
					},
					personIamge: require('@/static/images/zw.png'),
					money: 0,
					username: '',
					poker: {
						style: {
							left: '50%',
							transform: 'translate(-50%, 15%)'
						},
						styleLight: {
							top: 0
						},
						cards: {
							cardA: {
								ranking: '',
								suit: ''
							},
							cardB: {
								ranking: '',
								suit: ''
							}
						}
					},
					opreate: ''
				},
				{
					style: {
						left: '30rpx',
						top: '40%',
						transform: 'translate(0%, -60%)'
					},
					personIamge: require('@/static/images/zw.png'),
					money: 0,
					username: '',
					poker: {
						style: {
							right: '-30%',
							top: '50%',
							transform: 'translate(50%, -50%)'
						},
						styleLight: {
							top: 0
						},
						cards: {
							cardA: {
								ranking: '',
								suit: ''
							},
							cardB: {
								ranking: '',
								suit: ''
							}
						}
					},
					opreate: ''
				},
				{
					style: {
						left: '30rpx',
						top: '62%',
						transform: 'translate(0%, -60%)'
					},
					personIamge: require('@/static/images/zw.png'),
					money: 0,
					username: '',
					poker: {
						style: {
							right: '-30%',
							top: '50%',
							transform: 'translate(50%, -50%)'
						},
						styleLight: {
							top: 0
						},
						cards: {
							cardA: {
								ranking: '',
								suit: ''
							},
							cardB: {
								ranking: '',
								suit: ''
							}
						}
					},
					opreate: ''
				},
				{
					style: {
						right: '30rpx',
						top: '40%',
						transform: 'translate(0%, -60%)'
					},
					personIamge: require('@/static/images/zw.png'),
					money: 0,
					username: '',
					poker: {
						style: {
							left: '-38rpx',
							top: '50%',
							transform: 'translate(0%, -60%)'
						},
						styleLight: {
							top: 0
						},
						cards: {
							cardA: {
								ranking: '',
								suit: ''
							},
							cardB: {
								ranking: '',
								suit: ''
							}
						}
					},
					opreate: ''
				},
				{
					style: {
						right: '30rpx',
						top: '62%',
						transform: 'translate(0%, -60%)'
					},
					personIamge: require('@/static/images/zw.png'),
					money: 0,
					username: '',
					poker: {
						style: {
							left: '-38rpx',
							top: '50%',
							transform: 'translate(0%, -60%)'
						},
						styleLight: {
							top: 0
						},
						cards: {
							cardA: {
								ranking: '',
								suit: ''
							},
							cardB: {
								ranking: '',
								suit: ''
							}
						}
					},
					opreate: ''
				},
				{
					style: {
						right: '130rpx',
						bottom: '46.87rpx'
					},
					personIamge: require('@/static/images/zw.png'),
					money: 0,
					username: '',
					poker: {
						style: {
							left: '50%',
							top: '-40%',
							transform: 'translate(-50%, 0%)'
						},
						styleLight: {
							top: 0
						},
						cards: {
							cardA: {
								ranking: '',
								suit: ''
							},
							cardB: {
								ranking: '',
								suit: ''
							}
						}
					},
					opreate: ''
				},
				{
					style: {
						right: '240rpx',
						bottom: '46.87rpx'
					},
					personIamge: require('@/static/images/zw.png'),
					money: 0,
					username: '',
					poker: {
						style: {
							left: '50%',
							top: '-40%',
							transform: 'translate(-50%, 0%)'
						},
						styleLight: {
							top: 0
						},
						cards: {
							cardA: {
								ranking: '',
								suit: ''
							},
							cardB: {
								ranking: '',
								suit: ''
							}
						}
					},
					opreate: ''
				}
			],
			// status: 1,
			btnDict: {
				FOLD: {
					label: '弃牌',
					active: false
				},
				ALLIN: {
					label: '全押',
					active: false
				},
				CALL: {
					label: '跟注',
					active: false
				},
				RAISE: {
					label: '加注',
					active: false
				},
				CHECK: {
					label: '过牌',
					active: false
				}
			},
			btnList: [],
			socketOpen: false,
			socketData: {
				action: 'join',
				token: getToken(),
				data: {
					roomId: '',
					pwd: ''
				}
			},
			menuList: [
				{
					name: '返回大厅',
					icon: 'upload-filled',
					iconClass: '',
					fn: () => {
						this.handleClose();
						return uni.navigateTo({
							url: '/pages/play/index'
						});
					}
				},
				{
					name: '站起',
					icon: 'tune-filled',
					iconClass: '',
					fn: () => {
						console.log('站起');
					}
				}
			]
		};
	},
	onLoad(option) {
		if (option) {
			this.socketData.data.roomId = option.roomId;
			this.socketData.data.pwd = option.pwd;
			this.totalNum = option.maxNum;
			this.createUser = option.createUser;
		}
	},
	mounted() {
		if (!this.socketData.data.roomId) {
			uni.navigateTo({
				url: '/pages/play/index'
			});
			this.handleClose();
			return false;
		}
		this.init();
	},
	methods: {
		init() {
			const that = this;
			if (!getToken()) {
				uni.redirectTo({
					url: '/pages/login/index'
				});
				return false;
			}

			uni.connectSocket({
				// url: 'ws:' + location.host + '/socket',
				url: 'ws://47.100.78.166:8088/ws/' + getToken(),
				success: res => {
					console.log('ws连接成功了');
					if (!that.socketOpen) {
						that.sendSocketMessage(that.socketData);
					}
				}
			});

			uni.onSocketOpen(function(res) {
				that.socketOpen = true;
				that.sendSocketMessage(that.socketData);
			});

			uni.onSocketError(function(res) {
				console.log('WebSocket连接打开失败，请检查！');
			});

			uni.onSocketMessage(function(res) {
				// console.log('收到服务器内容：' + res.data);
				that.startGame(JSON.parse(res.data));
			});
		},
		sendSocketMessage(msg) {
			uni.sendSocketMessage({
				data: JSON.stringify(msg),
				success: res => {
					console.log(res, 111);
				},
				fail: err => {
					console.log(err, 222);
				}
			});
		},
		startGame(res) {
			this.btnList = [];
			if (res.action == 'join' || res.action == 'reconn') {
				// 加入房间
				this.currentNum = res.data.length;
				const data = res.data.filter(item => {
					if (item.user == this.username) {
						this.personPosition[0].username = item.user;
						this.personPosition[0].money = item.bankRoll.value;
					}
					return item.user != this.username;
				});
				data.forEach((item, index) => {
					this.personPosition[index + 1].username = item.user;
					this.personPosition[index + 1].money = item.bankRoll.value;
					this.personPosition[index + 1].personIamge = this.boy;
				});
			} else if (res.action == 'startGame' || res.action == 'reconninfo') {
				this.gameStatus = true;
				// 游戏开始 or 游戏重连
				this.personAction = res.data.activeUser;
				this.personPosition[0].money = res.data.bankRoll.value;
				if (res.data.actions) {
					res.data.actions.forEach(item => {
						this.btnList.push({
							name: item.action,
							label: this.btnDict[item.action].label,
							active: this.btnDict[item.action].active,
							minBet: item.minBet
						});
					});
				}
				if (res.data.cards) {
					for (const key in res.data.cards) {
						this.personPosition.map(item => {
							if (key == item.username) {
								item.poker.cards = res.data.cards[key];
							}
						});
					}
				}
			} else if (res.action == 'bet') {
				// 下注
				this.personAction = res.data.activeUser;
				this.personPosition.map(item => {
					if (item.username == res.data.userName) {
						item.money = res.data.bankRoll.value;
						item.opreate = this.btnDict[res.data.opreate].label;
					}
				});
			} else if (res.action == 'board') {
				// 牌桌的牌
				this.pokerFpg = res.data;
			} else if (res.action == 'gameOver') {
				// 游戏结束
			}
		},
		handleStartGame() {
			// this.sendSocketMessage(this.socketData);
		},
		// 按钮点击事件
		handleBtns(data) {
			this.sendSocketMessage({ data: { amount: data.minBet }, action: data.name, token: getToken() });
		},
		handleClick() {
			this.sendSocketMessage(this.socketData);
		},
		handleClose() {
			uni.onSocketClose(function(res) {
				console.log(res, 11);
			});
		}
	}
};
</script>

<style></style>
