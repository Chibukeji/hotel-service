<template>
  <div>
    <div class="filter-container">
      <el-input v-model="listQuery.keyword" placeholder="服务商名称/服务商地址/联系人/手机号" style="width: 350px" class="filter-item" />
      <span class="filter-item" style="margin-right:20px">
        <span class="select-title">时间：</span>
        <el-date-picker v-model="dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" 
        end-placeholder="结束日期" style="width: 280px"  value-format="yyyy-MM-dd" :default-time="['00:00:00', '23:59:59']">
        </el-date-picker>
      </span>
      <el-button class="filter-item" type="primary" size="mini" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="success" size="mini" icon="el-icon-refresh" @click="refresh">刷新</el-button>
      <el-button v-if="btnAry.findIndex(x => x.id == '658')!=-1" class="filter-item" type="primary" size="mini" icon="el-icon-plus" @click="handleCreate">添加</el-button>
      <el-button v-if="btnAry.findIndex(x => x.id == '659')!=-1" class="filter-item" type="danger" size="mini" icon="el-icon-close" @click="delMore()">删除</el-button>
    </div>
     <div class="filter-container" style="margin:5px 0px">
        <div class="right-font">
          <span  style="margin-right:10px">统计：</span>
          <span  style="margin-right:10px">服务商：<span class="top-num">{{totalData.service_count}}</span>个</span>
          <span  style="margin-right:10px">佣金：<span class="top-num">￥{{totalData.commission_sum}}</span>元</span>
        </div>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column label="ID" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="服务商名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>
       <el-table-column label="绑定会员" align="left"  width="180" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <div style="display:flex">
            <img v-if="row.head_pic == '' || row.head_pic == null" src="../../assets/images/default_author_head.png" class="heder-img">
            <img v-else :src="row.head_pic" class="heder-img">
            <span class="member-name">{{row.nickname}}</span>
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column label="管理酒店" align="center">
        <template slot-scope="{row}">
          <span>{{ row.hotel_name }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="联系人" align="center">
        <template slot-scope="{row}">
          <span>{{ row.link_person }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号码" align="center" >
        <template slot-scope="{row}">
          <span>{{ row.mobile }}</span>
        </template>
      </el-table-column>
      <el-table-column label="佣金" align="center">
        <template slot-scope="{row}">
          <span>{{ row.commissions }}</span>
        </template>
      </el-table-column>
      <el-table-column label="佣金比例" align="center">
        <template slot-scope="{row}">
          <span>{{ row.rate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="关联酒店" align="center">
        <template slot-scope="{row}">
          <span class="link-type" @click="relateHotelList(row)">酒店列表({{row.hotel_num}})</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="350" class-name="fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button type="primary" size="mini"  @click="relateHotel(row)">关联酒店</el-button>
          <el-button v-if="btnAry.findIndex(x => x.id == '659')!=-1" size="mini" type="danger" icon="el-icon-close" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="paginHandle" />
    <el-dialog :visible.sync="editDialogVisible" :title="dialogTitle" class="right-dialog" custom-class="left">
      <el-form ref="editForm" :rules="rules" :model="editForm" label-position="left" label-width="100px" style="width:80%;margin-bottom:50px">
        <el-form-item label="服务商名称" prop="username">
          <el-input v-model="editForm.username" placeholder="请输入服务商名称" />
        </el-form-item>
        <el-form-item label="登录密码" prop="password">
          <el-input v-model="editForm.password" type="password" placeholder="请输入登录密码" />
        </el-form-item>
        <el-form-item label="联系人" prop="link_person">
          <el-input v-model="editForm.link_person" placeholder="请输入联系人" />
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile" placeholder="请输入手机号" oninput="value=value.replace(/[^\d]/g,'')" />
        </el-form-item>
        <!-- <el-form-item label="电子邮箱" prop="email">
          <el-input v-model="editForm.email" placeholder="请输入电子邮箱" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="editForm.address" placeholder="请输入地址" />
        </el-form-item> -->
        <!-- <el-form-item>
          <span slot="label">
            <span style="color:red">*</span>
            <span>管理酒店</span>
          </span>
          <el-button type="primary" size="small" style="margin-right:20px" @click="selectHotel">选择</el-button>
          <span v-for="(item,index) in hotelList" :key="index" class="hotel-name">{{ item.title }}
            <i class="el-icon-close" @click="delHotel(index)" />
          </span>
        </el-form-item> -->
        <el-form-item label="绑定会员" prop="member_id">
           <el-select  v-model="editForm.member_id" filterable clearable remote placeholder="请输入会员昵称搜索"
            :remote-method="remoteMethod" :loading="loadingSearch" style="width:100%">
            <el-option v-for="item in memberList" :key="item.id" :label="item.nickname" :value="item.id">
                <img :src="item.head_pic" style="width:20px;height:20px;vertical-align: middle;margin-right:2px">
                <span style="vertical-align: middle;">{{item.nickname}}(id:{{item.id}})</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="editDialogVisible = false">取消</el-button>
        <el-button size="small" type="primary" @click="submitHandle">确定</el-button>
      </div>
    </el-dialog>
    <!-- 选择酒店弹窗 -->
    <select-hotel ref="selectHotelChild" @getHotelData="getHotelData" />
    <!-- 关联酒店 -->
    <related-hotel ref="relatedHotelChild" @successPoP="successPoP"/>
    <!-- 关联列表 -->
    <related-list ref="relatedListChild" @successPoP="successPoP"/>
  </div>
</template>

<script>
import { getServiceList, getServiceAdd, getServiceEdit, getServiceDel,getAllMemberList } from '@/api/service-manage/service-list'
import Pagination from '@/components/Pagination'
import SelectHotel from './components/SelectHotel'
import RelatedHotel from './components/related-hotel'
import RelatedList from './components/related-list'
import mix from '@/mixs/mix'
export default {
  components: { Pagination, SelectHotel,RelatedHotel,RelatedList },
  mixins: [mix],
  data() {
    var checkPhone = (rule, value, callback) => {
      const reg = /^1[0-9]{10}$/
      if (reg.test(value)) {
        return callback()
      }
      callback('请输入正确的手机号')
    }
    return {
      listQuery: {
        keyword: '',
        start_time:'',
        end_time:'',
        page: 1,
        size: 20
      },
      total: 0,
      listLoading: false,
      list: [],
      multipleSelection: [],
      rules: {
        username: [{ required: true, message: '请输入内容', trigger: 'blur' }],
        password: [{ required: true, message: '请输入内容', trigger: 'blur' }],
        mobile: [{ validator: checkPhone, required: true, message: '请输入正确的手机号码', trigger: 'blur' }],
        address: '',
        link_person: [{ required: true, message: '请输入内容', trigger: 'blur' }],
        email: [{ required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        member_id:[
          { required: true, message: '请选择', trigger: 'change' }
        ],
      },
      editDialogVisible: false,
      dialogTitle: '',
      editForm: {
        username: '',
        password: '',
        mobile: '',
        address: '',
        link_person: '',
        email: '',
        hotel_ids: '',
        member_id:'',
      },
      calendarTypeOptions: [],
      editFlag: '',
      hotelList: [],
      btnAry:[],
      loadingSearch: false,
      memberList: [],
      dateRange:[],
      totalData: {
        commission_sum: 0, 
        service_count: 0
      }
    }
  },
  mounted() {
    this.$store.dispatch('user/showBtn', { id: 657 }).then(res => {
      // console.log('res', res)
      this.btnAry = res.children
    })
    this.getList()
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
      getServiceList(this.listQuery).then(res => {
        this.list = res.data.data.data
        this.total = res.data.data.total
        this.totalData = res.data.totalData
        this.listLoading = false
      })
    },
    // 勾选表格内容
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 搜索会员
    remoteMethod(query) {
      if (query == '' || query == null) {
        this.memberList = []
      } else {
        this.loadingSearch = true
        getAllMemberList({ keyword: query, page: 1, size: 20,}).then(res => {
          this.loadingSearch = false
          this.memberList = res.data
        })
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
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    // 点击添加
    handleCreate() {
      this.editDialogVisible = true
      this.dialogTitle = '添加'
      this.$nextTick(() => {
        this.$refs.editForm.resetFields()
      })
      this.editForm.hotel_ids = ''
      this.hotelList = []
      this.editForm.member_id = ''
      this.editFlag = true
    },
    // 点击编辑
    handleUpdate(item) {
      this.editDialogVisible = true
      this.dialogTitle = item.username + '-编辑'
      this.editId = item.id
      this.editFlag = false
      this.$nextTick(() => {
        for (const key in item) {
          if (this.editForm[key] != undefined) {
            this.editForm[key] = item[key]
          }
        }
        this.hotelList = []
        if (item.hotel_name == '' || item.hotel_name == null) {

        } else {
          const arr = item.hotel_name.split(',')
          const arr2 = item.hotel_ids.split(',')
          arr.map((item, i) => {
            const json = { title: item, id: arr2[i] }
            this.hotelList.push(json)
          })
        }
        this.editForm.password = item.password_show
        this.editForm.member_id = item.member_id
        this.remoteMethod(item.nickname)
      })
    },
    // 选择酒店
    selectHotel() {
      this.$refs.selectHotelChild.init()
    },
    getHotelData(data) {
      const arr = [...this.hotelList, ...data]
      const res = new Map() // 定义常量 res,值为一个Map对象实例
      // 返回arr数组过滤后的结果，结果为一个数组   过滤条件是，如果res中没有某个键，就设置这个键的值为1
      this.hotelList = arr.filter((arr) => !res.has(arr.id) && res.set(arr.id, 1))
    },
    delHotel(i) {
      this.hotelList.splice(i, 1)
    },
    // 弹窗确定
    submitHandle() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          const ids = this.hotelList.map(x => { return x.id })
          this.editForm.hotel_ids = ids.join(',')
          // if (this.hotelList.length === 0) {
          //   this.$message({
          //     type: 'warning',
          //     message: '请选择酒店!'
          //   })
          //   return
          // }
          if (this.editFlag) {
            const params = this.editForm
            getServiceAdd(params).then(res => {
              if (res.code === 0) {
                this.$message({
                  type: 'success',
                  message: '添加成功!'
                })
                this.getList()
                this.editDialogVisible = false
              }
            })
          } else {
            const params = Object.assign(this.editForm, { id: this.editId })
            getServiceEdit(params).then(res => {
              if (res.code === 0) {
                this.$message({
                  type: 'success',
                  message: '编辑成功!'
                })
                this.getList()
                this.editDialogVisible = false
              }
            })
          }
        }
      })
    },
    //关联酒店列表
    relateHotelList(row){
      this.$refs.relatedListChild.init(row)
    },
    //关联酒店
    relateHotel(row){
      this.$refs.relatedHotelChild.init(row)
    },
    successPoP(){
      this.getList()
    },
    // 删除单条数据
    handleDelete(row, index) {
      this.$confirm('确认要删除吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const params = {
            ids: row.id
          }
          getServiceDel(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getList()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    // 删除多条数据
    delMore() {
      if (this.multipleSelection.length == 0) {
        this.$message({
          type: 'warning',
          message: '请选择要删除的项'
        })
        return
      }
      this.$confirm('确认要删除吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const idArr = this.multipleSelection.map(x => { return x.id })
          const params = {
            ids: idArr.join(',')
          }
          getServiceDel(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getList()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.hotel-name{
    display: inline-block;
    height: 30px;
    line-height: 30px;
    padding: 0px 10px;
    vertical-align: middle;
    margin-right: 10px;
    position: relative;
    background: #f1f1f1;
}
.el-icon-close{
    cursor: pointer;
}
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
