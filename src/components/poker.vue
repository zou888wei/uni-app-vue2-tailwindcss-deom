<template>
	<view class="bg-white" :class="classs" style="aspect-ratio: 6/9">
		<view class="border border-solid border-black w-full h-full" v-if="nums">
			<view class="flex flex-col w-full h-full">
				<view class="text-left" style="font-size: 16rpx;font-family:'宋体',Simsun;line-height: 1.45;">{{ nums }}</view>
				<view class="flex-1 h-full text-center" style="font-size: 12rpx;font-family:'宋体',Simsun;line-height: 1.45;">{{ decorText }}</view>
			</view>
		</view>
		<view class="poker-not w-full h-full" v-else></view>
	</view>
</template>

<script>
export default {
	props: {
		decor: {
			type: String
		},
		num: {
			type: [Number, String]
		},
		width: {
			type: String,
			default: 'w-5'
		}
	},
	computed: {
		nums() {
			let data = this.num;
			switch (this.num) {
				case 11:
					data = 'J';
					break;
				case 12:
					data = 'Q';
					break;
				case 13:
					data = 'K';
					break;
				case 14:
					data = 'A';
					break;
			}
			return data;
		},
		decorText() {
			let data = this.decor;
			switch (this.decor) {
				case 'DIAMONDS': // 方块
					data = '♦';
					break;
				case 'CLUBS': // 梅花
					data = '♣';
					break;
				case 'HEARTS': // 红心
					data = '♥';
					break;
				case 'SPADES': // 黑桃
					data = '♠';
					break;
			}
			return data;
		},
		classs() {
			const data = [this.width];
			switch (this.decor) {
				case 'DIAMONDS':
					data.push(...['border-green-600', 'text-green-500']);
					break;
				case 'CLUBS':
					data.push(...['border-blue-600', 'text-blue-500']);
					break;
				case 'HEARTS':
					data.push(...['border-red-600', 'text-red-500']);
					break;
				case 'SPADES':
					data.push(...['border-black', 'text-black']);
					break;
			}
			return data;
		}
	}
};
</script>

<style></style>
