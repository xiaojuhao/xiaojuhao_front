<template>
    <div class="subdiv chart-div" style="width: 90%;height:450px;">
        <div id="recipesDailyChartsId" class="recipesDailyChartsId" style="width: 100%;height:450px;"></div>
    </div>
</template>
<script>
import { api } from '../common/bus'
import echarts from 'echarts/lib/echarts';
// 引入柱状图
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/toolbox';
import 'echarts/lib/component/markPoint';
import 'echarts/lib/component/tooltip';
export default {
    data() {
        return {
            titleX: "",
            recipes: '',
            saleData: [],
            saleDays: []
        }
    },
    mounted() {
        console.log(this.$data)
        this.myChart = echarts.init(document.querySelector('.recipesDailyChartsId'));
        api.lastSevenDaysSaleData({
                recipesCode: this.$route.query.code,
                storeCode: this.$route.query.store
            })
            .then((val) => {
                this.saleData = val.saleNums;
                this.saleDays = val.saleDays;
                this.titleX = val.storeName;
                this.recipes = val.recipesName;
                this.initData();
            })

    },
    methods: {
        initData() {
            let option = {
                title: {
                    text: this.titleX + "(" + this.recipes + ")"
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['销售数量']
                },
                toolbox: {
                    show: true,
                    feature: {
                        dataZoom: {
                            yAxisIndex: 'none'
                        },
                        dataView: { readOnly: false },
                        magicType: { type: ['line', 'bar'] },
                        restore: {},
                        saveAsImage: {}
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: this.saleDays
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value} 份'
                    }
                },
                series: [{
                    name: '销售数量',
                    type: 'line',
                    label: {
                        normal: { show: true }
                    },
                    data: this.saleData
                }]
            };

            this.myChart.setOption(option);
        }
    }
}
</script>