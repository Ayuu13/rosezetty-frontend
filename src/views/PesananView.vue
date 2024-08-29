<template>
  <div class="main">
    <h2>Riwayat Pesanan</h2>
    </div>
    <div v-if="isAuthenticated" class="card">
      <div class="table-responsive" v-if="pesananList.length > 0">
        <table class="table align-items-center mb-0">
          <thead class="text-center text-uppercase text-xxs font-weight-bolder opacity-7">
            <tr>
              <th>No Pesanan</th>
              <th>Waktu Pesan</th>
              <th>Jumlah Barang</th>
              <th>Total Harga</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(pesanan, index) in pesananList" :key="index">
              <td>
                <div class="d-flex px-2 py-1">
                  <div class="d-flex flex-column justify-content-center">
                    <p class="nopesan">{{ pesanan.no_pesanan }}</p>
                  </div>
                </div>
              </td>
              <td>
                <p>{{ formatDate(pesanan.waktu_pesan) }}</p>
              </td>
              <td>
                <p>{{ pesanan.total_barang }}</p>
              </td>
              <td>
                <p>{{ pesanan.harga_total }}</p>
              </td>
              <td class="align-middle text-center">
                <span :class="badgeClass(pesanan.status ? pesanan.status.nama : '')">{{ pesanan.status ? pesanan.status.nama : 'N/A' }}</span>
              </td>
              <td class="align-middle text-center">
                <span :class="badgeClass(pesanan.barang ? pesanan.barang.nama : '')">{{ pesanan.barang ? pesanan.barang.nama : 'N/A' }}</span>
              </td>
              <td>
                <router-link :to="'/pesanan-detail/' + pesanan.id">
                    Detail
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-else>{{ errorMessage }}</p>
    </div>
    <div v-else>
      <p>Silakan login terlebih dahulu untuk melihat riwayat pesanan Anda.</p>
    </div>
</template>

<script>
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      pesananList: [],
      authStore: useAuthStore(),
      errorMessage: null
    };
  },
  computed: {
    ...mapGetters(['isAuthenticated', 'userId'])
  },
  async mounted() {
    const token = this.authStore.token || localStorage.getItem('token');
    if (token && this.isAuthenticated) {
      await this.fetchPesanan(token);
      if (this.pesananList.length > 0) {
        await this.fetchAdditionalDetails();
      }
    }
  },
  methods: {
    async fetchPesanan(token) {
      try {
        const userId = this.userId;
        const response = await axios.get(`http://localhost:3000/api/riwayat-pesanan/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        this.pesananList = response.data;
        console.log(response.data);
        if (!this.pesananList.length) {
          this.errorMessage = 'Anda belum melakukan pemesanan';
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          this.errorMessage = 'Anda belum melakukan pemesanan';
        } else {
          console.error('Error fetching pesanan:', error);
          this.errorMessage = 'Terjadi kesalahan saat mengambil data pesanan: ' + error.message;
        }
      }
    },
    async fetchAdditionalDetails() {
      try {
        if (this.pesananList.length === 0) return;

        const statusIds = this.pesananList.map(pesanan => pesanan.status_id);
        const versiProdukIds = this.pesananList.map(pesanan => pesanan.versiproduk_id);
        const barangIds = this.pesananList.map(pesanan => pesanan.barang_id);

        const [statusResponses, versiProdukResponses, barangResponses] = await Promise.all([
          axios.get('http://localhost:3000/api/status-pesanan', { params: { ids: statusIds } }),
          axios.get('http://localhost:3000/api/varian-produk', { params: { ids: versiProdukIds } }),
          axios.get('http://localhost:3000/api/status-barang', { params: { ids: barangIds } })
        ]);

        this.pesananList.forEach(pesanan => {
          pesanan.status = statusResponses.data.find(status => status.id === pesanan.status_id) || {};
          pesanan.variant = versiProdukResponses.data.find(variant => variant.id === pesanan.versiproduk_id) || {};
          pesanan.barang = barangResponses.data.find(barang => barang.id === pesanan.barang_id) || {};
        });

      } catch (error) {
        console.error('Error fetching additional details:', error);
      }
    },
    badgeClass(barang) {
      return {
        'badge-success': barang === 'ordered',
        'badge-secondary': barang === 'otw indo'
      };
    },
    formatDate(dateString) {
      if (!dateString) return 'Tidak tersedia';
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    }
  }
};
</script>


<style scoped>

.main{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60px;
}
.avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
}
.table-responsive {
    overflow-x: auto;
}
.table {
    width: 100%;
    max-width: 100%;
    margin-bottom: 1rem;
    background-color: transparent;
}
.table th, .table td {
    padding: 0.75rem;
    vertical-align: top;
    border-top: 1px solid #dee2e6;
}  
.table thead th {
    vertical-align: bottom;
    border-bottom: 2px solid #dee2e6;
}
.badge-success {
    color: #fff!important;
    background-color: #1cc88a!important;
}
.badge-secondary {
    color: #fff!important;
    background-color: #858796!important;
}
.text-color{
    color: #939393;
    font-size: medium;
}
p {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.nopesan {
  color: rgb(42, 184, 255);
}
</style>  