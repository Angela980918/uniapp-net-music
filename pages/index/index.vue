<template>
	<view class="index">
		<musicHead title="Net-Music" :iconShow="false"></musicHead>
		<!-- 可滑动容器 -->
		<view class="container">
			<scroll-view scroll-y="true">
				<!-- 搜索框 -->
				<view class="index-search" @tap="handleToSearch">
					<text class="iconfont icon-sousuo"></text>
					<input type="text" placeholder="搜索歌曲">
				</view>
				<view class="skeleton" v-if="isLoading">
					<m-for-skeleton :avatarSize="200" :row="3" :loading="isLoading" isarc="square" :titleStyle="{}"
						v-for="(item,key) in 4" :key="key" :title='false'>
					</m-for-skeleton>
				</view>

				<!-- 歌曲列表 -->
				<view class="index-list">

					<!-- 歌曲列表内容 -->
					<view class="index-list-item" v-for="(item,index) in topList" :key="index"
						@tap="handleToList(item.id)">
						<!-- 左侧图片 -->
						<view class="index-list-img">
							<image :src="item.coverImgUrl" mode=""></image>
							<text>{{item.updateFrequency}}</text>
						</view>

						<!-- 右侧文字描述 -->
						<view class="index-list-text">
							<view v-for="(item,index) in item.tracks" :key="index">
								{{index + 1}}.{{item.first}}-{{item.second}}
							</view>
						</view>
					</view>

				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	// 引入css文件
	import '@/common/iconfont.css';
	import musicHead from '../../components/musichead/musichead.vue';
	import {
		topList
	} from '../../common/api.js';
	import mForSkeleton from "@/components/m-for-skeleton/m-for-skeleton";
	export default {
		data() {
			return {
				// 歌曲列表数组
				topList: [],
				isLoading: true,
			}
		},
		components: {
			musicHead,
			mForSkeleton
		},
		onLoad() {
			topList().then((res) => {
				// console.log('歌曲列表ID获取成功：',res[0].id); 
				if (res.length) {
					setTimeout(() => {
						this.topList = res;
						this.isLoading = false;
					}, 2000);
					// console.log('歌曲列表数据获取成功：',this.topList);
				}
			})
		},
		methods: {
			// 跳转至歌单列表详情
			handleToList(listID) {
				// console.log("获取歌曲榜单ID：",listID);
				uni.navigateTo({
					url: '/pages/list/list?listID=' + listID,
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			// 跳转至搜索页面
			handleToSearch() {
				uni.navigateTo({
					url: '/pages/search/search',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			}
		}
	}
</script>

<style>
	/* 搜索框布局 */
	.container .index-search {
		background-color: lightgrey;
		display: flex;
		align-items: center;
		height: 70rpx;
		margin: 70rpx 30rpx 30rpx 30rpx;
		border-radius: 50rpx;
	}

	.index-search text {
		font-size: 30rpx;
		margin-right: 26rpx;
		margin-left: 28rpx;
	}

	.index-search input {
		font-size: 30rpx;
		flex: 1;
	}

	/* 歌曲列表样式 */
	.index-list {
		margin: 0 30rpx;
	}

	.index-list-item {
		display: flex;
		margin-bottom: 34rpx;
		/* background-color: aqua; */
	}

	.index-list-img {
		width: 212rpx;
		height: 212rpx;
		position: relative;
		border-radius: 26rpx;
		overflow: hidden;
		margin-right: 22rpx;
	}

	.index-list-img image {
		width: 100%;
		height: 100%;
	}

	.index-list-img text {
		position: absolute;
		left: 12rpx;
		bottom: 12rpx;
		color: white;
		font-size: 20rpx;
	}

	.index-list-text {
		/* background-color: aqua; */
		font-size: 24rpx;
		line-height: 66rpx;
		width: 480rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	
	/* 骨架屏样式 */
	.skeleton{
		margin: 0 10rpx;
	}
</style>
