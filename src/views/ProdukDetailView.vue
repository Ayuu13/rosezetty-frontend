<template>
  <div class="products" v-if="product">
    <h2>Detail - Varian Produk</h2>
    <div class="prod">
    <h3>{{ product[0]?.nama }}</h3>
    <p>{{ product[0]?.detail }}</p>
    <p class="close">CLOSE {{ formatDate(product[0]?.tutup_pesanan) }}</p>
    </div>

    <div class="product-variants">
      <div v-for="variant in variants" :key="variant.id" class="variant">
        <img :src="getVariantImageUrl(variant.gambar)" :alt="'Produk versi ' + variant.versi">
        <div class="variant-details">
          <span class="variant-name">{{ variant.versi }}</span>
          <span>Sistem Bayar: {{ variant.sistembayar_nama }}</span>
          <span class="price">Rp {{ variant.harga }}</span>
          <button @click="addToCart(product, variant)">
            Tambah <svg-icon class="keranjang" type="mdi" :path="path" :size="iconSize"></svg-icon>
          </button></div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiCartPlus } from '@mdi/js';
import { useCartStore } from '@/stores/cart';

export default {
  name: "ProdukDetailView",
  components: { SvgIcon },
  data() {
    return {
      path: mdiCartPlus,
      iconSize: 20,
      product: null,
      variants: []
    };
  },
  mounted() {
    this.fetchProductDetails();
  },
  methods: {
  async fetchProductDetails() {
    const varianId = this.$route.params.id;
    try {
      const variantsResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/varian-detail/${varianId}`);
      this.variants = variantsResponse.data;

      if (this.variants.length > 0) {
        const productId = this.variants[0].produk_id;

        const productResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/produk/${productId}`);
        this.product = productResponse.data;

        const sistembayarIds = this.variants.map(variant => variant.sistembayar_id);
        const sistembayarDetailsResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/sistem-bayar`, {
            params: { ids: sistembayarIds }
        });

        this.variants.forEach(variant => {
            const detail = sistembayarDetailsResponse.data.find(d => d.id === variant.sistembayar_id);
            if (detail) {
            variant.sistembayar_nama = detail.nama;
            }
        });
        } else {
            console.error('Tidak ada varian ditemukan untuk ID:', varianId);
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    },
  addToCart(product, variant) {
      const cartStore = useCartStore();
      cartStore.addToCart(product, variant);
      console.log('Added to cart:', product, 'Variant:', variant);
      this.$nextTick(() => {
        alert('Produk berhasil ditambah ke Keranjang');
      });
  },
  getVariantImageUrl(imageFileName) {
    return `${import.meta.env.VITE_UPLOAD_URL}/${imageFileName}`;
  },
  formatDate(dateString) {
      if (!dateString) return 'Tidak tersedia';
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
  },
}
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

.keranjang{
  padding-top: 5px;
}
</style>