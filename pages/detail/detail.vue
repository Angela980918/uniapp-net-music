<template>
	<view  class="detail">
		<view class="backgroundImg" :style="{'background-image' : 'url('+ songDetail.al.picUrl +')'}"></view>
		<musicHead :title="songDetail.name" :iconShow="true" color="white"></musicHead>
		
		<view class="container" v-show="!isLoading">
			<scroll-view scroll-y="true" >
				<view class="detail-play"  >
					<image class="detail-play-img" :class="{ 'detail-play-run' : isPlayRotate }" :src="songDetail.al.picUrl" mode=""></image>
					<text @tap="handleToPlay" class="iconfont detail-play-icon" :class="iconPlay"></text>
					<view class="detail-play-img-btn" ></view>
				</view>
				
				<!-- 歌词 -->
				<view class="detail-lyric">
					<view class="detail-lyric-wrap" :style="{ transform : 'translateY('+ -(lyricIndex-1)*82 + 'rpx)' }">
						<view class="detail-lyric-wrap-item" :class="{ active : lyricIndex ==index}" v-for="(item,index) in songLyric" :key="index">
							{{item.lyric}}
						</view>
					</view>
				</view>
				
				<!-- 相似歌曲 -->
				<view class="detail-like">
					<view class="detail-like-head">喜欢这首歌的人也听</view>
					
					<!-- 歌曲信息 -->
					<view class="detail-like-item" v-for="(item,index) in songSimi" :key="index" >
						<view class="detail-like-item-img">
							<image :src="item.album.picUrl" mode=""></image>
						</view>
						<view class="detail-like-song">
							<view class="detail-like-song-name">{{item.name}}</view>
							<view class="detail-like-item-icon">
								<image v-if="item.privilege.flag > 60 && item.privilege.flag < 70" src="../../static/dujia.png" mode=""></image>
								<image v-if="item.privilege.maxbr == 999000" src="../../static/sq.png" mode=""></image>
								{{item.artists[0].name}}
							</view>
						</view>
						<text  @tap="handleToSimi(item.id)" class="iconfont icon-24gl-playCircle list-music-item-icon"></text>
					</view>
				</view>
				
				<!-- 精彩评论 -->
				<view class="detail-comment">
					<!-- 评论头部 -->
					<view class="detail-comment-head">精彩评论</view>
					
					<!-- 评论列表 -->
					<view class="detail-comment-item" v-for="(item,index) in songComment" :key="index">
						<!-- 左侧图片 -->
						<view class="detail-comment-item-img">
							<image :src="item.user.avatarUrl" mode=""></image>
						</view>
						<!-- 右侧信息 -->
						<view class="detail-comment-item-content">
							<view class="detail-comment-item-title">
								<view class="detail-comment-item-name">
									<view class="detail-comment-item-admin">
										{{item.user.nickname}}
										<image v-if="item.user.userType == 200" src="../../static/MyVIP.png" mode=""></image>
									</view>
									<view class="detail-comment-item-date">{{item.timeStr}}</view>
								</view>
								<view class="detail-comment-item-like">
									{{item.likedCount | formatCount}}
									<text class="iconfont icon-dianzan"></text>
								</view>
							</view>
							<!-- 评论内容 -->
							<view class="detail-comment-item-content-text">{{item.content}}</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import musicHead from '../../components/musichead/musichead.vue'
	import '@/common/iconfont.css'
	import { ListItem, songDetail, songSimi, songLyric, songComment, songUrl } from '@/common/api.js'
	export default {
		data() {
			return {
				songID:'',
				songDetail: {
					al:{
						picUrl:'',
					}
				},
				songSimi:[],
				songLyric:[],
				songComment:[],
				// songUrl:'',
				// 歌词选中状态标记
				lyricIndex:0,
				// 播放按钮样式变化
				iconPlay:'',
				// 旋转状态
				isPlayRotate:true,
				isLoading: true,
				// 下一歌曲ID
				nextSongID:'',
			}
		},
		methods: {
			getMusic(songID){
				this.$store.commit('NEXT_ID',songID);
				this.nextSongID = this.$store.state.nextID;
				console.log("下一歌曲ID：",this.nextSongID);
				// 弹窗加载
				uni.showLoading({
					icon:'loading',
					title:'正在加载...'
				})
				this.isLoading = true;
				// console.log(songID);
				 Promise.all([ songDetail(songID), songSimi(songID), songLyric(songID), songComment(songID), songUrl(songID) ]).then((res)=>{
					// console.log(res);
					// 获取歌曲信息
					if(res[0][1].data.code == '200'){
						// console.log("歌曲信息:",res[0].data);
						this.songDetail = res[0][1].data.songs[0];
						// console.log("获取歌曲详情信息成功：",this.songDetail);
					}
					// 获取相似歌曲信息
					if(res[1][1].data.code == '200'){
						// console.log("相似歌曲信息：",res[1].data);
						this.songSimi = res[1][1].data.songs;
						// console.log("获取相似歌曲成功：",this.songSimi);
					}
					// 获取歌词
					if(res[2][1].data.code == '200'){
						// console.log("歌词信息：",res[2].data);
						let Lyric = res[2][1].data.lrc.lyric;
						// console.log(Lyric);
						// 正则表达式拆解歌词
						let result = [];
						let re = /\[([^\]]+)\]([^[]+)/g;
						Lyric.replace(re,($0,$1,$2)=>{
							result.push({ time:this.formatTimeDate($1), lyric:$2 });
						});
						this.songLyric = result;
						// console.log("获取歌词成功：",this.songLyric);
					}
					// 获取歌曲相关评论
					if(res[3][1].data.code == '200'){
						// console.log("歌曲相关评论信息：",res[3].data);
						this.songComment = res[3][1].data.hotComments;
						// console.log("获取歌曲相关评论成功：",this.songComment);
						
					}
					// 获取歌曲Url
					if(res[4][1].data.code == '200'){
						// #ifdef MP-WEIXIN
						this.bgAudioManager = uni.getBackgroundAudioManager();
						this.bgAudioManager.title = this.songDetail.name;
						// #endif
						
						// #ifdef H5 || APP-PLUS
						// console.log(this.bgAudioManager);
						this.iconPlay = 'icon-bofang1',
						this.isPlayRotate = false;
						if (!this.bgAudioManager) {
							this.bgAudioManager = uni.createInnerAudioContext();
						}
						// #endif
						
						this.bgAudioManager.src = res[4][1].data.data[0].url;
						// 监听歌词变化
						this.listenLyricIndex();
						this.bgAudioManager.onPlay(()=>{
							this.iconPlay = 'icon-zanting',
							this.isPlayRotate = true;
							this.listenLyricIndex();
						});
						this.bgAudioManager.onPause(()=>{
							this.iconPlay = 'icon-bofang1',
							this.isPlayRotate = false;
							this.cancelLyricIndex();
						});
						this.bgAudioManager.onEnded(()=>{
							this.getMusic(this.$store.state.nextID);
						})
					}
					this.isLoading = false;
					uni.hideLoading();	
				})	
			},
			// 歌词时间格式化
			formatTimeDate(value){
				let arr = value.split(':');
				return (parseFloat(arr[0])*60 + parseFloat(arr[1])).toFixed(2);
			},
			// 歌曲播放暂停操作
			handleToPlay(){
				if(this.bgAudioManager.paused){
					this.bgAudioManager.play();
				}
				else{
					this.bgAudioManager.pause();
					this.cancelLyricIndex();
				}
			},
			// 定时器（监听歌词变化）
			listenLyricIndex(){
				clearInterval((this.timer));
				this.timer = setInterval(()=>{
					for (var i = this.lyricIndex; i < this.songLyric.length; i++) {
						// 判断歌曲是否播放到最后
						if ( this.songLyric[this.songLyric.length-1].time < this.bgAudioManager.currentTime ) {
							this.lyricIndex = this.songLyric.length-1;
							break;
						}
						if (this.songLyric[i].time < this.bgAudioManager.currentTime && this.songLyric[i+1].time > this.bgAudioManager.currentTime ) {
							this.lyricIndex = i;
							break;
						}
					}
					// console.log("播放时间变化：",this.lyricIndex);
				},500);
			},
			// 关闭定时器
			cancelLyricIndex(){
				clearInterval(this.timer);
			},
			// 播放相似歌曲
			handleToSimi(songID){
				this.getMusic(songID);
			}
		},
		onLoad(options) {
			this.songID = options.songID;
			this.getMusic(options.songID);
			// #ifdef H5
			this.iconPlay = 'icon-bofang1';
			// #endif
			// #ifdef MP-WEIXIN
			this.iconPlay = 'icon-zanting';
			// #endif
		},
		onUnload() {
			// 离开页面清除定时器
			this.cancelLyricIndex();
			// #ifdef H5
			this.bgAudioManager.destroy();
			// #endif
		},
		onHide() {
			// 离开页面清除定时器
			this.cancelLyricIndex();
		},
		components:{
			musicHead
		}
	}
</script>

<style scoped>
	.detail{
		overflow: hidden;
	}
	
	.detail-play{
		width: 580rpx;
		height: 580rpx;
		background: url(~@/static/disc.png);
		background-size: cover;
		margin: 210rpx auto 44rpx auto;
		/* background-color: darkred; */
		position: relative;
	}
	
	.detail-play-img{
		width: 380rpx;
		height: 380rpx;
		border-radius: 50%;
		position: absolute;
		top: 0;
		left: 0;
		right:0; 
		bottom:0;
		margin: auto;
		animation:10s linear infinite move; 
		animation-play-state: paused;
	}
	
	.detail-play .detail-play-run{
		animation-play-state: running;
	}
	
	@keyframes move{
		from{ transform : rotate(0deg);}
		to{ transform : rotate(360deg);}
	}
	
	.detail-play-icon{
		width: 100rpx;
		height: 100rpx;
		font-size: 100rpx;
		color: lightcyan;
		position: absolute;
		top: 0;
		left: 0;
		right:0; 
		bottom:0;
		margin: auto;
	}
	
	.detail-play-img-btn{
		width: 230rpx;
		height: 360rpx;
		background: url(~@/static/needle.png);
		/* background-color: aquamarine; */
		position: absolute;
		left: 140rpx;
		right: 0;
		top:-200rpx;
		margin: auto;
		background-size: cover;
	}
	
	/* 歌词样式 */
	.detail-lyric{
		font-size: 32rpx;
		line-height: 82rpx;
		height: 246rpx;
		width: ;
		/* background-color: aquamarine; */
		text-align: center;
		overflow: hidden;
		color: #6f6e73;
	}
	
	.detail-lyric-wrap{
		transition: .5s;
		
	}
	
	.detail-lyric-wrap-item{
		height: 82rpx;
	}
	
	.detail-lyric-wrap-item.active{
		color: lightcyan;
	}
	
	/* 歌曲相关信息 */
	.detail-like{
		margin: 0 30rpx;
	}
	
	.detail-like-head{
		font-size: 36rpx;
		color: white;
		margin:50rpx 0;
	}
	
	.detail-like-item{
		display: flex;
		/* background-color: darkred; */
		align-items: center;
		margin-bottom: 28rpx;
	}
	
	.detail-like-item-img{
		width: 82rpx;
		height: 82rpx;
		border-radius: 10rpx;
		overflow: hidden;
		margin-right: 20rpx;
	}
	
	.detail-like-item-img image{
		width: 100%;
		height: 100%;
	}
	
	.detail-like-song{
		flex: 1;
		color: #c6c2bf;
	}
	
	.detail-like-song-name{
		font-size: 28rpx;
		color: white;
		margin-bottom: 12rpx;
	}
	
	.detail-like-item-icon{
		color: lightgray;
		font-size: 22rpx;
	}
	
	.detail-like-item-icon image{
		width: 26rpx;
		height: 20rpx;
		margin-right: 10rpx;
	}
	
	.detail-like-item-icon text{
		width: 100%;
		height: 100%;
	}
	
	.list-music-item-icon{
		font-size: 50rpx;
		color: #c6c2bf;
	}
	
	/* 评论相关样式 */
	.detail-comment{
		 margin:0 32rpx;
	}
	
	.detail-comment-head{
		font-size: 36rpx;
		color: white;
		margin: 50rpx 0;
	}
	
	.detail-comment-item{
		display: flex;
		margin-bottom:28rpx;
		/* background-color: aquamarine; */
	}
	
	.detail-comment-item-img{
		width: 66rpx;
		height: 66rpx;
		border-radius: 50%;
		overflow: hidden;
		margin-right: 18rpx;
	}
	
	.detail-comment-item-img image{
		width: 100%;
		height: 100%;
	}
	
	.detail-comment-item-content{
		flex: 1;
		/* background-color: red; */
		color:#cac9cd;
	}
	
	.detail-comment-item-title{
		display: flex;
		justify-content: space-between;
	}
	
	.detail-comment-item-name{
		 justify-content: space-between;
	}
	
	.detail-comment-item-admin{
		 font-size:24rpx;
		 justify-content:center;
		 /* background-color: aquamarine; */
	}
	
	.detail-comment-item-admin image{
		width: 38rpx;
		height: 24rpx;
	}
	
	.detail-comment-item-date{
		 font-size:20rpx;
	}
	
	.detail-comment-item-like{
		 font-size:30rpx;
	}
	
	.detail-comment-item-content-text{
		line-height: 40rpx;
		color: white;
		font-size: 28rpx;
		margin-top: 16rpx;
		border-bottom: 1rpx #727277 solid;
		padding-bottom: 40rpx;
	}
	
</style>
