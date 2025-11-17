<%--
  Created by IntelliJ IDEA.
  User: liukaiwen
  Date: 2025/11/17
  Time: 11:23
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8"%>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>操作成功 - TriAura</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" type="text/css" href="../static/css/success.css">
</head>
<body>
<div class="success-container">
    <div class="success-header">
        <h1>TriAura</h1>
    </div>

    <div class="success-content">
        <div class="success-icon">
            <i class="fas fa-check-circle"></i>
        </div>

        <h2 class="success-title" id="successTitle">操作成功</h2>
        <p class="success-message" id="successMessage">您的操作已成功完成</p>
        <p class="success-detail" id="successDetail">页面将自动跳转，或您可以手动操作</p>

        <div class="success-actions">
            <button class="btn btn-primary" onclick="goNext()" id="nextButton">
                <i class="fas fa-arrow-right"></i>
                继续
            </button>
            <button class="btn btn-secondary" onclick="goHome()">
                <i class="fas fa-home"></i>
                返回首页
            </button>
        </div>

        <div class="countdown" id="countdown">
            <span id="countdownText">3</span> 秒后自动跳转
        </div>
    </div>

    <div class="success-footer">
        <p>如有任何问题，请联系技术支持</p>
        <a href="mailto:support@triaura.com" class="support-link">
            <i class="fas fa-envelope"></i>
            support@triaura.com
        </a>
    </div>
</div>

<script src="../static/script/success.js"></script>
</body>
</html>
