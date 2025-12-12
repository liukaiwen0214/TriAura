/**
 * 错误页面交互脚本
 * 提供错误处理、页面导航等功能
 */

(function() {
    'use strict';

    /**
     * 错误信息配置
     */
    const ErrorMessages = {
        '404': {
            title: '页面未找到',
            message: '抱歉，您访问的页面不存在',
            detail: '请检查网址是否正确，或返回首页继续浏览',
            icon: 'fa-search'
        },
        '403': {
            title: '访问被拒绝',
            message: '您没有权限访问此页面',
            detail: '请确认您已登录，或联系管理员获取权限',
            icon: 'fa-lock'
        },
        '401': {
            title: '未授权访问',
            message: '请先登录以继续访问',
            detail: '您的会话可能已过期，请重新登录',
            icon: 'fa-user-lock'
        },
        '500': {
            title: '服务器错误',
            message: '抱歉，服务器遇到了一些问题',
            detail: '我们的技术团队正在处理，请稍后重试',
            icon: 'fa-server'
        },
        'network': {
            title: '网络错误',
            message: '网络连接出现问题',
            detail: '请检查您的网络连接，或稍后重试',
            icon: 'fa-wifi'
        },
        'timeout': {
            title: '请求超时',
            message: '请求处理时间过长',
            detail: '请刷新页面或稍后重试',
            icon: 'fa-clock'
        },
        'default': {
            title: '出错了',
            message: '抱歉，遇到了一些问题',
            detail: '请检查网络连接或稍后重试',
            icon: 'fa-exclamation-triangle'
        }
    };

    /**
     * 获取错误信息
     */
    function getErrorInfo() {
        const urlParams = new URLSearchParams(window.location.search);
        const errorCode = urlParams.get('code') || 'default';
        const customMessage = urlParams.get('message') || '';
        const customDetail = urlParams.get('detail') || '';

        const errorInfo = ErrorMessages[errorCode] || ErrorMessages['default'];

        return {
            title: errorInfo.title,
            message: customMessage || errorInfo.message,
            detail: customDetail || errorInfo.detail,
            icon: errorInfo.icon
        };
    }

    /**
     * 更新页面内容
     */
    function updateErrorContent() {
        const errorInfo = getErrorInfo();
        const errorTitle = document.querySelector('.error-title');
        const errorMessage = document.getElementById('errorMessage');
        const errorDetail = document.getElementById('errorDetail');
        const errorIcon = document.querySelector('.error-icon i');

        if (errorTitle) {
            errorTitle.textContent = errorInfo.title;
        }

        if (errorMessage) {
            errorMessage.textContent = errorInfo.message;
        }

        if (errorDetail) {
            errorDetail.textContent = errorInfo.detail;
        }

        if (errorIcon) {
            errorIcon.className = `fas ${errorInfo.icon}`;
        }
    }

    /**
     * 返回上一页
     */
    function goBack() {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            window.location.href = '/';
        }
    }

    /**
     * 返回首页
     */
    function goHome() {
        window.location.href = '/';
    }

    /**
     * 刷新页面
     */
    function refreshPage() {
        window.location.reload();
    }

    /**
     * 复制错误信息到剪贴板
     */
    function copyErrorInfo() {
        const errorInfo = getErrorInfo();
        const currentUrl = window.location.href;
        const userAgent = navigator.userAgent;
        const timestamp = new Date().toLocaleString('zh-CN');

        const errorText = `
错误信息：
标题：${errorInfo.title}
消息：${errorInfo.message}
详情：${errorInfo.detail}

页面地址：${currentUrl}
时间：${timestamp}
用户代理：${userAgent}
        `.trim();

        if (navigator.clipboard) {
            navigator.clipboard.writeText(errorText).then(() => {
                showToast('错误信息已复制到剪贴板');
            }).catch(() => {
                fallbackCopyText(errorText);
            });
        } else {
            fallbackCopyText(errorText);
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
            showToast('错误信息已复制到剪贴板');
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
            // ESC键返回上一页
            if (event.key === 'Escape') {
                goBack();
            }
            // Enter键刷新页面
            if (event.key === 'Enter') {
                refreshPage();
            }
            // R键刷新页面
            if (event.key === 'r' || event.key === 'R') {
                refreshPage();
            }
            // H键返回首页
            if (event.key === 'h' || event.key === 'H') {
                goHome();
            }
            // C键复制错误信息
            if (event.key === 'c' || event.key === 'C') {
                if (event.ctrlKey || event.metaKey) {
                    event.preventDefault();
                    copyErrorInfo();
                }
            }
        });
    }

    /**
     * 添加错误监控
     */
    function addErrorMonitoring() {
        // 监听全局错误
        window.addEventListener('error', function(event) {
            console.error('全局错误:', event.error);
            console.error('错误位置:', event.filename, '行号:', event.lineno, '列号:', event.colno);
        });

        // 监听未处理的Promise拒绝
        window.addEventListener('unhandledrejection', function(event) {
            console.error('未处理的Promise拒绝:', event.reason);
        });
    }

    /**
     * 初始化页面
     */
    function init() {
        // 更新错误内容
        updateErrorContent();

        // 添加键盘事件监听
        addKeyboardListeners();

        // 添加错误监控
        addErrorMonitoring();

        // 添加页面可见性变化监听
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                // 页面隐藏时暂停某些操作
                console.log('页面已隐藏');
            } else {
                // 页面显示时恢复某些操作
                console.log('页面已显示');
            }
        });

        // 添加网络状态监听
        window.addEventListener('online', function() {
            showToast('网络已连接');
        });

        window.addEventListener('offline', function() {
            showToast('网络已断开');
        });

        console.log('错误页面初始化完成');
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 暴露全局函数供HTML调用
    window.goBack = goBack;
    window.goHome = goHome;
    window.refreshPage = refreshPage;
    window.copyErrorInfo = copyErrorInfo;

})();