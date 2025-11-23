<%--
  Created by IntelliJ IDEA.
  User: liukaiwen
  Date: 2025/11/17
  Time: 16:15
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" %>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TriAura - 主页</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/static/css/tiraura.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
<%-- 设置当前活动页面为首页 --%>
<% request.setAttribute("activePage", "home"); %>

<!-- 毛玻璃罩子 -->
<div id="loadingOverlay" class="loading-overlay">
    <div class="loading-content">
        <div class="loading-spinner"></div>
        <p>正在加载页面...</p>
    </div>
</div>

<%-- 引入导航栏组件 --%>
<%@ include file="/WEB-INF/views/navbar.jsp" %>

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

<script src="${pageContext.request.contextPath}/static/script/tiraura.js"></script>
</body>
</html>