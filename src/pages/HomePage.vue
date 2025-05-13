<template>
  <div class="pixabay-core">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-bg"></div>
      <div class="hero-content">
        <div class="media-tabs">
          <span
            :class="{ active: selectedCategory === 'all' }"
            @click="selectedCategory = 'all'; resetAndSearch()"
          >全部</span>
          <span
            v-for="category in categoryList"
            :key="category"
            :class="{ active: category === selectedCategory }"
            @click="selectedCategory = category; resetAndSearch()"
          >
            {{ category }}
            <i v-if="category === selectedCategory" class="close-icon" @click.stop="selectedCategory = 'all'; resetAndSearch()">×</i>
          </span>
        </div>
        <div class="search-bar">
          <input
            v-model="searchParams.searchText"
            placeholder="偶遇灵感"
            @keyup.enter="resetAndSearch"
          />
          <button @click="resetAndSearch">
            <i class="search-icon"></i>
          </button>
        </div>
        <div class="popular-tags">
          <a
            v-for="(tag, index) in tagList"
            :key="tag"
            href="#"
            class="tag"
            :class="{ 'active-tag': selectedTagList[index] }"
            @click.prevent="selectedTagList[index] = !selectedTagList[index]; resetAndSearch()"
          >
            {{ tag }}
            <i v-if="selectedTagList[index]" class="close-icon" @click.stop="selectedTagList[index] = false; resetAndSearch()">×</i>
          </a>
        </div>
      </div>
    </section>

    <!-- Gallery Section -->
    <main class="gallery">
      <!-- Waterfall Layout -->
      <div class="waterfall-container">
        <Waterfall
          ref="waterfallRef"
          v-if="dataList.length > 0"
          :list="dataList"
          :width="320"
          :gap-width="12"
          :gap-height="12"
          :breakpoints="breakpoints"
          :need-auto-prefix="true"
          :need-adapt="true"
        >
          <template #default="{ item }">
            <div class="card-wrapper">
              <div class="waterfall-item">
                <div class="image-wrapper" :style="item.picHeight && item.picWidth
                  ? { paddingTop: (item.picHeight / item.picWidth) * 100 + '%' }
                  : {}">
                  <img :src="item.url" :alt="item.title" @load="onImageLoad" @click="doClickPicture(item)" />
                  <div class="waterfall-actions">
                    <a-tooltip title="分享">
                      <ShareAltOutlined @click="(e) => doShare(item, e)" />
                    </a-tooltip>
                    <a-tooltip title="以图搜图">
                      <SearchOutlined @click="(e) => doSearch(item, e)" />
                    </a-tooltip>
                  </div>
                  <div class="waterfall-info">
                    <div class="waterfall-title">{{ item.title }}</div>
                    <div class="waterfall-tags" v-if="item.tags && item.tags.length">
                      <span v-for="tag in item.tags" :key="tag" class="waterfall-tag">{{ tag }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </Waterfall>

        <!-- Loading indicator -->
        <div v-if="loading" class="loading-message">
          <div class="loading-spinner"></div>
          <span>加载中...</span>
        </div>

        <!-- No more data message -->
        <div v-if="noMoreData" class="no-more-data">已经到底了~</div>

        <!-- Intersection observer element -->
        <div ref="observerElement" class="observer-element" v-show="!noMoreData && !loading"></div>
      </div>

      <div class="gallery-fade"></div>
    </main>

    <!-- Back to top button -->
    <button
      class="back-to-top"
      :class="{ 'visible': showBackToTop }"
      @click="scrollToTop"
    >
      <span class="back-to-top-arrow">↑</span>
    </button>

    <!-- 分享模态框 -->
    <ShareModal ref="shareModalRef" :link="shareLink" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, onBeforeUnmount, nextTick, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  ShareAltOutlined,
  SearchOutlined,
} from '@ant-design/icons-vue'
import {
  listPictureTagCategoryUsingGet,
  listPictureVoByPageUsingPost,
} from '@/api/pictureController.ts'
import { message } from 'ant-design-vue'
import { Waterfall } from 'vue-waterfall-plugin-next'
import 'vue-waterfall-plugin-next/dist/style.css'
import ShareModal from '@/components/ShareModal.vue'

// 定义数据
const dataList = ref<API.PictureVO[]>([])
const total = ref(0)
const loading = ref(true)
const noMoreData = ref(false)
const showBackToTop = ref(false)

// 搜索条件
const searchParams = reactive<API.PictureQueryRequest>({
  current: 1,
  pageSize: 20,
  sortField: 'createTime',
  sortOrder: 'descend',
  searchText: '',
})

// 瀑布流断点配置
const breakpoints = computed(() => {
  return {
    1900: { rowPerView: 6 },
    1600: { rowPerView: 5 },
    1300: { rowPerView: 4 },
    960: { rowPerView: 3 },
    640: { rowPerView: 2 },
    400: { rowPerView: 1 }
  }
})

// 路由
const router = useRouter()

// 跳转至图片详情页
const doClickPicture = (picture) => {
  router.push({
    path: `/picture/${picture.id}`,
  })
}

// 搜索
const doSearch = (picture, e) => {
  // 阻止冒泡
  e.stopPropagation()
  // 打开新的页面
  window.open(`/search_picture?pictureId=${picture.id}`)
}

// ----- 分享操作 ----
const shareModalRef = ref()
// 分享链接
const shareLink = ref<string>()
// 分享
const doShare = (picture, e) => {
  // 阻止冒泡
  e.stopPropagation()
  shareLink.value = `${window.location.protocol}//${window.location.host}/picture/${picture.id}`
  if (shareModalRef.value) {
    shareModalRef.value.openModal()
  }
}

// 获取数据
const fetchData = async (loadMore = false) => {
  if (!loadMore) {
    loading.value = true
  }

  // 转换搜索参数
  const params = {
    ...searchParams,
    tags: [] as string[],
  }

  if (selectedCategory.value !== 'all') {
    params.category = selectedCategory.value
  }

  // [true, false, false] => ['java']
  selectedTagList.value.forEach((useTag, index) => {
    if (useTag) {
      params.tags.push(tagList.value[index])
    }
  })

  try {
    const res = await listPictureVoByPageUsingPost(params)
    if (res.data.code === 0 && res.data.data) {
      const newData = res.data.data.records ?? []

      if (loadMore) {
        dataList.value = [...dataList.value, ...newData]
      } else {
        dataList.value = newData
      }

      total.value = res.data.data.total ?? 0

      // 检查是否还有更多数据
      if (dataList.value.length >= total.value || newData.length === 0) {
        noMoreData.value = true
      } else {
        noMoreData.value = false
      }
    } else {
      message.error('获取数据失败，' + res.data.message)
    }
  } catch (error) {
    message.error('请求失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 重置并搜索
const resetAndSearch = () => {
  searchParams.current = 1
  dataList.value = []
  noMoreData.value = false
  fetchData()
}

// 加载更多
const loadMore = () => {
  if (loading.value || noMoreData.value) return

  loading.value = true
  searchParams.current++
  fetchData(true)
}

// 标签和分类列表
const categoryList = ref<string[]>([])
const selectedCategory = ref<string>('all')
const tagList = ref<string[]>([])
const selectedTagList = ref<boolean[]>([])

// 获取标签和分类选项
const getTagCategoryOptions = async () => {
  try {
    const res = await listPictureTagCategoryUsingGet()
    if (res.data.code === 0 && res.data.data) {
      tagList.value = res.data.data.tagList ?? []
      categoryList.value = res.data.data.categoryList ?? []
      // 初始化标签选择状态
      selectedTagList.value = Array(tagList.value.length).fill(false)
    } else {
      message.error('获取标签分类列表失败，' + res.data.message)
    }
  } catch (error) {
    message.error('请求失败，请稍后重试')
  }
}

// 瀑布流组件引用
const waterfallRef = ref()

// 图片加载完成后处理
const onImageLoad = (event) => {
  const img = event.target
  const wrapper = img.closest('.image-wrapper')

  // 兜底：如果没有宽高信息，图片加载后再设置paddingTop
  if (wrapper && (!wrapper.style.paddingTop || wrapper.style.paddingTop === '0px')) {
    const ratio = img.naturalHeight / img.naturalWidth
    wrapper.style.paddingTop = `${ratio * 100}%`
  }

  // 图片加载完成时重新计算瀑布流布局
  if (waterfallRef.value && typeof waterfallRef.value.renderer === 'function') {
    setTimeout(() => {
      waterfallRef.value.renderer()
    }, 50)
  }
}

// 无限滚动相关
const observerElement = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

// 返回顶部按钮相关
const handleScroll = () => {
  showBackToTop.value = window.scrollY > 300
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

onMounted(() => {
  // 初始化交叉观察器用于无限滚动
  observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !loading.value && !noMoreData.value) {
      loadMore()
    }
  }, { threshold: 0.1 })

  if (observerElement.value) {
    observer.observe(observerElement.value)
  }

  // 监听滚动事件，用于显示/隐藏返回顶部按钮
  window.addEventListener('scroll', handleScroll)

  // 初始化数据
  getTagCategoryOptions()
  fetchData()
})

onBeforeUnmount(() => {
  // 组件卸载时清理
  if (observer) {
    observer.disconnect()
  }
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
/* 全局样式重置 */
• {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.pixabay-core {
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
  background: transparent;
  color: #222;
  width: 100%;
  overflow-x: hidden;
  position: relative;
  margin: 0;
  padding: 0;
}

.hero {
  position: relative;
  min-height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  padding: 0;
  z-index: 1;
}

.hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  background: url('../assets/pexels-photo-12445797.webp') center/cover no-repeat;
  filter: brightness(1.1);
  width: 100%;
  height: 100%;
}


/* 添加背景遮罩 - 降低透明度使其更明亮 */
.hero-bg:after {
  content: "";
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: .3; /* 降低透明度从0.5到0.3 */
  background: #000;
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  margin: 0 auto;
  width: 100%;
  max-width: 760px;
  padding: 80px 0 60px 0;
  margin-top: 64px; /* 为header留出空间 */
}

.hero h1 {
  font-size: 2.4rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 14px;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.25);
  letter-spacing: -0.5px;
}

.media-tabs {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
  margin: 20px 0 22px 0;
}

.media-tabs span {
  font-size: 1rem;
  padding: 6px 18px;
  border-radius: 20px;
  cursor: pointer;
  color: #444444; /* 改为灰黑色 */
  background: rgba(255, 255, 255, 0.8);
  transition: all 0.2s ease;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: inline-flex;
  align-items: center;
  position: relative;
}

.media-tabs span.active, .media-tabs span:hover {
  background: rgba(255, 255, 255, 0.95);
  color: #222222; /* 深灰黑色 */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.media-tabs span.active {
  padding-right: 12px;
}

.search-bar {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  max-width: 620px; /* 增加搜索框长度 */
  margin: 0 auto 18px auto;
  border-radius: 28px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  padding: 6px 8px 6px 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  overflow: hidden;
  transition: all 0.3s ease;
}

.search-bar:hover, .search-bar:focus-within {
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.search-bar input {
  flex: 1;
  border: none;
  outline: none;
  padding: 12px 5px;
  border-radius: 0;
  background: transparent;
  font-size: 1.05rem;
  color: #333333; /* 改为深灰色 */
}

.search-bar input::placeholder {
  color: #777777; /* 中灰色 */
}

.search-bar button {
  margin-left: 8px;
  background: linear-gradient(135deg, #555555 0%, #333333 100%); /* 灰黑渐变 */
  color: #fff;
  border: none;
  font-size: 1rem;
  border-radius: 22px;
  height: 44px;
  padding: 0 20px; /* 内容自适应 */
  min-width: auto; /* 移除固定宽度 */
  cursor: pointer;
  font-weight: 600;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
}

.search-bar button:hover {
  background: linear-gradient(135deg, #666666 0%, #444444 100%); /* 更亮的灰黑渐变 */
  transform: translateY(-1px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}

.search-icon {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #fff;
  border-radius: 50%;
  position: relative;
}

.search-icon::after {
  content: '';
  position: absolute;
  top: 13px;
  left: 13px;
  width: 7px;
  height: 2px;
  background: #fff;
  transform: rotate(45deg);
  transform-origin: 0 0;
}

.popular-tags {
  margin-top: 16px;
  color: #222;
  font-size: 1rem;
  padding: 0 15px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

.popular-tags > span {
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  margin-right: 10px;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
}

.popular-tags .tag {
  margin: 0 6px 8px;
  background: rgba(255, 255, 255, 0.75);
  color: #444444; /* 灰黑色 */
  border-radius: 18px;
  padding: 5px 14px;
  text-decoration: none;
  border: none;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  position: relative;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
}

.popular-tags .tag:hover {
  background: rgba(255, 255, 255, 0.9);
  color: #222222; /* 深灰黑色 */
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.popular-tags .active-tag {
  background: rgba(255, 255, 255, 0.9);
  color: #222222; /* 深灰黑色 */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  padding-right: 12px;
}

.popular-tags .active-tag:hover {
  background: rgba(255, 255, 255, 1);
  color: #000000; /* 黑色 */
}

/* 关闭图标样式 */
.close-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: 4px;
  font-style: normal;
  font-size: 14px;
  line-height: 1;
  font-weight: bold;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.2);
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-icon:hover {
  background-color: rgba(0, 0, 0, 0.4);
  transform: scale(1.1);
}

.hero-desc {
  margin: 22px 0 0 0;
  color: #fff;
  font-size: 1.1rem;
  text-shadow: 0 1px 8px rgba(0, 0, 0, 0.2);
  font-weight: 400;
}

.gallery {
  width: 100%;
  max-width: 100%;
  margin: 0;
  padding: 0;
  position: relative;
  background: transparent;
}

/* 瀑布流布局样式 - 更新为透明背景和占满gallery */
.waterfall-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 400px;
  padding: 0;
  margin: 0;
  background: transparent;
}

.card-wrapper {
  width: 100%;
  padding: 6px;
  box-sizing: border-box;
  transition: transform 0.3s ease;
  background: transparent;
}

.card-wrapper:hover {
  transform: translateY(-5px);
}

.waterfall-item {
  width: 100%;
  border-radius: 16px;
  overflow: hidden;
  background: transparent;
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.25s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.waterfall-item:hover {
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
}

.image-wrapper {
  position: relative;
  width: 100%;
  padding-top: 0;
  overflow: hidden;
  background-color: #f0f0f0;
  min-height: 140px;
  border-radius: 16px;
  flex: 1;
  cursor: pointer;
}

.image-wrapper img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.waterfall-item:hover .image-wrapper img {
  transform: scale(1.08);
}

/* 修改操作按钮样式 */
.waterfall-actions {
  position: absolute;
  bottom: 10px;
  right: 10px;
  display: flex;
  gap: 16px;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease;
  padding: 6px 10px;
  border-radius: 20px;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10;
}

.image-wrapper:hover .waterfall-actions {
  opacity: 1;
  transform: translateY(0);
}

.waterfall-actions .anticon {
  font-size: 18px;
  cursor: pointer;
  color: #fff;
  transition: all 0.2s ease;
}

.waterfall-actions .anticon:hover {
  color: #fff;
  transform: scale(1.1);
}

.waterfall-info {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 16px 18px;
  background: rgba(0, 0, 0, 0);
  opacity: 0; /* 设置初始透明度为0 */
  transform: translateY(10px); /* 添加上移效果 */
  transition: all 0.3s ease;
  z-index: 5;
}

.image-wrapper:hover .waterfall-info {
  opacity: 1;
  transform: translateY(0);
}

.waterfall-title {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 10px;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.waterfall-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.waterfall-tag {
  font-size: 0.75rem;
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  padding: 3px 10px;
  border-radius: 12px;
}

/* 加载中和无更多数据样式 */
.loading-message {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px;
  color: #777;
  gap: 10px;
  background: transparent;
}

.loading-spinner {
  width: 28px;
  height: 28px;
  border: 2px solid #666666;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.no-more-data {
  text-align: center;
  padding: 24px;
  color: #888;
  font-size: 1rem;
  font-style: italic;
  background: transparent;
}

.observer-element {
  width: 100%;
  height: 10px;
  background: transparent;
}

/* 返回顶部按钮样式 */
.back-to-top {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: linear-gradient(135deg, #555555 0%, #333333 100%); /* 灰黑渐变 */
  color: white;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.3s ease;
  z-index: 100;
}

.back-to-top.visible {
  opacity: 1;
  transform: translateY(0);
}

.back-to-top:hover {
  background: linear-gradient(135deg, #666666 0%, #444444 100%); /* 更亮的灰黑渐变 */
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
}

.back-to-top-arrow {
  font-size: 1.6rem;
  line-height: 0;
}

.gallery-fade {
  pointer-events: none;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 70px;
  background: linear-gradient(to bottom, rgba(247,247,247,0), #f7f7f7 98%);
}

/* 响应式样式 */
@media (max-width: 768px) {
  .hero-content {
    padding: 40px 15px 30px;
  }

  .hero h1 {
    font-size: 1.8rem;
  }

  .search-bar {
    margin: 0 15px 12px;
    max-width: 90%;
  }

  .back-to-top {
    width: 46px;
    height: 46px;
    bottom: 20px;
    right: 20px;
  }
}

/* 移除 Vue Waterfall Plugin 默认样式 */
:deep(.vue-waterfall) {
  background: transparent !important;
}

:deep(.vue-waterfall-column) {
  background: transparent !important;
}
</style>
