// 用户工具模块 - 共享的用户相关功能
class UserUtils {
    static async getCurrentUserInfo() {
        try {
            const response = await fetch(requestUrl + '/user/info', {
                credentials: 'include'
            });
            const data = await response.json();

            if (data.code === 200) {
                return data.data;
            } else {
                console.warn('用户未登录:', data.message);
                return null;
            }
        } catch (error) {
            console.error('获取用户信息失败:', error);
            return null;
        }
    }

    static async getUserId() {
        const user = await this.getCurrentUserInfo();
        return user ? user.id : null;
    }
}