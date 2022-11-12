<script setup lang="ts">
// import { RouterLink, RouterView } from 'vue-router'
import type { User } from './types/user'
import { request } from './utils/request'
import { useUserStore } from './stores'
import { Button } from 'vant'

async function getUserInfo() {
  try {
    const res = await request('/patient/myUser')
    console.log(res)
  } catch (error) {
    console.log(error)
  }
}

const store = useUserStore()
async function login() {
  try {
    const res = await request<User>('/login/password', 'POST', {
      mobile: '13211112222',
      password: 'abc12345'
    })
    store.setUser(res.data)
  } catch (error) {
    console.log(error)
  }
}
</script>

<template>
  <p>{{ store.user }}</p>
  <Button type="primary" @click="getUserInfo"> 获取个人信息 </Button>
  <Button type="primary" @click="login">登录</Button>
</template>

<style scoped></style>
