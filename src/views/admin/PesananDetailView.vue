<template>
	<div class="main text-center">
		<h2>Kelola Data Pesanan - Pelanggan</h2>
	</div>
	<div v-if="pesanan.length" class="pesan">
		<div class="pesan-info">
			<p>No Akun Pelanggan: {{ pesanan[0]?.pengguna?.no_akun }}</p>
			<p>No Pesanan: {{ pesanan[0]?.no_pesanan }}</p>
			<p>Harga Total: {{ formatCurrency(pesanan[0]?.harga_total) }}</p>
			<p><strong>Status:</strong> {{ pesanan[0]?.status?.nama }}</p>
			<div class="form-group">
				<label for="status_id">Ubah Status Pesanan: </label>
				<select id="status_id" class="form-control" v-model="selectedStatus" @change="updateStatus">
					<option v-for="status in statuses" :key="status.id" :value="status.id">{{ status.nama }}</option>
				</select>
			</div>
		</div>
		<div class="pesan-info">
			<p>Metode Bayar: {{ pesanan[0]?.metodebayar?.nama || 'Tidak tersedia' }}</p>
			<p>Jumlah Bayar: {{ formatCurrency(pesanan[0]?.jumlah_bayar) }}</p>
			<p>Waktu Bayar: {{ pesanan[0]?.waktu_bayar || 'Tidak tersedia' }}</p>
			<img :src="getVariantImageUrl(pesanan[0]?.gambar)" :alt="'Gambar pesanan ' + pesanan[0]?.no_pesanan" />
		</div>

		<div class="detail-variants">
			<h4>Pesanan Detail</h4>
			<div v-for="detail in details" :key="detail.id" class="variant">
				<div class="variant-details">
					<p>{{ detail.produkVersi?.produk?.nama }}</p>
					<p>Versi: {{ detail.produkVersi?.versi }}</p>
					<p>Sistem Bayar: {{ detail.produkVersi?.sistembayar?.nama }}</p>
					<p>Harga Barang: {{ formatCurrency(detail.produkVersi?.harga) }}</p>
					<p>Barang: {{ detail.produkVersi?.produk?.barang?.nama }}</p>
					<p>Jumlah Barang: {{ detail.jumlah_barang || 0 }}</p>
				</div>
			</div>
		</div>

		<div v-if="pesanan[0]?.status_id === 5" class="detail-variants">
			<h4>Testimoni Pesanan</h4>
			<div v-for="testi in testimonis" :key="testi.id" class="variant">
				<div class="variant-details">
					<img :src="getVariantImageUrl(testi.gambar)" :alt="'Gambar pesanan ' + testi.gambar" />
					<p>{{ testi.keterangan || 'Belum ada keterangan' }}</p>
					<p>Dibuat: {{ new Date(testi.dibuat).toLocaleDateString() }}</p>
				</div>
			</div>
			<p v-if="!testimonis.length">Belum melakukan testimoni.</p>
		</div>
	</div>
	<div v-else>
		<p>Anda harus melakukan login terlebih dahulu.</p>
	</div>
</template>

<script>
import axios from '@/libs/axios';
import { IMAGE_URL } from '@/libs/constant';
import { useAuthStore } from '@/stores/auth';
import { mapGetters } from 'vuex';

export default {
	name: 'ProdukDetailView',
	data() {
		return {
			pesanan: [],
			details: [],
			statuses: [],
			selectedStatus: null,
			testimonis: [],
			authStore: useAuthStore(),
		};
	},
	computed: {
		...mapGetters(['isAuthenticated']),
	},
	async mounted() {
		const token = this.authStore.token || localStorage.getItem('token');
		if (token && this.isAuthenticated) {
			await this.fetchProductDetails(token);
			await this.fetchStatusList();
			await this.fetchTestimoni();
		}
	},
	methods: {
		async fetchProductDetails(token) {
			const pesanId = this.$route.params.id;
			try {
				const pesananResponse = await axios.get(`api/pesanan/${pesanId}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				this.pesanan = pesananResponse.data;
				this.selectedStatus = this.pesanan[0]?.status?.id;

				const pesananDetailResponse = await axios.get(`api/pesanan-detail/${pesanId}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				this.details = pesananDetailResponse.data;
			} catch (error) {
				console.error('Error fetching product details:', error);
			}
		},
		async fetchStatusList() {
			try {
				const statusResponse = await axios.get('api/status-pesanan');
				this.statuses = statusResponse.data;
			} catch (error) {
				console.error('Error fetching status list:', error);
			}
		},
		async updateStatus() {
			const token = this.authStore.token || localStorage.getItem('token');
			if (this.selectedStatus) {
				try {
					const pesanId = this.$route.params.id;
					await axios.put(
						`api/pesanan/edit/${pesanId}`,
						{ status_id: this.selectedStatus },
						{
							headers: {
								Authorization: `Bearer ${token}`,
							},
						}
					);
					alert('Status berhasil diperbarui!');
					this.$router.push('/admin/pesanan');
				} catch (error) {
					console.error('Error updating status:', error);
				}
			}
		},
		async fetchTestimoni() {
			const pesanId = this.$route.params.id;
			try {
				const testiResponse = await axios.get(`api/testimoni/${pesanId}`);
				this.testimonis = testiResponse.data;
				console.log('Data Testimoni:', this.testimonis);
			} catch (error) {
				if (error.response && error.response.status === 404) {
					console.warn(`Total pesanan untuk produk ID ${pesanId} tidak ditemukan.`);
				} else {
					console.error('Error fetching total orders:', error);
				}
			}
		},
		formatCurrency(amount) {
			if (amount) {
				return amount.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
			}
			return 'Rp. 0';
		},
		getVariantImageUrl(imageFileName) {
			return imageFileName ? `${IMAGE_URL}${imageFileName}` : '';
		},
	},
};
</script>

<style scoped>
.main {
	margin: 20px;
}
.pesan-info {
	margin: 20px;
	border: 1px solid #ccc;
	padding: 10px;
	border-radius: 5px;
}
.pesan img {
	max-width: 30%;
	height: auto;
}
.form-group {
	margin-bottom: 5px;
}
.form-control {
	box-sizing: border-box;
	border: 1px solid #ccc;
	border-radius: 5px;
}

.detail-variants {
	margin: 20px;
}
.variant {
	margin: 10px;
	border: 1px solid #ccc;
	padding: 10px;
	border-radius: 5px;
}
.variant-details {
	text-align: center;
}
.price {
	display: block;
	font-size: 16px;
	color: green;
	margin-bottom: 10px;
}
</style>
