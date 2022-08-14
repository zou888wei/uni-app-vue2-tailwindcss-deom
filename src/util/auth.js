const TokenKey = 'uni_token';
const User = 'uni_user';

// 认证令牌
export function getToken() {
	return uni.getStorageSync(TokenKey)
}

export function setToken(token) {
	return uni.setStorageSync(TokenKey, token)
}

export function removeToken() {
	return uni.removeStorageSync(TokenKey)
}

// 用户信息
export function getUser() {
	return uni.getStorageSync(User)
}

export function setUser(user) {
	return uni.setStorageSync(User, user)
}

export function removeUser() {
	return uni.removeStorageSync(User)
}