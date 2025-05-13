<template>
  <div id="searchPicturePage">
    <div class="content-container">
      <!-- 头部标题卡片 -->
      <a-card class="header-card" :bordered="false">
        <div class="page-header">
          <div class="header-content">
            <div class="title-container">
              <h1>
                <span class="action-text">智能</span>
                <span class="space-type">以图搜图</span>
              </h1>
              <div class="header-decoration"></div>
            </div>
            <p>基于图像内容的相似度搜索，帮您找到相似图片</p>
          </div>
        </div>
      </a-card>

      <!-- 搜图结果卡片 -->
      <a-card class="form-card" :bordered="false">
        <h3 class="section-title">原图</h3>
        <div class="original-image-container">
          <a-card hoverable class="original-image-card">
            <template #cover>
              <img
                :alt="picture.name"
                :src="picture.thumbnailUrl ?? picture.url"
                class="original-image"
              />
            </template>
          </a-card>
        </div>

        <h3 class="section-title">识图结果</h3>
        <!-- 图片结果列表 -->
        <a-list
          :grid="{ gutter: 24, xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 6 }"
          :data-source="dataList"
          :loading="loading"
          class="result-list"
        >
          <template #renderItem="{ item: picture }">
            <a-list-item style="padding: 0 0 24px 0">
              <a :href="picture.fromUrl" target="_blank" class="result-link">
                <!-- 单张图片 -->
                <a-card hoverable class="result-card">
                  <template #cover>
                    <img
                      :alt="picture.name"
                      :src="picture.thumbUrl"
                      class="result-image"
                    />
                  </template>
                </a-card>
              </a>
            </a-list-item>
          </template>
        </a-list>
      </a-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import {
  getPictureVoByIdUsingGet,
  searchPictureByPictureUsingPost,
} from '@/api/pictureController.ts'
import { message } from 'ant-design-vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const pictureId = computed(() => {
  return route.query?.pictureId
})
const picture = ref<API.PictureVO>({})

// 获取图片详情
const fetchPictureDetail = async () => {
  try {
    const res = await getPictureVoByIdUsingGet({
      id: pictureId.value,
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

// 以图搜图结果
const dataList = ref<API.ImageSearchResult[]>([])
const loading = ref<boolean>(true)
// 获取搜图结果
const fetchResultData = async () => {
  loading.value = true;
  try {
    const res = await searchPictureByPictureUsingPost({
      pictureId: pictureId.value,
    })
    if (res.data.code === 0 && res.data.data) {
      dataList.value = res.data.data ?? []
    } else {
      message.error('获取数据失败，' + res.data.message)
    }
  } catch (e: any) {
    message.error('获取数据失败，' + e.message)
  }
  loading.value = false;
}

// 页面加载时请求图片详情和搜索结果
onMounted(() => {
  fetchPictureDetail()
  fetchResultData()
})
</script>

<style scoped>
#searchPicturePage {
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
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  padding: 0 8px;
}

/* ===== 卡片公共样式 ===== */
.header-card,
.form-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  overflow: hidden;
  width: 100%;
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

.form-card:hover {
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

/* ===== 表单卡片内容 ===== */
.form-card {
  padding: 32px;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.section-title {
  font-size: 18px;
  font-weight: 500;
  color: #334155;
  margin-top: 0;
  margin-bottom: 16px;
}

.original-image-container {
  display: flex;
  justify-content: center;
  margin-bottom: 32px;
}

.original-image-card {
  width: 320px;
  transition: all 0.3s ease;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.original-image-card:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.original-image {
  height: 240px;
  object-fit: cover;
  width: 100%;
}

.result-list {
  margin-top: 8px;
  width: 100%;
}

.result-link {
  display: block;
  text-decoration: none;
  width: 100%;
}

.result-card {
  transition: all 0.3s ease;
  border-radius: 8px;
  overflow: hidden;
  height: 100%;
  width: 100%;
}

.result-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.result-image {
  height: 240px;
  object-fit: cover;
  width: 100%;
}

/* 响应式适配 */
@media (max-width: 768px) {
  #searchPicturePage {
    padding: 16px;
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

  .original-image-card {
    width: 100%;
    max-width: 320px;
  }

  .result-image {
    height: 200px;
  }
}
</style>
