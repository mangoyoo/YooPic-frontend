<template>
  <div id="spaceManagePage">
    <!-- 搜索区域 -->
    <a-card class="search-card" :bordered="false">
      <div class="search-section">
        <div class="section-header">
          <span class="section-title">空间筛选</span>
          <a-divider type="vertical" />
        </div>
        <a-form layout="inline" :model="searchParams" @finish="doSearch" class="search-form">
          <a-form-item label="空间名称">
            <a-input v-model:value="searchParams.spaceName" placeholder="请输入空间名称" allow-clear />
          </a-form-item>
          <a-form-item name="spaceLevel" label="空间级别">
            <a-select
              v-model:value="searchParams.spaceLevel"
              style="min-width: 180px"
              placeholder="请选择空间级别"
              :options="SPACE_LEVEL_OPTIONS"
              allow-clear
            />
          </a-form-item>
          <a-form-item label="空间类别" name="spaceType">
            <a-select
              v-model:value="searchParams.spaceType"
              :options="SPACE_TYPE_OPTIONS"
              placeholder="请输入空间类别"
              style="min-width: 180px"
              allow-clear
            />
          </a-form-item>
          <a-form-item label="用户 id">
            <a-input v-model:value="searchParams.userId" placeholder="请输入用户 id" allow-clear />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" html-type="submit" class="search-button">搜索</a-button>
          </a-form-item>

          <!-- 将操作按钮放在右侧 -->
          <a-form-item class="right-actions">
            <div class="page-actions">
              <a-button
                type="primary"
                href="/add_space"
                target="_blank"
                class="action-button add-button"
              >
                <template #icon><PlusOutlined /></template>
                创建空间
              </a-button>
              <a-button
                type="primary"
                ghost
                href="/space_analyze?queryPublic=1"
                target="_blank"
                class="action-button analyze-button"
              >
                <template #icon><LineChartOutlined /></template>
                分析公共图库
              </a-button>
              <a-button
                type="primary"
                ghost
                href="/space_analyze?queryAll=1"
                target="_blank"
                class="action-button analyze-button"
              >
                <template #icon><BarChartOutlined /></template>
                分析全部空间
              </a-button>
            </div>
          </a-form-item>
        </a-form>
      </div>
    </a-card>

    <!-- 内容区域：空间表格 -->
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
        class="space-table"
      >
        <template #bodyCell="{ column, record }">
          <!-- 空间级别列 -->
          <template v-if="column.dataIndex === 'spaceLevel'">
            <div class="level-tag">{{ SPACE_LEVEL_MAP[record.spaceLevel] }}</div>
          </template>

          <!-- 空间类别列 -->
          <template v-if="column.dataIndex === 'spaceType'">
            <a-tag class="space-type-tag">{{ SPACE_TYPE_MAP[record.spaceType] }}</a-tag>
          </template>

          <!-- 使用情况列 -->
          <template v-if="column.dataIndex === 'spaceUseInfo'">
            <div class="usage-info">
              <div class="usage-item">大小：{{ formatSize(record.totalSize) }} / {{ formatSize(record.maxSize) }}</div>
              <div class="usage-item">数量：{{ record.totalCount }} / {{ record.maxCount }}</div>
            </div>
          </template>

          <!-- 时间列 -->
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

          <!-- 操作列 -->
          <template v-else-if="column.key === 'action'">
            <div class="action-buttons">
              <a-tooltip title="分析空间">
                <a-button
                  type="primary"
                  ghost
                  size="small"
                  shape="circle"
                  :href="`/space_analyze?spaceId=${record.id}`"
                  target="_blank"
                  class="analyze-btn action-icon-btn"
                >
                  <template #icon><LineChartOutlined /></template>
                </a-button>
              </a-tooltip>

              <a-tooltip title="编辑空间">
                <a-button
                  type="primary"
                  ghost
                  size="small"
                  shape="circle"
                  :href="`/add_space?id=${record.id}`"
                  target="_blank"
                  class="edit-btn action-icon-btn"
                >
                  <template #icon><EditOutlined /></template>
                </a-button>
              </a-tooltip>

              <a-tooltip title="删除空间">
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
import { deleteSpaceUsingPost, listSpaceByPageUsingPost } from '@/api/spaceController.ts'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import {
  SPACE_LEVEL_MAP,
  SPACE_LEVEL_OPTIONS,
  SPACE_TYPE_MAP,
  SPACE_TYPE_OPTIONS,
} from '../../constants/space.ts'
import { formatSize } from '../../utils'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  LineChartOutlined,
  BarChartOutlined
} from '@ant-design/icons-vue'

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 70,
    fixed: 'left',
    align: 'center',
  },
  {
    title: '空间名称',
    dataIndex: 'spaceName',
    width: 150,
    ellipsis: true,
    align: 'center',
  },
  {
    title: '空间级别',
    dataIndex: 'spaceLevel',
    width: 100,
    align: 'center',
  },
  {
    title: '空间类别',
    dataIndex: 'spaceType',
    width: 100,
    align: 'center',
  },
  {
    title: '使用情况',
    dataIndex: 'spaceUseInfo',
    width: 180,
    align: 'center',
  },
  {
    title: '用户 ID',
    dataIndex: 'userId',
    width: 80,
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
    width: 120,
    fixed: 'right',
    align: 'center',
  },
]

// 定义数据
const dataList = ref<API.Space[]>([])
const total = ref(0)
const loading = ref(false)

// 搜索条件
const searchParams = reactive<API.SpaceQueryRequest>({
  current: 1,
  pageSize: 10,
  sortField: 'createTime',
  sortOrder: 'descend',
})

// 获取数据
const fetchData = async () => {
  loading.value = true
  try {
    const res = await listSpaceByPageUsingPost({
      ...searchParams,
    })
    if (res.data.code === 0 && res.data.data) {
      dataList.value = res.data.data.records ?? []
      total.value = res.data.data.total ?? 0
    } else {
      message.error('获取数据失败，' + res.data.message)
    }
  } catch (error) {
    message.error('获取空间列表失败，请稍后重试')
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
  const res = await deleteSpaceUsingPost({ id })
  if (res.data.code === 0) {
    message.success('删除成功')
    // 刷新数据
    fetchData()
  } else {
    message.error('删除失败')
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

#spaceManagePage {
  padding: 20px;
  background-color: #f7fafd;
  min-height: 100vh;
  color: #333333;
}

/* ===== 卡片公共样式 ===== */
.search-card,
.content-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  background-color: #F0F8FF;
  overflow: hidden;
  margin-bottom: 12px;
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

.right-actions {
  margin-left: auto; /* 将元素推到右侧 */
}

.page-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
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

.add-button {
  background-color: #87CEFA;
  border-color: #87CEFA;
}

.add-button:hover {
  background-color: #75bdea;
  border-color: #75bdea;
}

.analyze-button {
  border-color: #87CEFA;
  color: #87CEFA;
}

.analyze-button:hover {
  color: #ffffff;
  background-color: #87CEFA;
}

/* ===== 内容区域：表格 ===== */
.content-card {
  padding: 0;
}

.space-table {
  width: 100%;
}

.space-table :deep(.ant-table-thead > tr > th) {
  background-color: rgba(135, 206, 250, 0.1);
  color: #333333;
  font-weight: 600;
  padding: 10px 8px;
  text-align: center;
}

.space-table :deep(.ant-table-tbody > tr > td) {
  padding: 8px;
  text-align: center;
}

.space-table :deep(.ant-table-tbody > tr:hover > td) {
  background-color: rgba(135, 206, 250, 0.05);
}

.space-table :deep(.ant-pagination-item-active) {
  border-color: #87CEFA;
}

.space-table :deep(.ant-pagination-item-active a) {
  color: #87CEFA;
}

/* 空间类型和级别标签样式 */
.level-tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  background-color: rgba(135, 206, 250, 0.1);
  color: #1890ff;
}

.space-type-tag {
  border-radius: 12px;
  padding: 0 10px;
  background-color: rgba(135, 206, 250, 0.1);
  border-color: rgba(135, 206, 250, 0.3);
  color: #1890ff;
}

/* 使用情况样式 */
.usage-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
}

.usage-item {
  font-size: 13px;
  line-height: 1.4;
  color: #666666;
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

.analyze-btn {
  border-color: #1890ff;
  color: #1890ff;
}

.analyze-btn:hover {
  color: #ffffff;
  background-color: #1890ff;
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
  #spaceManagePage {
    padding: 12px;
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

  .space-table :deep(.ant-table-thead > tr > th) {
    padding: 8px 4px;
  }

  .space-table :deep(.ant-table-tbody > tr > td) {
    padding: 6px 4px;
  }
}
</style>
