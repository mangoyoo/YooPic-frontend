<template>
  <div id="addPictureBatchPage">
    <div class="content-container">
      <!-- 头部标题卡片 -->
      <a-card class="header-card" :bordered="false">
        <div class="page-header">
          <div class="header-content">
            <div class="title-container">
              <h1>
                <span class="action-text">批量</span>
                <span class="space-type">创建图片</span>
              </h1>
              <div class="header-decoration"></div>
            </div>
            <p>使用关键词批量抓取图片，快速丰富您的图库</p>
          </div>
        </div>
      </a-card>

      <a-row :gutter="[24, 24]">
        <!-- 左侧图片信息表单 -->
        <a-col :xs="24" :md="14">
          <a-card class="form-card" :bordered="false">
            <a-form
              name="formData"
              layout="vertical"
              :model="formData"
              @finish="handleSubmit"
              class="batch-form"
            >
              <a-form-item name="searchText" label="关键词">
                <a-input
                  v-model:value="formData.searchText"
                  placeholder="请输入关键词"
                  allow-clear
                  class="form-input"
                />
              </a-form-item>

              <a-form-item name="count" label="抓取数量">
                <a-input-number
                  v-model:value="formData.count"
                  placeholder="请输入数量"
                  :min="1"
                  :max="30"
                  allow-clear
                  class="form-input"
                  style="width: 100%"
                />
              </a-form-item>

              <a-form-item name="namePrefix" label="名称前缀">
                <a-input
                  v-model:value="formData.namePrefix"
                  placeholder="请输入名称前缀，会自动补充序号"
                  allow-clear
                  class="form-input"
                />
              </a-form-item>

              <a-form-item name="category" label="分类">
                <a-auto-complete
                  v-model:value="formData.category"
                  placeholder="请输入分类"
                  :options="categoryOptions"
                  allow-clear
                  class="form-auto-complete"
                />
              </a-form-item>

              <a-form-item name="tags" label="标签">
                <a-select
                  v-model:value="formData.tags"
                  mode="tags"
                  placeholder="请输入标签，回车分隔"
                  :options="tagOptions"
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
                  <template #icon><ThunderboltOutlined /></template>
                  执行任务
                </a-button>
              </a-form-item>
            </a-form>
          </a-card>
        </a-col>

        <!-- 右侧任务说明 -->
        <a-col :xs="24" :md="10">
          <a-card class="info-card" :bordered="false">
            <template #title>
              <div class="card-title">
                <InfoCircleOutlined />
                <span>批量创建说明</span>
              </div>
            </template>

            <div class="info-content">
              <a-alert
                type="info"
                show-icon
                class="info-alert"
              >
                <template #message>
                  系统将自动抓取图片并上传到您的图库，请确保关键词准确
                </template>
              </a-alert>

              <div class="tips-list">
                <div class="tips-item">
                  <div class="tips-title">
                    <SearchOutlined />
                    <span>关键词提示</span>
                  </div>
                  <p>使用精确的关键词可以获得更相关的图片，建议使用2-3个词组合</p>
                </div>

                <div class="tips-item">
                  <div class="tips-title">
                    <NumberOutlined />
                    <span>数量建议</span>
                  </div>
                  <p>单次抓取建议不超过20张，避免任务执行时间过长</p>
                </div>

                <div class="tips-item">
                  <div class="tips-title">
                    <FontSizeOutlined />
                    <span>命名规则</span>
                  </div>
                  <p>系统将使用"前缀_序号"格式命名图片，如：风景_01、风景_02</p>
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
import { onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import {
  getPictureVoByIdUsingGet,
  listPictureTagCategoryUsingGet,
  uploadPictureByBatchUsingPost,
} from '@/api/pictureController.ts'
import { useRoute, useRouter } from 'vue-router'
import {
  ThunderboltOutlined,
  InfoCircleOutlined,
  SearchOutlined,
  NumberOutlined,
  FontSizeOutlined
} from '@ant-design/icons-vue'

const formData = reactive<API.PictureUploadByBatchRequest>({
  count: 10,
})
// 提交任务状态
const loading = ref(false)

// 分类选项
const categoryOptions = ref<any[]>([])
// 标签选项
const tagOptions = ref<any[]>([])

const router = useRouter()

// 获取分类和标签选项
const fetchCategoryAndTags = async () => {
  try {
    const res = await listPictureTagCategoryUsingGet()
    if (res.data.code === 0 && res.data.data) {
      categoryOptions.value = (res.data.data.categoryList || []).map((data: string) => {
        return {
          value: data,
          label: data,
        }
      })
      tagOptions.value = (res.data.data.tagList || []).map((data: string) => {
        return {
          value: data,
          label: data,
        }
      })
    }
  } catch (error) {
    console.error('获取分类和标签失败', error)
  }
}

onMounted(() => {
  fetchCategoryAndTags()
})

/**
 * 提交表单
 * @param values
 */
const handleSubmit = async (values: any) => {
  // 表单验证
  if (!formData.searchText) {
    message.warning('请输入关键词')
    return
  }

  loading.value = true
  try {
    const res = await uploadPictureByBatchUsingPost({
      ...formData,
    })
    // 操作成功
    if (res.data.code === 0 && res.data.data) {
      message.success(`创建成功，共 ${res.data.data} 条`)
      // 跳转到主页
      router.push({
        path: `/`,
      })
    } else {
      message.error('创建失败，' + res.data.message)
    }
  } catch (error) {
    message.error('任务执行时发生错误，请稍后重试')
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
#addPictureBatchPage {
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

.batch-form {
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

/* 调整 AutoComplete 样式 */
.form-auto-complete {
  width: 100%;
}

:deep(.form-auto-complete .ant-select-selector) {
  border-radius: 8px !important;
  height: 46px !important;
  padding: 0 16px !important;
  border: 1px solid #e6e8f0 !important;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04) !important;
  background-color: white !important;
  display: flex !important;
  align-items: center !important;
}

:deep(.form-auto-complete .ant-select-selection-search) {
  left: 16px !important;
  right: 16px !important;
}

:deep(.form-auto-complete .ant-select-selection-search-input) {
  height: 44px !important;
  font-size: 15px !important;
}

:deep(.form-auto-complete .ant-select-selection-placeholder) {
  padding-left: 0 !important;
  line-height: 46px !important;
  font-size: 15px;
  color: rgba(0, 0, 0, 0.4);
}

:deep(.form-auto-complete:hover .ant-select-selector) {
  border-color: #1890ff !important;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.15) !important;
}

:deep(.form-auto-complete.ant-select-focused .ant-select-selector) {
  border-color: #1890ff !important;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2) !important;
}

/* 调整选择框样式 */
:deep(.form-select) {
  width: 100%;
}

:deep(.form-select .ant-select-selector) {
  border-radius: 8px !important;
  min-height: 46px !important;
  padding: 0 16px !important;
  border: 1px solid #e6e8f0 !important;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04) !important;
  background-color: white !important;
}

:deep(.form-select .ant-select-selection-search) {
  height: 44px !important;
  display: flex;
  align-items: center;
  margin-left: 0 !important;
  left: 16px !important;
}

:deep(.form-select .ant-select-selection-item) {
  font-size: 15px;
  margin-top: 8px !important;
}

:deep(.form-select .ant-select-selection-placeholder) {
  font-size: 15px;
  color: rgba(0, 0, 0, 0.4);
  padding-left: 0 !important;
  line-height: 46px !important;
}

/* 调整输入框悬停和聚焦状态 */
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

/* ===== 右侧说明卡片 ===== */
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

.tips-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex-grow: 1;
}

.tips-item {
  padding: 16px;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(24, 144, 255, 0.15);
  transition: all 0.3s ease;
}

.tips-item:hover {
  background-color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
}

.tips-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 10px;
  font-size: 15px;
}

.tips-item p {
  color: #647282;
  font-size: 13px;
  margin: 0;
  line-height: 1.6;
}

/* 响应式适配 */
@media (max-width: 768px) {
  #addPictureBatchPage {
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

  .batch-form {
    max-width: 100%;
  }
}
</style>
