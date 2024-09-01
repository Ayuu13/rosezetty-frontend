<template>
	<div class="main">
		<h2>Kelola Data Produk</h2>
	</div>

	<div v-if="product" class="product-header">
		<h3>{{ product[0]?.nama }}</h3>
		<div class="add">
			<button @click="addProduct" class="addBut">Tambah</button>
		</div>
		<div class="actions">
			<button @click="editProduct" class="editBut">Edit</button>
		</div>
	</div>

	<div v-if="product" class="product-details">
		<div class="product-info">
			<p>{{ product[0]?.detail }}</p>
			<p><strong>Status Barang:</strong> {{ product[0].barang?.nama }}</p>
			<p class="close"><strong>Tutup PO:</strong> {{ product[0]?.tutup_pesanan }}</p>
			<p class="close"><strong>Total Pesanan:</strong> {{ totalProduk?.total }}</p>
		</div>

		<div class="product-variants">
			<div v-for="variant in variants" :key="variant.id" class="variant">
				<img :src="getVariantImageUrl(variant.gambar)" :alt="'Produk versi ' + variant.versi" />
				<div class="variant-details">
					<span class="variant-name">{{ variant.versi }}</span>
					<span>Total Pesanan: {{ variant.totalPesanan }}</span
					><br />
					<span>Sistem Bayar: {{ variant.sistembayar_nama }}</span>
					<span class="price">{{ formatCurrency(variant.harga) }}</span>
					<div class="actions">
						<button @click="editVariant(variant)" class="editBut">Edit</button>
					</div>
					<div class="delete">
						<button @click="confirmDelete(variant.id)" class="deleteBut">Hapus</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import axios from '@/libs/axios';
import { useAuthStore } from '@/stores/auth';
import { mapGetters } from 'vuex';

export default {
	name: 'ProdukDetailView',
	data() {
		return {
			product: null,
			variants: [],
			totalProduk: [],
		};
	},
	computed: {
		...mapGetters(['isAuthenticated']),
	},
	mounted() {
		this.fetchProductDetails();
	},
	methods: {
		async fetchProductDetails() {
			const productId = this.$route.params.produk_id;
			try {
				const productResponse = await axios.get(`api/produk/${productId}`);
				this.product = productResponse.data;
				console.log(productResponse);

				try {
					const produkResponse = await axios.get(`api/total-pesan/${productId}`);
					this.totalProduk = produkResponse.data[productId];
					console.log(produkResponse);
				} catch (error) {
					if (error.response && error.response.status === 404) {
						console.warn(`Total pesanan untuk produk ID ${productId} tidak ditemukan.`);
						this.totalProduk = { total: 0 }; // Tetapkan nilai default
					} else {
						console.error('Error fetching total orders:', error);
					}
				}

				// Ambil varian produk terkait
				const variantsResponse = await axios.get(`api/varian/${productId}`);
				this.variants = variantsResponse.data;

				// Ambil total pesanan untuk setiap varian
				for (let variant of this.variants) {
					try {
						const pesananResponse = await axios.get(`api/pesanan-total/${variant.id}`);
						const variantData = pesananResponse.data[variant.id];
						if (variantData) {
							variant.totalPesanan = variantData.total;
						} else {
							variant.totalPesanan = 0; // Default jika tidak ada data
						}
						console.log(pesananResponse);
					} catch (error) {
						if (error.response && error.response.status === 404) {
							console.warn(`Total pesanan untuk varian ID ${variant.id} tidak ditemukan.`);
							variant.totalPesanan = 0; // Tetapkan nilai default
						} else {
							console.error('Error fetching total orders for variant:', error);
						}
					}
				}

				// Fetch payment system details for each variant
				const sistembayarIds = this.variants.map((variant) => variant.sistembayar_id);
				const sistembayarDetailsResponse = await axios.get('api/sistem-bayar', {
					params: { ids: sistembayarIds },
				});

				this.variants.forEach((variant) => {
					const detail = sistembayarDetailsResponse.data.find((d) => d.id === variant.sistembayar_id);
					if (detail) {
						variant.sistembayar_nama = detail.nama;
					}
				});
				console.log(variantsResponse);
			} catch (error) {
				if (error.response && error.response.status === 404) {
					console.warn(`Produk dengan ID ${productId} tidak ditemukan.`);
				} else {
					console.error('Error fetching product details:', error);
				}
			}
		},
		formatCurrency(amount) {
			return amount.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
		},
		getVariantImageUrl(imageFileName) {
			return `${import.meta.env.VITE_BACKEND_URL}upload/${imageFileName}`;
		},
		addProduct() {
			this.$router.push(`/admin/produk-varian/${this.product[0]?.id}/tambah`);
		},
		editProduct() {
			this.$router.push(`/admin/produk/edit/${this.product[0]?.id}`);
		},
		editVariant(variant) {
			this.$router.push(`/admin/produk-varian/edit/${variant.id}`);
			console.log(variant);
		},

		async confirmDelete(variantId) {
			const authStore = useAuthStore();
			if (this.isAuthenticated) {
				const token = localStorage.getItem('token'); // Ambil token dari local storage
				if (!token) {
					throw new Error('Token tidak ditemukan. Anda harus login terlebih dahulu.');
				}
				const confirmed = window.confirm('Apakah Anda yakin ingin menghapus varian ini?');
				if (confirmed) {
					await this.deleteVariant(variantId, token);
				}
			} else {
				alert('Anda harus login terlebih dahulu.');
				this.$router.push(`/masuk`);
			}
		},
		async deleteVariant(variantId, token) {
			try {
				const config = {
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
				};
				await axios.delete(`api/varian-produk/${variantId}`, config);
				this.variants = this.variants.filter((variant) => variant.id !== variantId);
				alert('Varian berhasil dihapus!');
			} catch (error) {
				console.error('Error deleting variant:', error);
				alert('Gagal menghapus varian. Silakan coba lagi.');
			}
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
	padding-bottom: 10px;
}
.add {
	padding-left: 10px;
}
.product-header {
	margin: 20px;
	display: flex;
	justify-content: center;
	align-items: center;
}
.actions {
	padding-left: 10px;
}
.delete {
	padding: 5px;
	padding-left: 15px;
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
.deleteBut {
	padding: 5px 10px;
	border-radius: 5px;
	background-color: #ff0101;
	color: white;
	cursor: pointer;
	border: none;
}
.deleteBut:hover {
	background-color: #a80000;
}

.product-details {
	text-align: center;
	margin-top: 20px;
}
.product-info {
	margin-bottom: 20px;
}
.product-variants {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
}

.variant {
	margin: 10px;
	border: 1px solid #ccc;
	padding: 10px;
	width: 200px;
	display: flex;
	flex-direction: column;
	align-items: center;
	border-radius: 5px;
}
.variant img {
	max-width: 100%;
	height: auto;
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
.price {
	display: block;
	font-size: 16px;
	color: green;
	margin-bottom: 10px;
}
</style>
