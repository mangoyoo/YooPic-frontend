<template>
  <div id="addPicturePage">
    <div class="content-container">
      <!-- 头部标题卡片 -->
      <a-card class="header-card" :bordered="false">
        <div class="section-header">
          <div class="title-container">
            <h1>{{ route.query?.id ? '修改图片' : '创建图片' }}</h1>
            <div class="header-decoration"></div>
          </div>
          <a-divider type="vertical" />
          <a-typography-paragraph v-if="spaceId" class="space-link">
            保存至空间：<a :href="`/space/${spaceId}`" target="_blank">{{ spaceId }}</a>
          </a-typography-paragraph>
        </div>
      </a-card>

      <!-- 上传类型选择 -->
      <a-card class="upload-card" :bordered="false">
        <a-tabs v-model:activeKey="uploadType" class="upload-tabs">
          <a-tab-pane key="file" tab="文件上传">
            <!-- 图片上传组件 -->
            <PictureUpload :picture="picture" :spaceId="spaceId" :onSuccess="onSuccess" />
          </a-tab-pane>
          <a-tab-pane key="url" tab="URL 上传" force-render>
            <!-- URL 图片上传组件 -->
            <UrlPictureUpload :picture="picture" :spaceId="spaceId" :onSuccess="onSuccess" />
          </a-tab-pane>
        </a-tabs>
      </a-card>

      <!-- 图片编辑工具栏 -->
      <a-card v-if="picture" class="edit-card" :bordered="false">
        <div class="edit-bar">
          <a-space size="middle">
            <a-button :icon="h(EditOutlined)" @click="doEditPicture" class="edit-button">
              编辑图片
            </a-button>
            <a-button
              type="primary"
              :icon="h(FullscreenOutlined)"
              @click="doImagePainting"
              class="ai-button"
            >
              AI 扩图
            </a-button>
          </a-space>
        </div>
        <ImageCropper
          ref="imageCropperRef"
          :imageUrl="picture?.url"
          :picture="picture"
          :spaceId="spaceId"
          :space="space"
          :onSuccess="onCropSuccess"
        />
        <ImageOutPainting
          ref="imageOutPaintingRef"
          :picture="picture"
          :spaceId="spaceId"
          :onSuccess="onImageOutPaintingSuccess"
        />
      </a-card>

      <!-- 图片信息表单 -->
      <a-card v-if="picture" class="form-card" :bordered="false">
        <a-form
          name="pictureForm"
          layout="vertical"
          :model="pictureForm"
          @finish="handleSubmit"
          class="picture-form"
        >
          <a-form-item name="name" label="名称">
            <a-input
              v-model:value="pictureForm.name"
              placeholder="请输入名称"
              allow-clear
              class="form-input"
            />
          </a-form-item>

          <a-form-item name="introduction" label="简介">
            <a-textarea
              v-model:value="pictureForm.introduction"
              placeholder="请输入简介"
              :auto-size="{ minRows: 2, maxRows: 5 }"
              allow-clear
              class="form-textarea"
            />
          </a-form-item>

          <a-form-item name="category" label="分类">
            <a-auto-complete
              v-model:value="pictureForm.category"
              placeholder="请输入分类"
              :options="categoryOptions"
              allow-clear
              class="form-input"
            />
          </a-form-item>

          <a-form-item name="tags" label="标签">
            <a-select
              v-model:value="pictureForm.tags"
              mode="tags"
              placeholder="请输入标签"
              :options="tagOptions"
              allow-clear
              class="form-select"
            />
          </a-form-item>

          <a-form-item>
            <a-button
              type="primary"
              html-type="submit"
              class="submit-button"
            >
              {{ route.query?.id ? '保存修改' : '创建图片' }}
            </a-button>
          </a-form-item>
        </a-form>
      </a-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import PictureUpload from '@/components/PictureUpload.vue'
import { computed, h, onMounted, reactive, ref, watchEffect } from 'vue'
import { message } from 'ant-design-vue'
import {
  editPictureUsingPost,
  getPictureVoByIdUsingGet,
  listPictureTagCategoryUsingGet,
} from '@/api/pictureController.ts'
import { useRoute, useRouter } from 'vue-router'
import UrlPictureUpload from '@/components/UrlPictureUpload.vue'
import ImageCropper from '@/components/ImageCropper.vue'
import { EditOutlined, FullscreenOutlined } from '@ant-design/icons-vue'
import ImageOutPainting from '@/components/ImageOutPainting.vue'
import { getSpaceVoByIdUsingGet } from '@/api/spaceController.ts'

const router = useRouter()
const route = useRoute()

const picture = ref<API.PictureVO>()
const pictureForm = reactive<API.PictureEditRequest>({})
const uploadType = ref<'file' | 'url'>('file')
// 空间 id
const spaceId = computed(() => {
  return route.query?.spaceId
})

/**
 * 图片上传成功
 * @param newPicture
 */
const onSuccess = (newPicture: API.PictureVO) => {
  picture.value = newPicture
  pictureForm.name = newPicture.name
}

/**
 * 提交表单
 * @param values
 */
const handleSubmit = async (values: any) => {
  console.log(values)
  const pictureId = picture.value.id
  if (!pictureId) {
    return
  }
  const res = await editPictureUsingPost({
    id: pictureId,
    spaceId: spaceId.value,
    ...values,
  })
  // 操作成功
  if (res.data.code === 0 && res.data.data) {
    message.success('创建成功')
    // 跳转到图片详情页
    router.push({
      path: `/picture/${pictureId}`,
    })
  } else {
    message.error('创建失败，' + res.data.message)
  }
}

const categoryOptions = ref<string[]>([])
const tagOptions = ref<string[]>([])

/**
 * 获取标签和分类选项
 * @param values
 */
const getTagCategoryOptions = async () => {
  const res = await listPictureTagCategoryUsingGet()
  if (res.data.code === 0 && res.data.data) {
    tagOptions.value = (res.data.data.tagList ?? []).map((data: string) => {
      return {
        value: data,
        label: data,
      }
    })
    categoryOptions.value = (res.data.data.categoryList ?? []).map((data: string) => {
      return {
        value: data,
        label: data,
      }
    })
  } else {
    message.error('获取标签分类列表失败，' + res.data.message)
  }
}

onMounted(() => {
  getTagCategoryOptions()
})

// 获取老数据
const getOldPicture = async () => {
  // 获取到 id
  const id = route.query?.id
  if (id) {
    const res = await getPictureVoByIdUsingGet({
      id,
    })
    if (res.data.code === 0 && res.data.data) {
      const data = res.data.data
      picture.value = data
      pictureForm.name = data.name
      pictureForm.introduction = data.introduction
      pictureForm.category = data.category
      pictureForm.tags = data.tags
    }
  }
}

onMounted(() => {
  getOldPicture()
})

// ----- 图片编辑器引用 ------
const imageCropperRef = ref()

// 编辑图片
const doEditPicture = async () => {
  imageCropperRef.value?.openModal()
}

// 编辑成功事件
const onCropSuccess = (newPicture: API.PictureVO) => {
  picture.value = newPicture
}

// ----- AI 扩图引用 -----
const imageOutPaintingRef = ref()

// 打开 AI 扩图弹窗
const doImagePainting = async () => {
  imageOutPaintingRef.value?.openModal()
}

// AI 扩图保存事件
const onImageOutPaintingSuccess = (newPicture: API.PictureVO) => {
  picture.value = newPicture
}

// 获取空间信息
const space = ref<API.SpaceVO>()

// 获取空间信息
const fetchSpace = async () => {
  // 获取数据
  if (spaceId.value) {
    const res = await getSpaceVoByIdUsingGet({
      id: spaceId.value,
    })
    if (res.data.code === 0 && res.data.data) {
      space.value = res.data.data
    }
  }
}

watchEffect(() => {
  fetchSpace()
})
</script>

<style scoped>
#addPicturePage {
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
.upload-card,
.edit-card,
.form-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  overflow: hidden;
  width: 100%;
  margin-bottom: 24px;
  transition: all 0.3s ease;
}

.header-card {
  padding: 0; /* 移除内边距 */
}

/* 确保section-header占满ant-card-body */
:deep(.header-card .ant-card-body) {
  padding: 0;
  height: 100%;
}

.upload-card:hover,
.edit-card:hover,
.form-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
}

/* ===== 头部标题样式 ===== */
.section-header {
  padding: 24px 32px;
  background: linear-gradient(135deg, rgba(24, 144, 255, 0.08) 0%, rgba(114, 46, 209, 0.12) 100%);
  position: relative;
  overflow: hidden;
  height: 100%;
  display: flex;
  align-items: center;
}

.section-header::before {
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
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-right: 24px;
}

.title-container h1 {
  font-size: 20px;
  font-weight: 600;
  color: #334155;
  margin: 0;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
}

.header-decoration {
  height: 4px;
  width: 60px;
  background: linear-gradient(90deg, #1890ff, #722ed1);
  border-radius: 2px;
  margin-top: 4px;
}

.space-link {
  position: relative;
  z-index: 2;
  margin: 0 !important;
  color: #666;
  font-size: 14px;
}

/* ===== 上传选项卡样式 ===== */
.upload-card {
  padding: 24px;
}

.upload-tabs :deep(.ant-tabs-nav) {
  margin-bottom: 24px;
}

.upload-tabs :deep(.ant-tabs-tab) {
  padding: 12px 24px;
  font-size: 15px;
  transition: all 0.3s;
}

.upload-tabs :deep(.ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn) {
  color: #1890ff;
  font-weight: 500;
}

.upload-tabs :deep(.ant-tabs-ink-bar) {
  background: linear-gradient(90deg, #1890ff, #722ed1);
  height: 3px;
}

/* ===== 编辑工具栏样式 ===== */
.edit-card {
  padding: 24px;
}

.edit-bar {
  margin: 0 0 24px 0;
}

.edit-button {
  height: 40px;
  border-radius: 8px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  transition: all 0.3s;
  border: 1px solid #d9d9d9;
}

.edit-button:hover {
  border-color: #1890ff;
  color: #1890ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.ai-button {
  height: 40px;
  border-radius: 8px;
  padding: 0 20px;
  font-weight: 500;
  background: linear-gradient(90deg, #1890ff, #40a9ff);
  border: none;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.25);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ai-button:hover {
  background: linear-gradient(90deg, #40a9ff, #69c0ff);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(24, 144, 255, 0.35);
}

.ai-button:active {
  background: linear-gradient(90deg, #096dd9, #1890ff);
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.2);
}

/* ===== 表单样式 ===== */
.form-card {
  padding: 32px;
}

.picture-form {
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
}

/* 调整输入框样式 */
.form-input,
.form-textarea {
  border-radius: 8px;
  transition: all 0.3s;
  width: 100%;
  font-size: 15px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  padding: 10px 16px; /* 增加内边距 */
  border: 1px solid #e6e8f0;
  background-color: white;
}

.form-input {
  height: 46px; /* 增加高度使输入框更美观 */
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
}

:deep(.form-select .ant-select-selection-item) {
  font-size: 15px;
}

:deep(.form-select .ant-select-selection-placeholder) {
  font-size: 15px;
  color: rgba(0, 0, 0, 0.4);
}

/* 调整悬停和聚焦状态 */
.form-input:hover,
.form-textarea:hover {
  border-color: #1890ff;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.15);
}

.form-input:focus,
.form-textarea:focus {
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

/* 响应式适配 */
@media (max-width: 768px) {
  #addPicturePage {
    padding: 16px;
  }

  .content-container {
    max-width: 100%;
  }

  .section-header {
    padding: 20px;
    flex-direction: column;
    align-items: flex-start;
  }

  .title-container {
    margin-bottom: 16px;
    margin-right: 0;
  }

  .upload-card,
  .edit-card,
  .form-card {
    padding: 20px;
  }

  .picture-form {
    max-width: 100%;
  }

  .edit-bar {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .edit-bar .ant-space {
    width: 100%;
    display: flex !important;
    flex-direction: column;
    gap: 12px !important;
  }

  .edit-button,
  .ai-button {
    width: 100%;
  }
}
</style>
