<template>
  <div id="addSpacePage">
    <div class="content-container">
      <!-- 头部标题卡片 -->
      <a-card class="header-card" :bordered="false">
        <div class="page-header">
          <div class="header-content">
            <div class="title-container">
              <h1>
                <span class="action-text">{{ route.query?.id ? '修改' : '创建' }}</span>
                <span class="space-type">{{ SPACE_TYPE_MAP[spaceType] }}</span>
              </h1>
              <div class="header-decoration"></div>
            </div>
            <p>填写空间信息，开始您的云端之旅</p>
          </div>
        </div>
      </a-card>

      <a-row :gutter="[24, 24]">
        <!-- 左侧空间信息表单 -->
        <a-col :xs="24" :md="14">
          <a-card class="form-card" :bordered="false">
            <a-form
              name="spaceForm"
              layout="vertical"
              :model="spaceForm"
              @finish="handleSubmit"
              class="space-form"
            >
              <a-form-item name="spaceName" label="空间名称">
                <a-input
                  v-model:value="spaceForm.spaceName"
                  placeholder="请输入空间名称"
                  allow-clear
                  class="form-input"
                />
              </a-form-item>

              <a-form-item name="spaceLevel" label="空间级别">
                <a-select
                  v-model:value="spaceForm.spaceLevel"
                  placeholder="请选择空间级别"
                  :options="SPACE_LEVEL_OPTIONS"
                  allow-clear
                  class="form-select"
                />
              </a-form-item>

              <a-form-item>
                <a-button
                  type="primary"
                  html-type="submit"
                  :loading="loading"
                  class="submit-button"
                >
                  <template #icon><SaveOutlined /></template>
                  {{ route.query?.id ? '保存修改' : '创建空间' }}
                </a-button>
              </a-form-item>
            </a-form>
          </a-card>
        </a-col>

        <!-- 右侧空间级别介绍 -->
        <a-col :xs="24" :md="10">
          <a-card class="info-card" :bordered="false">
            <template #title>
              <div class="card-title">
                <InfoCircleOutlined />
                <span>空间级别介绍</span>
              </div>
            </template>

            <div class="info-content">
              <a-alert
                type="info"
                show-icon
                class="info-alert"
              >
                <template #message>
                  目前仅支持开通普通版，如需升级空间，请联系
                  <a href="" target="_blank" class="contact-link">MangoYoo</a>
                </template>
              </a-alert>

              <div class="level-list">
                <div
                  v-for="spaceLevel in spaceLevelList"
                  :key="spaceLevel.id"
                  class="level-item"
                >
                  <div class="level-name">{{ spaceLevel.text }}</div>
                  <div class="level-details">
                    <span class="detail-item">
                      <HddOutlined />
                      大小: {{ formatSize(spaceLevel.maxSize) }}
                    </span>
                    <span class="detail-item">
                      <FileOutlined />
                      数量: {{ spaceLevel.maxCount }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import {
  addSpaceUsingPost,
  getSpaceVoByIdUsingGet,
  listSpaceLevelUsingGet,
  updateSpaceUsingPost,
} from '@/api/spaceController.ts'
import { useRoute, useRouter } from 'vue-router'
import {
  SPACE_LEVEL_MAP,
  SPACE_LEVEL_OPTIONS,
  SPACE_TYPE_ENUM,
  SPACE_TYPE_MAP
} from '@/constants/space.ts'
import { formatSize } from '../utils'
import {
  SaveOutlined,
  InfoCircleOutlined,
  HddOutlined,
  FileOutlined
} from '@ant-design/icons-vue'

const space = ref<API.SpaceVO>()
const spaceForm = reactive<API.SpaceAddRequest | API.SpaceEditRequest>({})
const loading = ref(false)

const route = useRoute()
const router = useRouter()

// 空间类别，默认为私有空间
const spaceType = computed(() => {
  if (route.query?.type) {
    return Number(route.query.type)
  } else {
    return SPACE_TYPE_ENUM.PRIVATE
  }
})

const spaceLevelList = ref<API.SpaceLevel[]>([])

// 获取空间级别
const fetchSpaceLevelList = async () => {
  try {
    const res = await listSpaceLevelUsingGet()
    if (res.data.code === 0 && res.data.data) {
      spaceLevelList.value = res.data.data
    } else {
      message.error('获取空间级别失败，' + res.data.message)
    }
  } catch (error) {
    message.error('获取空间级别时发生错误，请稍后重试')
    console.error(error)
  }
}

// 获取老数据
const getOldSpace = async () => {
  // 获取到 id
  const id = route.query?.id
  if (id) {
    try {
      const res = await getSpaceVoByIdUsingGet({
        id,
      })
      if (res.data.code === 0 && res.data.data) {
        const data = res.data.data
        space.value = data
        // 填充表单
        spaceForm.spaceName = data.spaceName
        spaceForm.spaceLevel = data.spaceLevel
      }
    } catch (error) {
      message.error('获取空间信息时发生错误，请稍后重试')
      console.error(error)
    }
  }
}

// 提交表单
const handleSubmit = async (values: any) => {
  // 表单验证
  if (!spaceForm.spaceName) {
    message.warning('请输入空间名称')
    return
  }

  if (!spaceForm.spaceLevel) {
    message.warning('请选择空间级别')
    return
  }

  const spaceId = space.value?.id
  loading.value = true

  try {
    let res
    if (spaceId) {
      // 更新
      res = await updateSpaceUsingPost({
        id: spaceId,
        ...spaceForm,
      })
    } else {
      // 创建
      res = await addSpaceUsingPost({
        ...spaceForm,
        spaceType: spaceType.value,
      })
    }

    // 操作成功
    if (res.data.code === 0 && res.data.data) {
      message.success('操作成功')
      // 跳转到空间详情页
      router.push({
        path: `/space/${res.data.data}`,
      })
    } else {
      message.error('操作失败，' + res.data.message)
    }
  } catch (error) {
    message.error('提交表单时发生错误，请稍后重试')
    console.error(error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchSpaceLevelList()
  getOldSpace()
})
</script>

<style scoped>
#addSpacePage {
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

.content-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* ===== 卡片公共样式 ===== */
.header-card,
.form-card,
.info-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  overflow: hidden;
  width: 100%;
  height: 100%;
  transition: all 0.3s ease;
}

.header-card {
  margin-bottom: 24px;
  padding: 0; /* 移除内边距 */
}

/* 确保page-header占满ant-card-body */
:deep(.header-card .ant-card-body) {
  padding: 0;
  height: 100%;
}

.form-card:hover,
.info-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
}

/* ===== 头部标题样式 ===== */
.page-header {
  padding: 24px 32px;
  background: linear-gradient(135deg, rgba(24, 144, 255, 0.08) 0%, rgba(114, 46, 209, 0.12) 100%);
  position: relative;
  overflow: hidden;
  height: 100%;
  display: flex;
  align-items: center;
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

.header-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.title-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 8px;
}

h1 {
  display: flex;
  align-items: center;
  margin: 0;
  margin-bottom: 4px;
}

.action-text {
  font-size: 18px;
  font-weight: 500;
  color: #1890ff;
  margin-right: 8px;
}

.space-type {
  font-size: 20px;
  font-weight: 600;
  color: #334155;
}

.header-decoration {
  height: 4px;
  width: 60px;
  background: linear-gradient(90deg, #1890ff, #722ed1);
  border-radius: 2px;
  margin-top: 4px;
}

.page-header p {
  font-size: 14px;
  color: #666;
  margin: 0;
}

/* ===== 表单样式 ===== */
.form-card {
  padding: 32px;
  display: flex;
  flex-direction: column;
}

.space-form {
  width: 100%;
  max-width: 480px; /* 适当缩短表单宽度 */
  margin: 0 auto; /* 居中表单 */
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

/* 调整输入框样式 */
.form-input {
  border-radius: 8px;
  transition: all 0.3s;
  width: 100%;
  height: 46px; /* 增加高度使输入框更美观 */
  font-size: 15px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  padding: 10px 16px; /* 增加内边距 */
  border: 1px solid #e6e8f0;
  background-color: white;
}

/* 调整选择框样式 */
:deep(.form-select) {
  width: 100%;
}

:deep(.form-select .ant-select-selector) {
  border-radius: 8px !important;
  height: 46px !important;
  padding: 0 16px !important;
  border: 1px solid #e6e8f0 !important;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04) !important;
  background-color: white !important;
}

:deep(.form-select .ant-select-selection-search) {
  height: 44px !important;
  display: flex;
  align-items: center;
}

:deep(.form-select .ant-select-selection-item) {
  line-height: 44px !important;
  font-size: 15px;
}

:deep(.form-select .ant-select-selection-placeholder) {
  line-height: 44px !important;
  font-size: 15px;
  color: rgba(0, 0, 0, 0.4);
}

/* 调整悬停和聚焦状态 */
.form-input:hover {
  border-color: #1890ff;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.15);
}

.form-input:focus {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

:deep(.form-select:hover .ant-select-selector) {
  border-color: #1890ff !important;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.15) !important;
}

:deep(.form-select.ant-select-focused .ant-select-selector) {
  border-color: #1890ff !important;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2) !important;
}

/* 给表单项添加适当空间 */
:deep(.ant-form-item) {
  margin-bottom: 28px; /* 增加表单项之间的间距 */
}

/* 表单标签样式 */
:deep(.ant-form-item-label > label) {
  font-weight: 500;
  color: #444444;
  font-size: 15px;
  margin-bottom: 4px; /* 增加标签与输入框之间的间距 */
}

.submit-button {
  width: 100%;
  border-radius: 8px;
  height: 46px; /* 与输入框保持一致 */
  font-weight: 500;
  font-size: 16px;
  background: linear-gradient(90deg, #1890ff, #40a9ff); /* 添加渐变效果 */
  border: none;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.25);
  transition: all 0.3s ease;
  margin-top: 12px;
}

.submit-button:hover {
  background: linear-gradient(90deg, #40a9ff, #69c0ff);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(24, 144, 255, 0.35);
}

.submit-button:active {
  background: linear-gradient(90deg, #096dd9, #1890ff);
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.2);
}

/* ===== 空间级别介绍卡片 ===== */
.info-card {
  padding: 0;
  display: flex;
  flex-direction: column;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #334155;
  font-weight: 500;
  font-size: 15px;
  padding: 16px 24px 0;
}

.info-content {
  padding: 16px 24px 24px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.info-alert {
  margin-bottom: 16px;
  border-radius: 8px;
  border: 1px solid #91caff;
  background-color: white;
}

.contact-link {
  color: #1890ff;
  text-decoration: none;
  font-weight: 500;
}

.contact-link:hover {
  text-decoration: underline;
}

.level-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex-grow: 1;
}

.level-item {
  padding: 16px;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(24, 144, 255, 0.15);
  transition: all 0.3s ease;
}

.level-item:hover {
  background-color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
}

.level-name {
  font-weight: 600;
  color: #334155;
  margin-bottom: 10px;
  font-size: 15px;
}

.level-details {
  display: flex;
  gap: 16px;
  color: #647282;
  font-size: 13px;
}

.detail-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

/* 响应式适配 */
@media (max-width: 768px) {
  #addSpacePage {
    padding: 16px;
  }

  .content-container {
    max-width: 100%;
  }

  .page-header {
    padding: 20px;
  }

  .action-text {
    font-size: 16px;
  }

  .space-type {
    font-size: 18px;
  }

  .form-card {
    padding: 24px;
  }

  .space-form {
    max-width: 100%;
  }

  .info-card {
    margin-bottom: 0; /* 移除底部外边距，由栅格系统的gutter控制 */
  }

  .level-details {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
