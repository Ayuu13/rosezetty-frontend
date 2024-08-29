<template>
  <div class="main">
    <h2>Tambah Metode Pembayaran</h2>
    <form @submit.prevent="submitForm">
        <div class="form-group">
            <label for="nama">Nama</label>
            <input type="text" id="nama" v-model="form.nama" class="form-control" required />
        </div>
        <div class="form-group">
            <label for="keterangan">Keterangan</label>
            <input type="text" id="keterangan" v-model="form.keterangan" class="form-control" required />
        </div>
        <div class="form-group">
            <label for="gambar">Gambar</label>
            <input type="file" id="gambar" @change="handleFileUpload" class="form-control" />
        </div>
        <button type="submit" class="btn btn-primary">Tambah Pembayaran</button>
    </form>
  </div>
</template>

<script lang="ts">
import axios from 'axios';
import { defineComponent, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { mapGetters } from 'vuex';
 
export default defineComponent({
  name: 'TambahProduk',
  data() {
    return {
      form: {
        nama: '',
        keterangan: null,
        gambar: null
      }
    };
  },
  computed: {
    ...mapGetters(['isAuthenticated']),
  },
  methods: {
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.form.gambar = file;
      }
    },
    async submitForm() {
      try {
        const authStore = useAuthStore();
        if (this.isAuthenticated) {
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

          const response = await axios.post('http://localhost:3000/api/metode-bayar/tambah', this.form, config);
          alert('Metode Pembayaran berhasil ditambahkan!');
          this.$router.push('/admin/pemasukan');
        } else {
          alert('Anda harus login terlebih dahulu.');
          this.$router.push(`/masuk`);
          // console.error(authStore);
        }
      } catch (error) {
        console.error('Error adding produk:', error);
        if (error.response) {
          console.error('Server responded with:', error.response.data);
          alert(error.response.data.message || 'Internal server error');
        } else {
          alert('Gagal menambahkan produk. Silakan coba lagi.');
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
