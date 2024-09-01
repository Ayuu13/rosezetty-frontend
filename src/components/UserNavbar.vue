<template>
	<div class="main">
		<button class="icon" @click="toggleResponsive">☰</button>
		<router-link to="/" class="logo">
			<img src="/rosezzty1.jpg" alt="Rosezzty Logo" class="logo-img" />
		</router-link>

		<div class="nav-bar" :class="{ responsive: isResponsive }">
			<router-link to="/produk" class="nav-link">Produk</router-link>
			<router-link to="/riwayat-pesanan" class="nav-link">Pesanan</router-link>
			<router-link to="/keranjang" class="nav-link">
				<svg-icon type="mdi" :path="path" :size="iconSize"></svg-icon
			></router-link>

			<div class="dropdown">
				<div v-show="isDropdownOpen" class="dropdown-content">
					<router-link @click="closeDropdown" to="/produk">Produk</router-link>
					<router-link @click="closeDropdown" to="/riwayat-pesanan">Pesanan</router-link>
					<router-link @click="closeDropdown" to="/keranjang">
						<svg-icon type="mdi" :path="path" :size="iconSize"></svg-icon
					></router-link>
				</div>
			</div>
		</div>
		<div v-if="isAuthenticated" class="login">
			<div class="user-info">
				<div>{{ userName }}</div>
				<button class="icon-dropdown" @click="toggleDropdown">v</button>
				<div v-if="isLogoutDropdownOpen" class="dropdown-logout">
					<button class="icon2" @click="handleProfil">Profile</button>
					<button class="icon3" @click="handleLogout">Logout</button>
				</div>
			</div>
		</div>
		<router-link v-else to="/masuk" class="login">Login</router-link>
	</div>
</template>

<script>
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiCartOutline } from '@mdi/js';
import { mapGetters, mapActions } from 'vuex';

export default {
	name: 'Navbar',
	components: { SvgIcon },
	data() {
		return {
			path: mdiCartOutline,
			iconSize: 20,
			isResponsive: false,
			isDropdownOpen: true,
			isLogoutDropdownOpen: false,
		};
	},
	computed: {
		...mapGetters(['isAuthenticated', 'userName', 'userId']),
	},
	methods: {
		...mapActions(['logout']),
		toggleResponsive() {
			this.isResponsive = !this.isResponsive;
			if (!this.isResponsive) {
				this.isDropdownOpen = true;
			}
		},
		closeDropdown() {
			this.isDropdownOpen = false;
		},
		toggleDropdown() {
			this.isLogoutDropdownOpen = !this.isLogoutDropdownOpen;
		},
		async handleProfil() {
			this.isLogoutDropdownOpen = false;
			this.$router.push(`/profil-akun/${this.userId}`);
		},
		async handleLogout() {
			this.isLogoutDropdownOpen = false;
			await this.logout();
			this.$router.push('/masuk');
			location.reload();
		},
	},
};
</script>

<style scoped>
.main {
	display: flex;
	justify-content: space-between;
	align-items: center;
	background-color: rgb(255, 225, 230);
	padding-left: 50px;
	padding-right: 50px;
	height: 55px;
}
.logo,
.login {
	text-decoration: none;
	color: rgb(187, 0, 112);
}
.logo-img {
	padding-top: 7px;
	max-height: 50px;
	width: auto;
}

.nav-bar {
	display: flex;
	align-items: center;
	justify-content: center;
}
.nav-link {
	padding: 0px 20px;
	text-decoration: none;
	color: black;
	display: flex;
	align-items: center;
	justify-content: center;
}
.dropdown {
	display: none;
}
.icon {
	display: none;
}
.user-info {
	display: flex;
	align-items: center;
	justify-content: center;
}
.icon-dropdown {
	font-size: 20px;
	justify-content: center;
	margin-left: 10px;
	cursor: pointer;
	color: #000000;
}
.dropdown-logout {
	position: absolute;
	background-color: #f9f9f9;
	top: 50px;
}
.icon2 {
	padding: 0px 22px;
	text-decoration: none;
	color: black;
	display: flex;
	font-size: 20px;
	border: 1px solid #ccc;
}
.icon3 {
	padding: 0px 20px;
	color: rgb(255, 0, 0);
	display: flex;
	font-size: 20px;
	border: 1px solid #ccc;
}
@media screen and (max-width: 768px) {
	.main {
		padding-left: 20px;
		padding-right: 20px;
	}
	.nav-bar {
		flex: 1;
	}
	.logo {
		padding-left: 20px;
	}
	.login {
		padding-right: 20px;
	}
	.nav-link {
		display: none;
	}
	.icon {
		display: block;
		font-size: 20px;
		cursor: pointer;
	}
	.icon :hover {
		border: #000000;
		border-color: #f9f9f9;
		border-radius: 1px;
	}

	.responsive .dropdown-content {
		display: block;
	}
	.responsive .dropdown {
		position: static;
		padding-top: 55px;
	}

	.dropdown {
		position: relative;
		display: inline-block;
	}

	.dropdown-content {
		display: none;
		position: absolute;
		background-color: #f9f9f9;
		min-width: 160px;
		z-index: 1;
		left: 0;
	}

	.dropdown-content a {
		color: black;
		padding: 12px 16px;
		text-decoration: none;
		display: block;
	}
	.dropdown-content a:hover {
		background-color: rgb(255, 225, 230);
	}
}
</style>
