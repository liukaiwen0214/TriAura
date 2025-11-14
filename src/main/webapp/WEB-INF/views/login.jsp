<%--
  Created by IntelliJ IDEA.
  User: liukaiwen
  Date: 2025/11/14
  Time: 10:30
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8"%>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>登录 - 三分之境</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- 引入自定义CSS -->
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/static/css/login.css">
</head>
<body>
<div class="login-container">
    <div class="login-header">
        <h1>欢迎回到三分之境</h1>
        <p>请登录您的账号以继续</p>
    </div>

    <div class="login-form">
        <form id="loginForm">
            <!-- 账号输入 -->
            <div class="form-group">
                <label for="username">账号</label>
                <input
                        type="text"
                        id="username"
                        class="form-control"
                        placeholder="请输入邮箱或手机号"
                        required
                        onblur="validateUsername()"
                >
                <div id="usernameError" class="error-message">请输入有效的邮箱或手机号</div>
            </div>

            <!-- 密码输入 -->
            <div class="form-group">
                <label for="password">密码</label>
                <div class="password-container">
                    <input
                            type="password"
                            id="password"
                            class="form-control"
                            placeholder="请输入密码"
                            required
                            onblur="validatePassword()"
                    >
                    <i class="toggle-password fas fa-eye-slash" onclick="togglePasswordVisibility()"></i>
                </div>
                <div id="passwordError" class="error-message">密码长度至少8位</div>
            </div>

            <!-- 忘记密码链接 -->
            <div class="forgot-password">
                <a href="#">忘记密码？</a>
            </div>

            <!-- 验证码 -->
            <div class="form-group">
                <label for="captcha">验证码</label>
                <div class="captcha-container">
                    <input
                            type="text"
                            id="captcha"
                            class="form-control captcha-input"
                            placeholder="请输入验证码"
                            required
                            maxlength="4"
                    >
                    <img
                            src="#"
                            alt="验证码"
                            class="captcha-image"
                            onclick="refreshCaptcha()"
                            title="点击刷新验证码"
                    >
                </div>
                <div id="captchaError" class="error-message">请输入正确的验证码</div>
            </div>

            <!-- 登录按钮 -->
            <button
                    type="submit"
                    class="btn btn-primary"
                    id="loginButton"
            >
                <span id="loginText">登录</span>
                <span id="loginSpinner" class="loading-spinner" style="display: none;"></span>
            </button>

            <!-- 注册按钮 -->
            <button
                    type="button"
                    class="btn btn-secondary"
                    onclick="window.location.href='/register'"
            >
                注册账号
            </button>
        </form>

        <!-- 分隔线 -->
        <div class="divider">
            <span>其他登录方式</span>
        </div>

        <!-- 第三方登录 -->
        <div class="third-party-login">
            <div class="third-party-btn qq-btn" onclick="showQQLogin()">
                <i class="fab fa-qq"></i>
                <span>QQ扫码登录</span>
            </div>
            <div class="third-party-btn wechat-btn" onclick="showWechatLogin()">
                <i class="fab fa-weixin"></i>
                <span>微信扫码登录</span>
            </div>
        </div>
    </div>
</div>

<!-- QQ登录弹窗 -->
<div id="qqLoginModal" class="modal" style="display: none;">
    <div class="modal-content">
        <span class="close" onclick="closeQQLogin()">&times;</span>
        <div class="modal-body">
            <h3>QQ扫码登录</h3>
            <div id="qqQRCode" style="text-align: center; padding: 20px;">
                <!-- QQ二维码将在这里生成 -->
                <p>QQ登录二维码加载中...</p>
            </div>
        </div>
    </div>
</div>

<!-- 微信登录弹窗 -->
<div id="wechatLoginModal" class="modal" style="display: none;">
    <div class="modal-content">
        <span class="close" onclick="closeWechatLogin()">&times;</span>
        <div class="modal-body">
            <h3>微信扫码登录</h3>
            <div id="wechatQRCode" style="text-align: center; padding: 20px;">
                <!-- 微信二维码将在这里生成 -->
                <p>微信登录二维码加载中...</p>
            </div>
        </div>
    </div>
</div>
<!-- 引入JavaScript -->
<script src="https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js"></script>
<script type="module" src="${pageContext.request.contextPath}/static/script/login.js"></script>
</body>
</html>