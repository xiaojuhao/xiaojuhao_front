<template>
    <div>
        {{url}}
    </div>
</template>
<script>
	export default {
		data(){
			return {
				url:location.href
			}
		}
	}
</script>