// 将函数暴露到window对象，确保在动态创建的HTML中可访问
window.saveEditedLiability = saveEditedLiability;
window.confirmDeleteLiability = confirmDeleteLiability;

// 统一的弹窗关闭函数
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 10); // 小延迟确保关闭效果
    }
}

// 资产管理页面脚本

/**
 * 测试数据对象：包含用户财务状况的所有模拟数据
 * @type {Object}
 * @description 该对象模拟从后端API获取的用户财务数据，包含净资产、资产、负债、收支等核心财务信息
 */
const testData = {
    /**
     * 净资产相关数据
     * @property {number} current - 当前净资产总额
     * @property {number} previousMonth - 上月净资产总额
     * @property {Object} trend - 净资产趋势数据，按不同时间周期存储
     */
    netWorth: {
        current: 580000,
        previousMonth: 565000,
        trend: {
            '3months': [
                {date: '2024-04', value: 550000},
                {date: '2024-05', value: 565000},
                {date: '2024-06', value: 580000}
            ],
            '6months': [
                {date: '2024-01', value: 520000},
                {date: '2024-02', value: 535000},
                {date: '2024-03', value: 545000},
                {date: '2024-04', value: 550000},
                {date: '2024-05', value: 565000},
                {date: '2024-06', value: 580000}
            ],
            '1year': [
                {date: '2023-07', value: 480000},
                {date: '2023-08', value: 490000},
                {date: '2023-09', value: 500000},
                {date: '2023-10', value: 505000},
                {date: '2023-11', value: 510000},
                {date: '2023-12', value: 515000},
                {date: '2024-01', value: 520000},
                {date: '2024-02', value: 535000},
                {date: '2024-03', value: 545000},
                {date: '2024-04', value: 550000},
                {date: '2024-05', value: 565000},
                {date: '2024-06', value: 580000}
            ],
            'all': [
                {date: '2024-01', value: 520000},
                {date: '2024-02', value: 535000},
                {date: '2024-03', value: 545000},
                {date: '2024-04', value: 550000},
                {date: '2024-05', value: 565000},
                {date: '2024-06', value: 580000}
            ]
        }
    },

    /**
     * 资产相关数据
     * @property {number} total - 资产总额
     * @property {Array} categories - 资产分类列表，每项包含名称、价值和百分比
     * @property {Array} details - 资产明细列表，包含各类资产的具体信息
     */
    assets: {
        total: 1051500,
        categories: [
            {name: '现金及存款', value: 240000, percentage: 22.8},
            {name: '投资基金', value: 205000, percentage: 19.5},
            {name: '股票', value: 162000, percentage: 15.4},
            {name: '数字资产', value: 61000, percentage: 5.8},
            {name: '不动产', value: 320000, percentage: 30.4},
            {name: '车辆', value: 48000, percentage: 4.6},
            {name: '其他资产', value: 15500, percentage: 1.5}
        ],
        details: [
            {id: 1, name: '活期存款', category: '现金及存款', value: 50000, cost: 50000, returnRate: 0.0035},
            {id: 2, name: '定期存款', category: '现金及存款', value: 160000, cost: 160000, returnRate: 0.018},
            {id: 3, name: '货币基金', category: '现金及存款', value: 30000, cost: 30000, returnRate: 0.025},
            {id: 4, name: '沪深300指数基金', category: '投资基金', value: 60000, cost: 52000, returnRate: 0.1538},
            {id: 5, name: '债券基金', category: '投资基金', value: 67500, cost: 65000, returnRate: 0.0385},
            {id: 6, name: '混合型基金', category: '投资基金', value: 42500, cost: 40000, returnRate: 0.0625},
            {id: 7, name: '科技成长基金', category: '投资基金', value: 35000, cost: 30000, returnRate: 0.1667},
            {id: 8, name: '腾讯控股', category: '股票', value: 45000, cost: 40000, returnRate: 0.125},
            {id: 9, name: '贵州茅台', category: '股票', value: 57000, cost: 60000, returnRate: -0.05},
            {id: 10, name: '阿里巴巴', category: '股票', value: 32000, cost: 28000, returnRate: 0.1429},
            {id: 11, name: '宁德时代', category: '股票', value: 28000, cost: 32000, returnRate: -0.125},
            {id: 12, name: '比特币', category: '数字资产', value: 42500, cost: 35000, returnRate: 0.2143},
            {id: 13, name: '以太坊', category: '数字资产', value: 18500, cost: 15000, returnRate: 0.2333},
            {id: 14, name: '自住房产', category: '不动产', value: 320000, cost: 280000, returnRate: 0.1429},
            {id: 15, name: '汽车', category: '车辆', value: 48000, cost: 80000, returnRate: -0.4},
            {id: 16, name: '终身寿险', category: '其他资产', value: 25000, cost: 20000, returnRate: 0.25},
            {id: 17, name: '黄金ETF', category: '其他资产', value: 15000, cost: 14000, returnRate: 0.0714},
            {id: 18, name: '收藏品', category: '其他资产', value: 22000, cost: 18000, returnRate: 0.2222}
        ]
    },

    /**
     * 负债相关数据
     * @property {number} total - 负债总额
     * @property {number} monthlyPayment - 月度还款总额
     * @property {number} averageRate - 平均利率
     * @property {Array} details - 负债明细列表，包含各类负债的具体信息
     */
    liabilities: {
        total: 270000,
        monthlyPayment: 5200,
        averageRate: 4.25,
        details: [
            {
                id: 1,
                name: '房贷',
                type: 'mortgage',
                total: 250000,
                remaining: 240000,
                rate: 4.1,
                monthly: 4800,
                nextPaymentDate: '2024-07-15'
            },
            {
                id: 2,
                name: '信用卡账单',
                type: 'credit-card',
                total: 15000,
                remaining: 10000,
                rate: 0,
                monthly: 400,
                nextPaymentDate: '2024-07-05'
            },
            {
                id: 3,
                name: '个人借款',
                type: 'personal-loan',
                total: 5000,
                remaining: 0,
                rate: 0,
                monthly: 0,
                nextPaymentDate: null
            }
        ]
    },

    // 关键指标
    /**
     * 财务关键指标数据
     * @property {Object} emergencyFund - 应急备用金状态
     * @property {string} emergencyFund.status - 应急备用金状态描述
     * @property {number} emergencyFund.months - 可覆盖月数
     * @property {number} debtRatio - 负债比率（负债/资产）
     * @property {number} investmentRatio - 投资比率（投资资产/总资产）
     */
    keyIndicators: {
        emergencyFund: {status: '充足', months: 8},
        debtRatio: 31.8,
        investmentRatio: 32.5
    },

    /**
     * 收支相关数据
     * @property {Object} currentMonth - 当前月收支数据
     * @property {number} currentMonth.income - 当前月收入
     * @property {number} currentMonth.expense - 当前月支出
     * @property {number} currentMonth.savingsRate - 当前月储蓄率
     * @property {Object} previousMonth - 上月收支数据
     * @property {Array} trend - 收支趋势数据，按月存储
     * @property {Array} incomeSources - 收入来源明细
     * @property {Array} expenseCategories - 支出分类明细
     */
    incomeExpense: {
        currentMonth: {
            income: 35000,
            expense: 22000,
            savingsRate: 37.1
        },
        previousMonth: {
            income: 32000,
            expense: 24000
        },
        trend: [
            {month: '2024-01', income: 30000, expense: 21000},
            {month: '2024-02', income: 31000, expense: 22000},
            {month: '2024-03', income: 33000, expense: 23000},
            {month: '2024-04', income: 32000, expense: 21000},
            {month: '2024-05', income: 32000, expense: 24000},
            {month: '2024-06', income: 35000, expense: 22000}
        ],
        incomeSources: [
            {name: '工资薪金', value: 28000, percentage: 80},
            {name: '投资回报', value: 4550, percentage: 13},
            {name: '兼职收入', value: 2450, percentage: 7}
        ],
        expenseCategories: [
            {name: '住房相关', value: 8000, percentage: 36.4},
            {name: '餐饮食品', value: 4400, percentage: 20},
            {name: '交通出行', value: 2200, percentage: 10},
            {name: '娱乐休闲', value: 3300, percentage: 15},
            {name: '学习成长', value: 1100, percentage: 5},
            {name: '医疗健康', value: 1100, percentage: 5},
            {name: '其他支出', value: 1900, percentage: 8.6}
        ]
    },

    // 提醒和通知
    /**
     * 系统通知数据
     * @property {Array} reminders - 提醒事项列表，包含还款、投资等重要提醒
     * @property {Array} healthTips - 健康提示列表，包含财务健康状态相关建议
     */
    notifications: {
        reminders: [
            {id: 1, content: '信用卡还款：招商银行 (¥10,000) 将于3天后到期', type: 'warning'},
            {id: 2, content: '房贷月供 (¥4,800) 将于5天后自动扣款', type: 'info'},
            {id: 3, content: '基金定投计划：明天将自动买入XX基金 ¥3,000', type: 'success'}
        ],
        healthTips: [
            {id: 1, content: '您的紧急备用金充足，可覆盖8个月支出', type: 'positive'},
            {id: 2, content: '本月储蓄率为37.1%，高于上月11.3%', type: 'positive'},
            {id: 3, content: '投资资产占比32.5%，建议保持或增加投资比例', type: 'neutral'}
        ]
    },

    /**
     * 财务洞察数据
     * @type {Array}
     * @description 包含系统基于用户财务数据生成的分析和建议，每条建议包含ID、内容和类型（warning/positive/neutral）
     */
    insights: [
        {id: 1, content: '您的流动资产占比偏高，考虑增加投资资产以提高收益', type: 'warning'},
        {id: 2, content: '不动产占比37.6%，处于合理范围', type: 'positive'},
        {id: 3, content: '投资组合中股票占比12%，风险等级：中等', type: 'neutral'}
    ]
};

// 图表实例
let netWorthChart = null;
let assetDistributionChart = null;
let incomeExpenseChart = null;
let incomeSourcesChart = null;
let expenseCategoriesChart = null;

// 图表实例数组，用于响应式调整
const allCharts = [
    {chart: null, name: 'netWorthChart', elementId: 'netWorthChart'},
    {chart: null, name: 'assetDistributionChart', elementId: 'assetDistributionChart'},
    {chart: null, name: 'incomeExpenseChart', elementId: 'incomeExpenseChart'},
    {chart: null, name: 'incomeSourcesChart', elementId: 'incomeSourcesChart'},
    {chart: null, name: 'expenseCategoriesChart', elementId: 'expenseCategoriesChart'}
];

// 响应式调整图表大小
/**
 * 调整图表大小
 * @function resizeCharts
 * @description 响应窗口大小变化，重新调整所有图表的尺寸，确保良好的显示效果
 * @returns {void}
 */
function resizeCharts() {
    allCharts.forEach(chartObj => {
        if (chartObj.chart) {
            chartObj.chart.resize();
        }
    });

    // 更新allCharts数组中对应的图表引用
    const chartIndex = allCharts.findIndex(chartObj => chartObj.name === 'incomeExpenseChart');
    if (chartIndex !== -1) {
        allCharts[chartIndex].chart = incomeExpenseChart;
    }
}

// 窗口大小变化时调整图表大小
window.addEventListener('resize', resizeCharts);

// DOM加载完成后执行
window.addEventListener('DOMContentLoaded', function () {
    // 初始化页面数据
    initNetWorthOverview();
    initAssetsLiabilitiesSnapshot();
    initAssetDistribution();
    initIncomeExpense();
    initLiabilities();
    initNotifications();
    initInsights();

    // 初始化交互功能
    initInteractions();
});

// 初始化净资产概览
/**
 * 初始化净资产概览
 * @function initNetWorthOverview
 * @description 初始化页面上的净资产概览部分，包括当前净资产、上月净资产、增长率等数据显示
 * @returns {void}
 */
function initNetWorthOverview() {
    const netWorthEl = document.querySelector('.net-worth-value .amount');
    const trendEl = document.querySelector('.net-worth-trend');

    // 显示净资产
    netWorthEl.textContent = formatNumber(testData.netWorth.current);

    // 计算趋势
    const difference = testData.netWorth.current - testData.netWorth.previousMonth;
    const isPositive = difference > 0;
    const trendIcon = isPositive ? '↗' : '↘';
    const trendClass = isPositive ? 'positive' : 'negative';

    // 更新趋势显示
    trendEl.classList.add(trendClass);
    trendEl.innerHTML = `${isPositive ? '+' : ''}${formatNumber(difference)} ${trendIcon}`;

    // 绘制净资产趋势图
    drawNetWorthChart('3months');
}

// 初始化资产与负债快照
/**
 * 初始化资产负债快照
 * @function initAssetsLiabilitiesSnapshot
 * @description 初始化页面上的资产负债快照部分，包括总资产、总负债及其占比等数据显示
 * @returns {void}
 */
function initAssetsLiabilitiesSnapshot() {
    // 资产卡片
    const assetsCardEl = document.querySelector('.snapshot-card.assets');
    if (assetsCardEl) {
        const assetsAmountEl = assetsCardEl.querySelector('.card-value .amount');
        if (assetsAmountEl) assetsAmountEl.textContent = formatNumber(testData.assets.total);
    }

    // 负债卡片
    const liabilitiesCardEl = document.querySelector('.snapshot-card.liabilities');
    if (liabilitiesCardEl) {
        const liabilitiesAmountEl = liabilitiesCardEl.querySelector('.card-value .amount');
        if (liabilitiesAmountEl) liabilitiesAmountEl.textContent = formatNumber(testData.liabilities.total);
    }

    // 关键指标
    const emergencyFundEl = document.querySelector('.indicator-value.emergency-fund');
    const debtRatioEl = document.querySelector('.indicator-value.debt-ratio');
    const investmentRatioEl = document.querySelector('.indicator-value.investment-ratio');

    if (emergencyFundEl) {
        emergencyFundEl.textContent = `${testData.keyIndicators.emergencyFund.status} (${testData.keyIndicators.emergencyFund.months}个月)`;
        emergencyFundEl.classList.add(testData.keyIndicators.emergencyFund.status === '充足' ? 'sufficient' : 'insufficient');
    }

    if (debtRatioEl) debtRatioEl.textContent = `${testData.keyIndicators.debtRatio}%`;
    if (investmentRatioEl) investmentRatioEl.textContent = `${testData.keyIndicators.investmentRatio}%`;
}

// 初始化资产分布
/**
 * 初始化资产分布
 * @function initAssetDistribution
 * @description 初始化资产分布部分的数据和图表，调用图表绘制函数并设置相关交互
 * @returns {void}
 */
function initAssetDistribution() {
    // 绘制资产分布图表
    drawAssetDistributionChart();

    // 生成资产明细表格
    generateAssetsTable();

    // 绑定过滤器和排序事件
    bindAssetFiltersAndSort();
}

// 绑定筛选和排序事件
/**
 * 绑定资产筛选和排序事件
 * @function bindAssetFiltersAndSort
 * @description 为资产筛选和排序功能绑定事件监听器，实现资产列表的动态筛选和排序
 * @returns {void}
 */
function bindAssetFiltersAndSort() {
    // 筛选下拉框
    const filterSelect = document.getElementById('asset-filter');
    if (filterSelect) {
        filterSelect.addEventListener('change', function () {
            filterAssets(this.value);
        });
    }

    // 排序下拉框
    const sortSelect = document.getElementById('asset-sort');
    if (sortSelect) {
        sortSelect.addEventListener('change', function () {
            sortAssets(this.value);
        });
    }
}

// 筛选资产
/**
 * 筛选资产列表
 * @function filterAssets
 * @param {string} category - 资产类别，如'现金及存款'、'投资基金'等
 * @description 根据选择的类别筛选并显示资产列表，支持全部资产和特定类别的筛选
 * @returns {void}
 */
function filterAssets(category) {
    const tableBody = document.querySelector('#asset-table-body');
    if (!tableBody) return;

    const rows = tableBody.querySelectorAll('tr');

    rows.forEach(row => {
        const rowCategory = row.querySelector('td:nth-child(2)').textContent;
        if (category === 'all' || rowCategory === category) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// 排序资产
/**
 * 排序资产列表
 * @function sortAssets
 * @param {string} sortBy - 排序依据，如'value'（价值）、'category'（类别）、'returnRate'（收益率）
 * @description 根据指定的字段对资产列表进行排序，并重新渲染表格
 * @returns {void}
 */
function sortAssets(sortBy) {
    const tableBody = document.querySelector('#asset-table-body');
    if (!tableBody) return;

    const rows = Array.from(tableBody.querySelectorAll('tr'));

    // 根据不同条件排序
    rows.sort((a, b) => {
        switch (sortBy) {
            case 'value-desc':
                return parseFloat(b.querySelector('td:nth-child(3)').textContent.replace(/[^\d.-]/g, '')) -
                    parseFloat(a.querySelector('td:nth-child(3)').textContent.replace(/[^\d.-]/g, ''));
            case 'value-asc':
                return parseFloat(a.querySelector('td:nth-child(3)').textContent.replace(/[^\d.-]/g, '')) -
                    parseFloat(b.querySelector('td:nth-child(3)').textContent.replace(/[^\d.-]/g, ''));
            case 'profit-desc':
                return parseFloat(b.querySelector('td:nth-child(6)').textContent.replace(/[^\d.-]/g, '')) -
                    parseFloat(a.querySelector('td:nth-child(6)').textContent.replace(/[^\d.-]/g, ''));
            case 'profit-asc':
                return parseFloat(a.querySelector('td:nth-child(6)').textContent.replace(/[^\d.-]/g, '')) -
                    parseFloat(b.querySelector('td:nth-child(6)').textContent.replace(/[^\d.-]/g, ''));
            default:
                return 0;
        }
    });

    // 重新添加排序后的行
    rows.forEach(row => tableBody.appendChild(row));
}

// 初始化收支分析
/**
 * 初始化收入支出概览
 * @function initIncomeExpense
 * @description 初始化收入支出概览部分，包括本月收入、支出和储蓄率等数据显示
 * @returns {void}
 */
function initIncomeExpense() {
    // 更新收支指标
    updateIncomeExpenseIndicators();

    // 初始化收支分析区域
    initializeIncomeExpenseAnalysis();
}

// 收支分析区域初始化
/**
 * 初始化收支分析功能
 * @function initializeIncomeExpenseAnalysis
 * @description 初始化收支分析功能，包括图表绘制和时间周期选择器的绑定
 * @returns {void}
 */
function initializeIncomeExpenseAnalysis() {
    // 使用通用函数绘制收支趋势图表
    drawIncomeExpenseChart();
    // 使用通用函数绘制收入来源图表
    drawIncomeSourcesChart();
    // 使用通用函数绘制支出分类图表
    drawExpenseCategoriesChart();
    // 绑定时间周期选择器事件
    bindPeriodSelectorEvents();
}

// 绑定时间周期选择器事件
/**
 * 绑定时间周期选择器事件
 * @function bindPeriodSelectorEvents
 * @description 为时间周期选择器绑定点击事件，实现数据视图的切换
 * @returns {void}
 */
function bindPeriodSelectorEvents() {
    const periodBtns = document.querySelectorAll('.period-btn');
    const currentPeriodEl = document.querySelector('.current-period');

    periodBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            // 移除所有按钮的active状态
            periodBtns.forEach(b => b.classList.remove('active'));
            // 添加当前按钮的active状态
            this.classList.add('active');

            // 更新当前显示周期
            const period = this.dataset.period;
            let periodText = '';

            switch (period) {
                case 'month':
                    periodText = '2023年10月 收支情况';
                    break;
                case 'quarter':
                    periodText = '2023年第4季度 收支情况';
                    break;
                case 'year':
                    periodText = '2023年 收支情况';
                    break;
                case 'custom':
                    // 这里可以添加自定义日期选择逻辑
                    periodText = '自定义时间段 收支情况';
                    break;
            }

            currentPeriodEl.textContent = periodText;

            // 根据选择的时间周期更新数据（模拟）
            updateIncomeExpenseData(period);
        });
    });
}

// 更新收支数据（根据选择的时间周期）
/**
 * 更新收入支出数据
 * @function updateIncomeExpenseData
 * @param {string} period - 时间周期
 * @description 根据选择的时间周期更新收入支出相关的数据和图表
 * @returns {void}
 */
function updateIncomeExpenseData(period) {
    // 这里可以根据不同的时间周期获取对应的收支数据
    // 为了演示，我们只是模拟数据更新
    console.log(`Updating income expense data for period: ${period}`);

    // 模拟不同时间周期的收支数据
    let income = 28500;
    let expense = 18750;
    let savingsRate = 34.2;
    let incomeTrend = '+5.2%';
    let expenseTrend = '-2.8%';

    if (period === 'quarter') {
        income = 85500; // 季度收入
        expense = 56250; // 季度支出
        savingsRate = 34.2;
        incomeTrend = '+4.8%';
        expenseTrend = '-1.5%';
    } else if (period === 'year') {
        income = 342000; // 年度收入
        expense = 225000; // 年度支出
        savingsRate = 34.2;
        incomeTrend = '+4.5%';
        expenseTrend = '-1.2%';
    }

    // 更新UI显示
    document.querySelector('.income-expense-indicators .indicator-card:nth-child(1) .indicator-value').textContent = `¥${income.toLocaleString('zh-CN')}`;
    document.querySelector('.income-expense-indicators .indicator-card:nth-child(1) .indicator-trend span').textContent = incomeTrend;

    document.querySelector('.income-expense-indicators .indicator-card:nth-child(2) .indicator-value').textContent = `¥${expense.toLocaleString('zh-CN')}`;
    document.querySelector('.income-expense-indicators .indicator-card:nth-child(2) .indicator-trend span').textContent = expenseTrend;

    document.querySelector('.income-expense-indicators .indicator-card:nth-child(3) .indicator-value').textContent = `¥${(income - expense).toLocaleString('zh-CN')}`;
    document.querySelector('.income-expense-indicators .indicator-card:nth-child(4) .indicator-value').textContent = `${savingsRate}%`;
}

// 初始化负债管理
/**
 * 初始化负债概览
 * @function initLiabilities
 * @description 初始化负债概览部分，包括总负债、月供和平均利率等数据显示
 * @returns {void}
 */
function initLiabilities() {
    // 更新负债概览
    updateLiabilitiesOverview();

    // 生成负债明细表格
    generateLiabilitiesTable();
}

// 已移除 initializeLiabilities 函数，直接使用 initLiabilities 函数

// 初始化通知提醒
/**
 * 初始化通知列表
 * @function initNotifications
 * @description 初始化页面上的通知列表部分，包括提醒和健康提示的生成与显示
 * @returns {void}
 */
function initNotifications() {
    // 生成提醒列表
    generateRemindersList();

    // 生成健康提示列表
    generateHealthTipsList();
}

// 初始化功能操作区
/**
 * 初始化操作区域
 * @function initActionSection
 * @description 初始化页面上的操作区域，包括添加资产、负债等快捷操作按钮和功能
 * @returns {void}
 */
function initActionSection() {
    // 记录收入按钮
    const addIncomeBtn = document.getElementById('addIncomeBtn');
    if (addIncomeBtn) {
        addIncomeBtn.addEventListener('click', function () {
            alert('打开记录收入表单');
            // 实际实现时应该打开收入记录模态框
            console.log('记录收入功能被触发');
        });
    }

    // 记录支出按钮
    const addExpenseBtn = document.getElementById('addExpenseBtn');
    if (addExpenseBtn) {
        addExpenseBtn.addEventListener('click', function () {
            alert('打开记录支出表单');
            // 实际实现时应该打开支出记录模态框
            console.log('记录支出功能被触发');
        });
    }

    // 添加资产按钮
    const addAssetBtn = document.getElementById('addAssetBtn');
    if (addAssetBtn) {
        addAssetBtn.addEventListener('click', function () {
            alert('打开添加资产表单');
            // 实际实现时应该打开资产添加模态框
            console.log('添加资产功能被触发');
        });
    }

    // 添加负债按钮
    const addLiabilityBtn = document.getElementById('addLiabilityBtn');
    if (addLiabilityBtn) {
        addLiabilityBtn.addEventListener('click', function () {
            alert('打开添加负债表单');
            // 实际实现时应该打开负债添加模态框
            console.log('添加负债功能被触发');
        });
    }

    // 同步数据按钮
    const syncDataBtn = document.getElementById('syncDataBtn');
    if (syncDataBtn) {
        syncDataBtn.addEventListener('click', function () {
            alert('正在同步数据...');
            // 实际实现时应该调用同步API
            console.log('同步数据功能被触发');

            // 模拟同步完成
            setTimeout(() => {
                alert('数据同步成功！');
            }, 1500);
        });
    }

    // 导入数据按钮
    const importDataBtn = document.getElementById('importDataBtn');
    if (importDataBtn) {
        importDataBtn.addEventListener('click', function () {
            alert('打开数据导入对话框');
            // 实际实现时应该打开文件选择器
            console.log('导入数据功能被触发');
        });
    }

    // 导出数据按钮
    const exportDataBtn = document.getElementById('exportDataBtn');
    if (exportDataBtn) {
        exportDataBtn.addEventListener('click', function () {
            alert('正在导出数据...');
            // 实际实现时应该调用导出API
            console.log('导出数据功能被触发');

            // 模拟导出完成
            setTimeout(() => {
                alert('数据导出成功！');
            }, 1000);
        });
    }

    // 备份数据按钮
    const backupDataBtn = document.getElementById('backupDataBtn');
    if (backupDataBtn) {
        backupDataBtn.addEventListener('click', function () {
            alert('正在备份数据...');
            // 实际实现时应该调用备份API
            console.log('备份数据功能被触发');

            // 模拟备份完成
            setTimeout(() => {
                alert('数据备份成功！');
            }, 2000);
        });
    }
}

// 初始化洞察建议
/**
 * 初始化财务洞察
 * @function initInsights
 * @description 初始化页面上的财务洞察部分，生成并显示系统基于用户财务数据的分析和建议
 * @returns {void}
 */
function initInsights() {
    const insightsContainer = document.querySelector('.insights-list');
    if (!insightsContainer) {
        console.warn('Insights container not found, skipping insights initialization');
        return;
    }

    insightsContainer.innerHTML = '';

    testData.insights.forEach(insight => {
        const insightItem = document.createElement('div');
        insightItem.className = 'insight-item';

        let iconClass = 'neutral';
        let icon = 'info-circle';

        switch (insight.type) {
            case 'positive':
                iconClass = 'positive';
                icon = 'check-circle';
                break;
            case 'warning':
                iconClass = 'warning';
                icon = 'exclamation-circle';
                break;
        }

        insightItem.innerHTML = `
            <div class="insight-icon ${iconClass}">
                <i class="fas fa-${icon}"></i>
            </div>
            <div class="insight-text">${insight.content}</div>
        `;

        insightsContainer.appendChild(insightItem);
    });
}

// 初始化交互功能
/**
 * 初始化页面交互
 * @function initInteractions
 * @description 初始化页面上的各类交互功能，包括图表交互、数据更新、模态框显示等事件绑定
 * @returns {void}
 */
function initInteractions() {
    // 趋势图时间选择器
    const trendFilters = document.querySelectorAll('.chart-filter');
    trendFilters.forEach(filter => {
        filter.addEventListener('click', function () {
            // 移除所有active类
            trendFilters.forEach(f => f.classList.remove('active'));
            // 添加当前active类
            this.classList.add('active');
            // 重新绘制图表
            const period = this.dataset.period;
            drawNetWorthChart(period);
        });
    });

    // 展开/折叠卡片 - 资产和负债
    const assetsCard = document.querySelector('.snapshot-card.assets');
    const liabilitiesCard = document.querySelector('.snapshot-card.liabilities');

    if (assetsCard) {
        assetsCard.addEventListener('click', function () {
            this.classList.toggle('expanded');
            const detailsEl = this.querySelector('.card-details');
            if (detailsEl) {
                detailsEl.classList.toggle('hidden');
                // 动画效果
                if (!detailsEl.classList.contains('hidden')) {
                    detailsEl.style.maxHeight = detailsEl.scrollHeight + 'px';
                } else {
                    detailsEl.style.maxHeight = '0';
                }
            }
        });
    }

    if (liabilitiesCard) {
        liabilitiesCard.addEventListener('click', function () {
            this.classList.toggle('expanded');
            const detailsEl = this.querySelector('.card-details');
            if (detailsEl) {
                detailsEl.classList.toggle('hidden');
                // 动画效果
                if (!detailsEl.classList.contains('hidden')) {
                    detailsEl.style.maxHeight = detailsEl.scrollHeight + 'px';
                } else {
                    detailsEl.style.maxHeight = '0';
                }
            }
        });
    }

    // 添加净资产变化动画效果
    const netWorthEl = document.querySelector('.net-worth-value .amount');
    if (netWorthEl) {
        netWorthEl.style.opacity = '0';
        netWorthEl.style.transform = 'translateY(10px)';
        netWorthEl.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

        setTimeout(() => {
            netWorthEl.style.opacity = '1';
            netWorthEl.style.transform = 'translateY(0)';
        }, 200);
    }

    // 初始化弹窗关闭事件
    initModalCloseEvents();
}

// 绘制净资产趋势图
/**
 * 绘制净资产趋势图表
 * @function drawNetWorthChart
 * @param {string} period - 时间周期，可选值：'3months', '6months', '1year', 'all'
 * @description 根据指定的时间周期绘制净资产趋势线图，显示用户净资产的历史变化情况
 * @returns {void}
 */
function drawNetWorthChart(period) {
    const ctx = document.getElementById('netWorthChart').getContext('2d');

    // 映射HTML中的周期值到数据中的周期键，同时支持两种格式
    const periodMap = {
        '3m': '3months',
        '6m': '6months',
        '1y': '1year',
        'all': 'all',
        '3months': '3months',  // 支持直接传递的完整格式
        '6months': '6months',
        '1year': '1year'
    };

    // 转换周期值，如果不在映射中则默认使用6个月
    const normalizedPeriod = periodMap[period] || '6months';

    // 获取对应周期的数据，确保数据存在
    let data = testData.netWorth.trend[normalizedPeriod] || [];

    // 如果数据为空，使用默认的6个月数据作为后备
    if (!data.length) {
        console.warn(`未找到${normalizedPeriod}周期的数据，使用默认6个月数据`);
        data = testData.netWorth.trend['6months'] || [];
    }

    // 检查数据是否为空
    if (!data.length) {
        console.warn('没有可用的数据来绘制净资产趋势图');
        // 如果图表已存在，销毁它
        if (netWorthChart) {
            netWorthChart.destroy();
            netWorthChart = null;
        }
        return;
    }

    const labels = data.map(item => formatDate(item.date));
    const values = data.map(item => item.value);
    // 优化Y轴最小值计算，使图表更美观
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const range = maxValue - minValue;
    // 根据数据范围动态调整Y轴最小值
    const yMin = minValue - range * 0.05;
    // 确保Y轴最小值不会小于0（对于净资产数据）
    const adjustedYMin = Math.max(0, yMin);

    // 如果图表已存在，销毁它
    if (netWorthChart) {
        netWorthChart.destroy();
    }

    // 创建新图表
    netWorthChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: '净资产',
                data: values,
                backgroundColor: 'rgba(0, 123, 255, 0.1)',
                borderColor: '#007bff',
                borderWidth: 2,
                tension: 0.3,
                fill: true,
                pointBackgroundColor: '#007bff',
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        font: {
                            size: 14
                        },
                        // 简化图例配置，移除不适合趋势线图的复杂逻辑
                        generateLabels: function (chart) {
                            const data = chart.data;
                            // 对于趋势线图，只返回一个简单的图例项代表数据集
                            return [{
                                text: '净资产趋势',
                                fillStyle: data.datasets[0].borderColor,
                                strokeStyle: data.datasets[0].borderColor,
                                lineWidth: data.datasets[0].borderWidth,
                                hidden: data.datasets[0].hidden || false,
                                index: 0
                            }];
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return `净资产: ¥${formatNumber(context.parsed.y)}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: adjustedYMin,
                    ticks: {
                        callback: function (value) {
                            return '¥' + formatNumber(value);
                        }
                    }
                }
            },
            interaction: {
                mode: 'index',
                intersect: false
            }
        }
    });

    // 更新图表实例到allCharts数组
    const chartIndex = allCharts.findIndex(c => c.name === 'netWorthChart');
    if (chartIndex !== -1) {
        allCharts[chartIndex].chart = netWorthChart;
    }
}

// 绘制资产分布环形图
/**
 * 绘制资产分布环形图（Doughnut Chart）的函数
 * @description 基于Chart.js实现，自动过滤值为0的资产分类，支持旧图表实例销毁、自定义图例和提示框，最终更新全局allCharts数组维护实例
 * @returns {void} 无返回值，直接修改全局变量assetDistributionChart并更新allCharts数组
 */
function drawAssetDistributionChart() {
    // 获取承载图表的canvas元素的2D绘图上下文
    const ctx = document.getElementById('assetDistributionChart').getContext('2d');

    // 过滤资产分类中value为0的项：避免环形图出现无意义的空区块，仅保留有效数据
    const categories = testData.assets.categories.filter(cat => cat.value > 0);

    // 从过滤后的分类中提取图表标签（资产分类名称）
    const labels = categories.map(cat => cat.name);
    // 从过滤后的分类中提取图表数值（资产分类对应的数值）
    const values = categories.map(cat => cat.value);
    console.log(labels);
    // 定义环形图区块的默认配色方案：7种常用主题色，适配资产分类的展示场景
    const colors = [
        '#007bff', '#28a745', '#ffc107', '#6f42c1',
        '#dc3545', '#17a2b8', '#6c757d'
    ];

    // 销毁已存在的旧图表实例：避免重复渲染导致的图表叠加、性能问题或样式错乱
    if (assetDistributionChart) {
        assetDistributionChart.destroy();
    }

    // 创建新的环形图实例并赋值给全局变量，供后续销毁操作使用
    assetDistributionChart = new Chart(ctx, {
        type: 'doughnut', // 图表类型：环形图
        data: {
            labels: labels, // 图表标签（资产分类名称）
            datasets: [{
                data: values, // 图表核心数据（资产分类数值）
                backgroundColor: colors, // 区块填充色：使用预设的配色数组
                borderColor: '#ffffff', // 区块边框色：白色
                borderWidth: 0 // 区块边框宽度：0表示隐藏边框
            }]
        },
        options: {
            responsive: true, // 开启响应式布局：图表随容器尺寸自动适配
            maintainAspectRatio: false, // 取消宽高比限制：允许自定义canvas的宽高比例
            plugins: {
                legend: {
                    display: true, // 显示图例
                    position: 'bottom', // 图例位置：底部
                    labels: {
                        padding: 20, // 图例项之间的内边距：20px，提升可读性
                        font: {
                            size: 12 // 图例文字大小：12px
                        },
                        // usePointStyle: true, // 使用点样式图例标记，避免默认矩形可能导致的中划线问题
                        // pointStyle: 'circle', // 使用圆形点样式
                        /**
                         * 自定义图例生成函数：覆盖默认逻辑，确保图例与数据区块的样式/可见性同步
                         * @returns {Array} 自定义图例配置数组，包含文本、样式、可见性等信息
                         */
                        generateLabels: function (chart) {
                            const data = chart.data;
                            // 仅当存在标签和数据集时生成图例，避免空数据报错
                            if (data.labels.length && data.datasets.length) {
                                return data.labels.map((label, i) => {
                                    // 获取数据集的元数据（包含元素可见性等信息）
                                    const ds = data.datasets[0];
                                    return {
                                        text: label, // 图例显示的文本（资产分类名称）
                                        fillStyle: ds.backgroundColor[i], // 图例标记的填充色（与对应区块一致）
                                        strokeStyle: 'transparent', // 移除图例标记的边框色
                                        lineWidth: 0, // 确保图例标记无边框宽度
                                        strikeThrough: false, // 确保图例文本没有中划线
                                        hidden: false, // 图例项的隐藏状态（与数据区块可见性同步）
                                        index: i // 图例项对应的数据源索引
                                    };
                                });
                            }
                            return []; // 无数据时返回空数组
                        }
                    }
                },
                tooltip: {
                    /**
                     * 自定义提示框内容回调函数：拼接资产名称、格式化金额、计算占比百分比
                     * @param {Object} context - 提示框上下文对象，包含数据索引、解析后的值等信息
                     * @returns {string} 格式化后的提示框文本
                     */
                    callbacks: {
                        label: function (context) {
                            const label = context.label || ''; // 资产分类名称
                            const value = context.parsed; // 解析后的资产数值
                            // 计算所有资产数值的总和，用于计算占比
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            // 计算当前资产占总资的百分比，四舍五入取整
                            const percentage = Math.round((value / total) * 100);
                            // 返回格式化后的提示文本：名称 + 格式化金额 + 百分比（formatNumber为外部数字格式化函数）
                            return `${label}: ¥${formatNumber(value)} (${percentage}%)`;
                        }
                    }
                }
            },
            cutout: '60%' // 环形图中间镂空比例：60%（值越大，环形越细，值为0则为饼图）
        }
    });

    // 更新全局allCharts数组中的图表实例：便于后续统一管理（批量销毁、更新等操作）
    const chartIndex = allCharts.findIndex(c => c.name === 'assetDistributionChart');
    if (chartIndex !== -1) {
        allCharts[chartIndex].chart = assetDistributionChart;
    }
}

// 绘制收支趋势图
/**
 * 绘制收支趋势图表
 * @function drawIncomeExpenseChart
 * @description 绘制折线图展示用户收入和支出的月度趋势，直观比较收入与支出的变化关系
 * @returns {void}
 */
function drawIncomeExpenseChart() {
    const ctx = document.getElementById('incomeExpenseChart').getContext('2d');

    const incomeData = testData.incomeExpense.trend.map(item => item.income);
    const expenseData = testData.incomeExpense.trend.map(item => item.expense);
    const labels = testData.incomeExpense.trend.map(item => formatDateLabel(item.month));

    if (incomeExpenseChart) {
        incomeExpenseChart.destroy();
    }

    incomeExpenseChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: '收入',
                data: incomeData,
                backgroundColor: 'rgba(40, 167, 69, 0.1)',
                borderColor: '#28a745',
                borderWidth: 2,
                tension: 0.3,
                fill: true,
                pointBackgroundColor: '#28a745',
                pointRadius: 4,
                pointHoverRadius: 6
            }, {
                label: '支出',
                data: expenseData,
                backgroundColor: 'rgba(220, 53, 69, 0.1)',
                borderColor: '#dc3545',
                borderWidth: 2,
                tension: 0.3,
                fill: true,
                pointBackgroundColor: '#dc3545',
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        padding: 20,
                        font: {
                            size: 12
                        },
                        usePointStyle: true
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const label = context.dataset.label || '';
                            return `${label}: ¥${formatNumber(context.parsed.y)}`;
                        }
                    },
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 12
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        font: {
                            size: 12
                        },
                        callback: function (value) {
                            return '¥' + formatNumber(value);
                        }
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            },
            elements: {
                line: {
                    borderCapStyle: 'round',
                    borderJoinStyle: 'round'
                }
            }
        }
    });

    // 更新图表实例到allCharts数组
    const chartIndex = allCharts.findIndex(c => c.name === 'incomeExpenseChart');
    if (chartIndex !== -1) {
        allCharts[chartIndex].chart = incomeExpenseChart;
    }
}

// 绘制收入来源环形图
// 通用的环形图绘制函数
/**
 * 基于Chart.js绘制环形图（Doughnut Chart）的封装函数
 * @param {Object} options - 图表配置项对象
 * @param {string} options.chartElementId - 承载图表的canvas元素ID
 * @param {Chart} [options.chartInstance=null] - 已存在的图表实例（用于销毁旧实例，避免重复渲染）
 * @param {Array} options.dataSource - 图表数据源，数组项为对象，需包含name/value/percentage字段
 * @param {boolean} [options.useValueAsData=false] - 是否使用value字段作为图表数据值，默认使用percentage字段
 * @param {Array<string>} [options.colors=null] - 自定义图表区块颜色数组，不传则使用默认配色方案
 * @param {string} [options.legendPosition='right'] - 图例位置，可选值：top/bottom/left/right
 * @param {number} [options.decimalPlaces=0] - 百分比显示的小数位数，默认无小数
 * @returns {Chart} - 返回新创建的Chart.js环形图实例
 * @description 该函数会自动过滤值为0的数据，支持自定义颜色、图例位置、百分比精度，且会维护全局allCharts数组更新图表实例
 */
function drawDoughnutChart(options) {
    // 解构配置项并设置默认值
    const {
        chartElementId,
        chartInstance,
        dataSource,
        useValueAsData = false,
        colors = null,
        legendPosition = 'right',
        decimalPlaces = 0
    } = options;

    // 获取canvas的2D绘图上下文
    const ctx = document.getElementById(chartElementId).getContext('2d');

    // 销毁旧的图表实例：避免重复渲染导致的图表叠加/性能问题
    if (chartInstance) {
        chartInstance.destroy();
    }

    // 过滤数据源中value为0的项：避免环形图出现无意义的空区块
    const filteredData = dataSource.filter(item => item.value > 0);
    // 提取图表标签（名称）
    const labels = filteredData.map(item => item.name);
    // 提取数据源中的数值
    const values = filteredData.map(item => item.value);
    // 提取数据源中的百分比
    const percentages = filteredData.map(item => item.percentage);

    // 确定图表最终使用的数据：根据配置选择value或percentage
    const chartData = useValueAsData ? values : percentages;

    // 确定图表区块的颜色方案
    let chartColors;
    if (colors) {
        // 使用自定义颜色，并截取与过滤后数据长度一致的部分（避免颜色数量不匹配）
        chartColors = colors.slice(0, filteredData.length);
    } else {
        // 默认配色方案：预设10种常用颜色，适配大部分场景
        chartColors = [
            '#4f46e5', '#10b981', '#f59e0b', '#ff9800',
            '#f44336', '#e91e63', '#9c27b0', '#673ab7',
            '#3f51b5', '#2196f3'
        ].slice(0, filteredData.length); // 截取与数据匹配的长度
    }

    // 确定图表区块的边框颜色：所有图表使用白色边框
    const borderColors = '#fff';

    // 创建新的环形图实例
    const newChart = new Chart(ctx, {
        type: 'doughnut', // 图表类型：环形图
        data: {
            labels: labels, // 图表标签
            datasets: [{
                data: chartData, // 图表核心数据
                backgroundColor: chartColors, // 区块填充色
                borderColor: borderColors, // 区块边框色
                borderWidth: 0 // 区块边框宽度
            }]
        },
        options: {
            responsive: true, // 响应式布局：适配容器大小
            maintainAspectRatio: false, // 取消宽高比限制：允许自定义canvas尺寸
            cutout: '70%', // 环形图中间镂空比例：70%（值越大，环越细）
            plugins: {
                legend: {
                    position: legendPosition, // 图例位置
                    labels: {
                        padding: chartElementId === 'incomeSourcesChart' ? 12 : 10, // 图例项内边距（特殊图表单独配置）
                        font: {
                            size: chartElementId === 'incomeSourcesChart' ? 11 : 10 // 图例字体大小（特殊图表单独配置）
                        },
                        // usePointStyle: true, // 使用点样式替代默认的矩形图例标记
                        // pointStyle: 'circle', // 图例标记形状：圆形
                        // borderWidth: 0, // 移除图例标记的边框
                        /**
                         * 自定义图例生成函数：覆盖默认图例文本，拼接标签+百分比
                         * @param {Chart} chart - 图表实例
                         * @returns {Array} - 自定义图例配置数组
                         */
                        generateLabels: function (chart) {
                            const data = chart.data;
                            // 仅当存在标签和数据集时生成图例
                            if (data.labels.length && data.datasets.length) {
                                return data.labels.map((label, i) => {
                                    const dataset = data.datasets[0];
                                    const percentage = percentages[i];
                                    // 格式化百分比：按配置的小数位数处理
                                    const percentageText = decimalPlaces > 0
                                        ? percentage.toFixed(decimalPlaces)
                                        : percentage;

                                    return {
                                        text: `${label}: ${percentageText}%`, // 自定义图例文本
                                        fillStyle: dataset.backgroundColor[i], // 图例标记填充色
                                        strokeStyle: dataset.borderColor[i], // 图例标记边框色
                                        lineWidth: dataset.borderWidth, // 图例标记边框宽度
                                        hidden: false, // 图例项是否隐藏
                                        index: i // 图例项对应数据索引
                                    };
                                });
                            }
                            return [];
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)', // 提示框背景色（半透明黑）
                    titleColor: '#fff', // 提示框标题颜色
                    bodyColor: '#fff', // 提示框内容颜色
                    borderColor: 'rgba(255, 255, 255, 0.2)', // 提示框边框色
                    borderWidth: 1, // 提示框边框宽度
                    cornerRadius: 8, // 提示框圆角半径
                    /**
                     * 自定义提示框内容回调函数：拼接金额+百分比
                     * @param {Object} context - 提示框上下文对象，包含数据索引、解析后的值等
                     * @returns {string} - 自定义提示框文本
                     */
                    callbacks: {
                        label: function (context) {
                            const label = context.label || ''; // 数据标签
                            const value = context.parsed || 0; // 解析后的图表数据值
                            const amount = values[context.dataIndex]; // 原始金额值
                            const percentage = percentages[context.dataIndex]; // 原始百分比值
                            // 格式化百分比显示
                            const percentageText = decimalPlaces > 0
                                ? percentage.toFixed(decimalPlaces)
                                : percentage;
                            // 拼接提示框文本：中文金额格式化（千分位）+ 百分比
                            return `${label}: ¥${amount.toLocaleString('zh-CN')} (${percentageText}%)`;
                        }
                    }
                }
            },
            animation: {
                animateScale: true, // 启用缩放动画：图表加载时的大小过渡
                animateRotate: true // 启用旋转动画：图表加载时的旋转过渡
            }
        }
    });

    // 更新全局allCharts数组中的图表实例：便于后续统一管理（销毁/更新）
    const chartName = chartElementId;
    const chartIndex = allCharts.findIndex(c => c.name === chartName);
    if (chartIndex !== -1) {
        allCharts[chartIndex].chart = newChart;
    }

    // 返回新创建的图表实例，供外部调用者持有
    return newChart;
}

// 绘制收入来源图表
/**
 * 绘制收入来源图表
 * @function drawIncomeSourcesChart
 * @description 绘制饼图展示用户各类收入来源的占比情况，如工资薪金、投资回报、兼职收入等
 * @returns {void}
 */
function drawIncomeSourcesChart() {
    const customColors = ['#4f46e5', '#10b981', '#f59e0b'];
    incomeSourcesChart = drawDoughnutChart({
        chartElementId: 'incomeSourcesChart',
        chartInstance: incomeSourcesChart,
        dataSource: testData.incomeExpense.incomeSources,
        useValueAsData: true,
        colors: customColors
    });
}

// 绘制支出分类图表
/**
 * 绘制支出类别图表
 * @function drawExpenseCategoriesChart
 * @description 绘制饼图展示用户各类支出的占比情况，如住房相关、餐饮食品、交通出行等
 * @returns {void}
 */
function drawExpenseCategoriesChart() {
    const customColors = [
        '#ff9800', '#f44336', '#e91e63', '#9c27b0',
        '#673ab7', '#3f51b5', '#2196f3'
    ];
    expenseCategoriesChart = drawDoughnutChart({
        chartElementId: 'expenseCategoriesChart',
        chartInstance: expenseCategoriesChart,
        dataSource: testData.incomeExpense.expenseCategories,
        useValueAsData: true,
        colors: customColors
    });
}

// 生成资产明细表格
function generateAssetsTable() {
    const tableBody = document.querySelector('#asset-table-body');
    // 添加DOM元素存在性检查
    if (!tableBody) {
        console.warn('资产表格元素未找到，跳过表格生成');
        return;
    }

    tableBody.innerHTML = '';

    testData.assets.details.forEach(asset => {
        const row = document.createElement('tr');

        // 收益率样式
        const returnRateClass = asset.returnRate > 0 ? 'positive' : 'negative';
        const returnRateText = asset.returnRate > 0 ? '+' : '';

        row.innerHTML = `
            <td>${asset.name}</td>
            <td><span class="tag ${asset.category}">${asset.category}</span></td>
            <td>¥${formatNumber(asset.value)}</td>
            <td>${calculateAssetPercentage(asset.value)}%</td>
            <td>¥${formatNumber(asset.cost)}</td>
            <td class="${returnRateClass}">${returnRateText}${(asset.returnRate * 100).toFixed(2)}%</td>
            <td>
                <div class="table-actions">
                    <a class="action-link edit" data-id="${asset.id}">编辑</a>
                    <a class="action-link delete" data-id="${asset.id}">删除</a>
                    <a class="action-link view" data-id="${asset.id}">查看</a>
                </div>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

// 生成负债明细表格
function generateLiabilitiesTable() {
    const tableBody = document.querySelector('.liabilities-table tbody');
    tableBody.innerHTML = '';

    testData.liabilities.details.forEach(liability => {
        const row = document.createElement('tr');

        // 检查是否即将到期
        let isUpcomingPayment = false;
        let paymentDateText = '已还清';

        if (liability.nextPaymentDate) {
            const nextPayment = new Date(liability.nextPaymentDate);
            const today = new Date();
            const daysUntil = Math.ceil((nextPayment - today) / (1000 * 60 * 60 * 24));

            if (daysUntil >= 0 && daysUntil < 7) {
                isUpcomingPayment = true;
                row.classList.add('upcoming-payment');
            }

            paymentDateText = liability.nextPaymentDate + (isUpcomingPayment ? ` (${daysUntil}天后)` : '');
        }

        row.innerHTML = `
            <td>${liability.name}</td>
            <td><span class="tag ${liability.type}">${getLiabilityTypeName(liability.type)}</span></td>
            <td>¥${formatNumber(liability.total)}</td>
            <td>¥${formatNumber(liability.remaining)}</td>
            <td>${liability.rate}%</td>
            <td>¥${formatNumber(liability.monthly)}</td>
            <td class="${isUpcomingPayment ? 'warning' : ''}">${paymentDateText}</td>
            <td>
                <div class="table-actions">
                    <a class="action-link view" data-id="${liability.id}">查看</a>
                    <a class="action-link edit" data-id="${liability.id}">编辑</a>
                    <a class="action-link delete" data-id="${liability.id}">删除</a>
                </div>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

// 生成资产分类列表
function generateAssetCategoriesList() {
    const categoriesList = document.querySelector('.categories-list');
    categoriesList.innerHTML = '';

    testData.assets.categories.forEach(category => {
        if (category.value > 0) {
            const categoryItem = document.createElement('div');
            categoryItem.className = 'category-item';

            // 获取分类对应的颜色类
            let colorClass = 'other';
            if (category.name.includes('现金')) colorClass = 'cash';
            else if (category.name.includes('基金')) colorClass = 'funds';
            else if (category.name.includes('股票')) colorClass = 'stocks';
            else if (category.name.includes('数字')) colorClass = 'crypto';
            else if (category.name.includes('不动产')) colorClass = 'property';
            else if (category.name.includes('车辆')) colorClass = 'vehicle';

            categoryItem.innerHTML = `
                <div class="category-color ${colorClass}"></div>
                <div class="category-name">${category.name}</div>
                <div class="category-percentage">${category.percentage}%</div>
                <div class="category-amount">¥${formatNumber(category.value)}</div>
            `;

            categoriesList.appendChild(categoryItem);
        }
    });
}

// 生成支出TOP榜
function generateTopExpensesList() {
    const topExpensesList = document.querySelector('.top-expenses-list');
    topExpensesList.innerHTML = '';

    // 获取前5大支出类别并排序
    const topExpenses = [...testData.incomeExpense.expenseCategories]
        .filter(cat => cat.value > 0)
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

    // 找到最大值用于计算百分比
    const maxValue = topExpenses[0]?.value || 1;

    topExpenses.forEach(expense => {
        const percentage = (expense.value / maxValue) * 100;

        const expenseItem = document.createElement('div');
        expenseItem.className = 'top-expense-item';
        expenseItem.innerHTML = `
            <div class="top-expense-name">${expense.name}</div>
            <div class="top-expense-bar">
                <div class="top-expense-fill" style="width: ${percentage}%"></div>
            </div>
            <div class="top-expense-amount">¥${formatNumber(expense.value)}</div>
        `;

        topExpensesList.appendChild(expenseItem);
    });
}

// 生成提醒列表
function generateRemindersList() {
    const remindersList = document.querySelector('.reminders-list');
    remindersList.innerHTML = '';

    testData.notifications.reminders.forEach(reminder => {
        const reminderItem = document.createElement('div');
        reminderItem.className = `reminder-item ${reminder.type}`;

        let icon = 'info-circle';
        if (reminder.type === 'warning') icon = 'exclamation-triangle';
        else if (reminder.type === 'success') icon = 'check-circle';

        reminderItem.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <div>${reminder.content}</div>
        `;

        remindersList.appendChild(reminderItem);
    });
}

// 生成健康提示列表
function generateHealthTipsList() {
    const tipsList = document.querySelector('.tips-list');
    tipsList.innerHTML = '';

    testData.notifications.healthTips.forEach(tip => {
        const tipItem = document.createElement('div');
        tipItem.className = `tip-item ${tip.type}`;

        let icon = 'info-circle';
        if (tip.type === 'positive') icon = 'check-circle';
        else if (tip.type === 'neutral') icon = 'circle';

        tipItem.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <div>${tip.content}</div>
        `;

        tipsList.appendChild(tipItem);
    });
}

// 更新收支指标
function updateIncomeExpenseIndicators() {
    // 获取当前月数据
    const currentMonthData = testData.incomeExpense.currentMonth;
    const previousMonthData = testData.incomeExpense.previousMonth;

    // 更新总收入
    const totalIncomeEl = document.getElementById('totalIncome');
    if (totalIncomeEl) {
        totalIncomeEl.textContent = `¥${formatNumber(currentMonthData.income)}`;
    }

    // 更新总支出
    const totalExpenseEl = document.getElementById('totalExpense');
    if (totalExpenseEl) {
        totalExpenseEl.textContent = `¥${formatNumber(currentMonthData.expense)}`;
    }

    // 更新净收入
    const netIncomeEl = document.getElementById('netIncome');
    if (netIncomeEl) {
        const netIncome = currentMonthData.income - currentMonthData.expense;
        netIncomeEl.textContent = `¥${formatNumber(netIncome)}`;
        netIncomeEl.className = netIncome >= 0 ? 'positive' : 'negative';
    }

    // 更新储蓄率
    const savingsRateEl = document.getElementById('savingsRate');
    if (savingsRateEl) {
        savingsRateEl.textContent = `${currentMonthData.savingsRate}%`;
    }

    // 更新收入变化
    const incomeChangeEl = document.getElementById('incomeChange');
    if (incomeChangeEl) {
        const incomeChange = ((currentMonthData.income - previousMonthData.income) / previousMonthData.income * 100).toFixed(1);
        const incomeChangeClass = parseFloat(incomeChange) >= 0 ? 'positive' : 'negative';
        const incomeChangeText = parseFloat(incomeChange) >= 0 ? '+' : '';
        incomeChangeEl.textContent = `${incomeChangeText}${incomeChange}%`;
        incomeChangeEl.className = incomeChangeClass;
    }

    // 更新支出变化
    const expenseChangeEl = document.getElementById('expenseChange');
    if (expenseChangeEl) {
        const expenseChange = ((currentMonthData.expense - previousMonthData.expense) / previousMonthData.expense * 100).toFixed(1);
        const expenseChangeClass = parseFloat(expenseChange) <= 0 ? 'positive' : 'negative';
        const expenseChangeText = parseFloat(expenseChange) >= 0 ? '+' : '';
        expenseChangeEl.textContent = `${expenseChangeText}${expenseChange}%`;
        expenseChangeEl.className = expenseChangeClass;
    }
}

// 更新负债概览
function updateLiabilitiesOverview() {
    const totalValueEl = document.querySelector('.overview-card.total .card-value');
    const monthlyPaymentEl = document.querySelector('.overview-card.monthly .card-value');
    const averageRateEl = document.querySelector('.overview-card.rate .card-value');

    if (totalValueEl) totalValueEl.textContent = `¥${formatNumber(testData.liabilities.total)}`;
    if (monthlyPaymentEl) monthlyPaymentEl.textContent = `¥${formatNumber(testData.liabilities.monthlyPayment)}`;
    if (averageRateEl) averageRateEl.textContent = `${testData.liabilities.averageRate}%`;
}

// 辅助函数：格式化数字
/**
 * 格式化数字显示
 * @function formatNumber
 * @param {number} num - 需要格式化的数字
 * @description 将数字格式化为带有千分位分隔符的字符串，方便在界面上显示
 * @returns {string} - 格式化后的数字字符串
 */
function formatNumber(num) {
    return new Intl.NumberFormat('zh-CN').format(num);
}

// 格式化日期标签
/**
 * 格式化日期标签
 * @function formatDateLabel
 * @param {string} dateStr - 日期字符串，格式如'2024-01'
 * @description 将YYYY-MM格式的日期转换为更友好的标签格式，用于图表显示
 * @returns {string} - 格式化后的日期标签
 */
function formatDateLabel(dateStr) {
    // 将YYYY-MM格式转换为MM月格式
    const [year, month] = dateStr.split('-');
    return `${month}月`;
}

// 辅助函数：格式化日期
/**
 * 格式化日期显示
 * @function formatDate
 * @param {string} dateStr - 日期字符串
 * @description 将日期字符串格式化为标准的中文日期格式，用于界面显示
 * @returns {string} - 格式化后的日期字符串
 */
function formatDate(dateStr) {
    // 处理"YYYY-MM"格式的日期字符串
    if (dateStr.includes('-')) {
        const [year, month] = dateStr.split('-').map(Number);
        // 对于较长时间周期的数据，显示年份和月份以避免混淆
        return `${year}年${month}月`;
    }
    // 对于其他格式，尝试使用Date对象解析
    const date = new Date(dateStr);
    return `${date.getFullYear()}年${date.getMonth() + 1}月`;
}

// 当前选中的资产ID
let currentAssetId = null;

// 动态创建编辑资产弹窗
function createEditAssetModal(asset) {
    const modal = document.createElement('div');
    modal.id = 'edit-asset-modal';
    modal.className = 'modal show';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>编辑资产</h3>
                <button class="close-modal" onclick="closeModal('edit-asset-modal')">&times;</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="asset-name">资产名称</label>
                    <input type="text" id="asset-name" class="form-control" value="${asset.name}" required>
                </div>
                <div class="form-group">
                    <label for="asset-category">资产类别</label>
                    <select id="asset-category" class="form-control" required>
                        <option value="现金及存款" ${asset.category === '现金及存款' ? 'selected' : ''}>现金及存款</option>
                        <option value="投资基金" ${asset.category === '投资基金' ? 'selected' : ''}>投资基金</option>
                        <option value="股票" ${asset.category === '股票' ? 'selected' : ''}>股票</option>
                        <option value="数字资产" ${asset.category === '数字资产' ? 'selected' : ''}>数字资产</option>
                        <option value="不动产" ${asset.category === '不动产' ? 'selected' : ''}>不动产</option>
                        <option value="车辆" ${asset.category === '车辆' ? 'selected' : ''}>车辆</option>
                        <option value="其他资产" ${asset.category === '其他资产' ? 'selected' : ''}>其他资产</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="asset-value">当前价值</label>
                    <input type="number" id="asset-value" class="form-control" value="${asset.value}" step="0.01" min="0" required>
                </div>
                <div class="form-group">
                    <label for="asset-cost">成本价值</label>
                    <input type="number" id="asset-cost" class="form-control" value="${asset.cost}" step="0.01" min="0" required>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" onclick="saveEditedAsset()">保存</button>
                <button class="btn btn-cancel" onclick="closeModal('edit-asset-modal')">取消</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// 动态创建删除资产弹窗
function createDeleteAssetModal(asset) {
    const modal = document.createElement('div');
    modal.id = 'delete-asset-modal';
    modal.className = 'modal show';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>确认删除</h3>
                <button class="close-modal" onclick="closeModal('delete-asset-modal')">&times;</button>
            </div>
            <div class="modal-body">
                <p>确定要删除资产 <span id="delete-asset-name">${asset.name}</span> 吗？此操作不可撤销。</p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-danger" onclick="confirmDeleteAsset()">删除</button>
                <button class="btn btn-cancel" onclick="closeModal('delete-asset-modal')">取消</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}


// 动态创建查看资产弹窗
function createViewAssetModal(asset) {
    const returnRateText = asset.returnRate > 0 ? '+' : '';
    const modal = document.createElement('div');
    modal.id = 'view-asset-modal';
    modal.className = 'modal show';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>资产详情</h3>
                <button class="close-modal" onclick="closeModal('view-asset-modal')">&times;</button>
            </div>
            <div class="modal-body">
                <div class="asset-detail-item">
                    <span class="label">资产名称：</span>
                    <span id="detail-name">${asset.name}</span>
                </div>
                <div class="asset-detail-item">
                    <span class="label">资产类别：</span>
                    <span id="detail-category">${asset.category}</span>
                </div>
                <div class="asset-detail-item">
                    <span class="label">当前价值：</span>
                    <span id="detail-value">¥${formatNumber(asset.value)}</span>
                </div>
                <div class="asset-detail-item">
                    <span class="label">成本价值：</span>
                    <span id="detail-cost">¥${formatNumber(asset.cost)}</span>
                </div>
                <div class="asset-detail-item">
                    <span class="label">收益率：</span>
                    <span id="detail-return">${returnRateText}${(asset.returnRate * 100).toFixed(2)}%</span>
                </div>
                <div class="asset-detail-item">
                    <span class="label">占总资产比例：</span>
                    <span>${calculateAssetPercentage(asset.value)}%</span>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-cancel" onclick="closeModal('view-asset-modal')">关闭</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// 保存编辑后的资产信息
function saveEditedAsset() {
    const assetName = document.getElementById('asset-name').value;
    const assetCategory = document.getElementById('asset-category').value;
    const assetValue = parseFloat(document.getElementById('asset-value').value);
    const assetCost = parseFloat(document.getElementById('asset-cost').value);

    // 计算收益率
    const returnRate = (assetValue - assetCost) / assetCost;

    // 更新数据
    const assetIndex = testData.assets.details.findIndex(a => a.id === currentAssetId);
    if (assetIndex !== -1) {
        testData.assets.details[assetIndex] = {
            id: currentAssetId,
            name: assetName,
            category: assetCategory,
            value: assetValue,
            cost: assetCost,
            returnRate: returnRate
        };

        // 重新生成表格
        generateAssetsTable();
    }

    // 关闭弹窗
    document.getElementById('edit-asset-modal').classList.remove('show');
}

// 确认删除资产
function confirmDeleteAsset() {
    // 从数据中删除
    const assetIndex = testData.assets.details.findIndex(a => a.id === currentAssetId);
    if (assetIndex !== -1) {
        testData.assets.details.splice(assetIndex, 1);

        // 重新生成表格
        generateAssetsTable();
    }

    // 关闭弹窗
    document.getElementById('delete-asset-modal').classList.remove('show');
}

// 添加关闭按钮事件监听
function initModalCloseEvents() {
    // 关闭按钮事件
    document.querySelectorAll('.modal-close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function () {
            const modal = this.closest('.modal');
            modal.classList.remove('show');
        });
    });

    // 点击弹窗外部关闭
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function (e) {
            if (e.target === this) {
                this.classList.remove('show');
            }
        });
    });
}

// 确保在全局范围内可访问这些函数
window.saveEditedAsset = saveEditedAsset;
window.confirmDeleteAsset = confirmDeleteAsset;

// 辅助函数：计算资产占比
/**
 * 计算资产占比百分比
 * @function calculateAssetPercentage
 * @param {number} value - 单项资产的价值
 * @description 计算单项资产占总资产的百分比，并保留一位小数
 * @returns {number} - 资产占比百分比
 */
function calculateAssetPercentage(value) {
    const total = testData.assets.total;
    return ((value / total) * 100).toFixed(1);
}

// 辅助函数：获取负债类型名称
/**
 * 获取负债类型名称
 * @function getLiabilityTypeName
 * @param {string} type - 负债类型标识符
 * @description 根据负债类型标识符获取对应的中文名称，如'mortgage'转换为'房贷'
 * @returns {string} - 负债类型的中文名称
 */
function getLiabilityTypeName(type) {
    const typeMap = {
        'mortgage': '房贷',
        'car-loan': '车贷',
        'credit-card': '信用卡',
        'personal-loan': '个人借款'
    };
    return typeMap[type] || type;
}
/**
 * 获取负债数据
 * @function fetchLiabilitiesData
 * @description 异步获取用户负债数据，模拟API调用过程
 * @returns {Promise<Object>} - 返回包含负债信息的数据对象
 */
async function fetchLiabilitiesData() {
    try {
        const response = await fetch('/api/assets/liabilities');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('获取负债数据失败:', error);
        return null;
    }
}

// 保存编辑的负债信息
function saveEditedLiability(liabilityId, button) {
    const liabilityName = document.getElementById('liability-name').value;
    const liabilityValue = parseFloat(document.getElementById('liability-value').value) || 0;
    const liabilityRate = parseFloat(document.getElementById('liability-rate').value) || 0;
    const liabilityMonthly = parseFloat(document.getElementById('liability-monthly').value) || 0;

    // 验证输入
    if (!liabilityName) {
        showNotification('负债名称不能为空', 'error');
        return;
    }

    // 在实际项目中，这里会调用API更新负债信息
    // 这里仅做模拟更新
    const liabilityIndex = testData.liabilities.details.findIndex(l => l.id === liabilityId);
    if (liabilityIndex !== -1) {
        testData.liabilities.details[liabilityIndex].name = liabilityName;
        testData.liabilities.details[liabilityIndex].remaining = liabilityValue;
        testData.liabilities.details[liabilityIndex].rate = liabilityRate;
        testData.liabilities.details[liabilityIndex].monthly = liabilityMonthly;

        // 更新剩余负债总额
        updateLiabilitiesTotal();

        // 关闭弹窗
        button.closest('.modal').remove();

        // 显示成功提示
        showNotification('负债信息更新成功');

        // 重新生成负债表格
        generateLiabilitiesTable();
    }
}

// 确认删除负债
function confirmDeleteLiability(liabilityId, button) {
    // 在实际项目中，这里会调用API删除负债
    // 这里仅做模拟删除
    const liabilityIndex = testData.liabilities.details.findIndex(l => l.id === liabilityId);
    if (liabilityIndex !== -1) {
        // 从数组中删除负债
        testData.liabilities.details.splice(liabilityIndex, 1);

        // 更新剩余负债总额
        updateLiabilitiesTotal();

        // 关闭弹窗
        button.closest('.modal').remove();

        // 显示成功提示
        showNotification('负债删除成功');

        // 重新生成负债表格
        generateLiabilitiesTable();
    }
}

// 更新负债总额
function updateLiabilitiesTotal() {
    const totalRemaining = testData.liabilities.details.reduce((sum, liability) => sum + liability.remaining, 0);
    testData.liabilities.total = totalRemaining;

    // 更新UI显示
    if (document.getElementById('totalLiabilities')) {
        document.getElementById('totalLiabilities').textContent = `¥${formatNumber(totalRemaining)}`;
    }
}

// 等待DOM完全加载后执行所有逻辑
document.addEventListener('DOMContentLoaded', function() {
    // 封装通用工具函数：移除指定ID的弹窗（减少重复代码）
    const removeExistingModal = (modalId) => {
        const existingModal = document.getElementById(modalId);
        if (existingModal) existingModal.remove();
    };

    // ====================== 资产表格事件委托（核心：绑定到静态父元素） ======================
    // 【重要】请确认资产表格的实际父元素选择器：
    // 1. 若表格类名是 asset-table（单数），则改为 '.asset-table'
    // 2. 若tbody的ID是 asset-table-body，也可改为 '#asset-table-body'
    const assetTableParent = document.querySelector('.assets-table') || document.querySelector('#asset-table-body');
    if (assetTableParent) {
        assetTableParent.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const target = e.target;
            const assetId = target.getAttribute('data-id');
            if (!assetId) return; // 无data-id则直接返回
            const assetIdNum = parseInt(assetId);
            const asset = testData.assets.details.find(a => a.id === assetIdNum);
            if (!asset) return; // 未找到数据则返回

            // 编辑按钮逻辑
            if (target.classList.contains('action-link') && target.classList.contains('edit')) {
                console.info('编辑资产按钮点击，ID：', assetIdNum);
                window.currentAssetId = assetIdNum; // 挂载到window避免作用域问题
                removeExistingModal('edit-asset-modal');
                createEditAssetModal(asset); // 调用你原有的编辑弹窗创建函数
            }

            // 删除按钮逻辑
            if (target.classList.contains('action-link') && target.classList.contains('delete')) {
                window.currentAssetId = assetIdNum;
                removeExistingModal('delete-asset-modal');
                createDeleteAssetModal(asset); // 调用你原有的删除弹窗创建函数
            }

            // 查看按钮逻辑
            if (target.classList.contains('action-link') && target.classList.contains('view')) {
                removeExistingModal('view-asset-modal');
                createViewAssetModal(asset); // 调用你原有的查看弹窗创建函数
            }
        });
    } else {
        console.warn('未找到资产表格父元素，请检查选择器类名是否正确');
    }

    // ====================== 负债表格事件委托 ======================
    // 【重要】请确认负债表格的实际类名是 liabilities-table（与你代码一致）
    const liabilityTableParent = document.querySelector('.liabilities-table');
    if (liabilityTableParent) {
        liabilityTableParent.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const target = e.target;
            const liabilityId = target.getAttribute('data-id');
            if (!liabilityId) return;
            const liabilityIdNum = parseInt(liabilityId);
            const liability = testData.liabilities.details.find(l => l.id === liabilityIdNum);
            if (!liability) return;

            // 查看按钮逻辑
            if (target.classList.contains('action-link') && target.classList.contains('view')) {
                createLiabilityViewModal(liability); // 封装后的负债查看弹窗
            }

            // 编辑按钮逻辑
            if (target.classList.contains('action-link') && target.classList.contains('edit')) {
                createLiabilityEditModal(liability); // 封装后的负债编辑弹窗
            }

            // 删除按钮逻辑
            if (target.classList.contains('action-link') && target.classList.contains('delete')) {
                createLiabilityDeleteModal(liability); // 封装后的负债删除弹窗
            }
        });
    } else {
        console.warn('未找到负债表格父元素，请检查选择器类名是否正确');
    }

    // ====================== 封装负债弹窗创建函数（减少重复代码） ======================
    // 负债查看弹窗
    function createLiabilityViewModal(liability) {
        const modal = document.createElement('div');
        modal.className = 'modal show';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>负债详情</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="asset-detail-item"><span class="label">负债名称：</span><span>${liability.name}</span></div>
                    <div class="asset-detail-item"><span class="label">负债类型：</span><span>${getLiabilityTypeName(liability.type)}</span></div>
                    <div class="asset-detail-item"><span class="label">负债总额：</span><span>¥${formatNumber(liability.total)}</span></div>
                    <div class="asset-detail-item"><span class="label">剩余负债：</span><span>¥${formatNumber(liability.remaining)}</span></div>
                    <div class="asset-detail-item"><span class="label">利率：</span><span>${liability.rate}%</span></div>
                    <div class="asset-detail-item"><span class="label">月还款额：</span><span>¥${formatNumber(liability.monthly)}</span></div>
                    <div class="asset-detail-item"><span class="label">下次还款日：</span><span>${liability.nextPaymentDate || '已还清'}</span></div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary close-modal">关闭</button>
                </div>
            </div>
        `;
        // 绑定弹窗关闭事件（解耦内联onclick，更易维护）
        modal.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => modal.remove());
        });
        document.body.appendChild(modal);
    }

    // 负债编辑弹窗
    function createLiabilityEditModal(liability) {
        const modal = document.createElement('div');
        modal.className = 'modal show';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>编辑负债</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="edit-liability-form">
                        <div class="form-group">
                            <label for="liability-name">负债名称</label>
                            <input type="text" id="liability-name" class="form-control" value="${liability.name}">
                        </div>
                        <div class="form-group">
                            <label for="liability-value">剩余负债</label>
                            <input type="number" id="liability-value" class="form-control" value="${liability.remaining}" min="0" step="0.01">
                        </div>
                        <div class="form-group">
                            <label for="liability-rate">利率</label>
                            <input type="number" id="liability-rate" class="form-control" value="${liability.rate}" min="0" step="0.01">
                        </div>
                        <div class="form-group">
                            <label for="liability-monthly">月还款额</label>
                            <input type="number" id="liability-monthly" class="form-control" value="${liability.monthly}" min="0" step="0.01">
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-cancel close-modal">取消</button>
                    <button class="btn btn-primary" onclick="saveEditedLiability(${liability.id}, this)">保存</button>
                </div>
            </div>
        `;
        modal.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => modal.remove());
        });
        document.body.appendChild(modal);
    }

    // 负债删除弹窗
    function createLiabilityDeleteModal(liability) {
        const modal = document.createElement('div');
        modal.className = 'modal show';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>确认删除</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <p>确定要删除 <span style="font-weight: bold;">${liability.name}</span> 吗？</p>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-cancel close-modal">取消</button>
                    <button class="btn btn-danger" onclick="confirmDeleteLiability(${liability.id}, this)">删除</button>
                </div>
            </div>
        `;
        modal.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => modal.remove());
        });
        document.body.appendChild(modal);
    }
});
