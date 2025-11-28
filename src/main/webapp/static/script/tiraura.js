// 基础路径配置模块：配置系统基础路径信息
const contextPath = window.location.pathname.split('/')[1];
const requestUrl = '/' + contextPath;

// IndexPage类：页面核心控制类，管理页面交互与状态
class IndexPage {
    /**
     * 构造函数：初始化状态变量与DOM引用
     */
    constructor() {
        // 状态变量：管理页面交互状态
        this.isUserPanelOpen = false;      // 用户面板显示状态
        this.isMobileMenuOpen = false;     // 移动端菜单显示状态
        this.isLoggedIn = false;           // 用户登录状态

        // DOM元素引用：延迟初始化
        this.userAvatar = null;
        this.userPanel = null;
        this.mobileMenuToggle = null;
        this.mobileSidebarClose = null;
        this.overlay = null;

        this.init(); // 初始化页面

        // 事件监听器存储
        this.logoutBtn = null;
        this.logoutHandler = null;
    }

    /**
     * 初始化方法：协调页面初始化流程
     */
    init() {
        this.initializeDOMReferences(); // 初始化DOM元素引用

        // 检查DOM元素可用性，确保初始化环境就绪
        if (!this.checkDOMAvailability()) {
            console.warn('DOM元素尚未完全加载，将在DOMContentLoaded后重试');
            return;
        }

        // 执行各项初始化操作
        this.setupEventListeners();
        this.generateMobileMenu();
        this.setupMobileDropdowns();
        this.setupTouchSupport();
        this.setupMobileClickOptimization();
        this.setupViewportControl();
        this.checkLoginStatus();
    }

    /**
     * DOM元素初始化：获取页面关键DOM元素引用
     */
    initializeDOMReferences() {
        this.userAvatar = document.getElementById('userAvatar');
        this.userPanel = document.getElementById('userPanel');
        this.mobileMenuToggle = document.getElementById('mobileMenuToggle');
        this.mobileSidebarClose = document.getElementById('mobileSidebarClose');
        this.overlay = document.getElementById('overlay');
    }

    /**
     * DOM可用性检查：验证关键DOM元素是否加载完成
     * @returns {boolean} 所有必要元素是否都已加载
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

    /**
     * 事件监听器设置：绑定页面各类交互事件
     */
    setupEventListeners() {
        // 用户头像点击事件：控制用户面板显示/跳转登录
        if (this.userAvatar) {
            this.userAvatar.addEventListener('click', (e) => {
                e.stopPropagation();
                if (getCurrentUserInfo() !== null) {
                    this.toggleUserPanel();
                } else {
                    window.location.href = requestUrl;
                }
            });
        }

        // 点击外部关闭用户面板
        document.addEventListener('click', (e) => {
            if (this.isUserPanelOpen &&
                this.userAvatar &&
                this.userPanel &&
                !this.userAvatar.contains(e.target) &&
                !this.userPanel.contains(e.target)) {
                this.closeUserPanel();
            }
        });

        // ESC键关闭用户面板
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isUserPanelOpen) {
                this.closeUserPanel();
            }
        });

        this.setupLogoutListener(); // 绑定退出登录事件

        // 移动端菜单开关事件
        if (this.mobileMenuToggle) {
            this.mobileMenuToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }

        // 移动端菜单关闭按钮事件
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
     * 用户面板控制：打开用户面板
     */
    openUserPanel() {
        if (this.userPanel && this.isLoggedIn) {
            this.userPanel.classList.add('show');
            this.isUserPanelOpen = true;

            // 显示遮罩层
            if (this.overlay) {
                this.overlay.classList.add('show');
            }

            // 关闭其他面板
            this.closeMobileMenu();
            this.closeAllMobileDropdowns();
        }
    }

    /**
     * 用户面板控制：关闭用户面板
     */
    closeUserPanel() {
        if (this.userPanel) {
            this.userPanel.classList.remove('show');
            this.isUserPanelOpen = false;

            // 当移动端菜单未打开时隐藏遮罩层
            if (this.overlay && !this.isMobileMenuOpen) {
                this.overlay.classList.remove('show');
            }
        }
    }

    /**
     * 用户面板控制：切换用户面板显示状态
     */
    toggleUserPanel() {
        if (this.isUserPanelOpen) {
            this.closeUserPanel();
        } else {
            this.openUserPanel();
        }
    }

    /**
     * 退出登录事件绑定：处理退出登录按钮交互
     */
    setupLogoutListener() {
        // 移除旧监听器防止重复绑定
        if (this.logoutBtn && this.logoutHandler) {
            this.logoutBtn.removeEventListener('click', this.logoutHandler);
        }

        // 绑定新的退出登录事件
        this.logoutBtn = document.querySelector('.user-menu-item:last-child');
        if (this.logoutBtn) {
            this.logoutHandler = (e) => {
                e.preventDefault();
                this.logout();
            };
            this.logoutBtn.addEventListener('click', this.logoutHandler);
        }
    }

    /**
     * 登录状态检查：初始化用户登录状态
     */
    checkLoginStatus() {
        this.isLoggedIn = false; // 默认未登录
        this.updateUserInterface();
    }

    /**
     * 界面更新控制：根据登录状态更新UI
     */
    updateUserInterface() {
        if (this.isLoggedIn) {
            this.updateLoggedInUI();
        } else {
            this.updateLoggedOutUI();
        }
    }

    /**
     * 界面更新控制：更新已登录状态UI
     */
    updateLoggedInUI() {
        const userNameElement = document.querySelector('.user-name');
        const userInfoName = document.querySelector('.user-info h3');

        if (userNameElement) userNameElement.textContent = '已登录用户';
        if (userInfoName) userInfoName.textContent = '已登录用户';
    }

    /**
     * 界面更新控制：更新未登录状态UI
     */
    updateLoggedOutUI() {
        const userNameElement = document.querySelector('.user-name');
        const userInfoName = document.querySelector('.user-info h3');
        const userInfoDesc = document.querySelector('.user-info p');

        if (userNameElement) userNameElement.textContent = '未登录';
        if (userInfoName) userInfoName.textContent = '未登录用户';
        if (userInfoDesc) userInfoDesc.textContent = '请先登录';
    }

    /**
     * 退出登录功能：处理退出登录逻辑
     */
    logout() {
        fetch(requestUrl + '/user/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(() => {
            this.isLoggedIn = false;
            this.updateUserInterface();
            this.closeUserPanel();
            this.showLogoutNotification();

            // 延迟跳转登录页
            setTimeout(() => {
                window.location.href = requestUrl;
            }, 1000);
        }).catch(error => {
            console.error('退出登录失败:', error);
            this.isLoggedIn = false;
            this.updateUserInterface();
            this.closeUserPanel();
        });
    }

    /**
     * 退出通知：显示退出成功提示
     */
    showLogoutNotification() {
        // 移除旧通知
        const existingNotification = document.querySelector('.logout-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // 创建新通知
        const notification = document.createElement('div');
        notification.className = 'logout-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <span>已成功退出登录</span>
            </div>
        `;

        document.body.appendChild(notification);

        // 自动移除通知
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }

    /**
     * 资源清理：释放事件监听器与资源引用
     */
    cleanup() {
        if (this.logoutBtn && this.logoutHandler) {
            this.logoutBtn.removeEventListener('click', this.logoutHandler);
        }

        this.logoutBtn = null;
        this.logoutHandler = null;
    }

    /**
     * 移动端菜单生成：动态创建移动端菜单内容
     */
    generateMobileMenu() {
        const mobileNavMenu = document.getElementById('mobileNavMenu');
        if (!mobileNavMenu) {
            console.error('移动端菜单容器未找到');
            return;
        }

        mobileNavMenu.innerHTML = ''; // 清空现有内容

        // 菜单配置数据
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

        // 生成菜单HTML
        for (let i = 0; i < menuItems.length; i++) {
            const item = menuItems[i];
            const mobileItem = document.createElement('div');
            mobileItem.className = 'mobile-nav-item';

            if (item.isDropdown) {
                // 生成下拉菜单项
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
                // 生成普通菜单项
                const linkHTML =
                    '<a href="' + item.href + '" class="mobile-nav-link">' +
                    '    <i class="' + item.icon + '"></i>' +
                    '    <span>' + item.text + '</span>' +
                    '</a>';
                mobileItem.innerHTML = linkHTML;
            }

            mobileNavMenu.appendChild(mobileItem);

            // 添加子菜单
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
     * 移动端下拉菜单设置：绑定下拉交互事件
     */
    setupMobileDropdowns() {
        const dropdownToggles = document.querySelectorAll('.mobile-dropdown-toggle');

        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                const index = toggle.getAttribute('data-index');
                const dropdownMenu = document.getElementById('mobile-dropdown-' + index);

                this.closeAllMobileDropdowns(); // 关闭其他下拉菜单

                // 切换当前下拉菜单状态
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
     * 移动端下拉菜单控制：关闭所有打开的下拉菜单
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
     * 移动端菜单控制：切换菜单显示状态
     */
    toggleMobileMenu() {
        if (this.isMobileMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    /**
     * 移动端菜单控制：打开菜单
     */
    openMobileMenu() {
        const mobileSidebar = document.getElementById('mobileSidebar');
        if (mobileSidebar) {
            mobileSidebar.classList.add('show');
            this.isMobileMenuOpen = true;

            if (this.overlay) {
                this.overlay.classList.add('show');
            }

            this.closeUserPanel();
        }
    }

    /**
     * 移动端菜单控制：关闭菜单
     */
    closeMobileMenu() {
        const mobileSidebar = document.getElementById('mobileSidebar');
        if (mobileSidebar) {
            mobileSidebar.classList.remove('show');
            this.isMobileMenuOpen = false;

            if (this.overlay && !this.isUserPanelOpen) {
                this.overlay.classList.remove('show');
            }

            this.closeAllMobileDropdowns();
        }
    }

    /**
     * 触摸支持：添加滑动手势控制
     */
    setupTouchSupport() {
        let startX = 0;
        let currentX = 0;
        const swipeThreshold = 50; // 滑动阈值

        // 记录触摸起始位置
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        // 记录触摸移动位置
        document.addEventListener('touchmove', (e) => {
            currentX = e.touches[0].clientX;
        });

        // 处理触摸结束事件
        document.addEventListener('touchend', (e) => {
            const diffX = startX - currentX;

            // 右侧滑动打开菜单
            if (diffX > swipeThreshold && startX > window.innerWidth - 100) {
                this.openMobileMenu();
            }

            // 左侧滑动关闭菜单
            if (diffX < -swipeThreshold && startX < 100 && this.isMobileMenuOpen) {
                this.closeMobileMenu();
            }
        });
    }

    /**
     * 移动端点击优化：防止快速重复点击
     */
    setupMobileClickOptimization() {
        const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-dropdown-item');

        mobileLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // 防止300ms内重复点击
                if (link.classList.contains('clicked')) {
                    e.preventDefault();
                    return;
                }

                link.classList.add('clicked');
                setTimeout(() => {
                    link.classList.remove('clicked');
                }, 300);

                // 普通链接点击后关闭菜单
                if (!link.classList.contains('mobile-dropdown-toggle')) {
                    this.closeMobileMenu();
                }
            });
        });
    }

    /**
     * 视口控制：设置移动端视口属性，防止缩放
     */
    setupViewportControl() {
        let viewportMeta = document.querySelector('meta[name="viewport"]');
        if (!viewportMeta) {
            viewportMeta = document.createElement('meta');
            viewportMeta.name = 'viewport';
            document.head.appendChild(viewportMeta);
        }

        viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
    }

    /**
     * 移动端性能优化：统筹各项性能优化措施
     */
    optimizeMobilePerformance() {
        this.lazyLoadResources();
        this.optimizeImages();
        this.minimizeRepaints();
    }

    /**
     * 资源懒加载：延迟加载非关键资源
     */
    lazyLoadResources() {
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

            const lazyImages = document.querySelectorAll('img[data-src]');
            lazyImages.forEach(img => observer.observe(img));
        }
    }

    /**
     * 图片优化：根据设备像素比加载合适图片
     */
    optimizeImages() {
        const dpr = window.devicePixelRatio || 1;
        const images = document.querySelectorAll('img');

        images.forEach(img => {
            if (dpr > 1) {
                const currentSrc = img.src;
                if (currentSrc && !currentSrc.includes('@2x') && !currentSrc.includes('@3x')) {
                    // 高DPI设备图片处理逻辑
                }
            }
        });
    }

    /**
     * 重绘优化：减少不必要的页面重绘与重排
     */
    minimizeRepaints() {
        let ticking = false;

        const update = () => {
            ticking = false;
        };

        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(update);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestTick);
        window.addEventListener('resize', requestTick);
    }
}

// 页面初始化模块：处理页面加载流程
document.addEventListener('DOMContentLoaded', function () {
    showLoadingOverlay();

    const indexPage = new IndexPage();
    getCurrentUserInfo();

    // 延迟隐藏加载覆盖层
    setTimeout(() => {
        hideLoadingOverlay();
    }, 500);
});

// 加载状态控制模块：管理页面加载覆盖层显示
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

// 用户信息管理模块：获取与更新用户信息
async function getCurrentUserInfo() {
    // 防重复请求控制：500ms内不重复请求
    if (window._lastUserInfoRequest && Date.now() - window._lastUserInfoRequest < 500) {
        return;
    }

    window._lastUserInfoRequest = Date.now();
    try {
        const response = await fetch(requestUrl + '/user/info');
        const data = await response.json();
        if (data.code === 200) {
            const user = data.data;
            updateUserInfo(user);
            return user;
        } else {
            console.log('用户未登录:', data.message);
            window.location.href = requestUrl;
            return null;
        }
    } catch (error) {
        console.error('获取用户信息失败:', error);
        return null;
    }
}

function updateUserInfo(user) {
    const userAvatar = document.getElementById('userAvatar');
    const userName = document.querySelector('.user-name');
    const userPanel = document.getElementById('userPanel');
    if (userAvatar) {
        userAvatar.querySelector('img').src = user.avatar_url;
        userPanel.querySelector('img').src = user.avatar_url;
    }

    if (userName) {
        userName.textContent = user.username || user.email;
    }

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

// 消息提示模块：显示操作成功提示
function showSuccessMessage(message, duration = 3000) {
    // 清除现有同类通知
    const existingNotifications = document.querySelectorAll('.success-notification');
    existingNotifications.forEach(notification => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    });

    // 创建新通知
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

    // 自动关闭通知
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.parentNode.removeChild(successDiv);
        }
    }, duration);
}

/**
 * 消息检查：从URL参数读取并显示成功消息
 */
function checkSuccessMessage() {
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action');
    const message = urlParams.get('message');

    if (action && message) {
        showSuccessMessage(message);

        // 清除URL参数
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
    }
}

// 页面跳转控制模块：处理导航链接跳转逻辑
const DataUrl = document.querySelectorAll('.dropdown-menu');
DataUrl.forEach(menu => {
    menu.addEventListener('click', function (e) {
        const targetItem = e.target.closest('.dropdown-item');
        console.info(targetItem);
        if (targetItem) {
            e.preventDefault();
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