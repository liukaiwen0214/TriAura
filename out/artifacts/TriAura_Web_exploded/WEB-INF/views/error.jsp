<%--
  Created by IntelliJ IDEA.
  User: liukaiwen
  Date: 2025/11/17
  Time: 09:38
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8"%>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>出错啦 - TriAura</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/static/css/error.css">
</head>
<body>
<div class="error-container">
    <div class="error-header">
        <h1>TriAura</h1>
    </div>

    <div class="error-content">
        <div class="error-icon">
            <i class="fas fa-exclamation-triangle"></i>
        </div>

        <h2 class="error-title">出错了</h2>
        <p class="error-message" id="errorMessage">抱歉，遇到了一些问题</p>
        <p class="error-detail" id="errorDetail">请检查网络连接或稍后重试</p>

        <div class="error-actions">
            <button class="btn btn-primary" onclick="goBack()">
                <i class="fas fa-arrow-left"></i>
                返回上页
            </button>
            <button class="btn btn-secondary" onclick="goHome()">
                <i class="fas fa-home"></i>
                返回首页
            </button>
        </div>
    </div>

    <div class="error-footer">
        <p>如果问题持续存在，请联系技术支持</p>
        <a href="mailto:support@triaura.com" class="support-link">
            <i class="fas fa-envelope"></i>
            support@triaura.com
        </a>
    </div>
</div>

<script src="${pageContext.request.contextPath}/static/script/error.js"></script>
</body>
</html>
