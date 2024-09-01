import { createRouter, createWebHistory } from 'vue-router';

import AkunView from '../views/AkunView.vue';
import BerandaAdminView from '../views/admin/BerandaView.vue';
import BerandaView from '../views/BerandaView.vue';
import CheckoutView from '../views/CheckoutView.vue';
import EditMetodeBayarAdminView from '../views/admin/EditMetodeBayarView.vue';
import EditProdukAdminView from '../views/admin/EditProdukAdminView.vue';
import EditVarianProAdminView from '../views/admin/EditVarianProAdminView.vue';
import KeranjangView from '../views/KeranjangView.vue';
import LoginView from '../views/LoginView.vue';
import PelangganAdminView from '../views/admin/PelangganView.vue';
import PelangganDetailAdminView from '../views/admin/PelangganDetailView.vue';
import PemasukanAdminView from '../views/admin/PemasukanView.vue';
import PesananAdminView from '../views/admin/PesananView.vue';
import PesananDetailAdminView from '../views/admin/PesananDetailView.vue';
import PesananDetailView from '../views/PesananDetailView.vue';
import PesananView from '../views/PesananView.vue';
import ProdukAdminView from '../views/admin/ProdukView.vue';
import ProdukDetailAdminView from '../views/admin/ProdukDetailView.vue';
import ProdukDetailView from '../views/ProdukDetailView.vue';
import ProdukView from '../views/ProdukView.vue';
import RegisterView from '../views/RegisterView.vue';
import TambahMetodeBayarAdminView from '../views/admin/TambahMetodeBayarView.vue';
import TambahProdukAdminView from '../views/admin/TambahProdukAdminView.vue';
import TambahVarianProdukAdminView from '../views/admin/TambahVarianProdukAdminView.vue';
import TestimoniEditView from '../views/TestimoniEditView.vue';
import TestimoniTambahView from '../views/TestimoniTambahView.vue';
import TestimoniView from '../views/TestimoniView.vue';
import VarianProdukView from '../views/VarianProdukView.vue';

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{ path: '', component: BerandaView },

		{ path: '/masuk', component: LoginView },
		{ path: '/profil-akun/:id', component: AkunView },
		{ path: '/register', component: RegisterView },
		{
			path: '/logout',
			beforeEnter: (to, from, next) => {
				store.dispatch('logout').then(() => {
					next('/masuk');
				});
			},
		},

		{ path: '/produk', component: ProdukView },
		{ path: '/varian-produk/:id', component: VarianProdukView },
		{ path: '/produk-detail/:id', component: ProdukDetailView },
		{ path: '/riwayat-pesanan', component: PesananView },
		{ path: '/pesanan-detail/:id', component: PesananDetailView },
		{ path: '/testimoni', component: TestimoniView },
		{ path: '/testimoni-edit/:id', component: TestimoniEditView },
		{ path: '/testimoni/tambah', component: TestimoniTambahView },
		{ path: '/keranjang', component: KeranjangView },
		{ path: '/pesanan', component: CheckoutView },

		{ path: '/admin', component: BerandaAdminView },
		{ path: '/admin/produk', component: ProdukAdminView },
		{ path: '/admin/produk/tambah', component: TambahProdukAdminView },
		{ path: '/admin/produk/edit/:id', component: EditProdukAdminView },
		{ path: '/admin/produk-detail/:produk_id', component: ProdukDetailAdminView },
		{ path: '/admin/produk-varian/:id/tambah', component: TambahVarianProdukAdminView },
		{ path: '/admin/produk-varian/edit/:id', component: EditVarianProAdminView },

		{ path: '/admin/pesanan', component: PesananAdminView },
		{ path: '/admin/pesanan/:id', component: PesananDetailAdminView },
		// { path: '/admin/pesanan/:id', component: PesananDetailAdminView },
		{ path: '/admin/pemasukan', component: PemasukanAdminView },
		{ path: '/admin/metode-bayar/tambah', component: TambahMetodeBayarAdminView },
		{ path: '/admin/metode-bayar/edit/:id', component: EditMetodeBayarAdminView },
		{ path: '/admin/pelanggan', component: PelangganAdminView },
		{ path: '/admin/pelanggan/:id', component: PelangganDetailAdminView },
	],
});

export default router;
