<template>
  <div id="spaceDetailPage">
    <!-- 顶部卡片：空间信息和操作按钮 -->
    <a-card class="space-header-card" :bordered="false">
      <a-row align="middle" :gutter="24">
        <!-- 左侧：空间信息 -->
        <a-col :md="4" :sm="12" :xs="24">
          <div class="space-title">
            <h1>{{ space.spaceName }}</h1>
            <a-tag class="space-type-tag">{{ SPACE_TYPE_MAP[space.spaceType] }}</a-tag>
          </div>
          <p class="space-description">{{ space.description || '暂无空间描述' }}</p>
        </a-col>

        <!-- 中间：存储空间信息 -->
        <a-col :md="4" :sm="12" :xs="24">
          <div class="storage-usage">
            <div class="storage-circle">
              <a-progress
                type="circle"
                :percent="((space.totalSize * 100) / space.maxSize).toFixed(1)"
                :stroke-color="getProgressColor(((space.totalSize * 100) / space.maxSize))"
                :size="60"
              />
            </div>
            <div class="storage-info">
              <div class="storage-title">空间容量使用情况</div>
              <div class="storage-detail">
                <span class="used-size">{{ formatSize(space.totalSize) }}</span>
                <span class="separator">/</span>
                <span class="total-size">{{ formatSize(space.maxSize) }}</span>
              </div>
              <div class="storage-percent">
                已使用 {{ ((space.totalSize * 100) / space.maxSize).toFixed(1) }}%
              </div>
            </div>
          </div>
        </a-col>

        <!-- 右侧：操作按钮 -->
        <a-col :md="16" :sm="24" :xs="24">
          <div class="space-actions">
            <a-button
              v-if="canUploadPicture"
              type="primary"
              :href="`/add_picture?spaceId=${id}`"
              target="_blank"
              class="action-button upload-button"
            >
              <template #icon><PlusOutlined /></template>
              创建图片
            </a-button>
            <a-button
              v-if="canManageSpaceUser"
              type="primary"
              :icon="h(TeamOutlined)"
              :href="`/spaceUserManage/${id}`"
              target="_blank"
              class="action-button member-button"
            >
              成员管理
            </a-button>
            <a-button
              v-if="canManageSpaceUser"
              type="primary"
              :icon="h(BarChartOutlined)"
              :href="`/space_analyze?spaceId=${id}`"
              target="_blank"
              class="action-button analysis-button"
            >
              空间分析
            </a-button>
            <a-button
              v-if="canEditPicture"
              :icon="h(EditOutlined)"
              @click="doBatchEdit"
              class="action-button edit-button"
            >
              批量编辑
            </a-button>
          </div>
        </a-col>
      </a-row>
    </a-card>

    <!-- 搜索区域 - 压缩高度 -->
    <a-card class="search-card" :bordered="false">
      <div class="search-wrapper">
        <!-- 条件筛选区域 -->
        <div class="search-section condition-section">
          <div class="section-header">
            <span class="section-title">条件筛选</span>
            <a-divider type="vertical" />
          </div>
          <PictureSearchForm :onSearch="onSearch" class="search-form" />
        </div>

        <!-- 颜色筛选区域 -->
        <div class="search-section color-section">
          <div class="section-header">
            <span class="section-title">颜色筛选</span>
            <a-divider type="vertical" />
          </div>
          <div class="color-picker-container">
            <color-picker format="hex" @pureColorChange="onColorChange" class="color-picker" />
            <a-button
              v-if="colorSelected"
              class="clear-color-btn"
              type="primary"
              ghost
              size="small"
              @click="clearColorSearch"
            >
              <template #icon><CloseCircleOutlined /></template>
              清除
            </a-button>
          </div>
        </div>
      </div>
    </a-card>

    <!-- 内容区域：图片列表 - 优化空间利用 -->
    <a-card class="content-card" :bordered="false">
      <!-- 搜索结果提示 -->
      <div class="content-header">
        <div class="search-result-info" v-if="!loading">
          <span v-if="dataList.length > 0">找到 <b>{{ total }}</b> 张图片</span>
          <span v-else>未找到符合条件的图片</span>
        </div>

        <div class="sort-options">
          <span class="sort-label">排序：</span>
          <a-radio-group v-model:value="searchParams.sortField" @change="onSortChange" size="small">
            <a-radio-button value="createTime">创建时间</a-radio-button>
            <a-radio-button value="updateTime">更新时间</a-radio-button>
            <a-radio-button value="picName">图片名称</a-radio-button>
          </a-radio-group>
          <a-button
            type="text"
            @click="toggleSortOrder"
            class="sort-direction-btn"
            :title="searchParams.sortOrder === 'ascend' ? '升序' : '降序'"
          >
            <template #icon>
              <SortAscendingOutlined v-if="searchParams.sortOrder === 'ascend'" />
              <SortDescendingOutlined v-else />
            </template>
          </a-button>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="loading-container">
        <a-spin size="large" />
        <p>正在加载精彩图片...</p>
      </div>

      <!-- 无数据提示 -->
      <a-empty v-else-if="dataList.length === 0" description="暂无图片" class="empty-container">
        <template #image>
          <img src="../assets/empty-image.svg" alt="暂无图片" class="empty-image" />
        </template>
        <a-button
          v-if="canUploadPicture"
          type="primary"
          :href="`/add_picture?spaceId=${id}`"
          target="_blank"
          class="upload-button"
        >
          立即上传图片
        </a-button>
      </a-empty>

      <!-- 图片列表 -->
      <div v-else class="picture-grid-container">
        <PictureList
          :dataList="dataList"
          :loading="loading"
          :showOp="true"
          :canEdit="canEditPicture"
          :canDelete="canDeletePicture"
          :onReload="fetchData"
          class="picture-list"
        />

        <!-- 分页 -->
        <div class="pagination-container">
          <a-pagination
            v-model:current="searchParams.current"
            v-model:pageSize="searchParams.pageSize"
            :total="total"
            :page-size-options="['12', '24', '36', '48']"
            :show-size-changer="true"
            :show-quick-jumper="true"
            @change="onPageChange"
          />
        </div>
      </div>
    </a-card>

    <!-- 批量编辑弹窗 -->
    <BatchEditPictureModal
      ref="batchEditPictureModalRef"
      :spaceId="id"
      :pictureList="dataList"
      :onSuccess="onBatchEditPictureSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, h, onMounted, ref, watch } from 'vue'
import { getSpaceVoByIdUsingGet } from '@/api/spaceController.ts'
import { message } from 'ant-design-vue'
import {
  listPictureVoByPageUsingPost,
  searchPictureByColorUsingPost,
} from '@/api/pictureController.ts'
import { formatSize } from '@/utils'
import PictureList from '@/components/PictureList.vue'
import PictureSearchForm from '@/components/PictureSearchForm.vue'
import { ColorPicker } from 'vue3-colorpicker'
import 'vue3-colorpicker/style.css'
import BatchEditPictureModal from '@/components/BatchEditPictureModal.vue'
import {
  BarChartOutlined,
  EditOutlined,
  TeamOutlined,
  PlusOutlined,
  CloseCircleOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined
} from '@ant-design/icons-vue'
import { SPACE_PERMISSION_ENUM, SPACE_TYPE_MAP } from '../constants/space.ts'

interface Props {
  id: string | number
}

const props = defineProps<Props>()
const space = ref<API.SpaceVO>({})
const colorSelected = ref(false)

// 通用权限检查函数
function createPermissionChecker(permission: string) {
  return computed(() => {
    return (space.value.permissionList ?? []).includes(permission)
  })
}

// 定义权限检查
const canManageSpaceUser = createPermissionChecker(SPACE_PERMISSION_ENUM.SPACE_USER_MANAGE)
const canUploadPicture = createPermissionChecker(SPACE_PERMISSION_ENUM.PICTURE_UPLOAD)
const canEditPicture = createPermissionChecker(SPACE_PERMISSION_ENUM.PICTURE_EDIT)
const canDeletePicture = createPermissionChecker(SPACE_PERMISSION_ENUM.PICTURE_DELETE)

// 进度条颜色
const getProgressColor = (percent: number) => {
  if (percent < 60) return '#52c41a'
  if (percent < 80) return '#faad14'
  return '#f5222d'
}

// -------- 获取空间详情 --------
const fetchSpaceDetail = async () => {
  try {
    const res = await getSpaceVoByIdUsingGet({
      id: props.id,
    })
    if (res.data.code === 0 && res.data.data) {
      space.value = res.data.data
    } else {
      message.error('获取空间详情失败，' + res.data.message)
    }
  } catch (e: any) {
    message.error('获取空间详情失败：' + e.message)
  }
}

onMounted(() => {
  fetchSpaceDetail()
})

// --------- 获取图片列表 --------

// 定义数据
const dataList = ref<API.PictureVO[]>([])
const total = ref(0)
const loading = ref(true)

// 搜索条件
const searchParams = ref<API.PictureQueryRequest>({
  current: 1,
  pageSize: 12,
  sortField: 'createTime',
  sortOrder: 'descend',
})

// 切换排序方向
const toggleSortOrder = () => {
  searchParams.value.sortOrder = searchParams.value.sortOrder === 'ascend' ? 'descend' : 'ascend'
  fetchData()
}

// 排序字段变更
const onSortChange = () => {
  fetchData()
}

// 获取数据
const fetchData = async () => {
  loading.value = true
  // 转换搜索参数
  const params = {
    spaceId: props.id,
    ...searchParams.value,
  }
  try {
    const res = await listPictureVoByPageUsingPost(params)
    if (res.data.code === 0 && res.data.data) {
      dataList.value = res.data.data.records ?? []
      total.value = res.data.data.total ?? 0
    } else {
      message.error('获取数据失败，' + res.data.message)
    }
  } catch (error) {
    message.error('获取图片列表失败，请稍后重试')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 页面加载时获取数据，请求一次
onMounted(() => {
  fetchData()
})

// 分页参数
const onPageChange = (page: number, pageSize: number) => {
  searchParams.value.current = page
  searchParams.value.pageSize = pageSize
  fetchData()
}

// 搜索
const onSearch = (newSearchParams: API.PictureQueryRequest) => {
  searchParams.value = {
    ...searchParams.value,
    ...newSearchParams,
    current: 1,
  }
  colorSelected.value = false
  fetchData()
}

// 清除颜色搜索
const clearColorSearch = () => {
  colorSelected.value = false
  fetchData()
}

// 按照颜色搜索
const onColorChange = async (color: string) => {
  loading.value = true
  colorSelected.value = true
  try {
    const res = await searchPictureByColorUsingPost({
      picColor: color,
      spaceId: props.id,
    })
    if (res.data.code === 0 && res.data.data) {
      const data = res.data.data ?? []
      dataList.value = data
      total.value = data.length
    } else {
      message.error('获取数据失败，' + res.data.message)
    }
  } catch (error) {
    message.error('颜色搜索失败，请稍后重试')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// ---- 批量编辑图片 -----
const batchEditPictureModalRef = ref()

// 批量编辑图片成功
const onBatchEditPictureSuccess = () => {
  fetchData()
}

// 打开批量编辑图片弹窗
const doBatchEdit = () => {
  if (batchEditPictureModalRef.value) {
    batchEditPictureModalRef.value.openModal()
  }
}

// 空间 id 改变时，必须重新获取数据
watch(
  () => props.id,
  (newSpaceId) => {
    fetchSpaceDetail()
    fetchData()
  },
)
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

#spaceDetailPage {
  padding: 20px;
  background-color: #f7fafd;
  min-height: 100vh;
  color: #333333;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 40px); /* 减去页面padding */
}

/* ===== 卡片公共样式 ===== */
.space-header-card,
.search-card,
.content-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  background-color: #F0F8FF;
  overflow: hidden;
}

/* ===== 高度比例设置 ===== */
.space-header-card {
  flex: 0 0 auto;
  margin-bottom: 12px;
  padding: 16px;
}

.search-card {
  flex: 0 0 auto;
  margin-bottom: 12px;
  padding: 8px 0;
}

.content-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin-bottom: 0;
  padding: 16px 16px 0;
}

/* ===== 头部卡片 ===== */
.space-title {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.space-title h1 {
  margin: 0;
  color: #333333;
  font-size: 24px;
  font-weight: 600;
  margin-right: 12px;
}

.space-type-tag {
  font-size: 14px;
  padding: 2px 10px;
  background-color: #e6f7ff;
  color: #1890ff;
  border: 1px solid #91d5ff;
  border-radius: 16px;
}

.space-description {
  color: #666666;
  font-size: 14px;
  line-height: 1.6;
  margin-top: 8px;
  max-width: 95%;
}

.space-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 10px;
  height: 100%;
}

/* 按钮样式统一 */
.action-button {
  border-radius: 4px;
  height: 36px;
  font-weight: 500;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.upload-button {
  background-color: #87CEFA;
  border-color: #87CEFA;
}

.upload-button:hover {
  background-color: #75bdea;
  border-color: #75bdea;
}

.member-button,
.analysis-button {
  background-color: #87CEFA;
  border-color: #87CEFA;
}

.member-button:hover,
.analysis-button:hover {
  background-color: #75bdea;
  border-color: #75bdea;
}

.edit-button {
  background-color: white;
  color: #666666;
  border: 1px solid #d9d9d9;
}

.edit-button:hover {
  color: #87CEFA;
  border-color: #87CEFA;
}

/* 存储空间显示 - 放在空间信息右侧 */
.storage-usage {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.7);
  box-shadow: 0 2px 10px rgba(135, 206, 250, 0.2);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(135, 206, 250, 0.3);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.storage-circle {
  margin-right: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.storage-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.storage-title {
  font-size: 14px;
  color: #555555;
  margin-bottom: 6px;
  font-weight: 500;
}

.storage-detail {
  font-size: 15px;
  color: #333333;
  font-weight: 600;
  margin-bottom: 4px;
}

.used-size {
  color: #1890ff;
}

.separator {
  margin: 0 5px;
  color: #888888;
}

.total-size {
  color: #333333;
}

.storage-percent {
  font-size: 13px;
  color: #888888;
}

/* ===== 搜索区域 - 压缩高度 ===== */
.search-wrapper {
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 0;
}

.search-section {
  padding: 8px 16px;
}

.condition-section {
  flex: 3;
}

.color-section {
  flex: 1;
  min-width: 220px;
  border-left: 1px dashed #e8e8e8;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.section-title {
  font-size: 15px;
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
  height: 14px;
  background-color: #87CEFA;
  border-radius: 1.5px;
}

.color-picker-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.color-picker {
  width: 70%;
}

.clear-color-btn {
  border-color: #87CEFA;
  color: #87CEFA;
  padding: 0 8px;
}

/* ===== 内容区域 - 优化图片区域空间 ===== */
.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid #e8e8e8;
  margin-bottom: 12px;
}

.search-result-info {
  color: #666666;
  font-size: 14px;
}

.search-result-info b {
  color: #333333;
  font-weight: 600;
}

.sort-options {
  display: flex;
  align-items: center;
}

.sort-label {
  margin-right: 8px;
  color: #666666;
}

.sort-direction-btn {
  margin-left: 8px;
  color: #666666;
}

.sort-direction-btn:hover {
  color: #87CEFA;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px 0;
  flex: 1;
}

.loading-container p {
  margin-top: 16px;
  color: #666666;
}

.empty-container {
  padding: 30px 0;
  flex: 1;
}

.empty-image {
  height: 100px;
  opacity: 0.7;
}

.picture-grid-container {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

.picture-list {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 2px; /* 为滚动条留一点空间 */
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e8e8e8;
}

/* ===== 图片列表样式覆盖 ===== */
:deep(.picture-item) {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #e8e8e8;
}

:deep(.picture-item:hover) {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  border-color: #87CEFA;
}

:deep(.picture-item-title) {
  font-weight: 500;
  color: #333333;
}

:deep(.picture-item-info) {
  color: #666666;
  font-size: 13px;
}

:deep(.picture-actions) {
  opacity: 0;
  transition: opacity 0.2s ease;
}

:deep(.picture-item:hover .picture-actions) {
  opacity: 1;
}

:deep(.ant-pagination-item-active) {
  border-color: #87CEFA;
}

:deep(.ant-pagination-item-active a) {
  color: #87CEFA;
}

:deep(.ant-radio-button-wrapper-checked) {
  background-color: #87CEFA;
  border-color: #87CEFA;
}

:deep(.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled)) {
  color: white;
}

:deep(.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled)::before) {
  background-color: #87CEFA;
}

:deep(.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):hover) {
  background-color: #75bdea;
  border-color: #75bdea;
}

/* 修改搜索表单字段宽度 */
:deep(.search-form .ant-form-item) {
  margin-bottom: 12px;
}

:deep(.search-form .ant-input),
:deep(.search-form .ant-select) {
  max-width: 220px;
}

/* 优化卡片间距 */
:deep(.ant-card-body) {
  padding: 12px;
}

/* ===== 响应式适配 ===== */
@media (max-width: 992px) {
  .search-wrapper {
    flex-direction: column;
  }

  .color-section {
    border-left: none;
    border-top: 1px dashed #e8e8e8;
  }

  .space-actions {
    justify-content: flex-start;
    margin-top: 16px;
  }
}

@media (max-width: 768px) {
  .space-title h1 {
    font-size: 20px;
  }

  .content-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .sort-options {
    margin-top: 8px;
  }

  .color-picker {
    width: 100%;
  }

  .storage-usage {
    margin-top: 16px;
  }
}
</style>
