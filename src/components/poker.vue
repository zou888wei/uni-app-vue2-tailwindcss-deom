<template>
	<view class="bg-white" :class="classs" style="aspect-ratio: 6/9">
		<view class="border border-solid border-black w-full h-full" v-if="nums">
			<view class="flex flex-col w-full h-full" style="transform: scale(0.9)">
				<view class="text-left" style="font-size: 5.86rpx">{{ nums }}</view>
				<view class="flex-1 text-center" style="font-size: 14rpx">{{ decorText }}</view>
				<view class="text-right" style="font-size: 5.86rpx">{{ nums }}</view>
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
				case 1:
					data = 'A';
					break;
				case 11:
					data = 'J';
					break;
				case 12:
					data = 'Q';
					break;
				case 13:
					data = 'K';
					break;
			}
			return data;
		},
		decorText() {
			let data = this.decor;
			switch (this.decor) {
				case 'DIAMONDS':
					data = '♦';
					break;
				case 'CLUBS':
					data = '♣';
					break;
				case 'HEARTS':
					data = '♠';
					break;
				case 'SPADES':
					data = '♥';
					break;
			}
			return data;
		},
		classs() {
			const data = [this.width];
			if (this.decor == 'HEARTS' || this.decor == 'DIAMONDS') {
				data.push('border-red-600');
			}
			return data;
		}
	}
};
</script>

<style></style>
