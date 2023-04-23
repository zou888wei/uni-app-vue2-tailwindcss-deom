<template>
	<view class="game-box--start w-full h-full relative">
		<!-- 菜单 -->
		<view class="game-box--start-goBack absolute z-10"><button class="game-box--start-goBack-btn" plain size="mini" @click="$refs.popup.open('right')">菜单</button></view>
		<!-- 发牌官人物 -->
		<view class="game-box--start-fpg"><image class="w-full" mode="widthFix" src="@/static/images/fpg.png" alt=""></image></view>
		<!-- 准备游戏 -->
		<view class="absolute w-full h-full" style="z-index: 9;" v-if="!gameStatus || (!totalNum && currentNum != totalNum)">
			<view class="w-full h-full flex items-center justify-center">
				<view class="bg-white px-4 py-2 rounded">
					<view class="">等待玩家加入...</view>
					<view>玩家人数：{{ currentNum }} / {{ totalNum }}</view>
					<button v-if="createUser == username && currentNum > 2" class="mt-1" type="primary" size="mini" @click="handleStartGame()">提前开始游戏</button>
				</view>
			</view>
		</view>

		<!-- 游戏静态资源 -->
		<view class="absolute w-full h-full z-0">
			<!-- 人物相关 -->
			<view class="absolute" v-for="(item, index) in personPosition" :style="{ ...item.style }">
				<!-- 人物头像 -->
				<view
					class="w-8 border border-solid rounded-full bg-gray-900 relative"
					:class="personAction && personAction == item.username ? 'game-box--person-active border-red-600' : 'border-gray-200'"
				>
					<view v-if="personAction && personAction == item.username" class="game-box--person-active_radar"></view>
					<image class="w-full" mode="widthFix" :src="item.personIamge" alt=""></image>
				</view>
				<!-- 人物姓名 -->
				<view class="absolute top-0 w-full flex justify-center truncate" style="transform: translate(0%, -80%);">
					<view class="bg-gray-500 rounded-sm text-center px-1">
						<view class="text-white" style="font-size: 10rpx;">{{ item.username }}</view>
					</view>
				</view>

				<view class="absolute bottom-0 right-0 w-full">
					<!-- 人物操作信息 -->
					<view v-if="item.opreate" class="bg-yellow-500 border border-gray-700 border-solid rounded-sm text-center px-1 float-right clear-both">
						<view class="text-white" style="font-size: 9rpx;">{{ item.opreate }}</view>
					</view>
					<!-- 人物筹码 -->
					<view class="w-full bg-gray-800 border border-gray-700 border-solid rounded-sm text-center clear-both">
						<view class="text-white" style="font-size: 10rpx;">￥ {{ item.money }}</view>
					</view>
				</view>

				<!-- 盖牌 -->
				<view class="absolute flex flex-row" v-if="index != 0 && item.username && item.poker.cards.cardA.ranking" :style="{ ...item.poker.style }">
					<Poker width="w-2" />
					<Poker width="w-2" />
					<view v-if="item.poker.ranking.label" class="text-white absolute" :style="{ ...item.poker.ranking.style }">{{ item.poker.ranking.label }}</view>
				</view>
				<!-- 人物显示盖牌 -->
				<view
					class="absolute flex flex-row"
					v-if="index != 0 && item.username && item.poker.cards.cardA.ranking"
					:style="{ ...item.poker.styleLight, transform: 'scale(0.9)' }"
				>
					<Poker width="w-4" :decor="item.poker.cards.cardA.suit" :num="item.poker.cards.cardA.ranking" />
					<Poker width="w-4" :decor="item.poker.cards.cardB.suit" :num="item.poker.cards.cardB.ranking" />
				</view>
				<!-- 站起提示 -->
				<view class="absolute bottom-0 w-full h-full bg-gray-900 border border-gray-700 border-solid rounded-full flex items-center justify-center" v-if="item.lookOn">
					<text class="text-white" style="font-size: 7.03rpx;">站起</text>
				</view>

				<!-- 大小盲 -->
				<view class="absolute font-bold" style="left:0rpx; bottom: 0; transform: translate(-85%, 0%)" v-if="item.blind">
					<view :class="item.blind == '大盲' ? 'text-red-600' : 'text-yellow-300'" :style="{ 'font-size': item.blind == '大盲' ? '20rpx' : '16rpx' }">
						{{ item.blind }}
					</view>
				</view>
			</view>

			<!-- 当前用户的牌 -->
			<view v-if="gameStatus" class="absolute flex flex-row" style="left: 35%; bottom: 46.87rpx; transform: translate(-50%, 0%);">
				<Poker :decor="personPosition[0].poker.cards.cardA.suit" :num="personPosition[0].poker.cards.cardA.ranking" />
				<Poker :decor="personPosition[0].poker.cards.cardB.suit" :num="personPosition[0].poker.cards.cardB.ranking" />
				<view v-if="personPosition[0].poker.ranking.label" class="text-white absolute" :style="{ ...personPosition[0].poker.ranking.style }">
					{{ personPosition[0].poker.ranking.label }}
				</view>
			</view>

			<!-- 游戏时间 -->
			<view class="absolute text-white" style="left: 10rpx; top:5.86rpx; font-size: 20rpx">{{ this.lastTimeText }}</view>
			<!-- 筹码池 -->
			<view class="absolute text-white" style="left: 50%; top:22%; transform: translate(-50%, 0%);">当前筹码：{{ this.sumBet }}</view>
			<!-- 操作时间 -->
			<view class="absolute text-white" style="left: 50%; top:28%; transform: translate(-50%, 0%);">
				{{ this.opreateUser ? '延时' : '操作' }}时间：{{ this.opreateTime }}s
				<template v-if="this.opreateUser">
					，延时人：{{ this.opreateUser }}
				</template>
			</view>
			<!-- 公共牌 -->
			<view class="absolute flex flex-row" v-if="pokerFpg.length" style="left: 50%; top:50%; transform: translate(-50%, -75%);">
				<view v-for="i in 5">
					<view v-if="!pokerFpg[i - 1]" class="w-5"></view>
					<Poker v-else width="w-5" :decor="pokerFpg[i - 1].suit" :num="pokerFpg[i - 1].ranking" style="margin-right: 1rpx;" />
				</view>
			</view>
		</view>

		<!-- 操作记录 -->
		<view class="absolute left-0 bottom-0" style="width: 13%; z-index: 9; opacity: 0.85;" v-if="gameStatus">
			<uni-easyinput type="textarea" v-model="msgText" disabled :styles="{ disableColor: '#111522', color: '#ffffff' }"></uni-easyinput>
		</view>

		<!-- 按钮 -->
		<view class="w-full absolute flex justify-center game-box--start-footer" style="bottom: 11.72rpx; z-index: 8; padding-left:13%">
			<view class="flex flex-row w-2/3" v-if="btnList.length">
				<template v-for="(item, index) in btnList">
					<button
						v-if="item.name == 'INSURANCE'"
						class="game-box--start-footer-btn w-12 px-0 mx-1"
						:class="item.active ? 'btn-L' : 'btn-noL'"
						size="mini"
						:disabled="btnSwitch"
						@click="open('popupInsurance')"
					>
						{{ item.label }}
					</button>
					<button
						v-if="item.name != 'RAISE' && item.name != 'INSURANCE'"
						class="game-box--start-footer-btn w-12 px-0 mx-1"
						:class="item.active ? 'btn-L' : 'btn-noL'"
						size="mini"
						:disabled="btnSwitch"
						@click="handleBtns(item)"
					>
						{{ item.label }}
					</button>
					<button
						v-if="item.name == 'RAISE'"
						class="game-box--start-footer-btn w-12 px-0 mx-1"
						:class="item.active ? 'btn-L' : 'btn-noL'"
						size="mini"
						:disabled="btnSwitch"
						@click="open('popupRaise')"
					>
						{{ item.label }}
					</button>
				</template>
			</view>
		</view>

		<!-- 普通弹窗 -->
		<uni-popup ref="popup" background-color="#28465C">
			<uni-list class="bg-transparent">
				<template v-for="item in menuList">
					<uni-list-item v-if="item.visible" class="bg-transparent" :title="item.name" clickable @click="() => item.fn()">
						<template v-slot:body>
							<text class="slot-box slot-text text-white">{{ item.name }}</text>
						</template>
					</uni-list-item>
				</template>
			</uni-list>
		</uni-popup>
		<!-- 增加筹码 -->
		<uni-popup type="center" ref="popupScore" class="play-box--room-create">
			<view class="bg-gray-200 py-2 px-4 rounded">
				<h2 class="mb-2" style="font-size: 18px">增加筹码</h2>
				<view class="flex flex-row border border-solid border-blue-500 rounded-sm" style="padding: 4.69rpx">
					<input type="number" class="uni-input" focus v-model="addScore" placeholder="请输入筹码" />
				</view>
				<view class="flex flex-row justify-center mt-1">
					<view class="uni-btn-v"><button type="info" @click="close('popupScore')" size="mini">取消</button></view>
					<view class="uni-btn-v ml-2"><button type="primary" @click="handlerScore()" size="mini">确认</button></view>
				</view>
			</view>
		</uni-popup>
		<!-- 加注 -->
		<uni-popup type="center" ref="popupRaise" class="play-box--room-create">
			<view class="bg-gray-200 py-2 px-4 rounded">
				<h2 class="mb-2" style="font-size: 18px">加注</h2>
				<view class="flex flex-row border border-solid border-blue-500 rounded-sm" style="padding: 4.69rpx">
					<input type="number" class="uni-input" focus v-model="addRaise" placeholder="请输入筹码" />
				</view>
				<view class="flex flex-row justify-center mt-1">
					<view class="uni-btn-v"><button type="info" @click="close('popupRaise')" size="mini">取消</button></view>
					<view class="uni-btn-v ml-2"><button type="primary" @click="handlerRaise()" size="mini">确认</button></view>
				</view>
			</view>
		</uni-popup>
		<!-- 保险 -->
		<uni-popup type="center" ref="popupInsurance" class="play-box--room-create">
			<view class="bg-gray-200 py-2 px-4 rounded">
				<h2 class="mb-2" style="font-size: 18px">保险</h2>
				<view class="flex flex-row">
					<template v-if="surpass.length">
						<Poker class="mr-1" v-for="value in surpass" width="w-4" :decor="value.suit" :num="value.ranking" />
					</template>
					<text v-else>暂无</text>
				</view>
				<br />
				<view class="flex flex-row border border-solid border-blue-500 rounded-sm" style="padding: 4.69rpx">
					<input type="number" class="uni-input" focus v-model="addInsurance" placeholder="请输入筹码" />
				</view>
				<view class="flex flex-row justify-center mt-1">
					<view class="uni-btn-v"><button type="info" @click="close('popupInsurance')" size="mini">取消</button></view>
					<view class="uni-btn-v ml-2"><button type="primary" @click="handlerInsurance()" size="mini">确认</button></view>
				</view>
			</view>
		</uni-popup>
		<!-- 记分板 -->
		<uni-popup type="center" ref="popupPanel">
			<view class="bg-gray-200 py-2 px-4 rounded flex flex-col overflow-y-auto" style="max-height: 100vh; max-width:100vh">
				<h2 class="mb-2" style="font-size: 18px">记分板</h2>
				<uni-collapse v-if="panelData.list && panelData.list.length">
					<uni-collapse-item v-for="(v, i) in [panelData.total, ...panelData.list]" :title="i ? '第' + i + '局' : '总计'">
						<uni-table :key="'collapse' + i" border stripe emptyText="暂无数据">
							<!-- 表头行 -->
							<uni-tr>
								<uni-th align="center">姓名</uni-th>
								<!-- <uni-th align="center" v-if="i">牌型</uni-th> -->
								<uni-th align="center" v-if="i">底牌</uni-th>
								<uni-th align="center" v-if="i">公共牌</uni-th>
								<uni-th align="center">筹码</uni-th>
								<uni-th align="center">加分</uni-th>
								<uni-th align="center">分数</uni-th>
								<uni-th align="center">保险</uni-th>
								<uni-th align="center" v-if="i">输赢</uni-th>
							</uni-tr>
							<!-- 表格数据行 -->
							<uni-tr v-for="(item, index) in v" :key="'panel' + index" :class="{ 'bg-red-500 game-box--start-tr': item.userName == username && i }">
								<uni-td class="game-box--start-tr-td">
									<view class="flex flex-col">
										<view>{{ item.userName }}</view>
										<view v-if="i && item.ranking">({{ pokerDict[item.ranking] }})</view>
									</view>
								</uni-td>
								<!-- <uni-td v-if="i" class="game-box--start-tr-td">{{ pokerDict[item.ranking].label }}</uni-td> -->
								<uni-td v-if="i">
									<view class="flex flex-row">
										<template v-if="item.compose && item.compose.length">
											<Poker class="mr-1" v-for="value in item.compose" width="w-4" :decor="value.suit" :num="value.ranking" />
										</template>
										<text v-else>空</text>
									</view>
								</uni-td>
								<uni-td v-if="i">
									<view class="flex flex-row">
										<template v-if="item.broad && item.broad.length">
											<Poker class="mr-1" v-for="value in item.broad" width="w-4" :decor="value.suit" :num="value.ranking" />
										</template>
										<text v-else>空</text>
									</view>
								</uni-td>
								<uni-td class="game-box--start-tr-td">{{ item.bankRoll.value }}</uni-td>
								<uni-td class="game-box--start-tr-td">{{ item.addScore }}</uni-td>
								<uni-td class="game-box--start-tr-td">{{ item.value }}</uni-td>
								<uni-td class="game-box--start-tr-td">{{ item.insurance }}</uni-td>
								<uni-td v-if="i" class="game-box--start-tr-td">{{ item.flag == 'lose' ? '输' : '赢' }}</uni-td>
							</uni-tr>
						</uni-table>
					</uni-collapse-item>
				</uni-collapse>
				<view v-else class="flex items-center justify-center">暂无记录</view>
			</view>
		</uni-popup>

		<!-- 游戏结束 -->
		<uni-popup type="center" ref="popupGameEnd">
			<view class="flex flex-row w-full max-h-full overflow-y-auto" style="max-height: 100vh; max-width:100vh">
				<view class="flex-1 overflow-y-auto">
					<uni-table border stripe emptyText="暂无数据">
						<!-- 表头行 -->
						<uni-tr>
							<uni-th align="center">姓名</uni-th>
							<!-- <uni-th align="center">牌型</uni-th> -->
							<uni-th align="center">底牌</uni-th>
							<uni-th align="center">公共牌</uni-th>
							<uni-th align="center">筹码</uni-th>
							<uni-th align="center">加分</uni-th>
							<uni-th align="center">分数</uni-th>
							<uni-th align="center">保险</uni-th>
							<uni-th align="center">输赢</uni-th>
						</uni-tr>
						<!-- 表格数据行 -->
						<uni-tr v-for="(item, index) in gameData" :key="'over' + index" :class="{ 'bg-red-500 game-box--start-tr': item.userName == username }">
							<uni-td class="game-box--start-tr-td">
								<view class="flex flex-col">
									<view>{{ item.userName }}</view>
									<view v-if="item.ranking">({{ pokerDict[item.ranking] }})</view>
								</view>
							</uni-td>
							<uni-td>
								<view class="flex flex-row">
									<template v-if="item.compose && item.compose.length">
										<Poker class="mr-1" v-for="value in item.compose" width="w-4" :decor="value.suit" :num="value.ranking" />
									</template>
									<text v-else>空</text>
								</view>
							</uni-td>
							<uni-td>
								<view class="flex flex-row">
									<template v-if="item.broad && item.broad.length">
										<Poker class="mr-1" v-for="value in item.broad" width="w-4" :decor="value.suit" :num="value.ranking" />
									</template>
									<text v-else>空</text>
								</view>
							</uni-td>
							<uni-td class="game-box--start-tr-td">{{ item.bankRoll.value }}</uni-td>
							<uni-td class="game-box--start-tr-td">{{ item.addScore }}</uni-td>
							<uni-td class="game-box--start-tr-td">{{ item.value }}</uni-td>
							<uni-td class="game-box--start-tr-td">{{ item.insurance }}</uni-td>
							<uni-td class="game-box--start-tr-td">{{ item.flag == 'lose' ? '输' : '赢' }}</uni-td>
						</uni-tr>
					</uni-table>
				</view>
				<view class="bg-white flex flex-col items-center justify-center relative">
					<view class="absolute font-bold w-3 h-3 text-center flex items-center" style="right: 0; top: 10rpx" @click="close('popupGameEnd')">X</view>
					<h2 class="mb-2" style="font-size: 18px">游戏结束</h2>
					<view class="px-4 py-2 rounded">
						<view class="">等待开始...{{ timeNum }}s</view>
						<view>玩家人数：{{ currentNum }} / {{ totalNum }}</view>
						<!-- <button v-if="createUser == username && currentNum > 2" class="mt-1" type="primary" size="mini" @click="handleStartGame()">提前开始游戏</button> -->
						<button class="mt-1" type="warn" size="mini" @click="handleClose(true)">退出房间</button>
					</view>
				</view>
			</view>
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
			gameData: [], // 游戏结束数据
			panelData: [], // 记分板数据
			addScore: 0, // 增加筹码
			addRaise: 0, // 加注金额
			addInsurance: 0, // 保险金额
			surpass: [], // 保险反超牌集合
			timeEnd: '', // 游戏结束后的倒计时文字
			timeNum: 10, // 游戏结束后的倒计时时间
			totalNum: 0, // 房间设置的最大人数
			currentNum: 1, // 当前房间人数
			createUser: '', // 创建房间的人
			gameStatus: false, // 判断游戏是否开始
			sumBet: '', // 总筹码
			opreateUser: '', // 操作时间延时人
			opreateTime: '', // 操作时间
			timeOpreate: '', // 操作时间倒计时
			lastTime: '', // 游戏时间总秒数
			lastTimeText: '', // 游戏时间
			timeLast: '', // 游戏时间倒计时
			username: getUser().userName, // 当前登录用户
			boy: require('@/static/images/boy.png'), // 人物进来后图片
			zw: require('@/static/images/zw.png'), // 人物占位图片
			// girl: require('@/static/images/girl.png'),
			pokerFpg: [], // 中间牌集合
			msgText: '', // 操作记录
			msgList: [], // 操作记录集合
			personAction: '', // 当前操作人物
			personPosition: [
				// 人物位置集合
				{
					style: {
						// 人物位置
						left: '117.19rpx',
						bottom: '46.87rpx'
					},
					personIamge: require('@/static/images/boy.png'),
					money: 0, // 筹码
					username: '', // 用户名
					blind: '', // 大小盲
					lookOn: false, // 是否站起
					poker: {
						// 牌数据
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
						},
						ranking: {
							value: '',
							label: '',
							style: {
								transform: 'translate(100%, -100%)'
							}
						}
					},
					opreate: ''
				},
				{
					style: {
						left: '30rpx',
						top: '64%',
						transform: 'translate(0%, -60%)'
					},
					personIamge: require('@/static/images/zw.png'),
					money: 0,
					username: '',
					blind: '',
					lookOn: false,
					poker: {
						style: {
							right: '-60%',
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
						},
						ranking: {
							value: '',
							label: '',
							style: {
								transform: 'translate(0, -100%)'
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
					blind: '',
					lookOn: false,
					poker: {
						style: {
							right: '-60%',
							top: '50%',
							transform: 'translate(50%, -50%);'
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
						},
						ranking: {
							value: '',
							label: '',
							style: {
								transform: 'translate(0, -100%)'
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
					blind: '',
					lookOn: false,
					poker: {
						style: {
							left: '50%',
							transform: 'translate(-50%, 40%)'
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
						},
						ranking: {
							value: '',
							label: '',
							style: {
								transform: 'translate(0, 140%)'
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
					blind: '',
					lookOn: false,
					poker: {
						style: {
							left: '50%',
							transform: 'translate(-50%, 40%)'
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
						},
						ranking: {
							value: '',
							label: '',
							style: {
								transform: 'translate(0, 140%)'
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
					blind: '',
					lookOn: false,
					poker: {
						style: {
							left: '-70%',
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
						},
						ranking: {
							value: '',
							label: '',
							style: {
								transform: 'translate(0, -100%)'
							}
						}
					},
					opreate: ''
				},
				{
					style: {
						right: '30rpx',
						top: '64%',
						transform: 'translate(0%, -60%)'
					},
					personIamge: require('@/static/images/zw.png'),
					money: 0,
					username: '',
					blind: '',
					lookOn: false,
					poker: {
						style: {
							left: '-70%',
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
						},
						ranking: {
							value: '',
							label: '',
							style: {
								transform: 'translate(0, -100%)'
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
					blind: '',
					lookOn: false,
					poker: {
						style: {
							left: '50%',
							top: '-70%',
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
						},
						ranking: {
							value: '',
							label: '',
							style: {
								transform: 'translate(0, -100%)'
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
					blind: '',
					lookOn: false,
					poker: {
						style: {
							left: '50%',
							top: '-70%',
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
						},
						ranking: {
							value: '',
							label: '',
							style: {
								transform: 'translate(0, -100%)'
							}
						}
					},
					opreate: '' // 按钮操作显示
				}
			],
			// status: 1,
			btnDict: {
				// 按钮字典
				BET: {
					label: '下注',
					active: false
				},
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
				},
				INSURANCE: {
					label: '保险',
					active: false
				},
				NOTBUY: {
					label: '不购买',
					active: false
				},
				DELAY: {
					label: '延时',
					active: false
				}
			},
			pokerDict: {
				// 牌型字典
				HIGH_CARD: '高牌',
				ONE_PAIR: '一对',
				TWO_PAIR: '两对',
				THREE_OF_A_KIND: '三条',
				STRAIGHT: '顺子',
				FLUSH: '同花',
				FULL_HOUSE: '葫芦',
				FOUR_OF_A_KIND: '四条',
				STRAIGHT_FLUSH: '同花顺',
				ROYAL_FLUSH: '皇家同花顺'
			},
			btnList: [], // 按钮数据
			btnSwitch: false, // 按钮开关
			timeBtn: '', // 按钮禁用时间
			socketOpen: false, // ws开关，暂未用
			socketData: {
				// 房间信息
				action: 'join',
				token: getToken(),
				data: {
					roomId: '',
					pwd: ''
				}
			},
			menuList: [
				// 菜单
				{
					name: '返回大厅',
					// icon: 'upload-filled',
					iconClass: '',
					visible: true,
					fn: () => {
						this.handleClose(true);
					}
				},
				{
					name: '站起',
					// icon: 'tune-filled',
					iconClass: '',
					visible: true,
					fn: () => {
						this.handlelookOn();
					}
				},
				{
					name: '坐下',
					// icon: 'tune-filled',
					iconClass: '',
					visible: false,
					fn: () => {
						this.handleSitDown();
					}
				},
				{
					name: '记分板',
					// icon: 'tune-filled',
					iconClass: '',
					visible: true,
					fn: () => {
						// console.log('站起');
						this.handlePanle();
					}
				},
				{
					name: '加筹码',
					// icon: 'tune-filled',
					iconClass: '',
					visible: true,
					fn: () => {
						this.addScore = 0;
						this.open('popupScore');
					}
				}
			]
		};
	},
	onLoad(option) {
		if (option) {
			this.socketData.data.roomId = Number(option.roomId);
			this.socketData.data.pwd = option.pwd;
			this.totalNum = Number(option.maxNum);
			this.createUser = option.createUser;
		}
	},
	mounted() {
		if (this.timeEnd) {
			clearInterval(this.timeEnd);
			this.timeEnd = 10;
		}
		if (!this.socketData.data.roomId) {
			this.handleClose();
			return false;
		}
		this.init();
	},
	destroyed() {
		if (this.timeEnd) {
			clearInterval(this.timeEnd);
			this.timeEnd = 10;
		}
	},
	methods: {
		init() {
			const that = this;
			const wsTime = '';
			if (!getToken()) {
				uni.redirectTo({
					url: '/pages/login/index'
				});
				return false;
			}

			uni.connectSocket({
				// url: 'ws:' + location.host + '/socket',
				url: 'ws://47.100.78.166:8224/ws/' + getToken()
				// url: 'ws://47.100.78.166:8089/ws/' + getToken()
				// url: 'ws://58i64u9459.goho.co:23635/ws/' + getToken()
			});

			uni.onSocketOpen(function(res) {
				console.log('ws打开');
				that.socketOpen = true;
				that.sendSocketMessage(that.socketData);
			});

			uni.onSocketError(function(res) {
				console.log('WebSocket连接打开失败，请检查！');
			});

			uni.onSocketMessage(function(res) {
				console.log('接受消息');
				that.socketOpen = true;
				// console.log('收到服务器内容：' + res.data);
				that.startGame(JSON.parse(res.data));
			});
		},
		sendSocketMessage(msg, callback) {
			uni.sendSocketMessage({
				data: JSON.stringify(msg),
				success: res => {
					console.log(res, 111);
					callback && callback(true);
				},
				fail: err => {
					console.log(err, 222);
					callback && callback(false);
				}
			});
		},
		// ws消息统一处理
		startGame(res) {
			console.log(res, 111);
			if (res.status == 500) {
				uni.showToast({
					title: res.data || '请求错误',
					icon: 'none'
				});
				return false;
			}
			this.timeNum = 10;
			const that = this;
			if (res.action == 'join' || res.action == 'reconn') {
				// 加入房间
				this.currentNum = res.data.length;
				if ((res.action == 'reconn' && this.currentNum == this.totalNum) || res.data[0].startFlag) {
					this.gameStatus = true;
				}
				// 对人物座位进行调整
				const index = res.data.findIndex(item => item.user == this.username);
				let list = [];
				res.data.forEach((item, i) => {
					let obj = { ...item };
					if (i < index) {
						obj.sort = res.data.length - (index - i);
					} else {
						obj.sort = i - index;
					}
					list.push(obj);
				});
				list.sort((a, b) => a.sort - b.sort);
				list.forEach((item, ii) => {
					this.personPosition[ii].username = item.user;
					this.personPosition[ii].money = item.bankRoll.value;
					this.personPosition[ii].personIamge = this.boy;
				});
			} else if (res.action == 'startGame' || res.action == 'reconninfo') {
				this.btnList = [];
				this.opreateUser = '';

				if (this.$refs.popupGameEnd) this.close('popupGameEnd');
				this.gameStatus = true;
				// this.menuList[0].visible = false;
				// this.menuList[1].visible = false;
				// this.menuList[3].visible = true;
				// this.menuList[4].visible = true;
				// 游戏开始 or 游戏重连
				this.personAction = res.data.activeUser;
				// this.personPosition[0].money = res.data.bankRoll.value;

				this.personPosition.map(item => {
					if (item.username == res.data.smallBlind) {
						item.blind = '小盲';
					} else if (item.username == res.data.bigBlind) {
						item.blind = '大盲';
					} else {
						item.blind = '';
					}
				});
				this.sumBet = res.data.sumBet || 0;

				// 操作时间设置
				if (this.timeOpreate) clearInterval(this.timeOpreate);
				this.opreateTime = res.data.opreateTime;
				this.timeOpreate = setInterval(() => {
					that.opreateTime--;
					if (that.opreateTime <= 0) {
						clearInterval(that.timeOpreate);
					}
				}, 1000);

				// 游戏时间设置
				if (this.timeLast) clearInterval(this.timeLast);
				if (res.data.lastTime > new Date().getTime()) {
					this.lastTime = (res.data.lastTime - new Date().getTime()) / 1000;
					this.lastTimeText =
						Math.floor(this.lastTime / 3600) + ':' + (Math.floor(this.lastTime / 60) - Math.floor(this.lastTime / 3600) * 60) + ':' + Math.floor(this.lastTime % 60);
					this.timeLast = setInterval(() => {
						that.lastTime--;
						that.lastTimeText =
							Math.floor(that.lastTime / 3600) +
							':' +
							(Math.floor(this.lastTime / 60) - Math.floor(this.lastTime / 3600) * 60) +
							':' +
							Math.floor(that.lastTime % 60);
						if (that.lastTime <= 0) {
							clearInterval(that.timeLast);
							this.lastTimeText = '游戏结束';
						}
					}, 1000);
				} else {
					this.lastTimeText = '游戏已超时';
				}

				if (res.data.bankRoll) {
					for (const key in res.data.bankRoll) {
						this.personPosition.map(item => {
							if (key == item.username) {
								item.money = res.data.bankRoll[key].value;
							}
						});
					}
				}

				if (res.data.cards) {
					for (const key in res.data.cards) {
						this.personPosition.map(item => {
							if (key == item.username) {
								item.poker.cards = res.data.cards[key];
								if (res.data.cards[key].ranking) {
									item.poker.ranking.value = res.data.cards[key].ranking;
									item.poker.ranking.label = this.pokerDict[res.data.cards[key].ranking];
								}
							}
						});
					}
				}
				if (res.data.actions) {
					res.data.actions.forEach(item => {
						this.btnList.push({
							name: item.action,
							label: this.btnDict[item.action].label,
							active: this.btnDict[item.action].active,
							minBet: item.minBet
						});
						if (item.action == 'RAISE') {
							this.addRaise = item.minBet;
						}
					});
				}
			} else if (res.action == 'bet') {
				this.btnList = [];
				this.surpass = []; // 保险反超牌
				this.opreateUser = '';
				this.msgList.push(res.data.userName + '：' + this.btnDict[res.data.opreate].label + (res.data.amount || res.data.amount == 0 ? ' | ' + res.data.amount : ''));
				this.msgText = this.msgList.join('\n');
				// 下注
				this.sumBet = res.data.sumBet || 0;
				this.personAction = res.data.activeUser;
				this.personPosition.map(item => {
					if (item.username == res.data.userName) {
						item.money = res.data.bankRoll.value;
						item.opreate = this.btnDict[res.data.opreate].label;
					}
				});
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
				if (res.data.surpass) {
					this.surpass = res.data.surpass;
				}
				// 操作时间设置
				if (this.timeOpreate) clearInterval(this.timeOpreate);
				this.opreateTime = res.data.opreateTime;
				this.timeOpreate = setInterval(() => {
					that.opreateTime--;
					if (that.opreateTime <= 0) {
						clearInterval(that.timeOpreate);
					}
				}, 1000);
			} else if (res.action == 'board') {
				// 牌桌的牌
				this.pokerFpg = res.data.board;
				if (res.data.ranking) {
					for (const key in res.data.ranking) {
						this.personPosition.map(item => {
							if (key == item.username) {
								item.poker.ranking.value = res.data.ranking[key];
								item.poker.ranking.label = this.pokerDict[res.data.ranking[key]];
							}
						});
					}
				}
			} else if (res.action == 'gameover') {
				// 游戏结束
				this.gameData = res.data;
				this.timeEnd = setInterval(() => {
					that.timeNum--;
					if (that.timeNum <= 0) {
						clearInterval(that.timeEnd);
					}
				}, 1000);
				this.open('popupGameEnd');
				// this.msgList = []; // 操作记录
				this.pokerFpg = []; // 公共牌
				this.surpass = []; // 保险反超牌
				this.btnList = []; // 按钮
				this.sumBet = ''; // 当前筹码
				this.personAction = ''; // 当前操作人
				this.opreateTime = ''; // 操作时间
				this.opreateUser = ''; // 延时人
				this.personPosition.map(item => {
					const u = res.data.find(v => v.userName == item.username);
					item.money = u ? u.bankRoll.value : item.money; // 筹码
					item.blind = ''; // 大小盲
					item.poker.cards = {
						cardA: {
							ranking: '',
							suit: ''
						},
						cardB: {
							ranking: '',
							suit: ''
						}
					};
					item.poker.ranking.value = '';
					item.poker.ranking.label = '';
					item.poker.opreate = '';
				});
			} else if (res.action == 'addscore') {
				this.personPosition.map(item => {
					if (item.username == res.data.userName) {
						item.money = res.data.bankRoll.value;
					}
				});
			} else if (res.action == 'lookOn') {
				this.personPosition.map(item => {
					if (item.username == res.data.userName) {
						item.lookOn = true;
					}
				});
			}
			// else if (res.action == 'sitDown') {
			// 	this.personPosition.map(item => {
			// 		if (item.username == res.data.userName) {
			// 			item.lookOn = false;
			// 		}
			// 	});
			// }
			else if (res.action == 'delay') {
				if (this.timeOpreate) clearInterval(this.timeOpreate);
				this.opreateTime = res.data.opreateTime;
				this.opreateUser = res.data.userName;
				this.timeOpreate = setInterval(() => {
					that.opreateTime--;
					if (that.opreateTime <= 0) {
						clearInterval(that.timeOpreate);
					}
				}, 1000);
			} else if (res.action == 'exitRoom') {
				uni.showToast({
					title: res.data.userName + '退出房间',
					icon: 'none'
				});
				this.personPosition.map(item => {
					if (item.username == res.data.userName) {
						item.personIamge = this.zw;
						item.money = 0; // 筹码
						item.blind = ''; // 大小盲
						item.lookOn = false; // 是否站起
						item.poker.cards = {
							cardA: {
								ranking: '',
								suit: ''
							},
							cardB: {
								ranking: '',
								suit: ''
							}
						};
						item.poker.ranking.value = '';
						item.poker.ranking.label = '';
						item.poker.opreate = '';
						item.username = ''; // 用户名
					}
				});
			}
		},
		// 提前开始游戏
		handleStartGame() {
			this.sendSocketMessage({ data: {}, action: 'startGame', token: getToken() });
		},
		// 加筹码
		handlerScore() {
			this.sendSocketMessage({ data: { score: this.addScore }, action: 'addScore', token: getToken() });
			this.close('popupScore');
			this.close('popup');
		},
		// 加注
		handlerRaise() {
			const that = this;
			if (this.timeBtn) clearTimeout(this.timeBtn);
			this.btnSwitch = true;
			this.timeBtn = setTimeout(() => {
				that.btnSwitch = false;
			}, 1500);
			this.sendSocketMessage({ data: { amount: this.addRaise }, action: 'raise', token: getToken() });
			this.close('popupRaise');
		},
		// 保险
		handlerInsurance() {
			const that = this;
			if (this.timeBtn) clearTimeout(this.timeBtn);
			this.btnSwitch = true;
			this.timeBtn = setTimeout(() => {
				that.btnSwitch = false;
			}, 1500);
			this.sendSocketMessage({ data: { amount: this.addInsurance }, action: 'insurance', token: getToken() });
			this.close('popupInsurance');
		},
		// 按钮点击事件
		handleBtns(data) {
			const that = this;
			if (this.timeBtn) clearTimeout(this.timeBtn);
			this.btnSwitch = true;
			this.timeBtn = setTimeout(() => {
				that.btnSwitch = false;
			}, 1500);
			this.sendSocketMessage({ data: { amount: data.minBet }, action: data.name, token: getToken() });
		},
		// 站起
		handlelookOn() {
			this.sendSocketMessage({ data: {}, action: 'lookOn', token: getToken() });
		},
		// 坐下
		handleSitDown() {
			this.sendSocketMessage({ data: {}, action: 'sitDown', token: getToken() });
		},
		// 退出房间
		handleClose(v) {
			const that = this;
			if (v) {
				this.sendSocketMessage({ data: {}, action: 'exit', token: getToken() }, msg => {
					if (msg) {
						uni.closeSocket({
							complete: res => {
								that.handlerGoPlay();
							}
						});
					} else {
						uni.showToast({
							title: '退出房间失败',
							icon: 'none'
						});
					}
				});
			} else {
				uni.closeSocket({
					complete: res => {
						that.handlerGoPlay();
					}
				});
			}
		},
		// 回到大厅
		handlerGoPlay() {
			uni.navigateTo({
				url: '/pages/play/index'
			});
		},
		// 打开弹框
		open(v) {
			this.$refs[v].open();
		},
		// 关闭弹框
		close(v) {
			this.$refs[v].close();
		},
		// 打开记分面板
		handlePanle() {
			this.$http({
				url: '/game/room/gameResult',
				params: {
					roomId: this.socketData.data.roomId
				}
			}).then(res => {
				this.tableLoading = false;
				this.panelData = res;
				this.open('popupPanel');
			});
		}
	}
};
</script>

<style></style>
