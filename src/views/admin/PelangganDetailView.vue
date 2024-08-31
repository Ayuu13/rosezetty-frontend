<template>
  <div class="products" v-if="user">
    <h1>Detail Akun Pelanggan</h1>
    <div class="prod">
      <h3>No Akun: {{ user.no_akun }}</h3>
      <h4>Nama: {{ user.nama }}</h4>
      <p>Email: {{ user.email }}</p>
      <p>Nomor Whatsapp: <a :href="'https://wa.me/' + user.nowa">{{ user.nowa }}</a></p>
    </div>

    <div class="product-variants">
      <div v-for="pesanan in pesanans" :key="pesanan.id" class="variant">
        <div class="variant-details">
          <p>No Pesanan: {{ pesanan.no_pesanan }}</p>
          <span>Status Pesanan: {{ pesanan.status?.nama }}</span>
          <span class="variant-name">Total Barang: {{ pesanan.total_barang }}</span>
          <span class="price">Harga Total: Rp {{ pesanan.harga_total }}</span>

          <div v-for="detail in pesanan.details" :key="detail.versiproduk_id" class="detail">
            <p>Nama Produk: {{ detail.produk?.nama }}</p>
            <p>Versi Produk: {{ detail.versi }}</p>
            <p>Harga: Rp {{ detail.harga }}</p>
            <p>Jumlah Barang: Rp {{ detail.jumlah_barang }}</p>
            <p>Sistem Bayar: {{ detail.sistembayar?.nama }}</p>
          </div>
          <span class="price">Jumlah Bayar: Rp {{ pesanan.jumlah_bayar }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      user: null,
      pesanans: [],
      authStore: useAuthStore(),
      errorMessage: null
    };
  },
  computed: {
    ...mapGetters(['isAuthenticated', 'userId'])
  },
  async mounted() {
    const token = this.authStore.token || localStorage.getItem('token');
    console.log('Token:', token);
    if (token && this.isAuthenticated) {
      await this.fetchUserDetails(token);
    }
  },
  methods: {
    async fetchUserDetails(token) {
      const userId = this.$route.params.id;
      try {
        const userResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        this.user = userResponse.data;
        console.log('User Response:', userResponse);

        // Ambil data pesanan pengguna
        const pesananResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/riwayat-pesanan/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        this.pesanans = pesananResponse.data;
        console.log('Pesanan Response:', pesananResponse);

        if (!this.pesanans.length) {
          this.errorMessage = 'Anda belum melakukan pemesanan';
        }

        // Ambil detail varian produk untuk setiap pesanan detail
        for (let pesanan of this.pesanans) {
          pesanan.details = []; // Initialize details array for each pesanan
          for (let detail of pesanan.pesanandetail) {
            if (detail.versiproduk_id) {
              const versiproResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/varian-detail/${detail.versiproduk_id}`);
              const versiData = versiproResponse.data;
              console.log('Versi Data:', versiData);

              // Ambil elemen pertama dari array versiData
              const versiItem = Array.isArray(versiData) ? versiData[0] : versiData;

              detail.produk = versiItem.produk || {};
              detail.versi = versiItem.versi || 'Tidak tersedia';
              detail.harga = versiItem.harga || 'Tidak tersedia';
              detail.sistembayar = versiItem.sistembayar || {};
              pesanan.details.push(detail);
            }
          }
        }
        console.log('Updated Pesanans:', this.pesanans);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    }
  },
  formatDate(dateString) {
    if (!dateString) return 'Tidak tersedia';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }
};
</script>

<style scoped>
.products {
  text-align: center;
  padding: 20px;
}
.prod {
  padding-top: 20px;
}
.product-variants {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 20px;
}

.variant {
  width: 350px;
  margin: 10px;
  padding: 10px;
  border: 3px solid #ccc;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.variant img {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

.variant-details {
  margin-top: 10px;
  text-align: center;
}

.variant-name {
  display: block;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
}

.price {
  display: block;
  font-size: 16px;
  color: green;
  margin-bottom: 10px;
}

.detail {
  width: 300px;
  margin: 10px;
  padding: 10px;
  border: 2px solid #ffe2e2;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

button {
  padding: 5px 10px;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  border: none;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #0056b3;
}

.keranjang{
  padding-top: 5px;
}
</style>