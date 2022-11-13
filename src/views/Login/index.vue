<script setup lang="ts">
import { onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores'
import { mobileRules, passwordRules, codeRules } from '@/utils/rules'
import { loginByPassword, loginByMobile, sengMobileCode } from '@/services/user'
import { Toast, type FormInstance } from 'vant'

const store = useUserStore()
const router = useRouter()
const route = useRoute()

// 表单数据
const mobile = ref('')
const password = ref('')
const code = ref('')
// 控制密码是否显示
const show = ref(false)
const agree = ref<boolean>(false)
const isPass = ref(true)
const time = ref(0)
let timeId: number
const form = ref<FormInstance>()

async function send() {
  if (time.value > 0) return
  await form.value?.validate('mobile')
  await sengMobileCode(mobile.value, 'login')
  Toast.success('短信发送成功')
  time.value = 60
  clearInterval(timeId)
  timeId = window.setInterval(() => {
    time.value--
    if (time.value <= 0) {
      window.clearInterval(timeId)
    }
  }, 1000)
}

onUnmounted(() => {
  window.clearInterval(timeId)
})

async function login() {
  if (!agree.value) return Toast('请勾选用户协议及隐私条款')
  const res = isPass.value
    ? await loginByPassword(mobile.value, password.value)
    : await loginByMobile(mobile.value, code.value)
  store.setUser(res.data)
  router.push((route.query.returnUrl as string) || '/user')
  Toast.success('登陆成功')
}
</script>

<template>
  <div class="login-page">
    <cp-nav-bar right-text="注册" @click-right="$router.push('/register')"></cp-nav-bar>
    <div class="login-head" @click="isPass = !isPass">
      <h3>{{ isPass ? '密码登录' : '短信登录' }}</h3>
      <a href="javascript:;">
        <span>{{ isPass ? '短信验证码' : '密码' }}登录</span>
        <van-icon name="arrow"></van-icon>
      </a>
    </div>
    <!-- form 表单 -->
    <van-form autocomplete="off" @submit="login">
      <van-field
        v-model="mobile"
        name="mobile"
        :rules="mobileRules"
        placeholder="请输入手机号"
        type="tel"
      ></van-field>
      <van-field
        v-if="isPass"
        v-model="password"
        :rules="passwordRules"
        placeholder="请输入密码"
        :type="show ? 'text' : 'password'"
      >
        <template #button>
          <cp-icon @click="show = !show" :name="`login-eye-${show ? 'on' : 'off'}`"></cp-icon>
        </template>
      </van-field>
      <van-field v-else v-model="code" :rules="codeRules" placeholder="短信验证码">
        <template #button>
          <span class="btn-send" :class="{ active: time > 0 }" @click="send">
            {{ time > 0 ? `${time}s后再次发送` : '发送验证码' }}
          </span>
        </template>
      </van-field>
      <div class="cp-cell">
        <van-checkbox v-model="agree">
          <span>我已同意</span>
          <a href="javascript:;">用户协议</a>
          <span>及</span>
          <a href="javascript:;">隐私条款</a>
        </van-checkbox>
      </div>
      <div class="cp-cell">
        <van-button block round type="primary" native-type="submit">登 录</van-button>
      </div>
      <div class="cp-cell">
        <a href="javascript:;">忘记密码？</a>
      </div>
    </van-form>

    <div class="login-other">
      <van-divider>第三方登录</van-divider>
      <div class="icon">
        <img src="@/assets/qq.svg" alt="" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login {
  &-page {
    padding-top: 46px;
  }

  &-head {
    padding: 30px 30px 50px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    line-height: 1;

    h3 {
      font-weight: normal;
      font-size: 24px;
    }

    a {
      font-size: 15px;
    }
  }

  &-other {
    margin-top: 60px;
    padding: 0 30px;

    .icon {
      display: flex;
      justify-content: center;

      img {
        width: 36px;
        height: 36px;
        padding: 4px;
      }
    }
  }
}

.van-form {
  padding: 0 14px;

  .cp-cell {
    height: 52px;
    line-height: 24px;
    padding: 14px 16px;
    box-sizing: border-box;
    display: flex;
    align-items: center;

    .van-checkbox {
      a {
        color: var(--cp-primary);
        padding: 0 5px;
      }
    }
  }
  .btn-send {
    color: var(--cp-primary);
    &.active {
      color: rgba(22, 194, 163, 0.5);
    }
  }
}
</style>
