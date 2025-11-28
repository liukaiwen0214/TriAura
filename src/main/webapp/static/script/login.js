/**
 * 登录页面JavaScript文件
 * 负责处理登录页面的表单验证、登录请求、动画效果和第三方登录等功能
 */

// 全局变量定义
const contextPath = window.location.pathname.split('/')[1];
const requestUrl = '/' + contextPath;

/**
 * 页面初始化函数
 * 绑定表单提交事件和添加输入框动画效果
 */
window.onload = function () {
    // 绑定表单提交事件
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', validateForm);

    // 添加输入框动画效果
    addInputAnimations();
};

/**
 * 输入框动画效果函数
 * 为所有表单输入框添加聚焦和失焦动画
 */
function addInputAnimations() {
    const inputs = document.querySelectorAll('.form-control');
    inputs.forEach(input => {
        // 聚焦时放大效果
        input.addEventListener('focus', function () {
            this.parentElement.style.transform = 'scale(1.02)';
        });

        // 失焦时恢复原大小
        input.addEventListener('blur', function () {
            this.parentElement.style.transform = 'scale(1)';
        });
    });
}

/**
 * 表单验证函数
 * 验证用户名和密码，通过后发送登录请求
 *
 * @param {Event} event - 表单提交事件
 */
function validateForm(event) {
    event.preventDefault(); // 阻止默认提交行为
    
    // 验证用户名和密码
    const isUsernameValid = validateUsername();
    const isPasswordValid = validatePassword();

    if (isUsernameValid && isPasswordValid) {
        // 显示加载状态
        document.getElementById('loginText').textContent = '登录中';
        document.getElementById('loginSpinner').style.display = 'inline-block';
        document.getElementById('loginButton').disabled = true;

        // 构建表单数据
        const formData = {
            email: document.getElementById('username').value,
            password: document.getElementById('password').value
        };
        
        // 延迟发送请求，模拟加载效果
        setTimeout(function () {
            // 发送登录请求
            fetch(requestUrl + '/user/login', {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                return response.json().then(data => {
                    if (data.code === 200) {
                        // 登录成功，跳转到主页面
                        window.location.href = requestUrl + '/user/tiraura';
                    } else {
                        // 登录失败，显示错误信息
                        console.log('登录失败:', data.message);
                        document.getElementById('loginText').textContent = '登录失败';
                        document.getElementById('loginSpinner').style.display = 'none';
                        document.getElementById('loginButton').disabled = false;

                        // 显示具体的错误信息
                        if (data.code === 1003) {
                            alert('邮箱或密码错误');
                        } else {
                            alert(data.message || '登录失败，请稍后重试');
                        }
                    }
                });
            }).catch(error => {
                // 处理请求异常
                console.error('请求错误:', error);
                document.getElementById('loginText').textContent = '登录失败';
                document.getElementById('loginSpinner').style.display = 'none';
                document.getElementById('loginButton').disabled = false;
            });
        }, 1500);
    }
}

/**
 * 注册按钮点击事件处理
 * 跳转到注册页面
 */
document.getElementById('registerButton').addEventListener('click', function () {
    window.location.href = requestUrl + '/user/register';
});

/**
 * 用户名验证函数
 * 验证邮箱或手机号格式是否正确
 *
 * @return {boolean} 验证通过返回true，否则返回false
 */
function validateUsername() {
    const username = document.getElementById('username').value;
    const errorElement = document.getElementById('usernameError');
    const inputElement = document.getElementById('username');

    // 邮箱和手机号正则表达式
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^1[3-9]\d{9}$/;

    if (!username || !(emailRegex.test(username) || phoneRegex.test(username))) {
        // 验证失败，显示错误信息
        errorElement.style.display = 'block';
        inputElement.classList.add('error');
        inputElement.classList.remove('success');
        return false;
    } else {
        // 验证通过，隐藏错误信息
        errorElement.style.display = 'none';
        inputElement.classList.remove('error');
        inputElement.classList.add('success');
        return true;
    }
}

/**
 * 密码验证函数
 * 验证密码长度是否至少8位
 *
 * @return {boolean} 验证通过返回true，否则返回false
 */
function validatePassword() {
    const password = document.getElementById('password').value;
    const errorElement = document.getElementById('passwordError');
    const inputElement = document.getElementById('password');

    if (!password || password.length < 8) {
        // 验证失败，显示错误信息
        errorElement.style.display = 'block';
        inputElement.classList.add('error');
        inputElement.classList.remove('success');
        return false;
    } else {
        // 验证通过，隐藏错误信息
        errorElement.style.display = 'none';
        inputElement.classList.remove('error');
        inputElement.classList.add('success');
        return true;
    }
}

/**
 * 密码可见性切换函数
 * 切换密码输入框的可见性
 */
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.querySelector('.toggle-password');

    if (passwordInput.type === 'password') {
        // 切换为明文显示
        passwordInput.type = 'text';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    } else {
        // 切换为密码显示
        passwordInput.type = 'password';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    }
}

/**
 * 显示QQ登录弹窗
 * 模拟生成QQ登录二维码
 */
function showQQLogin() {
    const modal = document.getElementById('qqLoginModal');
    const qqQRCode = document.getElementById('qqQRCode');

    // 模拟生成QQ二维码
    qqQRCode.innerHTML = '<p>请使用QQ扫描二维码登录</p><div style="height: 200px; background: #f0f0f0; display: flex; align-items: center; justify-content: center; border-radius: 8px;">QQ登录二维码</div>';
    modal.style.display = 'block';
}

/**
 * 关闭QQ登录弹窗
 */
function closeQQLogin() {
    document.getElementById('qqLoginModal').style.display = 'none';
}

/**
 * 显示微信登录弹窗
 * 模拟生成微信登录二维码
 */
function showWechatLogin() {
    const modal = document.getElementById('wechatLoginModal');
    const wechatQRCode = document.getElementById('wechatQRCode');

    // 模拟生成微信二维码
    wechatQRCode.innerHTML = '<p>请使用微信扫描二维码登录</p><div style="height: 200px; background: #f0f0f0; display: flex; align-items: center; justify-content: center; border-radius: 8px;">微信登录二维码</div>';
    modal.style.display = 'block';
}

/**
 * 关闭微信登录弹窗
 */
function closeWechatLogin() {
    document.getElementById('wechatLoginModal').style.display = 'none';
}

/**
 * 点击外部关闭弹窗
 * 点击弹窗外部区域关闭弹窗
 *
 * @param {Event} event - 点击事件
 */
window.onclick = function (event) {
    const qqModal = document.getElementById('qqLoginModal');
    const wechatModal = document.getElementById('wechatLoginModal');

    if (event.target === qqModal) {
        closeQQLogin();
    }

    if (event.target === wechatModal) {
        closeWechatLogin();
    }
}