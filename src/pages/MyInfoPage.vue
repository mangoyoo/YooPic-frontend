<template>
  <div class="my-info-container">
    <a-card class="info-card" :bordered="false">
      <a-row>
        <a-col :span="24">
          <div class="page-header">
            <div class="header-content">
              <div class="title-container">
                <h1>个人中心</h1>
                <div class="header-decoration"></div>
              </div>
              <p>查看和管理您的个人信息</p>
            </div>
          </div>
        </a-col>
      </a-row>

      <a-row :gutter="[24, 24]">
        <!-- 左侧用户基本信息 -->
        <a-col :xs="24" :md="8">
          <a-card class="user-profile-card" :bordered="false">
            <div class="user-avatar-container">
              <a-avatar
                :size="120"
                :src="loginUserStore.loginUser?.userAvatar"
                class="user-avatar"
              />
              <div class="upload-avatar-btn">
                <a-upload
                  name="file"
                  :show-upload-list="false"
                  :before-upload="beforeUpload"
                  :customRequest="handleAvatarChange"
                >
                  <a-button type="primary" size="small">
                    <upload-outlined />
                    更换头像
                  </a-button>
                </a-upload>
              </div>
            </div>

            <div class="user-basic-info">
              <h2>{{ loginUserStore.loginUser?.userName || '未设置昵称' }}</h2>
              <p class="user-role">
                <tag-outlined />
                <span>{{ userRoleText }}</span>
              </p>
              <p class="user-account">
                <user-outlined />
                <span>账号：{{ loginUserStore.loginUser?.userAccount }}</span>
              </p>
              <p class="user-join-date">
                <calendar-outlined />
                <span>注册时间：{{ formatDate(loginUserStore.loginUser?.createTime) }}</span>
              </p>
              <a-button
                type="primary"
                @click="navigateToMySpace"
                class="my-space-btn"
              >
                <cloud-outlined />
                我的空间
              </a-button>
            </div>
          </a-card>
        </a-col>

        <!-- 右侧用户详细信息 -->
        <a-col :xs="24" :md="16">
          <a-card class="user-details-card" :bordered="false">
            <a-tabs v-model:activeKey="activeTabKey">
              <a-tab-pane key="basic" tab="基本资料">
                <a-form
                  :model="userForm"
                  :rules="rules"
                  ref="userFormRef"
                  layout="vertical"
                >
                  <a-form-item label="用户昵称" name="userName">
                    <a-input v-model:value="userForm.userName" placeholder="请输入用户昵称" />
                  </a-form-item>

                  <a-form-item label="个人简介" name="userProfile">
                    <a-textarea
                      v-model:value="userForm.userProfile"
                      placeholder="请输入个人简介"
                      :rows="4"
                    />
                  </a-form-item>

                  <a-form-item>
                    <a-button type="primary" @click="updateUserInfo" :loading="loading">
                      保存修改
                    </a-button>
                  </a-form-item>
                </a-form>
              </a-tab-pane>

              <a-tab-pane key="security" tab="安全设置">
                <div class="security-item">
                  <div class="security-item-info">
                    <h3>修改密码</h3>
                    <p>定期更换密码可以保护您的账户安全</p>
                  </div>
                  <a-button @click="showPasswordModal">修改</a-button>
                </div>
              </a-tab-pane>

              <a-tab-pane key="statistics" tab="数据统计">
                <a-row :gutter="[16, 16]">
                  <a-col :span="8">
                    <a-statistic
                      title="私人空间"
                      :value="userStats.privateSpaceCount || 0"
                      :value-style="{ color: '#1890ff' }"
                    >
                      <template #prefix>
                        <cloud-outlined />
                      </template>
                    </a-statistic>
                  </a-col>
                  <a-col :span="8">
                    <a-statistic
                      title="公共空间"
                      :value="userStats.publicSpaceCount || 0"
                      :value-style="{ color: '#fa8c16' }"
                    >
                      <template #prefix>
                        <global-outlined />
                      </template>
                    </a-statistic>
                  </a-col>
                  <a-col :span="8">
                    <a-statistic
                      title="团队空间"
                      :value="userStats.teamSpaceCount || 0"
                      :value-style="{ color: '#722ed1' }"
                    >
                      <template #prefix>
                        <team-outlined />
                      </template>
                    </a-statistic>
                  </a-col>
                </a-row>
                <a-row :gutter="[16, 16]" style="margin-top: 16px">
                  <a-col :span="8">
                    <a-statistic
                      title="总计图片"
                      :value="totalPictureCount"
                      :value-style="{ color: '#3f8600' }"
                    >
                      <template #prefix>
                        <file-image-outlined />
                      </template>
                    </a-statistic>
                  </a-col>
                </a-row>
              </a-tab-pane>
            </a-tabs>
          </a-card>
        </a-col>
      </a-row>
    </a-card>

    <!-- 修改密码弹窗 -->
    <a-modal
      v-model:visible="passwordModalVisible"
      title="修改密码"
      @ok="updatePassword"
      :confirm-loading="passwordLoading"
    >
      <a-form :model="passwordForm" layout="vertical">
        <a-form-item label="当前密码" name="oldPassword" :rules="[{ required: true, message: '请输入当前密码' }]">
          <a-input-password v-model:value="passwordForm.oldPassword" placeholder="请输入当前密码" />
        </a-form-item>
        <a-form-item label="新密码" name="newPassword" :rules="[
          { required: true, message: '请输入新密码' },
          { min: 8, message: '密码长度不能少于8位' }
        ]">
          <a-input-password v-model:value="passwordForm.newPassword" placeholder="请输入新密码(至少8位)" />
        </a-form-item>
        <a-form-item label="确认新密码" name="confirmPassword" :rules="[
          { required: true, message: '请确认新密码' },
          { validator: validatePassword }
        ]">
          <a-input-password v-model:value="passwordForm.confirmPassword" placeholder="请再次输入新密码" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import {
  UploadOutlined,
  CalendarOutlined,
  TagOutlined,
  FileImageOutlined,
  CloudOutlined,
  TeamOutlined,
  UserOutlined,
  GlobalOutlined
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { useLoginUserStore } from '@/stores/useLoginUserStore'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import {
  updateUserInfoUsingPost,
  uploadUserAvatarUsingPost,
  userChangePasswordUsingPost
} from '@/api/userController'
import { getUserPictureStatistics } from '@/api/pictureController.ts'

// 获取用户信息
const loginUserStore = useLoginUserStore()
const router = useRouter()
const loading = ref(false)
const activeTabKey = ref('basic')

// 用户角色文本
const userRoleText = computed(() => {
  const role = loginUserStore.loginUser?.userRole
  if (role === 'admin') return '管理员'
  return '普通用户'
})

// 用户表单数据 - 只包含可编辑的字段
const userForm = reactive({
  userName: loginUserStore.loginUser?.userName || '',
  userProfile: loginUserStore.loginUser?.userProfile || ''
})

// 表单校验规则
const rules = {
  userName: [{ required: true, message: '请输入用户昵称', trigger: 'blur' }]
}

// 用户数据统计 - 根据API响应格式调整
const userStats = reactive({
  privateSpaceCount: 0,
  publicSpaceCount: 0,
  teamSpaceCount: 0
})

// 计算总图片数量
const totalPictureCount = computed(() => {
  return Number(userStats.privateSpaceCount || 0) +
    Number(userStats.publicSpaceCount || 0) +
    Number(userStats.teamSpaceCount || 0)
})

// 修改密码相关
const passwordModalVisible = ref(false)
const passwordLoading = ref(false)
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '未知'
  return dayjs(dateString).format('YYYY-MM-DD')
}

// 跳转到我的空间
const navigateToMySpace = () => {
  router.push('/my_space')
}

// 头像上传前检查
const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    message.error('只能上传图片文件!')
    return false
  }

  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('图片大小不能超过2MB!')
    return false
  }

  return true
}

// 处理头像上传 - 正确处理响应和添加刷新逻辑
const handleAvatarChange = async (options) => {
  const { file, onSuccess, onError } = options

  loading.value = true

  try {
    // 用户ID数据
    const avatarData = {
      id: loginUserStore.loginUser?.id
    }

    // 使用上传头像API
    const res = await uploadUserAvatarUsingPost(
      avatarData,
      file
    )

    console.log('Avatar upload response:', res)

    // 检查响应结构 - 保持与之前工作的版本相同
    if (res && res.data) {
      if (res.data.code === 0 && res.data.data) {
        // 从嵌套的data对象中获取用户信息
        const updatedUser = res.data.data
        console.log('Updated user data:', updatedUser)

        // 添加时间戳参数确保浏览器不使用缓存的头像
        let newAvatarUrl = updatedUser.userAvatar
        if (newAvatarUrl) {
          newAvatarUrl = newAvatarUrl.includes('?')
            ? `${newAvatarUrl}&t=${new Date().getTime()}`
            : `${newAvatarUrl}?t=${new Date().getTime()}`
        }

        // 更新本地存储的用户信息 (使用带时间戳的URL)
        loginUserStore.setLoginUser({
          ...loginUserStore.loginUser,
          userAvatar: newAvatarUrl || updatedUser.userAvatar
        })

        message.success('头像更新成功')
        if (onSuccess) onSuccess(res, file)
      } else {
        // API返回了错误
        const errorMsg = res.data.message || '未知错误'
        console.error('API error:', errorMsg)
        message.error('头像上传失败：' + errorMsg)
        if (onError) onError(new Error(errorMsg))
      }
    } else {
      // 响应结构不符合预期
      console.error('Unexpected response structure:', res)
      message.error('头像上传失败：响应格式错误')
      if (onError) onError(new Error('响应格式错误'))
    }
  } catch (error) {
    console.error('头像上传失败', error)
    message.error('头像上传失败，请稍后再试')
    if (onError) onError(error instanceof Error ? error : new Error('上传失败'))
  } finally {
    loading.value = false
  }
}

// 更新用户信息
const updateUserInfo = async () => {
  try {
    loading.value = true

    // 构建请求数据
    const updateData: API.UserVOUpdateRequest = {
      id: loginUserStore.loginUser?.id,
      userName: userForm.userName,
      userProfile: userForm.userProfile,
      userAvatar: loginUserStore.loginUser?.userAvatar
    }

    // 调用新的API接口
    const res = await updateUserInfoUsingPost(updateData)

    if (res.data.code === 0 && res.data.data) {
      // 更新本地存储的用户信息
      loginUserStore.setLoginUser({
        ...loginUserStore.loginUser,
        userName: userForm.userName,
        userProfile: userForm.userProfile
      })

      message.success('个人信息更新成功')
    } else {
      message.error('更新失败：' + (res.data.message || '未知错误'))
    }
  } catch (error) {
    console.error('更新用户信息失败', error)
    message.error('更新失败，请稍后再试')
  } finally {
    loading.value = false
  }
}

// 密码校验
const validatePassword = (rule, value) => {
  if (value && value !== passwordForm.newPassword) {
    return Promise.reject('两次输入的密码不一致')
  }
  return Promise.resolve()
}

// 显示修改密码弹窗
const showPasswordModal = () => {
  passwordModalVisible.value = true
  passwordForm.oldPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
}

// 更新密码
const updatePassword = async () => {
  // 首先验证两次输入的密码是否一致
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    message.error('两次输入的密码不一致')
    return
  }

  // 验证密码长度
  if (passwordForm.newPassword.length < 8) {
    message.error('密码长度不能少于8位')
    return
  }

  try {
    passwordLoading.value = true

    // 构建请求数据
    const passwordData: API.UserPassChangeRequest = {
      userAccount: loginUserStore.loginUser?.userAccount,
      userPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword
    }

    // 调用修改密码API
    const res = await userChangePasswordUsingPost(passwordData)

    if (res.data.code === 0 && res.data.data) {
      message.success('密码修改成功')
      passwordModalVisible.value = false
    } else {
      message.error('修改密码失败：' + (res.data.message || '请检查当前密码是否正确'))
    }
  } catch (error) {
    console.error('修改密码失败', error)
    message.error('修改密码失败，请稍后再试')
  } finally {
    passwordLoading.value = false
  }
}

// 获取用户统计数据 - 根据实际API响应格式调整
const fetchUserStats = async () => {
  if (!loginUserStore.loginUser?.id) {
    return
  }

  try {
    const res = await getUserPictureStatistics({ userId: loginUserStore.loginUser.id })

    if (res.data.code === 0 && res.data.data) {
      // 将API返回的统计数据更新到本地状态
      const statisticsData = res.data.data

      // 直接更新对象属性
      userStats.privateSpaceCount = Number(statisticsData.privateSpaceCount || 0)
      userStats.publicSpaceCount = Number(statisticsData.publicSpaceCount || 0)
      userStats.teamSpaceCount = Number(statisticsData.teamSpaceCount || 0)

      console.log('用户图片统计数据:', statisticsData)
    } else {
      console.error('获取统计数据失败:', res.data.message)
    }
  } catch (error) {
    console.error('获取用户统计数据失败', error)
    message.error('获取统计数据失败，请稍后再试')
  }
}

// 页面加载时获取数据
onMounted(() => {
  // 检查用户是否登录，未登录则跳转到登录页面
  if (!loginUserStore.loginUser?.id) {
    router.replace('/user/login')
    return
  }

  fetchUserStats() // 获取用户图片统计数据
})
</script>

<style scoped>
/* 主要内容背景样式 - 占满除header之外的页面 */
.my-info-container {
  width: 100%;
  min-height: calc(100vh - 64px); /* 减去header高度 */
  padding: 24px;
  background: linear-gradient(140deg, #f5f7fa 0%, #e4e8ef 100%);
  color: #333;
  position: absolute;
  top: 64px; /* 从header底部开始 */
  left: 0;
  right: 0;
  bottom: 0;
  overflow: auto;
}

/* 内容容器样式 */
.info-card {
  max-width: 1200px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.page-header {
  margin-bottom: 32px;
  padding: 20px 24px;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(24, 144, 255, 0.08) 0%, rgba(114, 46, 209, 0.12) 100%);
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
}

.header-content {
  position: relative;
  z-index: 2;
}

.page-header::before {
  content: '';
  position: absolute;
  top: -20px;
  right: -20px;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: rgba(114, 46, 209, 0.08);
  z-index: 1;
}

.title-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  margin-bottom: 12px;
}

.page-header h1 {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 4px;
  background: linear-gradient(90deg, #1890ff, #722ed1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 1px;
}

.header-decoration {
  height: 4px;
  width: 60px;
  background: linear-gradient(90deg, #1890ff, #722ed1);
  border-radius: 2px;
  margin-top: 4px;
}

.page-header p {
  font-size: 16px;
  color: #666;
  margin-left: 2px;
}

.user-profile-card, .user-details-card {
  height: 100%;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.user-profile-card:hover, .user-details-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
}

.user-avatar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
}

.user-avatar {
  margin-bottom: 16px;
  border: 4px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.user-basic-info {
  text-align: center;
}

.user-basic-info h2 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
}

.user-role, .user-join-date, .user-account {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  color: #666;
}

.user-role .anticon, .user-join-date .anticon, .user-account .anticon {
  margin-right: 8px;
}

.my-space-btn {
  margin-top: 16px;
  border-radius: 20px;
  padding: 0 20px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.my-space-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.my-space-btn .anticon {
  margin-right: 8px;
}

.security-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.security-item:last-child {
  border-bottom: none;
}

.security-item-info h3 {
  margin-bottom: 4px;
  font-size: 16px;
  font-weight: 500;
}

.security-item-info p {
  color: #666;
  margin: 0;
}
</style>
