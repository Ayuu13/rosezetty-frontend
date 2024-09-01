<template>
	<div class="products">
		<h1>Produk Pre-Order</h1>
		<div class="product-list">
			<div v-for="product in products" :key="product.id" class="product">
				<router-link :to="'/varian-produk/' + product.id" class="product-link">
					<h3>{{ product.nama }}</h3>
				</router-link>
				<p>CLOSE {{ formatDate(product.tutup_pesanan) }}</p>
				<router-link :to="'/varian-produk/' + product.id" class="product-det"> Selengkapnya </router-link>
			</div>
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
		};
	},
	mounted() {
		this.fetchProducts();
	},
	methods: {
		async fetchProducts() {
			try {
				const response = await axios.get('api/produk');
				console.log(response.data);
				this.products = response.data;
			} catch (error) {
				console.error('Error fetching products:', error);
			}
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
.products {
	text-align: center;
	padding-top: 20px;
}

.product-list {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	padding-top: 15px;
}

.product {
	width: 300px;
	margin: 10px;
	padding: 5px;
	border: 1px solid #ccc;
	border-radius: 5px;
}
.product-link {
	color: inherit;
}

.product img {
	width: 100%;
	border-radius: 5px;
}

.product p {
	margin-top: 5px;
}

button {
	margin-top: 7px;
	padding-top: 7px;
	padding-left: 5px;
	padding-right: 5px;
	margin-left: 10px;
	border-radius: 3px;
	background-color: #007bff;
	color: white;
	cursor: pointer;
}
.product-det {
	/* text-decoration: underline; */
	color: #007bff;
	text-decoration-color: #007bff;
}
</style>
