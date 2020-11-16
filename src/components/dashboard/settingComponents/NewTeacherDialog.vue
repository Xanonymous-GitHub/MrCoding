<template>
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
                  <div class="d-flex flex-column ma-auto">
                    <v-avatar class="avatar" size="128">
                      <v-icon :dark="isDarkMode" size="128">
                        mdi-account-circle
                      </v-icon>
                    </v-avatar>
                    <v-btn class="mx-auto" color="info" text>
                      add avatar
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
        <v-spacer/>
        <v-btn
            color="error darken-1"
            text
            @click.prevent.stop="closeDialog"
        >
          cancel
        </v-btn>
        <v-btn
            :disabled="(!!!valid) || !newUsername || !newPassword || !newPasswordCheck"
            color="blue darken-1"
            text
            @click="validateForm"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import {defineComponent, reactive, ref, toRefs} from "@vue/composition-api";

export default defineComponent({
  name: "NewTeacherDialog",
  props: {
    isDarkMode: {
      required: false,
      type: Boolean
    },
  },
  setup() {
    const data = reactive({
      dialog: false,
      newUsername: '',
      newPassword: '',
      newPasswordCheck: '',
      passwordMatchStatusIcon: 'mdi-checkbox-blank-circle-outline',
      passwordMatchStatusIconColor: '',
      dialogKey: 0,
      valid: true
    })

    const form = ref(undefined)

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
      }, 300)
    }

    const validateForm = () => {
      if (form.value) {
        return (form.value as unknown as HTMLFormElement).validate()
      }
    }

    return {
      form,
      canNotEmpty,
      passwordNotMatch,
      closeDialog,
      validateForm,
      ...toRefs(data)
    }
  }
})
</script>
