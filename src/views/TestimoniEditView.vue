<template>
	<div class="main">
		<h2>Edit Testimoni - {{ testimoni.length ? testimoni[0].id : 'Memuat...' }}</h2>
		<form @submit.prevent="submitForm" v-if="testimoni.length">
			<div class="form-group">
				<label for="keterangan">Keterangan</label>
				<input type="text" id="keterangan" v-model="testimoni[0].keterangan" class="form-control" />
			</div>
			<div class="form-group">
				<label for="gambar">Gambar</label>
				<input type="file" id="gambar" @change="handleFileUpload" class="form-control" />
				<div v-if="testimoni[0].gambar">
					<img
						:src="getItemImageUrl(testimoni[0].gambar)"
						class="img-thumbnail mt-2"
						alt="Gambar Testimoni" />
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

export default defineComponent({
	data() {
		return {
			testimoni: [],
			errorMessage: '',
		};
	},
	computed: {
		...mapGetters(['isAuthenticated']),
	},
	mounted() {
		this.fetchTestimoni();
	},
	methods: {
		async fetchTestimoni() {
			const testiId = this.$route.params.id;
			try {
				const testiResponse = await axios.get(`api/testimoni/${testiId}`);
				this.testimoni = testiResponse.data;
				console.log('Data Testimoni:', this.testimoni);
			} catch (error) {
				console.error('Error fetching testimoni:', error);
				this.errorMessage = 'Gagal mengambil data testimoni.';
			}
		},
		getItemImageUrl(imageFileName: string) {
			return `${import.meta.env.VITE_BACKEND_URL}upload/${imageFileName}`;
		},
		handleFileUpload(event: Event) {
			const target = event.target as HTMLInputElement;
			if (target.files && target.files.length > 0) {
				const file = target.files[0];
				this.testimoni[0].gambar = file;
			}
		},
		async submitForm() {
			try {
				const authStore = useAuthStore();
				if (this.isAuthenticated) {
					const token = localStorage.getItem('token');
					if (!token) {
						throw new Error('Token tidak ditemukan. Anda harus login terlebih dahulu.');
					}

					const formData = new FormData();
					formData.append('keterangan', this.testimoni[0].keterangan);
					if (this.testimoni[0].gambar instanceof File) {
						formData.append('gambar', this.testimoni[0].gambar);
					} else {
						formData.append('gambar', ''); // Tambahkan ini jika gambar tidak diubah
					}

					const config = {
						headers: {
							'Content-Type': 'multipart/form-data',
							Authorization: `Bearer ${token}`,
						},
					};

					const testiId = this.$route.params.id;
					const response = await axios.put(`api/testimoni/edit/${testiId}`, formData, config);
					console.log('Data yang dikirim:', formData);

					alert('Testimoni berhasil diperbarui!');
					this.$router.push('/testimoni');
				} else {
					alert('Anda harus login terlebih dahulu.');
					this.$router.push(`/masuk`);
				}
			} catch (error) {
				console.error('Error updating testimoni:', error);
				if (error.response) {
					console.error('Server responded with:', error.response.data);
					alert(error.response.data.message || 'Internal server error');
				} else {
					alert('Gagal memperbarui testimoni. Silakan coba lagi.');
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
