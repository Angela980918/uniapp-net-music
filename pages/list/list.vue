<template>
	<view class="list">
		<!-- 歌曲列表背景图 -->
		<view class="backgroundImg" :style="{'background-image' : 'url('+playlist.coverImgUrl+')'}"></view>
		<musicHead title="歌单" :iconShow="true" color="white"></musicHead>
		
		<!-- 歌单详情 -->
		<view class="container" v-show="!isLoading">
			<scroll-view scroll-y="true" >
				<!-- 歌单详情头部 -->
				<view class="list-head">
					<view class="list-head-img">
						<image :src="playlist.coverImgUrl" mode=""></image>
						<text class="iconfont icon-yousanjiao">{{ playlist.playCount }}</text>
					</view>
					
					<view class="list-head-text">
						<view class="list-head-text-name">云音乐飙升榜</view>
						<view class="list-head-text-logo">
							<image :src="playlist.creator.avatarUrl" mode=""></image>
							{{playlist.creator.nickname}}
						</view>
						<view class="list-head-text-detail">
							{{playlist.description}} >
						</view>
					</view>
				</view>
				
				<!-- #ifdef MP-WEIXIN -->
				<!-- 好友分享 -->
				<button class="list-share" open-type="share">
					<text class="iconfont icon-fenxiang"> 分享给微信好友</text>
				</button>
				<!-- #endif -->
				
				<!-- 歌单列表 -->
				<view class="list-music">
					<!-- 歌单头部 -->
					<view class="list-music-head">
						<text class="iconfont icon-bofang1 list-music-head-icon"></text>
						<text class="list-music-head-play">播放全部</text>
						<text class="list-music-head-number">(共{{playlist.trackCount}}首)</text>
					</view>
					
					<!-- 歌单列表item -->
					<view class="list-music-item" v-for="(item,index) in playlist.tracks" @tap="handleToDetail(item.id)">
						<view class="list-music-top">{{index+1}}</view>
						<view class="list-music-song">
							<view class="list-music-song-name">{{item.name}}</view>
							<view class="list-music-song-img">
								<image v-if="privileges[index].flag > 60 && privileges[index].flag <60" src="../../static/dujia.png" mode=""></image>
								<image v-if="privileges[index].maxbr == 999000" src="../../static/sq.png" mode=""></image>
								- {{item.ar[0].name}}
							</view>
						</view>
						<text class="iconfont icon-24gl-playCircle list-music-item-icon"></text>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import musicHead from '../../components/musichead/musichead.vue'
	import '@/common/iconfont.css'
	import { ListItem } from '@/common/api.js'
	export default {
		data() {
			return {
				// 歌单列表信息
				playlist:{
					coverImgUrl:'',
					creator:{
						avatarUrl:'',
						nickname:'',
					},
					tracks:[],
					trackCount:'',
					playCount:''
				},
				
				// 歌曲权限信息
				privileges:[],
				isLoading:true,
			}
		},
		methods: {
			handleToDetail(songID){
				uni.navigateTo({
					url:'/pages/detail/detail?songID='+songID,
				});
			}
		},
		components: {
			musicHead,
		},
		onLoad(options) {
			
			// 弹窗加载
			uni.showLoading({
				icon:'loading',
				title:'正在加载...'
			})
			
			// console.log("获取歌曲榜单ID：",options.listID);
			let listID = options.listID;
			ListItem(listID).then((res) => {
				// console.log("获取歌单列表请求成功：",res);
				if(res[1].data.code == '200'){
					this.playlist = res[1].data.playlist;
					this.privileges = res[1].data.privileges;
					this.$store.commit('INIT_TOPLISTIDS', this.playlist.trackIds);
					// console.log("获取歌单列表成功：",this.playlist);
					// console.log("获取歌单权限信息成功：",this.privileges);
					this.isLoading = false;
					uni.hideLoading();
				}
			});
		},
	}
</script>

<style scoped>
	.list-head{
		display: flex;
		margin: 30rpx;
	}
	
	.list-head-img{
		width: 250rpx;
		height: 250rpx;
		border-radius: 30rpx;
		overflow: hidden;
		position: relative;
		margin-right: 42rpx;
	}
	
	.list-head-img image{
		width: 100%;
		height: 100%;
		
	}
	
	.list-head-img text{
		position: absolute;
		right: 8rpx;
		top: 8rpx;
		color: white;
		font-size: 26rpx;
	}
		
	.list-head-text{
		flex: 1;
		color: white;
	}
	
	.list-head-text-name{
		font-size: 34rpx;
	}
	
	.list-head-text-logo{
		display: flex;
		font-size: 24rpx;
		margin: 20rpx 0;
		align-items: center
	}
	
	.list-head-text-logo image{
		width: 50rpx;
		height: 50rpx;
		border-radius: 50%;
		margin-right: 14rpx;
	}
	
	.list-head-text-detail{
		line-height: 34rpx;
		font-size: 22rpx;
	}
	
	.list-share{
		width: 360rpx;
		height: 74rpx;
		align-items: center;
		font-size: 28rpx;
		margin: 0 auto;
		background: rgba(0, 0, 0, 0.4);
		border-radius: 37rpx;
		color: white;
		text-align: center;
		line-height: 74rpx;
	}
	
	.list-share text{
		margin-right: 16rpx;
	}
	
	/* 歌单列表样式 */
	.list-music{
		background-color: white;
		border-radius: 50rpx;
		margin-top: 40rpx;
		overflow: hidden;
	}
	
	.list-music-head{
		height: 50rpx;
		margin:30rpx 0 70rpx 30rpx;
		/* background-color: aqua; */
		align-items: center;
	}
	
	.list-music-head-icon{
		height: 50rpx;
		font-size: 50rpx;
	}
	
	.list-music-head-play{
		font-size: 30rpx;
		margin:0 10rpx 0 26rpx ;
	}
	
	.list-music-head-number{
		font-size: 26rpx;
		color: darkgray;
	}
	
	.list-music-item{
		display: flex;
		margin: 0 32rpx 66rpx 46rpx;
		align-items: center;
		color: gray;
	}
	
	.list-music-top{
		width: 58rpx;
		font-size: 30rpx;
		line-height: 30rpx;
	}
	
	.list-music-song{
		flex: 1;
	}
	
	.list-music-song-name{
		font-size: 28rpx;
		color: black;
		width: 70vw;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	
	.list-music-song-img{
		display: flex;
		font-size: 20rpx;
		align-items: center;
		width: 70vw;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	
	.list-music-song-img image{
		width: 48rpx;
		height: 30rpx;
		margin-right: 10rpx;;
	}
	
	.list-music-item-icon{
		font-size: 50rpx;
		color: lightgray;
	}
</style>
