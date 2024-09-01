<template>
	<div class="main">
		<h2>Kelola Data Produk</h2>
		<div class="add">
			<button @click="addProduct">Tambah</button>
		</div>
	</div>
	<div v-for="(productsByType, jenisProduk) in groupedProducts" :key="jenisProduk" class="card">
		<h3 class="jenis-produk-title">Produk {{ jenisProduk }}</h3>
		<div class="table-responsive">
			<table class="table align-items-center mb-0">
				<thead class="text-center text-uppercase text-xxs font-weight-bolder opacity-7">
					<tr>
						<th>Nama</th>
						<th>Total Pesanan</th>
						<th>Detail</th>
						<th>Status Barang</th>
						<th>Tutup PO</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(product, index) in productsByType" :key="index">
						<td>
							<h4 class="text-center mb-0">{{ product.nama }}</h4>
						</td>
						<td>
							<h4 class="text-center mb-0">{{ product.totalPesanan }}</h4>
						</td>
						<td>
							<p class="text-center mb-0">{{ product.detail }}</p>
						</td>
						<td class="align-middle text-center text-sm">
							<span :class="badgeClass(product.status)">{{ product.barang.nama }}</span>
						</td>
						<td class="align-middle text-center">
							<span>{{ formatDate(product.tutup_pesanan) }}</span>
						</td>
						<td>
							<router-link :to="'/admin/produk-detail/' + product.id" class="product-det"> Detail </router-link>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>

<script>
import axios from '@/libs/axios';

export default {
	name: 'ProdukView',
	data() {
		return {
			products: [],
			jenisProdukMap: {},
		};
	},
	computed: {
		groupedProducts() {
			return this.products.reduce((groups, product) => {
				const jenisProduk = this.jenisProdukMap[product.jenis_id] || 'Lainnya';
				if (!groups[jenisProduk]) {
					groups[jenisProduk] = [];
				}
				groups[jenisProduk].push(product);
				return groups;
			}, {});
		},
	},
	mounted() {
		this.fetchData();
	},
	methods: {
		async fetchData() {
			try {
				const [produkResponse, jenisProdukResponse] = await Promise.all([
					axios.get('api/produk'),
					axios.get('api/jenis-produk'),
				]);
				this.products = produkResponse.data;

				this.jenisProdukMap = jenisProdukResponse.data.reduce((map, jenis) => {
					map[jenis.id] = jenis.nama;
					return map;
				}, {});

				await Promise.all(
					this.products.map(async (product) => {
						try {
							const totalProdukResponse = await axios.get(`api/total-pesan/${product.id}`);
							product.totalPesanan = totalProdukResponse.data[product.id]?.total || 0;
						} catch (error) {
							if (error.response && error.response.status === 404) {
								console.warn(`Total pesanan untuk produk ID ${product.id} tidak ditemukan.`);
								product.totalPesanan = 0; // Tetapkan nilai default
							} else {
								console.error('Error fetching total orders:', error);
							}
						}
					})
				);

				console.log(produkResponse);
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		},
		addProduct() {
			this.$router.push('/admin/produk/tambah');
		},
		badgeClass(status) {
			return {
				'badge-success': status === 'on going',
				'badge-secondary': status === 'otw indo',
			};
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
	margin: 20px;
	display: flex;
	justify-content: center;
	align-items: center;
}
.add {
	padding-left: 10px;
}
button {
	padding: 5px 10px;
	border-radius: 5px;
	background-color: #007bff;
	color: white;
	cursor: pointer;
	border: none;
	transition: background-color 0.3s;
}
button:hover {
	background-color: #003d7e;
}

.card {
	margin-bottom: 35px;
}

.table-responsive {
	overflow-x: auto;
}
.jenis-produk-title {
	padding: 10px 15px;
	background-color: #f5f5f5;
	margin: 0;
	text-align: center;
}
.table {
	width: 100%;
	max-width: 100%;
	margin-bottom: 1rem;
	background-color: transparent;
}
.table th,
.table td {
	padding: 0.75rem;
	vertical-align: top;
	border-top: 1px solid #dee2e6;
}
.table thead th {
	vertical-align: bottom;
	border-bottom: 2px solid #dee2e6;
}
.badge-success {
	color: #fff !important;
	background-color: rgb(2, 176, 2);
}
.badge-secondary {
	color: #fff !important;
	background-color: rgb(199, 199, 199);
}
.text-color {
	color: #939393;
	font-size: medium;
}
</style>
