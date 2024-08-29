<template>
  <div class="main">
    <h2>Edit Varian Produk - {{ form.produk ? form.produk.nama : 'Memuat...' }}</h2>
    <form @submit.prevent="submitForm" v-if="form.produk">
      <div class="form-group">
        <label for="produk_id">Produk</label>
        <input type="text" id="produk_id" v-model="form.produk.nama" class="form-control" readonly />
      </div>
      <div class="form-group">
        <label for="versi">Varian Produk</label>
        <input type="text" id="versi" v-model="form.versi" class="form-control" required />
      </div> 
      <div class="form-group">
        <label for="harga">Harga</label>
        <input type="number" id="harga" v-model="form.harga" class="form-control" required />
      </div>
      <div class="form-group">
        <label for="gambar">Gambar</label>
        <input type="file" id="gambar" @change="handleFileUpload" class="form-control" />
      </div>
      <div class="form-group">
        <label for="sistembayar_id">Sistem Bayar</label>
        <select id="sistembayar_id" v-model="form.sistembayar_id" class="form-control" required>
          <option v-for="sistem in sistemBayar" :key="sistem.id" :value="sistem.id">{{ sistem.nama }}</option>
        </select>
      </div>
      <button type="submit" class="btn btn-primary">Perbarui Produk</button>
    </form>
    <div v-else class="alert alert-info">Memuat...</div>
    <div v-if="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>
  </div>
</template>

<script lang="ts">
import axios from 'axios';
import { defineComponent, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { mapGetters } from 'vuex';

interface Product {
  id: number;
  nama: string;
  detail: string;
}

interface VarianProduk {
  id: number;
  produk_id: number;
  versi: string;
  harga: number;
  gambar: string;
  sistembayar_id: number;
  produk: Product;
  sistembayar: { nama: string };
}

interface SistemBayar {
  id: number;
  nama: string;
}

export default defineComponent({
  name: 'EditVarianProduk',
  data() {
    return {
      form: {
        produk: null as Product | null,
        versi: '',
        harga: 0,
        sistembayar_id: 0,
        gambar: null as File | null
      },
      sistemBayar: [] as SistemBayar[],
      errorMessage: ''
    };
  },
  computed: {
    ...mapGetters(['isAuthenticated']),
  },
  mounted() {
    this.fetchVarianProduk();
    this.fetchSistemBayarList();
  },
  methods: {
    async fetchVarianProduk() {
      const varianId = this.$route.params.id;
      try {
        const response = await axios.get(`http://localhost:3000/api/varian-detail/${varianId}`);
        const varianProduk: VarianProduk = response.data[0]; // Assuming the first item in array

        if (varianProduk) {
          console.log('produk_id ditemukan:', varianProduk.produk_id); // Log produk_id
          console.log('produk data:', varianProduk.produk); // Log produk data

          this.form = {
            produk: varianProduk.produk,
            versi: varianProduk.versi,
            harga: varianProduk.harga,
            sistembayar_id: varianProduk.sistembayar_id,
            gambar: null
          };
        } else {
          throw new Error('produk_id tidak ditemukan pada varianProduk');
        }
      } catch (error) {
        console.error('Error fetching varian produk:', error);
        this.errorMessage = 'Gagal mengambil data varian produk. Silakan coba lagi.';
      }
    },
    async fetchSistemBayarList() {
      try {
        const response = await axios.get('http://localhost:3000/api/sistem-bayar');
        this.sistemBayar = response.data;
      } catch (error) {
        console.error('Error fetching sistem bayar:', error);
      }
    },
    handleFileUpload(event: Event) {
      const file = (event.target as HTMLInputElement).files?.[0];
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

          const productId = this.$route.params.id; 
          const response = await axios.put(`http://localhost:3000/api/varian-produk/edit/${productId}`, this.form, config);
          alert('Produk berhasil diperbarui!');
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