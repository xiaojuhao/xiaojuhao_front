<template>
    <div class="container" id="app">
        <div class="header-line">
            <h4>系统消息通知栏</h4>
        </div>
        <div style="margin-left: 40px; margin-bottom: 40px;">
            <table border="1" bordercolor="#a0c6e5" style="border-collapse: collapse; min-width: 80%">
                <tr v-for="item in messages" :key="item.id" >
                    <td align="center" style="width:50px;">{{item.id}}</td>
                    <td style="width:100px;">{{item.title}}</td>
                    <td>{{item.content}}</td>
                    <td>{{formatDate(item)}}</td>
                </tr>
            </table>
        </div>
        <div style="margin-left: 40px; margin-bottom: 40px;"></div>
    </div>
    </div>
</template>
<script>
import { api, util } from '../common/bus'
export default {
    data() {
        return {
            messages: []
        }
    },
    methods: {
        formatDate(item) {
            return util.formatDate(item.gmtCreated);
        }
    },
    mounted() {
        api.getNoticePage({})
            .then((page) => {
                this.messages = page.values;
            })
    }
}
</script>
<style scoped>
.container {
    width: 80%;
    border: solid 0px blue;
    margin: 0 auto 0 auto;
}

.header-line {
    margin: auto;
    margin-left: 40px;
    margin-bottom: 10px;
}

.query {
    margin-left: 20px;
}

.spaceline {
    display: inline-block;
    width: 20px;
}

.newline {
    margin-top: 10px;
}

tr {
    height: 30px;
}
</style>