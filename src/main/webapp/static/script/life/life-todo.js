// ==================== 系统配置常量 ====================
// API配置
const API_CONFIG = {
    IS_MOCK: true,              // 是否使用模拟数据
    MOCK_DELAY: 1000,           // 模拟延迟（毫秒）
    TIMEOUT: 30000,             // 请求超时时间
    RETRY_ATTEMPTS: 3,          // 重试次数
    RETRY_DELAY: 1000           // 重试延迟
};

// 本地存储键名
const STORAGE_KEYS = {
    TODOS: 'life_todos',
    COLUMNS: 'life_columns',
    FILTERS: 'life_filters',
    USER_PREFERENCES: 'life_user_preferences',
    DATA_VERSION: 'life_data_version'
};

// 动画配置
const ANIMATION_CONFIG = {
    FLIGHT_DURATION: 500,       // 飞行动画时长
    FLIGHT_ADVANCE_TIME: 400,   // 提前返回时间
    HIGHLIGHT_DURATION: 1500,   // 高亮动画时长
    ADD_DURATION: 350,          // 添加动画时长
    REMOVE_DURATION: 400,       // 移除动画时长
    LOADING_DELAY: 300          // 加载延迟
};

// 筛选配置
const FILTER_CONFIG = {
    DEBOUNCE_DELAY: 300,        // 防抖延迟（毫秒）
    PAGE_SIZE: 50               // 每页显示数量
};

// ==================== 业务常量枚举 ====================
const STATUS = {
    NOT_STARTED: 0,
    IN_PROGRESS: 1,
    COMPLETED: 2,
    CANCELLED: 3
};

const STATUS_TEXT = {
    [STATUS.NOT_STARTED]: '未开始',
    [STATUS.IN_PROGRESS]: '进行中',
    [STATUS.COMPLETED]: '已完成',
    [STATUS.CANCELLED]: '已取消'
};

const GROUP_TYPE = {
    DEFAULT: 0,    // 默认分组
    CUSTOM: 1      // 自定义分组
};

const PRIORITY = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high'
};

const PRIORITY_TEXT = {
    [PRIORITY.LOW]: '低',
    [PRIORITY.MEDIUM]: '中',
    [PRIORITY.HIGH]: '高'
};

const PRIORITY_COLOR = {
    [PRIORITY.LOW]: '#6b7280',
    [PRIORITY.MEDIUM]: '#d97706',
    [PRIORITY.HIGH]: '#dc2626'
};

// 分组配置
const GROUP_CONFIG = {
    PREFIX: {
        DEFAULT: 'default-',
        CUSTOM: 'custom-'
    },
    isDefaultGroup: (columnId) => String(columnId).startsWith('default-'),
    isCustomGroup: (columnId) => String(columnId).startsWith('custom-'),
    extractId: (columnId) => {
        const parts = String(columnId).split('-');
        return parts.length > 1 ? parseInt(parts[1]) : null;
    }
};

// 日期颜色规则
const DATE_COLOR = {
    OVERDUE: {
        className: 'overdue',
        color: '#dc2626',
        background: 'rgba(220, 38, 38, 0.1)'
    },
    TODAY: {
        className: 'today',
        color: '#d97706',
        background: 'rgba(217, 119, 6, 0.08)'
    },
    TOMORROW: {
        className: 'tomorrow',
        color: '#0284c7',
        background: 'rgba(2, 132, 199, 0.08)'
    },
    FUTURE: {
        className: 'future',
        color: '#6b7280',
        background: 'transparent'
    }
};

// 分组名称常量
const DEFAULT_GROUP_NAMES = {
    PENDING: '待处理',
    COMPLETED: '已完成',
    CANCELLED: '已取消'
};

// 错误消息
const ERROR_MESSAGES = {
    NETWORK_ERROR: '网络连接失败，请检查网络设置',
    SERVER_ERROR: '服务器错误，请稍后重试',
    LOAD_FAILED: '数据加载失败',
    SAVE_FAILED: '保存失败',
    DELETE_FAILED: '删除失败',
    VALIDATION_FAILED: '数据验证失败'
};

// 成功消息
const SUCCESS_MESSAGES = {
    SAVE_SUCCESS: '保存成功',
    DELETE_SUCCESS: '删除成功',
    UPDATE_SUCCESS: '更新成功'
};

// 兼容旧代码
const SIMULATE_DELAY = API_CONFIG.MOCK_DELAY;

// ==================== 工具函数区 ====================
/**
 * 安全获取对象属性，避免报错
 */
function safeGet(obj, path, defaultValue = null) {
    try {
        const keys = path.split('.');
        let result = obj;
        for (const key of keys) {
            result = result?.[key];
            if (result === undefined || result === null) {
                return defaultValue;
            }
        }
        return result;
    } catch (error) {
        return defaultValue;
    }
}

/**
 * 格式化日期
 */
function formatDate(date, format = 'YYYY-MM-DD') {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) return '';

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');

    return format
        .replace('YYYY', year)
        .replace('MM', month)
        .replace('DD', day)
        .replace('HH', hours)
        .replace('mm', minutes)
        .replace('ss', seconds);
}

/**
 * 获取相对时间描述
 */
function getRelativeTime(date) {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diff = now.getTime() - d.getTime();

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 30) return `${days}天前`;
    return formatDate(d, 'YYYY-MM-DD');
}

/**
 * 判断日期类型（逾期、今天、明天、未来）
 */
function getDateType(dateStr) {
    if (!dateStr) return DATE_COLOR.FUTURE;

    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return DATE_COLOR.OVERDUE;
    if (diffDays === 0) return DATE_COLOR.TODAY;
    if (diffDays === 1) return DATE_COLOR.TOMORROW;
    return DATE_COLOR.FUTURE;
}

/**
 * 计算剩余天数
 */
function getDaysRemaining(dateStr) {
    if (!dateStr) return null;

    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    const diffTime = targetDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * 防抖函数
 */
function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

/**
 * 节流函数
 */
function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * 深度克隆对象
 */
function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => deepClone(item));
    if (obj instanceof Object) {
        const clonedObj = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                clonedObj[key] = deepClone(obj[key]);
            }
        }
        return clonedObj;
    }
}

/**
 * 数组去重
 */
function unique(arr, key = null) {
    if (!Array.isArray(arr)) return [];
    if (!key) return [...new Set(arr)];

    const seen = new Set();
    return arr.filter(item => {
        const keyValue = typeof key === 'function' ? key(item) : item[key];
        if (seen.has(keyValue)) return false;
        seen.add(keyValue);
        return true;
    });
}

/**
 * 数组分组
 */
function groupBy(arr, key) {
    if (!Array.isArray(arr)) return {};
    return arr.reduce((groups, item) => {
        const groupKey = typeof key === 'function' ? key(item) : item[key];
        if (!groups[groupKey]) groups[groupKey] = [];
        groups[groupKey].push(item);
        return groups;
    }, {});
}

/**
 * 本地存储 - 保存
 */
function saveToStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error('保存到本地存储失败:', error);
    }
}

/**
 * 本地存储 - 读取
 */
function loadFromStorage(key, defaultValue = null) {
    try {
        const serialized = localStorage.getItem(key);
        return serialized === null ? defaultValue : JSON.parse(serialized);
    } catch (error) {
        console.error('从本地存储读取失败:', error);
        return defaultValue;
    }
}

/**
 * 验证表单数据
 */
function validateFormData(formData) {
    const errors = {};

    // 验证标题
    if (!formData.title || formData.title.trim() === '') {
        errors.title = '标题不能为空';
    } else if (formData.title.length > 200) {
        errors.title = '标题长度不能超过200个字符';
    }

    // 验证描述
    if (formData.description && formData.description.length > 2000) {
        errors.description = '描述不能超过2000个字符';
    }

    // 验证标签
    if (formData.tags) {
        const tags = formData.tags.split(',').map(t => t.trim()).filter(t => t);
        if (tags.length > 10) {
            errors.tags = '最多添加10个标签';
        }
        const tooLongTag = tags.find(tag => tag.length > 20);
        if (tooLongTag) {
            errors.tags = `标签“${tooLongTag}”过长，最多20个字符`;
        }
    }

    return {
        valid: Object.keys(errors).length === 0,
        errors
    };
}

/**
 * 生成唯一ID
 */
function generateId(prefix = '') {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    return `${prefix}${timestamp}_${random}`;
}


// ==================== 事件总线 ====================
class EventBus {
    constructor() {
        this.listeners = new Map();
    }

    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
        return () => this.off(event, callback);
    }

    off(event, callback = null) {
        if (!this.listeners.has(event)) return;
        if (!callback) {
            this.listeners.delete(event);
            return;
        }
        const listeners = this.listeners.get(event);
        const index = listeners.findIndex(cb => cb === callback);
        if (index !== -1) listeners.splice(index, 1);
        if (listeners.length === 0) this.listeners.delete(event);
    }

    emit(event, data = null) {
        if (!this.listeners.has(event)) return;
        this.listeners.get(event).forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error(`[EventBus] Error in listener for ${event}:`, error);
            }
        });
    }
}

const eventBus = new EventBus();

// ==================== Toast通知组件 ====================
class ToastManager {
    constructor() {
        this.container = null;
        this.init();
    }

    init() {
        // 创建 Toast 容器
        this.container = document.createElement('div');
        this.container.className = 'toast-container';
        this.container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;
        document.body.appendChild(this.container);
    }

    show(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        const colors = {
            success: {bg: '#10b981', icon: 'fa-check-circle'},
            error: {bg: '#ef4444', icon: 'fa-times-circle'},
            warning: {bg: '#f59e0b', icon: 'fa-exclamation-triangle'},
            info: {bg: '#3b82f6', icon: 'fa-info-circle'}
        };

        const config = colors[type] || colors.info;

        toast.style.cssText = `
            background: ${config.bg};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            gap: 10px;
            min-width: 250px;
            max-width: 400px;
            animation: slideInRight 0.3s ease-out;
            font-size: 14px;
        `;

        toast.innerHTML = `
            <i class="fas ${config.icon}"></i>
            <span>${message}</span>
        `;

        this.container.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                this.container.removeChild(toast);
            }, 300);
        }, duration);
    }

    success(message, duration) {
        this.show(message, 'success', duration);
    }

    error(message, duration) {
        this.show(message, 'error', duration);
    }

    warning(message, duration) {
        this.show(message, 'warning', duration);
    }

    info(message, duration) {
        this.show(message, 'info', duration);
    }
}

const toast = new ToastManager();

// 添加 Toast 动画样式
if (!document.getElementById('toast-animations')) {
    const style = document.createElement('style');
    style.id = 'toast-animations';
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// 模态框管理模块
class ModalManager {
    constructor(controller) {
        this.controller = controller;
        this.isEditing = false;
        this.currentTodoId = null;
        this.bindElements();
        this.bindEvents();
    }

    /**
     * 绑定DOM元素
     */
    bindElements() {
        // 模态框相关
        this.todoModal = document.getElementById('todoModal');
        this.addTodoBtn = document.getElementById('addTodoBtn');
        this.closeModalBtn = document.getElementById('closeModal'); // 修改变量名，避免与方法名冲突
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
        this.todoTags = document.getElementById('todoTags');
        this.todoReminderTime = document.getElementById('todoReminderTime');
    }

    /**
     * 绑定模态框事件
     */
    bindEvents() {
        // 绑定模态框开关事件
        if (this.addTodoBtn) {
            this.addTodoBtn.addEventListener('click', () => this.openModal());
        }
        if (this.closeModalBtn) {
            this.closeModalBtn.addEventListener('click', () => this.closeModal());
        }
        if (this.cancelBtn) {
            this.cancelBtn.addEventListener('click', () => this.closeModal());
        }
        if (this.saveBtn) {
            this.saveBtn.addEventListener('click', () => this.saveTodo());
        }
        
        // 点击模态框外部关闭
        if (this.todoModal) {
            window.addEventListener('click', (e) => {
                if (e.target === this.todoModal) {
                    this.closeModal();
                }
            });
        }

        // 绑定表单提交事件
        if (this.todoForm) {
            this.todoForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveTodo();
            });
        }
    }
    
    /**
     * 打开模态框
     * @param {Object|null} todo - 待办数据，为空则表示添加新待办
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
            this.todoTags.value = todo.tags || '';
            this.todoReminderTime.value = todo.reminderTime ? todo.reminderTime.slice(0, 16) : ''; // 转换为datetime-local格式
        } else {
            this.modalTitle.textContent = '添加新待办';
            this.todoForm.reset();
            this.todoId.value = '';

            // 设置默认时间为当天时间
            const now = new Date();

            // 格式化日期为YYYY-MM-DD
            const currentDate = now.toISOString().split('T')[0];

            // 格式化时间为YYYY-MM-DDTHH:mm
            const currentDateTime = now.toISOString().slice(0, 16);

            this.todoDueDate.value = currentDate;
            this.todoReminderTime.value = currentDateTime;
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
    async saveTodo() {
        const formData = {
            title: this.todoTitle.value.trim(),
            description: this.todoDescription.value.trim(),
            priority: this.todoPriority.value,
            category: this.todoCategory.value.trim(),
            dueDate: this.todoDueDate.value,
            tags: this.todoTags.value.trim(),
            reminderTime: this.todoReminderTime.value
        };

        // 使用新的验证函数
        const validation = validateFormData(formData);
        if (!validation.valid) {
            const firstError = Object.values(validation.errors)[0];
            toast.error(firstError);
            return;
        }

        // 构建确认消息
        const actionText = this.isEditing ? '编辑' : '添加';
        const confirmMessage = `确定要${actionText}待办「${formData.title}」吗？`;

        // 显示确认弹窗
        this.controller.showConfirmModal(confirmMessage, `${actionText}待办`, async (result) => {
            if (result) {
                try {
                    // 添加加载状态
                    this.saveBtn.disabled = true;
                    this.saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 保存中...';

                    if (this.isEditing) {
                        await this.controller.updateTodo(this.currentTodoId, formData);
                        toast.success('待办编辑成功');
                    } else {
                        await this.controller.addTodo(formData);
                        toast.success('待办添加成功');
                    }

                    this.closeModal();
                } catch (error) {
                    console.error('[ModalManager.saveTodo] 保存待办失败:', error);
                    toast.error('保存待办失败，请重试');
                } finally {
                    // 恢复按钮状态
                    this.saveBtn.disabled = false;
                    this.saveBtn.innerHTML = '保存';
                }
            }
        });
    }
}

// 数据加载模块
class DataLoader {
    constructor(controller) {
        this.controller = controller;
        this.loadingOverlay = document.getElementById('loadingOverlay');
        this.mainContent = document.querySelector('.main-content');
    }

    /**
     * 模拟加载延迟
     */
    async simulateLoading() {
        return new Promise(resolve => {
            setTimeout(resolve, SIMULATE_DELAY);
        });
    }

    /**
     * 隐藏加载遮罩
     */
    hideLoadingOverlay() {
        if (this.loadingOverlay) {
            this.loadingOverlay.classList.add('fade-out');
        }
        if (this.mainContent) {
            this.mainContent.classList.add('fade-in');
        }
    }
    
    /**
     * 加载用户信息
     */
    async loadUserInfo() {
        try {
            // 实际项目中应该调用真实API
            const userInfo = await this.simulateGetUserInfo();
            this.controller.currentUser = userInfo;
            // console.log('用户信息加载成功:', userInfo.id);
            return userInfo;
        } catch (error) {
            console.error('加载用户信息失败:', error);
            throw error;
        }
    }

    /**
     * 加载待办数据
     */
    async loadTodos() {
        try {
            // 尝试从本地存储加载缓存数据
            const cachedData = loadFromStorage(STORAGE_KEYS.TODOS);
            if (cachedData && cachedData.todos && cachedData.columns) {
                console.log('从本地缓存加载待办数据');
                this.controller.todos = cachedData.todos;
                this.controller.columns = cachedData.columns;
            }
            
            // 实际项目中应该调用真实API
            const response = await this.simulateGetTodos();
            const data = response.data;

            // 解析默认分组和自定义分组数据
            const defaultGroups = data.defaultGroups || [];
            const customGroups = data.customGroups || [];

            // 合并所有任务
            const allTasks = [];

            // 获取所有任务（默认分组+自定义分组）
            const allRawTasks = [...defaultGroups.flatMap(g => g.tasks), ...customGroups.flatMap(g => g.tasks)];

            // 处理所有任务
            allRawTasks.forEach(task => {
                // 从标签中提取第一个标签作为分类
                const category = task.tags ? task.tags.split(',')[0] : '';

                // 格式化日期
                const dueDate = task.deadline ? task.deadline.split('T')[0] : '';

                // 初始渲染：任务归属的核心判定逻辑
                let group_type = task.group_type;
                let custom_group_id = task.custom_group_id;
                let columnId;

                // 场景1：group_type=0（默认分组）
                if (group_type === GROUP_TYPE.DEFAULT) {
                    // 若custom_group_id不为null，属于后端异常数据，前端直接忽略该值
                    custom_group_id = null;

                    // 根据status确定归属的默认分组子分组
                    if (task.status === STATUS.NOT_STARTED || task.status === STATUS.IN_PROGRESS) {
                        // 未开始 / 进行中：归入默认分组的「待处理」子分组
                        columnId = 'default-0';
                    } else if (task.status === STATUS.COMPLETED) {
                        // 已完成：归入默认分组的「已完成」子分组
                        columnId = 'default-2';
                    } else if (task.status === STATUS.CANCELLED) {
                        // 已取消：归入默认分组的「已取消」子分组
                        columnId = 'default-3';
                    } else {
                        // 异常status：归入默认分组的「待处理」子分组
                        columnId = 'default-0';
                        task.status = STATUS.NOT_STARTED;
                    }
                }
                // 场景2：group_type=1（自定义分组）
                else if (group_type === GROUP_TYPE.CUSTOM) {
                    // 若custom_group_id为null，属于异常数据，前端兜底归为「未分组」自定义分组
                    if (!custom_group_id) {
                        console.warn(`任务ID: ${task.id} 自定义分组ID为空，归为未分组`);
                        columnId = 'custom-0'; // 未分组自定义分组
                    } else {
                        // 根据custom_group_id匹配对应的自定义分组
                        columnId = `custom-${custom_group_id}`;
                    }
                }
                // 场景3：异常数据兜底
                else {
                    // 出现group_type非 0/1、group_type与custom_group_id不匹配等异常数据
                    console.warn(`任务ID: ${task.id} 分组数据异常，group_type: ${group_type}, custom_group_id: ${custom_group_id}`);
                    columnId = 'custom-999'; // 异常任务临时分组
                    group_type = GROUP_TYPE.DEFAULT;
                    custom_group_id = null;
                    task.status = STATUS.NOT_STARTED;
                }

                allTasks.push({
                    id: task.id,
                    title: task.title || '',
                    description: task.description || '',
                    priority: task.priority === 3 ? 'high' : task.priority === 2 ? 'medium' : 'low',
                    category: category,
                    dueDate: dueDate,
                    completed: task.status === STATUS.COMPLETED,
                    createdAt: task.createdAt || new Date().toISOString(),
                    updatedAt: task.updatedAt || new Date().toISOString(),
                    columnId: columnId,
                    tags: task.tags || '',
                    deadline: task.deadline || '',
                    status: task.status || STATUS.NOT_STARTED,
                    completedAt: task.completedAt || null,
                    reminderTime: task.reminderTime || null,
                    group_type: group_type,
                    custom_group_id: custom_group_id,
                    custom_group_name: task.custom_group_name || '',
                    isDeleted: task.isDeleted || 0
                });
            });

            // 更新控制器的任务列表
            this.controller.todos = allTasks;
            this.controller.filteredTodos = [...allTasks];

            // 保存分组数据
            this.controller.defaultGroups = defaultGroups;
            this.controller.customGroups = customGroups;

            // console.log('待办数据加载成功:', allTasks.length, '条记录');
            return allTasks;
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
        // 返回用户提供的新数据结构
        const data = {
            "code": 200,
            "msg": "success",
            "data": {
                "defaultGroups": [
                    {
                        "groupName": "待处理",
                        "statusList": [0, 1],
                        "taskCount": 3,
                        "tasks": [
                            {
                                "id": 2,
                                "userId": 1,
                                "title": "刷10道LeetCode中等难度算法题",
                                "description": "主题：回溯算法，做完后整理解题思路并上传至笔记平台",
                                "tags": "学习,中优先级,算法,回溯",
                                "deadline": "2025-12-12T21:00:00",
                                "priority": 2,
                                "status": 1,
                                "group_type": 0,
                                "custom_group_id": null,
                                "createdAt": "2025-12-09T19:00:00",
                                "updatedAt": "2025-12-11T15:45:00",
                                "completedAt": null,
                                "reminderTime": "2025-12-12T19:00:00",
                                "isDeleted": 1
                            },
                            {
                                "id": 3,
                                "userId": 1,
                                "title": "采购周末露营装备",
                                "description": "购买帐篷防潮垫、便携炊具、饮用水，备注：选择轻量化款式",
                                "tags": "生活,低优先级,露营,周末",
                                "deadline": "2025-12-13T10:00:00",
                                "priority": 1,
                                "status": 0,
                                "group_type": 0,
                                "custom_group_id": null,
                                "createdAt": "2025-12-11T10:15:00",
                                "updatedAt": "2025-12-11T10:15:00",
                                "completedAt": null,
                                "reminderTime": "2025-12-12T18:00:00",
                                "isDeleted": 0
                            },
                            {
                                "id": 4,
                                "userId": 1,
                                "title": "给父母预约体检套餐",
                                "description": "选择中老年全面体检套餐，预约12月20日上午的体检时间",
                                "tags": "家庭,中优先级,体检,亲情",
                                "deadline": "2025-12-15T17:00:00",
                                "priority": 2,
                                "status": 1,
                                "group_type": 0,
                                "custom_group_id": null,
                                "createdAt": "2025-12-10T14:00:00",
                                "updatedAt": "2025-12-11T11:30:00",
                                "completedAt": null,
                                "reminderTime": "2025-12-14T16:00:00",
                                "isDeleted": 0
                            }
                        ]
                    },
                    {
                        "groupName": "已完成",
                        "statusList": [2],
                        "taskCount": 2,
                        "tasks": [
                            {
                                "id": 6,
                                "userId": 1,
                                "title": "更换家用净水器滤芯",
                                "description": "更换前置+后置滤芯，记录更换时间（下次更换周期6个月）",
                                "tags": "家庭,中优先级,居家,维护",
                                "deadline": "2025-12-10T16:00:00",
                                "priority": 2,
                                "status": 2,
                                "group_type": 0,
                                "custom_group_id": null,
                                "createdAt": "2025-12-09T14:00:00",
                                "updatedAt": "2025-12-10T15:30:00",
                                "completedAt": "2025-12-10T15:30:00",
                                "reminderTime": "2025-12-10T14:00:00",
                                "isDeleted": 1
                            },
                            {
                                "id": 7,
                                "userId": 1,
                                "title": "给好友选生日礼物",
                                "description": "预算500元内，选实用型礼物（保温杯/无线耳机），下单并备注贺卡",
                                "tags": "社交,低优先级,礼物,友情",
                                "deadline": "2025-12-08T20:00:00",
                                "priority": 1,
                                "status": 2,
                                "group_type": 0,
                                "custom_group_id": null,
                                "createdAt": "2025-12-07T16:00:00",
                                "updatedAt": "2025-12-08T19:20:00",
                                "completedAt": "2025-12-08T19:20:00",
                                "reminderTime": "2025-12-08T16:00:00",
                                "isDeleted": 0
                            }
                        ]
                    },
                    {
                        "groupName": "已取消",
                        "statusList": [3],
                        "taskCount": 1,
                        "tasks": [
                            {
                                "id": 8,
                                "userId": 1,
                                "title": "参加项目临时评审会",
                                "description": "准备项目进度PPT，汇报本周开发成果及下周计划",
                                "tags": "工作,中优先级,会议,项目",
                                "deadline": "2025-12-11T16:00:00",
                                "priority": 2,
                                "status": 3,
                                "group_type": 0,
                                "custom_group_id": null,
                                "createdAt": "2025-12-10T17:00:00",
                                "updatedAt": "2025-12-11T10:00:00",
                                "completedAt": null,
                                "reminderTime": "2025-12-11T15:00:00",
                                "isDeleted": 0
                            }
                        ]
                    }
                ],
                "customGroups": [
                    {
                        "groupId": 1,
                        "groupName": "项目A任务",
                        "sort": 1,
                        "taskCount": 2,
                        "tasks": [
                            {
                                "id": 1,
                                "userId": 1,
                                "title": "完成Q4季度工作总结报告",
                                "description": "整理本季度核心工作成果、问题及下季度计划，需包含数据图表",
                                "tags": "工作,高优先级,总结",
                                "deadline": "2025-12-11T18:00:00",
                                "priority": 3,
                                "status": 0,
                                "group_type": 1,
                                "custom_group_id": 1,
                                "custom_group_name": "项目A任务",
                                "createdAt": "2025-12-10T09:00:00",
                                "updatedAt": "2025-12-10T09:00:00",
                                "completedAt": null,
                                "reminderTime": "2025-12-11T10:00:00",
                                "isDeleted": 0
                            },
                            {
                                "id": 5,
                                "userId": 1,
                                "title": "验证V2.3版本新功能上线",
                                "description": "核心功能：用户权限模块，验证3个核心接口的兼容性，无BUG后提交上线报告",
                                "tags": "工作,高优先级,版本上线",
                                "deadline": "2025-12-11T17:00:00",
                                "priority": 3,
                                "status": 2,
                                "group_type": 1,
                                "custom_group_id": 1,
                                "custom_group_name": "项目A任务",
                                "createdAt": "2025-12-10T08:30:00",
                                "updatedAt": "2025-12-11T15:20:00",
                                "completedAt": "2025-12-11T15:20:00",
                                "reminderTime": "2025-12-11T09:00:00",
                                "isDeleted": 0
                            }
                        ]
                    },
                    {
                        "groupId": 2,
                        "groupName": "我的重点任务",
                        "sort": 2,
                        "taskCount": 1,
                        "tasks": [
                            {
                                "id": 9,
                                "userId": 1,
                                "title": "每日30分钟有氧运动",
                                "description": "选择跳绳或慢跑，完成30分钟有氧训练，记录心率数据",
                                "tags": "健康,中优先级,运动,健身",
                                "deadline": "2025-12-11T20:00:00",
                                "priority": 2,
                                "status": 1,
                                "group_type": 1,
                                "custom_group_id": 2,
                                "custom_group_name": "我的重点任务",
                                "createdAt": "2025-12-11T07:00:00",
                                "updatedAt": "2025-12-11T18:00:00",
                                "completedAt": null,
                                "reminderTime": "2025-12-11T19:00:00",
                                "isDeleted": 0
                            }
                        ]
                    }
                ]
            }
        };

        return Promise.resolve(data);
    }
}

// 主控制器 - 协调各个模块
class TodoPageController {
    constructor() {
        // 数据状态
        this.todos = [];
        this.filteredTodos = [];
        this.currentUser = null;

        // 分组数据
        this.defaultGroups = [];
        this.customGroups = [];

        // 列数据
        this.columns = [];

        // 筛选条件
        this.filters = {
            status: 'all',
            priority: 'all',
            search: ''
        };

        // 初始化各个模块
        this.initModules();

        // 初始化各种弹窗
        this.initConfirmModal();
        this.initRecycleBinModal();
        this.initDetailModal();
        this.initAddColumnModal();
    }

    /**
     * 初始化添加列弹窗
     */
    initAddColumnModal() {
        // 获取添加列弹窗元素
        this.addColumnModal = document.getElementById('addColumnModal');
        this.addColumnModalClose = document.getElementById('addColumnModalClose');
        this.addColumnCancelBtn = document.getElementById('addColumnCancelBtn');
        this.addColumnSaveBtn = document.getElementById('addColumnSaveBtn');
        this.columnNameInput = document.getElementById('columnName');
        this.addColumnForm = document.getElementById('addColumnForm');

        // 绑定事件
        this.addColumnModalClose.addEventListener('click', () => this.hideAddColumnModal());
        this.addColumnCancelBtn.addEventListener('click', () => this.hideAddColumnModal());
        this.addColumnSaveBtn.addEventListener('click', () => this.saveNewColumn());

        // 点击遮罩层关闭弹窗
        this.overlay.addEventListener('click', (e) => {
            if (this.addColumnModal.classList.contains('show') && e.target === this.overlay) {
                this.hideAddColumnModal();
            }
        });
    }

    /**
     * 显示添加列弹窗
     */
    showAddColumnModal() {
        this.addColumnForm.reset();
        this.addColumnModal.classList.add('show');
        this.overlay.classList.add('show');

        // 聚焦到输入框
        this.columnNameInput.focus();
    }

    /**
     * 隐藏添加列弹窗
     */
    hideAddColumnModal() {
        this.addColumnModal.classList.remove('show');
        this.overlay.classList.remove('show');
    }

    /**
     * 初始化确认弹窗
     */
    initConfirmModal() {
        // 获取确认弹窗元素
        this.confirmModal = document.getElementById('confirmModal');
        this.confirmTitle = document.getElementById('confirmTitle');
        this.confirmMessage = document.getElementById('confirmMessage');
        this.confirmOk = document.getElementById('confirmOk');
        this.confirmCancel = document.getElementById('confirmCancel');
        this.confirmClose = document.getElementById('confirmClose');
        this.overlay = document.getElementById('overlay');

        // 确认回调函数
        this.confirmCallback = null;

        // 绑定事件
        this.confirmOk.addEventListener('click', () => this.handleConfirmOk());
        this.confirmCancel.addEventListener('click', () => this.handleConfirmCancel());
        this.confirmClose.addEventListener('click', () => this.handleConfirmCancel());
        this.overlay.addEventListener('click', () => this.handleConfirmCancel());
    }

    /**
     * 初始化回收箱弹窗
     */
    initRecycleBinModal() {
        // 获取回收箱弹窗元素
        this.recycleBinModal = document.getElementById('recycleBinModal');
        this.recycleBinClose = document.getElementById('recycleBinClose');
        this.recycleBinCloseBtn = document.getElementById('recycleBinCloseBtn');
        this.recycleBinContent = document.getElementById('recycleBinContent');
        this.recycleBinBtn = document.getElementById('recycleBinBtn');

        // 绑定事件
        if (this.recycleBinBtn) {
            this.recycleBinBtn.addEventListener('click', () => this.showRecycleBin());
        }

        if (this.recycleBinClose) {
            this.recycleBinClose.addEventListener('click', () => this.hideRecycleBin());
        }

        if (this.recycleBinCloseBtn) {
            this.recycleBinCloseBtn.addEventListener('click', () => this.hideRecycleBin());
        }

        // 点击遮罩层关闭弹窗
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.hideRecycleBin();
            }
        });
    }

    /**
     * 初始化详情弹窗
     */
    initDetailModal() {
        // 获取详情弹窗元素
        this.detailModal = document.getElementById('todoDetailModal');
        this.detailModalTitle = document.getElementById('detailModalTitle');
        this.detailModalClose = document.getElementById('detailModalClose');
        this.detailCancelBtn = document.getElementById('detailCancelBtn');
        this.detailSaveBtn = document.getElementById('detailSaveBtn');

        // 详情表单元素
        this.detailForm = document.getElementById('detailForm');
        this.detailTodoId = document.getElementById('detailTodoId');
        this.detailTitle = document.getElementById('detailTitle');
        this.detailDescription = document.getElementById('detailDescription');
        this.detailPriority = document.getElementById('detailPriority');
        this.detailCategory = document.getElementById('detailCategory');
        this.detailDueDate = document.getElementById('detailDueDate');
        this.detailStatus = document.getElementById('detailStatus');
        this.detailTags = document.getElementById('detailTags');
        this.detailCreatedAt = document.getElementById('detailCreatedAt');
        this.detailUpdatedAt = document.getElementById('detailUpdatedAt');

        // 未保存提示弹窗元素
        this.unsavedModal = document.getElementById('unsavedConfirmModal');
        this.unsavedClose = document.getElementById('unsavedClose');
        this.unsavedCancelBtn = document.getElementById('unsavedCancelBtn');
        this.unsavedConfirmBtn = document.getElementById('unsavedConfirmBtn');

        // 保存原始数据，用于检测修改
        this.originalTodoData = null;

        // 绑定事件
        this.detailModalClose.addEventListener('click', () => this.handleDetailModalClose());
        this.detailCancelBtn.addEventListener('click', () => this.handleDetailModalClose());
        this.detailSaveBtn.addEventListener('click', () => this.saveTodoDetail());

        // 绑定未保存提示弹窗事件
        this.unsavedClose.addEventListener('click', () => this.handleUnsavedCancel());
        this.unsavedCancelBtn.addEventListener('click', () => this.handleUnsavedCancel());
        this.unsavedConfirmBtn.addEventListener('click', async () => {
            await this.saveTodoDetail();
            this.hideUnsavedModal();
            this.hideDetailModal();
        });

        // 表单输入事件，检测修改
        this.detailForm.addEventListener('input', () => this.detectChanges());
        this.detailForm.addEventListener('change', () => this.detectChanges());

        // 绑定todo-item点击事件，使用事件委托
        document.addEventListener('click', (e) => {
            // 检查点击的元素是否是todo-item，且不是点击的操作按钮或复选框
            const todoItem = e.target.closest('.todo-item');
            const actionBtn = e.target.closest('.action-btn');
            const todoCheckbox = e.target.closest('.todo-checkbox');

            if (todoItem && !actionBtn && !todoCheckbox) {
                const todoId = parseInt(todoItem.dataset.id);
                this.showTodoDetail(todoId);
            }
        });
    }

    /**
     * 字段值转换映射
     */
    getFieldTranslations() {
        return {
            priority: {
                low: '低',
                medium: '中',
                high: '高'
            },
            status: {
                0: '未开始',
                1: '进行中',
                2: '已完成',
                3: '已取消'
            }
        };
    }

    /**
     * 格式化时间为"年月日时分秒"格式
     * @param {string} dateString - 时间字符串
     * @returns {string} - 格式化后的时间字符串
     */
    formatDateTime(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${year}${month}${day}${hours}${minutes}${seconds}`;
    }

    /**
     * 生成标签选项
     */
    generateTagOptions() {
        // 自定义标签选项组
        const customTags = ['工作', '生活', '家庭', '学习', '健康', '社交'];

        // 生成选项HTML
        const tagSelect = this.detailTags;
        tagSelect.innerHTML = '';

        // 添加空选项
        const emptyOption = document.createElement('option');
        emptyOption.value = '';
        emptyOption.textContent = '请选择标签';
        tagSelect.appendChild(emptyOption);

        // 添加自定义标签选项
        customTags.forEach(tag => {
            const option = document.createElement('option');
            option.value = tag;
            option.textContent = tag;
            tagSelect.appendChild(option);
        });
    }

    /**
     * 显示待办详情
     * @param {number} todoId - 待办ID
     */
    showTodoDetail(todoId) {
        const todo = this.todos.find(t => t.id === todoId);
        if (!todo) {
            console.error('待办不存在:', todoId);
            return;
        }

        // 保存原始数据，用于检测修改
        this.originalTodoData = JSON.parse(JSON.stringify(todo));

        // 处理标签：只保留第一个标签作为原始标签，用于后续比较
        const todoTag = todo.tags ? todo.tags.split(',')[0].trim() : '';
        this.originalTodoData.tags = todoTag;

        // 填充表单数据
        this.detailTodoId.value = todo.id;
        this.detailTitle.value = todo.title;
        this.detailDescription.value = todo.description || '';
        this.detailPriority.value = todo.priority;
        this.detailCategory.value = todo.category || '';
        this.detailDueDate.value = todo.dueDate || '';
        this.detailStatus.value = todo.status;

        // 生成标签选项
        this.generateTagOptions();

        // 设置选中的标签（只处理单个标签）
        const tagSelect = this.detailTags;
        tagSelect.value = todoTag;

        // 显示弹窗
        this.detailModal.classList.add('show');
        this.overlay.classList.add('show');
    }

    /**
     * 隐藏详情弹窗
     */
    hideDetailModal() {
        this.detailModal.classList.remove('show');
        this.overlay.classList.remove('show');

        // 重置表单
        this.detailForm.reset();
        this.originalTodoData = null;
    }

    /**
     * 处理详情弹窗关闭
     */
    handleDetailModalClose() {
        // 检测是否有未保存的修改
        if (this.hasChanges()) {
            // 显示未保存提示
            this.showUnsavedModal();
        } else {
            // 直接关闭弹窗
            this.hideDetailModal();
        }
    }

    /**
     * 显示未保存提示弹窗
     */
    showUnsavedModal() {
        this.unsavedModal.classList.add('show');
        // 不需要再次显示遮罩层，因为详情弹窗已经显示了遮罩层
    }

    /**
     * 处理未保存提示中的取消按钮
     */
    handleUnsavedCancel() {
        // 直接关闭详情弹窗，不保存修改
        this.hideUnsavedModal();
        this.hideDetailModal();
    }

    /**
     * 隐藏未保存提示弹窗
     */
    hideUnsavedModal() {
        this.unsavedModal.classList.remove('show');
    }

    /**
     * 检测表单是否有修改
     */
    detectChanges() {
        if (!this.originalTodoData) return;

        // 可以在这里添加视觉提示，比如改变保存按钮的样式
        if (this.hasChanges()) {
            this.detailSaveBtn.classList.add('changed');
        } else {
            this.detailSaveBtn.classList.remove('changed');
        }
    }

    /**
     * 检查表单是否有修改
     * @returns {boolean} - 是否有修改
     */
    hasChanges() {
        if (!this.originalTodoData) return false;

        // 获取当前选中的单个标签
        const currentTags = this.detailTags.value.trim();

        return this.detailTitle.value !== this.originalTodoData.title ||
            this.detailDescription.value !== this.originalTodoData.description ||
            this.detailPriority.value !== this.originalTodoData.priority ||
            this.detailCategory.value !== this.originalTodoData.category ||
            this.detailDueDate.value !== this.originalTodoData.dueDate ||
            parseInt(this.detailStatus.value) !== this.originalTodoData.status ||
            currentTags !== this.originalTodoData.tags;
    }

    /**
     * 保存待办详情
     */
    async saveTodoDetail() {
        try {
            const todoId = parseInt(this.detailTodoId.value);

            // 获取选中的单个标签
            const selectedTags = this.detailTags.value.trim();

            // 构建更新数据
            const updatedData = {
                title: this.detailTitle.value.trim(),
                description: this.detailDescription.value.trim(),
                priority: this.detailPriority.value,
                category: this.detailCategory.value.trim(),
                dueDate: this.detailDueDate.value,
                status: parseInt(this.detailStatus.value),
                tags: selectedTags,
                updatedAt: new Date().toISOString()
            };

            // 调用API保存修改
            const userId = this.currentUser?.id || 0;

            // 构建请求数据
            const requestData = {
                userid: userId,
                id: todoId,
                ...updatedData
            };

            // 实际项目中应该调用真实API
            console.log('调用更新待办API，请求数据:', requestData);

            // 模拟API调用成功
            const response = {
                success: true,
                message: '待办更新成功'
            };

            if (response.success) {
                // 更新本地数据
                this.todos = this.todos.map(todo => {
                    if (todo.id === todoId) {
                        return {
                            ...todo,
                            ...updatedData
                        };
                    }
                    return todo;
                });

                // 重新应用筛选并渲染
                this.applyFilters();

                // 关闭弹窗
                this.hideDetailModal();

                console.log('待办更新成功:', todoId);
            } else {
                console.error('待办更新失败:', response.message);
                alert(`待办更新失败: ${response.message}`);
            }
        } catch (error) {
            console.error('[saveTodoDetail] API调用失败，触发降级处理:', error);

            // 获取选中的单个标签
            const selectedTags = this.detailTags.value.trim();

            // 降级处理：直接更新本地数据
            const todoId = parseInt(this.detailTodoId.value);
            const updatedData = {
                title: this.detailTitle.value.trim(),
                description: this.detailDescription.value.trim(),
                priority: this.detailPriority.value,
                category: this.detailCategory.value.trim(),
                dueDate: this.detailDueDate.value,
                status: parseInt(this.detailStatus.value),
                tags: selectedTags,
                updatedAt: new Date().toISOString()
            };

            this.todos = this.todos.map(todo => {
                if (todo.id === todoId) {
                    return {
                        ...todo,
                        ...updatedData
                    };
                }
                return todo;
            });

            // 重新应用筛选并渲染
            this.applyFilters();

            // 关闭弹窗
            this.hideDetailModal();

            console.log('待办更新成功（降级处理）:', todoId);
        }
    }

    /**
     * 显示确认弹窗
     * @param {string} message - 确认消息
     * @param {string} title - 弹窗标题
     * @param {Function} callback - 确认回调函数
     */
    showConfirmModal(message, title = '确认操作', callback) {
        this.confirmMessage.textContent = message;
        this.confirmTitle.textContent = title;
        this.confirmCallback = callback;

        this.confirmModal.classList.add('show');
        this.overlay.classList.add('show');
    }

    /**
     * 隐藏确认弹窗
     */
    hideConfirmModal() {
        this.confirmModal.classList.remove('show');
        this.overlay.classList.remove('show');
        this.confirmCallback = null;
    }

    /**
     * 处理确认按钮点击
     */
    handleConfirmOk() {
        if (this.confirmCallback) {
            this.confirmCallback(true);
        }
        this.hideConfirmModal();
    }

    /**
     * 处理取消按钮点击
     */
    handleConfirmCancel() {
        if (this.confirmCallback) {
            this.confirmCallback(false);
        }
        this.hideConfirmModal();
    }

    /**
     * 显示回收箱
     */
    showRecycleBin() {
        // 渲染回收箱内容
        this.renderRecycleBin();

        // 显示弹窗
        this.recycleBinModal.classList.add('show');
        this.overlay.classList.add('show');
    }

    /**
     * 隐藏回收箱
     */
    hideRecycleBin() {
        this.recycleBinModal.classList.remove('show');
        this.overlay.classList.remove('show');
    }

    /**
     * 渲染回收箱内容
     */
    renderRecycleBin() {
        const deletedTodos = this.todos.filter(todo => todo.isDeleted === 1);

        if (deletedTodos.length === 0) {
            this.recycleBinContent.innerHTML = '<div class="empty-state"><p>回收箱为空</p></div>';
            return;
        }

        const html = `
            <ul class="deleted-todo-list">
                ${deletedTodos.map(todo => `
                    <li class="deleted-todo-item">
                        <span class="deleted-todo-title">${todo.title}</span>
                        <button class="restore-btn" onclick="todoPageController.restoreTodo(${todo.id})">
                            <i class="fas fa-undo"></i> 恢复
                        </button>
                    </li>
                `).join('')}
            </ul>
        `;

        this.recycleBinContent.innerHTML = html;
    }

    /**
     * 恢复任务
     * @param {number} todoId - 待恢复的任务ID
     */
    restoreTodo(todoId) {
        const todo = this.todos.find(t => t.id === todoId);
        if (!todo) {
            console.error('任务不存在:', todoId);
            return;
        }

        // 显示确认弹窗
        const confirmMessage = `是否将「${todo.title}」恢复到待办？`;
        this.showConfirmModal(confirmMessage, '恢复任务', async (result) => {
            if (result) {
                try {
                    // 调用API恢复任务
                    const userId = this.currentUser?.id || 0;
                    const requestData = {
                        userid: userId,
                        id: todo.id,
                        isDeleted: 0
                    };

                    // 实际项目中应该调用真实API
                    console.log('调用恢复任务API，请求数据:', requestData);

                    // 模拟API调用成功
                    const response = {
                        success: true,
                        message: '任务恢复成功'
                    };

                    if (response.success) {
                        // 更新本地数据
                        todo.isDeleted = 0;
                        todo.updatedAt = new Date().toISOString();

                        // 重新应用筛选条件，根据判定逻辑分配到对应的分组中
                        this.applyFilters();

                        // 重新渲染回收箱
                        this.renderRecycleBin();

                        console.log(`任务 ${todo.id} 已恢复`);
                    } else {
                        console.error('任务恢复失败:', response.message);
                        alert(`任务恢复失败: ${response.message}`);
                    }
                } catch (error) {
                    console.error('[restoreTodo] API调用失败，触发降级处理:', error);

                    // 降级处理：直接更新本地数据
                    todo.isDeleted = 0;
                    todo.updatedAt = new Date().toISOString();

                    // 重新应用筛选条件
                    this.applyFilters();

                    // 重新渲染回收箱
                    this.renderRecycleBin();

                    console.log(`[restoreTodo] 任务 ${todo.id} 已恢复（降级处理）`);
                }
            }
        });
    }

    /**
     * 初始化各个模块
     */
    initModules() {
        this.dataLoader = new DataLoader(this);
        this.modalManager = new ModalManager(this);
    }

    /**
     * 初始化页面
     */
    async init() {
        try {
            // 显示列表加载遮罩
            this.showTodoListLoading();

            // 模拟加载延迟
            await this.dataLoader.simulateLoading();

            // 加载数据
            await this.dataLoader.loadUserInfo();
            await this.dataLoader.loadTodos();

            // 从分组数据生成列
            this.generateColumnsFromGroups();

            // 先渲染列，确保DOM中有column-content元素
            this.renderColumns();

            // 然后应用筛选条件，渲染任务
            this.applyFilters();

            // 绑定列相关事件
            this.bindColumnEvents();

            // 隐藏全局加载遮罩
            this.dataLoader.hideLoadingOverlay();

            // 延迟隐藏列表加载遮罩，并显示列表内容（丝滑过渡）
            setTimeout(() => {
                this.hideTodoListLoading();
                this.showTodoColumns();
            }, 300);

            // console.log('待办管理页面初始化完成');
        } catch (error) {
            console.error('初始化失败:', error);
            this.hideTodoListLoading();
            throw error;
        }
    }

    /**
     * 显示待办列表加载遮罩
     */
    showTodoListLoading() {
        const loadingElement = document.getElementById('todoListLoading');
        const columnsElement = document.getElementById('todoColumns');

        if (loadingElement) {
            loadingElement.classList.remove('hidden');
        }

        if (columnsElement) {
            columnsElement.classList.remove('loaded');
        }
    }

    /**
     * 隐藏待办列表加载遮罩
     */
    hideTodoListLoading() {
        const loadingElement = document.getElementById('todoListLoading');

        if (loadingElement) {
            loadingElement.classList.add('hidden');
        }
    }

    /**
     * 显示待办列表内容（带过渡动画）
     */
    showTodoColumns() {
        const columnsElement = document.getElementById('todoColumns');

        if (columnsElement) {
            // 使用requestAnimationFrame确保过渡动画生效
            requestAnimationFrame(() => {
                columnsElement.classList.add('loaded');
            });
        }
    }

    /**
     * 待办项飞行动画
     * @param {number} todoId - 待办ID
     * @param {string} fromColumnId - 源列ID
     * @param {string} toColumnId - 目标列ID
     */
    async animateTodoFlight(todoId, fromColumnId, toColumnId) {
        const todoElement = document.querySelector(`.todo-item[data-id="${todoId}"]`);
        const targetColumn = document.querySelector(`.column-content[data-column-id="${toColumnId}"]`);

        if (!todoElement || !targetColumn) {
            console.warn('飞行动画：找不到待办元素或目标列');
            return;
        }

        // 1. 克隆待办元素用于飞行动画
        const flyingElement = todoElement.cloneNode(true);
        flyingElement.classList.remove('removing', 'adding', 'dragging');
        flyingElement.classList.add('todo-item-flying');

        // 2. 获取原始位置
        const startRect = todoElement.getBoundingClientRect();

        // 3. 设置飞行元素的初始位置
        flyingElement.style.position = 'fixed';
        flyingElement.style.left = `${startRect.left}px`;
        flyingElement.style.top = `${startRect.top}px`;
        flyingElement.style.width = `${startRect.width}px`;
        flyingElement.style.height = `${startRect.height}px`;

        // 4. 添加到body
        document.body.appendChild(flyingElement);

        // 5. 隐藏原始元素（不使用opacity，直接设置visibility以避免占位）
        todoElement.style.visibility = 'hidden';

        // 6. 高亮目标列
        targetColumn.classList.add('highlight-target');

        // 7. 等待一帧，确保初始样式生效
        await new Promise(resolve => requestAnimationFrame(resolve));

        // 8. 获取目标位置（目标列的中心位置）
        const targetRect = targetColumn.getBoundingClientRect();
        const targetX = targetRect.left + targetRect.width / 2 - startRect.width / 2;
        const targetY = targetRect.top + targetRect.height / 2 - startRect.height / 2;

        // 9. 开始飞行动画
        flyingElement.style.left = `${targetX}px`;
        flyingElement.style.top = `${targetY}px`;
        flyingElement.classList.add('arrived');

        // 10. 提前一点时间（在动画还未完全结束时）就开始准备新元素
        // 飞行动画是600ms，我们在400ms时就开始渲染新位置的元素
        await new Promise(resolve => setTimeout(resolve, 400));

        // 11. 此时可以返回，让调用方开始数据更新和渲染
        // 飞行元素会在后台继续完成剩余的动画

        // 12. 在后台继续完成动画清理工作
        setTimeout(() => {
            flyingElement.remove();
            targetColumn.classList.remove('highlight-target');
        }, 200); // 剩余200ms完成淡出
    }

    /**
     * 从分组数据生成列
     */
    generateColumnsFromGroups() {
        this.columns = [];

        // 生成默认分组列
        let order = 1;
        this.defaultGroups.forEach(group => {
            this.columns.push({
                id: `default-${group.statusList[0]}`,
                name: group.groupName,
                order: order++,
                isDefault: true,
                statusList: group.statusList
            });
        });

        // 生成自定义分组列
        this.customGroups.sort((a, b) => a.sort - b.sort).forEach(group => {
            this.columns.push({
                id: `custom-${group.groupId}`,
                name: group.groupName,
                order: order++,
                isDefault: false,
                groupId: group.groupId
            });
        });
    }

    /**
     * 绑定列相关事件
     */
    bindColumnEvents() {
        const addColumnBtn = document.getElementById('addColumnBtn');
        if (addColumnBtn) {
            addColumnBtn.addEventListener('click', () => this.addColumn());
        }

        // 事件委托处理列编辑、删除
        const todoColumns = document.getElementById('todoColumns');
        if (todoColumns) {
            todoColumns.addEventListener('click', (e) => {
                if (e.target.closest('.edit-column')) {
                    const columnElement = e.target.closest('.todo-column');
                    const columnId = columnElement.dataset.columnId;
                    this.editColumn(columnId);
                } else if (e.target.closest('.delete-column')) {
                    const columnElement = e.target.closest('.todo-column');
                    const columnId = columnElement.dataset.columnId;
                    this.deleteColumn(columnId);
                }
            });
        }
    }

    /**
     * 渲染列
     */
    renderColumns() {
        const columnsContainer = document.getElementById('todoColumns');
        if (!columnsContainer) return;

        columnsContainer.innerHTML = '';

        this.columns.sort((a, b) => a.order - b.order).forEach(column => {
            const columnElement = this.createColumnElement(column);
            columnsContainer.appendChild(columnElement);
        });

        this.updateColumnCounts();
    }

    /**
     * 创建列元素
     */
    createColumnElement(column) {
        const columnDiv = document.createElement('div');

        const columnIndex = this.columns.findIndex(c => c.id === column.id);
        const colorClass = `color-${(columnIndex % 6) + 1}`;
        columnDiv.className = `todo-column ${colorClass}`;
        columnDiv.dataset.columnId = column.id;
        columnDiv.dataset.columnName = column.name;

        const showEditDelete = !column.isDefault;

        columnDiv.innerHTML = `
            <div class="column-header">
                <h3>
                    ${column.name}
                    <span class="column-count" id="column-count-${column.id}">0</span>
                </h3>
                <div class="column-actions">
                    ${showEditDelete ? `
                        <button class="btn-icon edit-column" title="编辑列名"><i class="fas fa-edit"></i></button>
                        <button class="btn-icon delete-column" title="删除列"><i class="fas fa-trash"></i></button>
                    ` : ''}
                </div>
            </div>
            <div class="column-content" data-column-id="${column.id}" 
                 ondrop="todoPageController.handleDrop(event)" 
                 ondragover="todoPageController.allowDrop(event)" 
                 ondragenter="todoPageController.handleDragEnter(event)" 
                 ondragleave="todoPageController.handleDragLeave(event)">
            </div>
        `;

        return columnDiv;
    }

    /**
     * 按列渲染待办
     */
    renderTodosByColumn() {
        // 先收集需要渲染的数据，避免在渲染过程中触发重排
        const todosByColumn = this.filteredTodos.reduce((groups, todo) => {
            const columnId = todo.columnId || 1;
            if (!groups[columnId]) {
                groups[columnId] = [];
            }
            groups[columnId].push(todo);
            return groups;
        }, {});

        // 使用DocumentFragment批量操作，减少重排
        const fragments = {};

        Object.entries(todosByColumn).forEach(([columnId, columnTodos]) => {
            const fragment = document.createDocumentFragment();

            columnTodos.forEach((todo, index) => {
                const todoElement = this.createTodoElement(todo);

                // 检查是否是刚移动过来的任务
                if (this.justMovedTodoId && this.justMovedTodoId === todo.id) {
                    // 使用特殊的高亮动画
                    todoElement.classList.add('just-moved');

                    // 动画结束后移除标记
                    setTimeout(() => {
                        todoElement.classList.remove('just-moved');
                        this.justMovedTodoId = null;
                    }, 1500);
                } else {
                    // 普通的添加动画
                    todoElement.classList.add('adding');

                    setTimeout(() => {
                        todoElement.classList.remove('adding');
                    }, 350);
                }

                fragment.appendChild(todoElement);
            });

            fragments[columnId] = fragment;
        });

        // 批量更新DOM
        document.querySelectorAll('.column-content').forEach(content => {
            const columnId = content.dataset.columnId;
            content.innerHTML = '';

            if (fragments[columnId]) {
                content.appendChild(fragments[columnId]);
            }
        });

        this.checkEmptyColumns();
        this.updateColumnCounts();
    }

    /**
     * 更新列计数
     */
    updateColumnCounts() {
        const todosByColumn = this.todos.filter(todo => todo.isDeleted !== 1).reduce((groups, todo) => {
            const columnId = todo.columnId || 1;
            if (!groups[columnId]) {
                groups[columnId] = 0;
            }
            groups[columnId]++;
            return groups;
        }, {});

        this.columns.forEach(column => {
            const countElement = document.getElementById(`column-count-${column.id}`);
            if (countElement) {
                const oldCount = parseInt(countElement.textContent) || 0;
                const newCount = todosByColumn[column.id] || 0;

                // 只有当计数发生变化时才添加动画
                if (oldCount !== newCount) {
                    countElement.textContent = newCount;
                    countElement.classList.add('updating');

                    setTimeout(() => {
                        countElement.classList.remove('updating');
                    }, 300);
                }
            }
        });
    }

    /**
     * 创建待办元素
     */
    createTodoElement(todo) {
        const priorityIcon = {
            high: '<i class="fas fa-exclamation-circle"></i>',
            medium: '<i class="fas fa-exclamation-triangle"></i>',
            low: '<i class="fas fa-info-circle"></i>'
        };

        const isCancelled = todo.status === STATUS.CANCELLED;

        const todoDiv = document.createElement('div');
        todoDiv.className = `todo-item ${todo.completed ? 'completed' : ''} ${isCancelled ? 'frozen' : ''}`;
        todoDiv.dataset.id = todo.id;
        todoDiv.draggable = true;
        todoDiv.ondragstart = (e) => this.handleDragStart(e, todo.id);
        if (todo.description) {
            todoDiv.title = todo.description;
        }

        const deleteButtonHTML = isCancelled ? '' : `
            <button class="action-btn delete delete-top-right" onclick="todoPageController.deleteTodo(${todo.id})" title="删除">
                <i class="fas fa-trash"></i>
            </button>
        `;

        const checkboxHTML = isCancelled ? '' : `
            <div class="todo-checkbox">
                <input type="checkbox" ${todo.completed ? 'checked' : ''} onchange="todoPageController.toggleTodoStatus(${todo.id})"></div>
        `;

        todoDiv.innerHTML = `
            ${checkboxHTML}
            <div class="todo-content">
                <div class="todo-title">${todo.title}</div>
                <div class="todo-meta">
                    ${todo.category ? `<span class="todo-category">${todo.category}</span>` : ''}
                    ${todo.dueDate ? `<span class="todo-due-date ${this.getDueDateColorClass(todo)}">${todo.dueDate}</span>` : ''}
                    <span class="todo-priority priority-${todo.priority}">
                        ${priorityIcon[todo.priority]} ${priorityIcon[todo.priority] === '<i class="fas fa-exclamation-circle"></i>' ? '高' : priorityIcon[todo.priority] === '<i class="fas fa-exclamation-triangle"></i>' ? '中' : '低'}
                    </span>
                    ${isCancelled ? '<span class="todo-status-cancelled">已取消</span>' : ''}
                </div>
            </div>
            ${deleteButtonHTML}
        `;

        return todoDiv;
    }

    /**
     * 检查空列并显示空状态
     */
    checkEmptyColumns() {
        document.querySelectorAll('.column-content').forEach(columnContent => {
            if (columnContent.children.length === 0) {
                columnContent.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-inbox"></i>
                        <h3>暂无待办事项</h3>
                        <p>拖动待办项到这里或创建新待办</p>
                    </div>
                `;
            }
        });
    }


    /**
     * 添加列 - 显示添加列弹窗
     */
    addColumn() {
        this.showAddColumnModal();
    }

    /**
     * 保存新列
     */
    async saveNewColumn() {
        const columnName = this.columnNameInput.value.trim();

        if (!columnName) {
            alert('请输入列名');
            return;
        }

        try {
            // 构建API请求参数
            const userId = this.currentUser?.id || 1;
            const requestData = {
                userid: userId,
                group_name: columnName
            };

            // 调用API
            const response = await this.addColumnAPI(requestData);

            if (response.success) {
                const newColumn = {
                    id: response.data.id || Date.now(),
                    name: columnName,
                    order: this.columns.length + 1
                };

                this.columns.push(newColumn);
                this.renderColumns();
                this.renderTodosByColumn();
                this.bindColumnEvents();
                this.hideAddColumnModal();
                console.log('列添加成功:', newColumn);
            } else {
                console.error('列添加失败:', response.message);
                alert(`列添加失败: ${response.message}`);
            }
        } catch (error) {
            console.error('[addColumn] API调用失败，触发降级处理:', error);

            const newColumn = {
                id: Date.now(),
                name: columnName,
                order: this.columns.length + 1
            };

            this.columns.push(newColumn);
            this.renderColumns();
            this.renderTodosByColumn();
            this.bindColumnEvents();
            this.hideAddColumnModal();
            console.log('[addColumn] 列添加成功（降级处理）:', newColumn);
        }
    }

    /**
     * 添加列API调用（模拟）
     * @param {Object} data - 请求数据
     * @returns {Promise<Object>} - API响应
     */
    async addColumnAPI(data) {
        await new Promise(resolve => setTimeout(resolve, 500));

        return {
            success: true,
            data: {
                id: Date.now(),
                group_name: data.group_name,
                userid: data.userid,
                created_at: new Date().toISOString()
            },
            message: '列添加成功'
        };
    }

    /**
     * 编辑列
     * @param {number} columnId - 列ID
     */
    editColumn(columnId) {
        const column = this.columns.find(col => col.id === columnId);
        if (column) {
            const newName = prompt('请输入新的列名：', column.name);
            if (newName && newName.trim() && newName.trim() !== column.name) {
                column.name = newName.trim();
                this.renderColumns();
                this.renderTodosByColumn();
                this.bindColumnEvents();

                console.log('列更新成功:', column);
            }
        }
    }

    /**
     * 删除列
     * @param {number} columnId - 列ID
     */
    deleteColumn(columnId) {
        const column = this.columns.find(col => col.id === columnId);
        if (!column) {
            console.error('列不存在:', columnId);
            return;
        }

        // 检查是否是自定义分组
        if (!column.isDefault) {
            // 获取该分组中的所有任务
            const todosInGroup = this.todos.filter(todo =>
                todo.custom_group_id === column.groupId || todo.columnId === column.id
            );

            const taskCount = todosInGroup.length;

            // 显示自定义删除分组弹窗
            this.showDeleteGroupModal(column, taskCount);
            return;
        }

        // 弹出自定义确认对话框
        const confirmMessage = `确定要删除「${column.name}」分组吗？`;
        this.showConfirmModal(confirmMessage, '删除分组', (result) => {
            if (result) {
                // 执行默认分组删除逻辑
                this.columns = this.columns.filter(col => col.id !== columnId);
                this.renderColumns();
                this.renderTodosByColumn();
                this.bindColumnEvents();

                console.log('列删除成功:', columnId);
            }
            // 用户取消操作，不执行任何操作
        });
    }

    /**
     * 显示删除分组弹窗
     * @param {Object} column - 要删除的分组
     * @param {number} taskCount - 分组中的任务数量
     */
    showDeleteGroupModal(column, taskCount) {
        // 创建弹窗元素
        const modalElement = document.createElement('div');
        modalElement.className = 'delete-group-modal modal';

        // 获取可用的目标分组（除了当前要删除的分组）
        const availableGroups = this.columns.filter(col => col.id !== column.id && !col.isDefault);

        // 生成下拉框选项 - 使用group.groupId作为value，确保传递正确的groupId
        const selectOptions = availableGroups.map(group =>
            `<option value="${group.groupId}">${group.name}</option>`
        ).join('');

        modalElement.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>删除分组</h3>
                    <button class="modal-close" id="deleteGroupModalClose">&times;</button>
                </div>
                <div class="modal-body">
                    <p>你即将删除分组「${column.name}」，该分组下共有 ${taskCount} 个任务，请选择任务的处理方式：</p>
                    
                    <div class="task-handle-options">
                        <div class="radio-option">
                            <input type="radio" id="moveToDefault" name="taskHandleType" value="MOVE_TO_DEFAULT" checked>
                            <label for="moveToDefault">移回默认分组（系统自动按任务状态归入“待处理/已完成”分组）</label>
                        </div>
                        <div class="radio-option">
                            <input type="radio" id="moveToGroup" name="taskHandleType" value="MOVE_TO_GROUP">
                            <label for="moveToGroup">移到指定分组（需选择目标分组）</label>
                        </div>
                        <div class="radio-option">
                            <input type="radio" id="deleteTask" name="taskHandleType" value="DELETE_TASK">
                            <label for="deleteTask">删除任务（谨慎选择，任务将被永久删除）</label>
                        </div>
                    </div>
                    
                    <div class="target-group-select" style="display: none;">
                        <label for="targetGroup">目标分组：</label>
                        <select id="targetGroup" name="targetGroup">
                            ${selectOptions}
                        </select>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" id="deleteGroupCancel">取消</button>
                    <button class="btn-primary" id="deleteGroupConfirm">确认</button>
                </div>
            </div>
        `;

        // 将弹窗添加到页面
        document.body.appendChild(modalElement);

        // 显示弹窗 - 添加.show类
        modalElement.classList.add('show');

        // 显示遮罩层
        const overlay = document.getElementById('overlay');
        overlay.classList.add('show');

        // 绑定事件
        const closeBtn = modalElement.querySelector('#deleteGroupModalClose');
        const cancelBtn = modalElement.querySelector('#deleteGroupCancel');
        const confirmBtn = modalElement.querySelector('#deleteGroupConfirm');
        const radioOptions = modalElement.querySelectorAll('input[name="taskHandleType"]');
        const moveToGroupRadio = modalElement.querySelector('#moveToGroup');
        const targetGroupSelect = modalElement.querySelector('.target-group-select');
        const targetGroupSelectElement = modalElement.querySelector('#targetGroup');

        // 显示/隐藏目标分组选择 - 修复下拉框不隐藏的bug
        radioOptions.forEach(radio => {
            radio.addEventListener('change', () => {
                targetGroupSelect.style.display = moveToGroupRadio.checked ? 'block' : 'none';
            });
        });

        // 关闭弹窗
        const closeModal = () => {
            modalElement.remove();
            overlay.classList.remove('show');
        };

        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);

        // 点击遮罩层关闭弹窗
        overlay.addEventListener('click', closeModal);

        // 确认删除
        confirmBtn.addEventListener('click', async () => {
            // 获取选中的任务处理方式
            const taskHandleType = modalElement.querySelector('input[name="taskHandleType"]:checked').value;

            // 获取目标分组（如果选择了移到指定分组）
            let targetGroupId = null;
            if (taskHandleType === 'MOVE_TO_GROUP') {
                targetGroupId = targetGroupSelectElement.value;
            }

            try {
                // 调用API接口
                const userId = this.currentUser?.id || 0;
                const groupId = column.groupId;

                const requestData = {
                    user_id: userId,
                    taskHandleType: taskHandleType,
                    groupId: groupId
                };

                // 如果选择了移到指定分组，添加targetGroupId
                if (taskHandleType === 'MOVE_TO_GROUP') {
                    requestData.targetGroupId = targetGroupId;
                }

                // 实际项目中应该调用真实API
                // 这里使用模拟API调用
                console.log('调用删除分组API，请求数据:', requestData);

                // 模拟API调用成功
                const response = {
                    success: true,
                    message: '分组删除成功'
                };

                if (response.success) {
                    // 删除成功，更新本地数据
                    this.columns = this.columns.filter(col => col.id !== column.id);

                    // 根据任务处理方式更新任务
                    if (taskHandleType === 'MOVE_TO_DEFAULT') {
                        // 移回默认分组
                        this.todos.forEach(todo => {
                            if (todo.custom_group_id === column.groupId || todo.columnId === column.id) {
                                todo.group_type = GROUP_TYPE.DEFAULT;
                                todo.custom_group_id = null;
                                todo.custom_group_name = '';

                                // 根据status确定新的columnId
                                if (todo.status === STATUS.NOT_STARTED || todo.status === STATUS.IN_PROGRESS) {
                                    todo.columnId = 'default-0';
                                } else if (todo.status === STATUS.COMPLETED) {
                                    todo.columnId = 'default-2';
                                } else if (todo.status === STATUS.CANCELLED) {
                                    todo.columnId = 'default-3';
                                } else {
                                    todo.columnId = 'default-0';
                                }
                            }
                        });
                    } else if (taskHandleType === 'MOVE_TO_GROUP') {
                        // 移到指定分组
                        this.todos.forEach(todo => {
                            if (todo.custom_group_id === column.groupId || todo.columnId === column.id) {
                                todo.columnId = targetGroupId;

                                // 查找目标分组
                                const targetGroup = this.columns.find(col => col.id === targetGroupId);
                                if (targetGroup) {
                                    todo.group_type = GROUP_TYPE.CUSTOM;
                                    todo.custom_group_id = targetGroup.groupId;
                                    todo.custom_group_name = targetGroup.name;
                                }
                            }
                        });
                    } else if (taskHandleType === 'DELETE_TASK') {
                        // 删除任务
                        this.todos = this.todos.filter(todo =>
                            todo.custom_group_id !== column.groupId && todo.columnId !== column.id
                        );
                    }

                    // 重新渲染
                    this.renderColumns();
                    this.renderTodosByColumn();
                    this.bindColumnEvents();

                    console.log('分组删除成功:', column.name);
                } else {
                    console.error('分组删除失败:', response.message);
                    alert(`分组删除失败: ${response.message}`);
                }
            } catch (error) {
                console.error('[deleteColumn] API调用失败，触发降级处理:', error);

                // 降级处理：直接更新本地数据
                this.columns = this.columns.filter(col => col.id !== column.id);

                // 根据任务处理方式更新任务
                if (taskHandleType === 'MOVE_TO_DEFAULT') {
                    // 移回默认分组
                    this.todos.forEach(todo => {
                        if (todo.custom_group_id === column.groupId || todo.columnId === column.id) {
                            todo.group_type = GROUP_TYPE.DEFAULT;
                            todo.custom_group_id = null;
                            todo.custom_group_name = '';

                            // 根据status确定新的columnId
                            if (todo.status === STATUS.NOT_STARTED || todo.status === STATUS.IN_PROGRESS) {
                                todo.columnId = 'default-0';
                            } else if (todo.status === STATUS.COMPLETED) {
                                todo.columnId = 'default-2';
                            } else if (todo.status === STATUS.CANCELLED) {
                                todo.columnId = 'default-3';
                            } else {
                                todo.columnId = 'default-0';
                            }
                        }
                    });
                } else if (taskHandleType === 'MOVE_TO_GROUP') {
                    // 移到指定分组
                    this.todos.forEach(todo => {
                        if (todo.custom_group_id === column.groupId || todo.columnId === column.id) {
                            todo.columnId = targetGroupId;

                            // 查找目标分组
                            const targetGroup = this.columns.find(col => col.id === targetGroupId);
                            if (targetGroup) {
                                todo.group_type = GROUP_TYPE.CUSTOM;
                                todo.custom_group_id = targetGroup.groupId;
                                todo.custom_group_name = targetGroup.name;
                            }
                        }
                    });
                } else if (taskHandleType === 'DELETE_TASK') {
                    // 删除任务
                    this.todos = this.todos.filter(todo =>
                        todo.custom_group_id !== column.groupId && todo.columnId !== column.id
                    );
                }

                // 重新渲染
                this.renderColumns();
                this.renderTodosByColumn();
                this.bindColumnEvents();

                console.log('[deleteColumn] 分组删除成功（降级处理）:', column.name);
            }

            // 关闭弹窗
            closeModal();
        });
    }


    /**
     * 更新筛选条件
     * @param {Object} newFilters - 新的筛选条件
     */
    updateFilters(newFilters) {
        this.filters = {
            ...this.filters,
            ...newFilters
        };
    }

    /**
     * 更新搜索关键词
     * @param {string} searchTerm - 搜索关键词
     */
    updateSearch(searchTerm) {
        this.filters.search = searchTerm;
    }

    /**
     * 应用筛选
     */
    applyFilters() {
        this.filteredTodos = this.todos.filter(todo => {
            // 对于isDeleted为0或未定义的任务，都应该显示，只有isDeleted=1的任务才会被过滤掉
            const shouldShow = todo.isDeleted !== 1;

            // 状态筛选
            if (this.filters.status === 'completed' && !todo.completed) return false;
            if (this.filters.status === 'pending' && todo.completed) return false;

            // 优先级筛选
            if (this.filters.priority !== 'all' && todo.priority !== this.filters.priority) return false;

            // 搜索筛选
            if (this.filters.search) {
                const searchTerm = this.filters.search;
                return todo.title.toLowerCase().includes(searchTerm) ||
                    (todo.description && todo.description.toLowerCase().includes(searchTerm)) ||
                    (todo.category && todo.category.toLowerCase().includes(searchTerm));
            }

            return shouldShow;
        });

        // 渲染筛选后的待办列表
        this.renderTodosByColumn();

        // 保存到本地存储
        this.saveToLocalStorage();
    }

    /**
     * 保存数据到本地存储
     */
    saveToLocalStorage() {
        try {
            const dataToSave = {
                todos: this.todos,
                columns: this.columns,
                timestamp: new Date().toISOString()
            };
            saveToStorage(STORAGE_KEYS.TODOS, dataToSave);
        } catch (error) {
            console.error('保存数据到本地存储失败:', error);
        }
    }

    /**
     * 构建新待办数据
     * @param {Object} todoData - 待办数据
     * @returns {Object} - 构建好的待办数据
     */
    buildNewTodoData(todoData) {
        // 获取当前用户ID，默认为1
        const userId = this.currentUser?.id || 1;

        return {
            id: Date.now(),
            userid: userId,
            ...todoData,
            completed: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            // 默认添加到待处理列（第一个列）
            group_type: GROUP_TYPE.DEFAULT,
            custom_group_id: null,
            custom_group_name: '',
            status: STATUS.NOT_STARTED, // 默认状态为未开始
            columnId: 'default-0',
            // 确保tags和reminderTime字段存在
            tags: todoData.tags || `${todoData.category || ''},${todoData.priority}`.trim().replace(/^,|,$/g, ''),
            deadline: todoData.dueDate ? `${todoData.dueDate}T23:59:59` : '',
            reminderTime: todoData.reminderTime || null
        };
    }

    /**
     * 添加待办
     * @param {Object} todoData - 待办数据
     */
    async addTodo(todoData) {
        let newTodo;

        try {
            // 构建新待办数据，准备发送到服务器
            const tempTodo = this.buildNewTodoData(todoData);

            // 调用API保存待办，获取后端返回的真实数据
            const savedTodo = await this.saveTodoToServer(tempTodo);

            // 处理后端返回的数据，转换为前端需要的格式
            newTodo = this.processServerTodoData(savedTodo);

            console.log('待办添加成功:', newTodo);
        } catch (error) {
            console.error('[addTodo] API调用失败，触发降级处理:', error);

            // 降级处理：直接添加到本地数据
            newTodo = this.buildNewTodoData(todoData);

            console.log('[addTodo] 待办添加成功（降级处理）:', newTodo);
        } finally {
            // 更新本地数据并重新渲染
            this.todos.unshift(newTodo);
            this.applyFilters();

            // 发布事件
            eventBus.emit('todo:created', {todo: newTodo});
        }
    }

    /**
     * 处理服务器返回的待办数据，转换为前端需要的格式
     * @param {Object} serverTodo - 服务器返回的待办数据
     * @returns {Object} - 前端需要的待办数据格式
     */
    processServerTodoData(serverTodo) {
        // 从标签中提取第一个标签作为分类
        const category = serverTodo.tags ? serverTodo.tags.split(',')[0] : '';

        // 格式化日期
        const dueDate = serverTodo.deadline ? serverTodo.deadline.split('T')[0] : '';

        // 格式化提醒时间，移除秒数部分以适配datetime-local格式
        const reminderTime = serverTodo.reminderTime ? serverTodo.reminderTime.slice(0, 16) : '';

        // 初始渲染：任务归属的核心判定逻辑
        let group_type = serverTodo.group_type;
        let custom_group_id = serverTodo.custom_group_id;
        let columnId;

        // 场景1：group_type=0（默认分组）
        if (group_type === GROUP_TYPE.DEFAULT) {
            // 若custom_group_id不为null，属于后端异常数据，前端直接忽略该值
            custom_group_id = null;

            // 根据status确定归属的默认分组子分组
            if (serverTodo.status === STATUS.NOT_STARTED || serverTodo.status === STATUS.IN_PROGRESS) {
                // 未开始 / 进行中：归入默认分组的「待处理」子分组
                columnId = 'default-0';
            } else if (serverTodo.status === STATUS.COMPLETED) {
                // 已完成：归入默认分组的「已完成」子分组
                columnId = 'default-2';
            } else if (serverTodo.status === STATUS.CANCELLED) {
                // 已取消：归入默认分组的「已取消」子分组
                columnId = 'default-3';
            } else {
                // 异常status：归入默认分组的「待处理」子分组
                columnId = 'default-0';
                serverTodo.status = STATUS.NOT_STARTED;
            }
        }
        // 场景2：group_type=1（自定义分组）
        else if (group_type === GROUP_TYPE.CUSTOM) {
            // 若custom_group_id为null，属于异常数据，前端兜底归为「未分组」自定义分组
            if (!custom_group_id) {
                console.warn(`任务ID: ${serverTodo.id} 自定义分组ID为空，归为未分组`);
                columnId = 'custom-0'; // 未分组自定义分组
            } else {
                // 根据custom_group_id匹配对应的自定义分组
                columnId = `custom-${custom_group_id}`;
            }
        }
        // 场景3：异常数据兜底
        else {
            // 出现group_type非 0/1、group_type与custom_group_id不匹配等异常数据
            console.warn(`任务ID: ${serverTodo.id} 分组数据异常，group_type: ${group_type}, custom_group_id: ${custom_group_id}`);
            columnId = 'custom-999'; // 异常任务临时分组
            group_type = GROUP_TYPE.DEFAULT;
            custom_group_id = null;
            serverTodo.status = STATUS.NOT_STARTED;
        }

        // 转换优先级
        const priority = serverTodo.priority === 3 ? 'high' : serverTodo.priority === 2 ? 'medium' : 'low';

        return {
            id: serverTodo.id,
            userid: serverTodo.userid || 1,
            title: serverTodo.title || '',
            description: serverTodo.description || '',
            priority: priority,
            category: category,
            dueDate: dueDate,
            completed: serverTodo.status === STATUS.COMPLETED,
            createdAt: serverTodo.createdAt || new Date().toISOString(),
            updatedAt: serverTodo.updatedAt || new Date().toISOString(),
            columnId: columnId,
            tags: serverTodo.tags || '',
            deadline: serverTodo.deadline || '',
            status: serverTodo.status || STATUS.NOT_STARTED,
            completedAt: serverTodo.completedAt || null,
            reminderTime: reminderTime,
            group_type: group_type,
            custom_group_id: custom_group_id,
            custom_group_name: serverTodo.custom_group_name || ''
        };
    }

    /**
     * 更新待办
     * @param {number} id - 待办ID
     * @param {Object} todoData - 待办数据
     */
    async updateTodo(id, todoData) {
        const todo = this.todos.find(todo => todo.id === id);
        if (!todo) {
            console.error('待办不存在:', id);
            return;
        }

        try {
            // 调用API更新待办
            const updatedTodo = {
                ...todo,
                ...todoData,
                updatedAt: new Date().toISOString()
            };

            await this.saveTodoToServer(updatedTodo);

            // API成功后，更新本地数据并重新渲染
            this.todos = this.todos.map(t => {
                if (t.id === id) {
                    return updatedTodo;
                }
                return t;
            });
            
            this.applyFilters();

            // 发布事件
            eventBus.emit('todo:updated', {id, data: updatedTodo});

            console.log('待办更新成功:', updatedTodo);
        } catch (error) {
            console.error('[updateTodo] API调用失败，触发降级处理:', error);

            // 降级处理：直接更新本地数据
            this.todos = this.todos.map(t => {
                if (t.id === id) {
                    return {
                        ...t,
                        ...todoData,
                        updatedAt: new Date().toISOString()
                    };
                }
                return t;
            });

            this.applyFilters();

            console.log('[updateTodo] 待办更新成功（降级处理）:', id);
        }
    }

    /**
     * 删除待办 - 显示自定义删除弹窗
     * @param {number} id - 待办ID
     */
    deleteTodo(id) {
        const todo = this.todos.find(todo => todo.id === id);
        if (!todo) {
            console.error('待办不存在:', id);
            return;
        }

        // 创建删除弹窗
        this.showDeleteTaskModal(todo);
    }

    /**
     * 显示删除任务弹窗
     * @param {Object} todo - 待办数据
     */
    showDeleteTaskModal(todo) {
        // 创建弹窗元素
        const modalElement = document.createElement('div');
        modalElement.className = 'delete-task-modal modal';

        modalElement.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>删除任务</h3>
                    <button class="modal-close" id="deleteTaskModalClose">&times;</button>
                </div>
                <div class="modal-body">
                    <p>你即将删除任务「${todo.title}」，该操作将移除该任务的所有信息。</p>
                    
                    <div class="delete-options">
                        <div class="radio-option">
                            <input type="radio" id="directDelete" name="deleteType" value="DIRECTLY_DELETE" checked>
                            <label for="directDelete">直接删除（永久移除，无法恢复）【默认选中】</label>
                        </div>
                        <div class="radio-option">
                            <input type="radio" id="storageDelete" name="deleteType" value="STORAGE_DELETE">
                            <label for="storageDelete">移至回收站（保留7天，可恢复）</label>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" id="deleteTaskCancel">取消</button>
                    <button class="btn-danger" id="deleteTaskConfirm">确认删除</button>
                </div>
            </div>
        `;

        // 将弹窗添加到页面
        document.body.appendChild(modalElement);

        // 显示弹窗 - 添加.show类
        modalElement.classList.add('show');

        // 显示遮罩层
        const overlay = document.getElementById('overlay');
        overlay.classList.add('show');

        // 绑定事件
        const closeBtn = modalElement.querySelector('#deleteTaskModalClose');
        const cancelBtn = modalElement.querySelector('#deleteTaskCancel');
        const confirmBtn = modalElement.querySelector('#deleteTaskConfirm');

        // 关闭弹窗
        const closeModal = () => {
            modalElement.remove();
            overlay.classList.remove('show');
        };

        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);

        // 点击遮罩层关闭弹窗
        overlay.addEventListener('click', closeModal);

        // 确认删除
        confirmBtn.addEventListener('click', async () => {
            // 获取选中的删除类型
            const taskHandleType = modalElement.querySelector('input[name="deleteType"]:checked').value;

            try {
                // 调用新的API方法
                const userId = this.currentUser?.id || 0;

                // 构建请求数据
                const requestData = {
                    userid: userId,
                    id: todo.id,
                    taskHandleType: taskHandleType
                };

                // 实际项目中应该调用真实API
                console.log('调用删除任务API，请求数据:', requestData);

                // 模拟API调用成功
                const response = {
                    success: true,
                    message: '任务删除成功'
                };

                if (response.success) {
                    // 根据删除类型执行本地逻辑
                    if (taskHandleType === 'DIRECTLY_DELETE') {
                        // 直接删除任务
                        this.todos = this.todos.filter(t => t.id !== todo.id);
                        this.applyFilters();
                        toast.success('待办已永久删除');
                        console.log(`待办 ${todo.id} 已直接删除`);
                    } else if (taskHandleType === 'STORAGE_DELETE') {
                        // 移至回收站 - 修改字段信息，但不会移动到已取消分组
                        this.todos = this.todos.map(t => {
                            if (t.id === todo.id) {
                                return {
                                    ...t,
                                    isDeleted: 1,
                                    deletedAt: new Date().toISOString(),
                                    updatedAt: new Date().toISOString()
                                };
                            }
                            return t;
                        });
                        this.applyFilters();
                        toast.success('待办已移至回收站，7天后自动清理');
                        console.log(`待办 ${todo.id} 已移至回收站`);
                    }

                    // 重新渲染
                    this.renderTodosByColumn();

                    // 发布删除事件
                    eventBus.emit('todo:deleted', {id: todo.id, type: taskHandleType});
                } else {
                    console.error('任务删除失败:', response.message);
                    toast.error(`任务删除失败: ${response.message}`);
                }
            } catch (error) {
                console.error('[deleteTodo] API调用失败，触发降级处理:', error);

                // 降级处理：直接执行本地逻辑
                if (taskHandleType === 'DIRECTLY_DELETE') {
                    // 直接删除任务
                    this.todos = this.todos.filter(t => t.id !== todo.id);
                } else if (taskHandleType === 'STORAGE_DELETE') {
                    // 移至回收站 - 修改字段信息，但不会移动到已取消分组
                    this.todos = this.todos.map(t => {
                        if (t.id === todo.id) {
                            return {
                                ...t,
                                isDeleted: 1,
                                deletedAt: new Date().toISOString(),
                                updatedAt: new Date().toISOString()
                            };
                        }
                        return t;
                    });
                }
                this.applyFilters();
                this.renderTodosByColumn();
                console.log(`[deleteTodo] 任务 ${todo.id} 删除成功（降级处理）`);
            }

            // 关闭弹窗
            closeModal();
        });
    }

    /**
     * 调用删除任务API
     * @param {number} userid - 用户ID
     * @param {number} id - 待办ID
     * @param {string} taskHandleType - 处理方法：DIRECTLY_DELETE, STORAGE_DELETE
     */
    async deleteTaskAPI(userid, id, taskHandleType) {
        try {
            // 构建要发送到服务器的数据
            const deleteData = {
                userid: userid,
                id: id,
                taskHandleType: taskHandleType
            };

            // 实际项目中应该调用真实API
            // 这里使用模拟API调用
            console.log('调用删除任务API，请求数据:', deleteData);

            // 模拟API调用成功
            const response = {
                success: true,
                message: '任务删除成功'
            };

            return response;
        } catch (error) {
            console.error('调用删除任务API失败:', error);
            throw error;
        }
    }

    /**
     * 切换待办状态
     * @param {number} id - 待办ID
     */
    async toggleTodoStatus(id) {
        const todo = this.todos.find(todo => todo.id === id);
        if (todo) {
            // 保存当前状态，用于后续判断
            const oldStatus = todo.status;
            const oldCompleted = todo.completed;
            const oldColumnId = todo.columnId;

            // 计算新状态
            const newCompleted = !oldCompleted;
            const newStatus = newCompleted ? STATUS.COMPLETED : STATUS.IN_PROGRESS;

            // 构建更新后的任务数据
            const updatedTodo = {
                ...todo,
                completed: newCompleted,
                status: newStatus,
                updatedAt: new Date().toISOString()
            };

            // 计算新的columnId
            if (updatedTodo.status === STATUS.CANCELLED) {
                updatedTodo.columnId = 'default-3';
            } else if (updatedTodo.group_type === GROUP_TYPE.DEFAULT) {
                let newColumnId;
                if (newStatus === STATUS.NOT_STARTED || newStatus === STATUS.IN_PROGRESS) {
                    newColumnId = 'default-0';
                } else if (newStatus === STATUS.COMPLETED) {
                    newColumnId = 'default-2';
                } else {
                    newColumnId = 'default-0';
                }

                updatedTodo.columnId = newColumnId;
            }

            // 如果列发生变化，添加飞行动画
            if (oldColumnId !== updatedTodo.columnId) {
                // 标记为刚移动的任务
                this.justMovedTodoId = id;
                await this.animateTodoFlight(id, oldColumnId, updatedTodo.columnId);
            }

            try {
                // 调用API保存修改后的todo信息
                await this.saveTodoToServer(updatedTodo);

                // API成功后，更新本地数据并重新渲染
                this.todos = this.todos.map(t => {
                    if (t.id === id) {
                        return updatedTodo;
                    }
                    return t;
                });

                this.applyFilters();

                console.log('待办状态更新:', updatedTodo);
            } catch (error) {
                console.error('[toggleTodoStatus] API调用失败，触发降级处理:', error);

                // 降级处理：直接更新本地数据
                this.todos = this.todos.map(t => {
                    if (t.id === id) {
                        return updatedTodo;
                    }
                    return t;
                });

                this.applyFilters();

                console.log('[toggleTodoStatus] 待办状态更新（降级处理）:', updatedTodo);
            }
        }
    }

    // 拖拽功能

    /**
     * 处理拖拽开始
     * @param {DragEvent} e - 拖拽事件
     * @param {number} todoId - 待办ID
     */
    handleDragStart(e, todoId) {
        e.dataTransfer.setData('text/plain', todoId.toString());
        e.target.classList.add('dragging');
    }

    /**
     * 允许放置
     * @param {DragEvent} e - 拖拽事件
     */
    allowDrop(e) {
        e.preventDefault();
    }

    /**
     * 处理拖拽进入
     * @param {DragEvent} e - 拖拽事件
     */
    handleDragEnter(e) {
        e.preventDefault();
        e.target.classList.add('drag-over');
    }

    /**
     * 处理拖拽离开
     * @param {DragEvent} e - 拖拽事件
     */
    handleDragLeave(e) {
        e.target.classList.remove('drag-over');
    }

    /**
     * 处理放置
     * @param {DragEvent} e - 拖拽事件
     */
    handleDrop(e) {
        e.preventDefault();
        e.target.classList.remove('drag-over');

        const todoId = parseInt(e.dataTransfer.getData('text/plain'));
        const columnElement = e.target.closest('.column-content');

        if (columnElement) {
            const columnId = columnElement.dataset.columnId; // 直接使用字符串格式的columnId
            this.moveTodoToColumn(todoId, columnId);
        }

        // 移除拖拽样式
        document.querySelectorAll('.todo-item.dragging').forEach(item => {
            item.classList.remove('dragging');
        });
    }

    /**
     * 将待办移动到指定列
     * @param {number} todoId - 待办ID
     * @param {string|number} columnId - 目标列ID
     */
    moveTodoToColumn(todoId, columnId) {
        const todo = this.todos.find(t => t.id === todoId);
        
        if (todo) {
            // 检查是否为已取消状态，并且目标列不是已取消列
            const isCancelled = todo.status === STATUS.CANCELLED;
            const isTargetCancelledColumn = typeof columnId === 'number' ?
                columnId === 3 :
                String(columnId).startsWith('default-3');

            // 检查是否是将任务拖到已取消列
            if (!isCancelled && isTargetCancelledColumn) {
                // 弹出自定义确认对话框
                const confirmMessage = '此操作将取消该任务，是否继续？';
                this.showConfirmModal(confirmMessage, '取消任务', (result) => {
                    if (result) {
                        // 用户确认操作，执行移动逻辑
                        this.executeTodoMove(todo, columnId, isCancelled);
                    }
                    // 用户取消操作，不执行任何操作
                });
                return; // 终止当前函数执行，等待用户确认
            }

            // 如果是已取消状态，并且目标列不是已取消列，弹出提醒
            if (isCancelled && !isTargetCancelledColumn) {
                // 获取目标分组名称
                let targetGroupName;
                if (typeof columnId === 'number') {
                    // 旧格式的列ID
                    if (columnId === 1) {
                        targetGroupName = '待处理';
                    } else if (columnId === 2) {
                        targetGroupName = '已完成';
                    }
                } else {
                    // 新格式的列ID
                    const columnIdStr = String(columnId);
                    if (columnIdStr.startsWith('default-')) {
                        if (columnIdStr === 'default-0') {
                            targetGroupName = '待处理';
                        } else if (columnIdStr === 'default-2') {
                            targetGroupName = '已完成';
                        }
                    } else if (columnIdStr.startsWith('custom-')) {
                        const customGroup = this.columns.find(col => col.id === columnIdStr);
                        targetGroupName = customGroup ? customGroup.name : '自定义分组';
                    }
                }

                // 弹出自定义确认对话框
                const confirmMessage = `此任务已被取消，是否要恢复到「${targetGroupName}」分组中？`;
                this.showConfirmModal(confirmMessage, '恢复任务', (result) => {
                    if (result) {
                        // 用户确认操作，执行移动逻辑
                        this.executeTodoMove(todo, columnId, isCancelled);
                    }
                    // 用户取消操作，不执行任何操作
                });
                return; // 终止当前函数执行，等待用户确认
            }

            // 正常状态任务的正常拖动，直接执行移动逻辑
            this.executeTodoMove(todo, columnId, isCancelled);

        } else {
            console.error('移动任务失败: 未找到待办项', {todoId});
        }
    }

    /**
     * 根据待办的截止日期返回对应的颜色类
     * @param {Object} todo - 待办数据
     * @returns {string} - 颜色类名
     */
    getDueDateColorClass(todo) {
        // status=3（已取消）或2（已完成）时不用判断
        if (todo.status === STATUS.CANCELLED || todo.status === STATUS.COMPLETED) {
            return '';
        }

        // 如果没有截止日期，返回空
        if (!todo.dueDate) {
            return '';
        }

        // 获取今天的日期（仅日期部分）
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // 获取待办的截止日期
        const dueDate = new Date(todo.dueDate);
        dueDate.setHours(0, 0, 0, 0);

        // 计算日期差（天数）
        const diffTime = dueDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // 根据日期差返回颜色类
        if (diffDays < 0) {
            // 逾期
            return 'overdue';
        } else if (diffDays === 0) {
            // 今天
            return 'today';
        } else if (diffDays === 1) {
            // 明天
            return 'tomorrow';
        } else {
            // 后面及以后
            return 'future';
        }
    }

    /**
     * 执行待办移动逻辑
     * @param {Object} todo - 待办数据
     * @param {string|number} columnId - 目标列ID
     * @param {boolean} isCancelled - 是否为已取消状态
     */
    async executeTodoMove(todo, columnId, isCancelled) {
        // 获取原始列ID
        const oldColumnId = todo.columnId;

        // 标记为刚移动的任务
        this.justMovedTodoId = todo.id;

        // 添加飞行动画
        await this.animateTodoFlight(todo.id, oldColumnId, columnId);

        // 构建更新后的任务数据
        const updatedTodo = {...todo};
        updatedTodo.updatedAt = new Date().toISOString();

        // 根据columnId直接判断是默认分组还是自定义分组
        if (typeof columnId === 'number') {
            // 旧格式的列ID（数字），兼容处理
            console.warn('使用了旧格式的列ID，建议更新为字符串格式');

            // 根据旧格式的列ID更新字段
            if (columnId === 1) {
                // 待处理列
                updatedTodo.group_type = GROUP_TYPE.DEFAULT;
                updatedTodo.custom_group_id = null;
                updatedTodo.custom_group_name = '';
                updatedTodo.status = STATUS.IN_PROGRESS;
                updatedTodo.completed = false;
                updatedTodo.columnId = 'default-0';
            } else if (columnId === 2) {
                // 已完成列
                updatedTodo.group_type = GROUP_TYPE.DEFAULT;
                updatedTodo.custom_group_id = null;
                updatedTodo.custom_group_name = '';
                updatedTodo.status = STATUS.COMPLETED;
                updatedTodo.completed = true;
                updatedTodo.columnId = 'default-2';
            } else if (columnId === 3) {
                // 已取消列
                updatedTodo.group_type = GROUP_TYPE.DEFAULT;
                updatedTodo.custom_group_id = null;
                updatedTodo.custom_group_name = '';
                updatedTodo.status = STATUS.CANCELLED;
                updatedTodo.completed = false;
                updatedTodo.columnId = 'default-3';
            }
        } else {
            // 新格式的列ID（字符串）
            const columnIdStr = String(columnId);

            if (columnIdStr.startsWith('default-')) {
                // 默认分组列
                updatedTodo.group_type = GROUP_TYPE.DEFAULT;
                updatedTodo.custom_group_id = null;
                updatedTodo.custom_group_name = '';

                // 根据columnId确定status
                if (columnIdStr === 'default-0') {
                    // 待处理列
                    updatedTodo.status = STATUS.IN_PROGRESS;
                    updatedTodo.completed = false;
                } else if (columnIdStr === 'default-2') {
                    // 已完成列
                    updatedTodo.status = STATUS.COMPLETED;
                    updatedTodo.completed = true;
                } else if (columnIdStr === 'default-3') {
                    // 已取消列
                    updatedTodo.status = STATUS.CANCELLED;
                    updatedTodo.completed = false;
                }

                updatedTodo.columnId = columnIdStr;
            } else if (columnIdStr.startsWith('custom-')) {
                // 自定义分组列
                updatedTodo.group_type = GROUP_TYPE.CUSTOM;
                updatedTodo.custom_group_id = parseInt(columnIdStr.split('-')[1]);

                // 查找自定义分组名称
                const customGroup = this.columns.find(col => col.id === columnIdStr);
                updatedTodo.custom_group_name = customGroup ? customGroup.name : '';

                // 已取消的待办移动到自定义分组时，恢复为进行中状态
                if (isCancelled) {
                    updatedTodo.status = STATUS.IN_PROGRESS;
                    updatedTodo.completed = false;
                }

                updatedTodo.columnId = columnIdStr;
            }
        }

        try {
            // 调用API保存修改后的todo信息
            await this.saveTodoToServer(updatedTodo);

            // API成功后，更新本地数据并重新渲染
            this.todos = this.todos.map(t => {
                if (t.id === todo.id) {
                    return updatedTodo;
                }
                return t;
            });

            this.applyFilters();

            console.log(`待办 ${todo.id} 移动到列 ${columnId} 成功，group_type更新为 ${updatedTodo.group_type}，custom_group_id更新为 ${updatedTodo.custom_group_id}，status更新为 ${updatedTodo.status}`);
        } catch (error) {
            console.error('[executeTodoMove] API调用失败，触发降级处理:', error);

            // 降级处理：直接更新本地数据
            this.todos = this.todos.map(t => {
                if (t.id === todo.id) {
                    return updatedTodo;
                }
                return t;
            });

            this.applyFilters();

            console.log(`[executeTodoMove] 待办 ${todo.id} 移动到列 ${columnId} 成功（降级处理），group_type更新为 ${updatedTodo.group_type}，custom_group_id更新为 ${updatedTodo.custom_group_id}，status更新为 ${updatedTodo.status}`);
        }
    }

    /**
     * 保存待办信息到服务器
     * @param {Object} todo - 待办信息
     * @returns {Promise<Object>} - 保存结果
     */
    async saveTodoToServer(todo) {
        try {
            // 构建要发送到服务器的数据
            // 注意：根据业务需求，添加待办和更新待办使用不同的API端点
            const isNewTodo = !todo.id || typeof todo.id === 'string' || todo.id > 1000000000000; // 临时ID通常是时间戳
            const endpoint = isNewTodo ? '/api/todos/add' : '/api/todos/update';
            const userId = this.currentUser?.id || 1; // 默认userId为1

            // 构建待办数据，确保格式与后端API匹配
            const todoData = {
                userid: userId,
                id: todo.id,
                title: todo.title,
                description: todo.description,
                tags: todo.tags || `${todo.category || ''},${todo.priority},${todo.dueDate ? '截止日期' : ''}`.trim().replace(/^,|,$/g, ''),
                deadline: todo.dueDate ? `${todo.dueDate}T23:59:59` : '',
                priority: todo.priority === 'high' ? 3 : todo.priority === 'medium' ? 2 : 1,
                status: todo.status,
                group_type: todo.group_type,
                custom_group_id: todo.custom_group_id,
                custom_group_name: todo.custom_group_name,
                reminderTime: todo.reminderTime ? `${todo.reminderTime}:00` : null, // 确保格式正确
                createdAt: todo.createdAt,
                updatedAt: new Date().toISOString()
            };

            // 移除不必要的字段（如果是新待办，不需要id）
            if (isNewTodo) {
                delete todoData.id;
            }

            // 实际项目中应该调用真实API
            // 这里使用fetch API模拟调用，添加了模拟延迟
            console.log(`调用${isNewTodo ? '添加' : '更新'}待办API，请求数据:`, todoData);

            // 模拟API调用延迟
            await new Promise(resolve => setTimeout(resolve, 500));

            // 模拟API响应
            const mockResponse = {
                code: 200,
                msg: 'success',
                data: {
                    id: isNewTodo ? Math.floor(Math.random() * 10000) + 1 : todo.id, // 生成真实ID
                    ...todoData,
                    updatedAt: new Date().toISOString()
                }
            };

            console.log('待办信息保存成功:', mockResponse);
            return mockResponse.data;

            /* 真实API调用代码
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(todoData)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            console.log('待办信息保存成功:', result);
            return result.data;
            */
        } catch (error) {
            // API调用失败，抛出错误，让调用方处理
            console.error('[saveTodoToServer] API调用失败:', error);
            throw error;
        }
    }
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', async function () {
    try {
        // 初始化主控制器
        window.todoPageController = new TodoPageController();
        await window.todoPageController.init(); // 等待初始化完成
        // console.log('待办页面初始化成功');
    } catch (error) {
        console.error('待办页面初始化失败:', error);
        // 可以在这里显示错误提示或重定向到错误页面
    }
});