<template>
  <div>
    <div class="main">
      <h2>Data Pelanggan</h2>
    </div>
    <div class="card-body">
      <div class="table-responsive">
        <table class="table align-items-center mb-0" id="dataTable" width="100%">
          <thead class="text-center text-uppercase font-weight-bolder">
            <tr>
              <th>No</th>
              <th>No Akun</th>
              <th>Nama</th>
              <th>Email</th>
              <th>Riwayat Pesanan</th>
              <th></th>
            </tr>
          </thead>
          <tbody class="text-center">
            <tr v-for="(row, index) in pelanggans" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ row.no_akun }}</td>
              <td>{{ row.nama }}</td>
              <td>{{ row.email }}</td>
              <td>{{ riwayatPesananCounts[row.id] || 0 }}</td>
              <td>
                <router-link :to="'/admin/pelanggan/' + row.id">
                  Detail
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

export default {
  data() {
    return {
      pelanggans: [],
      riwayatPesananCounts: {},
    };
  },
  async mounted() {
    await this.fetchProductDetails();
  },
  methods: {
    async fetchProductDetails() {
      try {
        const authStore = useAuthStore();
        const token = authStore.token || localStorage.getItem('token');
        if (!token) {
          throw new Error('Token tidak ditemukan');
        }

        const pelanggansResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users`);
        this.pelanggans = pelanggansResponse.data.filter(user => user.peran_id === 2);
        console.log('Data Pelanggan:', this.pelanggans);

        for (const user of this.pelanggans) {
          const userId = user.id;
          try {
            const pesananResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/riwayat-pesanan/${userId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              }
            });
            this.riwayatPesananCounts[userId] = pesananResponse.data.length; // Hitung jumlah pesanan
          } catch (error) {
            if (error.response && error.response.status === 404) {
              console.error(`Endpoint tidak ditemukan untuk user ${userId}`);
              this.riwayatPesananCounts[userId] = 0; // Set ke 0 jika data tidak ditemukan
            } else {
              console.error(`Error fetching pesanan for user ${userId}:`, error);
            }
          }
        }

        console.log('Jumlah Riwayat Pesanan:', this.riwayatPesananCounts);

      } catch (error) {
        console.error('Error fetching product details:', error);
      }
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
    .jenis{
        padding-left: 30px;
    }
    .table-responsive {
        overflow-x: auto;
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
</style>