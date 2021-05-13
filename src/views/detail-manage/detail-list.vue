<template>
  <div>
    <div class="filter-container">
      <el-input v-model="listQuery.service_name" placeholder="服务商名称" style="width: 300px" class="filter-item" />
      <el-input v-model="listQuery.hotel_name" placeholder="酒店名称" style="width: 300px;margin-left:10px" class="filter-item" />
      <span class="filter-item">
        <span class="select-title">时间范围：</span>
        <el-date-picker v-model="dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" 
        end-placeholder="结束日期" style="width: 280px"  value-format="yyyy-MM-dd" :default-time="['00:00:00', '23:59:59']">
        </el-date-picker>
      </span>
      <el-button class="filter-item" type="primary" size="mini" icon="el-icon-search" @click="handleFilter" style="margin-left:20px">搜索</el-button>
      <el-button class="filter-item" type="success" size="mini" icon="el-icon-refresh" @click="refresh">刷新</el-button>
    </div> 
    <div class="filter-container" style="margin:5px 0px">
        <div class="right-font">
          <span  style="margin-right:10px">统计：</span>
          <!-- <span  style="margin-right:10px">服务商：<span class="top-num">50</span>个</span> -->
          <span  style="margin-right:10px">佣金：<span class="top-num">￥{{totalData.commission_sum}}</span>元</span>
        </div>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;" >
      <el-table-column label="ID" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="服务商名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.service_name }}</span>
        </template>
      </el-table-column>
     <el-table-column label="酒店名称" align="left">
            <template slot-scope="{row}">
                <span>{{ row.hotel_name }}</span>
            </template>
        </el-table-column>
    <el-table-column label="类型" align="center" >
        <template slot-scope="{row}">
          <span>{{ row.rate_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="佣金" align="center" >
        <template slot-scope="{row}">
          <span>{{ row.moneys }}</span>
        </template>
      </el-table-column>
       <el-table-column label="获取时间" align="center" >
        <template slot-scope="{row}">
          <span>{{ row.create_time }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="paginHandle" />
  </div>
</template>

<script>
import { getCommissionList } from '@/api/service-manage/service-list'
import Pagination from '@/components/Pagination'
import mix from '@/mixs/mix'
export default {
  components: { Pagination },
  mixins: [mix],
  data() {
    return {
      listQuery: {
        hotel_name:'',
        service_name:'',
        start_time:'',
        end_time:'',
        page: 1,
        size: 20
      },
      total: 0,
      listLoading: false,
      list: [],
      multipleSelection: [],
      btnAry:[],
      loadingSearch:false,
      memberList:[],
      dateRange:[],
      totalData: {
        commission_sum: 0, 
        commission_count: 0
      }
    }
  },
  mounted () {
    this.getList();
  },
  methods: {
    // 获取列表
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
        this.totalData = res.data.totalData
        this.listLoading = false
      })
    },
    //刷新
    refresh(){
      this.listQuery = {
        hotel_name:'',
        service_name:'',
        start_time:'',
        end_time:'',
        page: 1,
        size: 20
      }
      this.dateRange = []
      this.getList();
    },
    // 搜索会员
    remoteMethod(query) {
      if (query !== '') {
        this.loadingSearch = true
        getSearchMemberList({ keyword: query, page: 1, size: 20,}).then(res => {
          this.loadingSearch = false
          this.memberList = res.data.data
        })
      } else {
        this.memberList = []
      }
    },
    // 点击翻页
    paginHandle(val) {
      if (val != undefined) {
        const json = JSON.parse(JSON.stringify(val))
        this.listQuery.page = parseInt(json.page)
        this.listQuery.size = parseInt(json.limit)
      }
      this.getList()
    },
    //搜索
    handleFilter(){
      this.listQuery.page = 1
      this.getList()
    },
  }
}
</script>

<style lang="scss" scoped>
.heder-img{
  width: 24px;
  height: 24px;
  vertical-align: middle;
}
.member-name{
  vertical-align: middle;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-left: 5px;
}
.color-text{
  color: red;
  margin-right: 5px;
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
