<%--
  Created by IntelliJ IDEA.
  User: lkwyo
  Date: 2025/11/22
  Time: 21:06
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8"%>
<html>
<head>
    <title>Title</title>
</head>
<body>
<%--
  可复用的导航栏组件
--%>
<!-- 顶部导航栏 -->
<nav class="navbar">
    <!-- 在导航栏容器内添加移动端菜单按钮 -->
    <div class="nav-container">
        <!-- 移动端菜单按钮 -->
        <button id="mobileMenuToggle" class="mobile-menu-toggle" aria-label="打开菜单">
            <i class="fas fa-bars"></i>
        </button>

        <!-- Logo区域 -->
        <div class="nav-logo">
            <h1>TriAura</h1>
        </div>

        <!-- 主导航菜单 -->
        <div class="nav-menu">
            <div class="nav-item <%= request.getAttribute("activePage") != null && request.getAttribute("activePage").equals("home") ? "active" : "" %>">
                <a href="#" class="nav-link" data-jumpUrl="/user/tiraura">
                    <i class="fas fa-home"></i>
                    <span>主页</span>
                </a>
            </div>

            <!-- 生活管理下拉菜单 -->
            <div class="nav-item dropdown <%= request.getAttribute("activePage") != null && request.getAttribute("activePage").equals("life") ? "active" : "" %>">
                <a href="#" class="nav-link dropdown-toggle">
                    <i class="fas fa-life-ring"></i>
                    <span>生活管理</span>
                    <i class="fas fa-chevron-down dropdown-icon"></i>
                </a>
                <div class="dropdown-menu">
                    <a href="#" class="dropdown-item" data-url="/life/life-total">
                        <i class="fas fa-list"></i>
                        <span>汇总</span>
                    </a>
                    <a href="#" class="dropdown-item" data-url="/life/life-asset">
                        <i class="fas fa-wallet"></i>
                        <span>资产</span>
                    </a>
                    <a href="#" class="dropdown-item">
                        <i class="fas fa-graduation-cap"></i>
                        <span>学习</span>
                    </a>
                    <a href="#" class="dropdown-item">
                        <i class="fas fa-book"></i>
                        <span>日记</span>
                    </a>
                    <a href="#" class="dropdown-item">
                        <i class="fas fa-tasks"></i>
                        <span>待办</span>
                    </a>
                </div>
            </div>

            <!-- 游戏管理下拉菜单 -->
            <div class="nav-item dropdown <%= request.getAttribute("activePage") != null && request.getAttribute("activePage").equals("game") ? "active" : "" %>">
                <a href="#" class="nav-link dropdown-toggle">
                    <i class="fas fa-gamepad"></i>
                    <span>游戏管理</span>
                    <i class="fas fa-chevron-down dropdown-icon"></i>
                </a>
                <div class="dropdown-menu">
                    <a href="#" class="dropdown-item"  data-url="/shikigami/record">
                        <i class="fas fa-list"></i>
                        <span>式神录</span>
                    </a>
                    <a href="#" class="dropdown-item">
                        <i class="fas fa-images"></i>
                        <span>式神图鉴</span>
                    </a>
                    <a href="#" class="dropdown-item">
                        <i class="fas fa-backpack"></i>
                        <span>御魂背包</span>
                    </a>
                    <a href="#" class="dropdown-item">
                        <i class="fas fa-dungeon"></i>
                        <span>副本管理</span>
                    </a>
                    <a href="#" class="dropdown-item">
                        <i class="fas fa-coins"></i>
                        <span>资源收益</span>
                    </a>
                </div>
            </div>

            <!-- 工作管理下拉菜单 -->
            <div class="nav-item dropdown <%= request.getAttribute("activePage") != null && request.getAttribute("activePage").equals("work") ? "active" : "" %>">
                <a href="#" class="nav-link dropdown-toggle">
                    <i class="fas fa-briefcase"></i>
                    <span>工作管理</span>
                    <i class="fas fa-chevron-down dropdown-icon"></i>
                </a>
                <div class="dropdown-menu">
                    <a href="#" class="dropdown-item">
                        <i class="fas fa-tachometer-alt"></i>
                        <span>目标看板</span>
                    </a>
                    <a href="#" class="dropdown-item">
                        <i class="fas fa-play-circle"></i>
                        <span>执行中心</span>
                    </a>
                    <a href="#" class="dropdown-item">
                        <i class="fas fa-file-alt"></i>
                        <span>会议档案</span>
                    </a>
                    <a href="#" class="dropdown-item">
                        <i class="fas fa-sync-alt"></i>
                        <span>复盘</span>
                    </a>
                </div>
            </div>
        </div>

        <!-- 个人信息区域 -->
        <div class="nav-user">
            <div id="userAvatar" class="user-avatar">
                <img src="" alt="用户头像">
                <span class="user-name">未登录</span>
                <i class="fas fa-chevron-down user-dropdown-icon"></i>
            </div>

            <!-- 个人信息面板 -->
            <div id="userPanel" class="user-panel">
                <div class="user-panel-header">
                    <img src="" alt="用户头像">
                    <div class="user-info">
                        <h3>未登录用户</h3>
                        <p>请先登录</p>
                    </div>
                </div>
                <div class="user-panel-menu">
                    <a href="#" class="user-menu-item" data-url="/user/profile">
                        <i class="fas fa-user"></i>
                        <span>个人资料</span>
                    </a>
                    <a href="#" class="user-menu-item" data-url="/user/profile">
                        <i class="fas fa-cog"></i>
                        <span>设置</span>
                    </a>
                    <a href="#" class="user-menu-item">
                        <i class="fas fa-bell"></i>
                        <span>通知</span>
                    </a>
                    <div class="divider"></div>
                    <a href="${pageContext.request.contextPath}/login" class="user-menu-item">
                        <i class="fas fa-sign-out-alt"></i>
                        <span>退出登录</span>
                    </a>
                </div>
            </div>
        </div>
    </div>
</nav>

<!-- 移动端侧边栏菜单 -->
<div id="mobileSidebar" class="mobile-sidebar">
    <div class="mobile-sidebar-header">
        <h3>菜单</h3>
        <button id="mobileSidebarClose" class="mobile-sidebar-close" aria-label="关闭菜单">
            <i class="fas fa-times"></i>
        </button>
    </div>
    <div class="mobile-nav-menu" id="mobileNavMenu">
        <!-- 菜单内容由JavaScript动态生成 -->
    </div>
</div>

<!-- 遮罩层 -->
<div id="overlay" class="overlay"></div>

</body>
</html>
