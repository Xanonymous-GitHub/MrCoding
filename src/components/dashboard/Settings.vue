<template>
  <v-main>
    <div class="profile">
      <v-card
          :dark="isDarkMode"
          class="mx-auto justify-center d-flex flex-wrap"
      >
        <div>
          <v-avatar class="avatar ma-3" size="128">
            <v-icon :dark="isDarkMode" size="128">
              mdi-account-circle
            </v-icon>
          </v-avatar>
          <v-card-actions>
            <v-btn class="mx-auto" color="info" text>
              {{ currentUser.avatar ? 'change' : 'add avatar' }}
            </v-btn>
          </v-card-actions>
        </div>

        <v-col>
          <v-card-title>
            {{ currentUser.username }}
            <span v-if="currentUser.cc" class="badge">
              <v-icon class="verified-badge verified-badge__layer">mdi-checkbox-blank-circle</v-icon>
              <v-icon class="verified-badge">mdi-check-decagram</v-icon>
            </span>
          </v-card-title>

          <v-card-subtitle>
            {{ currentUser._id }}
          </v-card-subtitle>

          <v-card-text>
            {{ currentUser.info }}
          </v-card-text>

          <v-card-actions>
            <v-btn color="info" text>
              {{ currentUser.info ? 'edit' : 'add an info' }}
            </v-btn>
          </v-card-actions>
        </v-col>
      </v-card>
    </div>

    <v-dialog
        :key="dialogKey"
        v-model="dialog"
        :dark="isDarkMode"
        max-width="600px"
        persistent
    >
      <template v-slot:activator="{ on, attrs }">
        <div class="new d-flex justify-center my-12">
          <v-btn v-bind="attrs" v-on="on" class="mx-auto" color="success">
            invite a new teacher
          </v-btn>
        </div>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">New Teacher's Profile</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                    v-model="newUsername"
                    :rules="canNotEmpty"
                    autocomplete="off"
                    label="Username"
                    outlined
                    required
                    solo-inverted
                    type="text"
                >
                  <template v-slot:prepend>
                    <v-tooltip
                        bottom
                    >
                      <template v-slot:activator="{ on }">
                        <v-icon v-on="on">
                          mdi-account-circle-outline
                        </v-icon>
                      </template>
                      New teacher's name
                    </v-tooltip>
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                    v-model="newPassword"
                    :rules="canNotEmpty"
                    autocomplete="new-password"
                    label="Password"
                    outlined
                    required
                    solo-inverted
                    type="password"
                >
                  <template v-slot:prepend>
                    <v-tooltip
                        bottom
                    >
                      <template v-slot:activator="{ on }">
                        <v-icon v-on="on">
                          mdi-lock-outline
                        </v-icon>
                      </template>
                      A new password
                    </v-tooltip>
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="12">
                <v-fade-transition>
                  <v-text-field
                      :disabled="!!!newPassword"
                      :rules="passwordNotMatch"
                      autocomplete="off"
                      label="Confirm password"
                      outlined
                      required
                      solo-inverted
                      transition="fade-transition"
                      type="password"
                  >
                    <template v-slot:prepend>
                      <v-tooltip
                          bottom
                      >
                        <template v-slot:activator="{ on }">
                          <v-icon v-on="on" :color="newPassword?passwordMatchStatusIconColor:''">
                            {{ newPassword ? passwordMatchStatusIcon : 'mdi-checkbox-blank-circle-outline' }}
                          </v-icon>
                        </template>
                        Type the new password again
                      </v-tooltip>
                    </template>
                  </v-text-field>
                </v-fade-transition>
              </v-col>
              <v-col cols="12">
                <v-container>
                  <v-row>
                    <div class="d-flex flex-column ma-auto">
                      <v-avatar class="avatar" size="128">
                        <v-icon :dark="isDarkMode" size="128">
                          mdi-account-circle
                        </v-icon>
                      </v-avatar>
                      <v-btn class="mx-auto" color="info" text>
                        {{ currentUser.avatar ? 'change' : 'add avatar' }}
                      </v-btn>
                    </div>
                    <v-textarea
                        auto-grow
                        class="my-2"
                        clear-icon="mdi-close-circle"
                        clearable
                        label="Biography"
                        outlined
                        value=""
                    ></v-textarea>
                  </v-row>
                </v-container>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="error darken-1"
              text
              @click.prevent.stop="closeDialog"
          >
            cancel
          </v-btn>
          <v-btn
              color="blue darken-1"
              text
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-main>
</template>

<script lang="ts">
import {computed, defineComponent, reactive, toRefs, onMounted} from "@vue/composition-api";
import appStore from "@/store/app";
import replaceAvatar from "@/utils/replaceAvatar";

export default defineComponent({
  name: "Settings",
  setup() {
    const data = reactive({
      isDarkMode: computed(() => appStore.isDarkMode),
      currentUser: computed(() => appStore.getCurrentUser),
      dialog: false,
      newUsername: '',
      newPassword: '',
      passwordMatchStatusIcon: 'mdi-checkbox-blank-circle-outline',
      passwordMatchStatusIconColor: '',
      dialogKey: 0
    })

    const canNotEmpty = [
      (v: never) => !!v || 'required'
    ]

    const passwordNotMatch = [
      (v: never) => (() => {
        const result = (!!v && v === data.newPassword)
        if (result) {
          data.passwordMatchStatusIcon = 'mdi-check-circle-outline'
          data.passwordMatchStatusIconColor = 'success'
        } else {
          data.passwordMatchStatusIcon = 'mdi-checkbox-blank-circle-outline'
          data.passwordMatchStatusIconColor = ''
        }
        return result
      })() || 'password not match!'
    ]

    const closeDialog = () => {
      data.dialog = false
      data.newUsername = ''
      data.newPassword = ''
    }

    onMounted(() => {
      replaceAvatar(appStore.getCurrentUser?.avatar, document.querySelector('.profile') as HTMLElement)
    })

    return {
      closeDialog,
      canNotEmpty,
      passwordNotMatch,
      ...toRefs(data)
    }
  }
})
</script>
