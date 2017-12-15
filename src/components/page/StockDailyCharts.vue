<template>
    <div class="subdiv chart-div" style="width: 90%;height:450px;">
        <div id="stockDailyChartsId" class="stockDailyChartsId" style="width: 100%;height:450px;"></div>
        <div style="text-align:center">
            <el-button @click="returnBack" >返回</el-button>
        </div>
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
            stockData: [],
            saleDays: [],
            stockUnit:''
        }
    },
    mounted() {
        this.myChart = echarts.init(document.querySelector('.stockDailyChartsId'));
        api.queryRecentDaysTendency({
                cabinCode: this.$route.query.cabin,
                materialCode: this.$route.query.mcode
            })
            .then((val) => {
                this.saleData = val.saleData;
                this.stockData = val.stockData;
                this.saleDays = val.daysData;
                this.titleX = val.cabinName;
                this.stockUnit = val.stockUnit;
                this.recipes = val.materialName;
                this.initData();
            })

    },
    methods: {
    	returnBack(){
    		this.$router.go(-1)
    	},
        initData() {
            let option = {
                title: {
                    text: this.titleX + "(" + this.recipes + ")"
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['销售数量','库存数量']
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
                        formatter: '{value} '+this.stockUnit
                    }
                },
                series: [{
                    name: '销售数量',
                    type: 'line',
                    label: {
                        normal: { show: true }
                    },
                    data: this.saleData
                },{
                    name: '库存数量',
                    type: 'line',
                    label: {
                        normal: { show: true }
                    },
                    data: this.stockData
                }]
            };

            this.myChart.setOption(option);
        }
    }
}
</script>