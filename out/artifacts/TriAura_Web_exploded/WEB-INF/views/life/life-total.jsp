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

<%-- 设置当前活动页面为生活管理 --%>
<% request.setAttribute("activePage", "life"); %>

<%-- 引入导航栏组件 --%>
<%@ include file="/WEB-INF/views/navbar.jsp" %>

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
                    <div class="stat-value" id="todo_not_done_count">8</div>
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
                            <div class="category-stat-value" id="todo_not_done">8</div>
                            <div class="category-stat-label">待完成</div>
                        </div>
                        <div class="category-stat">
                            <div class="category-stat-value" id="todo_done">15</div>
                            <div class="category-stat-label">已完成</div>
                        </div>
                    </div>
                    <div class="category-actions">
                        <a id="viewTodoBtn" class="btn-action">查看待办</a>
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
<!-- 待办列表弹窗 -->
<div id="todoModal" class="todo-modal">
    <div class="todo-modal-content">
        <div class="todo-modal-header">
            <h3>待办事项列表</h3>
            <button id="closeTodoModal" class="todo-modal-close">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="todo-modal-body">
            <div id="todoList" class="todo-list"></div>
        </div>
    </div>
</div>
<!-- 遮罩层 -->
<div id="overlay" class="overlay"></div>

<script src="${pageContext.request.contextPath}/static/script/tiraura.js"></script>
<script src="${pageContext.request.contextPath}/static/script/life/life-total.js"></script>
<script src="${pageContext.request.contextPath}/static/script/common/user-utils.js"></script>
</body>
</html>
