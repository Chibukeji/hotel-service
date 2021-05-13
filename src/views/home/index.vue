<template>
  <div class="home-page">
    <div class="left-box">
      <div class="title">
        操作日志
      </div>
      <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;">
        <el-table-column label="ID" align="center" width="80">
          <template slot-scope="{row}">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" :show-overflow-tooltip="true">
          <template slot-scope="{row}">
            <span class="desc-box-div" style="color: #409eff;cursor: pointer;">{{ row.text }}</span>
            <!-- @click="detailHandle(row)" -->
          </template>
        </el-table-column>
        <el-table-column label="时间" align="center" width="200">
          <template slot-scope="{row}">
            <span>{{ row.create_time }}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="paginHandle" />
    </div>
    <div class="right-box">
      <div class="title">
        平台登录
      </div>
      <div class="right-wrap-box">
        <div v-for="(item,index) in menuList" :key="index" class="item link-type" @click="openUrl(item)">{{ item.title }}</div>
      </div>
    </div>
    <!-- 日志详情弹窗 -->
    <el-dialog  :visible.sync="logDialogVisible" title="操作详情"  width="30%">
      <div>{{itemDetail.text}}</div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getPlatforms,getLogList } from '@/api/home'
import { getToken } from '@/utils/auth' // get token from cookie
export default {
  components: { Pagination },
  data() {
    return {
      listQuery: {
        page: 1,
        size: 20
      },
      total: 0,
      listLoading: false,
      list: [
        {
          id: 1
        }
      ],
      menuList: [],
      logDialogVisible:false,
      itemDetail:'',
    }
  },
  mounted() {
    this.getPlatformsList()
    this.getLogList()
  },
  methods: {
    // 获取登录平台
    getPlatformsList() {
      getPlatforms().then(res => {
        this.menuList = res.data
      })
    },
    openUrl(item) {
      // window.open(`http://localhost:9527/#/login?token=${getToken()}`)
      window.open(`${item.url}#/login?token=${getToken()}`)
    },
    //获取操作日志
    getLogList(){
      getLogList(this.listQuery).then(res=>{
        this.list = res.data.data.data
        this.total = res.data.data.total
      })
    },
    paginHandle(val) {
      if (val != undefined) {
        const json = JSON.parse(JSON.stringify(val))
        this.listQuery.page = parseInt(json.page)
        this.listQuery.size = parseInt(json.limit)
      }
      this.getLogList()
    },
    //操作详情
    detailHandle(row){
      this.logDialogVisible = true
      this.itemDetail = row
    }
  }
}
</script>

<style lang="scss" scoped>
.home-page{
  display: flex;
  .left-box{
    width: 75%;
    margin-right: 20px;
    padding-right:20px ;
    .title{
      border-left: 4px solid #409eff;
      padding-left: 10px;
      margin-bottom: 20px;
      font-size: 14px;
    }
  }
  .right-box{
    flex: 1;
    .title{
      border-left: 4px solid #409eff;
      padding-left: 10px;
      margin-bottom: 20px;
      font-size: 14px;
    }
    .right-wrap-box{
      display: flex;
      flex-wrap: wrap;
      .item{
        width: 50%;
        border: 1px solid #dfe6ec;
        padding: 20px 30px;
        text-align: center;
      }
      .item:nth-child(2n+2){
        border-left: none;
      }
      .item:nth-child(n+3){
        border-top: none;
      }
    }
  }
}
/deep/.el-dialog__wrapper {
  overflow: auto; 
}
</style>
