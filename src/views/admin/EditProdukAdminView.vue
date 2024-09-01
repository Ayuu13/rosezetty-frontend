<template>
	<div class="main" v-if="products && products.length">
		<h2>Edit Produk - {{ products[0]?.nama }}</h2>
		<form @submit.prevent="submitForm">
			<div class="form-group">
				<label for="jenis_id">Jenis Produk</label>
				<select id="jenis_id" v-model="form.jenis_id" class="form-control" required>
					<option v-for="jenis in jenisProduk" :key="jenis.id" :value="jenis.id">
						{{ jenis.nama }}
					</option>
				</select>
			</div>
			<div class="form-group">
				<label for="barang_id">Status Barang</label>
				<select id="barang_id" v-model="form.barang_id" class="form-control" required>
					<option v-for="barang in barangStatus" :key="barang.id" :value="barang.id">
						{{ barang.nama }}
					</option>
				</select>
			</div>
			<div class="form-group">
				<label for="nama">Nama Produk</label>
				<input type="text" id="nama" v-model="form.nama" class="form-control" required />
			</div>
			<div class="form-group">
				<label for="detail">Detail Produk</label>
				<textarea id="detail" v-model="form.detail" class="form-control" required></textarea>
			</div>
			<div class="form-group">
				<label for="tutup_pesanan">Tutup Pesanan</label>
				<input type="datetime-local" id="tutup_pesanan" v-model="form.tutup_pesanan" class="form-control" required />
			</div>
			<button type="submit" class="btn btn-primary">Perbarui Produk</button>
		</form>
	</div>
	<div v-else>
		<p>Loading...</p>
	</div>
</template>

<script lang="ts">
import axios from '@/libs/axios';
import { defineComponent, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { mapGetters } from 'vuex';

interface Product {
	id: number;
	nama: string;
	jenis_id: number;
	barang_id: number;
	detail: string;
	tutup_pesanan: string;
}

interface JenisProduk {
	id: number;
	nama: string;
}

interface BarangStatus {
	id: number;
	nama: string;
}

export default defineComponent({
	name: 'EditProduk',
	data() {
		return {
			products: [] as Product[],
			form: {
				jenis_id: '',
				barang_id: '',
				nama: '',
				detail: '',
				tutup_pesanan: '',
			},
			jenisProduk: [] as JenisProduk[],
			barangStatus: [] as BarangStatus[],
		};
	},
	computed: {
		...mapGetters(['isAuthenticated']),
	},
	mounted() {
		this.fetchProductData();
		this.fetchJenisProduk();
		this.fetchBarangStatus();
	},
	methods: {
		async fetchProductData() {
			const productId = this.$route.params.id;
			try {
				const response = await axios.get(`api/produk/${productId}`);
				this.products = response.data;

				console.log(this.products);

				if (this.products.length > 0) {
					const tutupPesanan = this.products[0].tutup_pesanan ? this.products[0].tutup_pesanan.slice(0, 16) : '';

					this.form = {
						jenis_id: this.products[0].jenis_id,
						barang_id: this.products[0].barang_id,
						nama: this.products[0].nama,
						detail: this.products[0].detail,
						tutup_pesanan: tutupPesanan,
					};
				}
			} catch (error) {
				console.error('Error fetching product data:', error);
			}
		},
		async fetchJenisProduk() {
			try {
				const response = await axios.get('api/jenis-produk');
				this.jenisProduk = response.data;
			} catch (error) {
				console.error('Error fetching jenis produk data:', error);
			}
		},
		async fetchBarangStatus() {
			try {
				const response = await axios.get('api/status-barang');
				this.barangStatus = response.data;
			} catch (error) {
				console.error('Error fetching barang status data:', error);
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
							Authorization: `Bearer ${token}`,
						},
					};

					const productId = this.$route.params.id;
					await axios.put(`api/produk/edit/${productId}`, this.form, config);
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
		},
	},
});
</script>

<style scoped>
.main {
	margin: 20px;
}
h2 {
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
