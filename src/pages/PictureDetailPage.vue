<template>
  <div id="pictureDetailPage">
    <div class="content-container">
      <!-- 头部标题卡片 -->
      <a-card class="header-card" :bordered="false">
        <div class="page-header">
          <div class="header-content">
            <div class="title-container">
              <h1>
                <span class="action-text">图片</span>
                <span class="space-type">详情</span>
              </h1>
              <div class="header-decoration"></div>
            </div>
            <p>探索精彩图片，发现创意灵感</p>
          </div>
        </div>
      </a-card>

      <a-row :gutter="[24, 24]">
        <!-- 图片预览 -->
        <a-col :xs="24" :md="16" :xl="18">
          <a-card class="preview-card" :bordered="false" title="图片预览">
            <a-image :src="picture.url" class="preview-image" />
          </a-card>
        </a-col>

        <!-- 图片信息区域 -->
        <a-col :xs="24" :md="8" :xl="6">
          <a-card class="info-card" :bordered="false">
            <template #title>
              <div class="card-title">
                <InfoCircleOutlined />
                <span>图片信息</span>
              </div>
            </template>

            <div class="info-content">
              <a-descriptions :column="1">
                <a-descriptions-item label="作者">
                  <a-space>
                    <a-avatar :size="24" :src="picture.user?.userAvatar" />
                    <div class="author-name">{{ picture.user?.userName }}</div>
                  </a-space>
                </a-descriptions-item>
                <a-descriptions-item label="名称">
                  {{ picture.name ?? '未命名' }}
                </a-descriptions-item>
                <a-descriptions-item label="简介">
                  {{ picture.introduction ?? '-' }}
                </a-descriptions-item>
                <a-descriptions-item label="分类">
                  {{ picture.category ?? '默认' }}
                </a-descriptions-item>
                <a-descriptions-item label="标签">
                  <a-tag v-for="tag in picture.tags" :key="tag" class="picture-tag">
                    {{ tag }}
                  </a-tag>
                </a-descriptions-item>
                <a-descriptions-item label="格式">
                  {{ picture.picFormat ?? '-' }}
                </a-descriptions-item>
                <a-descriptions-item label="宽度">
                  {{ picture.picWidth ?? '-' }}
                </a-descriptions-item>
                <a-descriptions-item label="高度">
                  {{ picture.picHeight ?? '-' }}
                </a-descriptions-item>
                <a-descriptions-item label="宽高比">
                  {{ picture.picScale ?? '-' }}
                </a-descriptions-item>
                <a-descriptions-item label="大小">
                  {{ formatSize(picture.picSize) }}
                </a-descriptions-item>
                <a-descriptions-item label="主色调">
                  <a-space>
                    {{ picture.picColor ?? '-' }}
                    <div
                      v-if="picture.picColor"
                      class="color-preview"
                      :style="{ backgroundColor: toHexColor(picture.picColor) }"
                    />
                  </a-space>
                </a-descriptions-item>
              </a-descriptions>

              <!-- 图片操作 -->
              <div class="action-buttons">
                <a-button type="primary" class="action-btn download-btn" @click="doDownload">
                  <template #icon><DownloadOutlined /></template>
                  免费下载
                </a-button>
                <a-button
                  type="primary"
                  ghost
                  class="action-btn share-btn"
                  @click="doShare"
                >
                  <template #icon><ShareAltOutlined /></template>
                  分享
                </a-button>
                <a-button
                  v-if="canEdit"
                  type="default"
                  class="action-btn edit-btn"
                  @click="doEdit"
                >
                  <template #icon><EditOutlined /></template>
                  编辑
                </a-button>
                <a-button
                  v-if="canDelete"
                  danger
                  class="action-btn delete-btn"
                  @click="doDelete"
                >
                  <template #icon><DeleteOutlined /></template>
                  删除
                </a-button>
              </div>
            </div>
          </a-card>
        </a-col>
      </a-row>
      <ShareModal ref="shareModalRef" :link="shareLink" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, h, onMounted, ref } from 'vue'
import { deletePictureUsingPost, getPictureVoByIdUsingGet } from '@/api/pictureController.ts'
import { message } from 'ant-design-vue'
import {
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  ShareAltOutlined,
  InfoCircleOutlined
} from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import { downloadImage, formatSize, toHexColor } from '@/utils'
import ShareModal from '@/components/ShareModal.vue'
import { SPACE_PERMISSION_ENUM } from '@/constants/space.ts'

interface Props {
  id: string | number
}

const props = defineProps<Props>()
const picture = ref<API.PictureVO>({})

// 通用权限检查函数
function createPermissionChecker(permission: string) {
  return computed(() => {
    return (picture.value.permissionList ?? []).includes(permission)
  })
}

// 定义权限检查
const canEdit = createPermissionChecker(SPACE_PERMISSION_ENUM.PICTURE_EDIT)
const canDelete = createPermissionChecker(SPACE_PERMISSION_ENUM.PICTURE_DELETE)

// 获取图片详情
const fetchPictureDetail = async () => {
  try {
    const res = await getPictureVoByIdUsingGet({
      id: props.id,
    })
    if (res.data.code === 0 && res.data.data) {
      picture.value = res.data.data
    } else {
      message.error('获取图片详情失败，' + res.data.message)
    }
  } catch (e: any) {
    message.error('获取图片详情失败：' + e.message)
  }
}

onMounted(() => {
  fetchPictureDetail()
})

const router = useRouter()

// 编辑
const doEdit = () => {
  router.push({
    path: '/add_picture',
    query: {
      id: picture.value.id,
      spaceId: picture.value.spaceId,
    },
  })
}

// 删除数据
const doDelete = async () => {
  const id = picture.value.id
  if (!id) {
    return
  }
  const res = await deletePictureUsingPost({ id })
  if (res.data.code === 0) {
    message.success('删除成功')
    router.push('/my_pictures')
  } else {
    message.error('删除失败')
  }
}

// 下载图片
const doDownload = () => {
  downloadImage(picture.value.url)
}

// ----- 分享操作 ----
const shareModalRef = ref()
// 分享链接
const shareLink = ref<string>()
// 分享
const doShare = () => {
  shareLink.value = `${window.location.protocol}//${window.location.host}/picture/${picture.value.id}`
  if (shareModalRef.value) {
    shareModalRef.value.openModal()
  }
}
</script>

<style scoped>
#pictureDetailPage {
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
.preview-card,
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

.preview-card:hover,
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

/* ===== 图片预览样式 ===== */
.preview-card {
  display: flex;
  flex-direction: column;
}

:deep(.preview-card .ant-card-head) {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  padding: 0 24px;
}

:deep(.preview-card .ant-card-head-title) {
  font-size: 16px;
  font-weight: 500;
  color: #334155;
}

:deep(.preview-card .ant-card-body) {
  padding: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
}

.preview-image {
  max-height: 400px;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease;
}

:deep(.preview-image:hover) {
  transform: scale(1.01);
}

/* ===== 信息卡片样式 ===== */
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
}

.info-content {
  padding: 8px 24px 24px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

:deep(.ant-descriptions-item-label) {
  color: #647282;
  font-weight: 500;
  padding-right: 16px;
}

:deep(.ant-descriptions-item-content) {
  color: #334155;
}

.author-name {
  font-weight: 500;
}

.picture-tag {
  margin: 2px;
  border-radius: 4px;
}

.color-preview {
  width: 18px;
  height: 18px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

/* ===== 操作按钮样式 ===== */
.action-buttons {
  margin-top: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.action-btn {
  border-radius: 8px;
  height: 40px;
  font-weight: 500;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  flex: 1 0 calc(50% - 6px);
  min-width: 120px;
}

.download-btn {
  background: linear-gradient(90deg, #1890ff, #40a9ff);
  border: none;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.25);
}

.download-btn:hover {
  background: linear-gradient(90deg, #40a9ff, #69c0ff);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(24, 144, 255, 0.35);
}

.download-btn:active {
  background: linear-gradient(90deg, #096dd9, #1890ff);
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.2);
}

.share-btn:hover,
.edit-btn:hover,
.delete-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.share-btn:active,
.edit-btn:active,
.delete-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

/* 响应式适配 */
@media (max-width: 768px) {
  #pictureDetailPage {
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

  :deep(.preview-card .ant-card-body),
  .info-content {
    padding: 16px;
  }

  .action-btn {
    flex: 1 0 100%;
  }
}
</style>
