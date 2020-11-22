<template>
  <v-dialog
      :key="dialogKey"
      v-model="dialog"
      :dark="isDarkMode"
      max-width="600px"
      persistent
  >

    <v-dialog
        :key="confirmDialogKey"
        v-model="confirmDialog"
        :dark="isDarkMode"
        max-width="500px"
        persistent
    >
      <v-card>
        <v-card-title class="d-flex flex-nowrap align-baseline text-break">
          <v-icon :dark="isDarkMode" class="mr-2">
            mdi-alert-circle-outline
          </v-icon>
          {{ confirmMsg }}
        </v-card-title>
        <v-card-actions>
          <v-btn
              v-if="confirmAndCancel"
              color="error"
              text
              @click="closeConfirm"
          >
            No
          </v-btn>
          <v-btn
              color="primary"
              text
              @click="handleConfirmClicked"
          >
            {{ confirmAndCancel ? 'Yes' : 'OK' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <template v-slot:activator="{ on, attrs }">
      <div class="new d-flex justify-center my-12">
        <v-btn v-bind="attrs" v-on="on" class="mx-auto" color="success">
          invite a new teacher
        </v-btn>
      </div>
    </template>
    <v-card :disabled="inProgress" :loading="inProgress">
      <v-card-title>
        <span class="headline">New Teacher's Profile</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-form ref="form" v-model="valid" lazy-validation style="width: 100%">
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
                    @change="validateForm"

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
                      v-model="newPasswordCheck"
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
                        Confirm new password
                      </v-tooltip>
                    </template>
                  </v-text-field>
                </v-fade-transition>
              </v-col>
            </v-form>
            <v-col cols="12">
              <v-container>
                <v-row>
                  <div id="newTeacherAvatar" class="d-flex flex-column ma-auto">
                    <v-avatar class="avatar" size="128">
                      <v-icon :dark="isDarkMode" size="128">
                        mdi-account-circle
                      </v-icon>
                    </v-avatar>
                    <v-btn :disabled="changingAvatar" :loading="changingAvatar" class="mx-auto my-2" color="info" text
                           @click.prevent.stop="uploadButtonClicked">
                      {{ newAvatarFile ? 'change' : 'add avatar' }}
                    </v-btn>
                    <input
                        ref="uploader"
                        accept="image/*"
                        class="d-none"
                        type="file"
                        @change="onFileChanged($event)"
                    >
                  </div>
                  <div class="my-2 mx-2"/>
                  <v-textarea
                      v-model="newInfo"
                      auto-grow
                      class="my-2"
                      clear-icon="mdi-close-circle"
                      clearable
                      label="Biography"
                      outlined
                      value=""
                  />
                </v-row>
              </v-container>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn
            color="error darken-1"
            text
            @click.prevent.stop="closeDialog"
        >
          cancel
        </v-btn>
        <v-btn
            :disabled="((!!!valid) || !newUsername || !newPassword || !newPasswordCheck) && !inProgress"
            color="primary darken-1"
            @click="openConfirm('Are you sure you want to create this admin?', createTeacher, true)"
        >
          Create
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import {defineComponent, reactive, ref, toRefs} from "@vue/composition-api";
import {createAdmin, uploadMedia} from "@/api/api";
import {Admin, NewAdmin, UploadedMedia} from "@/api/types/apiTypes";
import appStore from "@/store/app";
import {toBase64} from "@/utils/avatarCompression";
import replaceAvatar from "@/utils/replaceAvatar";

export default defineComponent({
  name: "NewTeacherDialog",
  props: {
    isDarkMode: {
      required: false,
      type: Boolean
    },
  },
  setup(_, {emit}) {
    const data = reactive({
      dialog: false,
      confirmDialog: false,
      confirmMsg: '',
      confirmAndCancel: false,
      confirmAction: Function(),
      newUsername: '',
      newPassword: '',
      newPasswordCheck: '',
      newAvatarFile: undefined as unknown as File,
      newInfo: '',
      passwordMatchStatusIcon: 'mdi-checkbox-blank-circle-outline',
      passwordMatchStatusIconColor: '',
      dialogKey: 0,
      confirmDialogKey: 0,
      valid: true,
      inProgress: false,
      changingAvatar: false
    })

    const form = ref(undefined)
    const uploader = ref({} as HTMLInputElement)

    const canNotEmpty = [
      (v: never) => !!v || 'required'
    ]

    const passwordNotMatch = [
      (v: string) => (() => {
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
      setTimeout(() => {
        data.dialogKey++
        data.newUsername = ''
        data.newPassword = ''
        data.newPasswordCheck = ''
        data.newAvatarFile = (() => false)() as unknown as File
      }, 300)
    }

    const closeConfirm = () => {
      data.confirmDialog = false
      setTimeout(() => {
        data.confirmDialogKey++
        data.confirmMsg = ''
        data.confirmAndCancel = false
      }, 300)
    }

    const openConfirm = (msg: string, action: (() => unknown), needCancel?: boolean) => {
      data.confirmMsg = msg
      data.confirmAction = action
      data.confirmAndCancel = Boolean(needCancel)
      data.confirmDialog = true
    }

    const validateForm = () => {
      if (form.value) {
        return (form.value as unknown as HTMLFormElement).validate()
      }
    }

    const handleConfirmClicked = () => {
      data.confirmAction()
      closeConfirm()
    }

    const createTeacher = async () => {
      validateForm()
      data.inProgress = true
      let created = false
      if (data.valid) {
        const jwtToken = appStore.getJwtKey
        if (jwtToken) {
          // get all data.
          const username = (data.newUsername).toString().trim()
          const password = (data.newPassword).toString()
          const info = (data.newInfo).toString().trim()
          const cc = false
          const admin = true

          // upload avatar and get its url.
          const {url} = (await uploadMedia(data.newAvatarFile, 'webp')) as unknown as UploadedMedia
          const avatar = url ? (url).toString().trim() : ''

          // concatenate all data.
          const newAdminData: NewAdmin = {
            username,
            password,
            avatar,
            info,
            cc,
            admin
          }

          // send request.
          const result = (await createAdmin(newAdminData, jwtToken)) as unknown as Admin
          created = (result.username === username)
        }
      }
      // notify the settings page.
      emit('creation-done')
      await setTimeout(() => {
        if (created) {
          closeDialog()
        } else {
          openConfirm('Admin account creation failed!', (() => 0))
        }
        data.inProgress = false
      }, 500)
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
      const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png', 'image/svg+xml'];
      return file && acceptedImageTypes.includes(file['type'])
    }

    const changeAvatar = async (file: File) => {
      if (isFileImage(file)) {
        if (file.size < 10 << 20) {
          data.newAvatarFile = file
          const tmpAvatar = (await toBase64(data.newAvatarFile)) as string
          replaceAvatar(tmpAvatar, document.getElementById('newTeacherAvatar') as HTMLDivElement)
        } else {
          alert('File too big! Must under 10 MB.')
        }
      } else {
        alert('Invalid file type!')
      }
    }

    return {
      form,
      canNotEmpty,
      passwordNotMatch,
      uploader,
      closeDialog,
      validateForm,
      createTeacher,
      closeConfirm,
      openConfirm,
      handleConfirmClicked,
      onFileChanged,
      uploadButtonClicked,
      ...toRefs(data)
    }
  }
})
</script>
