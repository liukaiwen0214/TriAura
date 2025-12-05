// 个人资料页面特定功能
document.addEventListener('DOMContentLoaded', function () {
    getUserInformation();
    // 头像编辑功能
    const avatarEditBtn = document.querySelector('.avatar-edit-btn');
    if (avatarEditBtn) {
        avatarEditBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            alert('头像编辑功能尚未实现');
        });
    }

    // 表单保存功能
    const saveBtn = document.querySelector('.btn-primary');
    if (saveBtn) {
        saveBtn.addEventListener('click', function () {
            // 模拟保存成功
            showSuccessMessage('个人资料已成功保存');
        });
    }

    // 取消按钮功能
    const cancelBtn = document.querySelector('.btn-secondary');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function () {
            // 可以在这里添加取消确认逻辑
            if (confirm('确定要取消修改吗？未保存的更改将会丢失。')) {
                // 重新加载页面或重置表单
                location.reload();
            }
        });
    }

    // 弹窗相关元素
    const changePasswordModal = document.getElementById('changePasswordModal');
    const bindPhoneModal = document.getElementById('bindPhoneModal');
    const securityOptions = document.querySelectorAll('.security-option');
    const modalCloses = document.querySelectorAll('.modal-close');
    const modalCancels = document.querySelectorAll('.modal-cancel');
    const modalOverlays = document.querySelectorAll('.modal-overlay');

    // 安全设置按钮功能
    securityOptions.forEach((option, index) => {
        const btn = option.querySelector('.btn');
        if (btn) {
            btn.addEventListener('click', function () {
                if (index === 0) { // 修改密码按钮
                    openModal(changePasswordModal);
                } else if (index === 1) { // 绑定手机按钮
                    openModal(bindPhoneModal);
                } else {
                    alert('该功能尚未实现');
                }
            });
        }
    });

    // 打开弹窗函数
    function openModal(modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // 防止背景滚动
    }

    // 关闭弹窗函数
    function closeModal(modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // 恢复背景滚动
    }

    // 点击关闭按钮关闭弹窗
    modalCloses.forEach(closeBtn => {
        closeBtn.addEventListener('click', function () {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });

    // 点击取消按钮关闭弹窗
    modalCancels.forEach(cancelBtn => {
        cancelBtn.addEventListener('click', function () {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });

    // 点击遮罩层关闭弹窗
    modalOverlays.forEach(overlay => {
        overlay.addEventListener('click', function () {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });

    // 防止点击弹窗内容时关闭弹窗
    const modalContents = document.querySelectorAll('.modal-content');
    modalContents.forEach(content => {
        content.addEventListener('click', function (e) {
            e.stopPropagation();
        });
    });

    // 获取验证码按钮功能
    const sendCodeBtn = document.getElementById('sendCodeBtn');
    if (sendCodeBtn) {
        sendCodeBtn.addEventListener('click', function () {
            const phoneNumber = document.getElementById('phoneNumber').value;

            if (!phoneNumber || !/^1[3-9]\d{9}$/.test(phoneNumber)) {
                alert('请输入有效的手机号码');
                return;
            }

            // 模拟发送验证码
            showSuccessMessage('验证码已发送');

            // 倒计时功能
            let countdown = 60;
            sendCodeBtn.disabled = true;
            sendCodeBtn.textContent = `${countdown}秒后重新获取`;

            const timer = setInterval(() => {
                countdown--;
                sendCodeBtn.textContent = `${countdown}秒后重新获取`;

                if (countdown <= 0) {
                    clearInterval(timer);
                    sendCodeBtn.disabled = false;
                    sendCodeBtn.textContent = '获取验证码';
                }
            }, 1000);
        });
    }

    // 修改密码表单提交
    const changePasswordForm = document.getElementById('changePasswordForm');
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            // 验证逻辑
            if (!currentPassword) {
                alert('请输入当前密码');
                return;
            }

            if (!newPassword || newPassword.length < 8 || !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(newPassword)) {
                alert('新密码长度至少8位，必须包含字母和数字');
                return;
            }

            if (newPassword !== confirmPassword) {
                alert('两次输入的新密码不一致');
                return;
            }

            // 模拟密码修改成功
            showSuccessMessage('密码修改成功');
            closeModal(changePasswordModal);
            changePasswordForm.reset();
        });
    }

    // 绑定手机表单提交
    const bindPhoneForm = document.getElementById('bindPhoneForm');
    if (bindPhoneForm) {
        bindPhoneForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const phoneNumber = document.getElementById('phoneNumber').value;
            const verificationCode = document.getElementById('verificationCode').value;
            const phonePassword = document.getElementById('phonePassword').value;

            // 验证逻辑
            if (!phoneNumber || !/^1[3-9]\d{9}$/.test(phoneNumber)) {
                alert('请输入有效的手机号码');
                return;
            }

            if (!verificationCode || verificationCode.length !== 6 || !/^\d{6}$/.test(verificationCode)) {
                alert('请输入6位数字验证码');
                return;
            }

            if (!phonePassword) {
                alert('请输入账户密码');
                return;
            }

            // 模拟手机绑定成功
            showSuccessMessage('手机绑定成功');
            closeModal(bindPhoneModal);
            bindPhoneForm.reset();

            // 更新页面上显示的手机号码
            const phoneInfo = document.querySelector('.security-option:nth-child(2) .security-info p');
            if (phoneInfo) {
                const maskedPhone = phoneNumber.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
                phoneInfo.textContent = `当前状态：已绑定 ${maskedPhone}`;
            }
        });
    }

    // 显示成功消息的辅助函数
    function showSuccessMessage(message) {
        // 创建消息元素
        const messageElement = document.createElement('div');
        messageElement.className = 'success-message';
        messageElement.textContent = message;

        // 添加样式
        messageElement.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(40, 167, 69, 0.9);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            backdrop-filter: blur(4px);
            animation: slideIn 0.3s ease-out;
        `;

        // 添加动画
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);

        // 添加到页面
        document.body.appendChild(messageElement);

        // 3秒后移除
        setTimeout(() => {
            messageElement.remove();
            style.remove();
        }, 3000);
    }
});

async function getUserInformation() {
    const response = await fetch(requestUrl + '/user/info', {
        credentials: 'include' // 允许浏览器发送cookie
    });
    const data = await response.json();
    if (data.code === 200) {
        const user = data.data;
        // 更新页面上的用户信息
        const avatar = document.querySelector('.profile-avatar');
        // const doneTask = document.querySelector('.done-task');
        // const activeTask = document.querySelector('.active-task');
        // const completionRate = document.querySelector('.completion-rate');
        const username = document.querySelector('.profile-name');
        const email = document.querySelector('.profile-email');
        // const phone = document.querySelector('.profile-phone');
        if (avatar) {
            avatar.src = user.avatar_url;
        }
        if (username) {
            username.textContent = user.username;
            document.getElementById('username').value = user.username;
        }
        if (email) {
            email.value = user.email;
        }
    } else {
        console.log('用户未登录:', data.message);
        // 跳转到登录页面
        window.location.href = requestUrl;
    }
}
