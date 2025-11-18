/* ==============================================
   主页交互逻辑 - 个人信息悬浮功能修复版
   ============================================== */

class IndexPage {
    constructor() {
        // DOM元素引用
        this.userAvatar = document.getElementById('userAvatar');     // 用户头像元素
        this.userPanel = document.getElementById('userPanel');       // 个人信息面板
        this.mobileMenuToggle = document.getElementById('mobileMenuToggle'); // 移动端菜单按钮
        this.mobileSidebar = document.getElementById('mobileSidebar'); // 移动端侧边菜单
        this.mobileSidebarClose = document.getElementById('mobileSidebarClose'); // 移动端菜单关闭按钮
        this.overlay = document.getElementById('overlay');           // 遮罩层
        this.mobileNavMenu = document.querySelector('.mobile-nav-menu'); // 移动端导航菜单

        // 状态变量
        this.isUserPanelOpen = false;      // 用户面板是否打开
        this.isMobileMenuOpen = false;      // 移动端菜单是否打开
        this.isMobileDropdownOpen = false;  // 移动端下拉菜单是否打开
        
        // 用户状态相关属性
        this.currentUser = null;            // 当前用户信息
        this.isLoggedIn = false;            // 是否已登录

        // 初始化页面
        this.init();
    }

    /**
     * 页面初始化方法
     */
    init() {
        this.setupEventListeners();     // 设置事件监听器
        this.generateMobileMenu();      // 生成移动端菜单
        this.setupMobileDropdowns();    // 设置移动端下拉菜单
        this.checkLoginStatus();        // 检查登录状态
    }

    /**
     * 设置事件监听器
     */
    setupEventListeners() {
        // 用户面板点击事件 - 作为悬浮功能的备用
        if (this.userAvatar) {
            this.userAvatar.addEventListener('click', (e) => {
                e.stopPropagation(); // 阻止事件冒泡
                if (this.isLoggedIn) {
                    // 点击时切换面板显示状态
                    this.toggleUserPanel();
                } else {
                    // 未登录时跳转到登录页面
                    window.location.href = '/user/login';
                }
            });
        }

        // 点击外部关闭面板（用于点击打开的情况）
        document.addEventListener('click', (e) => {
            if (this.isUserPanelOpen && 
                !this.userAvatar.contains(e.target) && 
                !this.userPanel.contains(e.target)) {
                this.closeUserPanel();
            }
        });

        // ESC键关闭面板
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isUserPanelOpen) {
                this.closeUserPanel();
            }
        });

        // 为退出登录按钮添加事件监听
        this.setupLogoutListener();

        // 移动端菜单相关事件监听器
        if (this.mobileMenuToggle) {
            this.mobileMenuToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }

        if (this.mobileSidebarClose) {
            this.mobileSidebarClose.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        }

        // 窗口大小变化时重新生成移动端菜单
        window.addEventListener('resize', () => {
            this.generateMobileMenu();
        });
    }

    /**
     * 打开用户面板（点击时使用）
     */
    openUserPanel() {
        if (this.userPanel && this.isLoggedIn) {
            // 添加show类显示面板
            this.userPanel.classList.add('show');
            this.isUserPanelOpen = true;
            
            // 显示遮罩层
            if (this.overlay) {
                this.overlay.classList.add('show');
            }
            
            // 关闭移动端菜单和下拉菜单
            this.closeMobileMenu();
            this.closeAllMobileDropdowns();
        }
    }

    /**
     * 关闭用户面板
     */
    closeUserPanel() {
        if (this.userPanel) {
            // 移除show类隐藏面板
            this.userPanel.classList.remove('show');
            this.isUserPanelOpen = false;
            
            // 隐藏遮罩层（如果没有其他面板打开）
            if (this.overlay && !this.isMobileMenuOpen) {
                this.overlay.classList.remove('show');
            }
        }
    }

    /**
     * 切换用户面板显示状态
     */
    toggleUserPanel() {
        if (this.isUserPanelOpen) {
            this.closeUserPanel();
        } else {
            this.openUserPanel();
        }
    }

    /**
     * 设置退出登录按钮事件监听
     */
    setupLogoutListener() {
        // 查找退出登录按钮
        const logoutBtn = document.querySelector('.user-menu-item:last-child');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }
    }

    /**
     * 检查用户登录状态
     */
    checkLoginStatus() {
        // 模拟登录状态检查
        // 实际项目中应该从服务器获取登录状态
        this.isLoggedIn = false; // 默认未登录
        this.updateUserInterface();
    }

    /**
     * 更新用户界面根据登录状态
     */
    updateUserInterface() {
        if (this.isLoggedIn) {
            // 已登录状态
            this.updateLoggedInUI();
        } else {
            // 未登录状态
            this.updateLoggedOutUI();
        }
    }

    /**
     * 更新已登录状态的UI
     */
    updateLoggedInUI() {
        // 更新用户信息显示
        const userNameElement = document.querySelector('.user-name');
        const userInfoName = document.querySelector('.user-info h3');
        
        if (userNameElement) userNameElement.textContent = '已登录用户';
        if (userInfoName) userInfoName.textContent = '已登录用户';
    }

    /**
     * 更新未登录状态的UI
     */
    updateLoggedOutUI() {
        // 更新用户信息显示
        const userNameElement = document.querySelector('.user-name');
        const userInfoName = document.querySelector('.user-info h3');
        const userInfoDesc = document.querySelector('.user-info p');
        
        if (userNameElement) userNameElement.textContent = '未登录';
        if (userInfoName) userInfoName.textContent = '未登录用户';
        if (userInfoDesc) userInfoDesc.textContent = '请先登录';
    }

    /**
     * 退出登录功能
     */
    logout() {
        // 模拟退出登录
        this.isLoggedIn = false;
        this.currentUser = null;
        this.updateUserInterface();
        this.closeUserPanel();
        
        // 显示退出登录通知
        this.showLogoutNotification();
    }

    /**
     * 显示退出登录通知
     */
    showLogoutNotification() {
        const notification = document.createElement('div');
        notification.className = 'logout-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <span>已成功退出登录</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // 3秒后自动移除通知
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // 以下为移动端菜单相关方法（保持不变）
    generateMobileMenu() {
        // 生成移动端菜单逻辑
    }

    setupMobileDropdowns() {
        // 设置移动端下拉菜单逻辑
    }

    toggleMobileMenu() {
        // 切换移动端菜单显示状态
    }

    closeMobileMenu() {
        // 关闭移动端菜单
    }

    closeAllMobileDropdowns() {
        // 关闭所有移动端下拉菜单
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    window.indexPage = new IndexPage();
});