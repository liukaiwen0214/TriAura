// 获取当前页面的上下文路径
const contextPath = window.location.pathname.split('/')[1];
// 拼接完整的请求URL
const requestUrl = '/' + contextPath;

class IndexPage {
    constructor() {
        // 状态变量
        this.isUserPanelOpen = false;      // 用户面板是否打开
        this.isMobileMenuOpen = false;      // 移动端菜单是否打开
        this.isLoggedIn = false;            // 是否已登录

        // DOM元素引用（延迟初始化）
        this.userAvatar = null;
        this.userPanel = null;
        this.mobileMenuToggle = null;
        this.mobileSidebarClose = null;
        this.overlay = null;

        // 初始化页面（延迟到DOM加载完成后）
        this.init();
        // 添加用于存储事件监听器的引用
        this.logoutBtn = null;
        this.logoutHandler = null;
    }

    /**
     * 页面初始化方法
     */
    init() {
        // 延迟初始化DOM元素
        this.initializeDOMReferences();

        // 检查DOM元素是否可用
        if (!this.checkDOMAvailability()) {
            console.warn('DOM元素尚未完全加载，将在DOMContentLoaded后重试');
            return;
        }

        this.setupEventListeners();     // 设置事件监听器
        this.generateMobileMenu();      // 生成移动端菜单
        this.setupMobileDropdowns();    // 设置移动端下拉菜单
        this.setupTouchSupport();       // 设置触摸支持
        this.setupMobileClickOptimization(); // 设置移动端点击优化
        this.setupViewportControl();    // 设置视口控制
        this.checkLoginStatus();        // 检查登录状态
    }

    /**
     * 初始化DOM元素引用
     */
    initializeDOMReferences() {
        this.userAvatar = document.getElementById('userAvatar');     // 用户头像元素
        this.userPanel = document.getElementById('userPanel');       // 个人信息面板
        this.mobileMenuToggle = document.getElementById('mobileMenuToggle'); // 移动端菜单按钮
        this.mobileSidebarClose = document.getElementById('mobileSidebarClose'); // 移动端菜单关闭按钮
        this.overlay = document.getElementById('overlay');           // 遮罩层
    }

    /**
     * 检查DOM元素是否可用
     */
    checkDOMAvailability() {
        const requiredElements = [
            this.userAvatar,
            this.userPanel,
            this.mobileMenuToggle,
            this.mobileSidebarClose,
            this.overlay
        ];

        return requiredElements.every(element => element !== null);
    }

    setupEventListeners() {
        // 用户面板点击事件 - 作为悬浮功能的备用
        if (this.userAvatar) {
            this.userAvatar.addEventListener('click', (e) => {
                e.stopPropagation(); // 阻止事件冒泡
                if (getCurrentUserInfo() !== null) {
                    // 点击时切换面板显示状态
                    this.toggleUserPanel();
                } else {
                    // 未登录时跳转到登录页面
                    window.location.href = requestUrl;
                }
            });
        }

        // 点击外部关闭面板（用于点击打开的情况）
        document.addEventListener('click', (e) => {
            if (this.isUserPanelOpen &&
                this.userAvatar &&
                this.userPanel &&
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
        // 先移除旧的监听器（如果存在）
        if (this.logoutBtn && this.logoutHandler) {
            this.logoutBtn.removeEventListener('click', this.logoutHandler);
        }

        // 查找退出登录按钮
        this.logoutBtn = document.querySelector('.user-menu-item:last-child');
        if (this.logoutBtn) {
            // 创建新的事件处理函数并保存引用
            this.logoutHandler = (e) => {
                e.preventDefault();
                this.logout();
            };
            this.logoutBtn.addEventListener('click', this.logoutHandler);
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
        fetch(requestUrl + '/user/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(() => {
            // 移除之前的getCurrentUserInfo调用，避免重复请求
            this.isLoggedIn = false;
            this.updateUserInterface();
            this.closeUserPanel();
            this.showLogoutNotification();

            // 1s后跳转回登录页面
            setTimeout(() => {
                window.location.href = requestUrl;
            }, 1000);
        }).catch(error => {
            console.error('退出登录失败:', error);
            // 即使失败也更新UI状态，防止用户状态不一致
            this.isLoggedIn = false;
            this.updateUserInterface();
            this.closeUserPanel();
        });
    }

    /**
     * 显示退出登录通知
     */
    showLogoutNotification() {
        // 移除可能存在的旧通知
        const existingNotification = document.querySelector('.logout-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = 'logout-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <span>已成功退出登录</span>
            </div>
        `;

        document.body.appendChild(notification);

        // 3秒后自动移除通知，添加安全检查
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }

    /**
     * 清理资源方法
     */
    cleanup() {
        // 清理事件监听器
        if (this.logoutBtn && this.logoutHandler) {
            this.logoutBtn.removeEventListener('click', this.logoutHandler);
        }

        // 清理其他可能的资源
        this.logoutBtn = null;
        this.logoutHandler = null;
    }

    /**
     * 生成移动端菜单内容
     */
    generateMobileMenu() {
        const mobileNavMenu = document.getElementById('mobileNavMenu');
        if (!mobileNavMenu) {
            console.error('移动端菜单容器未找到');
            return;
        }

        // 清空现有内容
        mobileNavMenu.innerHTML = '';

        // 定义所有导航菜单项
        const menuItems = [
            {
                text: '主页',
                icon: 'fas fa-home',
                isDropdown: false,
                href: '#'
            },
            {
                text: '生活管理',
                icon: 'fas fa-life-ring',
                isDropdown: true,
                href: '#',
                children: [
                    {text: '资产', icon: 'fas fa-calendar-alt', href: '#'},
                    {text: '学习', icon: 'fas fa-tasks', href: '#'},
                    {text: '日记', icon: 'fas fa-sticky-note', href: '#'},
                    {text: '待办', icon: 'fas fa-sticky-note', href: '#'}
                ]
            },
            {
                text: '游戏管理',
                icon: 'fas fa-chart-bar',
                isDropdown: true,
                href: '#',
                children: [
                    {text: '式神录', icon: 'fas fa-calendar-alt', href: '#'},
                    {text: '式神图鉴', icon: 'fas fa-tasks', href: '#'},
                    {text: '御魂背包', icon: 'fas fa-sticky-note', href: '#'},
                    {text: '副本管理', icon: 'fas fa-sticky-note', href: '#'},
                    {text: '资源收益', icon: 'fas fa-sticky-note', href: '#'}
                ]
            },
            {
                text: '工作管理',
                icon: 'fas fa-comments',
                isDropdown: true,
                href: '#',
                children: [
                    {text: '目标看版', icon: 'fas fa-calendar-alt', href: '#'},
                    {text: '执行中心', icon: 'fas fa-tasks', href: '#'},
                    {text: '会议档案', icon: 'fas fa-sticky-note', href: '#'},
                    {text: '复盘', icon: 'fas fa-sticky-note', href: '#'}
                ]
            },
            {
                text: '设置',
                icon: 'fas fa-cog',
                isDropdown: false,
                href: '#'
            }
        ];

        // 遍历菜单项生成HTML
        for (let i = 0; i < menuItems.length; i++) {
            const item = menuItems[i];
            const mobileItem = document.createElement('div');
            mobileItem.className = 'mobile-nav-item';

            if (item.isDropdown) {
                // 创建下拉菜单项
                const dropdownHTML =
                    '<a href="' + item.href + '" class="mobile-nav-link mobile-dropdown-toggle" data-index="' + i + '">' +
                    '    <i class="' + item.icon + '"></i>' +
                    '    <span>' + item.text + '</span>' +
                    '    <i class="fas fa-chevron-down mobile-dropdown-icon" style="margin-left: auto;"></i>' +
                    '</a>' +
                    '<div class="mobile-dropdown-menu" id="mobile-dropdown-' + i + '">' +
                    '</div>';
                mobileItem.innerHTML = dropdownHTML;
            } else {
                // 创建普通菜单项
                const linkHTML =
                    '<a href="' + item.href + '" class="mobile-nav-link">' +
                    '    <i class="' + item.icon + '"></i>' +
                    '    <span>' + item.text + '</span>' +
                    '</a>';
                mobileItem.innerHTML = linkHTML;
            }

            // 添加到菜单容器
            mobileNavMenu.appendChild(mobileItem);

            // 如果是下拉菜单，添加子菜单项
            if (item.isDropdown && item.children) {
                const mobileDropdown = document.getElementById('mobile-dropdown-' + i);
                if (mobileDropdown) {
                    for (let j = 0; j < item.children.length; j++) {
                        const child = item.children[j];
                        const childLink = document.createElement('a');
                        childLink.className = 'mobile-dropdown-item';
                        childLink.href = child.href;
                        childLink.innerHTML =
                            '<i class="' + child.icon + '"></i>' +
                            '<span>' + child.text + '</span>';
                        mobileDropdown.appendChild(childLink);
                    }
                }
            }
        }
    }

    /**
     * 设置移动端下拉菜单交互
     */
    setupMobileDropdowns() {
        const dropdownToggles = document.querySelectorAll('.mobile-dropdown-toggle');

        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                const index = toggle.getAttribute('data-index');
                const dropdownMenu = document.getElementById('mobile-dropdown-' + index);

                // 关闭其他打开的下拉菜单
                this.closeAllMobileDropdowns();

                // 切换当前下拉菜单
                if (dropdownMenu) {
                    const isOpen = dropdownMenu.classList.contains('show');
                    if (!isOpen) {
                        dropdownMenu.classList.add('show');
                        toggle.querySelector('.mobile-dropdown-icon').classList.replace('fa-chevron-down', 'fa-chevron-up');
                    } else {
                        dropdownMenu.classList.remove('show');
                        toggle.querySelector('.mobile-dropdown-icon').classList.replace('fa-chevron-up', 'fa-chevron-down');
                    }
                }
            });
        });
    }

    /**
     * 关闭所有移动端下拉菜单
     */
    closeAllMobileDropdowns() {
        const dropdownMenus = document.querySelectorAll('.mobile-dropdown-menu');
        const dropdownIcons = document.querySelectorAll('.mobile-dropdown-icon');

        dropdownMenus.forEach(menu => {
            menu.classList.remove('show');
        });

        dropdownIcons.forEach(icon => {
            if (icon.classList.contains('fa-chevron-up')) {
                icon.classList.replace('fa-chevron-up', 'fa-chevron-down');
            }
        });
    }

    /**
     * 切换移动端菜单显示状态
     */
    toggleMobileMenu() {
        if (this.isMobileMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    /**
     * 打开移动端菜单
     */
    openMobileMenu() {
        const mobileSidebar = document.getElementById('mobileSidebar');
        if (mobileSidebar) {
            mobileSidebar.classList.add('show');
            this.isMobileMenuOpen = true;

            // 显示遮罩层
            if (this.overlay) {
                this.overlay.classList.add('show');
            }

            // 关闭用户面板
            this.closeUserPanel();
        }
    }

    /**
     * 关闭移动端菜单
     */
    closeMobileMenu() {
        const mobileSidebar = document.getElementById('mobileSidebar');
        if (mobileSidebar) {
            mobileSidebar.classList.remove('show');
            this.isMobileMenuOpen = false;

            // 隐藏遮罩层（如果没有其他面板打开）
            if (this.overlay && !this.isUserPanelOpen) {
                this.overlay.classList.remove('show');
            }

            // 关闭所有下拉菜单
            this.closeAllMobileDropdowns();
        }
    }

    /**
     * 添加触摸滑动支持
     */
    setupTouchSupport() {
        let startX = 0;
        let currentX = 0;
        const swipeThreshold = 50;

        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        document.addEventListener('touchmove', (e) => {
            currentX = e.touches[0].clientX;
        });

        document.addEventListener('touchend', (e) => {
            const diffX = startX - currentX;

            // 从右侧向左滑动打开菜单
            if (diffX > swipeThreshold && startX > window.innerWidth - 100) {
                this.openMobileMenu();
            }

            // 从左侧向右滑动关闭菜单
            if (diffX < -swipeThreshold && startX < 100 && this.isMobileMenuOpen) {
                this.closeMobileMenu();
            }
        });
    }

    /**
     * 优化移动端点击体验
     */
    setupMobileClickOptimization() {
        // 为移动端链接添加点击优化
        const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-dropdown-item');

        mobileLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // 防止快速连续点击
                if (link.classList.contains('clicked')) {
                    e.preventDefault();
                    return;
                }

                link.classList.add('clicked');
                setTimeout(() => {
                    link.classList.remove('clicked');
                }, 300);

                // 如果是普通链接，关闭菜单
                if (!link.classList.contains('mobile-dropdown-toggle')) {
                    this.closeMobileMenu();
                }
            });
        });
    }

    /**
     * 设置视口控制，防止缩放
     */
    setupViewportControl() {
        // 添加视口meta标签（如果不存在）
        let viewportMeta = document.querySelector('meta[name="viewport"]');
        if (!viewportMeta) {
            viewportMeta = document.createElement('meta');
            viewportMeta.name = 'viewport';
            document.head.appendChild(viewportMeta);
        }

        viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
    }

    /**
     * 优化移动端性能
     */
    optimizeMobilePerformance() {
        // 延迟加载非关键资源
        this.lazyLoadResources();

        // 优化图片加载
        this.optimizeImages();

        // 减少重绘和重排
        this.minimizeRepaints();
    }

    /**
     * 延迟加载非关键资源
     */
    lazyLoadResources() {
        // 使用Intersection Observer实现懒加载
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const src = img.getAttribute('data-src');
                        if (src) {
                            img.src = src;
                            img.removeAttribute('data-src');
                        }
                        observer.unobserve(img);
                    }
                });
            });

            // 观察所有需要懒加载的图片
            const lazyImages = document.querySelectorAll('img[data-src]');
            lazyImages.forEach(img => observer.observe(img));
        }
    }

    /**
     * 优化图片加载
     */
    optimizeImages() {
        // 根据设备像素比选择合适的图片
        const dpr = window.devicePixelRatio || 1;
        const images = document.querySelectorAll('img');

        images.forEach(img => {
            if (dpr > 1) {
                // 高DPI设备使用更高分辨率的图片
                const currentSrc = img.src;
                if (currentSrc && !currentSrc.includes('@2x') && !currentSrc.includes('@3x')) {
                    // 这里可以添加高分辨率图片的逻辑
                }
            }
        });
    }

    /**
     * 减少重绘和重排
     */
    minimizeRepaints() {
        // 使用requestAnimationFrame优化动画
        let ticking = false;

        const update = () => {
            // 执行需要优化的操作
            ticking = false;
        };

        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(update);
                ticking = true;
            }
        };

        // 监听需要优化的操作
        window.addEventListener('scroll', requestTick);
        window.addEventListener('resize', requestTick);
    }
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function () {
    // 显示毛玻璃罩子效果
    showLoadingOverlay();

    // 初始化主页面
    const indexPage = new IndexPage();
    // 获取当前登录用户信息
    getCurrentUserInfo();

    // 2秒后隐藏罩子，显示页面内容
    setTimeout(() => {
        hideLoadingOverlay();
    }, 500);
});

// 显示毛玻璃罩子
function showLoadingOverlay() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    const mainContent = document.querySelector('.main-content');

    if (loadingOverlay) {
        loadingOverlay.classList.remove('hidden');
    }

    if (mainContent) {
        mainContent.classList.remove('visible');
    }
}

// 隐藏毛玻璃罩子
function hideLoadingOverlay() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    const mainContent = document.querySelector('.main-content');

    if (loadingOverlay) {
        loadingOverlay.classList.add('hidden');
    }

    if (mainContent) {
        mainContent.classList.add('visible');
    }
}


// 获取当前登录用户信息
async function getCurrentUserInfo() {
    // 实现应该包含缓存机制，避免频繁请求
    // 例如使用防抖或节流处理
    // 这里仅提供框架
    if (window._lastUserInfoRequest && Date.now() - window._lastUserInfoRequest < 500) {
        return; // 避免短时间内重复请求
    }

    window._lastUserInfoRequest = Date.now();
    try {
        const response = await fetch(requestUrl + '/user/info');
        const data = await response.json();
        if (data.code === 200) {
            const user = data.data;
            // 更新页面上的用户信息
            updateUserInfo(user);
            return user;
        } else {
            console.log('用户未登录:', data.message);
            // 跳转到登录页面
            window.location.href = requestUrl;
            return null;
        }
    } catch (error) {
        console.error('获取用户信息失败:', error);
        return null;
    }
}

// 更新页面上的用户信息
function updateUserInfo(user) {
    // 更新导航栏用户信息
    const userAvatar = document.getElementById('userAvatar');
    const userName = document.querySelector('.user-name');
    const userPanel = document.getElementById('userPanel');
    if (userAvatar) {
        // 设置用户头像（如果有的话）
        userAvatar.querySelector('img').src = user.avatar_url;
        userPanel.querySelector('img').src = user.avatar_url;
    }

    if (userName) {
        userName.textContent = user.username || user.email;
    }

    // 更新用户面板信息
    const panelUserName = document.querySelector('.user-info h3');
    const panelUserEmail = document.querySelector('.user-info p');

    if (panelUserName) {
        panelUserName.textContent = user.username;
        panelUserName.className = 'logged-in';
    }

    if (panelUserEmail) {
        panelUserEmail.textContent = user.email;
    }
}

// 显示成功提示信息
function showSuccessMessage(message, duration = 3000) {
    // 移除相同类型的旧通知
    const existingNotifications = document.querySelectorAll('.success-notification');
    existingNotifications.forEach(notification => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    });

    const successDiv = document.createElement('div');
    successDiv.className = 'success-notification';
    successDiv.innerHTML = `
        <div style="
            position: fixed;
            top: 80px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9999;
            animation: slideInRight 0.3s ease-out;
        ">
            <i class="fas fa-check-circle"></i> ${message}
        </div>
    `;

    document.body.appendChild(successDiv);

    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.parentNode.removeChild(successDiv);
        }
    }, duration);
}

// 检查URL参数，显示相应的成功信息
function checkSuccessMessage() {
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action');
    const message = urlParams.get('message');

    if (action && message) {
        showSuccessMessage(message);

        // 清除URL参数（可选）
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
    }
}

//获取跳转URL并跳转
// 给父元素绑定事件（事件委托）
const DataUrl = document.querySelectorAll('.dropdown-menu');
DataUrl.forEach(menu => {
    menu.addEventListener('click', function (e) {
        // 判断点击的目标是否是 .dropdown-item 元素
        const targetItem = e.target.closest('.dropdown-item');
        console.info(targetItem);
        if (targetItem) {
            e.preventDefault(); // 阻止默认行为
            const Dataurl = targetItem.getAttribute('data-url');
            console.info(requestUrl+Dataurl);
            window.location.href = requestUrl + Dataurl;
        }
    });
});
const homeJumpUrl = document.querySelector('.nav-link').getAttribute('data-jumpUrl');
document.querySelector('.nav-link').addEventListener('click', function (e) {
    e.preventDefault();
    window.location.href = requestUrl+homeJumpUrl;
});

