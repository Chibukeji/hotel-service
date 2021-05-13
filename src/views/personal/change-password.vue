<template>
  <div class="password-page">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm">
      <el-form-item label="原始密码：" prop="pass" style="width:400px">
        <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="新密码：" prop="newPass" style="width:400px">
        <el-input type="password" v-model="ruleForm.newPass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码：" prop="checkPass" style="width:400px">
        <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div class="bottom-btn">
        <el-button type="primary" @click="submitForm()">提交</el-button>
    </div>
  </div>
</template>

<script>
import { changePassword } from '@/api/personal-data.js'
export default {
  data() {
    return {
      ruleForm: {
          pass:"",
          newPass:"",
          checkPass:"",
      },
      rules: {
          pass:[{required: true, message: '请输入当前登录密码', trigger: 'blur' }],
          newPass:[{required: true, message: '请输入您的密码', trigger: 'blur' }],
          checkPass:[{required: true, message: '请再次输入您的密码', trigger: 'blur' }],
      }
    };
  },
  methods: {
    submitForm() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let params={
            old_password:this.ruleForm.pass,
            password:this.ruleForm.newPass,
            repassword:this.ruleForm.checkPass,
          }
          changePassword(params).then(res=>{
            if(res.code == 0){
                this.$message({
                    message: '修改密码成功',
                    type: 'success'
                });
            }else{
                this.$message({
                    message: '修改密码失败',
                    type: 'success'
                });  
            }
          })
          } else {
            return false;
          }
        });
    }
  },
};
</script>

<style lang="scss" scoped>
.password-page{
    margin-top: 20px;
}
.bottom-btn{
    margin-left: 140px;
}
</style>