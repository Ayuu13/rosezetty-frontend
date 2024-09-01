<template>
	<div class="main">
		<h2>Edit Metode Bayar - {{ form.nama || 'Memuat...' }}</h2>
		<form @submit.prevent="submitForm" v-if="form.nama">
			<div class="form-group">
				<label for="nama">Nama</label>
				<input type="text" id="nama" v-model="form.nama" class="form-control" required />
			</div>
			<div class="form-group">
				<label for="keterangan">Keterangan</label>
				<input type="text" id="keterangan" v-model="form.keterangan" class="form-control" />
			</div>
			<div class="form-group">
				<label for="gambar">Gambar</label>
				<input type="file" id="gambar" @change="handleFileUpload" class="form-control" />
				<!-- Tampilkan gambar yang ada jika URL ada -->
				<div v-if="form.gambarUrl">
					<img :src="getItemImageUrl(form.gambarUrl)" class="img-thumbnail mt-2" />
				</div>
			</div>
			<button type="submit" class="btn btn-primary">Perbarui</button>
		</form>
		<div v-else class="alert alert-info">Memuat...</div>
		<div v-if="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>
	</div>
</template>

<script lang="ts">
import axios from '@/libs/axios';
import { defineComponent } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { mapGetters } from 'vuex';
import { IMAGE_URL } from '@/libs/constant';

interface Form {
	nama: string;
	keterangan: string;
	gambar: File | null;
	gambarUrl?: string; // Menyimpan URL gambar yang ada
}

export default defineComponent({
	name: 'EditMetodeBayar',
	data() {
		return {
			form: {
				nama: '',
				keterangan: '',
				gambar: null,
				gambarUrl: '', // URL gambar yang ada
			} as Form,
			errorMessage: '',
		};
	},
	computed: {
		...mapGetters(['isAuthenticated']),
	},
	mounted() {
		this.fetchMetodeBayar();
	},
	methods: {
		async fetchMetodeBayar() {
			const metodeId = this.$route.params.id;
			try {
				const response = await axios.get(`api/metode-bayar/${metodeId}`);
				const metodeBayar = response.data;

				if (metodeBayar) {
					this.form = {
						nama: metodeBayar.nama,
						keterangan: metodeBayar.keterangan,
						gambar: null, // Gambar tidak dapat diisi langsung; perlu diunggah terpisah
						gambarUrl: metodeBayar.gambar || '', // Pastikan gambarUrl valid
					};
				} else {
					throw new Error('Data metode bayar tidak ditemukan.');
				}
			} catch (error) {
				console.error('Error fetching metode bayar:', error);
				this.errorMessage = 'Gagal mengambil Metode Pembayaran. Silakan coba lagi.';
			}
		},
		getItemImageUrl(imageFileName) {
			return `${IMAGE_URL}${imageFileName}`;
		},
		handleFileUpload(event: Event) {
			const target = event.target as HTMLInputElement;
			if (target.files && target.files.length > 0) {
				this.form.gambar = target.files[0];
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
					formData.append('nama', this.form.nama);
					formData.append('keterangan', this.form.keterangan);
					if (this.form.gambar) {
						formData.append('gambar', this.form.gambar);
					}
					const config = {
						headers: {
							'Content-Type': 'multipart/form-data', // Harus multipart/form-data untuk upload file
							Authorization: `Bearer ${token}`,
						},
					};

					const metodeId = this.$route.params.id;
					const response = await axios.put(`api/metode-bayar/edit/${metodeId}`, formData, config);
					console.log(response);
					alert('Metode Pembayaran berhasil diperbarui!');
					this.$router.push('/admin/pemasukan');
				} else {
					alert('Anda harus login terlebih dahulu.');
					this.$router.push(`/masuk`);
				}
			} catch (error) {
				console.error('Error updating metode bayar:', error);
				if (error.response) {
					console.error('Server responded with:', error.response.data);
					alert(error.response.data.message || 'Internal server error');
				} else {
					alert('Gagal memperbarui metode bayar. Silakan coba lagi.');
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
.form-group img {
	width: 40%;
	height: auto;
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
