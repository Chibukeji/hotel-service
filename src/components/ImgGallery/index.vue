<template>
  <div>
    <el-dialog :visible.sync="imgDialogVisible" title="相册" width="50%" class="center-dialog imgGallery">
      <div class="dialog-wrap-box">
        <div class="left-nav">
          <div class="menu-div">
            <el-menu :default-active="group_id.toString()" class="el-menu-vertical-demo">
              <el-menu-item v-for="(item,n) in groupList" :key="n" :index="item.id.toString()" @click="menuHandle(item)">
                <span slot="title">{{item.group_name}}</span>
                <i class="el-icon-edit-outline" @click="changeGroupName(item)"></i>
              </el-menu-item>
            </el-menu>
          </div>
        </div>
        <div class="right-img-box">
          <div class="top-btn">
            <span style="margin-right:15px">
              <span>移动分组至：</span>
              <el-select v-model="selectGroup" placeholder="请选择分组" style="width:150px" >
                <el-option
                  v-for="item in groupList"
                  :key="item.id"
                  :label="item.group_name"
                  :value="item.id"
                  @click.native="changeGroup"
                />
              </el-select>
            </span>
            <el-button size="small" type="primary" style="margin-right:15px" @click="addGroup">新增分组</el-button>
            <el-upload
              class="upload-demo"
              :action="upload_picture"
              :headers="headers"
              :on-success="addUploadImgSuccess"
              :before-upload="beforeAvatarUpload"
              name="image"
              :data="{group_id:group_id, group_type:group_type,uid:hotelId}"
              :show-file-list="false"
            >
              <el-button size="small" type="primary">上传图片</el-button>
            </el-upload>
            <el-button size="small" type="danger" icon="el-icon-close" @click="delHandle">删除</el-button>
          </div>
          <div>
            <div ref="scrollBox" class="img-wrap" v-if="imgInit">
              <div v-for="(item,index) in groupImgList" :key="index" class="img-box demo-image__lazy" @click="selectImg(item,index)">
                <!-- <el-image src="../../assets/images/img1.jpg" class="img" lazy></el-image> -->
                <img :src="item.file_url" class="img">
                <div v-if="item.check" class="select-mask">
                  <i class="el-icon-check" />
                </div>
              </div>
            </div>
            <el-button v-if="this.listQuery.page < this.total" size="small" type="primary" style="display:block;margin: auto;" @click="loadMore">加载更多</el-button>
          </div>
        </div>
        <div class="dialog-btn">
          <el-button size="small" @click="imgDialogVisible = false">取消</el-button>
          <el-button size="small" type="primary" @click="submitImg">确定</el-button>
        </div>
      </div>

    </el-dialog>
  </div>
</template>

<script>
import { getImgGroupList,getImgList,addImgGroupList,delImg,moveGroup,editGroupName } from '@/api/ImgGallery'
// import mix from '@/mixs/mix'
import { scrollTo } from '@/utils/scroll-to'
export default {
  // mixins: [mix],
  data() {
    return {
      imgDialogVisible: false,
      groupList: [],
      flag:'',
      groupImgList:[],
      group_id:'',
      headers: {
        authorization: ''
      }, // 上传请求头
      upload_picture: `${process.env.VUE_APP_BASE_API}main/upload`,
      imgInit:true,
      selectGroup:'',
      listQuery:{
        page:1,
        size:20,
      },
      total:0,
      hotelId:'',
      group_type:''
    }
  },
  mounted() {
    // 此处true需要加上，不加滚动事件可能绑定不成功
    window.addEventListener('scroll', this.handleScroll, true)
    this.headers.authorization = this.$store.getters.token
  },
  methods: {
    init(flag,type,id) {
      // console.log(flag,type,id)
      this.imgDialogVisible = true
      this.flag = flag
      this.group_type = type
      this.hotelId = id
      this.groupList = []
      this.groupImgList = []
      this.listQuery.page = 1
      this.group_id = ''
      this.total = 0
      this.getGroupList()
    },
    //获取分组列表
    getGroupList() {
      let params = {
        group_type:this.group_type,
        uid:this.hotelId
      }
      getImgGroupList(params).then(res => {
        this.groupList = res.data.data
        if(res.data.data.length>0){
          this.getGroupImgList(res.data.data[0].id)
          // console.log(res.data.data[0].id)
          this.group_id = res.data.data[0].id
        }
      })
    },
    //获取对应分组图片列表
    getGroupImgList(id) {
      let params={
        group_id:id,
        page:this.listQuery.page,
        size:this.listQuery.size,
        group_type:this.group_type,
        uid:this.hotelId
      }
      getImgList(params).then(res => {
        this.groupImgList = res.data.data
        this.total = res.data.last_page
        this.groupImgList.map(item=>{
          item.check = false
        })
        // console.log(this.groupImgList)
      })
    },
    // 加载更多图片
    loadMore(){
      let page
      if(this.listQuery.page < this.total){
        page = this.listQuery.page+1
      }else{
        return
      }
      let params={
        group_id:this.group_id,
        page:page,
        size:this.listQuery.size,
        group_type:this.group_type,
        uid:this.hotelId
      }
      getImgList(params).then(res => {
        let arr = res.data.data
        arr.map(item=>{
          item.check = false
          this.groupImgList.push(item)
        })
        // console.log(this.groupImgList)
      })
    },
    handleScroll() {
      const scrolltop = document.documentElement.scrollTop || document.body.scrollTop
      // scrolltop > 30 ? (this.gotop = true) : (this.gotop = false);
    },
    // 选中图片
    selectImg(item,i) {
      this.imgInit = false
      if (this.groupImgList[i].check) {
        this.groupImgList[i].check = false
      } else {
        this.groupImgList[i].check = true
      }
      this.imgInit = true
    },
    //删除图片
    delHandle(){
      let idArr=[]
      this.groupImgList.map(item=>{
        if(item.check){
          idArr.push(item.id)
        }
      })
      if(idArr.length==0){
        this.$message({
          type: 'warning',
          message: '请选择图片'
        })
        return
      }
      this.$confirm('确认要删除吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
          const params = {
            ids: idArr.join(',')
          }
          delImg(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getGroupImgList(this.group_id)
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
    //移动分组
    changeGroup(){
      console.log(123)
      let idArr=[]
      this.groupImgList.map(item=>{
        if(item.check){
          idArr.push(item.id)
        }
      })
      if(idArr.length==0){
        this.$message({
          type: 'warning',
          message: '请选择图片'
        })
        return
      }
      const params = {
        ids: idArr.join(','),
        group_id:this.selectGroup,
      }
      moveGroup(params).then(res => {
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '移动成功!'
          })
          this.getGroupImgList(this.group_id)
        }
      })
    },
    // 新增分组
    addGroup() {
      this.$prompt('请输入新增分组名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        let params={
          group_name:value,
          group_type:this.group_type,
          uid:this.hotelId
        }
        addImgGroupList(params).then(res=>{
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '新增成功'
            })
            let params = {
              group_type:this.group_type,
              uid:this.hotelId
            }
            getImgGroupList(params).then(res => {
              this.groupList = res.data.data
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消操作'
        })
      })
    },
    //修改组名
    changeGroupName(item){
      this.$prompt('请输入新增分组名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue:item.group_name
      }).then(({ value }) => {
        editGroupName({id:item.id,group_name:value}).then(res=>{
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '新增成功'
            })
            let params = {
              group_type:this.group_type,
              uid:this.hotelId
            }
            getImgGroupList(params).then(res => {
              this.groupList = res.data.data
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消操作'
        })
      })
    },
    // 上传图片
    addUploadImgSuccess(res, file, fileList) {
      this.getGroupImgList(this.group_id)
    },
    beforeAvatarUpload(file) {
      const isJPG =
                    file.type === 'image/jpeg' ||
                    file.type === 'image/png' ||
                    file.type === 'image/jpg'
      const isLt2M = file.size / 1024 / 1024 < 1
      if (!isJPG) {
        this.$message.error('上传图片只能是 jpg,jpeg,png 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 1MB!')
      }
      return isJPG && isLt2M
    },
    // 点击左侧菜单
    menuHandle(item) {
      this.group_id = item.id 
      this.getGroupImgList(this.group_id)
      const dom = document.querySelectorAll('.imgGallery .el-dialog__body')
      let top = dom[0].scrollTop
      // 实现滚动效果
      const timeTop = setInterval(() => {
        dom[0].scrollTop = top -= 100
        if (top <= 0) {
          clearInterval(timeTop)
        }
      }, 10)
    },
    //确定选择的图片
    submitImg(){
      let itemArr=[]
      this.groupImgList.map(item=>{
        if(item.check){
          itemArr.push(item)
        }
      })
      if(itemArr.length==0){
        this.$message({
          type: 'warning',
          message: '请选择图片'
        })
        return
      }
      let params={
        flag:this.flag,
        item:itemArr
      }
      this.$emit('selectImgList',params)
      this.imgDialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-wrap-box{
    display: flex;
    justify-content: space-between;
    .left-nav{
        width:180px;
        height: calc(100% - 60px);
        overflow: hidden;
        position: fixed;
        .menu-div{
            height: 100%;
            overflow: auto;
        }
        .el-icon-edit-outline{
          // float: right;
          line-height: 3;
        }
    }
    .right-img-box{
        margin-left: 190px;
        flex: 1;
        height:100%;
        overflow: hidden;
        .top-btn{
            // width: 100%;
            width: calc(100% - 230px);
            margin-left: 15px;
            margin-bottom: 20px;
            position: fixed;
            background: #fff;
            z-index: 99;
            padding: 10px 0;
            .upload-demo{
                display: inline-block;
                margin-right:15px
            }
        }
        .img-wrap{
            display: flex;
            flex-wrap:wrap;
            margin-bottom: 60px;
            position: relative;
            overflow: auto;
            margin-top: 90px;
        }
        .img-box{
            width: 17%;
            margin-left: 15px;
            text-align: center;
            border: 1px solid #e6e6e6;
            border-radius: 5px;
            padding: 10px 0;
            margin-bottom: 10px;
            position: relative;
            cursor: pointer;
            .img{
              width: 90%;
            }
            &:hover {
                border: 1px solid #1890ff;
            }
            .select-mask{
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                background: rgba(0,0,0,.3);
                text-align: center;
                border-radius: 6px;
                .el-icon-check{
                    font-size: 50px;
                    color: #fff;
                    position: relative;
                    top: 50%;
                    transform: translateY(-50%);
                }
            }
        }
    }
}
.dialog-btn {
    width: calc(100% - 180px);
    right: 20px;
}
.left-nav ::-webkit-scrollbar {
 width: 5px;
}
.left-nav ::-webkit-scrollbar-track {
 background-color:#fff;
}
.left-nav ::-webkit-scrollbar-thumb {
 background-color:#c1c1c1;
}
/deep/.el-dialog__body{
    padding: 0 20px;
}
</style>
