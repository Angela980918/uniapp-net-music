<template>
	<!-- 头部 -->
	<view class="music-head" :style="{ color : color }">
		<view class="music-head-icon" v-if="iconShow" :class="{'music-head-iconBlack' : iconBlack}">
			<text @tap="handleToBack" class="iconfont icon-zuojiantou"></text> |
			<text @tap="handleToHome" class="iconfont icon-shouye"></text>
		</view>
		{{title}}
	</view>
</template>

<script>
	import '@/common/iconfont.css';
	export default {
		name:"musichead",
		data() {
			return {
				
			};
		},
		props:['title','iconShow','color','iconBlack'],
		methods:{
			handleToBack(){
				uni.navigateBack();
			},
			handleToHome(){
				uni.navigateTo({
					url: '/pages/index/index',
				});
			},
		}
	}
</script>

<style scoped>
	.music-head{
		width: 100%;
		height: 75px;
		font-size: 16px;
		line-height: 80px;
		text-align: center;
		color: black;
		position: relative;
	}
	.music-head-icon{
		position: absolute;
		left: 8px;
		top: 38px;
		width: 90px;
		height: 30px;
		background: rgb(0, 0, 0, 0.4);
		color: white;
		/* 行高会继承，需要重新设置 */
		line-height: 31px;
		border-radius: 15px;
		display: flex;
		justify-content: space-evenly;
	}
	.music-head-iconBlack{
		color: black;
		border: 2rpx #eaeaea solid;
		background:lightgray;
	}
</style>