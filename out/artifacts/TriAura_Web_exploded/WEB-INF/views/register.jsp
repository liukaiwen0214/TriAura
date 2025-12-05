<%--
  Created by IntelliJ IDEA.
  User: liukaiwen
  Date: 2025/11/17
  Time: 10:05
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8"%>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>注册 - 三分之境</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/static/css/register.css">
</head>
<body>
<div class="login-container">
    <div class="login-header">
        <h1>TriAura</h1>
    </div>

    <div class="login-form">
        <form id="registerForm">
            <div class="form-group">
                <label for="username">用户名</label>
                <input type="text" id="username" class="form-control" placeholder="请输入用户名" required>
                <div id="usernameError" class="error-message">用户名长度至少3位，只能包含字母、数字和下划线</div>
            </div>

            <div class="form-group">
                <label for="email">邮箱</label>
                <input type="email" id="email" class="form-control" placeholder="请输入邮箱地址" required>
                <div id="emailError" class="error-message">请输入有效的邮箱地址</div>
            </div>

            <div class="form-group">
                <label for="password">密码</label>
                <div class="password-container">
                    <input type="password" id="password" class="form-control" placeholder="请输入密码" required>
                    <i class="toggle-password fas fa-eye-slash" onclick="togglePasswordVisibility()"></i>
                </div>
                <div id="passwordError" class="error-message">密码长度至少8位，需包含字母和数字</div>
            </div>

            <div class="form-group">
                <label for="confirmPassword">确认密码</label>
                <div class="password-container">
                    <input type="password" id="confirmPassword" class="form-control" placeholder="请再次输入密码"
                           required>
                    <i class="toggle-password fas fa-eye-slash" onclick="toggleConfirmPasswordVisibility()"></i>
                </div>
                <div id="confirmPasswordError" class="error-message">两次输入的密码不一致</div>
            </div>


            <div class="form-group">
                <label class="checkbox-container">
                    <input type="checkbox" id="agreement" required>
                    <span class="checkmark"></span>
                    我已阅读并同意 <a href="#" target="_blank">服务条款</a> 和 <a href="#" target="_blank">隐私政策</a>
                </label>
                <div id="agreementError" class="error-message">请同意服务条款和隐私政策</div>
            </div>

            <button type="submit" class="btn btn-primary" id="registerButton">
                <span id="registerText">注册</span>
                <span id="registerSpinner" class="loading-spinner" style="display: none;"></span>
            </button>

            <button type="button" class="btn btn-secondary" id="loginButton">
                返回登录
            </button>
        </form>

        <div class="divider">
            <span>其他方式</span>
        </div>

        <div class="third-party-login">
            <div class="third-party-btn qq-btn" onclick="showQQRegister()">
                <i class="fab fa-qq"></i>
                <span>QQ</span>
            </div>
            <div class="third-party-btn wechat-btn" onclick="showWechatRegister()">
                <i class="fab fa-weixin"></i>
                <span>微信</span>
            </div>
        </div>
    </div>

    <div id="qqRegisterModal" class="modal" style="display: none;">
        <div class="modal-content">
            <div class="modal-header">
                <h3>QQ扫码注册</h3>
                <span class="close" onclick="closeQQRegister()">&times;</span>
            </div>
            <div class="modal-body">
                <div id="qqQRCode" style="text-align: center; padding: 20px;">
                    <p>请使用QQ扫描二维码注册</p>
                    <div style="height: 200px; background: #f5f5f5; display: flex; align-items: center; justify-content: center; border-radius: 8px; color: #999;">
                        二维码区域
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div id="wechatRegisterModal" class="modal" style="display: none;">
        <div class="modal-content">
            <div class="modal-header">
                <h3>微信扫码注册</h3>
                <span class="close" onclick="closeWechatRegister()">&times;</span>
            </div>
            <div class="modal-body">
                <div id="wechatQRCode" style="text-align: center; padding: 20px;">
                    <p>请使用微信扫描二维码注册</p>
                    <div style="height: 200px; background: #f5f5f5; display: flex; align-items: center; justify-content: center; border-radius: 8px; color: #999;">
                        二维码区域
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="${pageContext.request.contextPath}/static/script/register.js"></script>
</div>
</body>
</html>
