<template>
  <div class="admin-dashboard">
    <header>
      <h1>Selamat Datang, Admin!</h1>
      <p>Segera kelola toko online Rosezzty.</p>
    </header>

    <section class="dashboard-stats">
      <div class="stat-card">
        <h3>Total Pesanan</h3>
        <p>{{ totalPenjualan }}</p>
      </div>
      <div class="stat-card">
        <h3>Jumlah Produk</h3>
        <p>{{ totalProduk }}</p>
      </div>
      <div class="stat-card">
        <h3>Jumlah Pelanggan</h3>
        <p>{{ totalPelanggan  }}</p>
      </div>
    </section>

    <section class="recent-orders">
      <h2>Pesanan</h2>
      <div class="chart-container">
        <BarChart :key="chartDataKey" :data="chartData" :options="chartOptions" />
      </div>
    </section>
  </div>
</template>

<script>
import axios from 'axios';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default {
  components: {
    BarChart: Bar
  },
  data() {
    return {
      totalPenjualan: 0,
      jumlahProduk: 0,
      pesananSelesai: 0,
      chartData: {
        labels: [],
        datasets: [{
          label: 'Jumlah Pesanan per Status',
          data: [],
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      chartDataKey: 0,
      chartOptions: {
        indexAxis: 'y',
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              stepSize: 2, // Mengatur langkah skala sumbu Y menjadi kelipatan 2
              callback: function(value) {
                return Number.isInteger(value) ? value : null;
              }
            }
          }
        }
      }
    };
  },
  mounted() {
    this.fetchDashboardData();
  },
  methods: {
    async fetchDashboardData() {
      try {
        const produkResponse = await axios.get('http://localhost:3000/api/varian-produk');
        this.produk = produkResponse.data;
        this.totalProduk = this.produk.length;

        const userResponse = await axios.get('http://localhost:3000/api/users');
        this.users = userResponse.data;
        this.totalUser = this.users.length;

        const pelanggan = this.users.filter(user => user.peran_id === 2);
        this.totalPelanggan = pelanggan.length;

        const penjualanResponse = await axios.get('http://localhost:3000/api/pesanan');
        this.pesanan = penjualanResponse.data;
        this.totalPenjualan = this.pesanan.length;

        const statusResponse = await axios.get('http://localhost:3000/api/status-pesanan');
        const statusList = statusResponse.data;

        const statusCounts = this.pesanan.reduce((acc, pesanan) => {
          const status = statusList.find(s => s.id === pesanan.status_id);
          const statusName = status ? status.nama : `Status ${pesanan.status_id}`;
          
          if (!acc[statusName]) {
            acc[statusName] = 0;
          }
          acc[statusName]++;
          return acc;
        }, {});
        this.chartData.labels = Object.keys(statusCounts);
        this.chartData.datasets[0].data = Object.values(statusCounts);

        // Set key baru untuk merender ulang chart
        this.chartDataKey++;

        // Perbarui diagram jika ada metode updateChart
        this.$nextTick(() => {
          if (this.$refs.chart && this.$refs.chart.updateChart) {
            this.$refs.chart.updateChart();
          }
        });

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    }
  }
};
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 500px;
}
.admin-dashboard {
  padding: 20px;
}
header {
  text-align: center;
  margin-bottom: 40px;
}

.dashboard-stats {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 40px;
}

.stat-card {
  background-color: #f0f0f0;
  padding: 20px;
  border-radius: 10px;
  width: 30%;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
