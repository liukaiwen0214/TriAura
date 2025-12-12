// 页面加载时初始化
document.addEventListener('DOMContentLoaded', async function () {
    try {
        const lifeTodoPage = new LifeTodoPage();
        await lifeTodoPage.init(); // 等待初始化完成
        console.log('待办页面初始化成功');
    } catch (error) {
        console.error('待办页面初始化失败:', error);
        // 可以在这里显示错误提示或重定向到错误页面
    }
});

// 待办管理页面专用脚本
class LifeTodoPage {
    constructor() {
        this.todos = [];
        this.filteredTodos = [];
        this.currentUser = null;
        this.isEditing = false;
        this.currentTodoId = null;

        // 筛选条件
        this.filters = {
            status: 'all',
            priority: 'all',
            search: ''
        };

        // 绑定DOM元素
        this.bindElements();
    }

    /**
     * 绑定DOM元素
     */
    bindElements() {
        // 模态框相关
        this.todoModal = document.getElementById('todoModal');
        this.addTodoBtn = document.getElementById('addTodoBtn');
        this.closeModal = document.getElementById('closeModal');
        this.cancelBtn = document.getElementById('cancelBtn');
        this.saveBtn = document.getElementById('saveBtn');
        this.modalTitle = document.getElementById('modalTitle');

        // 表单元素
        this.todoForm = document.getElementById('todoForm');
        this.todoId = document.getElementById('todoId');
        this.todoTitle = document.getElementById('todoTitle');
        this.todoDescription = document.getElementById('todoDescription');
        this.todoPriority = document.getElementById('todoPriority');
        this.todoCategory = document.getElementById('todoCategory');
        this.todoDueDate = document.getElementById('todoDueDate');

        // 待办列表和统计
        this.todoList = document.getElementById('todoList');
        this.totalTasks = document.getElementById('totalTasks');
        this.completedTasks = document.getElementById('completedTasks');
        this.pendingTasks = document.getElementById('pendingTasks');
        this.highPriorityTasks = document.getElementById('highPriorityTasks');
        this.completionRate = document.getElementById('completionRate');

        // 筛选和搜索
        this.searchInput = document.getElementById('searchInput');
        this.filterBtns = document.querySelectorAll('.filter-btn');

        // 加载遮罩
        this.loadingOverlay = document.getElementById('loadingOverlay');
        this.mainContent = document.querySelector('.main-content');
    }

    /**
     * 绑定事件监听器
     */
    bindEvents() {
        // 模态框事件
        this.addTodoBtn.addEventListener('click', () => this.openModal());
        this.closeModal.addEventListener('click', () => this.closeModal());
        this.cancelBtn.addEventListener('click', () => this.closeModal());
        this.saveBtn.addEventListener('click', () => this.saveTodo());

        // 点击模态框外部关闭
        window.addEventListener('click', (e) => {
            if (e.target === this.todoModal) {
                this.closeModal();
            }
        });

        // 筛选按钮事件
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilter(e));
        });

        // 搜索事件
        this.searchInput.addEventListener('input', (e) => {
            this.filters.search = e.target.value.toLowerCase();
            this.applyFilters();
        });

        // 表单提交事件
        this.todoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveTodo();
        });
    }

    /**
     * 初始化页面
     */
    async init() {
        // 模拟加载延迟
        await this.simulateLoading();

        await this.loadUserInfo();
        await this.loadTodos();
        this.bindEvents();
        this.updateStats();
        this.renderTodos();

        // 隐藏加载遮罩，显示页面
        this.loadingOverlay.classList.add('fade-out');
        this.mainContent.classList.add('fade-in');

        console.log('待办管理页面初始化完成');
    }

    /**
     * 模拟加载延迟
     */
    async simulateLoading() {
        return new Promise(resolve => {
            setTimeout(resolve, 1000);
        });
    }

    /**
     * 加载用户信息
     */
    async loadUserInfo() {
        try {
            // 实际项目中应该调用真实API
            this.currentUser = await this.simulateGetUserInfo();
            if (this.currentUser) {
                console.log('用户信息加载成功:', this.currentUser.id);
            } else {
                console.warn('用户未登录，部分功能将受限');
            }
        } catch (error) {
            console.error('加载用户信息失败:', error);
            throw error; // 抛出错误让调用方处理
        }
    }

    /**
     * 加载待办数据
     */
    async loadTodos() {
        try {
            // 实际项目中应该调用真实API
            this.todos = await this.simulateGetTodos();
            this.filteredTodos = [...this.todos];
            console.log('待办数据加载成功:', this.todos.length, '条记录');
        } catch (error) {
            console.error('加载待办数据失败:', error);
            throw error;
        }
    }

    /**
     * 模拟获取用户信息
     */
    simulateGetUserInfo() {
        return Promise.resolve({
            id: 'user123',
            name: '张三',
            email: 'zhangsan@example.com'
        });
    }

    /**
     * 模拟获取待办数据
     */
    simulateGetTodos() {
        return Promise.resolve([
            {
                id: 1,
                title: '完成项目文档',
                description: '更新项目的技术文档和使用说明',
                priority: 'high',
                category: '工作',
                dueDate: '2025-11-25',
                completed: false,
                createdAt: '2025-11-20T10:00:00',
                updatedAt: '2025-11-20T10:00:00'
            },
            {
                id: 2,
                title: '学习JavaScript高级特性',
                description: '深入学习闭包、原型链和异步编程',
                priority: 'medium',
                category: '学习',
                dueDate: '2025-11-30',
                completed: false,
                createdAt: '2025-11-20T14:30:00',
                updatedAt: '2025-11-20T14:30:00'
            },
            {
                id: 3,
                title: '购买生活用品',
                description: '购买牛奶、鸡蛋、蔬菜等日常用品',
                priority: 'low',
                category: '生活',
                dueDate: '2025-11-22',
                completed: true,
                createdAt: '2025-11-19T18:45:00',
                updatedAt: '2025-11-20T09:15:00'
            },
            {
                id: 4,
                title: '健身锻炼',
                description: '进行30分钟有氧运动和20分钟力量训练',
                priority: 'medium',
                category: '健康',
                dueDate: '2025-11-21',
                completed: false,
                createdAt: '2025-11-20T08:00:00',
                updatedAt: '2025-11-20T08:00:00'
            },
            {
                id: 5,
                title: '参加团队会议',
                description: '讨论项目进展和下一步计划',
                priority: 'high',
                category: '工作',
                dueDate: '2025-11-21',
                completed: false,
                createdAt: '2025-11-20T16:00:00',
                updatedAt: '2025-11-20T16:00:00'
            }
        ]);
    }

    /**
     * 渲染待办列表
     */
    renderTodos() {
        if (this.filteredTodos.length === 0) {
            this.renderEmptyState();
            return;
        }

        this.todoList.innerHTML = this.filteredTodos.map(todo => this.createTodoItem(todo)).join('');

        // 绑定待办项事件
        this.bindTodoEvents();
    }

    /**
     * 渲染空状态
     */
    renderEmptyState() {
        this.todoList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <h3>暂无待办事项</h3>
                <p>点击"添加待办"按钮开始创建您的第一个任务吧</p>
                <button class="btn-primary" onclick="document.getElementById('addTodoBtn').click()">
                    <i class="fas fa-plus"></i> 添加待办
                </button>
            </div>
        `;
    }

    /**
     * 创建待办项HTML
     */
    createTodoItem(todo) {
        const priorityIcon = {
            high: '<i class="fas fa-exclamation-circle"></i>',
            medium: '<i class="fas fa-exclamation-triangle"></i>',
            low: '<i class="fas fa-info-circle"></i>'
        };

        return `
            <div class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
                <div class="todo-checkbox">
                    <input type="checkbox" ${todo.completed ? 'checked' : ''} onchange="lifeTodoPage.toggleTodoStatus(${todo.id})">
                </div>
                <div class="todo-content">
                    <div class="todo-title">${todo.title}</div>
                    ${todo.description ? `<div class="todo-description">${todo.description}</div>` : ''}
                    <div class="todo-meta">
                        ${todo.category ? `<span class="todo-category">${todo.category}</span>` : ''}
                        <span class="todo-due-date">
                            <i class="far fa-calendar"></i> ${todo.dueDate}
                        </span>
                        <span class="todo-priority priority-${todo.priority}">
                            ${priorityIcon[todo.priority]} ${todo.priority}
                        </span>
                    </div>
                </div>
                <div class="todo-actions">
                    <button class="action-btn edit" onclick="lifeTodoPage.editTodo(${todo.id})" title="编辑">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="lifeTodoPage.deleteTodo(${todo.id})" title="删除">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * 绑定待办项事件
     */
    bindTodoEvents() {
        // 这里可以绑定更多待办项相关的事件
    }

    /**
     * 打开模态框
     */
    openModal(todo = null) {
        this.isEditing = !!todo;
        this.currentTodoId = todo ? todo.id : null;

        if (this.isEditing) {
            this.modalTitle.textContent = '编辑待办';
            this.todoId.value = todo.id;
            this.todoTitle.value = todo.title;
            this.todoDescription.value = todo.description || '';
            this.todoPriority.value = todo.priority;
            this.todoCategory.value = todo.category || '';
            this.todoDueDate.value = todo.dueDate;
        } else {
            this.modalTitle.textContent = '添加新待办';
            this.todoForm.reset();
            this.todoId.value = '';
        }

        this.todoModal.classList.add('show');
    }

    /**
     * 关闭模态框
     */
    closeModal() {
        this.todoModal.classList.remove('show');
        this.todoForm.reset();
        this.isEditing = false;
        this.currentTodoId = null;
    }

    /**
     * 保存待办
     */
    saveTodo() {
        const formData = {
            title: this.todoTitle.value.trim(),
            description: this.todoDescription.value.trim(),
            priority: this.todoPriority.value,
            category: this.todoCategory.value.trim(),
            dueDate: this.todoDueDate.value
        };

        if (!formData.title) {
            alert('请输入待办标题');
            return;
        }

        if (this.isEditing) {
            this.updateTodo(this.currentTodoId, formData);
        } else {
            this.addTodo(formData);
        }

        this.closeModal();
    }

    /**
     * 添加待办
     */
    addTodo(todoData) {
        const newTodo = {
            id: Date.now(),
            ...todoData,
            completed: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.todos.unshift(newTodo);
        this.applyFilters();
        this.updateStats();
        this.renderTodos();

        console.log('待办添加成功:', newTodo);
    }

    /**
     * 更新待办
     */
    updateTodo(id, todoData) {
        const index = this.todos.findIndex(todo => todo.id === id);
        if (index !== -1) {
            this.todos[index] = {
                ...this.todos[index],
                ...todoData,
                updatedAt: new Date().toISOString()
            };

            this.applyFilters();
            this.updateStats();
            this.renderTodos();

            console.log('待办更新成功:', this.todos[index]);
        }
    }

    /**
     * 删除待办
     */
    deleteTodo(id) {
        if (confirm('确定要删除这个待办吗？')) {
            this.todos = this.todos.filter(todo => todo.id !== id);
            this.applyFilters();
            this.updateStats();
            this.renderTodos();

            console.log('待办删除成功:', id);
        }
    }

    /**
     * 切换待办状态
     */
    toggleTodoStatus(id) {
        const todo = this.todos.find(todo => todo.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            todo.updatedAt = new Date().toISOString();

            this.applyFilters();
            this.updateStats();
            this.renderTodos();

            console.log('待办状态更新:', todo);
        }
    }

    /**
     * 编辑待办
     */
    editTodo(id) {
        const todo = this.todos.find(todo => todo.id === id);
        if (todo) {
            this.openModal(todo);
        }
    }

    /**
     * 处理筛选
     */
    handleFilter(e) {
        const btn = e.target;
        const filterType = btn.dataset.status ? 'status' : 'priority';
        const filterValue = btn.dataset.status || btn.dataset.priority;

        // 更新筛选条件
        this.filters[filterType] = filterValue;

        // 更新按钮状态
        btn.parentElement.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // 应用筛选
        this.applyFilters();
    }

    /**
     * 应用筛选
     */
    applyFilters() {
        this.filteredTodos = this.todos.filter(todo => {
            // 状态筛选
            if (this.filters.status === 'completed' && !todo.completed) return false;
            if (this.filters.status === 'pending' && todo.completed) return false;

            // 优先级筛选
            if (this.filters.priority !== 'all' && todo.priority !== this.filters.priority) return false;

            // 搜索筛选
            if (this.filters.search) {
                const searchTerm = this.filters.search.toLowerCase();
                return todo.title.toLowerCase().includes(searchTerm) ||
                    (todo.description && todo.description.toLowerCase().includes(searchTerm)) ||
                    (todo.category && todo.category.toLowerCase().includes(searchTerm));
            }

            return true;
        });

        this.renderTodos();
    }

    /**
     * 更新统计数据
     */
    updateStats() {
        const total = this.todos.length;
        const completed = this.todos.filter(todo => todo.completed).length;
        const pending = total - completed;
        const highPriority = this.todos.filter(todo => todo.priority === 'high').length;
        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

        this.totalTasks.textContent = total;
        this.completedTasks.textContent = completed;
        this.pendingTasks.textContent = pending;
        this.highPriorityTasks.textContent = highPriority;
        this.completionRate.innerHTML = `<i class="fas fa-arrow-up"></i> ${completionRate}% 完成率`;
    }

    /**
     * 清理资源
     */
    destroy() {
        // 清理事件监听器和定时器
        this.todoModal = null;
        this.addTodoBtn = null;
        this.closeModal = null;
        this.cancelBtn = null;
        this.saveBtn = null;
        this.modalTitle = null;
        this.todoForm = null;
        this.todoId = null;
        this.todoTitle = null;
        this.todoDescription = null;
        this.todoPriority = null;
        this.todoCategory = null;
        this.todoDueDate = null;
        this.todoList = null;
        this.totalTasks = null;
        this.completedTasks = null;
        this.pendingTasks = null;
        this.highPriorityTasks = null;
        this.completionRate = null;
        this.searchInput = null;
        this.filterBtns = null;
        this.loadingOverlay = null;
        this.mainContent = null;
    }
}

// 全局变量，方便HTML中调用
let lifeTodoPage;