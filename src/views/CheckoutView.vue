<template>
  <div class="main">
    <h2 class="konfirm">Konfirmasi Pesanan Anda</h2>
    <form @submit.prevent="checkout">
      <div>
        <div class="checkout">
          <div v-for="(item, index) in checkedCartItems" :key="index" class="row gy-3 mb-4">
            <div class="col-lg-5">
              <div class="me-lg-5">
                <div class="card-body1">
                  <h4>{{ item[0]?.nama }}</h4>
                  <select v-model="item.jumlah" class="opsi-jumlah form-select me-4" style="width: 50px;">
                    <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
                  </select>
                </div>
                <div class="card-body1">
                  Versi: {{ item.variant.versi }}
                  <div>
                    <small class="text-muted text-nowrap">{{ item.variant.harga.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }) }} / per item</small>
                  </div>
                </div>
                <div class="card-body1">
                  Sistem Bayar: {{ item.variant.sistembayar.nama }}
                  <p class="h6">{{ (item.variant.harga * item.jumlah).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-3">
        <div class="card-border">
          <div>
            <div class="card-body2">
              <p class="mb-2">Jumlah Barang:</p>
              <p class="mb-2">{{ totalQuantity }}</p>
            </div>
            <hr />
            <div class="card-body2">
              <h4 class="mb-2">Harga Total:</h4>
              <h4 class="mb-2 fw-bold">{{ totalPrice.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }) }}</h4>
            </div>
          </div>
        </div>
      </div>
      <div class="pembayaran">
        <div class="bayar1">
          <h2>Konfirmasi Pembayaran</h2>
          <p>
            Top up Bank ke DANA + 500<br>Bank ke Spay + 1000<br>
            <strong>‼️Payment ke QRIS khusus nominal di bawah 300k.
              Mohon memilih metode pembayaran lain untuk nominal di atas 300k‼️</strong><br>
          </p>
        </div>
        <div class="bayar2">
          <div class="input-group input-group-outline my-3">
            <label for="metodebayar" class="form-label">Metode Pembayaran:</label>
            <select id="metodebayar" v-model="selectedPaymentMethod" class="form-control">
              <option v-for="metode in metodes" :key="metode.id" :value="metode.id">{{ metode.nama }}</option>
            </select>
          </div>
          <div v-if="selectedPaymentMethod">
            <div v-if="selectedPaymentMethodObject">
              <p>{{ selectedPaymentMethodObject.keterangan }}</p>
              <img v-if="selectedPaymentMethodObject.gambar" :src="getVariantImageUrl(selectedPaymentMethodObject.gambar)" :alt="'Gambar ' + selectedPaymentMethodObject.nama" />
            </div>
          </div>

          <div class="input-group input-group-outline my-3">
            <label for="buktiPembayaran" class="form-label">Bukti Pembayaran:</label>
            <input type="file" id="buktiPembayaran" class="form-control" @change="handleFileUpload">
          </div>
          <div class="input-group input-group-outline my-3">
            <label for="jumlahBayar" class="form-label">Nominal Transfer:</label>
            <input type="number" id="jumlahBayar" class="form-control" v-model="nominalTransfer">
          </div>
          <div class="input-group input-group-outline my-3">
            <label for="waktuBayar" class="form-label">Waktu Pembayaran:</label>
            <input type="datetime-local" id="waktuBayar" class="form-control" v-model="waktuPembayaran">
          </div>
        </div>
      </div>
      <div class="card-body2">
        <button type="submit" class="btn btn-success w-100 shadow-0 mb-2">Submit Pesanan</button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart';

export default {
  name: 'CheckoutView',
  setup() { 
    const cartStore = useCartStore();
    const router = useRouter();
    const checkedCartItems = computed(() =>
      cartStore.cart.filter((item, index) => cartStore.checkedRows[index]),
    );

    const totalQuantity = computed(() =>
      checkedCartItems.value.reduce((total, item) => total + item.jumlah, 0)
    );

    const totalPrice = computed(() =>
      checkedCartItems.value.reduce((total, item) => total + item.variant.harga * item.jumlah, 0)
    );

    const selectedPaymentMethod = ref(null);
    const nominalTransfer = ref('');
    const waktuPembayaran = ref('');
    const file = ref(null);
    const metodes = ref([]);

    const handleFileUpload = (event) => {
      file.value = event.target.files[0];
    };

    const fetchMetodes = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/metode-bayar');
        metodes.value = response.data;
      } catch (error) {
        console.error('Error fetching metodes:', error);
      }
    };
    fetchMetodes();

    // Computed property to get the selected payment method object
    const selectedPaymentMethodObject = computed(() => {
      return metodes.value.find(method => method.id === selectedPaymentMethod.value);
    });

    const getVariantImageUrl = (imageFileName) => {
      return `http://localhost:3000/upload/${imageFileName}`;
    };

    const checkout = async () => {
      try {
        const versiprodukIds = checkedCartItems.value.map(item => item.variant.id);
        const jumlahBarang = checkedCartItems.value.map(item => item.jumlah);

        const formData = new FormData();
        formData.append('gambar', file.value); // Menyertakan file gambar
        formData.append('versiproduk_ids', JSON.stringify(versiprodukIds)); // Mengirim array sebagai string JSON
        formData.append('jumlah_barang', JSON.stringify(jumlahBarang));
        formData.append('metode_id', selectedPaymentMethod.value);
        formData.append('jumlah_bayar', nominalTransfer.value);
        formData.append('waktu_bayar', waktuPembayaran.value);

        for (let pair of formData.entries()) {
          console.log(`${pair[0]}: ${pair[1]}`);
        }

        const token = localStorage.getItem('token'); // Ambil token dari local storage
        const response = await axios.post('http://localhost:3000/api/pesanan/tambah', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}` // Sertakan token dalam header
          }
        });

        if (response.status === 201) {
          alert('Pesanan berhasil!');
          router.push({ path: '/riwayat-pesanan' });
        } else {
          const errorMessage = response.data.message || 'Terjadi kesalahan saat melakukan pesanan.';
          alert('Pesanan gagal: ' + errorMessage);
        }
      } catch (error) {
        console.error('Error Pesanan:', error.response ? error.response.data : error.message);
        const errorMessage = error.response ? error.response.data.message : error.message;
        alert('Terjadi kesalahan saat melakukan pesanan: ' + errorMessage);
      }
    };

    return {
      checkedCartItems,
      totalQuantity,
      totalPrice,
      selectedPaymentMethod,
      selectedPaymentMethodObject, // Return the computed property
      nominalTransfer,
      waktuPembayaran,
      handleFileUpload,
      checkout,
      metodes,
      getVariantImageUrl
    };
  },
};

</script>

<style scoped>
.main {
  text-align: center;
  padding: 20px;
}
.konfirm{
  padding-bottom: 10px;
}
.checkout {
  width: 100%;
  padding-top: 20px;
  padding-left: 15px;
  padding-right: 15px;
  padding-bottom: 5px;
  border-radius: 5px;
  background-color: rgb(255, 225, 230);
}
.card-body1 {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.card-body2 {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 20px;
  padding-left: 20px;
  padding-right: 20px;
}
.opsi-jumlah, .form-select{
  justify-content: center;
  text-align: center;
  border-radius: 5px;
  background-color: rgb(255, 255, 255);
}
.btn {
  width: 100%;
  padding: 5px;
  border-radius: 3px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}
.pembayaran {
    padding-top: 10px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}
.bayar1 {
    margin: 10px;
    padding-left: 15px;
    padding-right: 15px;
    border-radius: 5px;
    background-color: rgb(255, 182, 182);
}
.bayar2 {
    width: 350px;
    margin: 10px;
    padding-left: 15px;
    padding-right: 15px;
    border-radius: 5px;
    background-color: rgb(255, 225, 230);
}
.bayar2 img{
  width: 50%;
  height: auto;
  border-radius: 8px;
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
    background-color: #ffffff;
    border-radius: 5px;
    width: 100%;
    padding: 10px;
}
</style>