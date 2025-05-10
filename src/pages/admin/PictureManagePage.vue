<template>
  <div id="pictureManagePage">

    <!-- 搜索区域 -->
    <a-card class="search-card" :bordered="false">
      <div class="search-section">
        <div class="section-header">
          <span class="section-title">条件筛选</span>
          <a-divider type="vertical" />
        </div>
        <a-form layout="inline" :model="searchParams" @finish="doSearch" class="search-form">
          <!-- ... existing code ... -->
          <a-form-item label="关键词">
            <a-input
              v-model:value="searchParams.searchText"
              placeholder="从名称和简介搜索"
              allow-clear
            />
          </a-form-item>
          <a-form-item label="类型">
            <a-input v-model:value="searchParams.category" placeholder="请输入类型" allow-clear />
          </a-form-item>
          <a-form-item label="标签">
            <a-select
              v-model:value="searchParams.tags"
              mode="tags"
              placeholder="请输入标签"
              style="min-width: 180px"
              allow-clear
            />
          </a-form-item>
          <a-form-item name="reviewStatus" label="审核状态">
            <a-select
              v-model:value="searchParams.reviewStatus"
              style="min-width: 180px"
              placeholder="请选择审核状态"
              :options="PIC_REVIEW_STATUS_OPTIONS"
              allow-clear
            />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" html-type="submit" class="search-button">搜索</a-button>
          </a-form-item>

          <!-- 将按钮组移到右侧 -->
          <a-form-item class="right-actions">
            <div class="page-actions">
              <a-button
                type="primary"
                href="/add_picture"
                target="_blank"
                class="action-button upload-button"
              >
                <template #icon><PlusOutlined /></template>
                创建图片
              </a-button>
              <a-button
                type="primary"
                href="/add_picture/batch"
                target="_blank"
                ghost
                class="action-button batch-button"
              >
                <template #icon><PlusOutlined /></template>
                批量创建图片
              </a-button>
            </div>
          </a-form-item>
        </a-form>
      </div>
    </a-card>


    <!-- 内容区域：图片表格 -->
    <a-card class="content-card" :bordered="false">
      <a-table
        :columns="columns"
        :data-source="dataList"
        :pagination="pagination"
        @change="doTableChange"
        :rowKey="record => record.id"
        :scroll="{ x: 'max-content' }"
        size="middle"
        :loading="loading"
        class="picture-table"
      >
        <template #bodyCell="{ column, record }">
          <!-- 图片预览列 -->
          <template v-if="column.dataIndex === 'url'">
            <div class="image-preview">
              <a-image :src="record.url" :width="100" />
            </div>
          </template>

          <!-- 名称列 -->
          <template v-if="column.dataIndex === 'name'">
            <a-tooltip :title="record.name">
              <span class="truncated-text">{{ record.name }}</span>
            </a-tooltip>
          </template>

          <!-- 简介列 -->
          <template v-if="column.dataIndex === 'introduction'">
            <a-tooltip :title="record.introduction">
              <span class="truncated-text">{{ record.introduction }}</span>
            </a-tooltip>
          </template>

          <!-- 标签列 -->
          <template v-if="column.dataIndex === 'tags'">
            <a-space wrap>
              <a-tag
                v-for="tag in JSON.parse(record.tags || '[]')"
                :key="tag"
                class="picture-tag"
              >
                {{ tag }}
              </a-tag>
            </a-space>
          </template>

          <!-- 图片信息列 - 紧凑显示 -->
          <template v-if="column.dataIndex === 'picInfo'">
            <div class="compact-info">
              <div class="pic-info-item">格式：{{ record.picFormat }}</div>
              <div class="pic-info-item">尺寸：{{ record.picWidth }}×{{ record.picHeight }}</div>
              <div class="pic-info-item">比例：{{ record.picScale }}</div>
              <div class="pic-info-item">大小：{{ (record.picSize / 1024).toFixed(1) }}KB</div>
            </div>
          </template>

          <!-- 审核信息列 - 更紧凑的布局 -->
          <template v-if="column.dataIndex === 'reviewMessage'">
            <div class="compact-info">
              <div class="review-info-status">
                <a-tag :color="getReviewStatusColor(record.reviewStatus)">
                  {{ PIC_REVIEW_STATUS_MAP[record.reviewStatus] }}
                </a-tag>
              </div>
              <a-tooltip v-if="record.reviewMessage" :title="record.reviewMessage">
                <div class="review-info-item truncated-text">
                  {{ record.reviewMessage }}
                </div>
              </a-tooltip>
              <div class="review-info-item small-text" v-if="record.reviewTime">
                {{ dayjs(record.reviewTime).format('YYYY-MM-DD HH:mm') }}
              </div>
            </div>
          </template>

          <!-- 时间列 - 更简洁的格式 -->
          <template v-if="column.dataIndex === 'createTime'">
            <a-tooltip :title="dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss')">
              {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm') }}
            </a-tooltip>
          </template>

          <template v-if="column.dataIndex === 'editTime'">
            <a-tooltip :title="dayjs(record.editTime).format('YYYY-MM-DD HH:mm:ss')">
              {{ dayjs(record.editTime).format('YYYY-MM-DD HH:mm') }}
            </a-tooltip>
          </template>

          <!-- 操作列 - 图标按钮节省空间 -->
          <template v-else-if="column.key === 'action'">
            <div class="action-buttons">
              <a-tooltip title="通过审核">
                <a-button
                  v-if="record.reviewStatus !== PIC_REVIEW_STATUS_ENUM.PASS"
                  type="primary"
                  size="small"
                  shape="circle"
                  @click="handleReview(record, PIC_REVIEW_STATUS_ENUM.PASS)"
                  class="review-pass-btn action-icon-btn"
                >
                  <template #icon><CheckOutlined /></template>
                </a-button>
              </a-tooltip>

              <a-tooltip title="不过审">
                <a-button
                  v-if="record.reviewStatus !== PIC_REVIEW_STATUS_ENUM.REJECT"
                  type="primary"
                  danger
                  size="small"
                  shape="circle"
                  @click="handleReview(record, PIC_REVIEW_STATUS_ENUM.REJECT)"
                  class="review-reject-btn action-icon-btn"
                >
                  <template #icon><CloseOutlined /></template>
                </a-button>
              </a-tooltip>

              <a-tooltip title="编辑图片">
                <a-button
                  type="primary"
                  ghost
                  size="small"
                  shape="circle"
                  :href="`/add_picture?id=${record.id}`"
                  target="_blank"
                  class="edit-btn action-icon-btn"
                >
                  <template #icon><EditOutlined /></template>
                </a-button>
              </a-tooltip>

              <a-tooltip title="删除图片">
                <a-button
                  danger
                  size="small"
                  shape="circle"
                  @click="doDelete(record.id)"
                  class="delete-btn action-icon-btn"
                >
                  <template #icon><DeleteOutlined /></template>
                </a-button>
              </a-tooltip>
            </div>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import {
  deletePictureUsingPost,
  doPictureReviewUsingPost,
  listPictureByPageUsingPost,
} from '@/api/pictureController.ts'
import { message } from 'ant-design-vue'
import {
  PIC_REVIEW_STATUS_ENUM,
  PIC_REVIEW_STATUS_MAP,
  PIC_REVIEW_STATUS_OPTIONS,
} from '../../constants/picture.ts'
import dayjs from 'dayjs'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined
} from '@ant-design/icons-vue'

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 60,
    fixed: 'left',
    align: 'center',
  },
  {
    title: '图片',
    dataIndex: 'url',
    width: 120,
    align: 'center',
  },
  {
    title: '名称',
    dataIndex: 'name',
    width: 140,
    ellipsis: true,
    align: 'center',
  },
  {
    title: '简介',
    dataIndex: 'introduction',
    width: 180,
    ellipsis: true,
    align: 'center',
  },
  {
    title: '类型',
    dataIndex: 'category',
    width: 100,
    ellipsis: true,
    align: 'center',
  },
  {
    title: '标签',
    dataIndex: 'tags',
    width: 150,
    align: 'center',
  },
  {
    title: '图片信息',
    dataIndex: 'picInfo',
    width: 140,
    align: 'center',
  },
  {
    title: '用户',
    dataIndex: 'userId',
    width: 70,
    align: 'center',
  },
  {
    title: '空间',
    dataIndex: 'spaceId',
    width: 70,
    align: 'center',
  },
  {
    title: '审核信息',
    dataIndex: 'reviewMessage',
    width: 200,
    align: 'center',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 150,
    align: 'center',
  },
  {
    title: '编辑时间',
    dataIndex: 'editTime',
    width: 150,
    align: 'center',
  },
  {
    title: '操作',
    key: 'action',
    width: 140,
    fixed: 'right',
    align: 'center',
  },
]

// 定义数据
const dataList = ref<API.Picture[]>([])
const total = ref(0)
const loading = ref(false)

// 搜索条件
const searchParams = reactive<API.PictureQueryRequest>({
  current: 1,
  pageSize: 10,
  sortField: 'createTime',
  sortOrder: 'descend',
})

// 获取数据
const fetchData = async () => {
  loading.value = true
  try {
    const res = await listPictureByPageUsingPost({
      ...searchParams,
      nullSpaceId: true,
    })
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
const pagination = computed(() => {
  return {
    current: searchParams.current,
    pageSize: searchParams.pageSize,
    total: total.value,
    showSizeChanger: true,
    showTotal: (total) => `共 ${total} 条`,
  }
})

// 表格变化之后，重新获取数据
const doTableChange = (page: any) => {
  searchParams.current = page.current
  searchParams.pageSize = page.pageSize
  fetchData()
}

// 搜索数据
const doSearch = () => {
  // 重置页码
  searchParams.current = 1
  fetchData()
}

// 删除数据
const doDelete = async (id: string) => {
  if (!id) {
    return
  }
  const res = await deletePictureUsingPost({ id })
  if (res.data.code === 0) {
    message.success('删除成功')
    // 刷新数据
    fetchData()
  } else {
    message.error('删除失败')
  }
}

// 审核图片
const handleReview = async (record: API.Picture, reviewStatus: number) => {
  const reviewMessage =
    reviewStatus === PIC_REVIEW_STATUS_ENUM.PASS ? '管理员操作通过' : '管理员操作拒绝'
  const res = await doPictureReviewUsingPost({
    id: record.id,
    reviewStatus,
    reviewMessage,
  })
  if (res.data.code === 0) {
    message.success('审核操作成功')
    // 重新获取列表数据
    fetchData()
  } else {
    message.error('审核操作失败，' + res.data.message)
  }
}

// 获取审核状态对应的颜色
const getReviewStatusColor = (status: number) => {
  switch (status) {
    case PIC_REVIEW_STATUS_ENUM.PASS:
      return 'success'
    case PIC_REVIEW_STATUS_ENUM.REJECT:
      return 'error'
    case PIC_REVIEW_STATUS_ENUM.REVIEWING:
      return 'processing'
    default:
      return 'default'
  }
}
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

#pictureManagePage {
  padding: 20px;
  background-color: #f7fafd;
  min-height: 100vh;
  color: #333333;
}

/* ===== 卡片公共样式 ===== */
.page-header-card,
.search-card,
.content-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  background-color: #F0F8FF;
  overflow: hidden;
  margin-bottom: 12px;
}

/* ===== 头部卡片 ===== */
.page-header-card {
  padding: 16px;
}

.page-title {
  margin: 0;
  color: #333333;
  font-size: 24px;
  font-weight: 600;
}

.page-actions {
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

.batch-button {
  border-color: #87CEFA;
  color: #87CEFA;
}

.batch-button:hover {
  color: #ffffff;
  background-color: #87CEFA;
}

/* ===== 搜索区域 ===== */
.search-card {
  padding: 8px 16px;
}

.search-section {
  padding: 8px 0;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
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

.search-form {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  gap: 8px;
  align-items: flex-start;
}

.search-form :deep(.ant-form-item) {
  margin-bottom: 12px;
  margin-right: 16px;
}

.search-button {
  background-color: #87CEFA;
  border-color: #87CEFA;
}

.search-button:hover {
  background-color: #75bdea;
  border-color: #75bdea;
}

/* ===== 内容区域：表格 ===== */
.content-card {
  padding: 0;
}

.picture-table {
  width: 100%;
}

.picture-table :deep(.ant-table-thead > tr > th) {
  background-color: rgba(135, 206, 250, 0.1);
  color: #333333;
  font-weight: 600;
  padding: 10px 8px;
  text-align: center;
}

.picture-table :deep(.ant-table-tbody > tr > td) {
  padding: 8px;
  text-align: center;
}

.picture-table :deep(.ant-table-tbody > tr:hover > td) {
  background-color: rgba(135, 206, 250, 0.05);
}

.picture-table :deep(.ant-pagination-item-active) {
  border-color: #87CEFA;
}

.picture-table :deep(.ant-pagination-item-active a) {
  color: #87CEFA;
}

/* 图片预览优化 */
.image-preview {
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 100px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f2f5;
  margin: 0 auto;
}

.image-preview :deep(img) {
  max-height: 80px;
  object-fit: contain;
}

/* 标签样式 */
.picture-tag {
  border-radius: 12px;
  background-color: rgba(135, 206, 250, 0.1);
  border-color: rgba(135, 206, 250, 0.3);
  color: #1890ff;
}

/* 文本截断样式 */
.truncated-text {
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  margin: 0 auto;
}

/* 紧凑信息布局 */
.compact-info {
  display: flex;
  flex-direction: column;
  gap: 3px;
  align-items: center;
}

.pic-info-item {
  font-size: 12px;
  line-height: 1.4;
  color: #666666;
  text-align: center;
}

.review-info-status {
  margin-bottom: 3px;
  display: flex;
  justify-content: center;
}

.review-info-item {
  font-size: 12px;
  line-height: 1.4;
  color: #666666;
  text-align: center;
}

.small-text {
  font-size: 11px;
  color: #999;
}

/* 操作按钮样式优化 */
.action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: center;
}

.action-icon-btn {
  width: 28px;
  height: 28px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.review-pass-btn {
  background-color: #52c41a;
  border-color: #52c41a;
}

.review-pass-btn:hover {
  background-color: #73d13d;
  border-color: #73d13d;
}

.review-reject-btn {
  background-color: #ff4d4f;
  border-color: #ff4d4f;
}

.edit-btn {
  border-color: #87CEFA;
  color: #87CEFA;
}

.edit-btn:hover {
  color: #ffffff;
  background-color: #87CEFA;
}

.delete-btn {
  background-color: white;
  color: #ff4d4f;
  border-color: #ff4d4f;
}

.delete-btn:hover {
  background-color: #ff4d4f;
  color: white;
}

/* 响应式适配 */
@media (max-width: 992px) {
  .page-actions {
    justify-content: flex-start;
    margin-top: 16px;
  }
}

@media (max-width: 768px) {
  #pictureManagePage {
    padding: 12px;
  }

  .page-title {
    font-size: 20px;
  }

  .search-form {
    flex-direction: column;
    align-items: stretch;
  }

  .search-form :deep(.ant-form-item) {
    margin-right: 0;
    width: 100%;
  }

  .action-icon-btn {
    width: 24px;
    height: 24px;
    font-size: 12px;
  }

  .picture-table :deep(.ant-table-thead > tr > th) {
    padding: 8px 4px;
  }

  .picture-table :deep(.ant-table-tbody > tr > td) {
    padding: 6px 4px;
  }
}
.search-form {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}

.right-actions {
  margin-left: auto; /* 这会将此元素推到右侧 */
}

.page-actions {
  display: flex;
  gap: 8px;
}
</style>
