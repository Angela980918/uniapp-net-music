import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
	state:{
		topListIDs:[],
		nextID:'',
	},
	mutations:{
		INIT_TOPLISTIDS(state,playload){
			state.topListIDs = playload;
		},
		NEXT_ID(state,playload){
			for (var i = 0; i < state.topListIDs.length; i++) {
				if (state.topListIDs[i].id == playload) {
					state.nextID = state.topListIDs[i+1].id;
				}
			}
		}
	}
});