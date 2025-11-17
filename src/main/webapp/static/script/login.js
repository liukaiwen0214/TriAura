// 获取当前页面的上下文路径
const contextPath = window.location.pathname.split('/')[1];
// 拼接完整的请求URL
const requestUrl = '/' + contextPath;
// 初始化验证码
window.onload = function() {
    // 添加表单提交事件监听器
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', validateForm);

    // 添加输入框动画效果
    addInputAnimations();
};

// 添加输入框动画效果
function addInputAnimations() {
    const inputs = document.querySelectorAll('.form-control');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
        });

        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });
}

// 修改验证函数，不再需要return语句
function validateForm(event) {
    event.preventDefault(); // 阻止默认提交行为
    const isUsernameValid = validateUsername();
    const isPasswordValid = validatePassword();

    if (isUsernameValid && isPasswordValid) {
        // 显示加载状态
        document.getElementById('loginText').textContent = '登录中';
        document.getElementById('loginSpinner').style.display = 'inline-block';
        document.getElementById('loginButton').disabled = true;

        // 创建表单数据对象
        const formData = {
            email: document.getElementById('username').value,
            password: document.getElementById('password').value
        }
        // 模拟登录请求
        setTimeout(function() {
            fetch(requestUrl + '/user/login', {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    console.log('登录成功，准备跳转到首页');
                    window.location.href = requestUrl + '/user/register';
                } else {
                    console.log('登录失败');
                    // 显示错误信息
                    document.getElementById('loginText').textContent = '登录失败';
                    document.getElementById('loginSpinner').style.display = 'none';
                    document.getElementById('loginButton').disabled = false;
                }
            }).catch(error => {
                console.error('请求错误:', error);
                document.getElementById('loginText').textContent = '登录失败';
                document.getElementById('loginSpinner').style.display = 'none';
                document.getElementById('loginButton').disabled = false;
            });
        }, 1500);
    }
}
// ... existing code ...
// 注册按钮点击事件
document.getElementById('registerButton').addEventListener('click', function() {
    window.location.href = requestUrl + '/user/register';
});

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