/* 主页交互逻辑 */

class IndexPage {
    constructor() {
        this.userAvatar = document.getElementById('userAvatar');
        this.userPanel = document.getElementById('userPanel');
        this.mobileMenuToggle = document.getElementById('mobileMenuToggle');
        this.mobileSidebar = document.getElementById('mobileSidebar');
        this.mobileSidebarClose = document.getElementById('mobileSidebarClose');
        this.overlay = document.getElementById('overlay');
        this.mobileNavMenu = document.querySelector('.mobile-nav-menu');

        this.isUserPanelOpen = false;
        this.isMobileMenuOpen = false;
        this.isMobileDropdownOpen = false;
        
        // 用户状态相关属性
        this.currentUser = null;
        this.isLoggedIn = false;
        this.init();
    }

    init() {

    }
}


// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    window.indexPage = new IndexPage();
});