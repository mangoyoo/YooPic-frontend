<template>
  <div id="spaceManagePage">
    <a-flex justify="space-between">
      <h2>空间成员管理</h2>
      <a-space>
        <a-button type="primary" href="/add_space" target="_blank">+ 创建空间</a-button>
        <a-button type="primary" ghost href="/space_analyze?queryPublic=1" target="_blank"
          >分析公共图库
        </a-button>
        <a-button type="primary" ghost href="/space_analyze?queryAll=1" target="_blank"
          >分析全部空间
        </a-button>
      </a-space>
    </a-flex>
    <div style="margin-bottom: 16px" />
    <!-- 添加成员表单 -->
    <a-form layout="inline" :model="formData" @finish="handleSubmit">
      <a-form-item label="用户 id" name="userId">
        <a-input v-model:value="formData.userId" placeholder="请输入用户 id" allow-clear />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit">添加用户</a-button>
      </a-form-item>
    </a-form>
    <div style="margin-bottom: 16px" />
    <!-- 表格 -->
    <a-table :columns="columns" :data-source="dataList">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'userInfo'">
          <a-space>
            <a-avatar :src="record.user?.userAvatar" />
            {{ record.user?.userName }}
          </a-space>
        </template>
        <template v-if="column.dataIndex === 'spaceRole'">
          <a-select
            :value="record.spaceRole"
          :options="SPACE_ROLE_OPTIONS"
          @change="(newValue) => {
          const last = record.spaceRole; // 捕获旧值
          record.spaceRole = newValue;   // 手动更新 record.spaceRole
          editSpaceRole(newValue, record, last,nowrole);
          }"
          />
        </template>
        <template v-else-if="column.dataIndex === 'createTime'">
          {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-else-if="column.key === 'action'">
          <a-space wrap>
            <a-button type="link" danger @click="doDelete(record.id,record)">删除</a-button>
          </a-space>
        </template>
      </template>
    </a-table>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import { SPACE_ROLE_OPTIONS } from '../../constants/space.ts'
import {
  addSpaceUserUsingPost,
  deleteSpaceUserUsingPost,
  editSpaceUserUsingPost,
  listSpaceUserUsingPost,
} from '@/api/spaceUserController.ts'
import dayjs from 'dayjs'

interface Props {
  id: string
}

const props = defineProps<Props>()

const columns = [
  {
    title: '用户',
    dataIndex: 'userInfo',
  },
  {
    title: '角色',
    dataIndex: 'spaceRole',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
  {
    title: '操作',
    key: 'action',
  },
]

// 定义数据
const dataList = ref<API.SpaceUserVO[]>([])

// 获取数据
const fetchData = async () => {
  const spaceId = props.id
  if (!spaceId) {
    return
  }
  const res = await listSpaceUserUsingPost({
    spaceId,
  })
  if (res.data.code === 0 && res.data.data) {
    dataList.value = res.data.data ?? []
  } else {
    message.error('获取数据失败，' + res.data.message)
  }
}

// 页面加载时获取数据，请求一次
onMounted(() => {
  fetchData()
})

// 添加成员表单
const formData = reactive<API.SpaceUserAddRequest>({})

// 创建成员
const handleSubmit = async () => {
  const spaceId = props.id
  if (!spaceId) {
    return
  }
  const res = await addSpaceUserUsingPost({
    spaceId,
    ...formData,
  })
  if (res.data.code === 0) {
    message.success('添加成功')
    // 刷新数据
    fetchData()
  } else {
    message.error('添加失败，' + res.data.message)
  }
}
import { computed, onMounted, reactive, ref } from 'vue'; // 1. 引入 computed
import { message, Modal } from 'ant-design-vue';         // 引入 Modal 用于操作确认
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
const loginUserStore = useLoginUserStore()
const loginUser = loginUserStore.loginUser
const nowrole = computed(() => {
  // 确保 loginUser 和 loginUser.id 存在，并且 dataList 已加载
  if (!loginUser?.id || !dataList.value || dataList.value.length === 0) {
    console.warn('登录用户信息或数据列表尚未准备好，无法计算 nowrole');
    return undefined; // 或者一个默认角色，例如 'guest'
  }
  // 在 dataList 中查找当前登录用户对应的记录
  const currentUserRecordInDataList = dataList.value.find(
    (record: API.SpaceUserVO) => record.user?.id === loginUser.id
  );
  if (currentUserRecordInDataList) {
    return currentUserRecordInDataList.spaceRole;
  } else {
    // 通常这意味着当前登录用户不在此空间成员列表中，或者数据还没同步
    console.warn(`在空间成员列表中未找到当前登录用户 (ID: ${loginUser.id}) 的记录`);
    return undefined; // 或者一个默认角色
  }
});
// 编辑成员角色
const editSpaceRole = async (value, record, last) => {
  // 检查1: 如果原来的角色是 'creator'
  if (last === 'creator') {
    message.error("创建者默认是最高权限，无法修改");
    record.spaceRole = last; // 回滚UI上的乐观更新
    return;
  }

  // 检查2: 如果试图将角色修改为 'creator'
  if (value === 'creator') {
    message.error("无法修改为创建者"); // 或者 "无法修改"
    record.spaceRole = last; // 回滚UI上的乐观更新
    return;
  }
  if (nowrole.value === 'admin' && (last === 'admin' || value === 'admin')) {
    message.error("管理员无法修改管理员");
    record.spaceRole = last; // 回滚UI上的乐观更新
    return;
  }
  if (
    record.user.id === loginUser.id
  ) {
    message.error("管理员无法自己降级");
    record.spaceRole = last; // 回滚UI上的乐观更新
    return;
  }
  // 移除或注释掉这行，因为它可能不是预期的行为
  // message.error(value);

  try {
    const res = await editSpaceUserUsingPost({
      id: record.id,
      spaceRole: value,
    });

    if (res.data && res.data.code === 0) {
      message.success('修改成功');
      // 此时 record.spaceRole 已经是 value，与后端一致，无需操作
    } else {
      message.error('修改失败，' + (res.data ? res.data.message : '未知错误'));
      record.spaceRole = last; // API调用失败，回滚UI上的乐观更新
    }
  } catch (error) {
    console.error('修改空间角色API出错:', error); // 打印详细错误到控制台
    message.error('修改操作发生异常，请稍后重试'); // 给用户一个通用的错误提示
    record.spaceRole = last; // 发生异常，回滚UI上的乐观更新
  }
};


// 删除数据
const doDelete = async (id: string,record) => {
  if (!id) {
    return
  }
  if (
    record.user.id === loginUser.id
  ) {
    message.error("无法删除自己");
    return;
  }
  else if (
    record.spaceRole === "admin"
    || record.spaceRole === "creator"
  ) {
    message.error("无权限");
    return;
  }
  const res = await deleteSpaceUserUsingPost({ id })
  if (res.data.code === 0) {
    message.success('删除成功')
    // 刷新数据
    fetchData()
  } else {
    message.error('删除失败')
  }
}
</script>
