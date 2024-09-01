<template>
	<div class="main">
		<h2>Data Pemasukan</h2>
	</div>
	<v-item-group selected-class="bg-primary">
		<v-container>
			<v-row>
				<v-col>
					<v-card class="masuk">
						<h3>Total Pemasukan dari seluruh Pesanan</h3>
						<p>Rp. {{ totalPemasukan }}</p>
					</v-card>
				</v-col>
			</v-row>
			<v-row class="masuk1">
				<v-col v-for="metode in metodes" :key="metode.id" class="masuk2">
					<h3>{{ metode.nama }}</h3>
					<p>Rp. {{ pemasukanByMetode[metode.id] || 0 }}</p>
				</v-col>
			</v-row>
		</v-container>
	</v-item-group>
	<div class="data-bayar">
		<div v-for="bayar in metodes" :key="bayar.id" class="variant">
			<div class="data-details">
				<p>Pembayaran: {{ bayar.nama }}</p>
				<p>Info Nomor: {{ bayar.keterangan }}</p>
				<img :src="getVariantImageUrl(bayar.gambar)" />
			</div>
			<div class="actions">
				<button @click="editProduct(bayar)" class="editBut">Edit</button>
			</div>
		</div>
	</div>

	<div class="product-header">
		<div class="add">
			<button @click="addProduct" class="addBut">Tambah</button>
		</div>
	</div>
</template>

<script>
import axios from '@/libs/axios';

export default {
	data() {
		return {
			metodes: [], // Daftar metode pembayaran
			pesanans: [], // Daftar pesanan
			totalPemasukan: 0, // Total pemasukan dari seluruh pesanan
			pemasukanByMetode: {}, // Total pemasukan berdasarkan metode pembayaran
		};
	},
	mounted() {
		this.fetchProductDetails();
	},
	methods: {
		async fetchProductDetails() {
			try {
				// Fetch data metode pembayaran
				const metodeResponse = await axios.get('api/metode-bayar');
				this.metodes = metodeResponse.data;
				console.log('Data Metode Bayar:', this.metodes);

				// Fetch data pesanan
				const pesananResponse = await axios.get('api/pesanan');
				this.pesanans = pesananResponse.data;
				console.log('Data Pesanan:', this.pesanans);

				// Hitung total pemasukan dari seluruh pesanan
				this.totalPemasukan = this.pesanans.reduce((total, pesanan) => {
					return total + (pesanan.jumlah_bayar || 0);
				}, 0);
				console.log('Total Pemasukan:', this.totalPemasukan);

				// Hitung total pemasukan berdasarkan metode_id
				this.pemasukanByMetode = this.metodes.reduce((totals, metode) => {
					totals[metode.id] = this.pesanans
						.filter((pesanan) => pesanan.metode_id === metode.id)
						.reduce((sum, pesanan) => sum + (pesanan.jumlah_bayar || 0), 0);
					return totals;
				}, {});
				console.log('Pemasukan Berdasarkan Metode:', this.pemasukanByMetode);
			} catch (error) {
				console.error('Error fetching product details:', error);
			}
		},
		getVariantImageUrl(imageFileName) {
			return `${import.meta.env.VITE_BACKEND_URL}upload/${imageFileName}`;
		},
		addProduct() {
			this.$router.push(`/admin/metode-bayar/tambah`);
		},
		editProduct(bayar) {
			this.$router.push(`/admin/metode-bayar/edit/${bayar.id}`);
		},
	},
};
</script>

<style scoped>
.main {
	padding-top: 20px;
	display: flex;
	justify-content: center;
	align-items: center;
}
.masuk {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 5px;
	border: 1px solid #ccc;
	border-radius: 5px;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.masuk1 {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	margin-top: 20px;
}

.masuk2 {
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

.data-bayar {
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
}
.variant {
	margin: 10px;
	border: 1px solid #ccc;
	padding: 10px;
	width: 350px;
	display: flex;
	border-radius: 5px;
}
.variant img {
	max-width: 50%;
	height: auto;
}

.product-header {
	margin: 20px;
	display: flex;
	justify-content: center;
	align-items: center;
}
.add {
	padding-left: 10px;
}
.addBut {
	padding: 5px 10px;
	border-radius: 5px;
	background-color: #218cff;
	color: white;
	cursor: pointer;
	border: none;
}
.addBut:hover {
	background-color: #003872;
}
.editBut {
	padding: 5px 10px;
	border-radius: 5px;
	background-color: #ffbf01;
	color: white;
	cursor: pointer;
	border: none;
}
.editBut:hover {
	background-color: #a87e00;
}
</style>
