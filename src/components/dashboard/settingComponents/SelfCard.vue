<template>
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
</template>

<script lang="ts">
import {defineComponent} from "@vue/composition-api";

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
  setup() {
    return
  }
})

</script>
