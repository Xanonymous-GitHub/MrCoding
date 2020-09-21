<template>
  <v-app class="home-page">
    <main class="page-container" id="home">
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
    </main>
  </v-app>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  reactive,
  toRefs,
  UnwrapRef,
  ComputedRef,
} from '@vue/composition-api';
import appStore from '@/store/app'
import getUserDataByJwtToken from '@/utils/jwtService'
import {setJwtToLocalStorageWithExpire} from '@/utils/jwtTokenController'
import {adminAuth} from "@/api/api"
import '@/assets/scss/pages/home.scss'
import {authResponse} from "@/api/types/apiTypes";
import autoLogin from "@/api/accountManager";

export default defineComponent({
  name: "Home",
  props: {},
  setup() {
    // In vue2 + composition API, 'this' is alias to 'vm.root'
    const loginRules = [
      (v: never) => !!v || 'required'
    ]

    // eslint-disable-next-line
    const data: UnwrapRef<{
      valid: boolean,
      password: string,
      loginInProgress: boolean,
      getWhereToGo: ComputedRef<string>,
      chatroomToGo: string,
      loginStatusMessages: string,
      username: string,
      logged: ComputedRef<boolean>
    }> = reactive({
      loginInProgress: false,
      username: '',
      password: '',
      chatroomToGo: '',
      loginStatusMessages: '',
      valid: true,
      getWhereToGo: computed((): string => '/chatroom/' + data.chatroomToGo.trim()),
      logged: computed(() => appStore.isLoggedIn)
    })

    const startInput = () => {
      data.loginStatusMessages = ''
    }

    const login = async () => {
      if (data.username.trim() && data.password.trim()) {
        data.loginInProgress = true
        startInput()
        const {token} = (await adminAuth(data.username, data.password)) as authResponse
        data.password = ''
        if (token) {
          if (await getUserDataByJwtToken(token)) {
            await setJwtToLocalStorageWithExpire(token)
            startInput()
          } else {
            data.loginStatusMessages = 'jwt validation failed'
          }
        } else {
          data.loginStatusMessages = 'invalid username or password!'
        }
      }
      data.loginInProgress = false
    }

    onMounted(async () => {
      startInput()
      document.dispatchEvent(new Event('app-rendered'));
      await autoLogin()
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
