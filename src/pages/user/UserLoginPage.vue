<template>
  <div class="yoopic-login-bg">
    <div class="login-card">
      <h1>YooPic</h1>
      <div class="desc">企业级智能协同云图库</div>

      <a-form :model="formState" name="basic" autocomplete="off" @finish="handleSubmit" class="login-form">
        <a-form-item name="userAccount" :rules="[{ required: true, message: '请输入账号' }]">
          <label>账号</label>
          <a-input v-model:value="formState.userAccount" placeholder="请输入账号" />
        </a-form-item>

        <a-form-item
          name="userPassword"
          :rules="[
            { required: true, message: '请输入密码' },
            { min: 8, message: '密码长度不能小于 8 位' },
          ]"
        >
          <label>密码</label>
          <a-input-password v-model:value="formState.userPassword" placeholder="请输入密码" />
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit" class="login-btn">登录</a-button>
        </a-form-item>
      </a-form>

      <div class="signup-prompt">
        没有账号？
        <RouterLink to="/user/register" class="signup-link">去注册</RouterLink>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { userLoginUsingPost } from '@/api/userController.ts'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import { message } from 'ant-design-vue'
import router from '@/router' // 用于接受表单输入的值

// 用于接受表单输入的值
const formState = reactive<API.UserLoginRequest>({
  userAccount: '',
  userPassword: '',
})

const loginUserStore = useLoginUserStore()

/**
 * 提交表单
 * @param values
 */
const handleSubmit = async (values: any) => {
  const res = await userLoginUsingPost(values)
  // 登录成功，把登录态保存到全局状态中
  if (res.data.code === 0 && res.data.data) {
    await loginUserStore.fetchLoginUser()
    message.success('登录成功')
    router.push({
      path: '/',
      replace: true,
    })
  } else {
    message.error('登录失败，' + res.data.message)
  }
}
</script>

<style scoped>
.yoopic-login-bg {
  min-height: 100vh;
  width: 100%;
  background: #e5e7eb url('https://images.pexels.com/photos/255379/pexels-photo-255379.jpeg?auto=compress&cs=tinysrgb&w=1920&q=80') no-repeat;
  background-size: cover;
  background-position: center;
  background-attachment: fixed; /* 保持背景图固定，不随滚动 */
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden; /* 确保图片不会溢出 */
}

/* 添加覆盖层使图片稍微变暗，提高表单可读性 */
.yoopic-login-bg::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.35);
  z-index: 1;
}

.login-card {
  background: #fff;
  max-width: 380px;
  margin: 40px 12px;
  width: 100%;
  border-radius: 18px;
  box-shadow: 0 4px 38px rgba(0, 0, 0, 0.25);
  padding: 38px 30px 32px 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2; /* 确保卡片显示在覆盖层之上 */
}



h1 {
  font-size: 1.8rem;
  font-weight: 600;
  color: #171717;
  margin: 0 0 10px 0;
  text-align: center;
}

.desc {
  text-align: center;
  color: #666;
  margin-bottom: 24px;
  font-size: 0.95rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.login-form :deep(label) {
  font-size: .99em;
  color: #444;
  margin-top: 7px;
  margin-bottom: 3px;
  font-weight: 500;
  display: block;
}

.login-form :deep(.ant-input),
.login-form :deep(.ant-input-password) {
  background: #f5f5f6;
  border: 1px solid #dcdce1;
  border-radius: 6px;
  padding: 11px 13px;
  font-size: .98em;
  margin-bottom: 2px;
  outline: none;
  transition: border 0.18s;
  height: auto;
}

.login-form :deep(.ant-input:focus),
.login-form :deep(.ant-input-password:focus) {
  border: 1.5px solid #05a081;
  background: #f0fffa;
  box-shadow: none;
}

.login-form :deep(.ant-form-item) {
  margin-bottom: 16px;
}

.login-btn {
  margin-top: 8px;
  font-size: 1.05em;
  font-weight: 600;
  border-radius: 6px;
  padding: 11px 0;
  width: 100%;
  background: #05a081;
  color: #fff;
  border: none;
  cursor: pointer;
  transition: background 0.17s;
  box-shadow: 0 2px 7px #04a08125;
  height: auto;
}

.login-btn:hover {
  background: #018668;
}

.signup-prompt {
  margin: 17px 0 7px 0;
  text-align: center;
  font-size: 1em;
  color: #545454;
}

.signup-link {
  color: #05a081;
  text-decoration: none;
  font-weight: 600;
  margin-left: 7px;
}

.signup-link:hover {
  text-decoration: underline;
}

@media (max-width: 500px) {
  .login-card {
    padding: 18px 4vw 18px 4vw;
    box-shadow: 0 0 16px #4442;
  }
}
</style>
