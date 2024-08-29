// stores/cart.js
import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    cart: [],
    checkedRows: []
  }),
  actions: {
    addToCart(product, variant) {
      const existingItem = this.cart.find(
        item => item.variant.id === variant.id
      );

      if (existingItem) {
        existingItem.jumlah++;
      } else {
        this.cart.push({ ...product, variant, jumlah: 1 });
        this.checkedRows.push(false);
      }
    },
    removeFromCart(variantId) {
      this.cart = this.cart.filter(item => item.variant.id !== variantId);
      this.checkedRows.splice(index, 1);
    },
    updateQuantity(variantId, jumlah) {
      const cartItem = this.cart.find(item => item.variant.id === variantId);
      if (cartItem) {
        cartItem.jumlah = jumlah;
      }
    },
    updateCheckedRows(index, status) {
      this.checkedRows[index] = status;
    }
  },
  getters: {
    getCartItems: state => state.cart,
    getTotalPrice: state =>
      state.cart.reduce(
        (total, item) => total + item.variant.harga * item.jumlah,
        0
      )
  }
});
