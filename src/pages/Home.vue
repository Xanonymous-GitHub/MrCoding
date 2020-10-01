<template>
  <VApp class="home-page">
    <main id="home" class="page-container">
      <div class="main-field">
        <h1 class="main-field__title">
          mr.coding
        </h1>
        <VForm id="form" ref="form" v-model="valid">
          <div v-if="!logged" class="main-field__login-field">
            <VTextField
                v-model="username"
                :disabled="loginInProgress"
                :rules="loginRules"
                dense
                label="username"
                outlined
                required
                solo-inverted
                @input="startInput"
                @keypress.enter.prevent="login"
            />
            <VTextField
                v-model="password"
                :disabled="loginInProgress"
                :rules="loginRules"
                dense
                label="password"
                outlined
                required
                solo-inverted
                type="password"
                @input="startInput"
                @keypress.enter.prevent="login"
            />
            <p>{{ loginStatusMessages }}</p>
            <div class="main-field__buttons">
              <VBtn
                  :disabled="!password||!username||loginInProgress"
                  color="success"
                  small
                  @click.exact.prevent.stop="login"
              >
                LOGIN
              </VBtn>
            </div>
          </div>
        </VForm>
        <div v-if="logged" class="main-field__chatroom-selection-field">
          <VTextField
              v-model="chatroomToGo"
              dense
              label="chatroom ID"
              outlined
              required
              solo-inverted
              @keypress.enter.prevent="chatroomToGo.trim()&&$router.push(getWhereToGo.toString())"
          />
          <div class="main-field__buttons">
            <VBtn :disabled="!chatroomToGo" :to="getWhereToGo" color="primary" small>
              GO THIS ROOM
            </VBtn>
          </div>
        </div>
      </div>
    </main>
  </VApp>
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
import getUserDataByJwtToken from '@/utils/jwtSignIn'
import {setJwtToLocalStorageWithExpire} from '@/utils/jwtToken'
import {adminAuth} from "@/api/api"
import '@/assets/scss/pages/home.scss'
import {authResponse} from "@/api/types/apiTypes";
import autoLogin from "@/api/accountManager";
import {VApp, VForm, VTextField, VBtn} from 'vuetify/lib';

export default defineComponent({
  name: "Home",
  props: {},
  components: {
    VApp,
    VForm,
    VTextField,
    VBtn
  },
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
