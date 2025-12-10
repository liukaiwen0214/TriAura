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
    <title>TriAura - 待办管理</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/static/css/tiraura.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/static/css/life/life-todo.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
<!-- 毛玻璃罩子 -->
<div id="loadingOverlay" class="loading-overlay">
    <div class="loading-content">
        <div class="loading-spinner"></div>
        <div class="loading-text">正在加载待办数据...</div>
        <div class="loading-subtext">请稍候，精彩即将呈现</div>
    </div>
</div>

<%-- 设置当前活动页面为生活管理 --%>
<% request.setAttribute("activePage", "life"); %>

<%-- 引入导航栏组件 --%>
<%@ include file="/WEB-INF/views/navbar.jsp" %>

<!-- 主要内容区域 - 待办管理 -->
<main class="main-content">
    <div class="life-todo-container">
        <!-- 页面标题 -->
        <section class="todo-header">
            <h1>待办管理</h1>
            <p>高效管理您的日常任务，提升生活品质</p>
        </section>

        <!-- 统计卡片区域 -->
        <section class="todo-stats-section">
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-tasks"></i>
                    </div>
                    <div class="stat-value" id="totalTasks">0</div>
                    <div class="stat-label">总待办</div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <div class="stat-value" id="completedTasks">0</div>
                    <div class="stat-label">已完成</div>
                    <div class="stat-change positive" id="completionRate">
                        <i class="fas fa-arrow-up"></i> 0% 完成率
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-clock"></i>
                    </div>
                    <div class="stat-value" id="pendingTasks">0</div>
                    <div class="stat-label">未完成</div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-star"></i>
                    </div>
                    <div class="stat-value" id="highPriorityTasks">0</div>
                    <div class="stat-label">高优先级</div>
                </div>
            </div>
        </section>

        <!-- 筛选和搜索区域 -->
        <section class="todo-filter-section">
            <div class="filter-container">
                <div class="search-box">
                    <i class="fas fa-search"></i>
                    <input type="text" id="searchInput" placeholder="搜索待办事项...">
                </div>

                <div class="filter-controls">
                    <div class="status-filter">
                        <button class="filter-btn active" data-status="all">全部</button>
                        <button class="filter-btn" data-status="pending">未完成</button>
                        <button class="filter-btn" data-status="completed">已完成</button>
                    </div>

                    <div class="priority-filter">
                        <button class="filter-btn" data-priority="all">全部优先级</button>
                        <button class="filter-btn" data-priority="high">高</button>
                        <button class="filter-btn" data-priority="medium">中</button>
                        <button class="filter-btn" data-priority="low">低</button>
                    </div>
                </div>
            </div>
        </section>

        <!-- 待办列表区域 -->
        <section class="todo-list-section">
            <div class="todo-list-header">
                <h2 class="section-title">待办列表</h2>
                <button class="btn-primary" id="addTodoBtn">
                    <i class="fas fa-plus"></i> 添加待办
                </button>
            </div>

            <div class="todo-list" id="todoList">
                <!-- 待办项将通过JavaScript动态生成 -->
            </div>
        </section>
    </div>
</main>

<!-- 添加/编辑待办模态框 -->
<div id="todoModal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h3 id="modalTitle">添加新待办</h3>
            <button class="modal-close" id="closeModal">&times;</button>
        </div>
        <div class="modal-body">
            <form id="todoForm">
                <input type="hidden" id="todoId">

                <div class="form-group">
                    <label for="todoTitle">待办标题 *</label>
                    <input type="text" id="todoTitle" name="title" placeholder="输入待办标题" required>
                </div>

                <div class="form-group">
                    <label for="todoDescription">描述</label>
                    <textarea id="todoDescription" name="description" rows="3" placeholder="输入待办描述"></textarea>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="todoPriority">优先级</label>
                        <select id="todoPriority" name="priority">
                            <option value="low">低</option>
                            <option value="medium" selected>中</option>
                            <option value="high">高</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="todoCategory">分类</label>
                        <input type="text" id="todoCategory" name="category" placeholder="输入分类（可选）">
                    </div>
                </div>

                <div class="form-group">
                    <label for="todoDueDate">截止日期</label>
                    <input type="date" id="todoDueDate" name="dueDate">
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button class="btn-secondary" id="cancelBtn">取消</button>
            <button class="btn-primary" id="saveBtn">保存</button>
        </div>
    </div>
</div>

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
<script src="${pageContext.request.contextPath}/static/script/life/life-todo.js"></script>
<script src="${pageContext.request.contextPath}/static/script/common/user-utils.js"></script>
</body>
</html>