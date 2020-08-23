<template>
  <v-app class="home-page">
    <div class="main-field">
      <h1 class="main-field__title">
        mr.coding
      </h1>
      <v-form id="form" ref="form" v-model="valid">
        <div class="main-field__login-field" v-if="!logged">
          <v-text-field
              :disabled="loginInProgress"
              :rules="loginRules"
              @input="startInput"
              @keypress.enter.prevent="login"
              dense
              label="username"
              outlined
              required
              solo-inverted
              v-model="username"
          />
          <v-text-field
              :disabled="loginInProgress"
              :rules="loginRules"
              @input="startInput"
              @keypress.enter.prevent="login"
              dense
              label="password"
              outlined
              required
              solo-inverted
              type="password"
              v-model="password"
          />
          <p>{{ loginStatusMessages }}</p>
          <div class="main-field__buttons">
            <v-btn
                :disabled="!password||!username||loginInProgress"
                @click.exact.prevent.stop="login"
                color="success"
                small
            >
              LOGIN
            </v-btn>
          </div>
        </div>
      </v-form>
      <div class="main-field__chatroom-selection-field" v-if="logged">
        <v-text-field
            @keypress.enter.prevent="chatroomToGo.trim()&&$router.push(getWhereToGo.toString())"
            dense
            label="chatroom ID"
            outlined
            required
            solo-inverted
            v-model="chatroomToGo"
        />
        <div class="main-field__buttons">
          <v-btn :disabled="!chatroomToGo" :to="getWhereToGo" color="primary" small>
            GO THIS ROOM
          </v-btn>
        </div>
      </div>
    </div>
  </v-app>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  reactive,
  toRefs,
  onBeforeMount,
  UnwrapRef,
  ComputedRef
} from '@vue/composition-api';
import appStore from '@/store/app'
import adminDataFetcher from '@/utils/adminDataFetcher'
import {setJwtToLocalStorageWithExpire} from '@/utils/jwtTokenController'
import {auth} from "@/api/api"
import '@/assets/scss/pages/home.scss'
import {authResponse} from "@/api/types/apiTypes";

export default defineComponent({
  name: "Home",
  props: {},
  setup() {
    const loginRules = [
      (v: never) => !!v || 'required'
    ]

    // eslint-disable-next-line
    const data: UnwrapRef<{
      valid: boolean,
      password: string,
      logged: boolean,
      loginInProgress: boolean,
      getWhereToGo: ComputedRef<string>,
      chatroomToGo: string,
      loginStatusMessages: string,
      username: string
    }> = reactive({
      loginInProgress: false,
      logged: false,
      username: '',
      password: '',
      chatroomToGo: '',
      loginStatusMessages: '',
      valid: true,
      getWhereToGo: computed((): string => '/chatroom/' + data.chatroomToGo.trim())
    })

    const startInput = () => {
      data.loginStatusMessages = ''
    }

    const login = async () => {
      if (data.username.trim() && data.password.trim()) {
        data.loginInProgress = true
        startInput()
        const {token} = (await auth(data.username, data.password)) as authResponse
        data.password = ''
        if (token) {
          if (await adminDataFetcher(token)) {
            await setJwtToLocalStorageWithExpire(token)
            appStore.setCurrentUserJwtToken(token)
            startInput()
            data.logged = true
          } else {
            data.loginStatusMessages = 'jwt validation failed'
          }
        } else {
          data.loginStatusMessages = 'invalid username or password!'
        }
      }
      data.loginInProgress = false
    }

    onBeforeMount(async () => {
      if (await adminDataFetcher()) {
        startInput()
        await new Promise((resolve) => {
          data.logged = true
          resolve()
        })
      }
    })

    onMounted(() => {
      document.dispatchEvent(new Event('app-rendered'));
    })

    return {
      startInput,
      login,
      loginRules,
      ...toRefs(data)
    };
  }
});
</script>
