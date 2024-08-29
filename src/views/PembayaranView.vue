<template>
  <div class="text-center">
    <h2>Konfirmasi Pembayaran - Pesanan</h2>
  </div>
  <div class="card-body2">
            <p class="mb-2">Jumlah Barang:</p>
            <p class="mb-2">{{ totalQuantity }}</p>
          </div>
          <div class="card-body2">
            <h4 class="mb-2">Harga Total:</h4>
            <h4 class="mb-2 fw-bold">{{ totalPrice.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }) }}</h4>
          </div>

    <section style="background-color: #eee;">
  <div class="container py-5">
    <div class="card">
      <div class="card-body">
        <div class="row d-flex justify-content-center pb-5">
            <div class="col-md-5 col-xl-4 offset-xl-1">
            <div class="rounded d-flex flex-column p-2 bg-body-tertiary">
              <div class="p-2 me-3">
                <h4>Pemesanan</h4>
              </div>
              <div class="p-2 d-flex">
                <div class="col-8">Copayment</div>
                <div class="ms-auto">+ $40.00</div>
              </div>
              <div class="border-top px-2 mx-2"></div>
              <div class="p-2 d-flex pt-3">
                <div class="col-8">Insurance Responsibility</div>
                <div class="ms-auto"><b>$71.76</b></div>
              </div>
              <div class="p-2 d-flex">
                <div class="col-8">
                  Patient Balance <span class="fa fa-question-circle text-dark"></span>
                </div>
                <div class="ms-auto"><b>$71.76</b></div>
              </div>
              <div class="border-top px-2 mx-2"></div>
              <div class="p-2 d-flex pt-3">
                <div class="col-8"><b>Total</b></div>
                <div class="ms-auto"><b class="text-success">$85.00</b></div>
              </div>
            </div>
          </div>

          <div class="col-md-7 col-xl-5 mb-4 mb-md-0">
            <div class="py-4 d-flex flex-row">
              <span class="ps-2">Metode Pembayaran</span>
            </div>
            <hr />
            <div class="pt-2">
              <p>
                - Shopeepay  @rosezzty
                - DANA  Zheilla Arthamevia Napitupulu
                - QRIS a/n ROSEZZTY BY ZELLAOXO

                ‼️Payment ke QRIS khusus nominal di bawah 300k. Mohon memilih metode pembayaran lain untuk nominal di atas 300k‼️
                Top up Bank ke DANA + 500, Bank ke Spay + 1000
              </p>
              <form class="pb-3">
                <div class="d-flex flex-row pb-3">
                  <div class="d-flex align-items-center pe-2">
                    <input class="form-check-input" type="radio" name="radioNoLabel" id="radioNoLabel1"
                      value="" aria-label="..." checked />
                  </div>
                  <div class="rounded border d-flex w-100 p-3 align-items-center">
                    <p class="mb-0">
                      <i class="fab fa-cc-visa fa-lg text-primary pe-2"></i>Shopeepay
                    </p>
                  </div>
                </div>
              </form>
              <input type="button" value="Kirim" data-mdb-ripple-init class="btn btn-primary btn-block btn-lg" />
            </div>
          </div>

          
        </div>
      </div>
    </div>
  </div>
</section>

  <div class="main">
    <div class="col-lg-3">
      <div class="card-border">
        <div>
          
          <div class="card-body2">
            <button @click="proceedToPayment" class="btn btn-success w-100 shadow-0 mb-2">Lanjutkan Pembayaran</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart';

export default {
  name: 'CheckoutView',
  setup() {
    const cartStore = useCartStore();
    const router = useRouter();
    const checkedCartItems = computed(() =>
      cartStore.cart.filter((item, index) => cartStore.checkedRows[index])
    );

    const totalQuantity = computed(() =>
      checkedCartItems.value.reduce((total, item) => total + item.jumlah, 0)
    );

    const totalPrice = computed(() =>
      checkedCartItems.value.reduce((total, item) => total + item.versi.harga * item.jumlah, 0)
    );

    const proceedToPayment = () => {
      if (checkedCartItems.value.length > 0) {
        const orderData = checkedCartItems.value.map(item => JSON.parse(JSON.stringify(item)));
        console.log('Melakukan pesanan dengan data:', orderData);
        router.push(`/pembayaran`);
      } else {
        alert('Tidak ada produk yang dipilih untuk dipesan.');
      }
    };

    return {
      checkedCartItems,
      totalQuantity,
      totalPrice,
      proceedToPayment
    };
  }
};
</script>

<style scoped>
.main {
  text-align: center;
  padding: 20px;
}
.konfirm{
  padding-bottom: 10px;
}
.checkout {
  width: 100%;
  padding-top: 20px;
  padding-left: 15px;
  padding-right: 15px;
  padding-bottom: 5px;
  border-radius: 5px;
  background-color: rgb(255, 225, 230);
}
.card-body1 {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.card-body2 {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 20px;
  padding-left: 20px;
  padding-right: 20px;
}
.opsi-jumlah{
  justify-content: center;
  text-align: center;
  border-radius: 5px;
  background-color: rgb(255, 255, 255);
}
.btn {
  width: 100%;
  padding: 5px;
  border-radius: 3px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}
</style>