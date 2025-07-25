<template>
  <div class="yoopic-register-bg">
    <div class="register-card">
      <h1>YooPic</h1>
      <div class="desc">云端智能体图片素材库</div>

      <a-form :model="formState" name="basic" autocomplete="off" @finish="handleSubmit" class="register-form">
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

        <a-form-item
          name="checkPassword"
          :rules="[
            { required: true, message: '请输入确认密码' },
            { min: 8, message: '确认密码长度不能小于 8 位' },
          ]"
        >
          <label>确认密码</label>
          <a-input-password
            v-model:value="formState.checkPassword"
            placeholder="请输入确认密码"
            class="custom-input"
          />
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit" class="register-btn">注册</a-button>
        </a-form-item>
      </a-form>

      <div class="login-prompt">
        已有账号？
        <RouterLink to="/user/login" class="login-link">去登录</RouterLink>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { userRegisterUsingPost } from '@/api/userController.ts'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import { message } from 'ant-design-vue'
import router from '@/router' // 用于接受表单输入的值

// 用于接受表单输入的值
const formState = reactive<API.UserRegisterRequest>({
  userAccount: '',
  userPassword: '',
  checkPassword: '',
})

const loginUserStore = useLoginUserStore()

/**
 * 提交表单
 * @param values
 */
const handleSubmit = async (values: any) => {
  // 校验两次输入的密码是否一致
  if (values.userPassword !== values.checkPassword) {
    message.error('两次输入的密码不一致')
    return
  }
  const res = await userRegisterUsingPost(values)
  // 注册成功，跳转到登录页面
  if (res.data.code === 0 && res.data.data) {
    message.success('注册成功')
    router.push({
      path: '/user/login',
      replace: true,
    })
  } else {
    message.error('注册失败，' + res.data.message)
  }
}
</script>

<style scoped>
.yoopic-register-bg {
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
.yoopic-register-bg::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.35);
  z-index: 1;
}

.register-card {
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

.register-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.register-form :deep(label) {
  font-size: 0.95rem;
  color: #444;
  margin-top: 7px;
  margin-bottom: 6px;
  font-weight: 500;
  display: block;
}

/* 优化输入框样式 */
.register-form :deep(.custom-input),
.register-form :deep(.custom-input .ant-input),
.register-form :deep(.custom-input .ant-input-password) {
  background: #f8f9fa;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 12px 16px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  height: auto;
}

.register-form :deep(.custom-input:hover) {
  border-color: #cbd5e1;
}

.register-form :deep(.custom-input .ant-input:focus),
.register-form :deep(.custom-input .ant-input-affix-wrapper:focus),
.register-form :deep(.custom-input .ant-input-affix-wrapper-focused) {
  border-color: #05a081;
  background: #f0fffa;
  box-shadow: 0 0 0 2px rgba(5, 160, 129, 0.2);
  outline: none;
}

.register-form :deep(.ant-input-affix-wrapper) {
  padding: 0;
  background: transparent;
  border: none;
  box-shadow: none;
}

.register-form :deep(.ant-input-affix-wrapper:focus),
.register-form :deep(.ant-input-affix-wrapper-focused) {
  box-shadow: none;
}

.register-form :deep(.ant-input-password) {
  height: auto;
}

.register-form :deep(.ant-input-suffix) {
  margin-right: 8px;
}

.register-form :deep(.ant-form-item-explain-error) {
  margin-top: 4px;
  font-size: 0.85rem;
  color: #e53e3e;
}

.register-form :deep(.ant-form-item) {
  margin-bottom: 16px;
}

.register-btn {
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

.register-btn:hover {
  background: #038268;
  transform: translateY(-1px);
  box-shadow: 0 6px 12px rgba(5, 160, 129, 0.35);
}

.register-btn:active {
  transform: translateY(1px);
  box-shadow: 0 2px 8px rgba(5, 160, 129, 0.3);
}

.login-prompt {
  margin: 22px 0 7px 0;
  text-align: center;
  font-size: 1rem;
  color: #545454;
}

.login-link {
  color: #05a081;
  text-decoration: none;
  font-weight: 600;
  margin-left: 7px;
  transition: color 0.2s ease;
}

.login-link:hover {
  color: #038268;
  text-decoration: underline;
}

@media (max-width: 500px) {
  .register-card {
    padding: 25px 4vw;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  }
}
</style>
