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
<div id="loadingOverlay" class="loading-overlay">
    <div class="loading-content">
        <div class="loading-spinner"></div>
        <div class="loading-text">正在加载待办数据...</div>
        <div class="loading-subtext">请稍候，精彩即将呈现</div>
    </div>
</div>

<%-- 设置当前活动页面为生活管理 --%>
<% request.setAttribute("activePage", "game"); %>

<%-- 引入导航栏组件 --%>
<%--<%@ include file="/WEB-INF/views/navbar.jsp" %>--%>
<%-- 引入导航栏组件 --%>
<%@ include file="../navbar.jsp" %>

<div id="navbar-container"></div>

<main class="main-content">
    <div class="life-todo-container">
        <section class="todo-header">
            <h1>待办管理</h1>
            <p>高效管理您的日常任务，提升生活品质</p>
        </section>

        <section class="todo-list-section">
            <div class="todo-list-header">
                <h2 class="section-title">待办列表</h2>
                <div class="list-controls">
                    <button class="btn-primary" id="addColumnBtn">
                        <i class="fas fa-columns"></i> 添加列
                    </button>
                    <button class="btn-primary" id="addTodoBtn">
                        <i class="fas fa-plus"></i> 添加待办
                    </button>
                    <button class="btn-primary" id="recycleBinBtn">
                        <i class="fas fa-trash-restore"></i> 回收箱
                    </button>
                </div>
            </div>

            <div class="todo-list-loading" id="todoListLoading">
                <div class="todo-list-loading-content">
                    <div class="loading-spinner"></div>
                    <div class="loading-text">正在加载待办列表...</div>
                </div>
            </div>

            <div class="todo-columns" id="todoColumns">
            </div>
        </section>
    </div>
</main>

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

                <div class="form-row">
                    <div class="form-group">
                        <label for="todoDueDate">截止日期</label>
                        <input type="date" id="todoDueDate" name="dueDate">
                    </div>

                    <div class="form-group">
                        <label for="todoReminderTime">提醒时间</label>
                        <input type="datetime-local" id="todoReminderTime" name="reminderTime">
                    </div>
                </div>

                <div class="form-group">
                    <label for="todoTags">标签</label>
                    <input type="text" id="todoTags" name="tags" placeholder="输入标签，用逗号分隔">
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button class="btn-secondary" id="cancelBtn">取消</button>
            <button class="btn-primary" id="saveBtn">保存</button>
        </div>
    </div>
</div>

<div id="mobileSidebar" class="mobile-sidebar">
    <div class="mobile-sidebar-header">
        <h3>菜单</h3>
        <button id="mobileSidebarClose" class="mobile-sidebar-close" aria-label="关闭菜单">
            <i class="fas fa-times"></i>
        </button>
    </div>
    <div class="mobile-nav-menu" id="mobileNavMenu">
    </div>
</div>

<div id="confirmModal" class="modal confirm-modal">
    <div class="modal-content">
        <div class="modal-header">
            <h3 id="confirmTitle">确认操作</h3>
            <button class="modal-close" id="confirmClose">&times;</button>
        </div>
        <div class="modal-body">
            <p id="confirmMessage">您确定要执行此操作吗？</p>
        </div>
        <div class="modal-footer">
            <button class="btn-secondary" id="confirmCancel">取消</button>
            <button class="btn-primary" id="confirmOk">确定</button>
        </div>
    </div>
</div>

<div id="recycleBinModal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h3 id="recycleBinTitle">回收箱</h3>
            <button class="modal-close" id="recycleBinClose">&times;</button>
        </div>
        <div class="modal-body">
            <div id="recycleBinContent">
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn-primary" id="recycleBinCloseBtn">关闭</button>
        </div>
    </div>
</div>

<div id="todoDetailModal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h3 id="detailModalTitle">待办详情</h3>
            <button class="modal-close" id="detailModalClose">&times;</button>
        </div>
        <div class="modal-body">
            <form id="detailForm">
                <input type="hidden" id="detailTodoId">

                <div class="form-group">
                    <label for="detailTitle">标题</label>
                    <input type="text" id="detailTitle" name="title" required>
                </div>

                <div class="form-group">
                    <label for="detailDescription">描述</label>
                    <textarea id="detailDescription" name="description" rows="3"></textarea>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="detailPriority">优先级</label>
                        <select id="detailPriority" name="priority">
                            <option value="low">低</option>
                            <option value="medium">中</option>
                            <option value="high">高</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="detailCategory">分类</label>
                        <input type="text" id="detailCategory" name="category">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="detailDueDate">截止日期</label>
                        <input type="date" id="detailDueDate" name="dueDate">
                    </div>

                    <div class="form-group">
                        <label for="detailStatus">状态</label>
                        <select id="detailStatus" name="status">
                            <option value="0">未开始</option>
                            <option value="1">进行中</option>
                            <option value="2">已完成</option>
                            <option value="3">已取消</option>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label for="detailTags">标签</label>
                    <select id="detailTags" name="tags">
                    </select>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn-secondary" id="detailCancelBtn">取消</button>
            <button type="button" class="btn-primary" id="detailSaveBtn">保存</button>
        </div>
    </div>
</div>

<div id="unsavedConfirmModal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h3 id="unsavedTitle">未保存提示</h3>
            <button class="modal-close" id="unsavedClose">&times;</button>
        </div>
        <div class="modal-body">
            <p id="unsavedMessage">当前信息已发生修改，是否要保存？</p>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn-secondary" id="unsavedCancelBtn">取消</button>
            <button type="button" class="btn-primary" id="unsavedConfirmBtn">确定</button>
        </div>
    </div>
</div>

<div id="addColumnModal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h3 id="addColumnModalTitle">添加自定义列</h3>
            <button class="modal-close" id="addColumnModalClose">&times;</button>
        </div>
        <div class="modal-body">
            <form id="addColumnForm">
                <div class="form-group">
                    <label for="columnName">列名称</label>
                    <input type="text" id="columnName" name="columnName" required placeholder="请输入列名称">
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn-secondary" id="addColumnCancelBtn">取消</button>
            <button type="button" class="btn-primary" id="addColumnSaveBtn">保存</button>
        </div>
    </div>
</div>

<div id="overlay" class="overlay"></div>

<script src="${pageContext.request.contextPath}/static/script/tiraura.js"></script>
<script src="${pageContext.request.contextPath}/static/script/life/life-todo.js"></script>
<script src="${pageContext.request.contextPath}/static/script/common/user-utils.js"></script>
</body>
</html>