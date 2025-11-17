<%--
  Created by IntelliJ IDEA.
  User: liukaiwen
  Date: 2025/11/17
  Time: 16:15
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8"%>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TriAura - 主页</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/static/css/tiraura.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
<!-- 顶部导航栏 -->
<nav class="navbar">
    <div class="nav-container">
        <!-- Logo区域 -->
        <div class="nav-logo">
            <h1>TriAura</h1>
        </div>

        <!-- 主导航菜单 -->
        <div class="nav-menu">
            <div class="nav-item active">
                <a href="#" class="nav-link">
                    <i class="fas fa-home"></i>
                    <span>主页</span>
                </a>
            </div>

            <!-- 生活管理下拉菜单 -->
            <div class="nav-item dropdown">
                <a href="#" class="nav-link dropdown-toggle">
                    <i class="fas fa-life-ring"></i>
                    <span>生活管理</span>
                    <i class="fas fa-chevron-down dropdown-icon"></i>
                </a>
                <div class="dropdown-menu">
                    <a href="#" class="dropdown-item">
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
            <div class="nav-item dropdown">
                <a href="#" class="nav-link dropdown-toggle">
                    <i class="fas fa-gamepad"></i>
                    <span>游戏管理</span>
                    <i class="fas fa-chevron-down dropdown-icon"></i>
                </a>
                <div class="dropdown-menu">
                    <a href="#" class="dropdown-item">
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
            <div class="nav-item dropdown">
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
                <img src="/static/images/default-avatar.png" alt="用户头像">
                <span class="user-name">未登录</span>
                <i class="fas fa-chevron-down user-dropdown-icon"></i>
            </div>
            
            <!-- 个人信息面板 -->
            <div id="userPanel" class="user-panel">
                <div class="user-panel-header">
                    <img src="/static/images/default-avatar.png" alt="用户头像">
                    <div class="user-info">
                        <h3>未登录用户</h3>
                        <p>请先登录</p>
                    </div>
                </div>
                <div class="user-panel-menu">
                    <a href="#" class="user-menu-item">
                        <i class="fas fa-user"></i>
                        <span>个人资料</span>
                    </a>
                    <a href="#" class="user-menu-item">
                        <i class="fas fa-cog"></i>
                        <span>设置</span>
                    </a>
                    <a href="#" class="user-menu-item">
                        <i class="fas fa-bell"></i>
                        <span>通知</span>
                    </a>
                    <div class="divider"></div>
                    <a href="#" class="user-menu-item">
                        <i class="fas fa-sign-out-alt"></i>
                        <span>退出登录</span>
                    </a>
                </div>
            </div>
        </div>
    </div>
</nav>

<!-- 主要内容区域 -->
<main class="main-content">
    <div class="content-container">
        <!-- 欢迎区域 -->
        <section class="welcome-section">
            <div class="welcome-content">
                <h1>欢迎回来</h1>
                <p>这里是您的生活、游戏、工作管理中心</p>
            </div>
        </section>

        <!-- 快速访问区域 -->
        <section class="quick-access">
            <div></div>
        </section>

        <!-- 最近活动区域 -->
        <section class="recent-activity">
            <h2>最近活动</h2>
            <div class="activity-list">
                <div class="activity-item">
                    <div class="activity-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <div class="activity-content">
                        <p>完成了待办事项：更新项目文档</p>
                        <span class="activity-time">2小时前</span>
                    </div>
                </div>
                <div class="activity-item">
                    <div class="activity-icon">
                        <i class="fas fa-gamepad"></i>
                    </div>
                    <div class="activity-content">
                        <p>更新了式神录数据</p>
                        <span class="activity-time">5小时前</span>
                    </div>
                </div>
                <div class="activity-item">
                    <div class="activity-icon">
                        <i class="fas fa-chart-line"></i>
                    </div>
                    <div class="activity-content">
                        <p>完成了本周工作复盘</p>
                        <span class="activity-time">1天前</span>
                    </div>
                </div>
            </div>
        </section>
    </div>
</main>

<!-- 移动端菜单按钮 -->
<button class="mobile-menu-toggle" id="mobileMenuToggle">
    <i class="fas fa-bars"></i>
</button>

<!-- 移动端侧边菜单 -->
<div class="mobile-sidebar" id="mobileSidebar">
    <div class="mobile-sidebar-header">
        <h3>TriAura</h3>
        <button class="mobile-sidebar-close" id="mobileSidebarClose">
            <i class="fas fa-times"></i>
        </button>
    </div>
    <div class="mobile-nav-menu">
        <!-- 移动端菜单内容将通过JS动态生成 -->
    </div>
</div>

<!-- 遮罩层 -->
<div class="overlay" id="overlay"></div>

<script src="${pageContext.request.contextPath}/static/script/tiraura.js"></script>
</body>
</html>