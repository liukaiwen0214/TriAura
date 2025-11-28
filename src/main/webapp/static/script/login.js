
const contextPath = window.location.pathname.split('/')[1];

const requestUrl = '/' + contextPath;

window.onload = function () {
    
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', validateForm);

    
    addInputAnimations();
};


function addInputAnimations() {
    const inputs = document.querySelectorAll('.form-control');
    inputs.forEach(input => {
        input.addEventListener('focus', function () {
            this.parentElement.style.transform = 'scale(1.02)';
        });

        input.addEventListener('blur', function () {
            this.parentElement.style.transform = 'scale(1)';
        });
    });
}


function validateForm(event) {
    event.preventDefault(); 
    const isUsernameValid = validateUsername();
    const isPasswordValid = validatePassword();

    if (isUsernameValid && isPasswordValid) {
        
        document.getElementById('loginText').textContent = '登录中';
        document.getElementById('loginSpinner').style.display = 'inline-block';
        document.getElementById('loginButton').disabled = true;

        
        const formData = {
            email: document.getElementById('username').value,
            password: document.getElementById('password').value
        }
        
        setTimeout(function () {
            
            fetch(requestUrl + '/user/login', {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                return response.json().then(data => {
                    if (data.code === 200) {
                        window.location.href = requestUrl + '/user/tiraura';
                    } else {
                        console.log('登录失败:', data.message);
                        document.getElementById('loginText').textContent = '登录失败';
                        document.getElementById('loginSpinner').style.display = 'none';
                        document.getElementById('loginButton').disabled = false;

                        
                        if (data.code === 1003) {
                            alert('邮箱或密码错误');
                        } else {
                            alert(data.message || '登录失败，请稍后重试');
                        }
                    }
                });
            }).catch(error => {
                console.error('请求错误:', error);
                document.getElementById('loginText').textContent = '登录失败';
                document.getElementById('loginSpinner').style.display = 'none';
                document.getElementById('loginButton').disabled = false;
            });
        }, 1500);
    }
}


document.getElementById('registerButton').addEventListener('click', function () {
    window.location.href = requestUrl + '/user/register';
});


function validateUsername() {
    const username = document.getElementById('username').value;
    const errorElement = document.getElementById('usernameError');
    const inputElement = document.getElementById('username');

    
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


function showQQLogin() {
    
    const modal = document.getElementById('qqLoginModal');
    const qqQRCode = document.getElementById('qqQRCode');

    
    qqQRCode.innerHTML = '<p>请使用QQ扫描二维码登录</p><div style="height: 200px; background: #f0f0f0; display: flex; align-items: center; justify-content: center; border-radius: 8px;">QQ登录二维码</div>';
    modal.style.display = 'block';
}


function closeQQLogin() {
    document.getElementById('qqLoginModal').style.display = 'none';
}


function showWechatLogin() {
    
    const modal = document.getElementById('wechatLoginModal');
    const wechatQRCode = document.getElementById('wechatQRCode');

    
    wechatQRCode.innerHTML = '<p>请使用微信扫描二维码登录</p><div style="height: 200px; background: #f0f0f0; display: flex; align-items: center; justify-content: center; border-radius: 8px;">微信登录二维码</div>';
    modal.style.display = 'block';
}


function closeWechatLogin() {
    document.getElementById('wechatLoginModal').style.display = 'none';
}


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