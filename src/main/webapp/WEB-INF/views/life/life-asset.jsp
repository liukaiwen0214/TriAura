<%--
  Created by IntelliJ IDEA.
  User: liukaiwen
  Date: 2025/11/21
  Time: 09:43
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TriAura - 资产管理</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/static/css/tiraura.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/static/css/life/life-asset.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
<!-- 毛玻璃罩子 -->
<div id="loadingOverlay" class="loading-overlay">
    <div class="loading-content">
        <div class="loading-spinner"></div>
        <div class="loading-text">正在加载生活管理数据...</div>
        <div class="loading-subtext">请稍候，精彩即将呈现</div>
    </div>
</div>

<%-- 设置当前活动页面为生活管理 --%>
<% request.setAttribute("activePage", "life"); %>

<%-- 引入导航栏组件 --%>
<%@ include file="/WEB-INF/views/navbar.jsp" %>

<!-- 主要内容区域 - 资产管理页面 -->
<main class="main-content">
    <div class="asset-management-container">
        <!-- 页面标题 -->
        <section class="page-header">
            <h1>资产管理</h1>
            <p>全面掌握您的资产状况，智能分析财务健康</p>
        </section>

        <!-- 功能操作区 -->
        <section class="action-section">
            <div class="action-buttons">
                <button class="action-btn primary" id="addIncomeBtn">
                    <i class="fas fa-plus"></i> 记录收入
                </button>
                <button class="action-btn primary" id="addExpenseBtn">
                    <i class="fas fa-minus"></i> 记录支出
                </button>
                <button class="action-btn primary" id="addAssetBtn">
                    <i class="fas fa-plus-circle"></i> 添加资产
                </button>
                <button class="action-btn primary" id="addLiabilityBtn">
                    <i class="fas fa-times-circle"></i> 添加负债
                </button>
                <button class="action-btn secondary" id="syncDataBtn">
                    <i class="fas fa-sync-alt"></i> 同步数据
                </button>
            </div>
            <div class="data-management">
                <button class="data-btn" id="importDataBtn">
                    <i class="fas fa-upload"></i> 导入
                </button>
                <button class="data-btn" id="exportDataBtn">
                    <i class="fas fa-download"></i> 导出
                </button>
                <button class="data-btn" id="backupDataBtn">
                    <i class="fas fa-hdd"></i> 备份
                </button>
            </div>
        </section>

        <!-- 核心总览区域 -->
        <section class="overview-section">
            <!-- 净资产概览 -->
            <div class="net-worth-overview">
                <h2>净资产概览</h2>
                <div class="net-worth-display">
                    <div class="net-worth-value">
                        <span class="currency">¥</span>
                        <span class="amount" id="netWorthAmount">458,720</span>
                    </div>
                    <div class="net-worth-trend positive">
                        <i class="fas fa-arrow-up"></i>
                        <span>+12,350</span>
                        <span>较上月</span>
                    </div>
                </div>

                <!-- 净资产趋势图 -->
                <div class="trend-chart-container">
                    <div class="chart-filters">
                        <button class="chart-filter active" data-period="3m">近3个月</button>
                        <button class="chart-filter" data-period="6m">近6个月</button>
                        <button class="chart-filter" data-period="1y">近1年</button>
                        <button class="chart-filter" data-period="all">全部</button>
                    </div>
                    <!-- 净资产趋势图 -->
                    <div style="height: 300px;">
                        <canvas id="netWorthChart"></canvas>
                    </div>
                </div>
            </div>

            <!-- 资产与负债快照 -->
            <div class="assets-liabilities-snapshot">
                <div class="snapshot-cards">
                    <div class="snapshot-card assets" id="totalAssetsCard">
                        <div class="card-header">
                            <h3>总资产</h3>
                            <i class="fas fa-chevron-down expand-icon"></i>
                        </div>
                        <div class="card-value">
                            <span class="currency">¥</span>
                            <span class="amount" id="totalAssetsAmount">685,300</span>
                        </div>
                        <div class="card-details hidden" id="assetsDetails">
                            <div class="assets-summary">
                                <div class="summary-item">
                                    <div class="summary-label">现金及存款</div>
                                    <div class="summary-value">¥171,325 (25%)</div>
                                </div>
                                <div class="summary-item">
                                    <div class="summary-label">投资资产</div>
                                    <div class="summary-value">¥314,867 (45.9%)</div>
                                </div>
                                <div class="summary-item">
                                    <div class="summary-label">实物资产</div>
                                    <div class="summary-value">¥199,108 (29.1%)</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="snapshot-card liabilities" id="totalLiabilitiesCard">
                        <div class="card-header">
                            <h3>总负债</h3>
                            <i class="fas fa-chevron-down expand-icon"></i>
                        </div>
                        <div class="card-value">
                            <span class="currency">¥</span>
                            <span class="amount" id="totalLiabilitiesAmount">226,580</span>
                        </div>
                        <div class="card-details hidden" id="liabilitiesDetails">
                            <div class="liabilities-summary">
                                <div class="summary-item">
                                    <div class="summary-label">房贷</div>
                                    <div class="summary-value">¥190,000 (83.8%)</div>
                                </div>
                                <div class="summary-item">
                                    <div class="summary-label">信用卡</div>
                                    <div class="summary-value">¥5,280 (2.3%)</div>
                                </div>
                                <div class="summary-item">
                                    <div class="summary-label">其他负债</div>
                                    <div class="summary-value">¥31,300 (13.9%)</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 关键指标卡 -->
                <div class="key-indicators">
                    <div class="indicator-card">
                        <div class="indicator-icon">
                            <i class="fas fa-shield-alt"></i>
                        </div>
                        <div class="indicator-info">
                            <div class="indicator-label">紧急备用金覆盖率</div>
                            <div class="indicator-value sufficient">充足 (6个月)</div>
                        </div>
                    </div>

                    <div class="indicator-card">
                        <div class="indicator-icon">
                            <i class="fas fa-balance-scale"></i>
                        </div>
                        <div class="indicator-info">
                            <div class="indicator-label">资产负债率</div>
                            <div class="indicator-value">33.06%</div>
                        </div>
                    </div>

                    <div class="indicator-card">
                        <div class="indicator-icon">
                            <i class="fas fa-chart-pie"></i>
                        </div>
                        <div class="indicator-info">
                            <div class="indicator-label">投资资产占比</div>
                            <div class="indicator-value">45.8%</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- 资产分布分析区域 -->
        <section class="asset-distribution-section">
            <h2>资产分布分析</h2>

            <div class="asset-distribution-overview">
                <!-- 环形图容器 -->
                <div class="chart-container" style="height: 350px;">
                    <canvas id="assetDistributionChart"></canvas>
                </div>
            </div>

            <div class="asset-details">
                <div class="table-header">
                    <h3>资产明细列表</h3>
                    <div class="table-controls">
                        <select id="asset-filter" class="filter-select">
                            <option value="all">全部类别</option>
                            <option value="现金及存款">现金及存款</option>
                            <option value="股票">股票</option>
                            <option value="基金">基金</option>
                            <option value="不动产">不动产</option>
                            <option value="车辆">车辆</option>
                        </select>
                        <select id="asset-sort" class="sort-select">
                            <option value="value-desc">按价值从高到低</option>
                            <option value="value-asc">按价值从低到高</option>
                            <option value="profit-desc">按收益率从高到低</option>
                            <option value="profit-asc">按收益率从低到高</option>
                        </select>
                    </div>
                </div>

                <div class="table-responsive">
                    <table class="asset-table">
                        <thead>
                        <tr>
                            <th>资产名称</th>
                            <th>类别</th>
                            <th>当前价值</th>
                            <th>占比</th>
                            <th>成本价</th>
                            <th>收益率</th>
                            <th>操作</th>
                        </tr>
                        </thead>
                        <tbody id="asset-table-body">
                        <!-- 表格数据将通过JS动态生成 -->
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="asset-insights">
                <h3>资产分布洞察</h3>
                <div class="insight-cards">
                    <div class="insight-card">
                        <div class="insight-icon">
                            <i class="fas fa-chart-line"></i>
                        </div>
                        <div class="insight-content">
                            <p>您的投资资产占比45.9%，配置较为合理</p>
                        </div>
                    </div>
                    <div class="insight-card">
                        <div class="insight-icon">
                            <i class="fas fa-home"></i>
                        </div>
                        <div class="insight-content">
                            <p>不动产占比26.3%，处于合理范围</p>
                        </div>
                    </div>
                    <div class="insight-card">
                        <div class="insight-icon">
                            <i class="fas fa-shield-alt"></i>
                        </div>
                        <div class="insight-content">
                            <p>现金储备充足，占总资产25.0%，流动性良好</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- 收支分析区域 -->
        <section class="income-expense-section">
            <h2>收支分析</h2>

            <!-- 时间周期选择器 -->
            <div class="period-selector">
                <button class="period-btn active" data-period="month">本月</button>
                <button class="period-btn" data-period="quarter">本季度</button>
                <button class="period-btn" data-period="year">本年</button>
                <button class="period-btn" data-period="custom">自定义</button>
                <span class="current-period">2023年10月 收支情况</span>
            </div>

            <!-- 核心收支指标 -->
            <div class="income-expense-indicators">
                <div class="indicator-card">
                    <div class="indicator-title">总收入</div>
                    <div class="indicator-value primary">¥28,500</div>
                    <div class="indicator-trend positive">
                        <i class="fas fa-arrow-up"></i>
                        <span>+5.2%</span>
                    </div>
                </div>
                <div class="indicator-card">
                    <div class="indicator-title">总支出</div>
                    <div class="indicator-value secondary">¥18,750</div>
                    <div class="indicator-trend negative">
                        <i class="fas fa-arrow-down"></i>
                        <span>-2.8%</span>
                    </div>
                </div>
                <div class="indicator-card">
                    <div class="indicator-title">月度结余</div>
                    <div class="indicator-value success">¥9,750</div>
                </div>
                <div class="indicator-card">
                    <div class="indicator-title">储蓄率</div>
                    <div class="indicator-value info">34.2%</div>
                </div>
            </div>

            <!-- 收支趋势分析 -->
            <div class="income-expense-trend" style="height: 300px;">
                <h3>收支趋势（近12个月）</h3>
                <canvas id="incomeExpenseChart"></canvas>
            </div>

            <!-- 收入与支出构成分析 -->
            <div class="income-expense-composition">
                <h3>收入支出构成分析</h3>
                <div class="composition-charts">
                    <!-- 收入来源构成 -->
                    <div class="composition-chart income-sources">
                        <div class="chart-header">
                            <h4>收入来源</h4>
                        </div>
                        <div class="chart-container" style="height: 250px;">
                            <canvas id="incomeSourcesChart"></canvas>
                        </div>
                    </div>

                    <!-- 支出分类构成 -->
                    <div class="composition-chart expense-categories">
                        <div class="chart-header">
                            <h4>支出分类</h4>
                        </div>
                        <div class="chart-container" style="height: 250px;">
                            <canvas id="expenseCategoriesChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 支出TOP榜 -->
            <div class="top-expenses">
                <h3>支出TOP榜</h3>
                <div class="top-expenses-list">
                    <div class="expense-item">
                        <div class="expense-info">
                            <div class="expense-name">住房相关</div>
                            <div class="expense-amount">¥8,000</div>
                        </div>
                        <div class="expense-bar">
                            <div class="expense-bar-fill" style="width: 100%;"></div>
                        </div>
                    </div>
                    <div class="expense-item">
                        <div class="expense-info">
                            <div class="expense-name">餐饮食品</div>
                            <div class="expense-amount">¥4,400</div>
                        </div>
                        <div class="expense-bar">
                            <div class="expense-bar-fill" style="width: 55%;"></div>
                        </div>
                    </div>
                    <div class="expense-item">
                        <div class="expense-info">
                            <div class="expense-name">交通出行</div>
                            <div class="expense-amount">¥2,400</div>
                        </div>
                        <div class="expense-bar">
                            <div class="expense-bar-fill" style="width: 30%;"></div>
                        </div>
                    </div>
                    <div class="expense-item">
                        <div class="expense-info">
                            <div class="expense-name">其他支出</div>
                            <div class="expense-amount">¥2,400</div>
                        </div>
                        <div class="expense-bar">
                            <div class="expense-bar-fill" style="width: 30%;"></div>
                        </div>
                    </div>
                    <div class="expense-item">
                        <div class="expense-info">
                            <div class="expense-name">娱乐休闲</div>
                            <div class="expense-amount">¥2,000</div>
                        </div>
                        <div class="expense-bar">
                            <div class="expense-bar-fill" style="width: 25%;"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- 负债管理区域 -->
        <section class="liabilities-section">
            <!-- 负债概览 -->
            <div class="liabilities-overview">
                <div class="overview-cards">
                    <div class="overview-card">
                        <div class="card-title">总负债</div>
                        <div class="card-value">¥270,000</div>
                    </div>
                    <div class="overview-card">
                        <div class="card-title">月度还款总额</div>
                        <div class="card-value">¥5,200</div>
                    </div>
                    <div class="overview-card">
                        <div class="card-title">平均负债利率</div>
                        <div class="card-value">4.25%</div>
                    </div>
                </div>
            </div>
            <div class="table-header">
                <!-- 负债明细 -->
                <h3>负债明细</h3>
            </div>
                <div class="table-responsive">
                    <div class="asset-table">
                        <table class="liabilities-table">
                            <thead>
                            <tr>
                                <th>负债名称</th>
                                <th>类型</th>
                                <th>负债总额</th>
                                <th>剩余负债</th>
                                <th>利率</th>
                                <th>月还款额</th>
                                <th>下次还款日</th>
                                <th>操作</th>
                            </tr>
                            </thead>
                            <tbody id="asset-table-body">
                            <!-- 负债表格数据将通过JS动态生成 -->
                            </tbody>
                        </table>
                    </div>
                </div>
        </section>

        <!-- 提醒与通知区域 -->
        <section class="notifications-section">
            <div class="notifications-container">
                <!-- 待办提醒 -->
                <div class="reminders">
                    <h3>待办提醒</h3>
                    <div class="reminders-list">
                        <div class="reminder-item warning">
                            <i class="fas fa-credit-card"></i>
                            <span>信用卡还款：招商银行 (¥5,280) 将于3天后到期</span>
                        </div>
                        <div class="reminder-item info">
                            <i class="fas fa-home"></i>
                            <span>房贷月供 (¥5,800) 将于5天后自动扣款</span>
                        </div>
                        <div class="reminder-item success">
                            <i class="fas fa-chart-line"></i>
                            <span>基金定投计划：明天将自动买入XX基金 ¥2,000</span>
                        </div>
                    </div>
                </div>

                <!-- 财务健康提示 -->
                <div class="health-tips">
                    <h3>财务健康提示</h3>
                    <div class="tips-list">
                        <div class="tip-item positive">
                            <i class="fas fa-shield-alt"></i>
                            <span>您的紧急备用金充足，可覆盖6个月支出</span>
                        </div>
                        <div class="tip-item positive">
                            <i class="fas fa-chart-pie"></i>
                            <span>本月储蓄率为34.2%，高于上月2.1%</span>
                        </div>
                        <div class="tip-item neutral">
                            <i class="fas fa-balance-scale"></i>
                            <span>投资资产占比45.8%，建议保持或增加投资比例</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</main>

<!-- 页脚 -->
<!-- 编辑资产弹窗 -->
<div id="edit-asset-modal" class="modal" style="display: none;">
    <div class="modal-content">
        <div class="modal-header">
            <h3>编辑资产</h3>
            <button class="close-modal" onclick="closeModal('edit-asset-modal')">&times;</button>
        </div>
        <div class="modal-body">
            <form id="edit-asset-form">
                <div class="form-group">
                    <label for="asset-name">资产名称</label>
                    <input type="text" id="asset-name" class="form-control">
                </div>
                <div class="form-group">
                    <label for="asset-category">资产类别</label>
                    <select id="asset-category" class="form-control">
                        <option value="现金及存款">现金及存款</option>
                        <option value="投资基金">投资基金</option>
                        <option value="股票">股票</option>
                        <option value="数字资产">数字资产</option>
                        <option value="不动产">不动产</option>
                        <option value="车辆">车辆</option>
                        <option value="其他资产">其他资产</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="asset-value">资产价值</label>
                    <input type="number" id="asset-value" class="form-control" min="0" step="0.01">
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button class="btn btn-cancel" onclick="closeModal('edit-asset-modal')">取消</button>
            <button class="btn btn-primary" onclick="saveEditedAsset()">保存</button>
        </div>
    </div>
</div>

<!-- 脚本文件 -->
<script src="${pageContext.request.contextPath}/static/script/tiraura.js"></script>
<script src="${pageContext.request.contextPath}/static/script/life/life-asset.js"></script>
</body>
</html>
