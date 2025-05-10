<template>
  <div id="globalHeader">
    <a-layout-header
      v-if="loginUserStore.loginUser.id"
      class="header"
    >
      <a-menu
        v-model:selectedKeys="current"
        mode="horizontal"
        :items="menuItems"
        @click="doMenuClick"
        class="header-menu"
      />
    </a-layout-header>
  </div>
</template>

<script lang="ts" setup>
import { computed, h, ref, watchEffect } from 'vue'
import { PictureOutlined, TeamOutlined, UserOutlined, CaretDownOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import { SPACE_TYPE_ENUM } from '@/constants/space.ts'
import { listMyTeamSpaceUsingPost } from '@/api/spaceUserController.ts'
import { message } from 'ant-design-vue'

const loginUserStore = useLoginUserStore()
const router = useRouter()

// 调整后的菜单结构
const fixedMenuItems = [
  {
    key: '/',
    icon: () => h(PictureOutlined),
    label: '主页',
  },
  {
    key: '/my_space',
    label: '我的空间',
    icon: () => h(UserOutlined),
  },
]

const teamSpaceList = ref<API.SpaceUserVO[]>([])
const menuItems = computed(() => {
  const teamSubMenu = {
    key: 'team',
    label: '团队空间',
    icon: () => h(CaretDownOutlined),
    children: [
      {
        key: '/add_space?type=' + SPACE_TYPE_ENUM.TEAM,
        label: '创建团队',
        icon: () => h(TeamOutlined),
      },
      ...teamSpaceList.value.map(spaceUser => ({
        key: '/space/' + spaceUser.spaceId,
        label: spaceUser.space?.spaceName,
      }))
    ]
  }

  return [...fixedMenuItems, teamSubMenu]
})

// 保持原有的数据加载逻辑
const fetchTeamSpaceList = async () => {
  const res = await listMyTeamSpaceUsingPost()
  if (res.data.code === 0 && res.data.data) {
    teamSpaceList.value = res.data.data
  } else {
    message.error('加载团队空间失败: ' + res.data.message)
  }
}

watchEffect(() => {
  if (loginUserStore.loginUser.id) {
    fetchTeamSpaceList()
  }
})

// 路由高亮处理
const current = ref<string[]>([])
router.afterEach((to) => {
  current.value = [to.path]
})

// 路由跳转
const doMenuClick = ({ key }) => {
  router.push(key)
}
</script>

<style scoped>
#globalHeader {
  box-shadow: 0 2px 8px #f0f1f2;
}

.header {
  display: flex;
  padding: 0 20px;
  background: white;
}

.header-menu {
  flex: 1;
  line-height: 48px;
  border-bottom: none;
}

.ant-layout-header {
  height: 48px;
  padding: 0;
}
</style>
