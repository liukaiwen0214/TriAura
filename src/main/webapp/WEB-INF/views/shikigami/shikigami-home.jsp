<%--
  Created by IntelliJ IDEA.
  User: liukaiwen
  Date: 2025/12/4
  Time: 09:12
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" %>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TriAura - 游戏管理</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/static/css/tiraura.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/static/css/shikigami/shikigami-home.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
<div id="loadingOverlay" class="loading-overlay">
    <div class="loading-content">
        <div class="loading-spinner"></div>
        <div class="loading-text">正在加载游戏数据...</div>
        <div class="loading-subtext">平安京守护中...</div>
    </div>
</div>
<%-- 设置当前活动页面为生活管理 --%>
<% request.setAttribute("activePage", "game"); %>

<%-- 引入导航栏组件 --%>
<%@ include file="/WEB-INF/views/navbar.jsp" %>


<div id="navbar-container"></div>

<main class="main-content">
    <div class="content-container">
        <!-- 欢迎区域 -->
        <section class="welcome-section">
            <div class="welcome-content">
                <h1>欢迎回来</h1>
                <p>这里是您的生活、游戏、工作管理中心</p>
            </div>
        </section>

        <!-- 快速访问区域 -->
        <section class="quick-access">
            <div></div>
        </section>
        <section class="activity-gantt-section">
            <div class="section-header">
                <h2><i class="fas fa-chart-gantt"></i> 活动跟踪</h2>
                <div class="view-controls">
                    <button class="view-btn active" data-view="month">月视图</button>
                    <button class="view-btn" data-view="week">周视图</button>
                    <button class="add-activity-btn">
                        <i class="fas fa-plus"></i> 添加活动
                    </button>
                    <button class="today-btn">
                        <i class="fas fa-calendar-day"></i> 回到当天
                    </button>
                </div>
            </div>

            <div class="gantt-container">
                <div class="gantt-header">
                    <div class="timeline-header">
                        <div class="timeline-days"></div>
                    </div>
                </div>
                <div class="gantt-body"></div>
                <div class="gantt-scrollbar">
                    <div class="scrollbar-track">
                        <div class="scrollbar-thumb" id="scrollbarThumb"></div>
                    </div>
                </div>
            </div>

            <!-- 活动列表展示 -->
            <div class="activity-list-section">
                <div class="activity-list-container" id="activityListContainer">
                    <!-- 活动列表将动态生成 -->
                </div>
            </div>
        </section>

        <!-- 资源详情弹窗 -->
        <div id="resourceDetailModal" class="modal">
            <div class="modal-content resource-modal-content">
                <div class="modal-header">
                    <h3 id="resourceModalTitle">资源详情</h3>
                    <button type="button" class="close-btn">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="resource-summary">
                        <div class="resource-detail-header">
                            <div class="resource-detail-icon">
                                <i id="resourceDetailIcon" class="fas fa-gem"></i>
                            </div>
                            <div class="resource-detail-info">
                                <h4 id="resourceDetailName">勾玉</h4>
                                <div class="resource-detail-amount" id="resourceDetailAmount">+2,456</div>
                            </div>
                        </div>
                    </div>

                    <div class="resource-details-tabs">
                        <button class="tab-btn active" data-tab="records">获取记录</button>
                    </div>

                    <!-- 时间筛选控件 -->
                    <div class="time-filter-container">
                        <div class="time-filter-label">时间范围：</div>
                        <div class="time-filter-options">
                            <button class="time-filter-btn active" data-period="week">本周</button>
                            <button class="time-filter-btn" data-period="month">本月</button>
                            <button class="time-filter-btn" data-period="year">本年</button>
                            <button class="time-filter-btn" data-period="all">全部</button>
                        </div>
                        <div class="custom-date-range">
                            <input type="date" id="startDate" class="date-input">
                            <span class="date-separator">至</span>
                            <input type="date" id="endDate" class="date-input">
                            <button class="apply-date-btn" id="applyDateFilter">应用</button>
                        </div>
                    </div>

                    <div class="tab-content">
                        <div class="tab-pane active" id="records-tab">
                            <div class="resource-records">
                                <div class="table-container">
                                    <table class="resource-table">
                                        <thead>
                                        <tr>
                                            <th>时间</th>
                                            <th>来源</th>
                                            <th>数量</th>
                                            <th>类型</th>
                                        </tr>
                                        </thead>
                                        <tbody id="resourceRecordsBody">
                                        <!-- 动态生成记录 -->
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="cancel-btn">关闭</button>
                    <button type="button" class="export-btn">导出数据</button>
                </div>
            </div>
        </div>

        <!-- 添加任务弹窗 -->
        <div id="addTaskModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3 id="taskModalTitle">添加任务</h3>
                    <button type="button" class="close-btn">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="addTaskForm">
                        <div class="form-group">
                            <label for="taskName">任务名称</label>
                            <input type="text" id="taskName" name="taskName" required aria-required="true"
                                   placeholder="请输入任务名称">
                        </div>

                        <div class="form-group">
                            <label for="rewardType">奖励类型</label>
                            <select id="rewardType" name="rewardType" required aria-required="true">
                                <option value="">请选择奖励类型</option>
                                <option value="勾玉">勾玉</option>
                                <option value="神秘符咒">神秘符咒</option>
                                <option value="金币">金币</option>
                                <option value="经验">经验</option>
                                <option value="达摩">达摩</option>
                                <option value="御魂">御魂</option>
                                <option value="觉醒材料">觉醒材料</option>
                                <option value="御灵">御灵</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="customReward">自定义奖励类型</label>
                            <input type="text" id="customReward" name="customReward"
                                   placeholder="如需要自定义奖励类型，请在此输入">
                        </div>

                        <div class="form-group">
                            <label for="rewardAmount">奖励数量</label>
                            <input type="number" id="rewardAmount" name="rewardAmount" min="1" required
                                   aria-required="true" placeholder="请输入奖励数量">
                        </div>

                        <input type="hidden" id="taskType" name="taskType">
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="cancel-btn">取消</button>
                    <button type="submit" form="addTaskForm" class="save-btn">保存</button>
                </div>
            </div>
        </div>

        <div id="addActivityModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>添加活动</h3>
                    <button type="button" class="close-btn">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="addActivityForm">
                        <div class="form-group">
                            <label for="activityName">活动名称</label>
                            <input type="text" id="activityName" name="activityName" required aria-required="true">
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="startDate">开始日期</label>
                                <input type="date" id="startDate" name="startDate" required aria-required="true">
                            </div>
                            <div class="form-group">
                                <label for="endDate">结束日期</label>
                                <input type="date" id="endDate" name="endDate" required aria-required="true">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="activityColor">活动颜色</label>
                                <div class="color-options">
                                    <label class="color-option">
                                        <input type="radio" name="activityColor" value="#000000" checked>
                                        <span class="color-swatch" style="background-color: #000000;"></span>
                                    </label>
                                    <label class="color-option">
                                        <input type="radio" name="activityColor" value="#FF6B6B">
                                        <span class="color-swatch" style="background-color: #FF6B6B;"></span>
                                    </label>
                                    <label class="color-option">
                                        <input type="radio" name="activityColor" value="#4ECDC4">
                                        <span class="color-swatch" style="background-color: #4ECDC4;"></span>
                                    </label>
                                    <label class="color-option">
                                        <input type="radio" name="activityColor" value="#45B7D1">
                                        <span class="color-swatch" style="background-color: #45B7D1;"></span>
                                    </label>
                                    <label class="color-option">
                                        <input type="radio" name="activityColor" value="#96CEB4">
                                        <span class="color-swatch" style="background-color: #96CEB4;"></span>
                                    </label>
                                    <label class="color-option">
                                        <input type="radio" name="activityColor" value="#FFEAA7">
                                        <span class="color-swatch" style="background-color: #FFEAA7;"></span>
                                    </label>
                                    <label class="color-option">
                                        <input type="radio" name="activityColor" value="#DDA0DD">
                                        <span class="color-swatch" style="background-color: #DDA0DD;"></span>
                                    </label>
                                    <label class="color-option">
                                        <input type="radio" name="activityColor" value="#98D8C8">
                                        <span class="color-swatch" style="background-color: #98D8C8;"></span>
                                    </label>
                                    <label class="color-option">
                                        <input type="radio" name="activityColor" value="#FFB6C1">
                                        <span class="color-swatch" style="background-color: #FFB6C1;"></span>
                                    </label>
                                    <label class="color-option">
                                        <input type="radio" name="activityColor" value="#FFA07A">
                                        <span class="color-swatch" style="background-color: #FFA07A;"></span>
                                    </label>
                                    <label class="color-option">
                                        <input type="radio" name="activityColor" value="#87CEEB">
                                        <span class="color-swatch" style="background-color: #87CEEB;"></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="cancel-btn">取消</button>
                    <button type="submit" form="addActivityForm" class="save-btn">保存</button>
                </div>
            </div>
        </div>

        <!-- 任务管理区域 -->
        <section class="task-management-section">
            <div class="task-cards-grid">

                <!-- 每日任务 -->
                <div class="task-card daily-tasks">
                    <div class="card-header">
                        <h3><i class="fas fa-calendar-day"></i> 每日任务</h3>
                        <div class="task-controls">
                            <button class="add-task-btn" data-type="daily">
                                <i class="fas fa-plus"></i>
                            </button>
                            <div class="countdown-timer" id="dailyCountdown">
                                <i class="fas fa-clock"></i>
                                <span>重置：12:34:56</span>
                            </div>
                        </div>
                    </div>
                    <div class="task-list">
                        <div class="task-item completed" data-task-id="daily-1">
                            <div class="task-checkbox">
                                <i class="fas fa-check"></i>
                            </div>
                            <div class="task-content">
                                <span class="task-name">完成3次御魂挑战</span>
                                <span class="task-reward">+100勾玉</span>
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
                        <div class="task-item completed" data-task-id="daily-2">
                            <div class="task-checkbox">
                                <i class="fas fa-check"></i>
                            </div>
                            <div class="task-content">
                                <span class="task-name">参与1次结界突破</span>
                                <span class="task-reward">+50经验</span>
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
                        <div class="task-item" data-task-id="daily-3">
                            <div class="task-checkbox"></div>
                            <div class="task-content">
                                <span class="task-name">完成1次探索副本</span>
                                <span class="task-reward">+30金币</span>
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
                        <div class="task-item" data-task-id="daily-4">
                            <div class="task-checkbox"></div>
                            <div class="task-content">
                                <span class="task-name">使用N卡进行觉醒</span>
                                <span class="task-reward">+20达摩</span>
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
                    </div>
                </div>

                <!-- 每周任务 -->
                <div class="task-card weekly-tasks">
                    <div class="card-header">
                        <h3><i class="fas fa-calendar-week"></i> 每周任务</h3>
                        <div class="task-controls">
                            <button class="add-task-btn" data-type="weekly">
                                <i class="fas fa-plus"></i>
                            </button>
                            <div class="countdown-timer" id="weeklyCountdown">
                                <i class="fas fa-clock"></i>
                                <span>重置：3天5小时</span>
                            </div>
                        </div>
                    </div>
                    <div class="task-list">
                        <div class="task-item completed" data-task-id="weekly-1">
                            <div class="task-checkbox">
                                <i class="fas fa-check"></i>
                            </div>
                            <div class="task-content">
                                <span class="task-name">达成段位斗技</span>
                                <span class="task-reward">+200勾玉</span>
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
                        <div class="task-item completed" data-task-id="weekly-2">
                            <div class="task-checkbox">
                                <i class="fas fa-check"></i>
                            </div>
                            <div class="task-content">
                                <span class="task-name">收集10个碎片</span>
                                <span class="task-reward">+神秘符咒</span>
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
                        <div class="task-item" data-task-id="weekly-3">
                            <div class="task-checkbox"></div>
                            <div class="task-content">
                                <span class="task-name">完成10次协同斗技</span>
                                <span class="task-reward">+100金币</span>
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
                        <div class="task-item" data-task-id="weekly-4">
                            <div class="task-checkbox"></div>
                            <div class="task-content">
                                <span class="task-name">觉醒5个式神</span>
                                <span class="task-reward">+50经验</span>
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
                    </div>
                </div>
            </div>
        </section>

        <!-- 月度资源统计 -->
        <section class="monthly-resources-section">
            <div class="section-header">
                <h2><i class="fas fa-chart-line"></i> 本月资源统计</h2>
                <div class="period-info">
                    <span id="currentMonth">2023年12月</span>
                    <div class="total-earned">
                        <i class="fas fa-arrow-up"></i>
                        <span>总计获得：15,680勾玉</span>
                    </div>
                </div>
            </div>

            <div class="resources-grid">
                <div class="resource-stat-card">
                    <div class="resource-icon">
                        <i class="fas fa-gem"></i>
                    </div>
                    <div class="resource-data">
                        <div class="resource-name">勾玉</div>
                        <div class="resource-amount">+2,456</div>
                        <div class="resource-total"><span class="total-label">总量：</span><span class="total-value">12,456</span>
                            <span class="total-change positive">(+12,456)</span></div>
                        <div class="resource-source">周任务 70% | 活动 30%</div>
                    </div>
                </div>

                <div class="resource-stat-card">
                    <div class="resource-icon">
                        <i class="fas fa-coins"></i>
                    </div>
                    <div class="resource-data">
                        <div class="resource-name">金币</div>
                        <div class="resource-amount">+156.8K</div>
                        <div class="resource-total"><span class="total-label">总量：</span><span class="total-value">286.5K</span>
                            <span class="total-change positive">(+286.5K)</span></div>
                        <div class="resource-source">周任务 60% | 日常 40%</div>
                    </div>
                </div>

                <div class="resource-stat-card">
                    <div class="resource-icon">
                        <i class="fas fa-scroll"></i>
                    </div>
                    <div class="resource-data">
                        <div class="resource-name">神秘符咒</div>
                        <div class="resource-amount">+45</div>
                        <div class="resource-total"><span class="total-label">总量：</span><span
                                class="total-value">125</span> <span class="total-change positive">(+125)</span></div>
                        <div class="resource-source">周任务 80% | 活动 20%</div>
                    </div>
                </div>

                <div class="resource-stat-card">
                    <div class="resource-icon">
                        <i class="fas fa-dice"></i>
                    </div>
                    <div class="resource-data">
                        <div class="resource-name">御魂</div>
                        <div class="resource-amount">+1,234</div>
                        <div class="resource-total"><span class="total-label">总量：</span><span class="total-value">3,234</span>
                            <span class="total-change positive">(+3,234)</span></div>
                        <div class="resource-source">周任务 50% | 探索 50%</div>
                    </div>
                </div>
            </div>
        </section>

        <!-- 式神收集统计（缩小版） -->
        <section class="shikigami-stats-compact">
            <div class="compact-header">
                <h3><i class="fas fa-chart-pie"></i> 式神收集概览</h3>
                <a href="#" class="view-detail-btn">
                    查看详情 <i class="fas fa-arrow-right"></i>
                </a>
            </div>

            <div class="stats-compact-grid">
                <div class="stat-item">
                    <div class="stat-label">总收集</div>
                    <div class="stat-value">286</div>
                    <div class="stat-progress">286/400</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">UR</div>
                    <div class="stat-value">8</div>
                    <div class="stat-progress">8/12</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">SP</div>
                    <div class="stat-value">12</div>
                    <div class="stat-progress">12/20</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">SSR</div>
                    <div class="stat-value">63</div>
                    <div class="stat-progress">63/85</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">SR</div>
                    <div class="stat-value">98</div>
                    <div class="stat-progress">98/130</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">R</div>
                    <div class="stat-value">82</div>
                    <div class="stat-progress">82/110</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">N</div>
                    <div class="stat-value">23</div>
                    <div class="stat-progress">23/43</div>
                </div>
            </div>
        </section>


    </div>
</main>

<script src="${pageContext.request.contextPath}/static/script/tiraura.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script src="${pageContext.request.contextPath}/static/script/shikigami/shikigami-home.js"></script>
</body>
</html>
