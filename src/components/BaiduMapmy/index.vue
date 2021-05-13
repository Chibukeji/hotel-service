<template>
  <div>
    <el-dialog :visible.sync="mapDialogVisible" title="获取坐标" width="50%">
      <el-form>
        <el-row :gutter="24">
          <el-col :span="24">
            <el-col :span="12">
              <el-form-item label="经度" prop="lng">
                <el-input
                  v-model="model.lng"
                  type="number"
                  class="input_number"
                  @mousewheel.native.prevent
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="纬度" prop="lat">
                <el-input
                  v-model="model.lat"
                  type="number"
                  class="input_number"
                  @mousewheel.native.prevent
                />
              </el-form-item>
            </el-col>
            <div style="margin-bottom:15px">
              <el-input v-model="model.address" placeholder="搜索地点" style="margin-left: 10px;width: 200px;" />
              <el-button size="small" type="primary" style="height:36px" class="el-icon-search" @click="searchMap">搜索</el-button>
            </div>
            <el-col :span="24">
              <baidu-map
                class="bm-view"
                ak="QFgFQorrB84maOZh0pPGC8kUiP0mGIhx"
                :center="center"
                :zoom="zoom"
                :scroll-wheel-zoom="true"
                @ready="createMap"
              >
                <!-- 搜索-->
                <bm-local-search :keyword="searchAddress" :auto-viewport="true" style="display: none" />
                <!--标记-->
                <bm-marker :position="{lng: model.lng, lat: model.lat}" />
              </baidu-map>
            </el-col>
          </el-col>
        </el-row>
      </el-form>
      <div class="dialog-bottom-btn">
        <el-button size="small" @click="mapDialogVisible = false">取消</el-button>
        <el-button size="small" type="primary" @click="sureHandle">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
//   import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
//   import BmLocalSearch from 'vue-baidu-map/components/map/Map.vue'
import { BaiduMap, BmMarker, BmLocalSearch } from 'vue-baidu-map'
export default {
  components: {
    BaiduMap,
    BmMarker,
    BmLocalSearch
  },
  data() {
    return {
      center: { lng: 0, lat: 0 },
      zoom: 10,
      model: {
        lng: '',
        lat: '',
        address: ''
      },
      mapDialogVisible: false,
      searchAddress: ''
    }
  },
  methods: {
    init() {
      this.mapDialogVisible = true
    },
    createMap({ BMap, map }) {
      // 百度地图API功能
      this.center.lng = 108.3
      this.center.lat = 22.8
      this.zoom = this.zoom
      this.map2 = map
      const viewthis = this
      map.addEventListener('click', function(e) {
        viewthis.model.lng = e.point.lng
        viewthis.model.lat = e.point.lat
      })
    },
    // 点击搜索
    searchMap() {
      this.searchAddress = this.model.address
    },
    // 点击确定
    sureHandle() {
      this.mapDialogVisible = false
      this.$emit('getCoordinate', this.model)
    }
  }
}
</script>
<style lang="scss" scoped>
  .bm-view {
    width: 100%;
    height: 400px;
  }
  /deep/.el-form-item__content{
    flex: 1;
  }
  /deep/.el-form-item{
    display: flex;
  }
  .dialog-bottom-btn{
    text-align: center;
    margin-top: 30px;
  }
</style>
