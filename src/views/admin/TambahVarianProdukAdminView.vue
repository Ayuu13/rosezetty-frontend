<template>
	<div class="main">
		<h2>Tambah Varian Produk Baru</h2>
		<form @submit.prevent="submitForm">
			<div class="form-group">
				<label for="produk_id">Nama Produk</label>
				<input type="text" id="produk_id" v-model="produk" class="form-control" readonly />
			</div>
			<div class="form-group">
				<label for="versi">Versi</label>
				<input type="text" id="versi" v-model="form.versi" class="form-control" required />
			</div>
			<div class="form-group">
				<label for="harga">Harga</label>
				<input type="number" id="harga" v-model="form.harga" class="form-control" required />
			</div>
			<div class="form-group">
				<label for="sistembayar_id">Sistem Bayar</label>
				<select id="sistembayar_id" v-model="form.sistembayar_id" class="form-control" required>
					<option v-for="sistembayar in sistemBayarList" :key="sistembayar.id" :value="sistembayar.id">
						{{ sistembayar.nama }}
					</option>
				</select>
			</div>
			<div class="form-group">
				<label for="gambar">Gambar</label>
				<input type="file" id="gambar" @change="handleFileUpload" class="form-control" />
			</div>
			<button type="submit" class="btn btn-primary">Tambah Varian Produk</button>
		</form>
	</div>
</template>

<script>
import axios from '@/libs/axios';
import { defineComponent, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { mapGetters } from 'vuex';

export default defineComponent({
	name: 'TambahVarianProduk',
	data() {
		return {
			produk: [],
			form: {
				produk_id: '',
				versi: '',
				harga: '',
				sistembayar_id: '',
				gambar: '',
			},
			sistemBayarList: [],
			errorMessage: '',
		};
	},
	computed: {
		...mapGetters(['isAuthenticated']),
	},
	mounted() {
		this.setInitialProductId();
		this.fetchData();
	},
	methods: {
		async setInitialProductId() {
			const productId = this.$route.params.id;
			if (productId) {
				this.form.produk_id = productId;
				await this.fetchProductDetail(productId);
			}
		},
		async fetchProductDetail(productId) {
			try {
				const response = await axios.get(`api/produk/${productId}`);
				this.produk = response.data[0]?.nama;

				console.log('produk data:', this.produk);
			} catch (error) {
				console.error('Error fetching product detail:', error);
			}
		},
		async fetchData() {
			try {
				const sistembayarResponse = await axios.get(`api/sistem-bayar`);
				this.sistemBayarList = sistembayarResponse.data;

				// console.log('produk data:', varianProduk.produk);
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		},
		handleFileUpload(event) {
			const file = event.target.files[0];
			if (file) {
				this.form.gambar = file;
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
					const formData = new FormData();
					formData.append('produk_id', this.form.produk_id);
					formData.append('versi', this.form.versi);
					formData.append('harga', this.form.harga);
					formData.append('sistembayar_id', this.form.sistembayar_id);
					if (this.form.gambar) {
						formData.append('gambar', this.form.gambar);
					}

					// Log the formData for debugging purposes
					for (let [key, value] of formData.entries()) {
						console.log(`${key}: ${value}`);
					}

					const config = {
						headers: {
							Authorization: `Bearer ${token}`,
						},
					};

					const response = await axios.post('api/varian-produk/tambah', formData, config);
					alert('Varian Produk berhasil ditambahkan!');
					this.$router.push('/admin/produk');
				} else {
					alert('Anda harus login terlebih dahulu.');
					this.$router.push(`/masuk`);
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
