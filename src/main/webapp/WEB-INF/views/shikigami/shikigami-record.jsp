<%--
  Created by IntelliJ IDEA.
  User: liukaiwen
  Date: 2025/11/26
  Time: 17:29
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" %>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TriAura - 式神录</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/static/css/tiraura.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/static/css/shikigami/shikigami-record.css">
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
<% request.setAttribute("activePage", "game"); %>

<%-- 引入导航栏组件 --%>
<%@ include file="/WEB-INF/views/navbar.jsp" %>

<!-- 主要内容区域 -->
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

        <!-- 表格组件区域 -->
        <section class="table-section">
            <div class="table-container">
                <!-- 表格加载状态 -->
                <div id="tableLoading" class="table-loading" style="display: none;">
                    <div class="loading-spinner"></div>
                    <p>加载数据中...</p>
                </div>

                <div class="table-header">
                    <h3>式神录</h3>
                    <div class="table-controls">
                        <!-- 稀有度筛选 -->
                        <label for="shikigami-filter">稀有度</label>
                        <select id="shikigami-filter" class="filter-select">
                            <option value="all">所有</option>
                            <option value="N">N</option>
                            <option value="R">R</option>
                            <option value="SR">SR</option>
                            <option value="SSR">SSR</option>
                            <option value="SP">SP</option>
                            <option value="UR">UR</option>
                        </select>

                        <!-- 稀有度排序 -->
                        <label for="rarity-sort">稀有度排序</label>
                        <select id="rarity-sort" class="filter-select">
                            <option value="none">默认</option>
                            <option value="asc">升序</option>
                            <option value="desc">降序</option>
                        </select>

                        <!-- 声优筛选 -->
                        <label for="cv-filter">声优</label>
                        <select id="cv-filter" class="filter-select">
                            <option value="all">所有</option>
                            <!-- 选项将通过JavaScript动态添加 -->
                        </select>

                        <!-- 地域筛选 -->
                        <label for="region-filter">地域</label>
                        <select id="region-filter" class="filter-select">
                            <option value="all">所有</option>
                            <!-- 选项将通过JavaScript动态添加 -->
                        </select>

                        <!-- 模糊查询 -->
                        <div class="search-container">
                            <label for="search-input"></label>
                            <input type="text" id="search-input" placeholder="搜索式神名称..." class="search-input">
                            <button id="search-btn" class="search-btn">查询</button>
                        </div>
                    </div>
                </div>
                <!-- 表格主体 -->
                <div class="table-wrapper">
                    <table id="shikigamiTable" class="data-table">
                        <thead>
                        <tr>
                            <th>式神名称</th>
                            <th>头像</th>
                            <th>稀有度</th>
                            <th>类型</th>
                            <th>声优</th>
                            <th>地域名称</th>
                            <th>上线日期</th>
                            <th>操作</th>
                        </tr>
                        </thead>
                        <tbody id="tableBody">
                        <!-- 表格数据将由JavaScript动态生成 -->
                        </tbody>
                    </table>
                </div>

                <!-- 空数据提示 -->
                <div id="emptyData" class="empty-data" style="display: none;">
                    <p>暂无数据</p>
                </div>

                <!-- 分页控制 -->
                <div id="pagination" class="pagination">
                    <div class="pagination-info">
                        <span>共 <span id="totalCount">0</span> 条记录，第 <span id="currentPage">1</span>/<span
                                id="totalPages">0</span> 页</span>
                    </div>
                    <div class="pagination-controls">
                        <button id="firstPage" class="pagination-btn" disabled>首页</button>
                        <button id="prevPage" class="pagination-btn" disabled>上一页</button>
                        <div id="pageNumbers" class="page-numbers">
                            <!-- 页码将由JavaScript动态生成 -->
                        </div>
                        <button id="nextPage" class="pagination-btn" disabled>下一页</button>
                        <button id="lastPage" class="pagination-btn" disabled>末页</button>
                    </div>
                    <div class="pagination-size">
                        <label for="pageSizeSelect">每页显示：</label>
                        <select id="pageSizeSelect">
                            <option value="10">10条</option>
                            <option value="20">20条</option>
                            <option value="50">50条</option>
                        </select>
                    </div>
                </div>
            </div>
        </section>
    </div>
</main>

<!-- 确认删除对话框 -->
<div id="deleteConfirmDialog" class="dialog-overlay" style="display: none;">
    <div class="dialog-content">
        <h3>确认删除</h3>
        <p>确定要删除此条记录吗？此操作不可撤销。</p>
        <div class="dialog-actions">
            <button id="cancelDelete" class="dialog-btn cancel close-button">取消</button>
            <button id="confirmDelete" class="dialog-btn confirm delete-button">删除</button>
        </div>
    </div>
</div>

<!-- 查看详情对话框 -->
<div id="viewDialog" class="dialog-overlay" style="display: none;">
    <div class="dialog-content view-dialog">
        <h3>式神详情</h3>

        <!-- 头像显示区域 -->
        <div class="view-avatar-container">
            <div class="view-avatar">
                <img id="viewAvatarImage" src="" alt="式神头像" class="view-avatar-image">
            </div>
            <h4 id="viewShikigamiName" class="view-shikigami-name"></h4>
            <div id="viewRarityBadge" class="view-rarity-badge"></div>
        </div>

        <!-- 详细信息区域 -->
        <div class="view-details">
            <div class="detail-row">
                <div class="detail-label">ID</div>
                <div id="viewId" class="detail-value"></div>
            </div>

            <div class="detail-row">
                <div class="detail-label">类型</div>
                <div id="viewType" class="detail-value"></div>
            </div>

            <div class="detail-row">
                <div class="detail-label">声优</div>
                <div id="viewCv" class="detail-value"></div>
            </div>

            <div class="detail-row">
                <div class="detail-label">地域名称</div>
                <div id="viewRegion" class="detail-value"></div>
            </div>

            <div class="detail-row">
                <div class="detail-label">上线日期</div>
                <div id="viewReleaseDate" class="detail-value"></div>
            </div>
        </div>

        <!-- 对话框按钮 -->
        <div class="dialog-actions">
            <button id="closeViewDialog" class="dialog-btn confirm close-button">关闭</button>
        </div>
    </div>
</div>

<!-- 编辑信息对话框 -->
<div id="editDialog" class="dialog-overlay" style="display: none;">
    <div class="dialog-content edit-dialog">
        <h3>编辑式神信息</h3>

        <!-- 头像显示和上传区域 -->
        <div class="edit-avatar-container">
            <div class="edit-avatar">
                <img id="editAvatarImage" src="" alt="式神头像" class="edit-avatar-image">
            </div>
            <input type="file" id="avatarUpload" accept="image/*" class="avatar-upload-input">
            <label for="avatarUpload" class="avatar-upload-label">更换头像</label>
        </div>

        <!-- 编辑表单区域 -->
        <div class="edit-form">
            <div class="form-group">
                <label for="editName">名称</label>
                <input type="text" id="editName" class="form-input">
            </div>

            <div class="form-group">
                <label for="editRarity">稀有度</label>
                <select id="editRarity" class="form-select">
                    <option value="R">R</option>
                    <option value="SR">SR</option>
                    <option value="SSR">SSR</option>
                    <option value="SP">SP</option>
                    <option value="UR">UR</option>
                </select>
            </div>

            <div class="form-group">
                <label for="editType">类型</label>
                <select id="editType" class="form-select">
                    <option value="输出">输出</option>
                    <option value="控制">控制</option>
                    <option value="辅助">辅助</option>
                    <option value="治疗">治疗</option>
                    <option value="坦克">坦克</option>
                </select>
            </div>

            <div class="form-group">
                <label for="editCv">声优</label>
                <input type="text" id="editCv" class="form-input">
            </div>

            <div class="form-group">
                <label for="editRegion">地域名称</label>
                <input type="text" id="editRegion" class="form-input">
            </div>

            <div class="form-group">
                <label for="editReleaseDate">上线日期</label>
                <input type="date" id="editReleaseDate" class="form-input">
            </div>
        </div>

        <!-- 对话框按钮 -->
        <div class="dialog-actions">
            <button id="cancelEdit" class="dialog-btn cancel close-button">取消</button>
            <button id="saveEdit" class="dialog-btn confirm save-button">保存</button>
        </div>
    </div>
</div>

<script src="${pageContext.request.contextPath}/static/script/tiraura.js"></script>
<script src="${pageContext.request.contextPath}/static/script/shikigami/shikigami-record.js"></script>
</body>
</html>