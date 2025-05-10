<template>
  <div id="addSpacePage">
    <div class="content-container">
      <!-- 头部标题卡片 -->
      <a-card class="header-card" :bordered="false">
        <div class="section-header">
          <span class="section-title">
            {{ route.query?.id ? '修改' : '创建' }} {{ SPACE_TYPE_MAP[spaceType] }}
          </span>
          <a-divider type="vertical" />
        </div>
      </a-card>

      <!-- 空间信息表单 -->
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

      <!-- 空间级别介绍 -->
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
/*
 * 全局颜色定义
 * 主题背景色：#87CEFA (Light Sky Blue)
 * 卡片背景色：#F0F8FF (Alice Blue)
 * 文本主色：#333333
 * 文本副色：#666666
 * 分割线颜色：#E8E8E8
 */

#addSpacePage {
  width: 100%;
  min-height: 100vh;
  padding: 20px;
  background-color: #f7fafd;
  color: #333333;
  display: flex;
  justify-content: center;
}

.content-container {
  width: 100%;
  max-width: 720px; /* 限制内容区域最大宽度 */
  display: flex;
  flex-direction: column;
}

/* ===== 卡片公共样式 ===== */
.header-card,
.form-card,
.info-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  background-color: #F0F8FF;
  overflow: hidden;
  margin-bottom: 16px;
  width: 100%;
}

/* ===== 头部标题样式 ===== */
.header-card {
  padding: 16px;
}

.section-header {
  display: flex;
  align-items: center;
}

.section-title {
  font-size: 18px;
  font-weight: 500;
  color: #333333;
  position: relative;
  padding-left: 10px;
}

.section-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 18px;
  background-color: #87CEFA;
  border-radius: 1.5px;
}

/* ===== 表单样式 ===== */
.form-card {
  padding: 24px;
}

.space-form {
  width: 100%;
}

.form-input,
.form-select {
  border-radius: 4px;
  transition: all 0.3s;
  width: 100%;
}

.form-input:hover,
.form-select:hover {
  border-color: #87CEFA;
}

.form-input:focus,
.form-select:focus {
  border-color: #87CEFA;
  box-shadow: 0 0 0 2px rgba(135, 206, 250, 0.2);
}

.submit-button {
  width: 100%;
  border-radius: 4px;
  height: 40px;
  font-weight: 500;
  background-color: #87CEFA;
  border-color: #87CEFA;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.submit-button:hover {
  background-color: #75bdea;
  border-color: #75bdea;
}

/* ===== 空间级别介绍卡片 ===== */
.info-card {
  padding: 0;
  flex-grow: 0; /* 不要自动拉伸 */
}

.card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #333333;
  font-weight: 500;
}

.info-content {
  padding: 16px;
}

.info-alert {
  margin-bottom: 16px;
  border-radius: 4px;
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
}

.level-item {
  padding: 12px;
  border-radius: 8px;
  background-color: rgba(135, 206, 250, 0.05);
  border: 1px solid rgba(135, 206, 250, 0.2);
  transition: all 0.3s ease;
}

.level-item:hover {
  background-color: rgba(135, 206, 250, 0.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.level-name {
  font-weight: 500;
  color: #333333;
  margin-bottom: 8px;
  font-size: 15px;
}

.level-details {
  display: flex;
  gap: 16px;
  color: #666666;
  font-size: 14px;
}

.detail-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

/* 响应式适配 */
@media (max-width: 768px) {
  #addSpacePage {
    padding: 12px;
  }

  .form-card {
    padding: 16px;
  }

  .level-details {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
