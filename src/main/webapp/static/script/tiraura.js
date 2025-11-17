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

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.generateMobileMenu();
        this.setupMobileDropdowns();
    }

    setupEventListeners() {
        // 用户面板切换
        this.userAvatar?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleUserPanel();
        });

        // 移动端菜单切换
        this.mobileMenuToggle?.addEventListener('click', () => {
            this.toggleMobileMenu();
        });

        this.mobileSidebarClose?.addEventListener('click', () => {
            this.closeMobileMenu();
        });

        this.overlay?.addEventListener('click', () => {
            this.closeMobileMenu();
            this.closeUserPanel();
        });

        // 点击外部关闭面板
        document.addEventListener('click', (e) => {
            if (this.isUserPanelOpen && !this.userPanel.contains(e.target) && !this.userAvatar.contains(e.target)) {
                this.closeUserPanel();
            }
        });

        // 窗口大小改变时的处理
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.closeMobileMenu();
            }
        });

        // ESC键关闭面板
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeUserPanel();
                this.closeMobileMenu();
            }
        });
    }

    toggleUserPanel() {
        if (this.isUserPanelOpen) {
            this.closeUserPanel();
        } else {
            this.openUserPanel();
        }
    }

    openUserPanel() {
        this.userPanel?.classList.add('show');
        this.isUserPanelOpen = true;
        this.overlay?.classList.add('show');
    }

    closeUserPanel() {
        this.userPanel?.classList.remove('show');
        this.isUserPanelOpen = false;
        if (!this.isMobileMenuOpen) {
            this.overlay?.classList.remove('show');
        }
    }

    toggleMobileMenu() {
        if (this.isMobileMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    openMobileMenu() {
        this.mobileSidebar?.classList.add('show');
        this.isMobileMenuOpen = true;
        this.overlay?.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    closeMobileMenu() {
        this.mobileSidebar?.classList.remove('show');
        this.isMobileMenuOpen = false;
        if (!this.isUserPanelOpen) {
            this.overlay?.classList.remove('show');
        }
        document.body.style.overflow = '';
    }

    generateMobileMenu() {
        const menuData = [
            {
                title: '主页',
                icon: 'fas fa-home',
                href: '#',
                active: true
            },
            {
                title: '生活管理',
                icon: 'fas fa-life-ring',
                subItems: [
                    { title: '资产', icon: 'fas fa-wallet', href: '#' },
                    { title: '学习', icon: 'fas fa-graduation-cap', href: '#' },
                    { title: '日记', icon: 'fas fa-book', href: '#' },
                    { title: '待办', icon: 'fas fa-tasks', href: '#' }
                ]
            },
            {
                title: '游戏管理',
                icon: 'fas fa-gamepad',
                subItems: [
                    { title: '式神录', icon: 'fas fa-list', href: '#' },
                    { title: '式神图鉴', icon: 'fas fa-images', href: '#' },
                    { title: '御魂背包', icon: 'fas fa-backpack', href: '#' },
                    { title: '副本管理', icon: 'fas fa-dungeon', href: '#' },
                    { title: '资源收益', icon: 'fas fa-coins', href: '#' }
                ]
            },
            {
                title: '工作管理',
                icon: 'fas fa-briefcase',
                subItems: [
                    { title: '目标看板', icon: 'fas fa-tachometer-alt', href: '#' },
                    { title: '执行中心', icon: 'fas fa-play-circle', href: '#' },
                    { title: '会议档案', icon: 'fas fa-file-alt', href: '#' },
                    { title: '复盘', icon: 'fas fa-sync-alt', href: '#' }
                ]
            }
        ];

        let menuHTML = '';
        menuData.forEach(item => {
            if (item.subItems) {
                menuHTML += `
                    <div class="mobile-nav-item">
                        <div class="mobile-nav-link mobile-dropdown-toggle" data-target="dropdown-${item.title}">
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <i class="${item.icon}"></i>
                                <span>${item.title}</span>
                            </div>
                            <i class="fas fa-chevron-down"></i>
                        </div>
                        <div class="mobile-dropdown-menu" id="dropdown-${item.title}">
                            ${item.subItems.map(subItem => `
                                <a href="${subItem.href}" class="mobile-dropdown-item">
                                    <i class="${subItem.icon}"></i>
                                    <span>${subItem.title}</span>
                                </a>
                            `).join('')}
                        </div>
                    </div>
                `;
            } else {
                menuHTML += `
                    <div class="mobile-nav-item">
                        <a href="${item.href}" class="mobile-nav-link ${item.active ? 'active' : ''}">
                            <i class="${item.icon}"></i>
                            <span>${item.title}</span>
                        </a>
                    </div>
                `;
            }
        });

        this.mobileNavMenu.innerHTML = menuHTML;
    }

    setupMobileDropdowns() {
        const dropdownToggles = document.querySelectorAll('.mobile-dropdown-toggle');

        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = toggle.getAttribute('data-target');
                const dropdown = document.getElementById(targetId);
                const icon = toggle.querySelector('.fa-chevron-down');

                if (dropdown.classList.contains('show')) {
                    dropdown.classList.remove('show');
                    icon.style.transform = 'rotate(0deg)';
                } else {
                    // 关闭其他下拉菜单
                    document.querySelectorAll('.mobile-dropdown-menu').forEach(menu => {
                        menu.classList.remove('show');
                    });
                    document.querySelectorAll('.mobile-dropdown-toggle .fa-chevron-down').forEach(i => {
                        i.style.transform = 'rotate(0deg)';
                    });

                    dropdown.classList.add('show');
                    icon.style.transform = 'rotate(180deg)';
                }
            });
        });
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new IndexPage();
});

// 添加一些交互增强
class InteractiveEnhancements {
    constructor() {
        this.setupQuickCardsAnimation();
        this.setupActivityItemsAnimation();
    }

    setupQuickCardsAnimation() {
        const quickCards = document.querySelectorAll('.quick-card');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                }
            });
        }, { threshold: 0.1 });

        quickCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            observer.observe(card);
        });
    }

    setupActivityItemsAnimation() {
        const activityItems = document.querySelectorAll('.activity-item');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateX(0)';
                    }, index * 50);
                }
            });
        }, { threshold: 0.1 });

        activityItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            item.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            observer.observe(item);
        });
    }
}

// 页面加载完成后添加交互增强
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        new InteractiveEnhancements();
    }, 100);
});