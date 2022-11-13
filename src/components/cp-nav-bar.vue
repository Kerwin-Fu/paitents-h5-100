<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()

defineProps<{
  title?: string
  rightText?: string
}>()
const emit = defineEmits<{
  (e: 'right-click'): void
}>()

// 一定有的功能：返回图标，返回效果，固定定位（组件内部实现）
// 使用组件时候才能确定的功能：标题，右侧文字，点击右侧文字行为（props传入）
function onClickLeft(): void {
  if (history.state?.back) {
    router.back()
  } else {
    router.push('/')
  }
}
function onClickRight(): void {
  emit('right-click')
}
</script>

<template>
  <van-nav-bar
    left-arrow
    fixed
    :title="title"
    :right-text="rightText"
    @click-left="onClickLeft"
    @click-right="onClickRight"
  ></van-nav-bar>
</template>

<style lang="scss" scoped>
::v-deep() {
  .van-nav-bar {
    &__arrow {
      font-size: 18px;
      color: var(--cp-text1);
    }
    &__text {
      font-size: 15px;
    }
  }
}
</style>
