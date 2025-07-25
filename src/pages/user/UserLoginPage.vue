<template>
  <div class="yoopic-login-bg">
    <div class="login-card">
      <h1>YooPic</h1>
      <div class="desc">云端智能体图片素材库</div>

      <a-form :model="formState" name="basic" autocomplete="off" @finish="handleSubmit" class="login-form">
        <a-form-item name="userAccount" :rules="[{ required: true, message: '请输入账号' }]">
          <label>账号</label>
          <a-input
            v-model:value="formState.userAccount"
            placeholder="请输入账号"
            class="custom-input"
          />
        </a-form-item>

        <a-form-item
          name="userPassword"
          :rules="[
            { required: true, message: '请输入密码' },
            { min: 8, message: '密码长度不能小于 8 位' },
          ]"
        >
          <label>密码</label>
          <a-input-password
            v-model:value="formState.userPassword"
            placeholder="请输入密码"
            class="custom-input"
          />
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit" class="login-btn">登录</a-button>
        </a-form-item>
      </a-form>

      <!-- 添加游客登录按钮 -->
      <a-button @click="handleGuestLogin" class="guest-login-btn">游客登录</a-button>

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
 • 提交表单
 • @param values
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

/**
 • 游客登录处理
 */
const handleGuestLogin = async () => {
  // 设置游客账号和密码
  formState.userAccount = 'Visitor'
  formState.userPassword = '123456789'

  // 发送登录请求
  const guestLoginData = {
    userAccount: 'Visitor',
    userPassword: '123456789'
  }

  const res = await userLoginUsingPost(guestLoginData)
  // 登录成功，把登录态保存到全局状态中
  if (res.data.code === 0 && res.data.data) {
    await loginUserStore.fetchLoginUser()
    message.success('游客登录成功')
    router.push({
      path: '/',
      replace: true,
    })
  } else {
    message.error('游客登录失败，' + res.data.message)
  }
}
</script>

<style scoped>
.yoopic-login-bg {
  min-height: 100vh;
  width: 100%;
  background: #e5e7eb url('../../assets/pexels-photo-255379.webp') no-repeat;
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
  font-size: 0.95rem;
  color: #444;
  margin-top: 7px;
  margin-bottom: 6px;
  font-weight: 500;
  display: block;
}

/* 优化输入框样式 */
.login-form :deep(.custom-input),
.login-form :deep(.custom-input .ant-input),
.login-form :deep(.custom-input .ant-input-password) {
  background: #f8f9fa;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 12px 16px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  height: auto;
}

.login-form :deep(.custom-input:hover) {
  border-color: #cbd5e1;
}

.login-form :deep(.custom-input .ant-input:focus),
.login-form :deep(.custom-input .ant-input-affix-wrapper:focus),
.login-form :deep(.custom-input .ant-input-affix-wrapper-focused) {
  border-color: #05a081;
  background: #f0fffa;
  box-shadow: 0 0 0 2px rgba(5, 160, 129, 0.2);
  outline: none;
}

.login-form :deep(.ant-input-affix-wrapper) {
  padding: 0;
  background: transparent;
  border: none;
  box-shadow: none;
}

.login-form :deep(.ant-input-affix-wrapper:focus),
.login-form :deep(.ant-input-affix-wrapper-focused) {
  box-shadow: none;
}

.login-form :deep(.ant-input-password) {
  height: auto;
}

.login-form :deep(.ant-input-suffix) {
  margin-right: 8px;
}

.login-form :deep(.ant-form-item-explain-error) {
  margin-top: 4px;
  font-size: 0.85rem;
  color: #e53e3e;
}

.login-form :deep(.ant-form-item) {
  margin-bottom: 16px;
}

.login-btn {
  margin-top: 12px;
  font-size: 1.05rem;
  font-weight: 600;
  border-radius: 10px;
  padding: 12px 0;
  width: 100%;
  background: #05a081;
  color: #fff;
  border: none;
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0 4px 10px rgba(5, 160, 129, 0.3);
  height: auto;
  letter-spacing: 0.5px;
}

.login-btn:hover {
  background: #038268;
  transform: translateY(-1px);
  box-shadow: 0 6px 12px rgba(5, 160, 129, 0.35);
}

.login-btn:active {
  transform: translateY(1px);
  box-shadow: 0 2px 8px rgba(5, 160, 129, 0.3);
}

/* 游客登录按钮样式 */
.guest-login-btn {
  margin-top: 16px;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 10px;
  padding: 10px 0;
  width: 80%;
  background: #f5f5f5;
  color: #555;
  border: 1px solid #e0e0e0;
  cursor: pointer;
  transition: all 0.25s ease;
  height: auto;
}

.guest-login-btn:hover {
  background: #ebebeb;
  color: #333;
  border-color: #ccc;
}

.guest-login-btn:active {
  transform: translateY(1px);
}

.signup-prompt {
  margin: 22px 0 7px 0;
  text-align: center;
  font-size: 1rem;
  color: #545454;
}

.signup-link {
  color: #05a081;
  text-decoration: none;
  font-weight: 600;
  margin-left: 7px;
  transition: color 0.2s ease;
}

.signup-link:hover {
  color: #038268;
  text-decoration: underline;
}

@media (max-width: 500px) {
  .login-card {
    padding: 25px 4vw;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  }
}
</style>
