<template>
	<view class="search">
		<musicHead title="搜索" :iconShow="true" :iconBlack="true"></musicHead>
		<view class="container">
			<scroll-view scroll-y="true">
				<!-- 搜索框 -->
				<view class="search-search">
					<text class="iconfont icon-sousuo"></text>
					<input type="text" placeholder="搜索歌曲" v-model="searchWord" @confirm="handleToSearchList" @input="handleToTips">
					<text v-show="searchWord != ''" class="iconfont icon-guanbishanchu" @tap="handleToClose"></text>
				</view>
				<!-- 搜索历史 -->
				<block v-if="searchType == 1">
					<view class="search-history">
						<view class="search-history-head" v-show="searchHistory != ''">
							<text>搜索历史</text>
							<text class="iconfont icon-lajitong" @tap="handleToClear"></text>
						</view>
						<!-- 历史 -->
						<view class="search-history-list">
							<view v-for="(item,index) in searchHistory" :key="index" @tap="handleToWord(item)">
								{{item}}
							</view>
						</view>
						<!-- 热搜榜 -->
						<view class="search-hot">
							<view class="search-hot-head">热搜榜</view>
							<!-- 热搜榜列表 -->
							<view class="search-hot-item" v-for="(item,index) in searchHot" :key="index"
								@tap="handleToWord(item.searchWord)">
								<view class="search-hot-top">{{index+1}}</view>
								<view class="search-hot-word">
									<view class="search-hot-word-title">
										{{item.searchWord}}
										<image :src="item.iconUrl" mode="aspectFit"></image>
										<view class="search-hot-word-detail">{{item.content}}</view>
									</view>
								</view>
								<text class="search-hot-count">{{item.score | formatCount}}</text>
								<image class="search-hot-img" src="../../static/hot.png" mode=""></image>
							</view>
						</view>
					</view>
				</block>

				<!-- 搜索板块2 -->
				<block v-else-if="searchType == 2">
					<view class="search-result">
						<view class="search-result-item" v-for="(item,index) in searchList" :key="index" @tap="handleToDetail(item.id)">
							<view class="search-result-item-word">
								<view class="search-result-item-word-title">{{item.name}}</view>
								<view class="search-result-item-word-name">{{item.artists[0].name}}</view>
							</view>
							<text class="iconfont icon-bofang1"></text>
						</view>
					</view>
				</block>
				
				<!-- 搜索提示 -->
				<block v-else-if="searchType == 3">
					<view class="search-tips">
						<view class="search-tips-head">搜索“{{searchWord}}”</view>
						<view class="search-tips-item" v-for="(item,index) in searchTips" :key="index" @tap="handleToWord(item.keyword)">
							<text class="iconfont icon-sousuo"></text>
							{{item.keyword}}
						</view>
					</view>
				</block>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	// 引入css文件
	import '@/common/iconfont.css'
	import musicHead from '../../components/musichead/musichead.vue'
	import {
		searchHot,
		searchSuggest,
		searchWord
	} from '../../common/api.js'
	export default {
		data() {
			return {
				// 搜索热词
				searchHot: [],
				// 搜索框输入关键词
				searchWord: '',
				// 搜索记录
				searchHistory: [],
				// 板块切换标记
				searchType: 1,
				// 搜索结果
				searchList: [],
				// 搜索提示
				searchTips:[],
			}
		},
		methods: {
			// 点击相关热门搜索后,输入框获取到关键词
			handleToWord(word) {
				// console.log("获取热门成功:",word);
				this.searchWord = word;
				this.handleToSearchList()
				// console.log("searchWord赋值成功:",this.searchWord);
			},
			// 记录搜索历史
			handleToSearchList() {
				// console.log("关键词已记录历史搜索记录:",this.searchWord);
				this.searchHistory.unshift(this.searchWord);
				// 去除重复记录
				this.searchHistory = [...new Set(this.searchHistory)];
				// 保持搜索历史记录有10个
				if (this.searchHistory.length > 10) {
					this.searchHistory.length = 10;
				};
				// console.log("搜索历史:",this.searchHistory);
				// 历史记录本地缓存
				uni.setStorage({
					key: 'historyList',
					data: this.searchHistory,
				});
				// 发起搜索请求
				this.getSearchList(this.searchWord);
			},
			// 清空搜索历史记录
			handleToClear() {
				uni.removeStorage({
					key: 'historyList',
					success: () => {
						this.searchHistory = [];
					}
				});
			},
			// 获取搜索结果
			getSearchList(word) {
				// console.log("获取搜索词成功:",word);
				searchWord(word).then((res) => {
					if (res[1].data.code == 200) {
						// console.log("发送搜索请求成功:", res);
						this.searchList = res[1].data.result.songs;
						// console.log("请求搜索数据返回成功:", this.searchList);
						this.searchType = 2;
					}
				})
			},
			// 清空输入框
			handleToClose() {
				this.searchWord = '';
				this.searchType = 1;
			},
			// 跳转至详情页
			handleToDetail(songID){
				// console.log("获取songID成功:",songID);
				uni.navigateTo({
					url:'/pages/detail/detail?songID='+songID,
				});
			},
			// 实时搜索提示
			handleToTips(e){
				// console.log("触发事件:",e);
				let value = e.detail.value;
				// console.log('获取当前输入成功:',value);
				if ( !value ) {
					this.searchType = 1;
					return;
				}
				searchSuggest(value).then((res)=>{
					// console.log(res);
					if (res[1].data.code == 200) {
						this.searchTips = res[1].data.result.allMatch;
						// console.log("搜索提示获取成功:",this.searchTips);
						this.searchType = 3;
					}
				})
			},
		},
		components: {
			musicHead
		},
		onLoad() {
			searchHot().then((res) => {
				// 热词结果
				// console.log(res);
				if (res[1].data.code == 200) {
					// console.log("获取数据成功");
					this.searchHot = res[1].data.data;
					// console.log("获取热门搜索列表成功:", this.searchHot);
				}
			});
			// 读取本地缓存的搜索记录
			uni.getStorage({
				key: 'historyList',
				success: (res) => {
					this.searchHistory = res.data;
				}
			});
		}
	}
</script>

<style scoped>
	/* 搜索框布局 */
	.search-search {
		background-color: lightgray;
		display: flex;
		align-items: center;
		height: 70rpx;
		margin: 70rpx 30rpx 30rpx 30rpx;
		border-radius: 50rpx;
	}

	.search-search text {
		font-size: 30rpx;
		margin-right: 26rpx;
		margin-left: 28rpx;
	}

	.search-search input {
		font-size: 30rpx;
		flex: 1;
	}

	/* 搜索历史样式 */
	.search-history {
		margin: 0 30rpx 50rpx 30rpx;
		/* background-color: bisque; */
		font-size: 26rpx;
	}

	.search-history-head {
		display: flex;
		justify-content: space-between;
		margin-bottom: 20rpx;
	}


	.search-history-list {
		display: flex;
		flex-wrap: wrap;
		/* background-color: #878787; */
	}

	.search-history-list view {
		padding: 16rpx 28rpx;
		background-color: lightgray;
		border-radius: 40rpx;
		margin-right: 30rpx;
		margin-bottom: 30rpx;
	}

	/* 搜索热榜样式 */
	.search-hot {
		/* background-color: antiquewhite; */
	}

	.search-hot-head {
		margin-bottom: 36rpx;
	}

	.search-hot-item {
		display: flex;
		align-items: center;
		margin-bottom: 58rpx;
		/* background-color: #fb2222; */
	}

	.search-hot-top {
		color: #fb2222;
		width: 60rpx;
		margin-left: 8rpx;

	}

	.search-hot-word {
		font-size: 30rpx;
		flex: 1;
	}

	.search-hot-word image {
		width: 38rpx;
		height: 28rpx;
	}

	.search-hot-word-title {
		font-size: 30rpx;
		color: black;
	}

	.search-hot-word-detail {
		font-size: 24rpx;
		color: #878787;
	}

	.search-hot-head {}

	.search-hot-count {
		color: #878787;
		margin-right: 10rpx;
	}

	.search-hot-bottom {}

	.search-hot-img {
		/* width: 3rpx; */
		height: 30rpx;
		width: 30rpx;
	}

	/* 搜索结果样式 */
	.search-result {
		border-top: 2px darkgrey solid;
		padding: 30rpx;
		/* background-color: #878787; */
	}

	.search-result-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: aliceblue;
		padding-bottom: 30rpx;
		margin-bottom: 30rpx;
		border-bottom: 2px darkgrey solid;

	}

	.search-result-item-word {
		flex: 1;
	}

	.search-result-item-word-title {
		font-size: 28rpx;
		color: steelblue;
		margin-bottom: 4rpx;
	}

	.search-result-item-word-name {
		font-size: 24rpx;
		color: #898989;
	}

	.search-result-item text {
		font-size: 50rpx;
	}
	
	/* 搜索提示样式 */
	.search-tips{
		border-top: 2px darkgrey solid;
		padding: 30rpx;
		font-size: 26rpx;
	}
	
	.search-tips-head{
		color: steelblue;
		margin-bottom: 36rpx;
	}
	
	.search-tips-item{
		color: black;
		margin-bottom: 38rpx;
	}
	
	.search-tips-item text{
		color:gray; 
		font-size:26rpx; 
		margin-right:26rpx;
	} 
</style>
