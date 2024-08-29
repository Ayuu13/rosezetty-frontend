<template>
    <div class="main">
        <h2>Daftar Keranjang</h2>
    </div>
    <div class="card-body">
        <div class="table-responsive">
            <table class="table align-items-center mb-0" id="dataTable" width="100%">
                <thead class="text-center text-uppercase font-weight-bolder">
                    <tr>
                        <th></th>
                        <th>Produk</th>
                        <th>Variasi</th>
                        <th>Jumlah</th>
                        <th>Harga</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody class="text-center">
                    <tr v-for="(item, index) in cartItems" :key="index">
                    <td><input type="checkbox" v-model="checkedRows[index]"></td>
                    <td>{{ item[0]?.nama }}</td>
                    <td>{{ item.variant.versi }}</td>
                    <td>
                        <button class="btn-box1" @click="decreaseQuantity(item.variant.id)">-</button>
                        <span class="jumlah1">{{ item.jumlah }}</span>
                        <button class="btn-box2" @click="increaseQuantity(item.variant.id)">+</button>
                    </td>
                    <td>{{ (item.variant.harga * item.jumlah).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }) }}</td>
                    <td>
                        <router-link :to="'/produk-detail/' + item.variant.id">
                        Detail
                        </router-link>
                    </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div class="checkout">
        <label class="checkbox-label">
            <input type="checkbox" @change="checkAllProducts"> 
            <p>Semua</p>
        </label>
        <p class="pharga">Total Harga {{ totalHargaRupiah }}</p>
        <button class="btn-checkout" @click="checkout">Pesan</button> 
    </div>
</template>
    
<script lang="ts">
import { useCartStore } from '@/stores/cart';
import { useAuthStore } from '@/stores/auth';
import { mapGetters } from 'vuex';

export default {
  name: "KeranjangView",
  data() {
    return {
      item: null,
    }; 
  },
  computed: { 
    ...mapGetters(['isAuthenticated']),
    cartItems() {
      const cartStore = useCartStore();
      return cartStore.getCartItems;
    },
    checkedRows() {
      const cartStore = useCartStore();
      return cartStore.checkedRows;
    },
    totalHargaRupiah() {
      const total = this.cartItems.reduce((total, item, index) => {
        if (this.checkedRows[index]) {
          return total + item.variant.harga * item.jumlah;
        }
        return total;
      }, 0);
      return total.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
    }
  },
  methods: {
    decreaseQuantity(variantId) {
      const cartStore = useCartStore();
      const cartItem = cartStore.cart.find(item => item.variant.id === variantId);
      
      if (cartItem && cartItem.jumlah > 1) {
        cartStore.updateQuantity(variantId, cartItem.jumlah - 1);
      } else if (cartItem) {
        if (confirm("Apakah Anda yakin ingin menghapus produk ini dari pesanan?")) {
          cartStore.removeFromCart(variantId);
        }
      } else {
        console.error(`Cart item with variantId ${variantId} not found.`);
      }
    },
    increaseQuantity(variantId) {
      const cartStore = useCartStore();
      const cartItem = cartStore.cart.find(item => item.variant.id === variantId);
      
      if (cartItem) {
        cartStore.updateQuantity(variantId, cartItem.jumlah + 1);
      } else {
        console.error(`Cart item with variantId ${variantId} not found.`);
      }
    },
    checkAllProducts(event) {
      const cartStore = useCartStore();
      if (event.target.checked) {
        cartStore.checkedRows = Array(this.cartItems.length).fill(true);
      } else {
        cartStore.checkedRows = Array(this.cartItems.length).fill(false);
      }
    },
    toggleCheckRow(index) {
      const cartStore = useCartStore();
      cartStore.updateCheckedRows(index, !this.checkedRows[index]);
    },
    checkout() {
      const authStore = useAuthStore();
      if (this.isAuthenticated) {
        const selectedItems = this.cartItems.filter((item, index) => this.checkedRows[index]);
        if (selectedItems.length > 0) {
          console.log('Keranjang pesanan dengan data:', selectedItems);
          this.$router.push(`/pesanan`);
        } else {
          alert('Silakan pilih setidaknya satu item untuk checkout.');
        }
      } else {
        alert('Anda harus login terlebih dahulu.');
        this.$router.push(`/masuk`);
      }
    }
  }
};
</script>

<style scoped>

.main{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60px;
}
.table-responsive {
    overflow-x: auto;
}
.table th, .table td {
    padding: 0.75rem;
    vertical-align: top;
    border-top: 1px solid #dee2e6;
}  
.table thead th {
    vertical-align: bottom;
    border-bottom: 2px solid #dee2e6;
}
.icon1{
    color: inherit;
}
.btn-box1 {
    display: inline-block;
    width: 30px;
    height: 30px;
    border: 1px solid #ccc;
    cursor: pointer;
}
.btn-box2 {
    display: inline-block;
    width: 30px;
    height: 30px;
    border: 1px solid #ccc;
    cursor: pointer;
}
.jumlah1 {
    padding-left: 10px;
    padding-right: 10px;
}

.checkout {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 37px;
    padding-right: 35px;
    padding-top: 20px;
    border-top: 1px solid #ccc;
}
.checkbox-label {
    display: flex;
    align-items: center;
    margin-right: 600px;
}
.checkbox-label input[type="checkbox"] {
    margin-right: 30px;
}

.btn-checkout {
    padding: 10px 20px;
    /* border: none; */
    border-radius: 5px;
    background-color: rgb(187, 0, 112);
    color: white;
    cursor: pointer;
    /* transition: background-color 0.3s ease; */
}
.btn-checkout:hover {
    background-color: rgb(242, 14, 151);
}

@media screen and (max-width: 768px) {
    .btn-box1 {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 1px solid #ccc;
    cursor: pointer;
}
.btn-box2 {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 1px solid #ccc;
    cursor: pointer;
}
.jumlah1 {
    padding-left: 7px;
    padding-right: 7px;
}

.checkout {
    padding-left: 17px;
    padding-right: 15px;
}
.checkbox-label {
    margin-right: 55px;
}
.checkbox-label input[type="checkbox"] {
    margin-right: 25px;
}

.btn-checkout {
    padding: 5px 13px;
    font-size: 15px;
}

}
</style>