<template>
  <div class="testimoni">
    <h2>Berikan Testimoni</h2>
    <div class="card-body">
      <form @submit.prevent="submitTestimoni">
        <div class="input-group input-group-outline my-3">
            <h3>Nomor Order:</h3>
            <p class="form-control">{{ riwayat.no_pesanan }}</p>
        </div>
        <div class="input-group input-group-outline my-3">
          <label class="form-label"><h4>Upload Gambar (opsional)</h4></label>
          <input type="file" @change="handleFileUpload" class="form-control">
        </div>
        <div class="input-group input-group-outline mb-3">
          <label class="form-label"><h4>Keterangan:</h4></label>
          <textarea class="form-control" v-model="keterangan" rows="4" ></textarea>
        </div>
        <div class="button">
          <button type="submit" class="btn">Kirim</button>
        </div>
        <p class="error-message">{{ errorMessage }}</p>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

export default {
  data() {
    return {
      pesanan_id: null,
      keterangan: '',
      errorMessage: '',
      file: null,
      authStore: useAuthStore()
    };
  },
  created() {
    const riwayatData = localStorage.getItem('riwayat');
    if (riwayatData) {
      this.riwayat = JSON.parse(riwayatData);
    } else {
      this.errorMessage = 'Data riwayat tidak ditemukan';
    }
  },
  methods: {
    handleFileUpload(event) {
      this.file = event.target.files[0];
    },
    async submitTestimoni() {
      if (!this.riwayat || !this.riwayat.id) {
        this.errorMessage = 'Data riwayat tidak ditemukan';
        return;
      }
      const token = this.authStore.token || localStorage.getItem('token');
      if (!token) {
        this.errorMessage = 'Anda harus login terlebih dahulu.';
        return;
      }

      const formData = new FormData();
      formData.append('pesanan_id', this.riwayat.id);
      formData.append('keterangan', this.keterangan);
      if (this.file) {
        formData.append('gambar', this.file);
      }
      console.log('FormData:', formData);

      try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/testimoni/tambah`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log('Response:', response);
        localStorage.removeItem('riwayat');
        this.$router.push(`/testimoni`);
      } catch (error) {
        console.error('Error submitting testimoni:', error);
        this.errorMessage = 'Terjadi kesalahan saat mengirim testimoni: ' + error.message;
      }
    }
  }
};
</script>

<style scoped>
.testimoni {
  text-align: center;
  padding-top: 20px;
}
.card-body {
  margin: 20px;
  margin-top: -5px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
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
  border: 1px solid #ccc;
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
.error-message {
  color: red;
  padding-top: 10px;
}
</style>