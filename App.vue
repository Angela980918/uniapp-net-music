<script>
	export default {
		onLaunch: function() {
			
		},
		onShow: function() {
			
		},
		onHide: function() {
			
		}
	}
</script>

<style>
	/*每个页面公共css */
	.container {
		width: 100%;
		/* 高度需要计算，要减去顶部的位置 */
		height: calc(100vh - 70px);
		overflow: hidden;
	}
	
	.container scroll-view {
		height: 100%;
	}
	
	/* 歌曲列表背景图 */
	.backgroundImg{
		width: 100%;
		height: 100vh;
		position: fixed;
		left: 0;
		top: 0;
		/* background-image: url(./static/logo.jpg); */
		background-size: cover;
		background-position: center 0;
		/* 背景模糊以及毛边框特效 */
		filter: blur(10px);
		transform: scale(1.2);
	}
</style>
