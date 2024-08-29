<template>
  <div class="main">
    <h2>Kelola Data Pesanan</h2>
    <input 
        type="text" 
        v-model="searchQuery" 
        placeholder="Cari No Pesanan..." 
        class="search" />
  </div>
  <div class="jenis" v-for="status in statuses" :key="status.id">
    <h4>Data Pesanan - Status {{ status.nama }}</h4>
    <div class="table-responsive">
      <table id="dataTable" width="100%">
        <thead class="table1 text-uppercase">
          <tr>
            <th>No</th>
            <th>No Pesanan</th>
            <th>Harga Total</th>
            <th>Tanggal Pesan</th>
            <th></th>
          </tr>
        </thead>
        <tbody class="table2 text-center">
          <tr v-for="(pesanan, index) in filteredPesananByStatus(status.id)" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ pesanan.no_pesanan }}</td>
            <td>{{ pesanan.harga_total }}</td>
            <td>{{ pesanan.waktu_pesan }}</td>
            <td>
              <router-link :to="'/admin/pesanan/' + pesanan.id">
                Detail
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      pesananData: [],
      statuses: [],
      searchQuery: ''
    };
  },
  async mounted() {
    await this.fetchPesananDetails();
  },
  methods: {
    async fetchPesananDetails() {
      try {
        const statusResponse = await axios.get('http://localhost:3000/api/status-pesanan');
        this.statuses = statusResponse.data;
        console.log('Data statuses:', this.statuses);

        const pesananResponse = await axios.get('http://localhost:3000/api/pesanan');
        this.pesananData = pesananResponse.data;
        console.log('Data Pesanan:', this.pesananData);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    filteredPesananByStatus(statusId) {
      // Filter berdasarkan status dan query pencarian
      return this.pesananData
        .filter(pesanan => pesanan.status_id === statusId)
        .filter(pesanan => 
          pesanan.no_pesanan.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
    }
  }
};
</script>

<style scoped>
.main {
  padding-top: 25px;
  text-align: center;
}
.search{
    text-align: center;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.jenis {
  margin: 15px;
  padding-top: 10px;
}
.table-responsive {
  overflow-x: auto;
}

.table1 {
  background-color: #f5f5f5;
  color: #343a40;
}
.table1 th {
  padding: 10px;
}

.table2 {
  border-collapse: separate;
  border-spacing: 0 50px;
}
.table2 td {
  padding: 10px;
  border-bottom: 2px solid #ececec;
}
</style>