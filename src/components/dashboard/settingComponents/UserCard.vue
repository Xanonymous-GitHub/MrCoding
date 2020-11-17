<template>
  <div>
    <div class="users">
      <v-card
          :dark="isDarkMode"
          class="mx-auto"
          max-width="1000"
      >
        <v-list three-line>
          <template v-for="(teachers, index) in teachers">
            <v-subheader
                v-if="teachers.header"
                :key="teachers.header"
                v-text="teachers.header"
            />

            <v-divider
                v-else-if="teachers.divider"
                :key="index"
                :inset="teachers.inset"
            />

            <v-list-item
                v-else
                :key="teachers._id"
            >
              <v-list-item-avatar>
                <v-img v-if="teachers.avatar" :src="teachers.avatar"/>
                <v-icon v-else :dark="isDarkMode" size="40">
                  mdi-account-circle
                </v-icon>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title class="d-flex flex-nowrap">
                  {{ teachers.username }}
                  <span v-if="teachers.cc" class="badge">
                  <v-icon class="verified-badge verified-badge__layer" size="20">mdi-checkbox-blank-circle</v-icon>
                  <v-icon class="verified-badge" size="20">mdi-check-decagram</v-icon>
                </span>
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ teachers._id }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-list>
      </v-card>
    </div>
    <div class="users">
      <v-card
          :dark="isDarkMode"
          class="mx-auto"
          max-width="1000"
      >
        <v-list three-line>
          <template v-for="(student, index) in students">
            <v-subheader
                v-if="student.header"
                :key="student.header"
                v-text="student.header"
            />

            <v-divider
                v-else-if="student.divider"
                :key="index"
                :inset="student.inset"
            />

            <v-list-item
                v-else
                :key="student._id"
            >
              <v-list-item-avatar>
                <v-img v-if="student.avatar" :src="student.avatar"/>
                <v-icon v-else :dark="isDarkMode" size="40">
                  mdi-account-circle
                </v-icon>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title class="d-flex flex-nowrap">
                  {{ student.username }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ student._id }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-list>
      </v-card>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs, onMounted} from "@vue/composition-api";
import {getAllUsers} from "@/api/api";
import appStore from "@/store/app";
import {Admin, LiffUser} from "@/api/types/apiTypes";

type list = { header: string } | { divider: boolean, inset: boolean }

export default defineComponent({
  name: "TeacherCard",
  props: {
    isDarkMode: {
      required: false,
      type: Boolean
    },
  },
  setup() {
    const data = reactive({
      teachers: [] as unknown as Array<Admin | list>,
      students: [] as unknown as Array<LiffUser | list>
    })

    const loadUsers = async () => {
      const teacherHeader = {header: 'Mr.Coding Teachers'}
      const studentHeader = {header: 'Participants'}
      const divider = {divider: true, inset: true}
      data.teachers.push(teacherHeader)
      data.students.push(studentHeader)
      const jwtKey = appStore.getJwtKey
      if (jwtKey) {
        const users = await getAllUsers(jwtKey) as unknown as Array<Admin | LiffUser>
        if ('statusCode' in users) {
          return
        }
        for (const user of users) {
          if ('admin' in user) {
            if (user['admin']) {
              data.teachers.push(user)
              data.teachers.push(divider)
            } else {
              data.students.push(user)
              data.students.push(divider)
            }
          }
        }
      }
    }

    onMounted(async () => {
      await loadUsers()
    })

    return {
      ...toRefs(data)
    }
  }
})
</script>
