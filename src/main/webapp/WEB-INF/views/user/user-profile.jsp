<%--
  Created by IntelliJ IDEA.
  User: lkwyo
  Date: 2025/11/23
  Time: 15:53
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TriAura - 个人资料</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/static/css/tiraura.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/static/css/user/user-profile.css">
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
                <h1>个人资料</h1>
                <p>管理您的个人信息和账户设置</p>
            </div>
        </section>

        <!-- 个人信息展示区域 -->
        <section class="profile-section">
            <div class="profile-header">
                <div class="profile-avatar-container">
                    <img src="" alt="用户头像" class="profile-avatar">
                    <button class="avatar-edit-btn" aria-label="编辑头像">
                        <i class="fas fa-camera"></i>
                    </button>
                </div>

                <div class="profile-info">
                    <h2 class="profile-name">用户名称</h2>
                    <p class="profile-title">TriAura平台用户</p>

                    <div class="profile-stats">
                        <div class="profile-stat">
                            <div class="stat-value done-task">10</div>
                            <div class="stat-label">已完成任务</div>
                        </div>
                        <div class="profile-stat">
                            <div class="stat-value active-task">5</div>
                            <div class="stat-label">进行中任务</div>
                        </div>
                        <div class="profile-stat">
                            <div class="stat-value completion-rate">75%</div>
                            <div class="stat-label">完成率</div>
                        </div>
                    </div>
                </div>

                <div class="profile-actions">
                    <button class="btn btn-primary">
                        <i class="fas fa-save"></i>
                        <span>保存修改</span>
                    </button>
                    <button class="btn btn-secondary">
                        <i class="fas fa-undo"></i>
                        <span>取消</span>
                    </button>
                </div>
            </div>
        </section>

        <!-- 个人信息表单区域 -->
        <section class="profile-section">
            <h2 class="section-title">基本信息</h2>

            <form class="profile-form">
                <div class="form-group">
                    <label for="username" class="form-label">用户名</label>
                    <input type="text" id="username" class="form-input profile-name" placeholder="请输入用户名" value="用户名称">
                </div>

                <div class="form-group">
                    <label for="email" class="form-label">电子邮箱</label>
                    <input type="email" id="email" class="form-input profile-email" placeholder="请输入电子邮箱" value="user@example.com">
                </div>

<%--                <div class="form-group">--%>
<%--                    <label for="phone" class="form-label">手机号码</label>--%>
<%--                    <input type="tel" id="phone" class="form-input profile-phone" placeholder="请输入手机号码" value="138****8888">--%>
<%--                </div>--%>

<%--                <div class="form-group">--%>
<%--                    <label for="location" class="form-label">所在地</label>--%>
<%--                    <input type="text" id="location" class="form-input" placeholder="请输入所在地" value="未知">--%>
<%--                </div>--%>
            </form>
        </section>

        <!-- 安全设置区域 -->
        <section class="profile-section">
            <h2 class="section-title">账户安全</h2>

            <div class="security-options">
                <div class="security-option">
                    <div class="security-info">
                        <h3>修改密码</h3>
                        <p>定期更改密码以保障账户安全</p>
                    </div>
                    <button class="btn btn-secondary">更改</button>
                </div>

                <div class="security-option">
                    <div class="security-info">
                        <h3>绑定手机</h3>
                        <p>当前状态：已绑定 138****8888</p>
                    </div>
                    <button class="btn btn-secondary">更改</button>
                </div>

                <div class="security-option">
                    <div class="security-info">
                        <h3>两步验证</h3>
                        <p>开启后登录需要额外验证</p>
                    </div>
                    <button class="btn btn-secondary">开启</button>
                </div>

                <div class="security-option">
                    <div class="security-info">
                        <h3>登录历史</h3>
                        <p>查看最近的登录活动</p>
                    </div>
                    <button class="btn btn-secondary">查看</button>
                </div>
            </div>
        </section>

        <!-- 返回主页链接 -->
        <div class="back-to-home">
            <a href="tiraura.html" class="back-link">
                <i class="fas fa-arrow-left"></i>
                <span>返回主页</span>
            </a>
        </div>
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

<!-- 修改密码弹窗 -->
<div id="changePasswordModal" class="modal">
    <div class="modal-overlay"></div>
    <div class="modal-content">
        <div class="modal-header">
            <h3 class="modal-title">修改密码</h3>
            <button class="modal-close" aria-label="关闭">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <form id="changePasswordForm" class="modal-form">
            <div class="form-group">
                <label for="currentPassword" class="form-label">当前密码</label>
                <input type="password" id="currentPassword" class="form-input" placeholder="请输入当前密码" required>
            </div>
            <div class="form-group">
                <label for="newPassword" class="form-label">新密码</label>
                <input type="password" id="newPassword" class="form-input" placeholder="请输入新密码" required>
                <small style="color: #6c757d; font-size: 12px;">密码长度至少8位，包含字母和数字</small>
            </div>
            <div class="form-group">
                <label for="confirmPassword" class="form-label">确认新密码</label>
                <input type="password" id="confirmPassword" class="form-input" placeholder="请再次输入新密码" required>
            </div>
            <div class="modal-actions">
                <button type="button" class="btn btn-secondary modal-cancel">取消</button>
                <button type="submit" class="btn btn-primary">确认修改</button>
            </div>
        </form>
    </div>
</div>

<!-- 绑定手机弹窗 -->
<div id="bindPhoneModal" class="modal">
    <div class="modal-overlay"></div>
    <div class="modal-content">
        <div class="modal-header">
            <h3 class="modal-title">绑定手机</h3>
            <button class="modal-close" aria-label="关闭">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <form id="bindPhoneForm" class="modal-form">
            <div class="form-group">
                <label for="phoneNumber" class="form-label">手机号码</label>
                <div style="display: flex; gap: 12px; align-items: center;">
                    <input type="tel" id="phoneNumber" class="form-input" placeholder="请输入手机号码" required style="flex: 1;">
                    <button type="button" id="sendCodeBtn" class="btn-verify">获取验证码</button>
                </div>
            </div>
            <div class="form-group">
                <label for="verificationCode" class="form-label">验证码</label>
                <input type="text" id="verificationCode" class="form-input" placeholder="请输入验证码" required>
            </div>
            <div class="form-group">
                <label for="phonePassword" class="form-label">账户密码</label>
                <input type="password" id="phonePassword" class="form-input" placeholder="请输入账户密码" required>
            </div>
            <div class="modal-actions">
                <button type="button" class="btn btn-secondary modal-cancel">取消</button>
                <button type="submit" class="btn btn-primary">确认绑定</button>
            </div>
        </form>
    </div>
</div>

<script src="${pageContext.request.contextPath}/static/script/tiraura.js"></script>
<script src="${pageContext.request.contextPath}/static/script/user/user-profile.js"></script>
</body>
</html>
