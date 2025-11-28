<%@ page contentType="text/html;charset=UTF-8" %>
<!--
  登录页面JSP文件
  负责展示登录表单、处理登录请求和第三方登录功能
-->
<html lang="zh-CN">
<head>
    <!-- 页面元信息 -->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>登录 - 三分之境</title>
    
    <!-- 引入外部资源 -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/static/css/login.css">
</head>
<body>
<!-- 登录容器 -->
<div class="login-container">
    <!-- 登录头部 -->
    <div class="login-header">
        <h1>TriAura</h1>
    </div>

    <!-- 登录表单 -->
    <div class="login-form">
        <form id="loginForm">
            <!-- 账号输入框 -->
            <div class="form-group">
                <label for="username">账号</label>
                <input type="text" id="username" class="form-control" placeholder="邮箱" required>
                <div id="usernameError" class="error-message">请输入有效的邮箱</div>
            </div>

            <!-- 密码输入框 -->
            <div class="form-group">
                <label for="password">密码</label>
                <div class="password-container">
                    <input type="password" id="password" class="form-control" placeholder="密码" required>
                    <i class="toggle-password fas fa-eye-slash" onclick="togglePasswordVisibility()"></i>
                </div>
                <div id="passwordError" class="error-message">密码长度至少8位</div>
            </div>

            <!-- 忘记密码链接 -->
            <div class="forgot-password">
                <a href="#">忘记密码？</a>
            </div>

            <!-- 登录按钮 -->
            <button type="submit" class="btn btn-primary" id="loginButton">
                <span id="loginText">登录</span>
                <span id="loginSpinner" class="loading-spinner" style="display: none;"></span>
            </button>

            <!-- 注册按钮 -->
            <button type="button" class="btn btn-secondary" id="registerButton">
                注册新账号
            </button>
        </form>

        <!-- 分隔线 -->
        <div class="divider">
            <span>其他方式</span>
        </div>

        <!-- 第三方登录 -->
        <div class="third-party-login">
            <!-- QQ登录按钮 -->
            <div class="third-party-btn qq-btn" onclick="showQQLogin()">
                <i class="fab fa-qq"></i>
                <span>QQ</span>
            </div>
            <!-- 微信登录按钮 -->
            <div class="third-party-btn wechat-btn" onclick="showWechatLogin()">
                <i class="fab fa-weixin"></i>
                <span>微信</span>
            </div>
        </div>
    </div>

    <!-- QQ登录弹窗 -->
    <div id="qqLoginModal" class="modal" style="display: none;">
        <div class="modal-content">
            <div class="modal-header">
                <h3>QQ扫码登录</h3>
                <span class="close" onclick="closeQQLogin()">&times;</span>
            </div>
            <div class="modal-body">
                <div id="qqQRCode" style="text-align: center; padding: 20px;">
                    <p>请使用QQ扫描二维码登录</p>
                    <div style="height: 200px; background: #f5f5f5; display: flex; align-items: center; justify-content: center; border-radius: 8px; color: #999;">
                        二维码区域
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 微信登录弹窗 -->
    <div id="wechatLoginModal" class="modal" style="display: none;">
        <div class="modal-content">
            <div class="modal-header">
                <h3>微信扫码登录</h3>
                <span class="close" onclick="closeWechatLogin()">&times;</span>
            </div>
            <div class="modal-body">
                <div id="wechatQRCode" style="text-align: center; padding: 20px;">
                    <p>请使用微信扫描二维码登录</p>
                    <div style="height: 200px; background: #f5f5f5; display: flex; align-items: center; justify-content: center; border-radius: 8px; color: #999;">
                        二维码区域
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- 引入JavaScript文件 -->
<script src="https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js"></script>
<script type="module" src="${pageContext.request.contextPath}/static/script/login.js"></script>
</body>
</html>