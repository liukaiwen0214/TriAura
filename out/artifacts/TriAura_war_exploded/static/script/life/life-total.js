// 生活管理汇总页面专用脚本
document.addEventListener('DOMContentLoaded', function() {
    // 初始化导航功能
    const indexPage = new IndexPage();

    // 为统计卡片添加点击效果
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        card.addEventListener('click', function() {
            // 添加点击动画效果
            this.style.transform = 'translateY(-2px) scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'translateY(-4px)';
            }, 150);
        });
    });

    // 为分类卡片添加点击效果
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // 如果点击的是按钮，不触发卡片点击效果
            if (e.target.classList.contains('btn-action')) {
                return;
            }

            // 添加点击动画效果
            this.style.transform = 'translateY(-1px) scale(0.99)';
            setTimeout(() => {
                this.style.transform = 'translateY(-2px)';
            }, 150);
        });
    });

    // 为快速操作项添加点击效果
    const quickActions = document.querySelectorAll('.quick-action-item');
    quickActions.forEach(action => {
        action.addEventListener('click', function() {
            // 添加点击动画效果
            this.style.transform = 'translateY(-1px) scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'translateY(-1px)';
            }, 150);
        });
    });

    // 为活动项添加悬停效果
    const activityItems = document.querySelectorAll('.activity-item');
    activityItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(4px)';
        });

        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });

    // 模拟数据更新（实际项目中应该从后端获取）
    function updateStats() {
        // 这里可以添加从后端获取数据的逻辑
        console.log('更新统计数据...');
    }

    // 每30秒更新一次数据（实际项目中根据需求调整频率）
    setInterval(updateStats, 30000);

    // 页面可见性变化时的处理
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            // 页面变为可见时更新数据
            updateStats();
        }
    });

    console.log('生活管理汇总页面初始化完成');
});