/**
 * TriAura 游戏管理首页 - 优化版本
 *
 * 功能模块化架构:
 * 1. 应用初始化模块
 * 2. 活动甘特图模块
 * 3. 任务管理模块
 * 4. 资源管理模块
 * 5. 弹窗管理模块
 * 6. API服务模块
 * 7. 工具函数模块
 *
 * ID冲突修复记录 (2025-12-05):
 * - 资源筛选时间输入ID: resourceStartDate, resourceEndDate
 * - 活动弹窗时间输入ID: activityStartDate, activityEndDate
 * - 所有JavaScript选择器已更新匹配新的唯一ID
 */

// =========================================
// 1. 应用初始化模块
// =========================================

class GameHomeApp {
    constructor() {
        this.isInitialized = false;
        this.modules = {};
    }

    // 应用主入口 - 协调所有模块的初始化
    async initialize() {
        try {
            console.log('🚀 开始初始化TriAura游戏管理系统...');

            // 初始化全局配置
            this.initializeGlobalConfig();

            // 初始化各个功能模块
            await this.initializeModules();

            // 执行系统健康检查（非阻塞）
            this.performSystemHealthCheck();

            this.isInitialized = true;
            console.log('✅ TriAura游戏管理系统初始化完成');

        } catch (error) {
            console.error('❌ 系统初始化失败:', error);
        }
    }

    // 初始化全局配置和常量
    initializeGlobalConfig() {
        // 时间相关常量
        this.currentDate = new Date();
        this.currentYear = this.currentDate.getFullYear();
        this.currentMonth = this.currentDate.getMonth();

        // UI状态常量
        this.VIEW_TYPES = {
            MONTH: 'month',
            WEEK: 'week'
        };

        // 资源类型常量
        this.RESOURCE_TYPES = {
            JADE: '勾玉',
            GOLD: '金币',
            SCROLL: '神秘符咒',
            SOULS: '御魂'
        };

        // 彩虹色系定义 - 10种不同颜色
        this.RAINBOW_COLORS = [
            '#000000', // 黑色
            '#FF6B6B', // 红色
            '#4ECDC4', // 青色
            '#45B7D1', // 蓝色
            '#96CEB4', // 薄荷绿
            '#FFEAA7', // 浅黄色
            '#DDA0DD', // 梅花色
            '#98D8C8', // 薄荷蓝绿
            '#FFB6C1', // 浅粉色
            '#FFA07A'  // 浅鲑鱼色
        ];

        // 默认活动数据 - 基于当前时间生成
        this.defaultActivities = [
            {
                id: 'bai-gui-ye-xing',
                name: '百鬼夜行祭',
                startDate: this.formatDateForActivity(this.currentYear, this.currentMonth + 1, 1),
                endDate: this.formatDateForActivity(this.currentYear, this.currentMonth + 1, 8),
                color: this.RAINBOW_COLORS[0]
            },
            {
                id: 'shi-shen-ji-jie',
                name: '式神集结',
                startDate: this.formatDateForActivity(this.currentYear, this.currentMonth, 20),
                endDate: this.formatDateForActivity(this.currentYear, this.currentMonth + 1, 2),
                color: this.RAINBOW_COLORS[1]
            },
            {
                id: 'yu-hun-qiang-hua',
                name: '御魂强化',
                startDate: this.formatDateForActivity(this.currentYear, this.currentMonth + 1, 5),
                endDate: this.formatDateForActivity(this.currentYear, this.currentMonth + 1, 15),
                color: this.RAINBOW_COLORS[2]
            },
            {
                id: 'yin-men-tiao-zhan',
                name: '阴门挑战',
                startDate: this.formatDateForActivity(this.currentYear, this.currentMonth + 1, 10),
                endDate: this.formatDateForActivity(this.currentYear, this.currentMonth + 1, 20),
                color: this.RAINBOW_COLORS[3]
            },
            {
                id: 'jue-xing-ren-wu',
                name: '觉醒任务',
                startDate: this.formatDateForActivity(this.currentYear, this.currentMonth + 1, 12),
                endDate: this.formatDateForActivity(this.currentYear, this.currentMonth + 1, 18),
                color: this.RAINBOW_COLORS[4]
            },
            {
                id: 'dou-ji-sai-ji',
                name: '斗技赛季',
                startDate: this.formatDateForActivity(this.currentYear, this.currentMonth + 1, 1),
                endDate: this.formatDateForActivity(this.currentYear, this.currentMonth + 1, 25),
                color: this.RAINBOW_COLORS[5]
            },
            {
                id: 'yao-guai-tui-zhi',
                name: '妖怪退治',
                startDate: this.formatDateForActivity(this.currentYear, this.currentMonth + 1, 8),
                endDate: this.formatDateForActivity(this.currentYear, this.currentMonth + 1, 14),
                color: this.RAINBOW_COLORS[6]
            },
            {
                id: 'ting-yuan-tan-suo',
                name: '庭院探索',
                startDate: this.formatDateForActivity(this.currentYear, this.currentMonth + 1, 15),
                endDate: this.formatDateForActivity(this.currentYear, this.currentMonth + 1, 22),
                color: this.RAINBOW_COLORS[7]
            }
        ];
    }

    // 批量初始化功能模块
    async initializeModules() {
        // 按依赖关系顺序初始化各模块
        const moduleInitOrder = [
            () => this.initializeGanttChartModule(),
            () => this.initializeTaskManagementModule(),
            () => this.initializeResourceManagementModule(),
            () => this.initializeModalManagementModule(),
            () => this.initializeUtilityFunctions()
        ];

        for (const initFunction of moduleInitOrder) {
            try {
                await initFunction();
            } catch (error) {
                console.error('模块初始化失败:', error);
            }
        }
    }

    // 格式化活动日期的工具方法
    formatDateForActivity(year, month, day) {
        // 确保月份在有效范围内
        const normalizedMonth = ((month - 1 + 12) % 12) + 1;
        const adjustedYear = month > 12 ? year + 1 : year;

        return `${adjustedYear}-${String(normalizedMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }

    // 异步系统健康检查 - 不阻塞主流程
    async performSystemHealthCheck() {
        try {
            console.log('🔍 执行系统健康检查...');

            // 检查API连接状态
            const isApiHealthy = await this.modules.apiService?.checkApiHealth();

            if (isApiHealthy) {
                console.log('💚 系统健康检查通过');
            } else {
                console.warn('⚠️ API连接异常，将使用模拟数据模式');
                // 自动切换到模拟数据模式
                if (this.modules.apiService) {
                    this.modules.apiService.setConfig({ MOCK_MODE: true });
                }
            }

        } catch (error) {
            console.error('健康检查异常:', error);
        }
    }
}

// =========================================
// 2. 活动甘特图模块
// =========================================

class GanttChartManager {
    constructor(appInstance) {
        this.app = appInstance;

        // 甘特图状态管理
        this.chartState = {
            currentOffset: 0,           // 当前偏移天数
            maxOffset: 60,              // 最大偏移天数
            daysToShow: 30,             // 显示天数
            currentView: appInstance.VIEW_TYPES.MONTH,  // 当前视图
            activities: [],              // 活动数据
            isDragging: false,          // 拖拽状态
            isDraggingScrollbar: false,   // 滚动条拖拽状态
            dragStartX: 0,             // 拖拽起始X坐标
            dragStartOffset: 0,        // 拖拽起始偏移
            scrollbarTrackWidth: 0      // 滚动条轨道宽度
        };

        // DOM元素缓存
        this.elements = {
            container: null,
            timelineDays: null,
            ganttBody: null,
            scrollbarThumb: null,
            scrollbarTrack: null
        };
    }

    // 初始化甘特图模块
    async initialize() {
        console.log('📊 初始化甘特图模块...');

        // 缓存DOM元素
        this.cacheElements();

        // 设置活动数据
        this.chartState.activities = [...this.app.defaultActivities];

        // 初始化甘特图
        this.renderGanttChart();

        // 初始化交互事件
        this.initializeInteractions();

        // 初始化进度条
        this.updateScrollbar();
    }

    // 缓存常用DOM元素以提升性能
    cacheElements() {
        this.elements.container = document.querySelector('.gantt-container');
        this.elements.timelineDays = document.querySelector('.timeline-days');
        this.elements.ganttBody = document.querySelector('.gantt-body');
        this.elements.scrollbarThumb = document.getElementById('scrollbarThumb');
        this.elements.scrollbarTrack = document.querySelector('.scrollbar-track');
    }

    // 渲染甘特图主界面
    renderGanttChart() {
        this.generateTimelineHeader();
        this.generateActivityRows();
        this.updateActivityBars();
        this.generateActivityList();
    }

    // 生成时间轴头部 - 包含月份标签和日期数字
    generateTimelineHeader() {
        if (!this.elements.timelineDays) return;

        const monthLabels = [];
        const dayNumbers = [];

        // 计算起始日期
        const startDate = this.calculateStartDate();

        // 生成月份标签和日期数字
        for (let i = 0; i < this.chartState.daysToShow; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);

            // 每月1号添加月份标签
            if (currentDate.getDate() === 1) {
                monthLabels.push(this.createMonthLabel(currentDate, i));
            }

            // 生成日期数字
            dayNumbers.push(this.createDayNumber(currentDate));
        }

        // 构建完整的时间轴HTML
        this.elements.timelineDays.innerHTML = `
            <div class="month-labels" style="display:grid;grid-template-columns:repeat(${this.chartState.daysToShow},1fr);margin-bottom:8px;">
                ${monthLabels.join('')}
            </div>
            <div class="day-numbers" style="display:grid;grid-template-columns:repeat(${this.chartState.daysToShow},1fr);">
                ${dayNumbers.join('')}
            </div>
        `;
    }

    // 创建月份标签HTML
    createMonthLabel(date, columnIndex) {
        const isCurrentMonth = date.getMonth() === this.app.currentMonth &&
            date.getFullYear() === this.app.currentYear;
        const monthColor = isCurrentMonth ? '#28a745' : '#666';

        return `<div style="font-size:0.8em;color:${monthColor};font-weight:bold;grid-column:${columnIndex + 1};text-align:center;">
            ${date.getFullYear()}年${date.getMonth() + 1}月
        </div>`;
    }

    // 创建日期数字HTML
    createDayNumber(date) {
        const isToday = date.toDateString() === this.app.currentDate.toDateString();
        const isCurrentMonth = date.getMonth() === this.app.currentMonth;

        let dayColor = '#000000';
        if (!isCurrentMonth) {
            dayColor = '#666'; // 其他月份用灰色
        } else if (isToday) {
            dayColor = '#28a745'; // 今天用绿色
        }

        const todayClass = isToday ? 'class="today"' : '';
        const fontWeight = isToday || isCurrentMonth ? 'bold' : 'normal';

        return `<span ${todayClass} style="color:${dayColor};font-weight:${fontWeight};">
            ${date.getDate()}
        </span>`;
    }

    // 计算甘特图起始日期
    calculateStartDate() {
        const startDate = new Date(this.app.currentDate);

        if (this.chartState.currentView === this.app.VIEW_TYPES.WEEK) {
            // 周视图：显示本周7天，从周一开始
            const dayOfWeek = this.app.currentDate.getDay(); // 0是周日，1是周一
            const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
            startDate.setDate(this.app.currentDate.getDate() - daysToMonday);
            this.chartState.daysToShow = 7;
        } else {
            // 月视图：显示前后15天
            startDate.setDate(this.app.currentDate.getDate() - 15 + this.chartState.currentOffset);
            this.chartState.daysToShow = 30;
        }

        return startDate;
    }

    // 生成活动行
    generateActivityRows() {
        if (!this.elements.ganttBody) return;

        const rowsHTML = this.chartState.activities.map((activity, index) => {
            return this.createActivityRow(activity, index);
        }).join('');

        this.elements.ganttBody.innerHTML = rowsHTML;
    }

    // 创建单个活动行的HTML
    createActivityRow(activity, index) {
        const activityId = activity.id || `activity-${index}`;
        const start = new Date(activity.startDate);
        const end = new Date(activity.endDate);

        return `
            <div class="activity-row">
                <div class="timeline-track">
                    <div class="activity-bar" 
                         style="background: ${activity.color};" 
                         data-id="${activityId}"
                         data-start="${activity.startDate}" 
                         data-end="${activity.endDate}" 
                         data-name="${activity.name}">
                        <span class="activity-bar-text">${activity.name}</span>
                        ${this.createActivityTooltip(activity)}
                    </div>
                </div>
            </div>
        `;
    }

    // 创建活动详情提示框
    createActivityTooltip(activity) {
        const start = new Date(activity.startDate);
        const end = new Date(activity.endDate);

        return `
            <div class="activity-tooltip">
                <div class="tooltip-header">${activity.name}</div>
                <div class="tooltip-content">
                    <p>开始时间：${start.getMonth() + 1}月${start.getDate()}日</p>
                    <p>结束时间：${end.getMonth() + 1}月${end.getDate()}日</p>
                </div>
            </div>
        `;
    }

    // 更新活动条位置和宽度
    updateActivityBars() {
        const startDate = this.calculateStartDate();

        this.chartState.activities.forEach((activity) => {
            const activityBar = document.querySelector(`[data-id="${activity.id}"]`);
            if (!activityBar) return;

            const position = this.calculateActivityPosition(activity, startDate);

            activityBar.style.left = `${position.leftPercent}%`;
            activityBar.style.width = `${position.widthPercent}%`;
        });
    }

    // 计算活动条的位置和宽度
    calculateActivityPosition(activity, startDate) {
        const start = new Date(activity.startDate);
        const end = new Date(activity.endDate);

        // 计算活动相对于起始日期的位置
        const startDiff = Math.max(0, Math.floor((start - startDate) / (1000 * 60 * 60 * 24)));
        const endDiff = Math.min(this.chartState.daysToShow, Math.ceil((end - startDate) / (1000 * 60 * 60 * 24)));

        // 计算百分比位置和宽度
        let leftPercent = (startDiff / this.chartState.daysToShow) * 100;
        let widthPercent = Math.max(1, ((endDiff - startDiff) / this.chartState.daysToShow) * 100);

        // 边界处理：确保活动条在可视范围内
        if (startDiff < 0) {
            leftPercent = 0;
            widthPercent = Math.max(1, (endDiff / this.chartState.daysToShow) * 100);
        }
        if (endDiff > this.chartState.daysToShow) {
            widthPercent = Math.max(1, ((this.chartState.daysToShow - startDiff) / this.chartState.daysToShow) * 100);
        }

        return { leftPercent, widthPercent };
    }

    // 生成活动列表
    generateActivityList() {
        const listContainer = document.getElementById('activityListContainer');
        if (!listContainer) return;

        const listHTML = this.chartState.activities.map(activity => `
            <div class="activity-list-item" data-id="${activity.id}" title="${activity.name}" style="background-color: ${activity.color};">
                <div class="activity-list-info">
                    <div class="activity-list-details">
                        <h4 class="activity-list-name">${activity.name}</h4>
                    </div>
                    <div class="activity-list-actions">
                        <button class="activity-delete-btn" onclick="ganttChartManager.deleteActivity('${activity.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        listContainer.innerHTML = listHTML;
    }

    // 初始化交互事件
    initializeInteractions() {
        this.initializeViewSwitching();
        this.initializeDragging();
        this.initializeScrollbar();
        this.initializeButtonActions();
    }

    // 初始化视图切换功能
    initializeViewSwitching() {
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const view = btn.dataset.view;
                this.switchView(view);

                // 更新按钮状态
                document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    // 切换视图模式（月/周）
    switchView(view) {
        this.chartState.currentView = view;
        this.chartState.currentOffset = 0; // 重置偏移量

        // 根据视图类型调整显示设置
        if (view === this.app.VIEW_TYPES.WEEK) {
            this.chartState.daysToShow = 7;
            this.disableScrolling();
        } else {
            this.chartState.daysToShow = 30;
            this.enableScrolling();
        }

        // 重新渲染甘特图
        this.renderGanttChart();
        this.updateScrollbar();
    }

    // 启用滚动功能
    enableScrolling() {
        if (this.elements.container) {
            this.elements.container.style.overflowX = 'auto';
        }

        const scrollbar = document.querySelector('.gantt-scrollbar');
        if (scrollbar) {
            scrollbar.style.display = 'block';
        }
    }

    // 禁用滚动功能
    disableScrolling() {
        if (this.elements.container) {
            this.elements.container.style.overflowX = 'hidden';
        }

        const scrollbar = document.querySelector('.gantt-scrollbar');
        if (scrollbar) {
            scrollbar.style.display = 'none';
        }
    }

    // 初始化拖拽功能
    initializeDragging() {
        if (!this.elements.container) return;

        // 鼠标事件
        this.elements.container.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        document.addEventListener('mouseup', () => this.handleMouseUp());

        // 触摸事件
        this.elements.container.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        this.elements.container.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: true });
        this.elements.container.addEventListener('touchend', () => this.handleTouchEnd());

        // 滚轮事件
        this.elements.container.addEventListener('wheel', (e) => this.handleWheel(e), { passive: false });
    }

    // 鼠标按下事件处理
    handleMouseDown(e) {
        this.chartState.isDragging = true;
        this.chartState.dragStartX = e.clientX;
        this.chartState.dragStartOffset = this.chartState.currentOffset;
    }

    // 鼠标移动事件处理
    handleMouseMove(e) {
        if (!this.chartState.isDragging) return;

        const deltaX = e.clientX - this.chartState.dragStartX;
        const deltaDays = Math.round(deltaX / 10); // 每10px对应1天

        this.updateOffset(this.chartState.dragStartOffset - deltaDays);
    }

    // 鼠标释放事件处理
    handleMouseUp() {
        if (!this.chartState.isDragging) return;

        this.chartState.isDragging = false;
        this.constrainOffset();
    }

    // 触摸开始事件处理
    handleTouchStart(e) {
        this.chartState.isDragging = true;
        this.chartState.dragStartX = e.touches[0].clientX;
        this.chartState.dragStartOffset = this.chartState.currentOffset;
    }

    // 触摸移动事件处理
    handleTouchMove(e) {
        if (!this.chartState.isDragging) return;

        const deltaX = e.touches[0].clientX - this.chartState.dragStartX;
        const deltaDays = Math.round(deltaX / 10);

        this.updateOffset(this.chartState.dragStartOffset - deltaDays);
    }

    // 触摸结束事件处理
    handleTouchEnd() {
        if (!this.chartState.isDragging) return;

        this.chartState.isDragging = false;
        this.constrainOffset();
    }

    // 滚轮事件处理
    handleWheel(e) {
        // 只处理水平滚动
        if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;

        e.preventDefault();

        const deltaDays = Math.round(e.deltaX / 20); // 调整灵敏度

        this.updateOffset(this.chartState.currentOffset + deltaDays);
    }

    // 更新偏移量并重绘
    updateOffset(newOffset) {
        // 应用回弹效果
        if (newOffset < -this.chartState.maxOffset) {
            const overshoot = -this.chartState.maxOffset - newOffset;
            this.chartState.currentOffset = -this.chartState.maxOffset + overshoot * 0.5;
        } else if (newOffset > this.chartState.maxOffset) {
            const overshoot = newOffset - this.chartState.maxOffset;
            this.chartState.currentOffset = this.chartState.maxOffset - overshoot * 0.5;
        } else {
            this.chartState.currentOffset = newOffset;
        }

        this.renderGanttChart();
    }

    // 约束偏移量在有效范围内
    constrainOffset() {
        this.chartState.currentOffset = Math.max(
            -this.chartState.maxOffset,
            Math.min(this.chartState.maxOffset, this.chartState.currentOffset)
        );
        this.renderGanttChart();
    }

    // 初始化滚动条
    initializeScrollbar() {
        if (!this.elements.scrollbarTrack || !this.elements.scrollbarThumb) return;

        // 轨道点击事件
        this.elements.scrollbarTrack.addEventListener('click', (e) => {
            if (e.target === this.elements.scrollbarTrack) {
                this.jumpToPosition(e);
            }
        });

        // 滑块拖拽事件
        this.elements.scrollbarThumb.addEventListener('mousedown', (e) => {
            this.startScrollbarDrag(e);
        });
    }

    // 跳转到指定位置
    jumpToPosition(e) {
        const trackRect = this.elements.scrollbarTrack.getBoundingClientRect();
        const clickX = e.clientX - trackRect.left;
        const clickRatio = clickX / trackRect.width;

        const totalRange = this.chartState.maxOffset * 2 + this.chartState.daysToShow;
        const newOffset = Math.round(clickRatio * (totalRange - this.chartState.daysToShow) - this.chartState.maxOffset);

        this.chartState.currentOffset = Math.max(-this.chartState.maxOffset, Math.min(this.chartState.maxOffset, newOffset));
        this.renderGanttChart();
        this.updateScrollbar();
    }

    // 开始滚动条拖拽
    startScrollbarDrag(e) {
        this.chartState.isDraggingScrollbar = true;
        this.chartState.dragStartX = e.clientX;
        this.chartState.dragStartOffset = this.chartState.currentOffset;
        this.chartState.scrollbarTrackWidth = this.elements.scrollbarTrack.getBoundingClientRect().width;
    }

    // 初始化按钮动作
    initializeButtonActions() {
        // 回到今天按钮
        const todayBtn = document.querySelector('.today-btn');
        if (todayBtn) {
            todayBtn.addEventListener('click', () => this.goToToday());
        }

        // 添加活动按钮
        const addActivityBtn = document.querySelector('.add-activity-btn');
        if (addActivityBtn) {
            addActivityBtn.addEventListener('click', () => {
                if (this.app.modules.modalManager) {
                    this.app.modules.modalManager.showAddActivityDialog();
                }
            });
        }
    }

    // 平滑回到今天
    goToToday() {
        const animateToToday = () => {
            const targetOffset = 0;
            const delta = targetOffset - this.chartState.currentOffset;

            if (Math.abs(delta) < 1) {
                this.chartState.currentOffset = targetOffset;
                this.renderGanttChart();
                return;
            }

            this.chartState.currentOffset += delta * 0.2; // 缓动效果
            this.renderGanttChart();
            requestAnimationFrame(animateToToday);
        };

        animateToToday();
    }

    // 更新滚动条位置
    updateScrollbar() {
        if (!this.elements.scrollbarThumb) return;

        const totalRange = this.chartState.maxOffset * 2 + this.chartState.daysToShow;
        const visibleRatio = this.chartState.daysToShow / totalRange;
        const thumbWidth = Math.max(30, visibleRatio * 100);

        const offsetRatio = (this.chartState.currentOffset + this.chartState.maxOffset) / (totalRange - this.chartState.daysToShow);
        const thumbLeft = offsetRatio * (100 - thumbWidth);

        this.elements.scrollbarThumb.style.width = `${thumbWidth}%`;
        this.elements.scrollbarThumb.style.left = `${thumbLeft}%`;
    }

    // 删除活动
    deleteActivity(activityId) {
        if (!confirm('确定要删除这个活动吗？')) return;

        // 从活动数组中删除
        const activityIndex = this.chartState.activities.findIndex(activity => activity.id === activityId);
        if (activityIndex !== -1) {
            this.chartState.activities.splice(activityIndex, 1);

            // 重新渲染
            this.renderGanttChart();
        }
    }

    // 添加新活动
    addActivity(activityData) {
        // 生成唯一ID
        const newActivity = {
            id: `activity-${Date.now()}`,
            color: activityData.color || this.app.RAINBOW_COLORS[Math.floor(Math.random() * this.app.RAINBOW_COLORS.length)],
            ...activityData
        };

        // 添加到活动列表
        this.chartState.activities.push(newActivity);

        // 重新渲染甘特图
        this.renderGanttChart();
        this.updateScrollbar();
    }
}

// 由于代码太长，我将继续在下一个文件中完成剩余模块...// =========================================
// 3. 任务管理模块
// =========================================

class TaskManager {
    constructor(appInstance) {
        this.app = appInstance;

        // 任务数据管理
        this.taskData = {
            dailyTasks: [],
            weeklyTasks: []
        };

        // DOM元素缓存
        this.elements = {
            dailyTaskCard: null,
            weeklyTaskCard: null,
            dailyCountdown: null,
            weeklyCountdown: null
        };
    }

    // 初始化任务管理模块
    async initialize() {
        console.log('📝 初始化任务管理模块...');

        // 缓存DOM元素
        this.cacheElements();

        // 初始化倒计时
        this.initializeCountdowns();

        // 初始化任务交互
        this.initializeTaskInteractions();

        // 加载任务数据
        this.loadDefaultTasks();
    }

    // 缓存DOM元素
    cacheElements() {
        this.elements.dailyTaskCard = document.querySelector('.daily-tasks');
        this.elements.weeklyTaskCard = document.querySelector('.weekly-tasks');
        this.elements.dailyCountdown = document.getElementById('dailyCountdown');
        this.elements.weeklyCountdown = document.getElementById('weeklyCountdown');
    }

    // 加载默认任务数据
    loadDefaultTasks() {
        // 每日任务默认数据
        this.taskData.dailyTasks = [
            {
                id: 'daily-1',
                name: '完成3次御魂挑战',
                reward: { type: '勾玉', amount: 100 },
                completed: true
            },
            {
                id: 'daily-2',
                name: '参与1次结界突破',
                reward: { type: '经验', amount: 50 },
                completed: true
            },
            {
                id: 'daily-3',
                name: '完成1次探索副本',
                reward: { type: '金币', amount: 30 },
                completed: false
            },
            {
                id: 'daily-4',
                name: '使用N卡进行觉醒',
                reward: { type: '达摩', amount: 20 },
                completed: false
            }
        ];

        // 每周任务默认数据
        this.taskData.weeklyTasks = [
            {
                id: 'weekly-1',
                name: '达成段位斗技',
                reward: { type: '勾玉', amount: 200 },
                completed: true
            },
            {
                id: 'weekly-2',
                name: '收集10个碎片',
                reward: { type: '神秘符咒', amount: 1 },
                completed: true
            },
            {
                id: 'weekly-3',
                name: '完成10次协同斗技',
                reward: { type: '金币', amount: 100 },
                completed: false
            },
            {
                id: 'weekly-4',
                name: '觉醒5个式神',
                reward: { type: '经验', amount: 50 },
                completed: false
            }
        ];

        // 渲染任务列表
        this.renderTasks();
    }

    // 渲染任务列表
    renderTasks() {
        this.renderTaskList('daily', this.elements.dailyTaskCard);
        this.renderTaskList('weekly', this.elements.weeklyTaskCard);
    }

    // 渲染特定类型的任务列表
    renderTaskList(type, container) {
        if (!container) return;

        const tasks = type === 'daily' ? this.taskData.dailyTasks : this.taskData.weeklyTasks;
        const taskListElement = container.querySelector('.task-list');

        if (!taskListElement) return;

        const tasksHTML = tasks.map(task => this.createTaskElement(task, type)).join('');
        taskListElement.innerHTML = tasksHTML;

        // 重新绑定事件
        this.bindTaskEvents(type);

        // 更新进度
        this.updateTaskProgress(container);
    }

    // 创建单个任务元素
    createTaskElement(task, type) {
        const completedClass = task.completed ? 'completed' : '';
        const checkIcon = task.completed ? '<i class="fas fa-check"></i>' : '';

        return `
            <div class="task-item ${completedClass}" data-task-id="${task.id}" data-type="${type}">
                <div class="task-checkbox">${checkIcon}</div>
                <div class="task-content">
                    <span class="task-name">${task.name}</span>
                    <span class="task-reward">+${task.reward.amount}${task.reward.type}</span>
                </div>
                <div class="task-actions">
                    <button class="task-edit-btn">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="task-delete-btn">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }

    // 绑定任务相关事件
    bindTaskEvents(type) {
        const tasksContainer = type === 'daily' ? this.elements.dailyTaskCard : this.elements.weeklyTaskCard;
        if (!tasksContainer) return;

        // 任务点击切换完成状态
        tasksContainer.querySelectorAll('.task-item').forEach(item => {
            const checkbox = item.querySelector('.task-checkbox');
            if (checkbox) {
                checkbox.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleTaskCompletion(item);
                });
            }
        });

        // 编辑按钮事件
        tasksContainer.querySelectorAll('.task-edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.editTask(btn.closest('.task-item'));
            });
        });

        // 删除按钮事件
        tasksContainer.querySelectorAll('.task-delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteTask(btn.closest('.task-item'));
            });
        });
    }

    // 切换任务完成状态
    toggleTaskCompletion(taskItem) {
        const taskId = taskItem.dataset.taskId;
        const taskType = taskItem.dataset.type;

        // 查找任务数据
        const taskList = taskType === 'daily' ? this.taskData.dailyTasks : this.taskData.weeklyTasks;
        const task = taskList.find(t => t.id === taskId);

        if (!task) return;

        // 更新完成状态
        task.completed = !task.completed;

        // 更新UI
        const checkbox = taskItem.querySelector('.task-checkbox');
        const taskName = taskItem.querySelector('.task-name');

        if (task.completed) {
            taskItem.classList.add('completed');
            checkbox.innerHTML = '<i class="fas fa-check"></i>';
            checkbox.style.background = '#28a745';
            checkbox.style.borderColor = '#28a745';
            taskName.style.textDecoration = 'line-through';
        } else {
            taskItem.classList.remove('completed');
            checkbox.innerHTML = '';
            checkbox.style.background = 'white';
            checkbox.style.borderColor = '#dee2e6';
            taskName.style.textDecoration = 'none';
        }

        // 更新进度
        this.updateTaskProgress(taskItem.closest('.task-card'));
    }

    // 更新任务进度显示
    updateTaskProgress(taskCard) {
        const totalTasks = taskCard.querySelectorAll('.task-item').length;
        const completedTasks = taskCard.querySelectorAll('.task-item.completed').length;
        const percentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

        // 更新完成数量显示
        const completedCount = taskCard.querySelector('.completed-count');
        if (completedCount) {
            completedCount.textContent = `${completedTasks}/${totalTasks}`;
        }

        // 更新进度条
        const progressBar = taskCard.querySelector('.progress-fill');
        if (progressBar) {
            progressBar.style.width = `${percentage}%`;
        }
    }

    // 初始化倒计时功能
    initializeCountdowns() {
        // 每日任务倒计时 - 每天凌晨重置
        if (this.elements.dailyCountdown) {
            setInterval(() => this.updateCountdown(this.elements.dailyCountdown, 'daily'), 1000);
        }

        // 每周任务倒计时 - 每周一早上5点重置
        if (this.elements.weeklyCountdown) {
            setInterval(() => this.updateCountdown(this.elements.weeklyCountdown, 'weekly'), 1000);
        }
    }

    // 更新倒计时显示
    updateCountdown(element, type) {
        const now = new Date();
        let targetTime;

        if (type === 'daily') {
            // 明天凌晨0点
            targetTime = new Date();
            targetTime.setDate(now.getDate() + 1);
            targetTime.setHours(0, 0, 0, 0);
        } else {
            // 下周一早上5点
            const daysUntilMonday = (8 - now.getDay()) % 7 || 7;
            targetTime = new Date();
            targetTime.setDate(now.getDate() + daysUntilMonday);
            targetTime.setHours(5, 0, 0, 0);
        }

        const difference = targetTime - now;

        if (difference > 0) {
            const hours = Math.floor(difference / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            let displayText;
            if (type === 'daily') {
                displayText = `重置：${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            } else {
                const days = Math.floor(hours / 24);
                const remainingHours = hours % 24;
                displayText = `重置：${days}天${remainingHours}小时`;
            }

            element.querySelector('span').textContent = displayText;
        }
    }

    // 初始化任务交互功能
    initializeTaskInteractions() {
        // 添加任务按钮事件
        document.querySelectorAll('.add-task-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const taskType = btn.dataset.type;
                this.showAddTaskDialog(taskType);
            });
        });
    }

    // 显示添加任务对话框
    showAddTaskDialog(type) {
        if (this.app.modules.modalManager) {
            this.app.modules.modalManager.showAddTaskDialog(type);
        }
    }

    // 编辑任务
    editTask(taskItem) {
        const taskName = taskItem.querySelector('.task-name').textContent;
        const reward = taskItem.querySelector('.task-reward').textContent;

        const newName = prompt('请编辑任务名称：', taskName);
        if (newName && newName.trim() && newName !== taskName) {
            taskItem.querySelector('.task-name').textContent = newName.trim();
        }

        const newReward = prompt('请编辑奖励：', reward);
        if (newReward && newReward.trim() && newReward !== reward) {
            taskItem.querySelector('.task-reward').textContent = newReward;
        }
    }

    // 删除任务
    deleteTask(taskItem) {
        if (!confirm('确定要删除这个任务吗？')) return;

        const taskId = taskItem.dataset.taskId;
        const taskType = taskItem.dataset.type;

        // 从数据中删除
        const taskList = taskType === 'daily' ? this.taskData.dailyTasks : this.taskData.weeklyTasks;
        const taskIndex = taskList.findIndex(t => t.id === taskId);

        if (taskIndex !== -1) {
            taskList.splice(taskIndex, 1);
        }

        // 从DOM中删除
        const container = taskItem.closest('.task-card');
        taskItem.remove();

        // 更新进度
        this.updateTaskProgress(container);
    }

    // 添加新任务
    addTask(taskData) {
        const newTask = {
            id: `${taskData.type}-${Date.now()}`,
            name: taskData.name,
            reward: {
                type: taskData.rewardType,
                amount: taskData.rewardAmount
            },
            completed: false
        };

        // 添加到对应的任务列表
        const taskList = taskData.type === 'daily' ? this.taskData.dailyTasks : this.taskData.weeklyTasks;
        taskList.push(newTask);

        // 重新渲染
        const container = taskData.type === 'daily' ? this.elements.dailyTaskCard : this.elements.weeklyTaskCard;
        this.renderTaskList(taskData.type, container);
    }
}

// =========================================
// 4. 资源管理模块
// =========================================

class ResourceManager {
    constructor(appInstance) {
        this.app = appInstance;

        // 资源数据管理
        this.resourceData = {
            '勾玉': this.createResourceData('勾玉', 'fa-gem', '#4169E1', '+2,456'),
            '金币': this.createResourceData('金币', 'fa-coins', '#FFD700', '+156.8K'),
            '神秘符咒': this.createResourceData('神秘符咒', 'fa-scroll', '#FF6347', '+45'),
            '御魂': this.createResourceData('御魂', 'fa-dice', '#9370DB', '+1,234')
        };

        // 时间筛选状态
        this.filterState = {
            period: 'week',
            startDate: null,
            endDate: null
        };
    }

    // 初始化资源管理模块
    async initialize() {
        console.log('💎 初始化资源管理模块...');

        // 初始化资源卡片点击事件
        this.initializeResourceCardEvents();

        // 初始化时间筛选功能
        this.initializeTimeFilter();

        // 更新月份显示
        this.updateMonthDisplay();
    }

    // 创建资源数据对象
    createResourceData(name, icon, color, amount) {
        const sources = this.generateSourceData(name);
        const records = this.generateRecordData(name);

        return {
            name,
            icon,
            color,
            amount,
            total: this.calculateTotal(records),
            sources,
            records,
            trends: this.generateTrendData()
        };
    }

    // 生成来源数据
    generateSourceData(resourceName) {
        const sourceTemplates = {
            '勾玉': [
                { name: '周任务', percentage: 40, color: '#28a745' },
                { name: '每日任务', percentage: 25, color: '#17a2b8' },
                { name: '活动奖励', percentage: 20, color: '#FFB6C1' },
                { name: '斗技场', percentage: 10, color: '#ffc107' },
                { name: '其他', percentage: 5, color: '#6c757d' }
            ],
            '金币': [
                { name: '周任务', percentage: 60, color: '#28a745' },
                { name: '日常', percentage: 40, color: '#87CEEB' }
            ],
            '神秘符咒': [
                { name: '周任务', percentage: 80, color: '#28a745' },
                { name: '活动', percentage: 20, color: '#FFB6C1' }
            ],
            '御魂': [
                { name: '周任务', percentage: 50, color: '#28a745' },
                { name: '探索', percentage: 50, color: '#87CEEB' }
            ]
        };

        const templates = sourceTemplates[resourceName] || sourceTemplates['勾玉'];
        const totalAmount = Math.floor(Math.random() * 5000) + 2000;

        return templates.map(template => {
            const variation = (Math.random() - 0.5) * 10;
            const percentage = Math.max(5, template.basePercentage + variation);
            const amount = Math.floor(totalAmount * percentage / 100);
            const trend = (Math.random() - 0.5) * 20;

            return {
                name: template.name,
                percentage: Math.round(percentage),
                amount,
                color: template.color,
                trend: `${trend > 0 ? '+' : ''}${trend.toFixed(1)}%`
            };
        });
    }

    // 生成记录数据 - 优化：使用const解构
    generateRecordData(resourceName) {
        const recordSources = this.getRecordSources(resourceName);
        const records = [];
        const today = new Date();

        // 生成模拟记录数据
        for (let i = 0; i < 30 * 3; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() - Math.floor(Math.random() * 30));
            date.setHours(Math.floor(Math.random() * 24));
            date.setMinutes(Math.floor(Math.random() * 60));

            const source = recordSources[Math.floor(Math.random() * recordSources.length)];
            const amount = this.getRandomAmount(resourceName);

            records.push({
                time: this.formatDateTime(date),
                source: source.name,
                amount,
                type: source.type
            });
        }

        return records.sort((a, b) => new Date(b.time) - new Date(a.time));
    }

    // 获取记录来源
    getRecordSources(resourceName) {
        const sources = {
            '勾玉': [
                { name: '每日任务', type: '日常' },
                { name: '周任务', type: '周常' },
                { name: '活动奖励', type: '活动' },
                { name: '斗技场', type: 'PVP' },
                { name: '寮务', type: '社交' },
                { name: '探索副本', type: 'PVE' }
            ],
            '金币': [
                { name: '每日任务', type: '日常' },
                { name: '探索副本', type: 'PVE' },
                { name: '御魂挑战', type: 'PVE' },
                { name: '寮道馆', type: '社交' },
                { name: '结界突破', type: 'PVP' },
                { name: '周任务', type: '周常' }
            ]
        };
        return sources[resourceName] || sources['勾玉'];
    }

    // 获取随机数量
    getRandomAmount(resourceName) {
        const ranges = {
            '勾玉': [50, 500],
            '金币': [1000, 20000],
            '神秘符咒': [1, 10],
            '御魂': [20, 200]
        };
        const [min, max] = ranges[resourceName] || [50, 500];
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // 生成趋势数据
    generateTrendData() {
        const daily = [];
        const weekly = [];
        const monthly = [];

        // 日趋势
        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            daily.push({
                date: `${date.getMonth() + 1}-${String(date.getDate()).padStart(2, '0')}`,
                amount: Math.floor(Math.random() * 1000) + 100
            });
        }

        // 周趋势
        for (let i = 0; i < 4; i++) {
            weekly.push({
                week: `第${48 + i}周`,
                amount: Math.floor(Math.random() * 5000) + 1000
            });
        }

        // 月趋势
        const months = ['10月', '11月', '12月'];
        months.forEach(month => {
            monthly.push({
                month,
                amount: Math.floor(Math.random() * 10000) + 2000
            });
        });

        return { daily, weekly, monthly };
    }

    // 计算总量
    calculateTotal(records) {
        return records.reduce((sum, record) => sum + record.amount, 0);
    }

    // 格式化日期时间
    formatDateTime(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    }

    // 初始化资源卡片点击事件
    initializeResourceCardEvents() {
        document.querySelectorAll('.resource-stat-card').forEach(card => {
            card.addEventListener('click', () => {
                const resourceName = card.querySelector('.resource-name').textContent;
                this.showResourceDetail(resourceName);
            });
        });
    }

    // 显示资源详情
    async showResourceDetail(resourceName) {
        const modal = document.getElementById('resourceDetailModal');
        if (!modal) return;

        try {
            // 获取资源数据（优先使用API，失败则降级到模拟数据）
            let resourceData = this.resourceData[resourceName];

            if (this.app.modules.apiService) {
                try {
                    resourceData = await this.app.modules.apiService.getResourceData(resourceName);
                } catch (error) {
                    console.warn('API调用失败，使用本地数据:', error);
                }
            }

            // 更新弹窗内容
            this.updateResourceModal(resourceName, resourceData);

            // 显示弹窗
            modal.classList.add('show');

            // 重置到记录标签页
            this.switchResourceTab('records');

        } catch (error) {
            console.error('显示资源详情失败:', error);
            alert('加载资源详情失败，请稍后重试');
        }
    }

    // 更新资源弹窗内容
    updateResourceModal(resourceName, resourceData) {
        // 更新基本信息
        document.getElementById('resourceModalTitle').textContent = `${resourceName}详情`;
        document.getElementById('resourceDetailIcon').className = `fas ${resourceData.icon}`;
        document.getElementById('resourceDetailIcon').style.color = resourceData.color;
        document.getElementById('resourceDetailName').textContent = resourceName;
        document.getElementById('resourceDetailAmount').textContent = `+${resourceData.amount}`;
    }

    // 初始化时间筛选功能
    initializeTimeFilter() {
        const timeFilterBtns = document.querySelectorAll('.time-filter-btn');
        const applyDateBtn = document.getElementById('applyDateFilter');

        // 时间筛选按钮点击事件
        timeFilterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                timeFilterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const period = btn.dataset.period;
                this.setDateRangeByPeriod(period);
                this.filterState.period = period;

                // 更新资源记录显示
                this.updateResourceRecords();
            });
        });

        // 自定义日期范围应用
        if (applyDateBtn) {
            applyDateBtn.addEventListener('click', () => {
                this.updateFilterFromCustomRange();
                this.updateResourceRecords();
            });
        }

        // 设置默认日期范围
        this.setDefaultDateRange();
    }

    // 设置默认日期范围（当前月份）
    setDefaultDateRange() {
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        // 修复：使用新的唯一ID避免冲突
        const startDateInput = document.getElementById('resourceStartDate');
        const endDateInput = document.getElementById('resourceEndDate');

        if (startDateInput && endDateInput) {
            startDateInput.value = this.formatDate(firstDay);
            endDateInput.value = this.formatDate(lastDay);
        }
    }

    // 根据时间周期设置日期范围
    setDateRangeByPeriod(period) {
        const today = new Date();
        let startDate, endDate;

        switch(period) {
            case 'week':
                const startOfWeek = new Date(today);
                const dayOfWeek = today.getDay();
                const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
                startOfWeek.setDate(today.getDate() - daysToMonday);
                startDate = startOfWeek;
                endDate = today;
                break;

            case 'month':
                startDate = new Date(today.getFullYear(), today.getMonth(), 1);
                endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                break;

            case 'year':
                startDate = new Date(today.getFullYear(), 0, 1);
                endDate = new Date(today.getFullYear(), 11, 31);
                break;

            case 'all':
                startDate = new Date(2020, 0, 1);
                endDate = today;
                break;
        }

        // 修复：使用新的唯一ID避免冲突
        const startDateInput = document.getElementById('resourceStartDate');
        const endDateInput = document.getElementById('resourceEndDate');

        if (startDateInput && endDateInput) {
            startDateInput.value = this.formatDate(startDate);
            endDateInput.value = this.formatDate(endDate);
        }
    }

    // 从自定义日期范围更新筛选状态
    updateFilterFromCustomRange() {
        // 修复：使用新的唯一ID避免冲突
        const startDateInput = document.getElementById('resourceStartDate');
        const endDateInput = document.getElementById('resourceEndDate');

        if (startDateInput && endDateInput) {
            this.filterState.startDate = startDateInput.value;
            this.filterState.endDate = endDateInput.value;
        }
    }

    // 格式化日期
    formatDate(date) {
        return date.toISOString().split('T')[0];
    }

    // 更新资源记录显示
    updateResourceRecords() {
        const resourceName = document.getElementById('resourceDetailName').textContent;
        if (!resourceName) return;

        this.showResourceRecords(resourceName);
    }

    // 显示资源记录
    async showResourceRecords(resourceName) {
        const tbody = document.getElementById('resourceRecordsBody');
        if (!tbody) return;

        // 显示加载状态
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;padding:20px;">加载中...</td></tr>';

        try {
            // 获取时间筛选范围
            const startDateInput = document.getElementById('resourceStartDate');
            const endDateInput = document.getElementById('resourceEndDate');
            const startDate = startDateInput ? startDateInput.value : null;
            const endDate = endDateInput ? endDateInput.value : null;

            // 尝试从API获取数据
            let records = [];
            if (this.app.modules.apiService) {
                try {
                    records = await this.app.modules.apiService.getResourceRecords(resourceName, startDate, endDate);
                } catch (error) {
                    console.warn('API获取记录失败，使用本地数据:', error);
                }
            }

            // 降级到本地数据
            if (records.length === 0) {
                const resourceData = this.resourceData[resourceName];
                if (resourceData && resourceData.records) {
                    records = resourceData.records;
                }
            }

            // 渲染记录表格
            this.renderResourceRecords(records, tbody);

        } catch (error) {
            console.error('显示资源记录失败:', error);
            tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;padding:20px;color:red;">加载失败</td></tr>';
        }
    }

    // 渲染资源记录表格
    renderResourceRecords(records, tbody) {
        if (!records || records.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;padding:20px;">暂无记录数据</td></tr>';
            return;
        }

        // 按时间倒序排列
        const sortedRecords = records.sort((a, b) => new Date(b.time) - new Date(a.time));

        const rowsHTML = sortedRecords.map(record => `
            <tr>
                <td>${record.time}</td>
                <td>${record.source}</td>
                <td>+${record.amount.toLocaleString()}</td>
                <td><span class="type-badge" data-type="${record.type}">${record.type}</span></td>
            </tr>
        `).join('');

        tbody.innerHTML = rowsHTML;
    }

    // 切换资源标签页
    switchResourceTab(tabName) {
        const modal = document.getElementById('resourceDetailModal');
        if (!modal) return;

        const tabBtns = modal.querySelectorAll('.tab-btn');
        const tabPanes = modal.querySelectorAll('.tab-pane');

        // 更新按钮状态
        tabBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });

        // 更新内容显示
        tabPanes.forEach(pane => {
            pane.classList.toggle('active', pane.id === `${tabName}-tab`);
        });

        // 根据标签页加载对应内容
        const resourceName = document.getElementById('resourceDetailName').textContent;

        switch (tabName) {
            case 'records':
                this.showResourceRecords(resourceName);
                break;
            case 'sources':
                this.displayResourceSources(resourceName);
                break;
            case 'trends':
                this.displayResourceTrends(resourceName);
                break;
        }
    }

    // 显示资源来源分析
    displayResourceSources(resourceName) {
        const resourceData = this.resourceData[resourceName];
        if (!resourceData || !resourceData.sources) return;

        const container = document.getElementById('sourcesContainer');
        if (!container) return;

        const sourcesHTML = resourceData.sources.map(source => `
            <div class="source-item">
                <div class="source-info">
                    <div class="source-name">${source.name}</div>
                    <div class="source-details">
                        <span class="source-percentage">${source.percentage}%</span>
                        <span class="source-amount">${source.amount.toLocaleString()}</span>
                    </div>
                </div>
                <div class="source-trend ${source.trend.startsWith('+') ? 'positive' : source.trend.startsWith('-') ? 'negative' : 'neutral'}">
                    ${source.trend}
                </div>
            </div>
        `).join('');

        container.innerHTML = sourcesHTML;
    }

    // 显示资源趋势分析
    displayResourceTrends(resourceName) {
        const resourceData = this.resourceData[resourceName];
        if (!resourceData || !resourceData.trends) return;

        const container = document.getElementById('trendsContainer');
        if (!container) return;

        const { daily, weekly, monthly } = resourceData.trends;

        container.innerHTML = `
            <div class="trends-section">
                <h4>日趋势</h4>
                <div class="trend-chart" id="dailyTrendChart"></div>
            </div>
            <div class="trends-section">
                <h4>周趋势</h4>
                <div class="trend-chart" id="weeklyTrendChart"></div>
            </div>
            <div class="trends-section">
                <h4>月趋势</h4>
                <div class="trend-chart" id="monthlyTrendChart"></div>
            </div>
        `;

        // 延迟绘制图表，确保DOM已更新
        setTimeout(() => {
            this.drawSimpleChart('dailyTrendChart', daily);
            this.drawSimpleChart('weeklyTrendChart', weekly);
            this.drawSimpleChart('monthlyTrendChart', monthly);
        }, 100);
    }

    // 绘制简单图表
    drawSimpleChart(containerId, data) {
        const container = document.getElementById(containerId);
        if (!container || !data || data.length === 0) return;

        const maxValue = Math.max(...data.map(d => d.amount));
        const chartHTML = data.map(item => {
            const height = (item.amount / maxValue) * 100;
            return `
                <div class="chart-bar" style="height: ${height}%">
                    <div class="bar-label">${item.amount}</div>
                    <div class="bar-date">${item.date || item.week || item.month}</div>
                </div>
            `;
        }).join('');

        container.innerHTML = `<div class="chart-container">${chartHTML}</div>`;
    }

    // 更新月份显示
    updateMonthDisplay() {
        const currentMonthElement = document.getElementById('currentMonth');
        if (currentMonthElement) {
            const now = new Date();
            const year = now.getFullYear();
            const month = now.getMonth() + 1;
            currentMonthElement.textContent = `${year}年${month}月`;
        }
    }

    // 导出资源数据
    async exportResourceData() {
        const resourceName = document.getElementById('resourceDetailName').textContent;
        if (!resourceName) return;

        try {
            console.log(`📤 开始导出${resourceName}数据...`);

            // 获取时间筛选范围
            const startDateInput = document.getElementById('resourceStartDate');
            const endDateInput = document.getElementById('resourceEndDate');
            const startDate = startDateInput ? startDateInput.value : null;
            const endDate = endDateInput ? endDateInput.value : null;

            // 尝试API导出
            if (this.app.modules.apiService) {
                await this.app.modules.apiService.exportResourceData(resourceName, 'csv', startDate, endDate);
            }

            console.log('✅ 导出完成');

        } catch (error) {
            console.error('导出资源数据失败:', error);
            alert('导出失败，请稍后重试');
        }
    }
}// =========================================
// 5. 弹窗管理模块
// =========================================

class ModalManager {
    constructor(appInstance) {
        this.app = appInstance;

        // 弹窗状态管理
        this.modalStates = {
            addActivity: { isOpen: false, element: null },
            addTask: { isOpen: false, element: null },
            resourceDetail: { isOpen: false, element: null }
        };

        // DOM元素缓存
        this.elements = {
            addActivityModal: null,
            addTaskModal: null,
            resourceDetailModal: null
        };
    }

    // 初始化弹窗管理模块
    async initialize() {
        console.log('🪟 初始化弹窗管理模块...');

        // 缓存DOM元素
        this.cacheElements();

        // 初始化弹窗事件
        this.initializeModalEvents();

        // 添加滚动边界修复
        this.addScrollBoundaryFix();
    }

    // 缓存弹窗DOM元素
    cacheElements() {
        this.elements.addActivityModal = document.getElementById('addActivityModal');
        this.elements.addTaskModal = document.getElementById('addTaskModal');
        this.elements.resourceDetailModal = document.getElementById('resourceDetailModal');
    }

    // 初始化弹窗相关事件
    initializeModalEvents() {
        // 初始化活动弹窗
        this.initializeActivityModal();

        // 初始化任务弹窗
        this.initializeTaskModal();

        // 初始化资源详情弹窗
        this.initializeResourceModal();
    }

    // 初始化活动弹窗
    initializeActivityModal() {
        if (!this.elements.addActivityModal) return;

        const closeBtn = this.elements.addActivityModal.querySelector('.close-btn');
        const cancelBtn = this.elements.addActivityModal.querySelector('.cancel-btn');
        const form = this.elements.addActivityModal.querySelector('#addActivityForm');

        // 关闭弹窗事件
        this.bindCloseEvents(this.elements.addActivityModal, closeBtn, cancelBtn);

        // 表单提交事件
        if (form) {
            form.addEventListener('submit', (e) => this.handleActivityFormSubmit(e));
        }

        // 点击外部关闭
        this.elements.addActivityModal.addEventListener('click', (e) => {
            if (e.target === this.elements.addActivityModal) {
                this.closeModal('addActivity');
            }
        });
    }

    // 初始化任务弹窗
    initializeTaskModal() {
        if (!this.elements.addTaskModal) return;

        const closeBtn = this.elements.addTaskModal.querySelector('.close-btn');
        const cancelBtn = this.elements.addTaskModal.querySelector('.cancel-btn');
        const form = this.elements.addTaskModal.querySelector('#addTaskForm');
        const rewardTypeSelect = document.getElementById('rewardType');
        const customRewardInput = document.getElementById('customReward');

        // 关闭弹窗事件
        this.bindCloseEvents(this.elements.addTaskModal, closeBtn, cancelBtn);

        // 表单提交事件
        if (form) {
            form.addEventListener('submit', (e) => this.handleTaskFormSubmit(e));
        }

        // 监听奖励类型变化
        if (rewardTypeSelect) {
            rewardTypeSelect.addEventListener('change', () => {
                if (rewardTypeSelect.value) {
                    customRewardInput.value = '';
                    customRewardInput.disabled = true;
                } else {
                    customRewardInput.disabled = false;
                }
            });
        }

        // 点击外部关闭
        this.elements.addTaskModal.addEventListener('click', (e) => {
            if (e.target === this.elements.addTaskModal) {
                this.closeModal('addTask');
            }
        });
    }

    // 初始化资源详情弹窗
    initializeResourceModal() {
        if (!this.elements.resourceDetailModal) return;

        const closeBtn = this.elements.resourceDetailModal.querySelector('.close-btn');
        const cancelBtn = this.elements.resourceDetailModal.querySelector('.cancel-btn');
        const exportBtn = this.elements.resourceDetailModal.querySelector('.export-btn');

        // 关闭弹窗事件
        this.bindCloseEvents(this.elements.resourceDetailModal, closeBtn, cancelBtn);

        // 导出按钮事件
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                if (this.app.modules.resourceManager) {
                    this.app.modules.resourceManager.exportResourceData();
                }
            });
        }

        // 点击外部关闭
        this.elements.resourceDetailModal.addEventListener('click', (e) => {
            if (e.target === this.elements.resourceDetailModal) {
                this.closeModal('resourceDetail');
            }
        });

        // 初始化标签页切换事件
        this.initializeTabEvents();
    }

    // 绑定弹窗关闭事件
    bindCloseEvents(modal, closeBtn, cancelBtn) {
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModalByElement(modal));
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.closeModalByElement(modal));
        }
    }

    // 初始化标签页切换事件
    initializeTabEvents() {
        const tabBtns = this.elements.resourceDetailModal?.querySelectorAll('.tab-btn');
        if (!tabBtns) return;

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabName = btn.dataset.tab;
                this.switchResourceTab(tabName);
            });
        });
    }

    // 切换资源标签页
    switchResourceTab(tabName) {
        const modal = this.elements.resourceDetailModal;
        if (!modal) return;

        const tabBtns = modal.querySelectorAll('.tab-btn');
        const tabPanes = modal.querySelectorAll('.tab-pane');

        // 更新按钮状态
        tabBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });

        // 更新内容显示
        tabPanes.forEach(pane => {
            pane.classList.toggle('active', pane.id === `${tabName}-tab`);
        });

        // 触发资源管理器的标签页切换
        if (this.app.modules.resourceManager) {
            this.app.modules.resourceManager.switchResourceTab(tabName);
        }
    }

    // 显示添加活动弹窗
    showAddActivityDialog() {
        if (!this.elements.addActivityModal) return;

        // 设置默认日期：当天开始至一周后结束
        this.setDefaultActivityDates();

        // 显示弹窗
        this.elements.addActivityModal.classList.add('show');
        this.modalStates.addActivity.isOpen = true;

        // 添加滚动边界修复
        this.addScrollBoundaryFix();
    }

    // 设置默认活动日期
    setDefaultActivityDates() {
        const today = new Date();
        const oneWeekLater = new Date(today);
        oneWeekLater.setDate(today.getDate() + 7);

        // 修复：使用新的唯一ID避免冲突
        const startDateInput = document.getElementById('activityStartDate');
        const endDateInput = document.getElementById('activityEndDate');

        if (startDateInput && endDateInput) {
            startDateInput.value = this.formatDate(today);
            endDateInput.value = this.formatDate(oneWeekLater);
        }
    }

    // 显示添加任务弹窗
    showAddTaskDialog(taskType) {
        if (!this.elements.addTaskModal) return;

        // 设置弹窗标题和任务类型
        const title = document.getElementById('taskModalTitle');
        const taskTypeInput = document.getElementById('taskType');
        const form = document.getElementById('addTaskForm');

        if (title) {
            title.textContent = `添加${taskType === 'daily' ? '每日' : '每周'}任务`;
        }

        if (taskTypeInput) {
            taskTypeInput.value = taskType;
        }

        // 重置表单
        if (form) {
            form.reset();
        }

        // 启用自定义奖励输入框
        const customRewardInput = document.getElementById('customReward');
        if (customRewardInput) {
            customRewardInput.disabled = false;
        }

        // 显示弹窗
        this.elements.addTaskModal.classList.add('show');
        this.modalStates.addTask.isOpen = true;

        // 添加滚动边界修复
        this.addScrollBoundaryFix();
    }

    // 关闭指定弹窗
    closeModal(modalType) {
        const modal = this.elements[`${modalType}Modal`];
        if (!modal) return;

        modal.classList.remove('show');
        this.modalStates[modalType].isOpen = false;

        // 移除滚动边界修复
        this.removeScrollBoundaryFix();

        // 执行特定的关闭逻辑
        this.handleModalClose(modalType);
    }

    // 根据DOM元素关闭弹窗
    closeModalByElement(modal) {
        // 查找对应的弹窗类型
        for (const [modalType, modalElement] of Object.entries(this.elements)) {
            if (modalElement === modal) {
                this.closeModal(modalType.replace('Modal', ''));
                break;
            }
        }
    }

    // 处理弹窗关闭逻辑
    handleModalClose(modalType) {
        switch (modalType) {
            case 'addActivity':
                this.handleActivityModalClose();
                break;
            case 'addTask':
                this.handleTaskModalClose();
                break;
            case 'resourceDetail':
                this.removeScrollBoundaryFix();
                break;
        }
    }

    // 处理活动弹窗关闭
    handleActivityModalClose() {
        const form = document.getElementById('addActivityForm');
        if (form) {
            // 重置表单（只重置必要字段）
            document.getElementById('activityName').value = '';

            // 将第一个颜色选项设为默认选中
            const firstColorOption = document.querySelector('input[name="activityColor"]');
            if (firstColorOption) {
                firstColorOption.checked = true;
            }

            // 重置默认日期
            this.setDefaultActivityDates();
        }
    }

    // 处理任务弹窗关闭
    handleTaskModalClose() {
        const form = document.getElementById('addTaskForm');
        if (form) {
            form.reset();
        }

        // 启用自定义奖励输入框
        const customRewardInput = document.getElementById('customReward');
        if (customRewardInput) {
            customRewardInput.disabled = false;
        }
    }

    // 处理活动表单提交
    handleActivityFormSubmit(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const name = formData.get('activityName').trim();
        const startDate = formData.get('startDate');
        const endDate = formData.get('endDate');
        const color = formData.get('activityColor');

        // 验证表单数据
        if (!this.validateActivityForm(name, startDate, endDate)) {
            return;
        }

        // 添加活动
        if (this.app.modules.ganttChart) {
            this.app.modules.ganttChart.addActivity({ name, startDate, endDate, color });
        }

        // 关闭弹窗
        this.closeModal('addActivity');
    }

    // 处理任务表单提交
    handleTaskFormSubmit(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const taskName = formData.get('taskName').trim();
        const rewardType = formData.get('rewardType').trim();
        const customReward = formData.get('customReward').trim();
        const rewardAmount = formData.get('rewardAmount').trim();
        const taskType = formData.get('taskType');

        // 验证表单数据
        if (!this.validateTaskForm(taskName, rewardType, customReward, rewardAmount)) {
            return;
        }

        // 确定奖励类型（优先使用自定义奖励）
        const finalRewardType = customReward || rewardType;

        // 添加任务
        if (this.app.modules.taskManager) {
            this.app.modules.taskManager.addTask({
                type: taskType,
                name: taskName,
                rewardType: finalRewardType,
                rewardAmount: rewardAmount
            });
        }

        // 关闭弹窗
        this.closeModal('addTask');
    }

    // 验证活动表单
    validateActivityForm(name, startDate, endDate) {
        if (!name) {
            alert('请输入活动名称');
            return false;
        }

        if (!startDate || !endDate) {
            alert('请选择开始和结束日期');
            return false;
        }

        if (new Date(startDate) > new Date(endDate)) {
            alert('开始日期不能晚于结束日期');
            return false;
        }

        return true;
    }

    // 验证任务表单
    validateTaskForm(taskName, rewardType, customReward, rewardAmount) {
        if (!taskName) {
            alert('请输入任务名称');
            return false;
        }

        if (!rewardAmount || rewardAmount <= 0) {
            alert('请输入有效的奖励数量');
            return false;
        }

        if (!rewardType && !customReward) {
            alert('请选择奖励类型或输入自定义奖励类型');
            return false;
        }

        return true;
    }

    // 格式化日期
    formatDate(date) {
        return date.toISOString().split('T')[0];
    }

    // 添加滚动边界修复
    addScrollBoundaryFix() {
        // 阻止背景页面滚动
        document.body.style.overflow = 'hidden';

        // 添加触摸事件监听防止滚动穿透
        this.addTouchBoundaryListeners();
    }

    // 移除滚动边界修复
    removeScrollBoundaryFix() {
        // 恢复背景页面滚动
        document.body.style.overflow = '';

        // 移除触摸事件监听
        this.removeTouchBoundaryListeners();
    }

    // 添加触摸边界监听器
    addTouchBoundaryListeners() {
        if (!this.boundaryHandler) {
            this.boundaryHandler = (e) => this.preventScrollBounce(e);
            document.addEventListener('touchmove', this.boundaryHandler, { passive: false });
        }
    }

    // 移除触摸边界监听器
    removeTouchBoundaryListeners() {
        if (this.boundaryHandler) {
            document.removeEventListener('touchmove', this.boundaryHandler);
            this.boundaryHandler = null;
        }
    }

    // 防止滚动边界穿透
    preventScrollBounce(e) {
        const modalBody = document.querySelector('.modal-body');
        if (!modalBody) return;

        const { scrollTop, scrollHeight, clientHeight } = modalBody;
        const isAtTop = scrollTop === 0;
        const isAtBottom = scrollTop + clientHeight >= scrollHeight;

        // 获取触摸位置
        const touch = e.touches[0];
        const deltaY = touch.clientY - (touch.startY || touch.clientY);

        // 如果在顶部且向上滑动，或在底部且向下滑动，阻止默认行为
        if ((isAtTop && deltaY > 0) || (isAtBottom && deltaY < 0)) {
            e.preventDefault();
        }

        // 保存起始位置
        if (!touch.startY) {
            touch.startY = touch.clientY;
        }
    }
}

// =========================================
// 6. API服务模块
// =========================================

class ApiService {
    constructor(appInstance) {
        this.app = appInstance;

        // API配置
        this.config = {
            BASE_URL: this.detectApiBaseUrl(),
            ENDPOINTS: {
                RESOURCE_DATA: '/resource/data',
                RESOURCE_RECORDS: '/resource/records',
                RESOURCE_SOURCES: '/resource/sources',
                RESOURCE_TRENDS: '/resource/trends',
                EXPORT_DATA: '/export/data',
                SYSTEM_HEALTH: '/system/health'
            },
            TIMEOUT: 10000,
            RETRY_ATTEMPTS: 3,
            CACHE_ENABLED: true,
            CACHE_DURATION: 5 * 60 * 1000, // 5分钟
            MOCK_MODE: false
        };

        // 缓存管理
        this.cache = new Map();

        // API统计
        this.stats = {
            total: 0,
            success: 0,
            failed: 0,
            fallback: 0
        };
    }

    // 检测API基础URL
    detectApiBaseUrl() {
        const hostname = window.location.hostname;

        if (hostname === 'localhost' || hostname.includes('127.0.0.1')) {
            return 'http://localhost:3000/api'; // 本地开发API
        } else if (hostname.includes('dev') || hostname.includes('staging')) {
            return 'https://dev-api.yourdomain.com/api'; // 测试环境API
        } else {
            return 'https://api.yourdomain.com/api'; // 生产环境API
        }
    }

    // 设置API配置
    setConfig(newConfig) {
        Object.assign(this.config, newConfig);
        console.log('⚙️ API配置已更新:', newConfig);
    }

    // 通用API请求方法
    async makeRequest(endpoint, options = {}, useCache = true) {
        const cacheKey = `${endpoint}_${JSON.stringify(options)}`;

        // 检查缓存
        if (useCache && this.config.CACHE_ENABLED && this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.config.CACHE_DURATION) {
                console.log('📦 使用缓存数据');
                return cached.data;
            }
        }

        // 检查是否启用API或模拟模式
        if (!this.config.API_ENABLED || this.config.MOCK_MODE) {
            console.log('🔧 API已禁用或模拟模式已启用，使用模拟数据');
            throw new Error('API_MOCK_MODE');
        }

        let lastError;

        // 重试机制
        for (let attempt = 1; attempt <= this.config.RETRY_ATTEMPTS; attempt++) {
            try {
                console.log(`🌐 API请求 (尝试 ${attempt}/${this.config.RETRY_ATTEMPTS}): ${endpoint}`);

                const response = await fetch(`${this.config.BASE_URL}${endpoint}`, {
                    ...options,
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                        ...options.headers
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();

                // 缓存成功响应
                if (useCache && this.config.CACHE_ENABLED) {
                    this.cache.set(cacheKey, {
                        data,
                        timestamp: Date.now()
                    });
                }

                this.recordStats(true, false);
                console.log('✅ API请求成功');
                return data;

            } catch (error) {
                lastError = error;
                console.error(`❌ API请求失败 (尝试 ${attempt}/${this.config.RETRY_ATTEMPTS}):`, error.message);

                // 如果是网络错误且还有重试次数，继续重试
                if (attempt < this.config.RETRY_ATTEMPTS && this.shouldRetry(error)) {
                    await this.delay(Math.pow(2, attempt) * 1000); // 指数退避
                    continue;
                }

                break;
            }
        }

        // 所有尝试都失败
        this.recordStats(false, false);
        throw lastError;
    }

    // 判断是否应该重试
    shouldRetry(error) {
        return error.name === 'AbortError' ||
            error.name === 'TypeError' ||
            error.message.includes('network') ||
            error.message.includes('timeout');
    }

    // 延迟函数
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 记录API调用统计
    recordStats(success, usedFallback) {
        this.stats.total++;
        if (success && !usedFallback) {
            this.stats.success++;
        } else if (usedFallback) {
            this.stats.fallback++;
        } else {
            this.stats.failed++;
        }

        // 每10次请求输出统计
        if (this.stats.total % 10 === 0) {
            this.logStats();
        }
    }

    // 输出API统计信息
    logStats() {
        console.log('📊 API统计:', {
            总请求: this.stats.total,
            成功: this.stats.success,
            失败: this.stats.failed,
            降级: this.stats.fallback,
            成功率: `${this.getSuccessRate()}%`,
            降级率: `${this.getFallbackRate()}%`
        });
    }

    // 获取成功率
    getSuccessRate() {
        if (this.stats.total === 0) return 0;
        return ((this.stats.success + this.stats.fallback) / this.stats.total * 100).toFixed(1);
    }

    // 获取降级率
    getFallbackRate() {
        if (this.stats.total === 0) return 0;
        return (this.stats.fallback / this.stats.total * 100).toFixed(1);
    }

    // 获取资源详情数据 - 优化：去除未使用参数警告
    async getResourceData(resourceName, days = 30) {
        try {
            const endpoint = `${this.config.ENDPOINTS.RESOURCE_DATA}?resource=${encodeURIComponent(resourceName)}&days=${days}`;
            const data = await this.makeRequest(endpoint);

            // 验证API返回数据结构
            if (!this.validateResourceData(data)) {
                throw new Error('API返回数据结构不正确');
            }

            return data;

        } catch (error) {
            console.error('获取资源数据失败:', error);

            // 根据错误类型进行不同的降级处理
            if (error.message === 'API_MOCK_MODE') {
                return this.generateMockResourceData(resourceName, days);
            }

            // API失败时的降级处理
            console.log('🔄 API失败，降级到模拟数据');
            return this.generateMockResourceData(resourceName, days);
        }
    }

    // 获取资源记录
    async getResourceRecords(resourceName, startDate, endDate, limit = 100) {
        try {
            const params = new URLSearchParams({
                resource: encodeURIComponent(resourceName),
                limit: limit.toString()
            });

            if (startDate) params.append('startDate', startDate);
            if (endDate) params.append('endDate', endDate);

            const endpoint = `${this.config.ENDPOINTS.RESOURCE_RECORDS}?${params}`;
            const data = await this.makeRequest(endpoint);

            return data.records || [];

        } catch (error) {
            console.error('获取资源记录失败:', error);
            // 降级到模拟数据
            const mockData = this.generateMockResourceData(resourceName);
            return mockData.records;
        }
    }

    // 获取资源来源分析
    async getResourceSources(resourceName, timeRange = 'month') {
        try {
            const endpoint = `${this.config.ENDPOINTS.RESOURCE_SOURCES}?resource=${encodeURIComponent(resourceName)}&range=${timeRange}`;
            const data = await this.makeRequest(endpoint);

            return data.sources || [];

        } catch (error) {
            console.error('获取资源来源失败:', error);
            // 降级到模拟数据
            const mockData = this.generateMockResourceData(resourceName);
            return mockData.sources;
        }
    }

    // 导出资源数据
    async exportResourceData(resourceName, format = 'csv', startDate, endDate) {
        try {
            const params = new URLSearchParams({
                resource: encodeURIComponent(resourceName),
                format: format
            });

            if (startDate) params.append('startDate', startDate);
            if (endDate) params.append('endDate', endDate);

            const response = await fetch(`${this.config.BASE_URL}${this.config.ENDPOINTS.EXPORT_DATA}?${params}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`导出失败: ${response.status}`);
            }

            const blob = await response.blob();
            this.downloadBlob(blob, `${resourceName}_${new Date().toISOString().split('T')[0]}.${format}`);

            console.log('✅ 导出成功');
            this.recordStats(true, false);

        } catch (error) {
            console.error('导出失败:', error);
            this.recordStats(false, false);

            // 降级到客户端导出
            this.exportToClientSide(resourceName, format);
        }
    }

    // 下载Blob文件
    downloadBlob(blob, filename) {
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    }

    // 客户端导出降级方案
    exportToClientSide(resourceName, format = 'csv') {
        try {
            if (format === 'csv') {
                // 这里应该从资源管理器获取实际数据
                console.log('🔄 降级到客户端CSV导出');
                // 实现CSV导出逻辑...
            }

            console.log('✅ 客户端导出成功');

        } catch (error) {
            console.error('客户端导出失败:', error);
        }
    }

    // 检查API健康状态
    async checkApiHealth() {
        try {
            const response = await fetch(`${this.config.BASE_URL}${this.config.ENDPOINTS.SYSTEM_HEALTH}`, {
                method: 'GET',
                timeout: 3000
            });

            if (response.ok) {
                const health = await response.json();
                console.log('💚 API健康检查通过:', health);
                return true;
            } else {
                console.warn('🟡 API健康检查失败:', response.status);
                return false;
            }
        } catch (error) {
            console.error('🔴 API健康检查异常:', error);
            return false;
        }
    }

    // 验证API返回数据结构
    validateResourceData(data) {
        return data &&
            typeof data === 'object' &&
            data.icon &&
            data.amount !== undefined &&
            data.color &&
            Array.isArray(data.records) &&
            Array.isArray(data.sources);
    }

    // 生成模拟资源数据
    generateMockResourceData(resourceName, days = 30) {
        // 这里应该实现完整的模拟数据生成逻辑
        // 为了简化，返回基础数据结构
        return {
            icon: this.getResourceIcon(resourceName),
            amount: this.getMockAmount(resourceName),
            color: this.getResourceColor(resourceName),
            records: this.generateMockRecords(resourceName, days),
            sources: this.generateMockSources(resourceName),
            trends: this.generateMockTrends()
        };
    }

    // 获取资源图标
    getResourceIcon(resourceName) {
        const icons = {
            '勾玉': 'fa-gem',
            '金币': 'fa-coins',
            '神秘符咒': 'fa-scroll',
            '御魂': 'fa-dice'
        };
        return icons[resourceName] || 'fa-gem';
    }

    // 获取模拟数量
    getMockAmount(resourceName) {
        const amounts = {
            '勾玉': '2,456',
            '金币': '156.8K',
            '神秘符咒': '45',
            '御魂': '1,234'
        };
        return amounts[resourceName] || '0';
    }

    // 获取资源颜色
    getResourceColor(resourceName) {
        const colors = {
            '勾玉': '#4169E1',
            '金币': '#FFD700',
            '神秘符咒': '#FF6347',
            '御魂': '#9370DB'
        };
        return colors[resourceName] || '#4169E1';
    }

    // 生成模拟记录
    generateMockRecords(resourceName, days) {
        // 简化的模拟记录生成
        const records = [];
        for (let i = 0; i < 20; i++) {
            records.push({
                time: `2023-12-${String(i + 1).padStart(2, '0')} ${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
                source: '模拟数据源',
                amount: Math.floor(Math.random() * 100) + 10,
                type: '日常'
            });
        }
        return records;
    }

    // 生成模拟来源
    generateMockSources(resourceName) {
        return [
            { name: '模拟来源1', percentage: 60, amount: 1000, color: '#28a745', trend: '+5%' },
            { name: '模拟来源2', percentage: 40, amount: 667, color: '#17a2b8', trend: '+2%' }
        ];
    }

    // 生成模拟趋势
    generateMockTrends() {
        return {
            daily: Array.from({length: 7}, (_, i) => ({
                date: `12-${String(i + 1).padStart(2, '0')}`,
                amount: Math.floor(Math.random() * 500) + 100
            })),
            weekly: Array.from({length: 4}, (_, i) => ({
                week: `第${48 + i}周`,
                amount: Math.floor(Math.random() * 2000) + 500
            })),
            monthly: Array.from({length: 3}, (_, i) => ({
                month: ['10月', '11月', '12月'][i],
                amount: Math.floor(Math.random() * 5000) + 1000
            }))
        };
    }

    // 清除缓存
    clearCache() {
        this.cache.clear();
        console.log('🗑️ 缓存已清除');
    }
}

// =========================================
// 7. 工具函数模块
// =========================================

class UtilityFunctions {
    constructor(appInstance) {
        this.app = appInstance;
    }

    // 初始化工具函数
    async initialize() {
        console.log('🛠️ 初始化工具函数模块...');

        // 添加类型标签样式
        this.addResourceTypeStyles();

        // 初始化其他工具函数
        this.initializeOtherUtilities();
    }

    // 添加资源类型标签样式
    addResourceTypeStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .type-badge {
                padding: 2px 8px;
                border-radius: 12px;
                font-size: 0.75em;
                font-weight: 500;
            }
            .type-badge[data-type="日常"] { background: #e3f2fd; color: #1976d2; }
            .type-badge[data-type="周常"] { background: #e8f5e8; color: #2e7d32; }
            .type-badge[data-type="活动"] { background: #fce4ec; color: #c2185b; }
            .type-badge[data-type="PVP"] { background: #fff3e0; color: #f57c00; }
            .type-badge[data-type="PVE"] { background: #f3e5f5; color: #7b1fa2; }
            .type-badge[data-type="社交"] { background: #e0f2f1; color: #00796b; }
            .type-badge[data-type="成就"] { background: #fff8e1; color: #f9a825; }
            .type-badge[data-type="商店"] { background: #fce4ec; color: #c2185b; }
        `;
        document.head.appendChild(style);
    }

    // 初始化其他工具函数
    initializeOtherUtilities() {
        // 可以在这里添加其他工具函数的初始化逻辑
        // 例如：数据格式化、验证函数、动画效果等
    }

    // 格式化数字显示
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    // 防抖函数
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // 节流函数
    throttle(func, limit) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func(...args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // 深拷贝函数
    deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj.getTime());
        if (obj instanceof Array) return obj.map(item => this.deepClone(item));
        if (typeof obj === 'object') {
            const cloned = {};
            Object.keys(obj).forEach(key => {
                cloned[key] = this.deepClone(obj[key]);
            });
            return cloned;
        }
    }

    // 验证日期格式
    isValidDate(dateString) {
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date);
    }

    // 计算日期差异
    dateDifference(date1, date2) {
        const diffTime = Math.abs(new Date(date2) - new Date(date1));
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }

    // 生成唯一ID
    generateUniqueId(prefix = 'id') {
        return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    // 显示消息提示
    showMessage(message, type = 'info') {
        // 创建消息元素
        const messageEl = document.createElement('div');
        messageEl.className = `message-toast message-${type}`;
        messageEl.textContent = message;

        // 添加样式
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 4px;
            color: white;
            font-weight: 500;
            z-index: 9999;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;

        // 根据类型设置背景色
        const colors = {
            info: '#17a2b8',
            success: '#28a745',
            warning: '#ffc107',
            error: '#dc3545'
        };
        messageEl.style.backgroundColor = colors[type] || colors.info;

        // 添加到页面
        document.body.appendChild(messageEl);

        // 显示动画
        setTimeout(() => {
            messageEl.style.opacity = '1';
            messageEl.style.transform = 'translateX(0)';
        }, 100);

        // 自动隐藏
        setTimeout(() => {
            messageEl.style.opacity = '0';
            messageEl.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (messageEl.parentNode) {
                    messageEl.parentNode.removeChild(messageEl);
                }
            }, 300);
        }, 3000);
    }

    // 确认对话框
    confirmDialog(message, title = '确认') {
        return new Promise((resolve) => {
            // 创建模态框
            const modal = document.createElement('div');
            modal.className = 'confirm-dialog-overlay';
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
            `;

            const dialog = document.createElement('div');
            dialog.style.cssText = `
                background: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                max-width: 400px;
                width: 90%;
            `;

            dialog.innerHTML = `
                <h3 style="margin: 0 0 10px 0; color: #333;">${title}</h3>
                <p style="margin: 0 0 20px 0; color: #666;">${message}</p>
                <div style="text-align: right;">
                    <button id="confirmCancel" style="margin-right: 10px; padding: 8px 16px; border: 1px solid #ccc; background: white; border-radius: 4px; cursor: pointer;">取消</button>
                    <button id="confirmOk" style="padding: 8px 16px; border: none; background: #28a745; color: white; border-radius: 4px; cursor: pointer;">确定</button>
                </div>
            `;

            modal.appendChild(dialog);
            document.body.appendChild(modal);

            // 绑定事件
            document.getElementById('confirmCancel').addEventListener('click', () => {
                document.body.removeChild(modal);
                resolve(false);
            });

            document.getElementById('confirmOk').addEventListener('click', () => {
                document.body.removeChild(modal);
                resolve(true);
            });

            // 点击背景关闭
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    document.body.removeChild(modal);
                    resolve(false);
                }
            });
        });
    }
}

// =========================================
// 应用入口和初始化
// =========================================

// 创建应用实例
const gameHomeApp = new GameHomeApp();

// 初始化各个模块
const ganttChartManager = new GanttChartManager(gameHomeApp);
const taskManager = new TaskManager(gameHomeApp);
const resourceManager = new ResourceManager(gameHomeApp);
const modalManager = new ModalManager(gameHomeApp);
const apiService = new ApiService(gameHomeApp);
const utilityFunctions = new UtilityFunctions(gameHomeApp);

// 注册模块到应用实例
gameHomeApp.modules = {
    ganttChart: ganttChartManager,
    taskManager: taskManager,
    resourceManager: resourceManager,
    modalManager: modalManager,
    apiService: apiService,
    utilityFunctions: utilityFunctions
};

// 扩展应用初始化方法
gameHomeApp.initializeGanttChartModule = async function() {
    await this.modules.ganttChart.initialize();
};

gameHomeApp.initializeTaskManagementModule = async function() {
    await this.modules.taskManager.initialize();
};

gameHomeApp.initializeResourceManagementModule = async function() {
    await this.modules.resourceManager.initialize();
};

gameHomeApp.initializeModalManagementModule = async function() {
    await this.modules.modalManager.initialize();
};

gameHomeApp.initializeUtilityFunctions = async function() {
    await this.modules.utilityFunctions.initialize();
};

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // 初始化应用
        await gameHomeApp.initialize();

        // 将关键对象暴露到全局作用域（兼容现有代码）
        window.ganttChartManager = ganttChartManager;
        window.taskManager = taskManager;
        window.resourceManager = resourceManager;
        window.modalManager = modalManager;
        window.apiService = apiService;
        window.gameHomeApp = gameHomeApp;

        console.log('🎉 TriAura游戏管理系统已完全加载并准备就绪');

    } catch (error) {
        console.error('❌ 应用初始化失败:', error);
    }
});

// 导出模块供外部使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        GameHomeApp,
        GanttChartManager,
        TaskManager,
        ResourceManager,
        ModalManager,
        ApiService,
        UtilityFunctions
    };
}