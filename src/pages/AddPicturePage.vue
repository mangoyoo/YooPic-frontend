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
  min-height: calc(100vh - 64px);
  padding: 24px;
  background: linear-gradient(140deg, #f5f7fa 0%, #e4e8ef 100%);
  position: absolute;
  top: 64px;
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
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  margin-bottom: 24px;
  transition: all 0.3s ease;
}

.header-card:hover,
.upload-card:hover,
.edit-card:hover,
.form-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
}

/* ===== 头部标题样式 ===== */
.header-card {
  padding: 24px;
}

.section-header {
  display: flex;
  align-items: center;
  padding: 16px 0;
}

.title-container {
  display: flex;
  flex-direction: column;
  margin-right: 24px;
}

.title-container h1 {
  font-size: 28px;
  font-weight: 600;
  background: linear-gradient(90deg, #1890ff, #722ed1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
}

.header-decoration {
  height: 4px;
  width: 60px;
  background: linear-gradient(90deg, #1890ff, #722ed1);
  border-radius: 2px;
  margin-top: 8px;
}

.space-link {
  margin: 0;
  color: #666;
  font-size: 14px;
}

/* ===== 上传选项卡样式 ===== */
.upload-card {
  padding: 24px;
}

.upload-tabs :deep(.ant-tabs-nav) {
  margin: 0;
}

.upload-tabs :deep(.ant-tabs-tab) {
  padding: 12px 24px;
  font-size: 15px;
}

.upload-tabs :deep(.ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn) {
  color: #1890ff;
}

.upload-tabs :deep(.ant-tabs-ink-bar) {
  background: linear-gradient(90deg, #1890ff, #722ed1);
}

/* ===== 编辑工具栏样式 ===== */
.edit-card {
  padding: 24px;
}

.edit-bar {
  margin: 16px 0;
}

.edit-button,
.ai-button {
  height: 40px;
  border-radius: 6px;
  padding: 0 24px;
  transition: all 0.3s;
}

.ai-button {
  background: linear-gradient(90deg, #1890ff, #722ed1);
  border: none;
}

.ai-button:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

/* ===== 表单样式 ===== */
.form-card {
  padding: 32px;
}

.picture-form {
  width: 100%;
}

.form-input,
.form-textarea,
.form-select {
  border-radius: 6px;
  border: 1px solid #d9d9d9;
  transition: all 0.3s;
}

.form-input:hover,
.form-textarea:hover,
.form-select:hover {
  border-color: #1890ff;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.submit-button {
  width: 100%;
  height: 44px;
  border-radius: 6px;
  background: linear-gradient(90deg, #1890ff, #722ed1);
  border: none;
  font-size: 16px;
  transition: all 0.3s;
}

.submit-button:hover {
  opacity: 0.9;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
}

/* 响应式适配 */
@media (max-width: 768px) {
  #addPicturePage {
    padding: 16px;
  }

  .header-card,
  .upload-card,
  .edit-card,
  .form-card {
    padding: 16px;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .title-container h1 {
    font-size: 24px;
  }
}
</style>
