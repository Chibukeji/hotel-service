<template>
  <div>
    <el-dialog :visible.sync="merchantDialogVisible" title="选择酒店" width="750px" class="center-dialog">
      <div class="content-box">
        <div class="top-tool">
            <span class="filter-item">
                <el-cascader v-model="placeOrigin"  :props="belongRegoinProps"  clearable placeholder="所在城市" style="width:250px"></el-cascader>
            </span>
            <el-input v-model="listQuery.keyword" placeholder="酒店名称/酒店编号/商家" style="width: 300px" class="filter-item" />
            <el-button class="filter-item" type="primary" size="mini" icon="el-icon-search" style="height:36px" @click="handleFilter">搜索</el-button>
        </div>
        <div v-loading="listLoading" class="radio-box">
          <el-checkbox-group v-model="radio">
            <el-checkbox v-for="(item,index) in merchantList" :key="index" :label="item.id" class="radio-btn">{{ item.title }}</el-checkbox>
          </el-checkbox-group>
          <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="paginHandle" />
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="merchantDialogVisible = false">取消</el-button>
        <el-button size="small" type="primary" @click="submit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getHotelList } from '@/api/service-manage/service-list'
import Pagination from '@/components/Pagination'
import { allAddressList } from '@/api/common'
export default {
  components: { Pagination},
  data() {
    return {
      merchantDialogVisible: false,
      listLoading: false,
      listQuery: {
        province_id:'',
        city_id:'',
        keyword: '',
        page: 1,
        size: 30
      },
      total: 0,
      radio: [],
      merchantList: [],
      businessScope: [],
      classify: [],
      placeOrigin:[],
      belongRegoinProps: {
            checkStrictly: true,
            value:'code',
            label:'name',
            lazy: true,
            lazyLoad: (node, resolve) => {
              this.$nextTick(()=>{
                this.getAreaForLazyLoad(node, resolve)
              })
            }
      },//级联框prop
    }
  },
  mounted() {
        setInterval(function() {
            document.querySelectorAll(".el-cascader-node__label").forEach(el => {
                el.onclick = function() {
                if (this.previousElementSibling) this.previousElementSibling.click();
                };
            });
        }, 1000);
  },
  methods: {
    init() {
      this.merchantDialogVisible = true
      this.getList()
    },
    // 获取列表
    getList() {
        if(this.placeOrigin.length>0){
        this.placeOrigin.map((item,i)=>{
          if(i == 0){
            this.listQuery.province_id = item
          }else if(i == 1){
            this.listQuery.city_id = item
          }
        })
      }else{
        this.listQuery.province_id = ''
        this.listQuery.city_id = ''
      }
      this.listLoading = true
      getHotelList(this.listQuery).then(res => {
        this.merchantList = res.data.data.data
        this.total = res.data.data.total
        this.listLoading = false
        // console.log(this.merchantList)
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
    },
    getAreaForLazyLoad(node, resolve) {
        // console.log(node)
        const  level  = node.level
        if(level >= 2){
            resolve()
            return
        }
        let params = {
          code: node.value
        }
        let childProjects = []
        allAddressList(params).then(res => {
            if (res.code == 0) {
              childProjects = res.data.data
              childProjects.map(item => {
                item.leaf = level >= 1; //判断是否为末尾节点
              })
              resolve(childProjects)
            }
        }).catch(err => { console.log(err) })
    },
    // 点击确定
    submit() {
      const arr = []
      const arr1 = this.radio.map(item => item)
      this.merchantList.map((item, index) => {
        if (arr1.includes(item.id)) {
          arr.push(item)
        }
      })
      console.log(arr)
      this.$emit('getHotelData', arr)
      this.merchantDialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.content-box{
    // overflow: hidden;
    .top-tool{
        margin-bottom: 30px;
    }
    .radio-box{
        // overflow: auto;
        // margin-top:30px ;
        // height: calc(100vh - 350px);
        // margin-bottom: 20px;
        .radio-btn{
            margin-bottom: 20px;
            width: 33%;
            margin-right: 0px;
        }
    }
}
/deep/.el-dialog .el-dialog__body {
    // height: auto;
}
/deep/.el-pagination .el-select .el-input {
    width: 85px;
}
/deep/.el-checkbox__label{
    width: calc(100% - 15px);
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    vertical-align: middle;
}
/deep/.el-pagination__jump{
    margin-left: 14px;
}
/deep/.el-pagination {
    padding: 2px 0px;
}
</style>
