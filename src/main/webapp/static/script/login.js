// 初始化验证码
window.onload = function() {
    refreshCaptcha();
    // 添加表单提交事件监听器
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', validateForm);
};

// 修改验证函数，不再需要return语句
function validateForm(event) {
    event.preventDefault(); // 阻止默认提交行为
    const isUsernameValid = validateUsername();
    const isPasswordValid = validatePassword();
    const isCaptchaValid = validateCaptcha();

    if (isUsernameValid && isPasswordValid && isCaptchaValid) {
        // 显示加载状态
        document.getElementById('loginText').textContent = '登录中';
        document.getElementById('loginSpinner').style.display = 'inline-block';
        document.getElementById('loginButton').disabled = true;

        // 模拟登录请求
        setTimeout(function() {
            // 这里应该是实际的登录请求
            console.log('登录成功，准备跳转到首页');
            window.location.href = '/index';
        }, 1500);
    }
}

// 验证邮箱或手机号
function validateUsername() {
    const username = document.getElementById('username').value;
    const errorElement = document.getElementById('usernameError');
    const inputElement = document.getElementById('username');

    // 邮箱或手机号正则表达式
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^1[3-9]\d{9}$/;

    if (!username || !(emailRegex.test(username) || phoneRegex.test(username))) {
        errorElement.style.display = 'block';
        inputElement.classList.add('error');
        inputElement.classList.remove('success');
        return false;
    } else {
        errorElement.style.display = 'none';
        inputElement.classList.remove('error');
        inputElement.classList.add('success');
        return true;
    }
}

// 验证密码
function validatePassword() {
    const password = document.getElementById('password').value;
    const errorElement = document.getElementById('passwordError');
    const inputElement = document.getElementById('password');

    if (!password || password.length < 8) {
        errorElement.style.display = 'block';
        inputElement.classList.add('error');
        inputElement.classList.remove('success');
        return false;
    } else {
        errorElement.style.display = 'none';
        inputElement.classList.remove('error');
        inputElement.classList.add('success');
        return true;
    }
}

// 验证验证码
function validateCaptcha() {
    const captcha = document.getElementById('captcha').value;
    const errorElement = document.getElementById('captchaError');
    const inputElement = document.getElementById('captcha');

    if (!captcha || captcha.length !== 4) {
        errorElement.style.display = 'block';
        inputElement.classList.add('error');
        return false;
    } else {
        errorElement.style.display = 'none';
        inputElement.classList.remove('error');
        return true;
    }
}

// 切换密码可见性
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.querySelector('.toggle-password');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    }
}

// 刷新验证码
function refreshCaptcha() {
    const captchaImage = document.querySelector('.captcha-image');
    // 这里应该调用后端接口生成验证码
    // 暂时使用随机数模拟
    captchaImage.src = '#' + Math.random();
    // 实际项目中替换为真实的验证码生成接口
    captchaImage.alt = '验证码：' + Math.floor(1000 + Math.random() * 9000);
}


// 显示QQ登录弹窗
function showQQLogin() {
    // 这里应该调用QQ登录API获取二维码
    const modal = document.getElementById('qqLoginModal');
    const qqQRCode = document.getElementById('qqQRCode');

    // 模拟生成QQ二维码
    qqQRCode.innerHTML = '<p>请使用QQ扫描二维码登录</p><div style="height: 200px; background: #f0f0f0; display: flex; align-items: center; justify-content: center; border-radius: 8px;">QQ登录二维码</div>';
    modal.style.display = 'block';
}

// 关闭QQ登录弹窗
function closeQQLogin() {
    document.getElementById('qqLoginModal').style.display = 'none';
}

// 显示微信登录弹窗
function showWechatLogin() {
    // 这里应该调用微信登录API获取二维码
    const modal = document.getElementById('wechatLoginModal');
    const wechatQRCode = document.getElementById('wechatQRCode');

    // 模拟生成微信二维码
    wechatQRCode.innerHTML = '<p>请使用微信扫描二维码登录</p><div style="height: 200px; background: #f0f0f0; display: flex; align-items: center; justify-content: center; border-radius: 8px;">微信登录二维码</div>';
    modal.style.display = 'block';
}

// 关闭微信登录弹窗
function closeWechatLogin() {
    document.getElementById('wechatLoginModal').style.display = 'none';
}

// 为弹窗添加点击外部关闭功能
window.onclick = function(event) {
    const qqModal = document.getElementById('qqLoginModal');
    const wechatModal = document.getElementById('wechatLoginModal');

    if (event.target === qqModal) {
        closeQQLogin();
    }

    if (event.target === wechatModal) {
        closeWechatLogin();
    }
}