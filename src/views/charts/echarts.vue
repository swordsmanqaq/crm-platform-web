<template>
  <section class="chart-container">
    <el-row>
      <el-col :span="12">
        <div id="chartColumn" style="width:100%; height:400px;"></div>
      </el-col>
      <el-col :span="12">
        <div id="chartBar" style="width:100%; height:400px;"></div>
      </el-col>
      <el-col :span="12">
        <div id="chartLine" style="width:100%; height:400px;"></div>
      </el-col>
      <el-col :span="12">
        <div id="chartPie" style="width:100%; height:400px;"></div>
      </el-col>
      <el-col :span="24">
        <a href="http://echarts.baidu.com/examples.html" target="_blank" style="float: right;">more>></a>
      </el-col>
    </el-row>
  </section>
</template>

<script>
import echarts from 'echarts'

export default {
  data() {
    return {
      chartColumn: null,
      chartBar: null,
      chartLine: null,
      chartPie: null
    }
  },

  methods: {
    drawColumnChart() {
      this.chartColumn = echarts.init(document.getElementById('chartColumn'));
      this.chartColumn.setOption({
        title: {text: '每栋人数'},
        tooltip: {},
        xAxis: {
          data: ["一栋", "二栋", "三栋", "四栋", "五栋", "六栋"]
        },
        yAxis: {},
        series: [{
          name: '销量',
          type: 'bar',
          data: [1, 2, 4, 1, 1, 2]
        }]
      });
    },

    drawBarChart() {
      this.chartBar = echarts.init(document.getElementById('chartBar'));
      this.chartBar.setOption({
        title: {
          text: '小区人员总数',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['2022年', '2023年']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01]
        },
        yAxis: {
          type: 'category',
          data: ['安保人数', '保洁人数', '物业人数', '住户总人数']
        },
        series: [
          {
            name: '2022年',
            type: 'bar',
            data: [3, 10, 5, 10]
          },
          {
            name: '2023年',
            type: 'bar',
            data: [5, 15, 8, 11]
          }
        ]
      });
    },

    // drawLineChart() {
    //   this.chartLine = echarts.init(document.getElementById('chartLine'));
    //   this.chartLine.setOption({
    //     title: {
    //       text: 'Line Chart'
    //     },
    //     tooltip: {
    //       trigger: 'axis'
    //     },
    //     legend: {
    //       data: ['邮件营销', '联盟广告', '搜索引擎']
    //     },
    //     grid: {
    //       left: '3%',
    //       right: '4%',
    //       bottom: '3%',
    //       containLabel: true
    //     },
    //     xAxis: {
    //       type: 'category',
    //       boundaryGap: false,
    //       data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    //     },
    //     yAxis: {
    //       type: 'value'
    //     },
    //     series: [
    //       {
    //         name: '邮件营销',
    //         type: 'line',
    //         stack: '总量',
    //         data: [120, 132, 101, 134, 90, 230, 210]
    //       },
    //       {
    //         name: '联盟广告',
    //         type: 'line',
    //         stack: '总量',
    //         data: [220, 182, 191, 234, 290, 330, 310]
    //       },
    //       {
    //         name: '搜索引擎',
    //         type: 'line',
    //         stack: '总量',
    //         data: [820, 932, 901, 934, 1290, 1330, 1320]
    //       }
    //     ]
    //   });
    // },

    // drawPieChart() {
    //   this.chartPie = echarts.init(document.getElementById('chartPie'));
    //   this.chartPie.setOption({
    //     title: {
    //       text: '小区绿化面积',
    //       x: 'center'
    //     },
    //     tooltip: {
    //       trigger: 'item',
    //       formatter: "{a} <br/>{b} : {c} ({d}%)"
    //     },
    //     legend: {
    //       orient: 'vertical',
    //       left: 'left',
    //       data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
    //     },
    //     series: [
    //       {
    //         name: '访问来源',
    //         type: 'pie',
    //         radius: '55%',
    //         center: ['50%', '60%'],
    //         data: [
    //           {value: 335, name: '直接访问'},
    //           {value: 310, name: '邮件营销'},
    //           {value: 234, name: '联盟广告'},
    //           {value: 135, name: '视频广告'},
    //           {value: 1548, name: '搜索引擎'}
    //         ],
    //         itemStyle: {
    //           emphasis: {
    //             shadowBlur: 10,
    //             shadowOffsetX: 0,
    //             shadowColor: 'rgba(0, 0, 0, 0.5)'
    //           }
    //         }
    //       }
    //     ]
    //   });
    // },

    drawCharts() {
      this.drawColumnChart()
      this.drawBarChart()
      this.drawLineChart()
      this.drawPieChart()
    },
  },

  mounted: function () {
    this.drawCharts()
  },
  updated: function () {
    this.drawCharts()
  }
}
</script>

<style scoped>
.chart-container {
  width: 100%;
  float: left;
}

.el-col {
  padding: 30px 20px;
}
</style>
