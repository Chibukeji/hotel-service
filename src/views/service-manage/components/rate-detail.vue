<template>
  <div>
    <el-dialog :visible.sync="detailDialogVisible" :title="dialogTitle" width="95%" class="center-dialog">
      <div class="filter-container">
          <span class="filter-item" style="margin-right:20px">
              <span class="select-title">时间：</span>
              <el-date-picker v-model="dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" 
              end-placeholder="结束日期" style="width: 280px"  value-format="yyyy-MM-dd" :default-time="['00:00:00', '23:59:59']">
              </el-date-picker>
          </span>
          <el-button class="filter-item" type="primary" size="mini" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      </div>
      <div class="filter-container" style="margin:5px 0px">
          <div class="right-font">
              <span  style="margin-right:10px">统计：</span>
              <span  style="margin-right:10px">佣金：<span class="top-num">￥{{totalData.commission_sum}}</span>元</span>
          </div>
      </div>
      <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;">
        <el-table-column label="ID" align="center" width="80">
          <template slot-scope="{row}">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="类型" align="center">
          <template slot-scope="{row}">
            <span>{{ row.rate_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="佣金" align="center">
          <template slot-scope="{row}">
            <span>{{ row.moneys }}</span>
          </template>
        </el-table-column>
        <el-table-column label="获取时间" align="center">
          <template slot-scope="{row}">
            <span>{{ row.create_time }}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="paginHandle" />
    </el-dialog>
  </div>
</template>

<script>
import { getCommissionList } from '@/api/service-manage/service-list'
import Pagination from '@/components/Pagination'
export default {
  components: { Pagination },
  data() {
    return {
      dialogTitle: '',
      detailDialogVisible: false,
      activeName: 'first',
      detailItem: '',
      dateRange: [],
      listQuery: {
        service_ids:'',
        hotel_ids:'',
        start_time:'',
        end_time:'',
        page: 1,
        size: 10
      },
      total: 0,
      list: [],
      listLoading: false,
      commissions_sum:0,
      dateRange:[],
      totalData: {
        commission_sum: 0, 
        commission_count: 0
      }
    }
  },
  mounted() {},
  methods: {
    init(params) {
      console.log(params)
      this.detailDialogVisible = true
      this.listQuery.service_ids = params.serviceItem.id
      this.listQuery.hotel_ids = params.hotelItem.id
      this.dialogTitle = `查看[${params.hotelItem.title}]佣金信息`
      this.getList()
    },
    // 获取订单信息
    getList() {
      this.listLoading = true
      if (this.dateRange == null || this.dateRange.length == 0) {
          this.listQuery.start_time = ''
          this.listQuery.end_time = ''
      } else {
          this.listQuery.start_time = this.dateRange[0] 
          this.listQuery.end_time = this.dateRange[1] 
      }
      getCommissionList(this.listQuery).then(res => {
        this.list = res.data.data.data
        this.total = res.data.data.total
        this.commissions_sum = res.data.commissions_sum
        this.totalData = res.data.totalData
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    // 点击翻页
    paginHandle(val) {
      if (val != undefined) {
        const json = JSON.parse(JSON.stringify(val))
        this.listQuery.page = parseInt(json.page)
        this.listQuery.size = parseInt(json.limit)
      }
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
.user-info {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
  .left-box,
  .right-box {
    width: 50%;
    text-align: center;
    .user-header-img {
      width: 120px;
      height: 120px;
      border-radius: 50%;
    }
    .img-no-border{
        border-radius:0;
    }
    .user-name {
      font-size: 14px;
      margin-top: 20px;
    }
    .member-grade {
      margin-top: 20px;
      .btn-grade {
        display: inline-block;
        background-color: #1ab394;
        color: #fff;
        font-size: 10px;
        font-weight: 500;
        padding: 3px 8px;
        text-shadow: none;
        border-radius: 2px;
      }
      .book-coin {
        background-color: #f9f2f4;
        border-radius: 4px;
        color: #ca4440;
        font-size: 14px;
        padding: 2px 4px;
        white-space: nowrap;
      }
    }
    .text-title {
      padding-left: 10px;
      display: inline-block;
    }
    .wrap-box {
      margin-top: 20px;
    }
  }
  .right-box {
    text-align: left;
    .source-btn {
      color: #337ab7;
      cursor: pointer;
    }
  }
  .header-img-pop {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    vertical-align: middle;
  }
}
.margin-left-20{
  margin-left: 20px;
  font-size: 14px;
}
.filter-container{
    display: flex;
    // justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    .right-font{
        // font-size: 14px;
        margin-left: 10px;
        margin-right: 30px;
        .top-num{
            color:red;
            margin-right: 2px;
        }
    }
}
</style>
