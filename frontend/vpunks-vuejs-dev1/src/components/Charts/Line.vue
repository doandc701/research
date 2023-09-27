<template>
  <div :id="id" :class="className" :style="{height:height,width:width}" style="margin-bottom:-20px;" />
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'
import { nativeToken } from '@/settings'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '200px'
    },
    height: {
      type: String,
      default: '200px'
    },
    auction: {
      type: Object,
      default: null
    },
    currentPrice: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      // general
      debug: false,
      nativeToken: nativeToken,
      chart: null,
      currentPriceV: null
    }
  },
  watch: {
    // This would be called anytime the value of title changes
    currentPrice(newValue, oldValue) {
      this.currentPriceV = window.web3.utils.fromWei(newValue, 'ether')
      if (newValue !== oldValue) this.updateChart()
    }
  },
  mounted() {
    this.initChart()
  },
  beforeDestroy() {
    if (!this.chart) return
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))
      this.debug && console.log('initChart', this.auction)
      const datasets = { time: [], price: [] }
      const maxColumn = 20
      // calculate step for time
      const _duration = this.auction.duration / 60// seconds to minutes (min:1 - max:uint64)
      let step = _duration <= 20 ? 1 : (_duration <= 30 ? 2 : Math.round(_duration / maxColumn))
      this.debug && console.log('auction.duration - min:', _duration, 'step', step)
      let i = 0
      let helper = _duration
      while (helper > 0) {
        datasets.time[i] = helper
        helper -= step
        i++
      }
      // use Number and not BN because the text can be too long
      const _startingPrice = Number(window.web3.utils.fromWei(this.auction.startingPrice, 'ether'))
      const _endingPrice = Number(window.web3.utils.fromWei(this.auction.endingPrice, 'ether'))
      const priceRange = _startingPrice - _endingPrice
      this.currentPriceV = window.web3.utils.fromWei(this.auction.currentPrice, 'ether')
      // calculate step for price
      step = priceRange / datasets.time.length
      i = 0
      helper = _startingPrice
      while (helper > _endingPrice) {
        const price = _startingPrice - (step * i)
        // round number down to two decimal places
        // price = Math.round(price * 100) / 100
        datasets.price[i] = price
        helper -= step
        i++
      }
      // add final values
      datasets.time.push(0)
      datasets.price.push(_endingPrice)

      //
      this.chart.setOption({
        // backgroundColor: '#c2c2c2',
        title: {
          top: 20,
          text: 'Price',
          textStyle: {
            fontWeight: 'normal',
            fontSize: 12
          },
          left: '1%'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              color: '#57617B'
            }
          }
        },
        legend: {
          top: 20,
          icon: 'rect',
          itemWidth: 14,
          itemHeight: 5,
          itemGap: 13,
          data: [`Price [${nativeToken}]`],
          right: '4%',
          textStyle: {
            fontSize: 12
            // color: '#F1F1F3'
          }
        },
        xAxis: [{
          name: 'Time [Minutes]',
          nameLocation: 'middle',
          nameTextStyle: {
            padding: [12, 0, 0, 0]
          },

          type: 'category',
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: '#57617B'
            }
          },
          data: datasets.time
        }],
        yAxis: {
          type: 'value',
          axisTick: {
            show: false
          }
        },
        series: {
          name: `Price [${nativeToken}]`,
          type: 'line',
          symbol: 'circle',
          symbolSize: 5,
          showSymbol: false,
          lineStyle: {
            normal: {
              width: 1
            }
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(0, 136, 212, 0.3)'
              }, {
                offset: 0.8,
                color: 'rgba(0, 136, 212, 0)'
              }], false),
              shadowColor: 'rgba(0, 0, 0, 0.1)',
              shadowBlur: 10
            }
          },
          itemStyle: {
            normal: {
              color: 'rgb(0,136,212)',
              borderColor: 'rgba(0,136,212,0.2)',
              borderWidth: 12
            }
          },
          markLine: {
            data: [
              {
                name: `${this.currentPriceV} ${nativeToken}`,
                type: 'average',
                yAxis: this.currentPriceV,
                label: {
                  formatter: '{b}',
                  position: 'middle'
                }
              }
            ]
          },
          data: datasets.price
        }
      })
    },
    updateChart() {
      this.chart.setOption({
        series: [{
          markLine: {
            data: [
              {
                name: `${this.currentPriceV} ${nativeToken}`,
                type: 'average',
                yAxis: this.currentPriceV,
                label: {
                  formatter: '{b}',
                  position: 'middle'
                }
              }
            ]
          }
        }]
      })
    }
  }
}
</script>
