<template>
    <div class="container" id="app">
        <div class="header-line">
            <h4>系统消息通知栏</h4>
        </div>
        <div style="margin-left: 40px; margin-bottom: 40px;">
            <table border="1" bordercolor="#a0c6e5" style="border-collapse: collapse; min-width: 80%">
                <tr v-for="item in messages">
                    <td align="center" style="width:50px;">{{item.id}}</td>
                    <td style="width:100px;">{{item.type}}</td>
                    <td>测试测试！！！{{item.message}}</td>
                    <td>2017-11-11</td>
                </tr>
            </table>
        </div>
        <div style="margin-left: 40px; margin-bottom: 40px;"></div>
    </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            messages: [ //messages
                {
                    id: 1,
                    type: "库存警告",
                    message: '常州仓库三文鱼库存不足100，请及时补货'
                },
                {
                    id: 2,
                    type: "库存警告",
                    message: '常州仓库三文鱼库存不足100，请及时补货'
                },
                {
                    id: 4,
                    type: "库存警告",
                    message: '常州仓库三文鱼库存不足100，请及时补货'
                },
                {
                    id: 5,
                    type: "库存警告",
                    message: '常州仓库三文鱼库存不足100，请及时补货'
                },
                {
                    id: 6,
                    type: "库存警告",
                    message: '常州仓库三文鱼库存不足100，请及时补货'
                },
                {
                    id: 31,
                    type: "库存警告",
                    message: '常州仓库三文鱼库存不足100，请及时补货'
                },
                {
                    id: 32,
                    type: "库存警告",
                    message: '常州仓库三文鱼库存不足100，请及时补货'
                }
            ]
        }
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