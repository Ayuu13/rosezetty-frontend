<template>
    <div class="masuk">
        <h2>Masuk Akun</h2>
        <div class="card-body">
            <div class="login">
              <form @submit.prevent="handleLogin">
                <div class="input-group input-group-outline my-3">
                  <label for="email" class="form-label">Email</label>
                  <input type="email" class="form-control" v-model="email">
                </div>
                <div class="input-group input-group-outline mb-3">
                  <label for="password" class="form-label">Kata Sandi</label>
                  <input type="password" class="form-control" v-model="katasandi">
                </div> 
                <div class="button">
                  <button type="submit" class="btn">Masuk</button>
                </div>
                <p class="regis">
                  Belum punya akun?
                  <router-link to="/register" class="text-primary text-gradient font-weight-bold">Register</router-link>
                </p>
              </form>
            </div>
        </div></div>
  </template>
  
<script>
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      email: '',
      katasandi: '',
      errorMessage: ''
    };
  },
  setup() {
    const authStore = useAuthStore();
    return { authStore };
  },
  methods: {
    ...mapActions(['login']),
    async handleLogin() {
      try {
        console.log('Attempting login');
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/masuk`, {
          email: this.email,
          katasandi: this.katasandi
        });
        console.log('Response:', response.data);

        if (response.data.success) {
          const token = response.data.accessToken;
          localStorage.setItem('token', token);
          this.authStore.setToken(token);

          const user = response.data.user;
          this.login(user);
          if (user.peran_id === 1) {
            this.$router.push({ path: '/admin' });
          } else {
            this.$router.push({ path: '/' });
          }
        } else {
          this.errorMessage = response.data.message || 'Terjadi kesalahan saat login.';
          alert('Masuk Akun gagal: ' + this.errorMessage);
        }
      } catch (error) {
        console.error('Error logging in:', error);
        this.errorMessage = error.response ? error.response.data.message : error.message;
        alert('Terjadi kesalahan saat login: ' + this.errorMessage);
      }
    }
  }
};
</script>

<style scoped>
.masuk {
    text-align: center;
    padding-top: 50px;
}
.card-body {
    padding-top: 10px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}
.login {
    width: 350px;
    margin: 10px;
    padding-left: 15px;
    padding-right: 15px;
    border-radius: 5px;
    background-color: rgb(255, 225, 230);
}
.input-group-outline {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}
.form-label {
    text-align: left;
    width: 100%;
    margin-bottom: 5px;
}
.form-control {
    text-align: left;
    background-color: #ffffff;
    border-radius: 5px;
    width: 100%;
    padding: 10px;
}
.button {
    padding-top: 5px;
    padding-bottom: 10px;
}
.btn {
    width: 100%;
    padding: 5px;
    border-radius: 3px;
    background-color: #007bff;
    color: white;
    cursor: pointer;
}
.regis {
    padding-bottom: 10px;
}
/* @media screen and (max-width: 768px) {
    .masuk {
      width: 70%;
    }
} */
</style>