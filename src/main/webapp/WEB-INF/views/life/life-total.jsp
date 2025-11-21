<%--
  Created by IntelliJ IDEA.
  User: liukaiwen
  Date: 2025/11/21
  Time: 09:36
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" %>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TriAura - 生活管理汇总</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/static/css/tiraura.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/static/css/life/life-total.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
<!-- 毛玻璃罩子 -->
<div id="loadingOverlay" class="loading-overlay">
    <div class="loading-content">
        <div class="loading-spinner"></div>
        <div class="loading-text">正在加载生活管理数据...</div>
        <div class="loading-subtext">请稍候，精彩即将呈现</div>
    </div>
</div>

<!-- 顶部导航栏 - 完全复用tiraura.html中的导航栏 -->
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
            <div class="nav-item">
                <a href="tiraura.html" class="nav-link">
                    <i class="fas fa-home"></i>
                    <span>主页</span>
                </a>
            </div>

            <!-- 生活管理下拉菜单 -->
            <div class="nav-item dropdown active">
                <a href="#" class="nav-link dropdown-toggle">
                    <i class="fas fa-life-ring"></i>
                    <span>生活管理</span>
                    <i class="fas fa-chevron-down dropdown-icon"></i>
                </a>
                <div class="dropdown-menu">
                    <a href="life-total.html" class="dropdown-item">
                        <i class="fas fa-total"></i>
                        <span>汇总</span>
                    </a>
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

<!-- 主要内容区域 - 生活管理汇总 -->
<main class="main-content">
    <div class="life-summary-container">
        <!-- 页面标题 -->
        <section class="summary-header">
            <h1>生活管理汇总</h1>
            <p>全面掌握您的生活数据，智能管理日常事务</p>
        </section>

        <!-- 统计卡片区域 -->
        <section class="stats-section">
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-wallet"></i>
                    </div>
                    <div class="stat-value">¥12,580</div>
                    <div class="stat-label">总资产</div>
                    <div class="stat-change positive">
                        <i class="fas fa-arrow-up"></i> +5.2% 本月
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-graduation-cap"></i>
                    </div>
                    <div class="stat-value">24</div>
                    <div class="stat-label">学习课程</div>
                    <div class="stat-change positive">
                        <i class="fas fa-arrow-up"></i> +3 本周
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-book"></i>
                    </div>
                    <div class="stat-value">156</div>
                    <div class="stat-label">日记篇数</div>
                    <div class="stat-change positive">
                        <i class="fas fa-arrow-up"></i> +12 本月
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-tasks"></i>
                    </div>
                    <div class="stat-value">8</div>
                    <div class="stat-label">待办事项</div>
                    <div class="stat-change negative">
                        <i class="fas fa-arrow-down"></i> -2 今日
                    </div>
                </div>
            </div>
        </section>

        <!-- 分类概览区域 -->
        <section class="categories-section">
            <h2 class="section-title">分类概览</h2>
            <div class="categories-grid">
                <!-- 资产管理卡片 -->
                <div class="category-card">
                    <div class="category-header">
                        <div class="category-title">
                            <div class="category-icon">
                                <i class="fas fa-wallet"></i>
                            </div>
                            <div class="category-name">资产管理</div>
                        </div>
                        <div class="category-status status-active">正常</div>
                    </div>
                    <div class="category-stats">
                        <div class="category-stat">
                            <div class="category-stat-value">¥8,200</div>
                            <div class="category-stat-label">银行存款</div>
                        </div>
                        <div class="category-stat">
                            <div class="category-stat-value">¥4,380</div>
                            <div class="category-stat-label">投资理财</div>
                        </div>
                    </div>
                    <div class="category-actions">
                        <a href="#" class="btn-action">查看详情</a>
                        <a href="#" class="btn-action">添加记录</a>
                    </div>
                </div>

                <!-- 学习管理卡片 -->
                <div class="category-card">
                    <div class="category-header">
                        <div class="category-title">
                            <div class="category-icon">
                                <i class="fas fa-graduation-cap"></i>
                            </div>
                            <div class="category-name">学习管理</div>
                        </div>
                        <div class="category-status status-warning">进行中</div>
                    </div>
                    <div class="category-stats">
                        <div class="category-stat">
                            <div class="category-stat-value">12</div>
                            <div class="category-stat-label">已完成</div>
                        </div>
                        <div class="category-stat">
                            <div class="category-stat-value">3</div>
                            <div class="category-stat-label">进行中</div>
                        </div>
                    </div>
                    <div class="category-actions">
                        <a href="#" class="btn-action">学习计划</a>
                        <a href="#" class="btn-action">添加课程</a>
                    </div>
                </div>

                <!-- 日记管理卡片 -->
                <div class="category-card">
                    <div class="category-header">
                        <div class="category-title">
                            <div class="category-icon">
                                <i class="fas fa-book"></i>
                            </div>
                            <div class="category-name">日记管理</div>
                        </div>
                        <div class="category-status status-active">正常</div>
                    </div>
                    <div class="category-stats">
                        <div class="category-stat">
                            <div class="category-stat-value">23</div>
                            <div class="category-stat-label">本月篇数</div>
                        </div>
                        <div class="category-stat">
                            <div class="category-stat-value">156</div>
                            <div class="category-stat-label">总篇数</div>
                        </div>
                    </div>
                    <div class="category-actions">
                        <a href="#" class="btn-action">查看日记</a>
                        <a href="#" class="btn-action">写日记</a>
                    </div>
                </div>

                <!-- 待办管理卡片 -->
                <div class="category-card">
                    <div class="category-header">
                        <div class="category-title">
                            <div class="category-icon">
                                <i class="fas fa-tasks"></i>
                            </div>
                            <div class="category-name">待办管理</div>
                        </div>
                        <div class="category-status status-active">正常</div>
                    </div>
                    <div class="category-stats">
                        <div class="category-stat">
                            <div class="category-stat-value">8</div>
                            <div class="category-stat-label">待完成</div>
                        </div>
                        <div class="category-stat">
                            <div class="category-stat-value">15</div>
                            <div class="category-stat-label">已完成</div>
                        </div>
                    </div>
                    <div class="category-actions">
                        <a href="#" class="btn-action">查看待办</a>
                        <a href="#" class="btn-action">添加任务</a>
                    </div>
                </div>
            </div>
        </section>

        <!-- 快速操作区域 -->
        <section class="quick-actions-section">
            <h2 class="section-title">快速操作</h2>
            <div class="quick-actions-grid">
                <a href="#" class="quick-action-item">
                    <div class="quick-action-icon">
                        <i class="fas fa-plus"></i>
                    </div>
                    <div class="quick-action-content">
                        <div class="quick-action-title">添加资产</div>
                        <div class="quick-action-desc">记录新的资产信息</div>
                    </div>
                </a>

                <a href="#" class="quick-action-item">
                    <div class="quick-action-icon">
                        <i class="fas fa-book-open"></i>
                    </div>
                    <div class="quick-action-content">
                        <div class="quick-action-title">开始学习</div>
                        <div class="quick-action-desc">记录学习进度</div>
                    </div>
                </a>

                <a href="#" class="quick-action-item">
                    <div class="quick-action-icon">
                        <i class="fas fa-edit"></i>
                    </div>
                    <div class="quick-action-content">
                        <div class="quick-action-title">写日记</div>
                        <div class="quick-action-desc">记录生活点滴</div>
                    </div>
                </a>

                <a href="#" class="quick-action-item">
                    <div class="quick-action-icon">
                        <i class="fas fa-check-square"></i>
                    </div>
                    <div class="quick-action-content">
                        <div class="quick-action-title">添加待办</div>
                        <div class="quick-action-desc">创建新任务</div>
                    </div>
                </a>
            </div>
        </section>

        <!-- 最近活动区域 -->
        <section class="recent-activity-section">
            <h2 class="section-title">最近活动</h2>
            <div class="activity-list">
                <div class="activity-item">
                    <div class="activity-icon">
                        <i class="fas fa-wallet"></i>
                    </div>
                    <div class="activity-content">
                        <div class="activity-title">记录了资产变动</div>
                        <div class="activity-description">工资收入 +¥5,000</div>
                        <div class="activity-time">2小时前</div>
                    </div>
                </div>

                <div class="activity-item">
                    <div class="activity-icon">
                        <i class="fas fa-graduation-cap"></i>
                    </div>
                    <div class="activity-content">
                        <div class="activity-title">完成了学习任务</div>
                        <div class="activity-description">《JavaScript高级程序设计》第3章</div>
                        <div class="activity-time">5小时前</div>
                    </div>
                </div>

                <div class="activity-item">
                    <div class="activity-icon">
                        <i class="fas fa-book"></i>
                    </div>
                    <div class="activity-content">
                        <div class="activity-title">写了新日记</div>
                        <div class="activity-description">记录今天的工作总结和学习心得</div>
                        <div class="activity-time">1天前</div>
                    </div>
                </div>

                <div class="activity-item">
                    <div class="activity-icon">
                        <i class="fas fa-tasks"></i>
                    </div>
                    <div class="activity-content">
                        <div class="activity-title">完成了待办事项</div>
                        <div class="activity-description">更新项目文档，准备会议材料</div>
                        <div class="activity-time">2天前</div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</main>

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

<script src="${pageContext.request.contextPath}/static/script/tiraura.js"></script>
<script src="${pageContext.request.contextPath}/static/script/life/life-total.js"></script>
</body>
</html>
