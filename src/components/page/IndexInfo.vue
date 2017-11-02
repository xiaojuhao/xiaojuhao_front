<template>
    <div>
        <button @click="change">点击</button>
    </div>
</template>
<script>
export default {
	methods:{
		change(){
			// if(this.$store.state.sideBarOppened){
			// 	this.$store.state.sideBarOppened = false;
			// }else{
			// 	this.$store.state.sideBarOppened = true;
			// }
			//console.log(this.$store.state.sideBarOppened)
			//this.$store.commit('toggleSideBarOppened')
			this.$store.dispatch('changeState',true)
		}
	}
}
</script>