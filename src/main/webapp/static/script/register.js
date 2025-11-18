// 获取当前页面的上下文路径
const contextPath = window.location.pathname.split('/')[1];
// 拼接完整的请求URL
const requestUrl = '/' + contextPath;

// 注册表单验证和交互
class RegisterForm {
    constructor() {
        this.form = document.getElementById('registerForm');
        this.usernameInput = document.getElementById('username');
        this.emailInput = document.getElementById('email');
        this.passwordInput = document.getElementById('password');
        this.confirmPasswordInput = document.getElementById('confirmPassword');
        this.agreementCheckbox = document.getElementById('agreement');
        this.registerButton = document.getElementById('registerButton');
        this.registerText = document.getElementById('registerText');
        this.registerSpinner = document.getElementById('registerSpinner');
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupRealTimeValidation();
    }

    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // 密码可见性切换
        window.togglePasswordVisibility = () => this.togglePasswordVisibility();
        window.toggleConfirmPasswordVisibility = () => this.toggleConfirmPasswordVisibility();

        // 第三方注册
        window.showQQRegister = () => this.showQQRegister();
        window.closeQQRegister = () => this.closeQQRegister();
        window.showWechatRegister = () => this.showWechatRegister();
        window.closeWechatRegister = () => this.closeWechatRegister();
    }

    setupRealTimeValidation() {
        // 用户名实时验证
        this.usernameInput.addEventListener('blur', () => this.validateUsername());
        this.usernameInput.addEventListener('input', () => this.hideError('usernameError'));

        // 邮箱实时验证
        this.emailInput.addEventListener('blur', () => this.validateEmail());
        this.emailInput.addEventListener('input', () => this.hideError('emailError'));

        // 密码实时验证
        this.passwordInput.addEventListener('blur', () => this.validatePassword());
        this.passwordInput.addEventListener('input', () => this.hideError('passwordError'));

        // 确认密码实时验证
        this.confirmPasswordInput.addEventListener('blur', () => this.validateConfirmPassword());
        this.confirmPasswordInput.addEventListener('input', () => this.hideError('confirmPasswordError'));

        // 协议勾选
        this.agreementCheckbox.addEventListener('change', () => this.hideError('agreementError'));
    }

    // 验证方法
    validateUsername() {
        const username = this.usernameInput.value.trim();

        if (username.length < 3) {
            this.showError('usernameError', '用户名长度至少3位');
            return false;
        }

        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            this.showError('usernameError', '用户名只能包含字母、数字和下划线');
            return false;
        }

        return true;
    }

    validateEmail() {
        const email = this.emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            this.showError('emailError', '请输入有效的邮箱地址');
            return false;
        }

        return true;
    }

    validatePassword() {
        const password = this.passwordInput.value;

        if (password.length < 8) {
            this.showError('passwordError', '密码长度至少8位');
            return false;
        }

        if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(password)) {
            this.showError('passwordError', '密码需包含字母和数字');
            return false;
        }

        return true;
    }

    validateConfirmPassword() {
        const password = this.passwordInput.value;
        const confirmPassword = this.confirmPasswordInput.value;

        if (password !== confirmPassword) {
            this.showError('confirmPasswordError', '两次输入的密码不一致');
            return false;
        }

        return true;
    }

    validateAgreement() {
        if (!this.agreementCheckbox.checked) {
            this.showError('agreementError', '请同意服务条款和隐私政策');
            return false;
        }
        return true;
    }

    // 密码可见性切换
    togglePasswordVisibility() {
        const toggleIcon = this.passwordInput.nextElementSibling;
        const type = this.passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        this.passwordInput.setAttribute('type', type);

        if (type === 'password') {
            toggleIcon.classList.remove('fa-eye');
            toggleIcon.classList.add('fa-eye-slash');
        } else {
            toggleIcon.classList.remove('fa-eye-slash');
            toggleIcon.classList.add('fa-eye');
        }
    }

    toggleConfirmPasswordVisibility() {
        const toggleIcon = this.confirmPasswordInput.nextElementSibling;
        const type = this.confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        this.confirmPasswordInput.setAttribute('type', type);

        if (type === 'password') {
            toggleIcon.classList.remove('fa-eye');
            toggleIcon.classList.add('fa-eye-slash');
        } else {
            toggleIcon.classList.remove('fa-eye-slash');
            toggleIcon.classList.add('fa-eye');
        }
    }


    // 第三方注册
    showQQRegister() {
        document.getElementById('qqRegisterModal').style.display = 'flex';
    }

    closeQQRegister() {
        document.getElementById('qqRegisterModal').style.display = 'none';
    }

    showWechatRegister() {
        document.getElementById('wechatRegisterModal').style.display = 'flex';
    }

    closeWechatRegister() {
        document.getElementById('wechatRegisterModal').style.display = 'none';
    }

    // 错误处理
    showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    hideError(elementId) {
        const errorElement = document.getElementById(elementId);
        errorElement.style.display = 'none';
    }

    // 表单提交
    async handleSubmit(e) {
        e.preventDefault();

        // 验证所有字段
        const isValid = this.validateUsername() &&
            this.validateEmail() &&
            this.validatePassword() &&
            this.validateConfirmPassword() &&
            this.validateAgreement();

        if (!isValid) {
            return;
        }

        // 显示加载状态
        this.registerButton.disabled = true;
        this.registerText.style.display = 'none';
        this.registerSpinner.style.display = 'inline-block';

        const formData = {
            username: this.usernameInput.value.trim(),
            email: this.emailInput.value.trim(),
            password: this.passwordInput.value,
        }

        try {
            const response = await fetch(requestUrl+'/user/register/adduser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            
            if (data.code === 200) {
                // 注册成功
                console.log("注册成功", data);
                console.log('用户ID:', data.data.userId);
                console.log('用户名:', data.data.username);
                console.log('邮箱:', data.data.email);
                this.showSuccessMessage('注册成功！正在跳转到登录页面...');
                setTimeout(() => {
                    window.location.href = requestUrl;
                }, 2000);
            } else {
                // 注册失败
                console.log('注册失败:', data.message);

                if (data.code === 1002) {
                    // 用户已存在
                    if (data.message.includes('邮箱')) {
                        this.showError('emailError', '该邮箱已被注册');
                    } else if (data.message.includes('用户名')) {
                        this.showError('usernameError', '该用户名已被使用');
                    }
                } else {
                    alert(data.message || '注册失败，请稍后重试');
                }

                // 恢复按钮状态
                this.registerButton.disabled = false;
                this.registerText.style.display = 'inline';
                this.registerSpinner.style.display = 'none';
            }
        } catch (error) {
            console.error('请求错误:', error);
            alert('网络错误，请稍后重试');
            
            // 恢复按钮状态
            this.registerButton.disabled = false;
            this.registerText.style.display = 'inline';
            this.registerSpinner.style.display = 'none';
        }
    }

    showSuccessMessage(message) {
        // 创建成功提示
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `
            <div style="background: #28a745; color: white; padding: 12px; border-radius: 6px; margin-bottom: 16px; text-align: center;">
                <i class="fas fa-check-circle"></i> ${message}
            </div>
        `;

        this.form.insertBefore(successDiv, this.form.firstChild);

        // 3秒后移除提示
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.parentNode.removeChild(successDiv);
            }
        }, 3000);
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new RegisterForm();
});
document.getElementById('loginButton').addEventListener('click', function () {
    window.location.href = requestUrl;
});