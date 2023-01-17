import { baseUrl } from './config.js'

/**
 * 歌曲榜单
 */
export function topList(){
	// 只截取前4个榜单
	var listIds = ['3', '0', '2', '1'];
	return new Promise(function(resolve,reject){
		uni.request({
			url:`${baseUrl}/toplist/detail`,
			method:'GET',
			success:res => {
				// console.log(res);
				let result = res.data.list;
				result.length = 4;
				// for(let i = 0;i<result.length;i++){
				// 	result[i].listId = listIds[i];
				// }                                                                                
				// console.log('歌曲列表数据：',result);
				resolve(result);
			},
			fail:(err) => {
				console.log(err);
			},
			complete: () => { },
		})
	})	
}

// 获取歌单列表
export function ListItem(listID){
	return uni.request({
		url:`${baseUrl}/playlist/detail?id=${listID}`,
		method:'GET',
	})
}

// 获取歌曲信息
export function songDetail(songID){
	return uni.request({
		url:`${baseUrl}/song/detail?ids=${songID}`,
		method:'GET',
	})
}

// 获取相似音乐
export function songSimi(songID){
	return uni.request({
		url:`${baseUrl}/simi/song?id=${songID}`,
		method:'GET',
	})
}

// 获取歌曲歌词
export function songLyric(songID){
	return uni.request({
		url:`${baseUrl}/lyric?id=${songID}`,
		method:'GET',
	})
}

// 获取歌曲相关评论，评论数为limit（limit默认值为20）
export function songComment(songID){
	return uni.request({
		url:`${baseUrl}/comment/music?id=${songID}`,
		method:'GET',
	})
}

// 获取歌曲URL
export function songUrl(songID){
	return uni.request({
		url:`${baseUrl}/song/url?id=${songID}`,
		method:'GET',
	})
}

// 获取搜索热词 
export function searchHot(){
	return uni.request({
		url:`${baseUrl}/search/hot/detail`,
		method:'GET',
	})
}

// 关键词->搜索
export function searchWord(keyword){
	return uni.request({
		url:`${baseUrl}/search?keywords=${keyword}`,
		method:'GET',
	})
}

// 搜索建议
export function searchSuggest(keyword){
	return uni.request({
		url:`${baseUrl}/search/suggest?keywords=${keyword}&type=mobile`,
		method:'GET',
	})
}
