<template>
    <div class="regis">
        <h2>Daftar Akun</h2>
        <div class="card-body">
            <div class="daftar">
              <form @submit.prevent="regis">
                <div class="input-group input-group-outline my-3">
                    <label class="form-label">Nama</label>
                    <input type="text" class="form-control" v-model="nama">
                </div>
                <div class="input-group input-group-outline my-3">
                    <label class="form-label">Email</label>
                    <input type="email" class="form-control" v-model="email">
                </div>
                <div class="input-group input-group-outline my-3">
                    <label class="form-label">Nomor Whatsapp Aktif</label>
                    <input type="number" class="form-control" v-model="nowa">
                </div>
                <div class="input-group input-group-outline mb-3">
                    <label class="form-label">Kata Sandi</label>
                    <input type="password" class="form-control" v-model="katasandi">
                </div>
                <!-- Input untuk peran_id disembunyikan -->
                <input type="hidden" v-model="peran_id"> 
                <div class="button">
                    <button type="submit" class="btn">Daftar</button>
                </div>
                <p class="login">
                    Sudah punya akun?
                    <router-link to="/masuk" class="text-primary text-gradient font-weight-bold">Login</router-link>
                </p>
              </form>
            </div>
        </div></div>
  </template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      nama: '',
      email: '',
      nowa: '',
      katasandi: '',
      peran_id: 2, // Tetapkan peran_id ke 2 untuk pelanggan langsung
      errorMessage: ''
    };
  },
  methods: {
    async regis() {
      try {
        const response = await axios.post('http://localhost:3000/api/register', {
          nama: this.nama,
          email: this.email,
          nowa: this.nowa,
          katasandi: this.katasandi,
          peran_id: this.peran_id
        });
        if (response.data.success) {
          alert('Registrasi berhasil!');
          this.$router.push({ path: '/' });
        } else {
          this.errorMessage = response.data.message || 'Terjadi kesalahan saat register.';
          alert('Registrasi gagal: ' + this.errorMessage);
        }
      } catch (error) {
        console.error('Error registering:', error);
        this.errorMessage = error.response ? error.response.data.message : error.message;
        alert('Terjadi kesalahan saat register: ' + this.errorMessage);
      }
    }
  }
};
</script>

<style scoped>
.regis {
    text-align: center;
    padding-top: 30px;
}
.card-body {
    padding-top: 10px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}
.daftar {
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
.login {
    padding-bottom: 10px;
}
/* @media screen and (max-width: 768px) {
    .regis {
      width: 70%;
    }
} */
</style>
