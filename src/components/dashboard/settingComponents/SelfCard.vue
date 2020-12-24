<template>
  <div class="profile">
    <v-card
        :key="selfCardKey"
        :dark="isDarkMode"
        class="mx-auto justify-center d-flex flex-wrap"
        max-width="1000"
    >
      <div>
        <v-avatar class="avatar ma-3" size="128">
          <v-icon :dark="isDarkMode" size="128">
            mdi-account-circle
          </v-icon>
        </v-avatar>
        <v-card-actions>
          <v-btn :disabled="changingAvatar" :loading="changingAvatar" class="mx-auto"
                 color="info" text @click.prevent.stop="uploadButtonClicked">
            {{ currentUser.avatar ? 'change' : 'add avatar' }}
          </v-btn>
          <input
              ref="uploader"
              accept="image/jpeg,image/png,image/gif"
              class="d-none"
              type="file"
              @change="onFileChanged($event)"
          >
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
          <v-btn color="info" text @click.prevent.stop="openEditInfoDialog">
            <v-dialog :key="editInfoDialogKey" v-model="editInfoDialog" :dark="isDarkMode"
                      max-width="500px" persistent>
              <v-card :disabled="inProgress" :loading="inProgress">
                <v-card-title class="d-flex flex-nowrap align-baseline text-break">
                  {{ currentUser.info ? 'Edit your info' : 'Add an info' }}
                </v-card-title>
                <v-container fluid>
                  <v-textarea
                      v-model="currentUserInfoInEditMode"
                      dense
                      filled
                      no-resize
                  ></v-textarea>
                </v-container>
                <v-card-actions>
                  <v-btn
                      color="error"
                      text
                      @click="closeEditInfoDialog"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                      color="primary"
                      text
                      @click="modifyInfo"
                  >
                    OK
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            {{ currentUser.info ? 'edit' : 'add an info' }}
          </v-btn>
        </v-card-actions>
      </v-col>
    </v-card>
  </div>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs, ref} from "@vue/composition-api";
import {changeAdminAvatar, changeAdminInfo, uploadMedia} from "@/api/api";
import appStore from "@/store/app";
import {Admin, UploadedMedia} from "@/api/types/apiTypes";

export default defineComponent({
  name: "SelfCard",
  props: {
    isDarkMode: {
      required: false,
      type: Boolean
    },
    currentUser: {
      required: true,
      type: Object
    }
  },
  setup({currentUser}, {emit}) {
    const data = reactive({
      editInfoDialog: false,
      editInfoDialogKey: 0,
      currentUserInfoInEditMode: '',
      inProgress: false,
      selfCardKey: 0,
      changingAvatar: false
    })

    const uploader = ref({} as HTMLInputElement)

    const openEditInfoDialog = () => {
      data.currentUserInfoInEditMode = appStore.getCurrentUser?.info as string
      data.editInfoDialog = true
    }

    const modifyInfo = async () => {
      data.inProgress = true
      const info = data.currentUserInfoInEditMode ? data.currentUserInfoInEditMode.toString().trim() : ''
      const jwtToken = appStore.getJwtKey
      if (typeof info !== 'undefined' && info !== currentUser.info && jwtToken) {
        const resultAdminPack = await changeAdminInfo(currentUser._id, info, jwtToken) as unknown as Admin
        if (!('statusCode' in resultAdminPack)) {
          await appStore.setCurrentUser(resultAdminPack)
          data.selfCardKey++
          emit('refresh-info')
        }
      }
      data.inProgress = false
      closeEditInfoDialog()
    }

    const closeEditInfoDialog = () => {
      data.editInfoDialog = false
      setTimeout(() => {
        data.editInfoDialogKey++
      }, 300)
    }

    const onFileChanged = async (e: InputEvent) => {
      data.changingAvatar = true
      await changeAvatar(((e.target as HTMLInputElement).files as FileList)[0])
      data.changingAvatar = false
    }

    const uploadButtonClicked = () => {
      uploader.value.click()
    }

    const isFileImage = (file: File): boolean => {
      const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
      return file && acceptedImageTypes.includes(file['type'])
    }

    const changeAvatar = async (file: File) => {
      if (isFileImage(file)) {
        if (file.size < 10 << 20) {
          const jwtToken = appStore.getJwtKey
          if (jwtToken) {
            const {url} = (await uploadMedia(file, 'webp')) as unknown as UploadedMedia
            if (url) {
              const resultAdminPack = await changeAdminAvatar(currentUser._id, url, jwtToken) as unknown as Admin
              if (!('statusCode' in resultAdminPack)) {
                await appStore.setCurrentUser(resultAdminPack)
                emit('refresh-avatar')
              }
            } else {
              alert('Fail to change avatar!')
            }
          }
        } else {
          alert('File too big! Must under 10 MB.')
        }
      } else {
        alert('Invalid file type!')
      }
    }

    return {
      modifyInfo,
      closeEditInfoDialog,
      openEditInfoDialog,
      onFileChanged,
      uploadButtonClicked,
      uploader,
      ...toRefs(data)
    }
  }
})

</script>
