<template>
    <div class="table">
        {{message}}
    </div>
</template>

<script>
    export default {
        data() {
            return {
                message:"暂时没有系统设置需求"
            }
        },
        mounted() {
            const h = this.$createElement;
            this.$notify({
              title: '系统提示',
              message: h('i', { style: 'color: teal'}, '暂时没有系统设置需求'),
              offset:60
            });
        }
    }
</script>

<style scoped>
.handle-box{
    margin-bottom: 0px;
}
.handle-select{
    width: 120px;
}
.handle-input{
    width: 300px;
    display: inline-block;
}
</style>