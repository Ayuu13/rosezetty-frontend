<template>
  <div class="main">
    <h2>Tambah Produk Baru</h2>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="jenis_id">Jenis Produk</label>
        <select id="jenis_id" v-model="form.jenis_id" class="form-control" required>
          <option v-for="jenis in jenisProduk" :key="jenis.id" :value="jenis.id">{{ jenis.nama }}</option>
        </select>
      </div>
      <div class="form-group">
        <label for="nama">Nama Produk</label>
        <input type="text" id="nama" v-model="form.nama" class="form-control" required />
      </div>
      <div class="form-group">
        <label for="detail">Detail Produk</label>
        <textarea id="detail" v-model="form.detail" class="form-control" required></textarea>
      </div>
      <div class="form-group">
        <label for="tutup_pesanan">Tutup Pesanan</label>
        <input type="datetime-local" id="tutup_pesanan" v-model="form.tutup_pesanan" class="form-control" required />
      </div>
      <button type="submit" class="btn btn-primary">Tambah Produk</button>
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
        jenis_id: '',
        nama: '',
        detail: '',
        tutup_pesanan: ''
      },
      jenisProduk: []
    };
  },
  computed: {
    ...mapGetters(['isAuthenticated']),
  },
  async mounted(){
      this.fetchJenisProduk();
  },
  methods: {
    async fetchJenisProduk() {
      try {
        const response = await axios.get('http://localhost:3000/api/jenis-produk');
        this.jenisProduk = response.data;
      } catch (error) {
        console.error('Error fetching jenis produk:', error);
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

          const response = await axios.post('http://localhost:3000/api/produk/tambah', this.form, config);
          alert('Produk berhasil ditambahkan!');
          this.$router.push('/admin/produk');
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
