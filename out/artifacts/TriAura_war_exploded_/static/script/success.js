/**
 * 成功页面交互脚本
 * 提供成功提示、自动跳转、倒计时等功能
 */

(function() {
    'use strict';

    let countdownTimer;
    let countdownValue = 3;
    let isCountdownActive = true;

    /**
     * 成功信息配置
     */
    const SuccessMessages = {
        'login': {
            title: '登录成功',
            message: '欢迎回来！',
            detail: '正在为您跳转到主页',
            nextText: '进入主页',
            nextUrl: '/',
            icon: 'fa-sign-in-alt'
        },
        'register': {
            title: '注册成功',
            message: '账号创建成功！',
            detail: '正在为您跳转到登录页面',
            nextText: '立即登录',
            nextUrl: '/login',
            icon: 'fa-user-plus'
        },
        'reset': {
            title: '重置成功',
            message: '密码重置成功！',
            detail: '请使用新密码登录',
            nextText: '去登录',
            nextUrl: '/login',
            icon: 'fa-key'
        },
        'update': {
            title: '更新成功',
            message: '信息更新成功！',
            detail: '您的更改已保存',
            nextText: '返回',
            nextUrl: null,
            icon: 'fa-save'
        },
        'delete': {
            title: '删除成功',
            message: '删除操作完成',
            detail: '所选项目已成功删除',
            nextText: '返回',
            nextUrl: null,
            icon: 'fa-trash'
        },
        'save': {
            title: '保存成功',
            message: '数据保存成功！',
            detail: '您的数据已安全保存',
            nextText: '继续',
            nextUrl: null,
            icon: 'fa-check-double'
        },
        'submit': {
            title: '提交成功',
            message: '表单提交成功！',
            detail: '您的申请正在处理中',
            nextText: '查看状态',
            nextUrl: null,
            icon: 'fa-paper-plane'
        },
        'payment': {
            title: '支付成功',
            message: '付款成功！',
            detail: '感谢您的购买',
            nextText: '查看订单',
            nextUrl: null,
            icon: 'fa-credit-card'
        },
        'upload': {
            title: '上传成功',
            message: '文件上传成功！',
            detail: '您的文件已保存',
            nextText: '继续',
            nextUrl: null,
            icon: 'fa-cloud-upload-alt'
        },
        'default': {
            title: '操作成功',
            message: '您的操作已成功完成',
            detail: '页面将自动跳转，或您可以手动操作',
            nextText: '继续',
            nextUrl: '/',
            icon: 'fa-check-circle'
        }
    };

    /**
     * 获取成功信息
     */
    function getSuccessInfo() {
        const urlParams = new URLSearchParams(window.location.search);
        const action = urlParams.get('action') || 'default';
        const nextUrl = urlParams.get('next') || null;
        const customTitle = urlParams.get('title') || '';
        const customMessage = urlParams.get('message') || '';
        const customDetail = urlParams.get('detail') || '';
        const countdownParam = urlParams.get('countdown');

        const successInfo = SuccessMessages[action] || SuccessMessages['default'];

        // 如果提供了自定义的nextUrl，使用它
        const finalNextUrl = nextUrl !== null ? nextUrl : successInfo.nextUrl;

        return {
            title: customTitle || successInfo.title,
            message: customMessage || successInfo.message,
            detail: customDetail || successInfo.detail,
            nextText: successInfo.nextText,
            nextUrl: finalNextUrl,
            icon: successInfo.icon,
            countdown: countdownParam !== null ? parseInt(countdownParam) : 3
        };
    }

    /**
     * 更新页面内容
     */
    function updateSuccessContent() {
        const successInfo = getSuccessInfo();
        const successTitle = document.getElementById('successTitle');
        const successMessage = document.getElementById('successMessage');
        const successDetail = document.getElementById('successDetail');
        const nextButton = document.getElementById('nextButton');
        const successIcon = document.querySelector('.success-icon i');

        if (successTitle) {
            successTitle.textContent = successInfo.title;
        }

        if (successMessage) {
            successMessage.textContent = successInfo.message;
        }

        if (successDetail) {
            successDetail.textContent = successInfo.detail;
        }

        if (nextButton && successInfo.nextUrl) {
            nextButton.innerHTML = `<i class="fas fa-arrow-right"></i> ${successInfo.nextText}`;
            nextButton.style.display = 'flex';
        } else if (nextButton) {
            nextButton.style.display = 'none';
        }

        if (successIcon) {
            successIcon.className = `fas ${successInfo.icon}`;
        }

        // 设置倒计时时间
        countdownValue = successInfo.countdown;
    }

    /**
     * 开始倒计时
     */
    function startCountdown() {
        if (!isCountdownActive || countdownValue <= 0) {
            return;
        }

        const countdownElement = document.getElementById('countdown');
        const countdownText = document.getElementById('countdownText');

        if (!countdownElement || !countdownText) {
            return;
        }

        countdownElement.style.display = 'block';
        countdownText.textContent = countdownValue;

        countdownTimer = setInterval(() => {
            countdownValue--;
            countdownText.textContent = countdownValue;

            if (countdownValue <= 0) {
                clearInterval(countdownTimer);
                goNext();
            }
        }, 1000);
    }

    /**
     * 停止倒计时
     */
    function stopCountdown() {
        if (countdownTimer) {
            clearInterval(countdownTimer);
            countdownTimer = null;
        }
        isCountdownActive = false;

        const countdownElement = document.getElementById('countdown');
        if (countdownElement) {
            countdownElement.style.display = 'none';
        }
    }

    /**
     * 继续下一步
     */
    function goNext() {
        stopCountdown();
        const successInfo = getSuccessInfo();

        if (successInfo.nextUrl) {
            window.location.href = successInfo.nextUrl;
        } else {
            // 如果没有指定跳转地址，返回上一页
            if (window.history.length > 1) {
                window.history.back();
            } else {
                window.location.href = '/';
            }
        }
    }

    /**
     * 返回首页
     */
    function goHome() {
        stopCountdown();
        window.location.href = '/';
    }

    /**
     * 刷新页面
     */
    function refreshPage() {
        stopCountdown();
        window.location.reload();
    }

    /**
     * 复制成功信息到剪贴板
     */
    function copySuccessInfo() {
        const successInfo = getSuccessInfo();
        const currentUrl = window.location.href;
        const timestamp = new Date().toLocaleString('zh-CN');

        const successText = `
成功信息：
标题：${successInfo.title}
消息：${successInfo.message}
详情：${successInfo.detail}

页面地址：${currentUrl}
时间：${timestamp}
        `.trim();

        if (navigator.clipboard) {
            navigator.clipboard.writeText(successText).then(() => {
                showToast('成功信息已复制到剪贴板');
            }).catch(() => {
                fallbackCopyText(successText);
            });
        } else {
            fallbackCopyText(successText);
        }
    }

    /**
     * 备用复制文本方法
     */
    function fallbackCopyText(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();

        try {
            document.execCommand('copy');
            showToast('成功信息已复制到剪贴板');
        } catch (err) {
            console.error('复制失败:', err);
            showToast('复制失败，请手动复制');
        }

        document.body.removeChild(textArea);
    }

    /**
     * 显示提示信息
     */
    function showToast(message, duration = 3000) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 12px 16px;
            border-radius: 6px;
            font-size: 14px;
            z-index: 10000;
            opacity: 0;
            transform: translateY(-20px);
            transition: all 0.3s ease;
        `;

        document.body.appendChild(toast);

        // 触发动画
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        }, 100);

        // 自动隐藏
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, duration);
    }

    /**
     * 添加键盘事件监听
     */
    function addKeyboardListeners() {
        document.addEventListener('keydown', function(event) {
            // ESC键停止倒计时并返回
            if (event.key === 'Escape') {
                stopCountdown();
                if (window.history.length > 1) {
                    window.history.back();
                } else {
                    window.location.href = '/';
                }
            }
            // Enter键继续下一步
            if (event.key === 'Enter') {
                goNext();
            }
            // R键刷新页面
            if (event.key === 'r' || event.key === 'R') {
                refreshPage();
            }
            // H键返回首页
            if (event.key === 'h' || event.key === 'H') {
                goHome();
            }
            // 空格键停止/开始倒计时
            if (event.key === ' ') {
                event.preventDefault();
                if (isCountdownActive) {
                    stopCountdown();
                } else {
                    isCountdownActive = true;
                    startCountdown();
                }
            }
            // C键复制成功信息
            if (event.key === 'c' || event.key === 'C') {
                if (event.ctrlKey || event.metaKey) {
                    event.preventDefault();
                    copySuccessInfo();
                }
            }
        });
    }

    /**
     * 添加鼠标事件监听
     */
    function addMouseListeners() {
        // 鼠标移动时暂停倒计时
        let mouseTimeout;

        document.addEventListener('mousemove', function() {
            if (isCountdownActive && countdownTimer) {
                clearTimeout(mouseTimeout);
                stopCountdown();

                // 3秒后重新开始倒计时
                mouseTimeout = setTimeout(() => {
                    if (isCountdownActive) {
                        startCountdown();
                    }
                }, 3000);
            }
        });
    }

    /**
     * 初始化页面
     */
    function init() {
        // 更新成功内容
        updateSuccessContent();

        // 添加键盘事件监听
        addKeyboardListeners();

        // 添加鼠标事件监听
        addMouseListeners();

        // 开始倒计时
        startCountdown();

        console.log('成功页面初始化完成');
        console.log('倒计时时间:', countdownValue, '秒');
        console.log('提示：按空格键可以暂停/继续倒计时');
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 页面卸载时清理定时器
    window.addEventListener('beforeunload', () => {
        stopCountdown();
    });

    // 暴露全局函数供HTML调用
    window.goNext = goNext;
    window.goHome = goHome;
    window.refreshPage = refreshPage;
    window.copySuccessInfo = copySuccessInfo;
    window.stopCountdown = stopCountdown;
    window.startCountdown = startCountdown;

})();