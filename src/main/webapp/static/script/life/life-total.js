// 页面加载时初始化
document.addEventListener('DOMContentLoaded', async function () {
    try {
        const lifeTotalPage = new LifeTotalPage();
        await lifeTotalPage.init(); // 等待初始化完成
        console.log('页面初始化成功');
        // 初始化待办列表弹窗功能
    } catch (error) {
        console.error('页面初始化失败:', error);
        // 可以在这里显示错误提示或重定向到错误页面
    }
});

// 生活管理汇总页面专用脚本
class LifeTotalPage {
    constructor() {
        this.updateStatsInterval = null;
        this.currentUser = null;
    }

    /**
     * 初始化页面
     */
    async init() {
        await this.loadUserInfo();
        // this.startDataUpdate();
        await this.updateStatsDisplay();
        this.initTodoModal();
        console.log('生活管理汇总页面初始化完成');
    }

    /**
     * 加载用户信息
     */
    async loadUserInfo() {
        try {
            this.currentUser = await UserUtils.getCurrentUserInfo();
            if (this.currentUser) {
                this.currentUser.id = await UserUtils.getUserId();
                // console.log('用户信息加载成功:', this.currentUser.id);
            } else {
                console.warn('用户未登录，部分功能将受限');
            }
        } catch (error) {
            console.error('加载用户信息失败:', error);
            throw error; // 抛出错误让调用方处理
        }
    }

    /**
     * 开始数据更新定时器
     */
    // startDataUpdate() {
    //     // 立即执行一次数据更新
    //     this.updateStatsDisplay();
    //
    //     // 每30秒更新一次数据（实际项目中根据需求调整频率）
    //     this.updateStatsInterval = setInterval(() => {
    //         this.updateStatsDisplay();
    //     }, 30000);
    // }

    /*
     * 获取待办列表数据
     */
    /**
     * 获取用户待办任务列表
     * @returns {Promise<Object|null>} 成功返回任务数据（{code:200, data:{...}}），失败返回null
     * @description 异步获取用户任务数据，统一处理登录状态、接口请求、错误捕获
     */
    getTodoList() {
        // 1. 前置校验：用户未登录时，返回rejected状态的Promise（统一异步逻辑）
        if (!this.currentUser) {
            const errorMsg = '用户未登录，无法获取统计数据';
            console.warn(errorMsg);
            // 返回Promise，让调用者可通过catch捕获该错误
            return Promise.reject(new Error(errorMsg));
        }

        // 2. 核心：返回fetch的Promise，让调用者能接收异步结果
        return fetch(requestUrl + '/life/get-tasks', {
            method: 'POST', headers: {
                'Content-Type': 'application/json'
            }, body: JSON.stringify({userId: this.currentUser.id})
        })
            .then(response => {
                // 补充：校验HTTP响应状态（避免非200的响应被误判为成功）
                if (!response.ok) {
                    throw new Error(`HTTP请求失败，状态码：${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                // 3. 业务码校验：仅200返回数据，否则抛错
                if (data.code === 200) {
                    return data; // 此处return会让Promise进入resolved态，传递data
                } else {
                    const errorMsg = `获取统计数据失败: ${data.message || '未知错误'}`;
                    console.error(errorMsg);
                    throw new Error(errorMsg); // 抛错让Promise进入rejected态
                }
            })
            .catch(error => {
                // 4. 统一错误处理：打印+返回null（或继续抛错，根据业务需求）
                console.error('获取统计数据失败:', error.message);
                return null; // 若希望调用者不写catch，可返回null；否则删除此行，保留throw
            });
    }

    /**
     * 定义待办任务统计数据的类型（给编辑器识别层级结构）
     * @typedef {Object} TaskStatistics
     * @property {String} totaldonecount - 已完成任务数
     * @property {String} totalnotdonecount - 未完成任务数
     * @property {String} totalallcount - 总任务数
     */

    /**
     * 定义接口返回的任务数据结构
     * @typedef {Object} TaskListResponse
     * @property {Object} data - 接口返回的核心数据
     * @property {TaskStatistics} data.statistics - 任务统计数据
     * @property {number} code - 接口状态码（200为成功）
     */

    /**
     * 更新待办任务统计显示
     * @description 异步获取待办任务列表并更新页面统计显示
     * @returns {Promise<void>} 无返回值
     */
    async updateStatsDisplay() {
        try {
            // 声明taskList的类型，让编辑器识别其结构
            /** @type {TaskListResponse|null} */
            const taskList = await this.getTodoList();

            // 容错处理：若taskList为空/无数据，设置默认值0
            const notDoneCount = taskList?.data?.statistics?.totalnotdonecount ?? 0;
            const doneCount = taskList?.data?.statistics?.totaldonecount ?? 0;

            // 更新页面（先检查DOM元素是否存在，避免报错）
            const notDoneEl = document.getElementById('todo_not_done');
            const doneEl = document.getElementById('todo_done');
            const notDoneCountEl = document.getElementById('todo_not_done_count');

            if (notDoneEl) notDoneEl.textContent = notDoneCount;
            if (doneEl) doneEl.textContent = doneCount;
            if (notDoneCountEl) notDoneCountEl.textContent = notDoneCount;

        } catch (error) {
            console.error('更新待办统计显示失败:', error);
            // 异常兜底：设置默认值0
            const elements = ['todo_not_done', 'todo_done', 'todo_not_done_count'];
            elements.forEach(id => {
                const el = document.getElementById(id);
                if (el) el.textContent = "0";
            });
        }
    }

    /**
     * 清理资源
     */
    destroy() {
        if (this.updateStatsInterval) {
            clearInterval(this.updateStatsInterval);
        }
    }

    // 待办列表弹窗功能
    /**
     * 初始化待办列表弹窗
     */
    initTodoModal() {
        const viewTodoBtn = document.getElementById('viewTodoBtn');
        const todoModal = document.getElementById('todoModal');
        const closeTodoModal = document.getElementById('closeTodoModal');

        if (viewTodoBtn && todoModal && closeTodoModal) {
            // 查看待办按钮点击事件
            viewTodoBtn.addEventListener('click', async () => { // 1. 加 async 关键字
                try {
                    await this.showTodoModal(); // 2. await 等待 Promise 完成
                    // 可选：弹窗打开成功后的逻辑（比如日志、状态更新）
                    console.log('待办弹窗打开成功');
                } catch (err) {
                    // 3. 捕获弹窗打开失败的错误，避免未处理的 Promise 拒绝
                    console.error('打开待办弹窗失败：', err);
                    // 可选：用户友好提示
                    alert('弹窗加载失败，请重试');
                }
            });
            // 关闭按钮点击事件
            closeTodoModal.addEventListener('click', () => {
                this.hideTodoModal();
            });

            // 点击弹窗外部关闭
            todoModal.addEventListener('click', (e) => {
                if (e.target === todoModal) {
                    this.hideTodoModal();
                }
            });

            // ESC键关闭
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && todoModal.classList.contains('show')) {
                    this.hideTodoModal();
                }
            });
        }
    }

    /**
     * 显示待办列表弹窗
     * @description 异步获取待办列表数据并渲染到弹窗中
     * @property {Array} tasks - 待办事项数组
     *
     */
    async showTodoModal() {
        const todoModal = document.getElementById('todoModal');
        const todoList = document.getElementById('todoList');

        if (todoModal && todoList) {
            // 获取待办列表数据
            const data = await this.getTodoList();
            const todos = data?.data?.tasks || [];
            console.info("获取到的todo数据:", todos);

            // 渲染待办列表
            this.renderTodoList(todos, todoList);

            // 显示弹窗
            todoModal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }

    /**
     * 隐藏待办列表弹窗
     */
    hideTodoModal() {
        const todoModal = document.getElementById('todoModal');
        if (todoModal) {
            todoModal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    }

    /**
     * 获取标签颜色类
     * @param {string} tag - 标签名称
     * @returns {string} 颜色类名
     */
    getTagColorClass(tag) {
        // 根据标签名生成颜色类，使用哈希函数确保相同标签始终有相同颜色
        const tagColors = {
            '工作': 'tag-color-1',
            '文档': 'tag-color-2',
            '优先级高': 'tag-color-3',
            '会议': 'tag-color-4',
            '学习': 'tag-color-5',
            '技术': 'tag-color-6',
            'JavaScript': 'tag-color-7',
            '生活': 'tag-color-8',
            '购物': 'tag-color-9',
            '健康': 'tag-color-10',
            '运动': 'tag-color-11',
            '报告': 'tag-color-12',
            '整理': 'tag-color-13'
        };

        return tagColors[tag] || 'tag-color-default';
    }


    /**
     * 渲染待办列表
     * @param {Array} todos - 待办事项数组
     * @param {HTMLElement} container - 容器元素
     * @property {string} description - 待办事项的描述
     * @property {number} priority - 待办事项的优先级（1-低，2-中，3-高）
     * @property {string} deadline - 待办事项的截止时间
     * @property {number} id - 待办事项的唯一标识符
     * @property {String} tags - 待办事项的标签
     */
    renderTodoList(todos, container) {
        if (!todos || todos.length === 0) {
            container.innerHTML = `
            <div class="todo-empty">
                <i class="fas fa-check-circle"></i>
                <p>暂无待办事项</p>
            </div>
        `;
            return;
        }

        container.innerHTML = todos.map(todo => {
            const priorityClass = `priority-${todo.priority}`;
            const timeInfo = this.timeProcessing(todo.deadline);
            const timeClass = `time-${timeInfo.type}`;
            console.info("todo.tags:", todo.tags);
            const tagsHTML = (() => {
                // 1. 处理 tags：转数组 + 去空格 + 过滤空项
                const tagsArray = todo.tags ? todo.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [];

                // 2. 只有数组有内容时才生成 HTML
                if (tagsArray.length === 0) return '';

                // 3. 对数组调用 map（此时不会报错）
                return `
        <div class="tags-container">
            ${tagsArray.map(tag => `<span class="tag-item ${this.getTagColorClass(tag)}">${tag}</span>`).join('')}
        </div>
    `;
            })();


            return `
            <div class="todo-item">
                <div class="todo-item-checkbox">
                    <input type="checkbox" id="todo-${todo.id}">
                </div>
                <div class="todo-item-content">
                    <div class="todo-item-header">
                        <div class="todo-item-title">
                            <span class="todo-item-title-text">${todo.title}</span>
                            <span class="priority-label ${priorityClass}">${todo.priority === 3 ? '高' : todo.priority === 2 ? '中' : '低'}</span>
                        </div>
                        ${tagsHTML}
                    </div>
                    <div class="todo-item-description">${todo.description}</div>
                    <div class="todo-item-footer">
                        <span>${timeInfo.label}</span>
                        <span class="time-label ${timeClass}">${timeInfo.timeText}</span>
                    </div>
                </div>
            </div>
        `;
        }).join('');
    }

    /**
     * 格式化日期为指定格式
     * @param {Date} dateString - 日期字符串（例如：'2023-12-31T23:59:00'）
     * @returns {string} - 格式化后的日期字符串（例如：'2023 年 12 月 31 日 23:59'）
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${year} 年 ${month} 月 ${day} 日 ${hours}:${minutes}`;
    }

    /**
     * 处理时间信息
     * @param {Date} date - 时间对象
     * @returns {Object} - 包含时间类型和时间文本的对象
     */
    timeProcessing(date) {
        const dueDate = new Date(date);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // 将所有日期设置为当天的0点0分0秒，用于比较日期
        const dueDateOnly = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
        const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const tomorrowOnly = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());

        let type;
        let timeText;
        let label;

        if (dueDateOnly < todayOnly) {
            // 逾期
            type = 'overdue';
            timeText = '已逾期';
        } else if (dueDateOnly.toDateString() === todayOnly.toDateString()) {
            // 今天
            type = 'today';
            timeText = '今天';
        } else if (dueDateOnly.toDateString() === tomorrowOnly.toDateString()) {
            // 明天
            type = 'tomorrow';
            timeText = '明天';
        } else {
            // 其他
            type = 'other';
            timeText = '未来';
        }

        label = this.formatDate(date);

        return {
            type, timeText, label
        };
    }
}






