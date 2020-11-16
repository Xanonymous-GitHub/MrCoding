<template>
  <div class="teachers">
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
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs, onMounted} from "@vue/composition-api";
import {getAllUsers} from "@/api/api";
import appStore from "@/store/app";
import {Admin} from "@/api/types/apiTypes";

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
      teachers: [] as unknown as Array<Admin | { header: string } | { divider: boolean, inset: boolean }>
    })

    const loadTeachers = async () => {
      const header = {header: 'Mr.Coding Teachers'}
      const divider = {divider: true, inset: true}
      data.teachers.push(header)
      const jwtKey = appStore.getJwtKey
      if (jwtKey) {
        const teachers = await getAllUsers(jwtKey) as unknown as Array<Admin>
        if ('statusCode' in teachers) {
          return
        }
        for (const teacher of teachers) {
          if ('admin' in teacher) {
            if (teacher['admin']) {
              data.teachers.push(teacher)
              data.teachers.push(divider)
            }
          }
        }
      }
    }

    onMounted(async () => {
      await loadTeachers()
    })

    return {
      ...toRefs(data)
    }
  }
})
</script>
