<template>
  <div class="main" v-if="akun">
    <h2>Profil Akun - {{ akun.nama }}</h2>
    <h4>Nomor Akun: {{ akun.no_akun }} <br> Email: {{ akun.email }}</h4>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="nama">Nama Lengkap</label>
        <input type="text" id="nama" v-model="form.nama" class="form-control" required />
      </div>
      <div class="form-group">
        <label for="nowa">Nomor Whatsapp Aktif</label>
        <input type="text" id="nowa" v-model="form.nowa" class="form-control" required />
      </div>
      <div class="form-group">
        <label for="katasandi">Kata Sandi</label>
        <input type="password" id="katasandi" v-model="form.katasandi" class="form-control" required />
      </div>
      <button type="submit" class="btn btn-primary">Perbarui Profil</button>
    </form>
  </div>
  <div v-else>
    <p>Loading...</p>
  </div>
</template>

<script lang="ts">
import axios from 'axios';
import { defineComponent } from 'vue';
import { useAuthStore } from '@/stores/auth';

interface Akun {
  id: number;
  no_akun: string;
  email: string;
  nama: string;
  nowa: string;
  katasandi: string;
}

export default defineComponent({
  name: 'EditAkun',
  data() {
    return {
      akun: {} as Akun, // Inisialisasi dengan tipe Akun
      form: {
        nama: '',
        nowa: '',
        katasandi: ''
      }
    };
  },
  computed: {
    isAuthenticated() {
      return useAuthStore();
    }
  },
  mounted() {
    this.fetchAkunData();
  },
  methods: {
    async fetchAkunData() {
      const userId = this.$route.params.id;
      try {
        const response = await axios.get(`http://localhost:3000/api/user/${userId}`);
        this.akun = response.data;

        // Mengisi form dengan data akun
        this.form = {
          nama: this.akun.nama,
          nowa: this.akun.nowa,
          katasandi: '' // Kata sandi tidak diisi otomatis
        };
      } catch (error) {
        console.error('Error fetching akun data:', error);
      }
    },
    async submitForm() {
      try {
        const token = localStorage.getItem('token'); // Ambil token dari local storage
        if (!token) {
          throw new Error('Token tidak ditemukan. Anda harus login terlebih dahulu.');
        }

        const config = {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        };

        const userId = this.$route.params.id;
        await axios.put(`http://localhost:3000/api/akun-edit/${userId}`, this.form, config);
        alert('Profil berhasil diperbarui!');
        this.$router.push('/');
      } catch (error) {
        console.error('Error updating akun:', error);
        if (error.response) {
          console.error('Server responded with:', error.response.data);
          alert(error.response.data.message || 'Internal server error');
        } else {
          alert('Gagal memperbarui profil. Silakan coba lagi.');
        }
      }
    }
  }
});
</script>

<style scoped>
.main {
    margin: 20px;
}
h2{
    padding-bottom: 15px;
    display: flex;
    justify-content: center;
}
h4{
    padding-bottom: 10px;
}
.form-group {
    margin-bottom: 15px;
}
.form-control {
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
    border: 1px solid #ccc;
    border-radius: 5px;
}
.btn-primary {
    padding: 10px 15px;
    background-color: #007bff;
    border: none;
    color: white;
    cursor: pointer;
}
.btn-primary:hover {
    background-color: #0056b3;
}
</style>