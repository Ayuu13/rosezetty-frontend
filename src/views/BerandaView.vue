<template>
	<div class="main">
		<header>
			<h1>Selamat Datang di Rosezzty</h1>
			<p>Toko online yang menjual berbagai produk Pre-Order berkualitas tinggi.</p>
		</header>

		<section class="categories">
			<h2>Kategori Produk yang tersedia</h2>
			<div class="category-list">
				<div class="category" v-for="category in categories" :key="category.id">
					<h4>{{ category.nama }}</h4>
				</div>
			</div>
		</section>

		<section class="testimonials">
			<h2>Testimoni Pelanggan</h2>
			<button @click="toggleTestimoni" class="btn">Lihat Testimoni</button>

			<div v-if="showTestimoni" class="testimoni-content">
				<div v-for="testi in testimonis" :key="testi.id" class="variant">
					<span>{{ formatDate(testi.dibuat) }}</span>
					<img :src="getVariantImageUrl(testi.gambar)" :alt="'Testimoni ' + testi.gambar" />
					<div class="variant-details">
						<span class="variant-name">{{ testi.keterangan }}</span>

						<div v-for="item in testi.pesanan.pesanandetail" :key="item.id" class="items">
							<div class="item-details">
								<p><strong>Produk:</strong> {{ item.produkVersi.produk.nama }}</p>
								<p><strong>Varian:</strong> {{ item.produkVersi.versi }}</p>
								<p><strong>Jumlah:</strong> {{ item.jumlah_barang }}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	</div>
</template>

<script>
import axios from '@/libs/axios';

export default {
	data() {
		return {
			showTestimoni: false,
			testimonis: [],
			categories: [],
		};
	},
	mounted() {
		this.fetchCategories();
	},
	methods: {
		async fetchCategories() {
			try {
				const productResponse = await axios.get(`api/jenis-produk`);
				this.categories = productResponse.data;
				console.log(productResponse);
			} catch (error) {
				console.error('Error fetching product details:', error);
			}
		},
		async toggleTestimoni() {
			this.showTestimoni = !this.showTestimoni;

			// Jika testimoni baru akan dimuat jika belum dimuat
			if (this.showTestimoni && this.testimonis.length === 0) {
				await this.fetchTestimoni();
			}
		},
		async fetchTestimoni() {
			try {
				const response = await axios.get('api/testimoni');
				this.testimonis = response.data;
			} catch (error) {
				console.error('Error fetching Testimoni:', error);
			}
		},
		getVariantImageUrl(imageFileName) {
			return `${import.meta.env.VITE_BACKEND_URL}upload/${imageFileName}`;
		},
		formatDate(dateString) {
			if (!dateString) return 'Tidak tersedia';
			const options = { year: 'numeric', month: 'long', day: 'numeric' };
			return new Date(dateString).toLocaleDateString(undefined, options);
		},
	},
};
</script>

<style scoped>
.main {
	padding: 20px;
}

header {
	text-align: center;
	margin-bottom: 40px;
}

.categories,
.testimonials {
	margin-bottom: 40px;
	text-align: center;
}

.category-list {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
}

.category {
	width: 200px;
	margin: 10px;
	padding: 10px;
	border: 1px solid #ccc;
	border-radius: 8px;
	display: flex;
	flex-direction: column;
	align-items: center;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn {
	background-color: #4caf50;
	color: white;
	padding: 10px 20px;
	cursor: pointer;
	border-radius: 5px;
	font-weight: bold;
}

.testimoni-content {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	margin-top: 20px;
}
.variant {
	width: 250px;
	margin: 10px;
	padding: 10px;
	border: 1px solid #ccc;
	border-radius: 8px;
	display: flex;
	flex-direction: column;
	align-items: center;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.variant img {
	width: 80%;
	height: auto;
	border-radius: 8px;
}
.variant-details {
	margin-top: 10px;
	text-align: center;
}
.variant-name {
	display: block;
	font-size: 18px;
	font-weight: bold;
	margin-bottom: 5px;
}
.items {
	margin-top: 10px;
}
.item-details {
	text-align: left;
	margin-bottom: 10px;
}
</style>
