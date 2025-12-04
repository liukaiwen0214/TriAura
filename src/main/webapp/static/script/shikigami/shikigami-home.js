// 游戏管理首页JavaScript

// ------------------------ 全局变量 ------------------------

// 活动数据 - 更新为当前时间附近
const today = new Date();
const currentYear = today.getFullYear();
const currentMonth = today.getMonth();

// 彩虹色系定义 - 10种不同颜色，包含黑色
const rainbowColors = [
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

// 活动数组
const activities = [
    {
        id: 'bai gui ye xing',
        name: '百鬼夜行祭',
        startDate: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`,
        endDate: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-08`,
        color: rainbowColors[0]
    },
    {
        id: 'shi shen ji jie',
        name: '式神集结',
        startDate: `${currentYear}-${String(currentMonth).padStart(2, '0')}-20`,
        endDate: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-02`,
        color: rainbowColors[1]
    },
    {
        id: 'yu hun qiang hua',
        name: '御魂强化',
        startDate: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-05`,
        endDate: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-15`,
        color: rainbowColors[2]
    },
    {
        id: 'yin men tiao zhan',
        name: '阴门挑战',
        startDate: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-10`,
        endDate: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-20`,
        color: rainbowColors[3]
    },
    {
        id: 'jue xing ren wu',
        name: '觉醒任务',
        startDate: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-12`,
        endDate: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-18`,
        color: rainbowColors[4]
    },
    {
        id: 'dou ji sai ji',
        name: '斗技赛季',
        startDate: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`,
        endDate: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-25`,
        color: rainbowColors[5]
    },
    {
        id: 'yao guai tui zhi',
        name: '妖怪退治',
        startDate: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-08`,
        endDate: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-14`,
        color: rainbowColors[6]
    },
    {
        id: 'ting yuan tan suo',
        name: '庭院探索',
        startDate: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-15`,
        endDate: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-22`,
        color: rainbowColors[7]
    }
];

// 滑动相关变量
let currentOffset = 0; // 当前偏移天数
const maxOffset = 60; // 最大偏移天数
let daysToShow = 30; // 显示的天数
let currentView = 'month'; // 当前视图：month 或 week
let isDragging = false;
let isDraggingScrollbar = false;
let startX = 0;
let startOffset = 0;
let scrollbarTrackWidth = 0;

// 弹窗相关变量
let addActivityModal = null;
let addActivityForm = null;
let closeBtn = null;
let cancelBtn = null;
let saveBtn = null;

// ------------------------ 页面初始化 ------------------------

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function () {
    // 异步执行健康检查，不阻塞页面初始化
    performSystemHealthCheck().then(() => {
        console.log('🎉 页面和API系统初始化完成');
    });

    // 原有初始化逻辑
    initializeGanttChart();
    generateActivityList();
    initializeCountdowns();
    initializeTaskInteractions();
    updateMonthDisplay();
    initializeActivityInteractions();
    initializeTaskModal();
    initializeResourceModal();
    initializeResourceCardEvents();
    initializeResourceTabEvents();
});


// ------------------------ 甘特图相关 ------------------------

// 初始化甘特图
function initializeGanttChart() {
    generateTimelineHeader();
    generateActivityRows();
    updateActivityBars();
}

// 生成时间轴头部
function generateTimelineHeader() {
    const timelineDays = document.querySelector('.timeline-days');
    if (!timelineDays) return;

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const days = [];
    const monthLabels = [];

    // 计算起始日期
    let startDate = new Date(today);
    if (currentView === 'week') {
        // 周视图显示本周的7天，从周一到周日
        const dayOfWeek = today.getDay(); // 0是周日，1是周一
        const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        startDate.setDate(today.getDate() - daysToMonday);
    } else {
        // 月视图显示前后15天
        startDate.setDate(today.getDate() - 15 + currentOffset);
    }

    // 先生成月份标签数组
    for (let i = 0; i < daysToShow; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        const dayNum = date.getDate();
        const month = date.getMonth();
        const year = date.getFullYear();

        // 每月1号添加月份标签
        if (dayNum === 1) {
            const monthColor = month === currentMonth && year === currentYear ? '#28a745' : '#666';
            const monthLabel = `<div style="font-size:0.8em;color:${monthColor};font-weight:bold;grid-column:${i + 1};text-align:center;">${year}年${month + 1}月</div>`;
            monthLabels.push(monthLabel);
        }
    }

    // 生成日期
    for (let i = 0; i < daysToShow; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        const dayNum = date.getDate();
        const month = date.getMonth();
        const year = date.getFullYear();
        const isToday = date.toDateString() === today.toDateString();

        // 日期数字颜色
        let dayColor = '#000000';
        if (month !== currentMonth || year !== currentYear) {
            dayColor = '#666'; // 其他月份用灰色
        } else if (isToday) {
            dayColor = '#28a745'; // 今天用绿色
        }

        days.push(`<span ${isToday ? 'class="today"' : ''} style="color:${dayColor};font-weight:bold;">${dayNum}</span>`);
    }

    // 组合HTML：月份标签行 + 日期行
    timelineDays.innerHTML = `
        <div class="month-labels" style="display:grid;grid-template-columns:repeat(${daysToShow},1fr);margin-bottom:8px;">
            ${monthLabels.join('')}
        </div>
        <div class="day-numbers" style="display:grid;grid-template-columns:repeat(${daysToShow},1fr);">
            ${days.join('')}
        </div>
    `;
}

// 生成活动行
function generateActivityRows() {
    const ganttBody = document.querySelector('.gantt-body');
    if (!ganttBody) return;

    let rowsHTML = '';
    activities.forEach((activity, index) => {
        // 为每个活动生成唯一ID
        const activityId = activity.id || `activity-${index}`;
        const start = new Date(activity.startDate);
        const end = new Date(activity.endDate);
        const startMonth = start.getMonth() + 1;
        const startDay = start.getDate();
        const endMonth = end.getMonth() + 1;
        const endDay = end.getDate();

        rowsHTML += `
            <div class="activity-row">
                <div class="timeline-track">
                    <div class="activity-bar" 
                         style="background: ${activity.color};" 
                         data-id="${activityId}"
                         data-start="${activity.startDate}" 
                         data-end="${activity.endDate}" 
                         data-name="${activity.name}">
                        <span class="activity-bar-text">${activity.name}</span>
                        <div class="activity-tooltip">
                            <div class="tooltip-header">${activity.name}</div>
                            <div class="tooltip-content">
                                <p>开始时间：${startMonth}月${startDay}日</p>
                                <p>结束时间：${endMonth}月${endDay}日</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    ganttBody.innerHTML = rowsHTML;
}

// 更新活动条位置
function updateActivityBars() {
    const today = new Date();

    // 计算起始日期
    let startDate = new Date(today);
    if (currentView === 'week') {
        // 周视图显示本周的7天，从周一到周日
        const dayOfWeek = today.getDay(); // 0是周日，1是周一
        const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        startDate.setDate(today.getDate() - daysToMonday);
    } else {
        // 月视图显示前后15天
        startDate.setDate(today.getDate() - 15 + currentOffset);
    }

    activities.forEach((activity, index) => {
        const start = new Date(activity.startDate);
        const end = new Date(activity.endDate);

        // 计算活动持续天数（已注释，因为当前未使用）
        // const daysDiff = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1; // +1 包含结束日
        const startDiff = Math.max(0, Math.floor((start - startDate) / (1000 * 60 * 60 * 24)));
        const endDiff = Math.min(daysToShow, Math.ceil((end - startDate) / (1000 * 60 * 60 * 24)));

        // 计算活动条位置和宽度
        let leftPercent = (startDiff / daysToShow) * 100;
        let widthPercent = Math.max(1, ((endDiff - startDiff) / daysToShow) * 100);

        // 确保活动条在可视范围内
        if (startDiff < 0) {
            leftPercent = 0;
            widthPercent = Math.max(1, ((endDiff) / daysToShow) * 100);
        }
        if (endDiff > daysToShow) {
            widthPercent = Math.max(1, ((daysToShow - startDiff) / daysToShow) * 100);
        }

        // 使用唯一ID选择活动条
        const activityId = activity.id || `activity-${index}`;
        const activityBar = document.querySelector(`[data-id="${activityId}"]`);
        if (activityBar) {
            activityBar.style.left = `${leftPercent}%`;
            activityBar.style.width = `${widthPercent}%`;
        }
    });
}

// 生成活动列表
function generateActivityList() {
    const listContainer = document.getElementById('activityListContainer');
    if (!listContainer) return;

    let listHTML = '';
    activities.forEach(activity => {
        listHTML += `
            <div class="activity-list-item" data-id="${activity.id}" title="${activity.name}" style="background-color: ${activity.color};">
                <div class="activity-list-info">
                    <div class="activity-list-details">
                        <h4 class="activity-list-name">${activity.name}</h4>
                    </div>
                    <div class="activity-list-actions">
                        <button class="activity-delete-btn" onclick="deleteActivityFromList('${activity.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });

    listContainer.innerHTML = listHTML;
}

// 删除活动
function deleteActivity(activityId) {
    if (confirm('确定要删除这个活动吗？')) {
        // 从活动数组中删除
        const activityIndex = activities.findIndex(activity => activity.id === activityId);
        if (activityIndex !== -1) {
            activities.splice(activityIndex, 1);

            // 重新生成所有活动行和列表
            generateActivityRows();
            generateActivityList();

            // 更新活动条位置
            updateActivityBars();
        }
    }
}

// 从活动列表中删除活动
function deleteActivityFromList(activityId) {
    deleteActivity(activityId);
}

// 刷新甘特图
function refreshGanttChart() {
    generateTimelineHeader();
    updateActivityBars();
    updateScrollbar();
}

// 更新进度条位置
function updateScrollbar() {
    const scrollbarThumb = document.getElementById('scrollbarThumb');
    if (!scrollbarThumb) return;

    // 计算滑块位置和宽度
    const totalRange = maxOffset * 2 + daysToShow;
    const visibleRatio = daysToShow / totalRange;
    const thumbWidth = Math.max(30, visibleRatio * 100);

    // 计算滑块位置
    const offsetRatio = (currentOffset + maxOffset) / (totalRange - daysToShow);
    const thumbLeft = offsetRatio * (100 - thumbWidth);

    // 设置滑块样式
    scrollbarThumb.style.width = `${thumbWidth}%`;
    scrollbarThumb.style.left = `${thumbLeft}%`;
}

// ------------------------ 事件处理 ------------------------

// 进度条鼠标按下事件
function handleScrollbarMouseDown(e) {
    isDraggingScrollbar = true;
    startX = e.clientX;
    startOffset = currentOffset;

    // 获取滚动条轨道信息
    const track = e.currentTarget;
    const trackRect = track.getBoundingClientRect();
    scrollbarTrackWidth = trackRect.width;
}

// 进度条鼠标移动事件
function handleScrollbarMouseMove(e) {
    if (!isDraggingScrollbar) return;

    const deltaX = e.clientX - startX;
    const totalRange = maxOffset * 2 + daysToShow;
    const deltaDays = Math.round(deltaX / scrollbarTrackWidth * (totalRange - daysToShow));

    // 计算新的偏移量
    let newOffset = startOffset + deltaDays;

    // 边界约束
    if (newOffset < -maxOffset) {
        newOffset = -maxOffset;
    } else if (newOffset > maxOffset) {
        newOffset = maxOffset;
    }

    currentOffset = newOffset;
    refreshGanttChart();
}

// 进度条鼠标释放事件
function handleScrollbarMouseUp() {
    isDraggingScrollbar = false;
}

// 鼠标按下事件
function handleMouseDown(e) {
    isDragging = true;
    startX = e.clientX;
    startOffset = currentOffset;
}

// 鼠标移动事件
function handleMouseMove(e) {
    if (!isDragging) return;

    const deltaX = e.clientX - startX;
    const deltaDays = Math.round(deltaX / 10); // 每10px对应1天

    // 计算新的偏移量，应用回弹效果
    let newOffset = startOffset - deltaDays;

    // 边界回弹效果
    if (newOffset < -maxOffset) {
        const overshoot = -maxOffset - newOffset;
        newOffset = -maxOffset + overshoot * 0.5; // 回弹效果
    } else if (newOffset > maxOffset) {
        const overshoot = newOffset - maxOffset;
        newOffset = maxOffset - overshoot * 0.5; // 回弹效果
    }

    currentOffset = newOffset;
    refreshGanttChart();
}

// 鼠标释放事件
function handleMouseUp() {
    if (!isDragging) return;
    isDragging = false;

    // 边界约束，确保最终偏移量在允许范围内
    if (currentOffset < -maxOffset) {
        currentOffset = -maxOffset;
    } else if (currentOffset > maxOffset) {
        currentOffset = maxOffset;
    }

    refreshGanttChart();
}

// 触摸开始事件
function handleTouchStart(e) {
    isDragging = true;
    startX = e.touches[0].clientX;
    startOffset = currentOffset;
}

// 触摸移动事件
function handleTouchMove(e) {
    if (!isDragging) return;

    const deltaX = e.touches[0].clientX - startX;
    const deltaDays = Math.round(deltaX / 10); // 每10px对应1天

    // 计算新的偏移量，应用回弹效果
    let newOffset = startOffset - deltaDays;

    // 边界回弹效果
    if (newOffset < -maxOffset) {
        const overshoot = -maxOffset - newOffset;
        newOffset = -maxOffset + overshoot * 0.5; // 回弹效果
    } else if (newOffset > maxOffset) {
        const overshoot = newOffset - maxOffset;
        newOffset = maxOffset - overshoot * 0.5; // 回弹效果
    }

    currentOffset = newOffset;
    refreshGanttChart();
}

// 触摸结束事件
function handleTouchEnd() {
    if (!isDragging) return;
    isDragging = false;

    // 边界约束，确保最终偏移量在允许范围内
    if (currentOffset < -maxOffset) {
        currentOffset = -maxOffset;
    } else if (currentOffset > maxOffset) {
        currentOffset = maxOffset;
    }

    refreshGanttChart();
}

// 回到当天
function goToToday() {
    // 平滑过渡到当天
    const animateToToday = () => {
        const targetOffset = 0;
        const delta = targetOffset - currentOffset;

        if (Math.abs(delta) < 1) {
            currentOffset = targetOffset;
            refreshGanttChart();
            return;
        }

        currentOffset += delta * 0.2; // 缓动效果
        refreshGanttChart();
        requestAnimationFrame(animateToToday);
    };

    animateToToday();
}


// 触摸板滑动事件
function handleWheel(e) {
    // 只处理水平滚动，允许垂直滚动正常工作
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();

        // 主要使用水平滚动
        const deltaX = e.deltaX;

        // 计算滑动天数，调整灵敏度
        const deltaDays = Math.round(deltaX / 20);

        // 计算新的偏移量
        let newOffset = currentOffset + deltaDays;

        // 边界约束，无回弹效果，直接限制在范围内
        if (newOffset < -maxOffset) {
            newOffset = -maxOffset;
        } else if (newOffset > maxOffset) {
            newOffset = maxOffset;
        }

        currentOffset = newOffset;
        refreshGanttChart();
    }
    // 垂直滚动不处理，保持默认行为
}

// ------------------------ 倒计时相关 ------------------------

// 初始化倒计时
function initializeCountdowns() {
    // 每日任务倒计时
    const dailyCountdown = document.getElementById('dailyCountdown');
    if (dailyCountdown) {
        setInterval(() => updateCountdown(dailyCountdown, 'daily'), 1000);
    }

    // 每周任务倒计时
    const weeklyCountdown = document.getElementById('weeklyCountdown');
    if (weeklyCountdown) {
        setInterval(() => updateCountdown(weeklyCountdown, 'weekly'), 1000);
    }
}

// 更新倒计时显示
function updateCountdown(element, type) {
    const now = new Date();
    let targetTime;

    if (type === 'daily') {
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

        if (type === 'daily') {
            element.querySelector('span').textContent = `重置：${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        } else {
            const days = Math.floor(hours / 24);
            const remainingHours = hours % 24;
            element.querySelector('span').textContent = `重置：${days}天${remainingHours}小时`;
        }
    }
}

// 更新月份显示
function updateMonthDisplay() {
    const currentMonth = document.getElementById('currentMonth');
    if (currentMonth) {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        currentMonth.textContent = `${year}年${month}月`;
    }
}

// ------------------------ 任务相关 ------------------------

// 初始化任务交互
function initializeTaskInteractions() {
    // 任务点击切换
    document.querySelectorAll('.task-item').forEach(item => {
        const checkbox = item.querySelector('.task-checkbox');
        if (checkbox) {
            checkbox.addEventListener('click', function (e) {
                e.stopPropagation();
                toggleTaskComplete(item);
            });
        }
    });

    // 添加任务按钮
    document.querySelectorAll('.add-task-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const type = this.dataset.type;
            showAddTaskDialog(type);
        });
    });

    // 编辑和删除按钮
    document.querySelectorAll('.task-edit-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            const taskItem = this.closest('.task-item');
            showEditTaskDialog(taskItem);
        });
    });

    document.querySelectorAll('.task-delete-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            const taskItem = this.closest('.task-item');
            deleteTask(taskItem);
        });
    });
}

// 切换任务完成状态
function toggleTaskComplete(taskItem) {
    const checkbox = taskItem.querySelector('.task-checkbox');
    const taskName = taskItem.querySelector('.task-name');

    if (taskItem.classList.contains('completed')) {
        taskItem.classList.remove('completed');
        checkbox.innerHTML = '';
        checkbox.style.background = 'white';
        checkbox.style.borderColor = '#dee2e6';
        taskName.style.textDecoration = 'none';
    } else {
        taskItem.classList.add('completed');
        checkbox.innerHTML = '<i class="fas fa-check"></i>';
        checkbox.style.background = '#28a745';
        checkbox.style.borderColor = '#28a745';
        taskName.style.textDecoration = 'line-through';
    }

    updateTaskProgress(taskItem.closest('.task-card'));
}

// 更新任务进度
function updateTaskProgress(taskCard) {
    const totalTasks = taskCard.querySelectorAll('.task-item').length;
    const completedTasks = taskCard.querySelectorAll('.task-item.completed').length;
    const percentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    const completedCount = taskCard.querySelector('.completed-count');
    const progressBar = taskCard.querySelector('.progress-bar .progress-fill');

    if (completedCount) {
        completedCount.textContent = `${completedTasks}/${totalTasks}`;
    }
    if (progressBar) {
        progressBar.style.width = `${percentage}%`;
    }
}

// 显示添加任务对话框
function showAddTaskDialog(type) {
    const modal = document.getElementById('addTaskModal');
    const title = document.getElementById('taskModalTitle');
    const taskTypeInput = document.getElementById('taskType');
    const form = document.getElementById('addTaskForm');

    // 设置标题和任务类型
    title.textContent = `添加${type === 'daily' ? '每日' : '每周'}任务`;
    taskTypeInput.value = type;

    // 重置表单
    form.reset();

    // 显示弹窗
    modal.classList.add('show');

    // 添加滚动边界修复
    setTimeout(() => {
        addScrollBoundaryFix();
    }, 100);
}

// 添加任务
function addTask(type, name, rewardType, rewardAmount) {
    const taskList = document.querySelector(`.${type}-tasks .task-list`);
    if (!taskList) return;

    const taskId = `${type}-${Date.now()}`;
    const taskItem = document.createElement('div');
    taskItem.className = 'task-item';
    taskItem.dataset.taskId = taskId;

    // 构建奖励显示文本
    const rewardText = `+${rewardAmount}${rewardType}`;

    taskItem.innerHTML = `
        <div class="task-checkbox"></div>
        <div class="task-content">
            <span class="task-name">${name}</span>
            <span class="task-reward">${rewardText}</span>
        </div>
        <div class="task-actions">
            <button class="task-edit-btn">
                <i class="fas fa-edit"></i>
            </button>
            <button class="task-delete-btn">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;

    taskList.appendChild(taskItem);

    // 重新绑定事件
    const checkbox = taskItem.querySelector('.task-checkbox');
    checkbox.addEventListener('click', function (e) {
        e.stopPropagation();
        toggleTaskComplete(taskItem);
    });

    const editBtn = taskItem.querySelector('.task-edit-btn');
    editBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        showEditTaskDialog(taskItem);
    });

    const deleteBtn = taskItem.querySelector('.task-delete-btn');
    deleteBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        deleteTask(taskItem);
    });

    updateTaskProgress(taskList.closest('.task-card'));
}

// 删除任务
function deleteTask(taskItem) {
    if (confirm('确定要删除这个任务吗？')) {
        taskItem.remove();
        updateTaskProgress(taskItem.closest('.task-card'));
    }
}

// 显示编辑任务对话框
function showEditTaskDialog(taskItem) {
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

// ------------------------ 活动交互 ------------------------

// 初始化活动交互
function initializeActivityInteractions() {
    // 视图切换
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            // 视图切换逻辑
            const view = this.dataset.view;
            switchView(view);
        });
    });

    // 添加活动按钮
    const addActivityBtn = document.querySelector('.add-activity-btn');
    if (addActivityBtn) {
        addActivityBtn.addEventListener('click', function () {
            showAddActivityDialog();
        });
    }

    // 回到当天按钮
    const todayBtn = document.querySelector('.today-btn');
    if (todayBtn) {
        todayBtn.addEventListener('click', goToToday);
    }

    // 添加滑动事件监听器
    const ganttContainer = document.querySelector('.gantt-container');
    if (ganttContainer) {
        // 鼠标事件
        ganttContainer.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mousemove', function (e) {
            handleMouseMove(e);
            handleScrollbarMouseMove(e);
        });
        document.addEventListener('mouseup', function () {
            handleMouseUp();
            handleScrollbarMouseUp();
        });
        document.addEventListener('mouseleave', function () {
            handleMouseUp();
            handleScrollbarMouseUp();
        });

        // 触摸事件
        ganttContainer.addEventListener('touchstart', handleTouchStart, {passive: true});
        ganttContainer.addEventListener('touchmove', handleTouchMove, {passive: true});
        ganttContainer.addEventListener('touchend', handleTouchEnd);
        ganttContainer.addEventListener('touchcancel', handleTouchEnd);

        // 触摸板滑动事件
        ganttContainer.addEventListener('wheel', handleWheel, {passive: false});
    }

    // 进度条事件监听器
    const scrollbarTrack = document.querySelector('.scrollbar-track');
    const scrollbarThumb = document.getElementById('scrollbarThumb');
    if (scrollbarTrack && scrollbarThumb) {
        // 进度条轨道点击事件
        scrollbarTrack.addEventListener('mousedown', function (e) {
            if (e.target === scrollbarTrack) {
                // 点击轨道空白处，跳转到对应位置
                const trackRect = scrollbarTrack.getBoundingClientRect();
                const clickX = e.clientX - trackRect.left;
                const clickRatio = clickX / trackRect.width;

                const totalRange = maxOffset * 2 + daysToShow;
                const newOffset = Math.round(clickRatio * (totalRange - daysToShow) - maxOffset);

                currentOffset = Math.max(-maxOffset, Math.min(maxOffset, newOffset));
                refreshGanttChart();
            }
        });

        // 进度条滑块拖动事件
        scrollbarThumb.addEventListener('mousedown', handleScrollbarMouseDown);
    }

    // 初始化进度条
    updateScrollbar();

    // 初始化弹窗
    initializeModal();
}

// 切换视图
function switchView(view) {
    currentView = view;

    // 重置偏移量
    currentOffset = 0;

    // 根据视图类型设置显示天数
    if (view === 'week') {
        daysToShow = 7; // 周视图只显示7天
        // 禁用滑动功能
        disableScrolling();
    } else {
        daysToShow = 30; // 月视图显示30天
        // 启用滑动功能
        enableScrolling();
    }

    // 重新生成甘特图
    initializeGanttChart();

    // 更新进度条
    updateScrollbar();
}

// 启用滑动功能
function enableScrolling() {
    const ganttContainer = document.querySelector('.gantt-container');
    if (ganttContainer) {
        // 启用触摸板滑动
        ganttContainer.style.overflowX = 'auto';
    }

    // 显示进度条
    const scrollbar = document.querySelector('.gantt-scrollbar');
    if (scrollbar) {
        scrollbar.style.display = 'block';
    }
}

// 禁用滑动功能
function disableScrolling() {
    const ganttContainer = document.querySelector('.gantt-container');
    if (ganttContainer) {
        // 禁用触摸板滑动
        ganttContainer.style.overflowX = 'hidden';
    }

    // 隐藏进度条
    const scrollbar = document.querySelector('.gantt-scrollbar');
    if (scrollbar) {
        scrollbar.style.display = 'none';
    }
}


// ------------------------ 资源详情弹窗相关 ------------------------


// API配置 - 增强版
const API_CONFIG = {
    // 动态API基础URL配置
    BASE_URL: (() => {
        const hostname = window.location.hostname;

        if (hostname === 'localhost' || hostname.includes('127.0.0.1')) {
            return 'http://localhost:3000/api'; // 本地开发API
        } else if (hostname.includes('dev') || hostname.includes('staging')) {
            return 'https://dev-api.yourdomain.com/api'; // 测试环境API
        } else if (hostname.includes('test')) {
            return 'https://test-api.yourdomain.com/api'; // 测试环境API
        } else {
            return 'https://api.yourdomain.com/api'; // 生产环境API
        }
    })(),

    // API端点配置
    ENDPOINTS: {
        // 资源相关接口
        RESOURCE_DATA: '/resource/data',
        RESOURCE_RECORDS: '/resource/records',
        RESOURCE_SOURCES: '/resource/sources',
        RESOURCE_TRENDS: '/resource/trends',
        RESOURCE_SUMMARY: '/resource/summary',

        // 导出相关接口
        EXPORT_DATA: '/export/data',
        EXPORT_REPORT: '/export/report',

        // 用户相关接口
        USER_PROFILE: '/user/profile',
        USER_PREFERENCES: '/user/preferences',

        // 统计相关接口
        STATISTICS_DASHBOARD: '/statistics/dashboard',
        STATISTICS_REALTIME: '/statistics/realtime',

        // 系统相关接口
        SYSTEM_HEALTH: '/system/health',
        SYSTEM_CONFIG: '/system/config'
    },

    // API版本配置
    VERSION: 'v1',

    // 超时配置（毫秒）
    TIMEOUT: 10000,

    // 重试配置
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000,

    // 缓存配置
    CACHE_ENABLED: true,
    CACHE_DURATION: 5 * 60 * 1000, // 5分钟

    // 认证配置
    AUTH_REQUIRED: false,
    TOKEN_KEY: 'auth_token'
};

// API环境检测和配置
const API_ENVIRONMENT = {
    isDevelopment: window.location.hostname === 'localhost',
    isStaging: window.location.hostname.includes('dev') || window.location.hostname.includes('staging'),
    isProduction: !window.location.hostname.includes('localhost') &&
        !window.location.hostname.includes('dev') &&
        !window.location.hostname.includes('staging'),

    // 根据环境配置API服务
    configure() {
        if (this.isDevelopment) {
            ResourceApiService.setConfig({
                API_ENABLED: true,
                MOCK_MODE: true, // 开发环境默认使用模拟数据
                TIMEOUT: 5000,
                RETRY_ATTEMPTS: 2
            });
            console.log('🔧 开发环境：启用模拟数据模式');
        } else if (this.isStaging) {
            ResourceApiService.setConfig({
                API_ENABLED: true,
                MOCK_MODE: false,
                TIMEOUT: 8000,
                RETRY_ATTEMPTS: 3
            });
            console.log('🧪 测试环境：启用真实API');
        } else {
            ResourceApiService.setConfig({
                API_ENABLED: true,
                MOCK_MODE: false,
                TIMEOUT: 10000,
                RETRY_ATTEMPTS: 3
            });
            console.log('🚀 生产环境：启用真实API');
        }
    }
};

// API状态监控
const API_MONITOR = {
    // 请求统计
    stats: {
        total: 0,
        success: 0,
        failed: 0,
        fallback: 0
    },

    // 记录请求
    record(success, usedFallback = false) {
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
    },

    // 获取成功率
    getSuccessRate() {
        if (this.stats.total === 0) return 0;
        return ((this.stats.success + this.stats.fallback) / this.stats.total * 100).toFixed(1);
    },

    // 获取降级率
    getFallbackRate() {
        if (this.stats.total === 0) return 0;
        return (this.stats.fallback / this.stats.total * 100).toFixed(1);
    },

    // 输出统计信息
    logStats() {
        console.log('📊 API统计:', {
            TOTAL_REQUEST: this.stats.total,
            SUCCESS: this.stats.success,
            失败: this.stats.failed,
            降级: this.stats.fallback,
            成功率: `${this.getSuccessRate()}%`,
            降级率: `${this.getFallbackRate()}%`
        });
    }
};

// API接口调用示例和工具函数
const API_UTILS = {
    /**
     * 批量获取多个资源数据
     */
    async batchGetResources(resourceNames) {
        const promises = resourceNames.map(name =>
            ResourceApiService.getResourceData(name)
                .catch(error => {
                    console.error(`获取${name}数据失败:`, error);
                    return null;
                })
        );

        const results = await Promise.allSettled(promises);
        return results.map((result, index) => ({
            resource: resourceNames[index],
            success: result.status === 'fulfilled',
            data: result.status === 'fulfilled' ? result.value : null,
            error: result.status === 'rejected' ? result.reason : null
        }));
    },

    /**
     * 带加载状态的API调用
     */
    async withLoading(apiCall, loadingElement) {
        if (loadingElement) {
            loadingElement.style.display = 'block';
        }

        try {
            const result = await apiCall();
            return result;
        } finally {
            if (loadingElement) {
                loadingElement.style.display = 'none';
            }
        }
    },

    /**
     * 检查API健康状态
     */
    async checkApiHealth() {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SYSTEM_HEALTH}`, {
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
    },

    /**
     * 获取系统配置
     */
    async getSystemConfig() {
        try {
            const config = await ResourceApiService.makeRequest(
                API_CONFIG.ENDPOINTS.SYSTEM_CONFIG,
                {},
                false // 不使用缓存
            );
            return config;
        } catch (error) {
            console.error('获取系统配置失败:', error);
            return null;
        }
    }
};

// 初始化API配置
API_ENVIRONMENT.configure();

// 系统初始化时的健康检查
async function performSystemHealthCheck() {
    console.log('🔍 执行系统健康检查...');

    // 检查API连接
    const apiHealthy = await API_UTILS.checkApiHealth();

    if (apiHealthy) {
        console.log('✅ 系统健康检查通过');
    } else {
        console.warn('⚠️ API连接异常，将使用模拟数据模式');
        ResourceApiService.setConfig({MOCK_MODE: true});
    }

    return apiHealthy;
}

// 调试工具 - 开发环境使用
if (API_ENVIRONMENT.isDevelopment) {
    // 将调试函数暴露到全局作用域
    window.API_DEBUG = {
        // 强制启用/禁用API
        toggleAPI: (enabled) => {
            ResourceApiService.setConfig({API_ENABLED: enabled});
            console.log(`API已${enabled ? '启用' : '禁用'}`);
        },

        // 强制使用模拟模式
        toggleMock: (enabled) => {
            ResourceApiService.setConfig({MOCK_MODE: enabled});
            console.log(`模拟模式已${enabled ? '启用' : '禁用'}`);
        },

        // 清除缓存
        clearCache: () => {
            ResourceApiService.clearCache();
        },

        // 查看API统计
        getStats: () => {
            API_MONITOR.logStats();
            return API_MONITOR.stats;
        },

        // 手动健康检查
        healthCheck: performSystemHealthCheck,

        // 批量获取资源数据
        batchTest: async (resources = ['勾玉', '金币', '神秘符咒', '御魂']) => {
            console.log('🧪 开始批量API测试...');
            const results = await API_UTILS.batchGetResources(resources);
            console.table(results);
            return results;
        },

        // 测试特定资源API
        testResource: async (resourceName) => {
            console.log(`🧪 测试${resourceName}API...`);
            try {
                const data = await ResourceApiService.getResourceData(resourceName);
                console.log('✅ API调用成功:', data);
                return data;
            } catch (error) {
                console.error('❌ API调用失败:', error);
                return null;
            }
        },

        // 获取当前配置
        getConfig: () => ({
            API_CONFIG,
            ResourceApiService: {
                API_ENABLED: ResourceApiService.API_ENABLED,
                MOCK_MODE: ResourceApiService.MOCK_MODE,
                TIMEOUT: ResourceApiService.TIMEOUT,
                RETRY_ATTEMPTS: ResourceApiService.RETRY_ATTEMPTS
            },
            API_ENVIRONMENT
        })
    };

    console.log('🛠️ API调试工具已加载，使用 API_DEBUG 对象进行调试');
}

// 模拟数据生成器
class MockDataGenerator {
    static generateResourceData(resourceName, days = 30) {
        const sources = this.generateSources(resourceName);
        const records = this.generateRecords(resourceName, days);
        const trends = this.generateTrends(days);

        return {
            icon: this.getResourceIcon(resourceName),
            amount: this.calculateTotal(records),
            color: this.getResourceColor(resourceName),
            sources,
            records,
            trends
        };
    }

    static generateSources(resourceName) {
        const sourceTemplates = {
            '勾玉': [
                {name: '周任务', basePercentage: 40, color: '#28a745'},
                {name: '每日任务', basePercentage: 25, color: '#17a2b8'},
                {name: '活动奖励', basePercentage: 20, color: '#FFB6C1'},
                {name: '斗技场', basePercentage: 10, color: '#ffc107'},
                {name: '其他', basePercentage: 5, color: '#6c757d'}
            ],
            '金币': [
                {name: '周任务', basePercentage: 60, color: '#28a745'},
                {name: '日常', basePercentage: 40, color: '#87CEEB'}
            ],
            '神秘符咒': [
                {name: '周任务', basePercentage: 80, color: '#28a745'},
                {name: '活动', basePercentage: 20, color: '#FFB6C1'}
            ],
            '御魂': [
                {name: '周任务', basePercentage: 50, color: '#28a745'},
                {name: '探索', basePercentage: 50, color: '#87CEEB'}
            ]
        };

        const templates = sourceTemplates[resourceName] || sourceTemplates['勾玉'];
        const totalAmount = Math.floor(Math.random() * 5000) + 2000;

        return templates.map((template) => {
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

    static generateRecords(resourceName, days) {
        const recordSources = this.getRecordSources(resourceName);
        const records = [];
        const today = new Date();

        for (let i = 0; i < days * 3; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() - Math.floor(Math.random() * days));
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

    static generateTrends(days) {
        const daily = [];
        const weekly = [];
        const monthly = [];

        // 生成日趋势
        for (let i = 0; i < Math.min(7, days); i++) {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            daily.push({
                date: `${date.getMonth() + 1}-${String(date.getDate()).padStart(2, '0')}`,
                amount: Math.floor(Math.random() * 1000) + 100
            });
        }

        // 生成周趋势
        for (let i = 0; i < 4; i++) {
            weekly.push({
                week: `第${48 + i}周`,
                amount: Math.floor(Math.random() * 5000) + 1000
            });
        }

        // 生成月趋势
        const months = ['10月', '11月', '12月'];
        months.forEach(month => {
            monthly.push({
                month,
                amount: Math.floor(Math.random() * 10000) + 2000
            });
        });

        return {daily, weekly, monthly};
    }

    static getRecordSources(resourceName) {
        const sources = {
            '勾玉': [
                {name: '每日任务', type: '日常'},
                {name: '周任务', type: '周常'},
                {name: '活动奖励', type: '活动'},
                {name: '斗技场', type: 'PVP'},
                {name: '寮务', type: '社交'},
                {name: '探索副本', type: 'PVE'}
            ],
            '金币': [
                {name: '每日任务', type: '日常'},
                {name: '探索副本', type: 'PVE'},
                {name: '御魂挑战', type: 'PVE'},
                {name: '寮道馆', type: '社交'},
                {name: '结界突破', type: 'PVP'},
                {name: '周任务', type: '周常'}
            ]
        };
        return sources[resourceName] || sources['勾玉'];
    }

    static getRandomAmount(resourceName) {
        const ranges = {
            '勾玉': [50, 500],
            '金币': [1000, 20000],
            '神秘符咒': [1, 10],
            '御魂': [20, 200]
        };
        const [min, max] = ranges[resourceName] || [50, 500];
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static getResourceIcon(resourceName) {
        const icons = {
            '勾玉': 'fa-gem',
            '金币': 'fa-coins',
            '神秘符咒': 'fa-scroll',
            '御魂': 'fa-dice'
        };
        return icons[resourceName] || 'fa-gem';
    }

    static getResourceColor(resourceName) {
        const colors = {
            '勾玉': '#4169E1',
            '金币': '#FFD700',
            '神秘符咒': '#FF6347',
            '御魂': '#9370DB'
        };
        return colors[resourceName] || '#4169E1';
    }

    static calculateTotal(records) {
        return records.reduce((sum, record) => sum + record.amount, 0);
    }

    static formatDateTime(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    }
}

// API服务类 - 增强版
class ResourceApiService {
    // API配置开关 - 可通过此开关控制API行为
    static API_ENABLED = true;
    static MOCK_MODE = false;
    static RETRY_ATTEMPTS = 3;
    static TIMEOUT = 5000;

    // 缓存管理
    static cache = new Map();
    static CACHE_EXPIRY = 5 * 60 * 1000; // 5分钟缓存

    /**
     * 通用API请求方法 - 包含重试、超时、缓存等机制
     */
    static async makeRequest(endpoint, options = {}, useCache = true) {
        const cacheKey = `${endpoint}_${JSON.stringify(options)}`;

        // 检查缓存
        if (useCache && this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.CACHE_EXPIRY) {
                console.log('📦 使用缓存数据');
                return cached.data;
            }
        }

        // 检查是否禁用API或启用模拟模式
        if (!this.API_ENABLED || this.MOCK_MODE) {
            console.log('🔧 API已禁用或模拟模式已启用，使用模拟数据');
            throw new Error('API_MOCK_MODE');
        }

        let lastError;

        // 重试机制
        for (let attempt = 1; attempt <= this.RETRY_ATTEMPTS; attempt++) {
            try {
                console.log(`🌐 API请求 (尝试 ${attempt}/${this.RETRY_ATTEMPTS}): ${endpoint}`);

                // 创建AbortController用于超时控制
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT);

                const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
                    ...options,
                    signal: controller.signal,
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                        ...options.headers
                    }
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();

                // 缓存成功响应
                if (useCache) {
                    this.cache.set(cacheKey, {
                        data,
                        timestamp: Date.now()
                    });
                }

                console.log('✅ API请求成功');
                return data;

            } catch (error) {
                lastError = error;
                console.error(`❌ API请求失败 (尝试 ${attempt}/${this.RETRY_ATTEMPTS}):`, error.message);

                // 如果是网络错误或超时，继续重试
                if (attempt < this.RETRY_ATTEMPTS && (
                    error.name === 'AbortError' ||
                    error.name === 'TypeError' ||
                    error.message.includes('network')
                )) {
                    // 指数退避延迟
                    await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
                    continue;
                }

                break;
            }
        }

        // 所有尝试都失败，抛出最后一个错误
        throw lastError;
    }

    /**
     * 获取资源详情数据
     */
    static async getResourceData(resourceName, days = 30) {
        try {
            const endpoint = `${API_CONFIG.ENDPOINTS.RESOURCE_DATA}?resource=${encodeURIComponent(resourceName)}&days=${days}`;
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
                return MockDataGenerator.generateResourceData(resourceName, days);
            }

            // API失败时的降级处理
            console.log('🔄 API失败，降级到模拟数据');
            return MockDataGenerator.generateResourceData(resourceName, days);
        }
    }

    /**
     * 获取资源记录
     */
    static async getResourceRecords(resourceName, startDate, endDate, limit = 100) {
        try {
            const params = new URLSearchParams({
                resource: encodeURIComponent(resourceName),
                limit: limit.toString()
            });

            if (startDate) params.append('startDate', startDate);
            if (endDate) params.append('endDate', endDate);

            const endpoint = `${API_CONFIG.ENDPOINTS.RESOURCE_RECORDS}?${params}`;
            const data = await this.makeRequest(endpoint);

            return data.records || [];

        } catch (error) {
            console.error('获取资源记录失败:', error);
            // 降级到模拟数据
            const mockData = MockDataGenerator.generateResourceData(resourceName);
            return mockData.records;
        }
    }

    /**
     * 获取资源来源分析
     */
    static async getResourceSources(resourceName, timeRange = 'month') {
        try {
            const endpoint = `${API_CONFIG.ENDPOINTS.RESOURCE_SOURCES}?resource=${encodeURIComponent(resourceName)}&range=${timeRange}`;
            const data = await this.makeRequest(endpoint);

            return data.sources || [];

        } catch (error) {
            console.error('获取资源来源失败:', error);
            // 降级到模拟数据
            const mockData = MockDataGenerator.generateResourceData(resourceName);
            return mockData.sources;
        }
    }

    /**
     * 获取资源趋势数据
     */
    static async getResourceTrends(resourceName, timeRange = 'month') {
        try {
            const endpoint = `${API_CONFIG.ENDPOINTS.RESOURCE_TRENDS}?resource=${encodeURIComponent(resourceName)}&range=${timeRange}`;
            const data = await this.makeRequest(endpoint);

            return data.trends || {daily: [], weekly: [], monthly: []};

        } catch (error) {
            console.error('获取资源趋势失败:', error);
            // 降级到模拟数据
            const mockData = MockDataGenerator.generateResourceData(resourceName);
            return mockData.trends;
        }
    }

    /**
     * 导出资源数据
     */
    static async exportResourceData(resourceName, format = 'csv', startDate, endDate) {
        try {
            const params = new URLSearchParams({
                resource: encodeURIComponent(resourceName),
                format: format
            });

            if (startDate) params.append('startDate', startDate);
            if (endDate) params.append('endDate', endDate);

            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.EXPORT_DATA}?${params}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`导出失败: ${response.status}`);
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${resourceName}_${new Date().toISOString().split('T')[0]}.${format}`;
            link.click();
            URL.revokeObjectURL(url);

            console.log('✅ 导出成功');

        } catch (error) {
            console.error('导出失败:', error);
            // 降级到客户端导出
            this.exportToClientSide(resourceName);
        }
    }

    /**
     * 客户端导出降级方案
     */
    static exportToClientSide(resourceName, format = 'csv') {
        try {
            const data = resourceData[resourceName];
            if (!data) {
                console.error('没有可导出的数据');
                return;
            }

            if (format === 'csv') {
                let csvContent = '时间,来源,数量,类型\n';
                data.records.forEach(record => {
                    csvContent += `${record.time},${record.source},${record.amount},${record.type}\n`;
                });

                const blob = new Blob(['\ufeff' + csvContent], {type: 'text/csv;charset=utf-8;'});
                this.downloadBlob(blob, `${resourceName}_${new Date().toISOString().split('T')[0]}.csv`);
            } else if (format === 'json') {
                const jsonContent = JSON.stringify(data, null, 2);
                const blob = new Blob([jsonContent], {type: 'application/json'});
                this.downloadBlob(blob, `${resourceName}_${new Date().toISOString().split('T')[0]}.json`);
            }

            console.log('✅ 客户端导出成功');

        } catch (error) {
            console.error('客户端导出失败:', error);
        }
    }

    /**
     * 下载Blob文件
     */
    static downloadBlob(blob, filename) {
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

    /**
     * 验证API返回数据结构
     */
    static validateResourceData(data) {
        return data &&
            typeof data === 'object' &&
            data.icon &&
            data.amount !== undefined &&
            data.color &&
            Array.isArray(data.records) &&
            Array.isArray(data.sources);
    }

    /**
     * 清除缓存
     */
    static clearCache() {
        this.cache.clear();
        console.log('🗑️ 缓存已清除');
    }

    /**
     * 设置API配置
     */
    static setConfig(config) {
        Object.assign(this, config);
        console.log('⚙️ API配置已更新:', config);
    }
}

// 资源数据 - 扩展版（保持向后兼容）
const resourceData = {
    '勾玉': {
        icon: 'fa-gem',
        amount: '+2,456',
        color: '#4169E1',
        records: [
            {time: '2023-11-01 10:30', source: '每日任务', amount: 100, type: '日常'},
            {time: '2023-11-02 15:45', source: '周任务', amount: 500, type: '周常'},
            {time: '2023-11-05 09:15', source: '活动奖励', amount: 200, type: '活动'},
            {time: '2023-11-08 20:30', source: '斗技场', amount: 150, type: 'PVP'},
            {time: '2023-11-12 12:00', source: '每日任务', amount: 100, type: '日常'},
            {time: '2023-11-15 18:20', source: '寮务', amount: 300, type: '社交'},
            {time: '2023-11-18 14:30', source: '探索副本', amount: 50, type: 'PVE'},
            {time: '2023-11-22 11:45', source: '周任务', amount: 500, type: '周常'},
            {time: '2023-11-25 21:10', source: '活动奖励', amount: 156, type: '活动'},
            {time: '2023-12-01 10:30', source: '每日任务', amount: 100, type: '日常'},
            {time: '2023-12-01 15:45', source: '周任务', amount: 500, type: '周常'},
            {time: '2023-12-02 09:15', source: '活动奖励', amount: 200, type: '活动'},
            {time: '2023-12-02 20:30', source: '斗技场', amount: 150, type: 'PVP'},
            {time: '2023-12-03 12:00', source: '每日任务', amount: 100, type: '日常'},
            {time: '2023-12-03 18:20', source: '寮务', amount: 300, type: '社交'},
            {time: '2023-12-04 14:30', source: '探索副本', amount: 50, type: 'PVE'},
            {time: '2023-12-05 11:45', source: '周任务', amount: 500, type: '周常'},
            {time: '2023-12-05 21:10', source: '活动奖励', amount: 156, type: '活动'},
            {time: '2023-12-06 09:00', source: '每日任务', amount: 100, type: '日常'},
            {time: '2023-12-07 16:30', source: '斗技场', amount: 120, type: 'PVP'}
        ],
        sources: [
            {name: '周任务', percentage: 40, amount: 2000, color: '#28a745', trend: '+5%'},
            {name: '每日任务', percentage: 25, amount: 500, color: '#17a2b8', trend: '+2%'},
            {name: '活动奖励', percentage: 20, amount: 712, color: '#FFB6C1', trend: '+12%'},
            {name: '斗技场', percentage: 10, amount: 270, color: '#ffc107', trend: '-3%'},
            {name: '其他', percentage: 5, amount: 150, color: '#6c757d', trend: '0%'}
        ],
        trends: {
            daily: [
                {date: '12-01', amount: 850},
                {date: '12-02', amount: 450},
                {date: '12-03', amount: 400},
                {date: '12-04', amount: 550},
                {date: '12-05', amount: 756},
                {date: '12-06', amount: 100},
                {date: '12-07', amount: 220}
            ],
            weekly: [
                {week: '第48周', amount: 1456},
                {week: '第49周', amount: 2832},
                {week: '第50周', amount: 0}
            ],
            monthly: [
                {month: '10月', amount: 2100},
                {month: '11月', amount: 1956},
                {month: '12月', amount: 2832}
            ]
        }
    },
    '金币': {
        icon: 'fa-coins',
        amount: '+156.8K',
        color: '#FFD700',
        records: [
            {time: '2023-12-01 10:30', source: '每日任务', amount: 5000, type: '日常'},
            {time: '2023-12-01 15:45', source: '探索副本', amount: 8000, type: 'PVE'},
            {time: '2023-12-02 09:15', source: '御魂挑战', amount: 12000, type: 'PVE'},
            {time: '2023-12-02 20:30', source: '寮道馆', amount: 3000, type: '社交'},
            {time: '2023-12-03 12:00', source: '每日任务', amount: 5000, type: '日常'},
            {time: '2023-12-03 18:20', source: '结界突破', amount: 4500, type: 'PVP'},
            {time: '2023-12-04 14:30', source: '探索副本', amount: 8500, type: 'PVE'},
            {time: '2023-12-05 11:45', source: '每日任务', amount: 5000, type: '日常'},
            {time: '2023-12-05 21:10', source: '周任务', amount: 20000, type: '周常'}
        ],
        sources: [
            {name: '周任务', percentage: 60, amount: 94100, color: '#28a745'},
            {name: '日常', percentage: 40, amount: 62700, color: '#87CEEB'}
        ]
    },
    '神秘符咒': {
        icon: 'fa-scroll',
        amount: '+45',
        color: '#FF6347',
        records: [
            {time: '2023-12-01 10:30', source: '每周任务', amount: 2, type: '周常'},
            {time: '2023-12-02 15:45', source: '成就奖励', amount: 1, type: '成就'},
            {time: '2023-12-03 09:15', source: '活动奖励', amount: 3, type: '活动'},
            {time: '2023-12-04 12:30', source: '每周任务', amount: 2, type: '周常'},
            {time: '2023-12-05 18:20', source: '神秘商店', amount: 1, type: '商店'},
            {time: '2023-12-06 11:45', source: '活动奖励', amount: 5, type: '活动'},
            {time: '2023-12-07 20:10', source: '每周任务', amount: 2, type: '周常'}
        ],
        sources: [
            {name: '周任务', percentage: 80, amount: 36, color: '#28a745'},
            {name: '活动', percentage: 20, amount: 9, color: '#FFB6C1'}
        ]
    },
    '御魂': {
        icon: 'fa-dice',
        amount: '+1,234',
        color: '#9370DB',
        records: [
            {time: '2023-12-01 10:30', source: '御魂挑战', amount: 120, type: 'PVE'},
            {time: '2023-12-01 15:45', source: '每日任务', amount: 50, type: '日常'},
            {time: '2023-12-02 09:15', source: '每周任务', amount: 200, type: '周常'},
            {time: '2023-12-02 20:30', source: '探索副本', amount: 80, type: 'PVE'},
            {time: '2023-12-03 12:00', source: '御魂挑战', amount: 150, type: 'PVE'},
            {time: '2023-12-03 18:20', source: '每日任务', amount: 50, type: '日常'},
            {time: '2023-12-04 14:30', source: '每周任务', amount: 200, type: '周常'},
            {time: '2023-12-05 11:45', source: '探索副本', amount: 90, type: 'PVE'},
            {time: '2023-12-05 21:10', source: '御魂挑战', amount: 144, type: 'PVE'}
        ],
        sources: [
            {name: '周任务', percentage: 50, amount: 617, color: '#28a745'},
            {name: '探索', percentage: 50, amount: 617, color: '#87CEEB'}
        ]
    }
};

// 初始化资源详情弹窗
function initializeResourceModal() {
    const modal = document.getElementById('resourceDetailModal');
    if (!modal) return;

    const closeBtn = modal.querySelector('.close-btn');
    const cancelBtn = modal.querySelector('.cancel-btn');
    const exportBtn = modal.querySelector('.export-btn');

    // 关闭弹窗事件
    closeBtn.addEventListener('click', closeResourceModal);
    cancelBtn.addEventListener('click', closeResourceModal);

    // 点击弹窗外部关闭
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeResourceModal();
        }
    });

    // 导出按钮事件
    if (exportBtn) {
        exportBtn.addEventListener('click', exportResourceData);
    }

    // 初始化时间筛选功能
    initializeTimeFilter();
}

// 时间筛选功能
function initializeTimeFilter() {
    const timeFilterBtns = document.querySelectorAll('.time-filter-btn');
    const applyDateBtn = document.getElementById('applyDateFilter');
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');

    // 设置默认日期范围（当前月份）
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    startDateInput.value = firstDay.toISOString().split('T')[0];
    endDateInput.value = lastDay.toISOString().split('T')[0];

    // 时间筛选按钮点击事件
    timeFilterBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            timeFilterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const period = this.dataset.period;
            setDateRangeByPeriod(period);
            updateResourceData();
        });
    });

    // 自定义日期范围应用
    if (applyDateBtn) {
        applyDateBtn.addEventListener('click', () => {
            updateResourceData();
        });
    }
}

// 根据时间周期设置日期范围
function setDateRangeByPeriod(period) {
    const today = new Date();
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');

    let startDate, endDate;

    switch (period) {
        case 'week':
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - today.getDay());
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
            // 显示所有数据，设置一个很早的开始日期
            startDate = new Date(2020, 0, 1);
            endDate = today;
            break;

        default:
            return;
    }

    startDateInput.value = startDate.toISOString().split('T')[0];
    endDateInput.value = endDate.toISOString().split('T')[0];
}

// 更新资源数据
function updateResourceData() {
    const activeTab = document.querySelector('.tab-btn.active').dataset.tab;
    const resourceName = document.getElementById('resourceDetailName').textContent;

    if (activeTab === 'records') {
        showResourceRecords(resourceName);
    } else if (activeTab === 'sources') {
        displayResourceSources(resourceName);
    } else if (activeTab === 'trends') {
        displayResourceTrends(resourceName);
    }
}


// 在页面初始化中绑定资源卡片点击事件
function initializeResourceCardEvents() {
    const resourceCards = document.querySelectorAll('.resource-stat-card');
    resourceCards.forEach(card => {
        card.addEventListener('click', function () {
            const resourceName = this.querySelector('.resource-name').textContent;
            showResourceDetail(resourceName);
        });
    });
}

// 在页面初始化中绑定标签页切换事件
function initializeResourceTabEvents() {
    const modal = document.getElementById('resourceDetailModal');
    if (!modal) return;

    const tabBtns = modal.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            switchResourceTab(this.dataset.tab);
        });
    });
}

// 显示资源详情
async function showResourceDetail(resourceName) {
    const modal = document.getElementById('resourceDetailModal');
    const title = document.getElementById('resourceModalTitle');
    const icon = document.getElementById('resourceDetailIcon');
    const name = document.getElementById('resourceDetailName');
    const amount = document.getElementById('resourceDetailAmount');

    // 显示加载状态
    title.textContent = `${resourceName}详情 - 加载中...`;
    icon.className = 'fas fa-spinner fa-spin';
    icon.style.color = '#6c757d';
    name.textContent = resourceName;
    amount.textContent = '...';

    // 显示弹窗
    modal.classList.add('show');

    // 添加滚动边界修复
    setTimeout(() => {
        addScrollBoundaryFix();
    }, 100);

    try {
        // 获取资源数据
        const data = await ResourceApiService.getResourceData(resourceName);

        // 更新资源数据缓存
        resourceData[resourceName] = data;

        // 设置基本信息
        title.textContent = `${resourceName}详情`;
        icon.className = `fas ${data.icon}`;
        icon.style.color = data.color;
        amount.textContent = `+${data.amount.toLocaleString()}`;

        // 重置到记录标签页
        switchResourceTab('records');

    } catch (error) {
        console.error('加载资源详情失败:', error);
        title.textContent = `${resourceName}详情 - 加载失败`;
        icon.className = 'fas fa-exclamation-triangle';
        icon.style.color = '#dc3545';
        amount.textContent = '错误';
    }
}

// 切换资源标签页
function switchResourceTab(tabName) {
    const modal = document.getElementById('resourceDetailModal');
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
            showResourceRecords(resourceName);
            break;
        case 'sources':
            displayResourceSources(resourceName);
            break;
        case 'trends':
            displayResourceTrends(resourceName);
            break;
    }
}

// 显示资源记录（增强版 - 支持API调用和降级处理）
async function showResourceRecords(resourceName) {
    const tbody = document.getElementById('resourceRecordsBody');
    const loadingIndicator = document.getElementById('recordsLoading');

    // 显示加载状态
    if (loadingIndicator) {
        loadingIndicator.style.display = 'block';
    }
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;padding:20px;">加载中...</td></tr>';

    try {
        // 获取时间筛选范围
        const startDateInput = document.getElementById('startDate');
        const endDateInput = document.getElementById('endDate');
        const startDate = startDateInput ? startDateInput.value : null;
        const endDate = endDateInput ? endDateInput.value : null;

        // 调用API获取数据，自动降级到模拟数据
        const records = await ResourceApiService.getResourceRecords(resourceName, startDate, endDate);

        // 记录API调用结果
        API_MONITOR.record(true, !ResourceApiService.API_ENABLED || ResourceApiService.MOCK_MODE);

        // 隐藏加载状态
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }

        if (!records || records.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;padding:20px;">暂无记录数据</td></tr>';
            return;
        }

        // 清空表格
        tbody.innerHTML = '';

        // 按时间倒序排列（最新的在前面）
        const sortedRecords = records.sort((a, b) => new Date(b.time) - new Date(a.time));

        sortedRecords.forEach(record => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${record.time}</td>
                <td>${record.source}</td>
                <td>+${record.amount.toLocaleString()}</td>
                <td><span class="type-badge" data-type="${record.type}">${record.type}</span></td>
            `;
            tbody.appendChild(row);
        });

    } catch (error) {
        console.error('显示资源记录失败:', error);
        API_MONITOR.record(false);

        // 降级到静态数据显示
        const data = resourceData[resourceName];
        if (data && data.records) {
            tbody.innerHTML = '';
            data.records.forEach(record => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${record.time}</td>
                    <td>${record.source}</td>
                    <td>+${record.amount.toLocaleString()}</td>
                    <td><span class="type-badge" data-type="${record.type}">${record.type}</span></td>
                `;
                tbody.appendChild(row);
            });
        } else {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;padding:20px;color:red;">加载失败</td></tr>';
        }
    } finally {
        // 确保隐藏加载状态
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }
    }
}


// 显示资源来源（增强版 - 支持API调用）
async function displayResourceSources(resourceName) {
    const container = document.getElementById('sourcesContainer');
    const loadingIndicator = document.getElementById('sourcesLoading');

    if (!container) return;

    // 显示加载状态
    if (loadingIndicator) {
        loadingIndicator.style.display = 'block';
    }
    container.innerHTML = '<div style="text-align:center;padding:20px;">加载中...</div>';

    try {
        // 调用API获取数据
        const sources = await ResourceApiService.getResourceSources(resourceName);

        // 记录API调用结果
        API_MONITOR.record(true, !ResourceApiService.API_ENABLED || ResourceApiService.MOCK_MODE);

        // 隐藏加载状态
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }

        if (!sources || sources.length === 0) {
            container.innerHTML = '<div style="text-align:center;padding:20px;">暂无来源数据</div>';
            return;
        }

        // 渲染来源数据
        container.innerHTML = sources.map(source => `
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

    } catch (error) {
        console.error('显示资源来源失败:', error);
        API_MONITOR.record(false);

        // 降级到静态数据显示
        const data = resourceData[resourceName];
        if (data && data.sources) {
            container.innerHTML = data.sources.map(source => `
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
        } else {
            container.innerHTML = '<div style="text-align:center;padding:20px;color:red;">加载失败</div>';
        }
    }
}

// 显示资源趋势（增强版 - 支持API调用）
async function displayResourceTrends(resourceName) {
    const container = document.getElementById('trendsContainer');
    const loadingIndicator = document.getElementById('trendsLoading');

    if (!container) return;

    // 显示加载状态
    if (loadingIndicator) {
        loadingIndicator.style.display = 'block';
    }
    container.innerHTML = '<div style="text-align:center;padding:20px;">加载中...</div>';

    try {
        // 调用API获取数据
        const trends = await ResourceApiService.getResourceTrends(resourceName);

        // 记录API调用结果
        API_MONITOR.record(true, !ResourceApiService.API_ENABLED || ResourceApiService.MOCK_MODE);

        // 隐藏加载状态
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }

        if (!trends) {
            container.innerHTML = '<div style="text-align:center;padding:20px;">暂无趋势数据</div>';
            return;
        }

        // 渲染趋势图表（这里简化处理，实际可以调用图表库）
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

        // 绘制图表（简化版本）
        setTimeout(() => {
            if (trends.daily && trends.daily.length > 0) {
                drawSimpleChart('dailyTrendChart', trends.daily);
            }
            if (trends.weekly && trends.weekly.length > 0) {
                drawSimpleChart('weeklyTrendChart', trends.weekly);
            }
            if (trends.monthly && trends.monthly.length > 0) {
                drawSimpleChart('monthlyTrendChart', trends.monthly);
            }
        }, 100);

    } catch (error) {
        console.error('显示资源趋势失败:', error);
        API_MONITOR.record(false);
        container.innerHTML = '<div style="text-align:center;padding:20px;color:red;">加载失败</div>';
    }
}

// 简单图表绘制函数
function drawSimpleChart(containerId, data) {
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

// 导出资源数据（增强版）
async function exportResourceData() {
    const resourceName = document.getElementById('resourceDetailName').textContent;
    const format = 'csv';

    // 获取时间筛选范围
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const startDate = startDateInput ? startDateInput.value : null;
    const endDate = endDateInput ? endDateInput.value : null;

    try {
        // 显示导出中状态
        console.log(`📤 开始导出${resourceName}数据...`);

        // 调用API导出
        await ResourceApiService.exportResourceData(resourceName, format, startDate, endDate);

        // 记录API调用结果
        API_MONITOR.record(true, !ResourceApiService.API_ENABLED || ResourceApiService.MOCK_MODE);

        console.log('✅ 导出完成');

    } catch (error) {
        console.error('导出资源数据失败:', error);
        API_MONITOR.record(false);

        // 显示错误提示
        alert('导出失败，请稍后重试');
    }
}

// 更新洞察卡片
function closeResourceModal() {
    console.info('关闭资源详情弹窗');
    const modal = document.getElementById('resourceDetailModal');
    modal.classList.remove('show');

    // 移除滚动事件监听器
    document.removeEventListener('touchmove', preventScrollBounce, {passive: false});

    // 恢复背景页面滚动
    document.body.style.overflow = '';

    // 移除可能存在的背景触摸事件监听器
    const backgroundTouchHandler = document.querySelector('.background-touch-handler');
    if (backgroundTouchHandler) {
        backgroundTouchHandler.remove();
    }
}

// 防止滚动边界穿透
function preventScrollBounce(e) {
    const modalBody = document.querySelector('.modal-body');
    if (!modalBody) return;

    const {scrollTop, scrollHeight, clientHeight} = modalBody;
    const isAtTop = scrollTop === 0;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight;

    // 如果在顶部且向上滚动，或在底部且向下滚动，阻止默认行为
    const touch = e.touches[0];
    const deltaY = touch.clientY - touch.startY;

    if ((isAtTop && deltaY > 0) || (isAtBottom && deltaY < 0)) {
        e.preventDefault();
    }
}

// 添加滚动边界修复
function addScrollBoundaryFix() {
    const modalBody = document.querySelector('.modal-body');
    if (!modalBody) return;

    // 保存触摸起始位置
    let touchStartY = 0;

    // 阻止背景页面滚动
    document.body.style.overflow = 'hidden';

    modalBody.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
        // 保存起始位置到触摸对象
        e.touches[0].startY = touchStartY;
    }, {passive: true});

    modalBody.addEventListener('touchmove', (e) => {
        // 确保startY始终存在
        if (!e.touches[0].startY) {
            e.touches[0].startY = touchStartY;
        }
        preventScrollBounce(e);
    }, {passive: false});

    // 阻止背景页面的触摸滚动
    document.addEventListener('touchmove', (e) => {
        // 只在模态框显示时阻止背景滚动
        const modal = document.getElementById('resourceDetailModal');
        if (modal && modal.classList.contains('show')) {
            e.preventDefault();
        }
    }, {passive: false});
}

// 导出资源数据
async function exportResourceData() {
    const resourceName = document.getElementById('resourceDetailName').textContent;

    if (!resourceName) return;

    // 显示导出中状态
    const exportBtn = document.querySelector('.export-btn');
    const originalText = exportBtn.textContent;
    exportBtn.textContent = '导出中...';
    exportBtn.disabled = true;

    try {
        await ResourceApiService.exportResourceData(resourceName);
    } catch (error) {
        console.error('导出失败:', error);
        alert('导出失败，请稍后重试');
    } finally {
        // 恢复按钮状态
        exportBtn.textContent = originalText;
        exportBtn.disabled = false;
    }
}

// 绘制来源图表（支持饼图和柱状图）


// 添加类型标签样式
const resourceStyle = document.createElement('style');
resourceStyle.textContent = `
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
    
    .source-info {
        text-align: right;
    }
    .source-info span {
        margin-left: 8px;
    }
`;
document.head.appendChild(resourceStyle);

// ------------------------ 任务弹窗相关 ------------------------

// 初始化任务弹窗
function initializeTaskModal() {
    const modal = document.getElementById('addTaskModal');
    const closeBtn = modal.querySelector('.close-btn');
    const cancelBtn = modal.querySelector('.cancel-btn');
    const form = document.getElementById('addTaskForm');
    const rewardTypeSelect = document.getElementById('rewardType');
    const customRewardInput = document.getElementById('customReward');

    // 关闭弹窗事件
    closeBtn.addEventListener('click', closeTaskModal);
    cancelBtn.addEventListener('click', closeTaskModal);

    // 点击弹窗外部关闭
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeTaskModal();
        }
    });

    // 表单提交事件
    form.addEventListener('submit', handleTaskFormSubmit);

    // 监听奖励类型变化
    rewardTypeSelect.addEventListener('change', function () {
        // 如果选择了"自定义奖励类型"以外的选项，清空自定义输入框
        if (this.value) {
            customRewardInput.value = '';
            customRewardInput.disabled = true;
        } else {
            customRewardInput.disabled = false;
        }
    });
}

// 关闭任务弹窗
function closeTaskModal() {
    const modal = document.getElementById('addTaskModal');
    const form = document.getElementById('addTaskForm');

    modal.classList.remove('show');
    form.reset();

    // 启用自定义奖励输入框
    document.getElementById('customReward').disabled = false;
}

// 处理任务表单提交
function handleTaskFormSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const taskName = formData.get('taskName').trim();
    const rewardType = formData.get('rewardType').trim();
    const customReward = formData.get('customReward').trim();
    const rewardAmount = formData.get('rewardAmount').trim();
    const taskType = formData.get('taskType');

    // 验证必填字段
    if (!taskName) {
        alert('请输入任务名称');
        return;
    }

    if (!rewardAmount || rewardAmount <= 0) {
        alert('请输入有效的奖励数量');
        return;
    }

    // 确定奖励类型（优先使用自定义奖励）
    let finalRewardType = rewardType;
    if (customReward) {
        finalRewardType = customReward;
    } else if (!rewardType) {
        alert('请选择奖励类型或输入自定义奖励类型');
        return;
    }

    // 添加任务
    addTask(taskType, taskName, finalRewardType, rewardAmount);

    // 关闭弹窗
    closeTaskModal();
}

// ------------------------ 弹窗相关 ------------------------

// 初始化弹窗
function initializeModal() {
    addActivityModal = document.getElementById('addActivityModal');
    addActivityForm = document.getElementById('addActivityForm');
    closeBtn = document.querySelector('.close-btn');
    cancelBtn = document.querySelector('.cancel-btn');
    saveBtn = document.querySelector('.save-btn');

    if (!addActivityModal || !addActivityForm) return;

    // 设置默认日期：当天开始至一周后结束
    const today = new Date();
    const oneWeekLater = new Date(today);
    oneWeekLater.setDate(today.getDate() + 7);

    document.getElementById('startDate').value = formatDate(today);
    document.getElementById('endDate').value = formatDate(oneWeekLater);

    // 添加事件监听器
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    addActivityForm.addEventListener('submit', handleFormSubmit);

    // 点击模态框外部关闭
    addActivityModal.addEventListener('click', (e) => {
        if (e.target === addActivityModal) {
            closeModal();
        }
    });
}

// 显示添加活动弹窗
function showAddActivityDialog() {
    if (!addActivityModal) {
        initializeModal();
    } else {
        // 每次显示弹窗时都重新设置默认日期
        const today = new Date();
        const oneWeekLater = new Date(today);
        oneWeekLater.setDate(today.getDate() + 7);
        document.getElementById('startDate').value = formatDate(today);
        document.getElementById('endDate').value = formatDate(oneWeekLater);
    }
    addActivityModal.classList.add('show');
}

// 格式化日期为YYYY-MM-DD格式
function formatDate(date) {
    return date.toISOString().split('T')[0];
}

// 关闭弹窗
function closeModal() {
    if (addActivityModal) {
        addActivityModal.classList.remove('show');
    }
    if (addActivityForm) {
        // 手动重置表单元素，只重置活动名称和颜色选择
        document.getElementById('activityName').value = '';
        // 将第一个颜色选项设为默认选中
        const firstColorOption = document.querySelector('input[name="activityColor"]');
        if (firstColorOption) {
            firstColorOption.checked = true;
        }
        // 重置默认日期：当天开始至一周后结束
        const today = new Date();
        const oneWeekLater = new Date(today);
        oneWeekLater.setDate(today.getDate() + 7);
        document.getElementById('startDate').value = formatDate(today);
        document.getElementById('endDate').value = formatDate(oneWeekLater);
    }
}

// 处理表单提交
function handleFormSubmit(e) {
    e.preventDefault();

    const formData = new FormData(addActivityForm);
    const name = formData.get('activityName').trim();
    const startDate = formData.get('startDate');
    const endDate = formData.get('endDate');
    const color = formData.get('activityColor');

    if (!name) {
        alert('请输入活动名称');
        return;
    }

    if (!startDate || !endDate) {
        alert('请选择开始和结束日期');
        return;
    }

    if (new Date(startDate) > new Date(endDate)) {
        alert('开始日期不能晚于结束日期');
        return;
    }

    addActivity(name, startDate, endDate, color);
    closeModal();
}

// 添加活动
function addActivity(name, startDate, endDate, color) {
    // 如果没有提供颜色，随机选择一个
    if (!color) {
        color = rainbowColors[Math.floor(Math.random() * rainbowColors.length)];
    }

    // 为新活动生成唯一ID
    const newActivityId = `activity-${Date.now()}`;

    // 添加到活动数组
    activities.push({id: newActivityId, name, startDate, endDate, color});

    // 重新生成所有活动行和列表，确保一致性
    generateActivityRows();
    generateActivityList();

    // 更新活动条位置
    updateActivityBars();
}
