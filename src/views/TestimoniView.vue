<template>
	<div class="products">
		<h2>Testimoni - Pesanan</h2>
		<div class="product-variants">
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
	</div>
</template>

<script>
import axios from '@/libs/axios';
import { IMAGE_URL } from '@/libs/constant';

export default {
	name: 'TestimoniView',
	data() {
		return {
			testimonis: [],
			pesanans: [],
		};
	},
	mounted() {
		this.fetchTestimoni();
	},
	methods: {
		async fetchTestimoni() {
			try {
				const response = await axios.get('api/testimoni');
				console.log(response.data);
				this.testimonis = response.data;
			} catch (error) {
				console.error('Error fetching Testimoni:', error);
			}
		},
		getVariantImageUrl(imageFileName) {
			return `${IMAGE_URL}${imageFileName}`;
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
	padding: 20px;
}
.prod {
	padding-top: 20px;
}
.close {
	padding-top: 10px;
	color: #ff0000;
}
.product-variants {
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
	width: 100%;
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

.price {
	display: block;
	font-size: 16px;
	color: green;
	margin-bottom: 10px;
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
	background-color: #0056b3;
}

.keranjang {
	padding-top: 5px;
}
</style>
