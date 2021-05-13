<template>
    <div>
        <el-dialog :visible.sync="merchantDialogVisible" title="关联酒店" width="90%" class="center-dialog">
            <div class="content-box">
                <aside> 已选： <span style="color:red;">{{ totalTop }}</span> 个酒店</aside>
                <div class="filter-container" style="margin-bottom:10px">
                    <el-input v-model="listQuery.keyword" :placeholder="'输入酒店名称/酒店ID搜索'" style="width: 300px;" />
                    <el-button type="primary" size="mini" icon="el-icon-search" @click="handleFilter">
                        搜索
                    </el-button>
                </div>
                <aside style="padding-top:20px">
                    <div>
                        <div class="nove-box">
                            <span style="float:left;">酒店类型：</span>
                            <span class="nove-type">
                                <el-radio-group v-model="listQuery.hotel_cate_id" @change="handleFilter">
                                    <el-radio-button label="">全部</el-radio-button>
                                    <el-radio-button v-for="(item,index) in hotelCateList" :key="index" :label="item.id">{{ item.cate_name }}</el-radio-button>
                                </el-radio-group>
                            </span>
                        </div>
                    </div>
                </aside>
                <el-table v-loading="listLoading" :data="list" border fit ref="multipleTable" row-key="id" highlight-current-row style="width: 100%;" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" :reserve-selection="true" width="55"  align="center" />
                    <el-table-column label="酒店ID" prop="id" align="center" width="80" />
                    <el-table-column label="酒店名称" align="left">
                        <template slot-scope="{row}">
                            <span>{{ row.title }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="所属商家" prop="merch_name" align="left" />
                    <!-- <el-table-column label="过期时间" align="center" width="200">
                    <template slot-scope="{row}">
                        <el-date-picker v-model="row.time" type="date" placeholder="选择日期"  style="width:160px"
                        format="yyyy-MM-dd"  value-format="yyyy-MM-dd" :picker-options="pickerOptions0"></el-date-picker>
                    </template>
                    </el-table-column> -->
                </el-table>
                <pagination  :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size"  @pagination="paginHandle" style="margin-bottom: 40px;" />
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="merchantDialogVisible = false">取消</el-button>
                <el-button size="small" type="primary" @click="handleSure">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { getHotelList,getHotelCate,getRelatedHotelList } from '@/api/service-manage/service-list'
import Pagination from '@/components/Pagination'
    export default {
        components: { Pagination},
        data() {
            return {
                merchantDialogVisible: false,
                listQuery: {
                    hotel_cate_id:'',
                    keyword:'',
                    is_not_service:1,
                    page: 1,
                    size: 10,
                },
                total:0,
                loadingSearch:false,
                hotelList:[],
                listLoading:false,
                list:[],
                multipleSelection: [],
                detailItem:'',
                totalTop:0,
                hotelCateList:[],
                pickerOptions0: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 24 * 60 * 60 * 1000;
                    }
                },
            }
        },
        methods: {
            // 搜索酒店
            init(item){
                this.merchantDialogVisible = true
                this.detailItem = item
                this.listQuery.hotel_cate_id = ''
                this.getHotelCateList()
                this.getHotel()
            },
            //获取酒店分类
            getHotelCateList(){
                getHotelCate().then(res=>{
                    this.hotelCateList = res.data
                })
            },
            handleSelectionChange(val) {
                this.multipleSelection = val
                this.totalTop = this.multipleSelection.length
            },
            handleFilter() {
                this.$refs.multipleTable.clearSelection();
                this.listQuery.page = 1
                this.getHotel()
            },
            getHotel(){
                this.listLoading = true
                getHotelList(this.listQuery).then(res=>{
                    this.list = res.data.data.data
                    this.total = res.data.data.total
                    this.listLoading = false
                    var date = new Date()
                    date.setFullYear(date.getFullYear() + 3)
                    var year=date.getFullYear();
                    var month= date.getMonth()+1<10 ? "0"+(date.getMonth()+1) : date.getMonth()+1;
                    var day=date.getDate()<10 ? "0"+date.getDate() : date.getDate();
                    this.list.map(item=>{
                        this.$set(item, 'time', `${year}-${month}-${day}`)
                    })
                })
            },
            // 翻页
            paginHandle(val) {
                if (val != undefined) {
                    const json = JSON.parse(JSON.stringify(val))
                    this.listQuery.page = parseInt(json.page)
                    this.listQuery.size = parseInt(json.limit)
                }
                this.getHotel()
            },
            //点击确定
            handleSure() {
                let params
                if(this.multipleSelection.length<1){
                    this.$message.warning('请选择酒店')
                    return
                }
                let arr =[]
                this.multipleSelection.map(item=>{
                    let tiem = item.time
                    let json={hotel_id:item.id,service_expire_time:tiem}
                    arr.push(json)
                })
                params = {
                    service_id: this.detailItem.id,
                    infos: arr
                }
                // console.log('params',params)
                // return
                getRelatedHotelList(params).then((res) => {
                    if (res.code == 0) {
                        this.merchantDialogVisible = false
                        this.$message.success('提交成功')
                        this.$emit('successPoP')
                    }
                })
                }
        },
    }
</script>

<style lang="scss" scoped>
.nove-type{
  /deep/ .el-radio-button {
    margin-right: 10px;
    margin-bottom: 10px;
  }
   /deep/.el-radio-button:first-child .el-radio-button__inner{
       border-radius: 0;
  }
  /deep/.el-radio-button:last-child .el-radio-button__inner{
        border-radius: 0; 
  } 
  /deep/.el-radio-button__inner{
      border-left: 1px solid #DCDFE6;
  }
  /deep/.el-radio-button__orig-radio:checked+.el-radio-button__inner{
      border-left: 1px solid #1890ff;
  }
}
</style>