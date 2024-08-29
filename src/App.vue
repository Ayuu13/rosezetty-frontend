<template>
  <div>
    <div class="navbar">
      <AdminNavbar v-if="isAuthenticated && userRole === 1" />
      <UserNavbar v-else />
    </div>
    <div class="main">
      <RouterView />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import AdminNavbar from "./components/AdminNavbar.vue";
import UserNavbar from "./components/UserNavbar.vue";

export default {
  components: { AdminNavbar, UserNavbar },
  computed: {
    ...mapGetters(['isAuthenticated', 'userRole'])
  }
}
</script>