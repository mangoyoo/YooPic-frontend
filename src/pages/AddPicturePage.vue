<template>
  <div id="addPicturePage">
    <div class="content-container">
      <!-- 头部标题卡片 -->
      <a-card class="header-card" :bordered="false">
        <div class="section-header">
          <span class="section-title">
            {{ route.query?.id ? '修改图片' : '创建图片' }}
          </span>
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
/*
 * 全局颜色定义
 * 主题背景色：#87CEFA (Light Sky Blue)
 * 卡片背景色：#F0F8FF (Alice Blue)
 * 文本主色：#333333
 * 文本副色：#666666
 * 分割线颜色：#E8E8E8
 */

#addPicturePage {
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
.upload-card,
.edit-card,
.form-card {
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

.space-link {
  margin: 0 0 0 8px;
  padding: 0;
  color: #666666;
}

/* ===== 上传选项卡样式 ===== */
.upload-card {
  padding: 16px;
}

.upload-tabs :deep(.ant-tabs-nav) {
  margin-bottom: 16px;
}

.upload-tabs :deep(.ant-tabs-tab) {
  padding: 8px 16px;
}

.upload-tabs :deep(.ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn) {
  color: #87CEFA;
}

.upload-tabs :deep(.ant-tabs-ink-bar) {
  background-color: #87CEFA;
}

/* ===== 编辑工具栏样式 ===== */
.edit-card {
  padding: 16px;
}

.edit-bar {
  display: flex;
  justify-content: center;
  margin: 8px 0;
}

.edit-button,
.ai-button {
  height: 38px;
  border-radius: 4px;
  transition: all 0.3s;
}

.ai-button {
  background-color: #87CEFA;
  border-color: #87CEFA;
}

.ai-button:hover {
  background-color: #75bdea;
  border-color: #75bdea;
}

/* ===== 表单样式 ===== */
.form-card {
  padding: 24px;
}

.picture-form {
  width: 100%;
}

.form-input,
.form-textarea,
.form-select {
  border-radius: 4px;
  transition: all 0.3s;
  width: 100%;
}

.form-input:hover,
.form-textarea:hover,
.form-select:hover {
  border-color: #87CEFA;
}

.form-input:focus,
.form-textarea:focus,
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

/* 响应式适配 */
@media (max-width: 768px) {
  #addPicturePage {
    padding: 12px;
  }

  .form-card,
  .edit-card,
  .upload-card {
    padding: 16px;
  }
}
</style>
