// 用户工具模块 - 共享的用户相关功能
class UserUtils {
    static async getCurrentUserInfo() {
        try {
            // 注释掉实际API调用，使用模拟数据
            // const response = await fetch(requestUrl + '/user/info', {
            //     credentials: 'include'
            // });
            // const data = await response.json();
            //
            // if (data.code === 200) {
            //     return data.data;
            // } else {
            //     console.warn('用户未登录:', data.message);
            //     return null;
            // }

            // 使用模拟数据
            const mockUserData = {
                id: 1,
                username: '测试用户',
                email: 'test@example.com',
                avatar_url: '#'
            };

            return mockUserData;
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