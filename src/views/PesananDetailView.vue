<template>
	<div class="main">
		<h2>Detail - Pesanan</h2>
		<div v-if="pesananData.length">
			<div class="card">
				<h3>Nomor Order: {{ pesananData[0]?.pesanan?.no_pesanan }}</h3>
				<p>Tanggal Pesanan: {{ formatDate(pesananData[0]?.pesanan?.waktu_pesan) }}</p>
				<p>Status: {{ pesananData[0]?.pesanan?.status?.nama }}</p>
			</div>
			<h2>Item Pesanan</h2>
			<div class="order">
				<div v-for="item in pesananData" :key="item.id" class="items">
					<img :src="getItemImageUrl(item.produkVersi?.gambar)" :alt="item.gambar" />
					<div class="item-details">
						<p><strong>Nama Produk:</strong> {{ item.produkVersi?.produk?.nama }}</p>
						<p><strong>Varian:</strong> {{ item.produkVersi?.versi }}</p>
						<p><strong>Jumlah:</strong> {{ item.jumlah_barang }}</p>
						<p><strong>Sistem Bayar:</strong> {{ item.produkVersi?.sistembayar?.nama }}</p>
						<p><strong>Status Barang:</strong> {{ item.produkVersi?.produk?.barang?.nama }}</p>
					</div>
				</div>
			</div>
			<div class="item-bayar">
				<img :src="getItemImageUrl(pesananData[0]?.pesanan?.gambar)" :alt="pesananData[0]?.pesanan?.gambar" />
				<p><strong>Metode Pembayaran:</strong> {{ pesananData[0]?.pesanan?.metodebayar?.nama }}</p>
				<p><strong>Jumlah Transfer:</strong> {{ pesananData[0]?.pesanan?.jumlah_bayar }}</p>
				<p><strong>Waktu Bayar:</strong> {{ formatDate(pesananData[0]?.pesanan?.waktu_bayar) }}</p>
			</div>
		</div>
		<p v-else>{{ errorMessage }}</p>

		<div class="testi" v-if="pesananData[0]?.pesanan?.status_id === 5">
			<h3>Testimoni Pesanan Anda</h3>
			<div v-if="testimonis.length" v-for="testi in testimonis" :key="testi.id" class="variant">
				<div class="variant-details">
					<img :src="getItemImageUrl(testi.gambar)" :alt="'Gambar pesanan ' + testi.gambar" />
					<p>{{ testi.keterangan || 'Belum ada keterangan' }}</p>
					<p>Dibuat: {{ new Date(testi.dibuat).toLocaleDateString() }}</p>
				</div>
				<button class="btn" @click="editTestimoni(testi.id)">Edit Testimoni Anda</button>
			</div>

			<div v-if="!testimonis.length">
				<p>Anda belum melakukan testimoni.</p>
				<button class="btn" @click="testimoni(pesananData[0]?.pesanan)">Berikan Testimoni</button>
			</div>
		</div>
	</div>
</template>

<script>
import axios from '@/libs/axios';
import { IMAGE_URL } from '@/libs/constant';
import { useAuthStore } from '@/stores/auth';
import { mapGetters } from 'vuex';

export default {
	data() {
		return {
			pesananData: [],
			authStore: useAuthStore(),
			testimonis: [],
			errorMessage: null,
		};
	},
	computed: {
		...mapGetters(['isAuthenticated']),
	},
	async mounted() {
		const token = this.authStore.token || localStorage.getItem('token');
		if (token && this.isAuthenticated) {
			await this.fetchPesanan(token);
			await this.fetchTestimoni();
		}
	},
	methods: {
		async fetchPesanan(token) {
			try {
				const pesananId = this.$route.params.id;
				const pesananResponse = await axios.get(`api/pesanan-detail/${pesananId}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				this.pesananData = pesananResponse.data;
				console.log('Data Pesanan:', this.pesananData);
			} catch (error) {
				if (error.response && error.response.status === 404) {
					this.errorMessage = 'Anda belum melakukan pemesanan';
				} else {
					console.error('Error fetching pesanan:', error);
					this.errorMessage = 'Terjadi kesalahan saat mengambil data pesanan: ' + error.message;
				}
			}
		},
		async fetchTestimoni() {
			const pesanId = this.$route.params.id;
			try {
				const testiResponse = await axios.get(`api/testimoni-pesan/${pesanId}`);
				this.testimonis = testiResponse.data;
				console.log('Data Testimoni:', this.testimonis);
			} catch (error) {
				console.error('Error fetching testimoni:', error);
			}
		},
		getItemImageUrl(imageFileName) {
			return `${IMAGE_URL}${imageFileName}`;
		},
		formatDate(dateString) {
			if (!dateString) return 'Tidak tersedia';
			const options = { year: 'numeric', month: 'long', day: 'numeric' };
			return new Date(dateString).toLocaleDateString(undefined, options);
		},
		testimoni(riwayat) {
			localStorage.setItem('riwayat', JSON.stringify(riwayat));
			this.$router.push('/testimoni/tambah');
		},
		editTestimoni(testimoniId) {
			this.$router.push(`/testimoni-edit/${testimoniId}`);
		},
	},
};
</script>

<style scoped>
.main {
	margin: 20px;
	text-align: center;
}

.main h2 {
	padding-bottom: 10px;
}
.card {
	padding: 15px;
	border: 2px solid #ddd;
	border-radius: 5px;
	margin-bottom: 20px;
}

.order {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	margin-top: -15px;
}
.items {
	margin: 10px;
	width: 250px;
	padding: 10px;
	border: 1px solid #ccc;
	border-radius: 8px;
	display: flex;
	flex-direction: column;
	align-items: center;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.items img {
	width: 50%;
	height: auto;
	border-radius: 8px;
	margin-right: 20px;
}
.item-details p {
	margin: 5px 0;
}

.item-bayar {
	display: inline;
	flex-wrap: nowrap;
	justify-content: left;
}
.item-bayar img {
	margin-top: 15px;
	width: 30%;
	height: auto;
}

.testi {
	margin-top: 20px;
}
.btn {
	width: 50%;
	padding: 5px;
	border-radius: 5px;
	background-color: #007bff;
	color: white;
	cursor: pointer;
}

.variant-details img {
	width: 30%;
	height: auto;
}

/* .detail-variants{
  margin: 20px;
} */
/* .variant {
  margin: 10px;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
} */
/* .variant-details {
  text-align: center;
} */
</style>
