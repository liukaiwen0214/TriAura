// 避免与全局作用域冲突
const ShikigamiTable = {
    // ------------------------------
    // 状态管理 - 存储组件所有状态数据
    // ------------------------------
    state: {
        currentPage: 1,           // 当前页码
        pageSize: 10,             // 每页条数
        totalCount: 0,            // 总数据量
        totalPages: 0,            // 总页数
        data: [],                 // 当前页展示的数据
        allData: [],              // 存储原始数据，用于筛选
        selectedId: null,         // 当前选中项ID（用于删除确认）
        // 筛选条件
        filters: {
            rarity: 'all',        // 稀有度筛选
            raritySort: 'none',   // 稀有度排序
            cv: 'all',            // 声优筛选
            region: 'all',        // 地域筛选
            searchTerm: ''        // 搜索关键词
        }
    },

    // ------------------------------
    // 初始化相关 - 组件初始化与基础设置
    // ------------------------------
    /**
     * 组件初始化入口函数
     * 依次执行DOM缓存、事件绑定、数据加载
     */
    init() {
        this.cacheDOM();
        this.bindEvents();
        this.loadData();
    },

    /**
     * 缓存DOM元素
     * 将页面中需要操作的DOM元素缓存到实例属性，避免重复查询
     */
    cacheDOM() {
        // 表格与分页元素
        this.$tableBody = document.getElementById('tableBody');
        this.$pagination = document.getElementById('pagination');
        this.$firstPage = document.getElementById('firstPage');
        this.$prevPage = document.getElementById('prevPage');
        this.$nextPage = document.getElementById('nextPage');
        this.$lastPage = document.getElementById('lastPage');
        this.$pageNumbers = document.getElementById('pageNumbers');
        this.$totalCount = document.getElementById('totalCount');
        this.$currentPage = document.getElementById('currentPage');
        this.$totalPages = document.getElementById('totalPages');
        this.$pageSizeSelect = document.getElementById('pageSizeSelect');
        this.$emptyData = document.getElementById('emptyData');
        this.$tableLoading = document.getElementById('tableLoading');

        // 删除对话框元素
        this.$deleteConfirmDialog = document.getElementById('deleteConfirmDialog');
        this.$cancelDelete = document.getElementById('cancelDelete');
        this.$confirmDelete = document.getElementById('confirmDelete');

        // 筛选控件元素
        this.$rarityFilter = document.getElementById('shikigami-filter');
        this.$raritySort = document.getElementById('rarity-sort');
        this.$cvFilter = document.getElementById('cv-filter');
        this.$regionFilter = document.getElementById('region-filter');
        this.$searchInput = document.getElementById('search-input');
        this.$searchBtn = document.getElementById('search-btn');

        // 查看对话框元素
        this.$viewDialog = document.getElementById('viewDialog');
        this.$closeViewDialog = document.getElementById('closeViewDialog');
        this.$viewAvatarImage = document.getElementById('viewAvatarImage');
        this.$viewShikigamiName = document.getElementById('viewShikigamiName');
        this.$viewRarityBadge = document.getElementById('viewRarityBadge');
        this.$viewId = document.getElementById('viewId');
        this.$viewType = document.getElementById('viewType');
        this.$viewCv = document.getElementById('viewCv');
        this.$viewRegion = document.getElementById('viewRegion');
        this.$viewReleaseDate = document.getElementById('viewReleaseDate');

        // 编辑对话框元素
        this.editDialog = document.getElementById('editDialog');
        this.editAvatarImage = document.getElementById('editAvatarImage');
        this.avatarUpload = document.getElementById('avatarUpload');
        this.editName = document.getElementById('editName');
        this.editRarity = document.getElementById('editRarity');
        this.editType = document.getElementById('editType');
        this.editCv = document.getElementById('editCv');
        this.editRegion = document.getElementById('editRegion');
        this.editReleaseDate = document.getElementById('editReleaseDate');
        this.cancelEditBtn = document.getElementById('cancelEdit');
        this.saveEditBtn = document.getElementById('saveEdit');
    },

    /**
     * 绑定事件处理函数
     * 为页面中所有交互元素绑定事件监听
     */
    bindEvents() {
        // 分页控件事件
        this.$firstPage.addEventListener('click', () => this.goToPage(1));
        this.$prevPage.addEventListener('click', () => this.goToPage(this.state.currentPage - 1));
        this.$nextPage.addEventListener('click', () => this.goToPage(this.state.currentPage + 1));
        this.$lastPage.addEventListener('click', () => this.goToPage(this.state.totalPages));
        this.$pageSizeSelect.addEventListener('change', () => {
            this.state.pageSize = parseInt(this.$pageSizeSelect.value);
            this.state.currentPage = 1;
            this.loadData();
        });

        // 删除确认对话框事件
        this.$cancelDelete.addEventListener('click', () => this.hideDeleteDialog());
        this.$confirmDelete.addEventListener('click', () => this.confirmDelete());
        this.$deleteConfirmDialog.addEventListener('click', (e) => {
            if (e.target === this.$deleteConfirmDialog) this.hideDeleteDialog();
        });

        // 筛选控件事件
        this.$rarityFilter.addEventListener('change', () => this.applyFilters());
        this.$raritySort.addEventListener('change', () => this.applyFilters());
        this.$cvFilter.addEventListener('change', () => this.applyFilters());
        this.$regionFilter.addEventListener('change', () => this.applyFilters());
        this.$searchBtn.addEventListener('click', () => this.applyFilters());
        this.$searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.applyFilters();
        });

        // 查看对话框事件
        this.$closeViewDialog.addEventListener('click', () => this.hideViewDialog());
        this.$viewDialog.addEventListener('click', (e) => {
            if (e.target === this.$viewDialog) this.hideViewDialog();
        });

        // 编辑对话框事件
        this.cancelEditBtn.addEventListener('click', () => this.hideEditDialog());
        this.saveEditBtn.addEventListener('click', () => this.handleSaveEdit());
        this.avatarUpload.addEventListener('change', (e) => this.handleAvatarUpload(e));
        this.editDialog.addEventListener('click', (e) => {
            if (e.target === this.editDialog) this.hideEditDialog();
        });
    },

    // ------------------------------
    // 数据加载与处理 - 数据获取与管理
    // ------------------------------
    /**
     * 加载数据主函数
     * 优先从API获取数据，失败时使用模拟数据
     */
    async loadData() {
        this.showLoading();
        try {
            const data = await this.fetchData();
            this.state.allData = data.items; // 保存原始数据
            this.filterAndSortData();        // 初始化筛选和排序
            this.initFilterOptions();        // 初始化筛选选项
            this.renderTable();
            this.renderPagination();
            this.updateEmptyState();
            this.checkImagesLoaded();        // 等待图片加载完成后隐藏加载状态
        } catch (error) {
            console.error('加载数据失败:', error);
            this.useMockData();              // 降级使用模拟数据
            this.hideLoading();
        }
    },

    /**
     * 从API获取数据
     * @returns {Promise} 包含式神数据的Promise对象
     */
    async fetchData() {
        const response = await fetch(requestUrl + '/shikigami/all-content');
        if (!response.ok) {
            throw new Error(`HTTP错误! 状态: ${response.status}`);
        }
        const shikigamiList = await response.json();
        return {
            items: shikigamiList.data,
            totalCount: shikigamiList.data.length
        };
    },

    /**
     * 使用模拟数据（API调用失败时降级方案）
     */
    useMockData() {
        const mockData = this.getMockData();
        this.state.allData = mockData.items;
        this.state.filters = {
            rarity: 'all',
            raritySort: 'none',
            cv: 'all',
            region: 'all',
            searchTerm: ''
        };
        this.filterAndSortData();
        this.initFilterOptions();
        this.renderTable();
        this.renderPagination();
        this.updateEmptyState();
    },

    /**
     * 生成模拟数据
     * @returns {Object} 包含模拟数据和总数的对象
     */
    getMockData() {
        const items = [
            { shikigami_id: 1, name: '茨木童子', rarity: 'N', type: '输出', cv: '福山润', region: '平安京', release_date: '2016-09-09', head_image: null },
            { shikigami_id: 2, name: '大天狗', rarity: 'R', type: '输出', cv: '前野智昭', region: '平安京', release_date: '2016-09-09', head_image: null },
            // ... 省略部分模拟数据 ...
            { shikigami_id: 15, name: '小鹿男', rarity: 'SSR', type: '辅助', cv: '河西健吾', region: '森罗万象', release_date: '2017-04-21', head_image: null }
        ];
        return { items, totalCount: items.length };
    },

    /**
     * 检查所有图片是否加载完成
     * 确保图片加载完成后再隐藏加载状态
     */
    checkImagesLoaded() {
        const images = document.querySelectorAll('.head_image-cell img');
        if (images.length === 0) {
            this.hideLoading();
            return;
        }

        let loadedCount = 0;
        const totalImages = images.length;

        images.forEach(img => {
            if (img.complete) {
                loadedCount++;
                if (loadedCount === totalImages) this.hideLoading();
            } else {
                img.addEventListener('load', () => {
                    loadedCount++;
                    if (loadedCount === totalImages) this.hideLoading();
                });
                img.addEventListener('error', () => {
                    loadedCount++;
                    if (loadedCount === totalImages) this.hideLoading();
                });
            }
        });
    },

    // ------------------------------
    // 筛选与排序 - 数据过滤与排序逻辑
    // ------------------------------
    /**
     * 应用筛选条件
     * 更新筛选状态并重新渲染页面
     */
    applyFilters() {
        this.state.filters.rarity = this.$rarityFilter.value;
        this.state.filters.raritySort = this.$raritySort.value;
        this.state.filters.cv = this.$cvFilter.value;
        this.state.filters.region = this.$regionFilter.value;
        this.state.filters.searchTerm = this.$searchInput.value.trim();

        this.state.currentPage = 1; // 重置到第一页
        this.filterAndSortData();   // 执行筛选排序
        this.renderTable();
        this.renderPagination();
        this.updateEmptyState();
    },

    /**
     * 筛选和排序数据
     * 根据当前筛选条件对原始数据进行过滤和排序
     */
    filterAndSortData() {
        const { rarity, raritySort, cv, region, searchTerm } = this.state.filters;
        let filtered = [...this.state.allData];

        // 稀有度筛选
        if (rarity !== 'all') {
            filtered = filtered.filter(item => item.rarity === rarity);
        }

        // 声优筛选
        if (cv !== 'all') {
            filtered = filtered.filter(item => item.cv === cv);
        }

        // 地域筛选
        if (region !== 'all') {
            filtered = filtered.filter(item => item.region === region);
        }

        // 模糊搜索（名称）
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(item =>
                item.name.toLowerCase().includes(term)
            );
        }

        // 稀有度排序
        if (raritySort !== 'none') {
            const rarityOrder = ['N', 'R', 'SR', 'SSR', 'SP', 'UR'];
            filtered.sort((a, b) => {
                const indexA = rarityOrder.indexOf(a.rarity);
                const indexB = rarityOrder.indexOf(b.rarity);
                return raritySort === 'asc' ? indexA - indexB : indexB - indexA;
            });
        }

        // 更新状态数据
        this.state.data = filtered;
        this.state.totalCount = filtered.length;
        this.state.totalPages = Math.ceil(this.state.totalCount / this.state.pageSize);
    },

    /**
     * 初始化筛选选项
     * 从原始数据中提取唯一值，填充筛选下拉框
     */
    initFilterOptions() {
        // 提取所有唯一的声优
        const cvs = [...new Set(this.state.allData.map(item => item.cv))];
        // 提取所有唯一的地域
        const regions = [...new Set(this.state.allData.map(item => item.region))];

        // 填充声优筛选选项
        this.$cvFilter.innerHTML = '<option value="all">所有</option>';
        cvs.forEach(cv => {
            const option = document.createElement('option');
            option.value = cv;
            option.textContent = cv;
            this.$cvFilter.appendChild(option);
        });

        // 填充地域筛选选项
        this.$regionFilter.innerHTML = '<option value="all">所有</option>';
        regions.forEach(region => {
            const option = document.createElement('option');
            option.value = region;
            option.textContent = region;
            this.$regionFilter.appendChild(option);
        });
    },

    // ------------------------------
    // 表格与分页渲染 - 页面UI渲染逻辑
    // ------------------------------
    /**
     * 渲染表格内容
     * 根据当前页数据生成表格行并绑定操作事件
     */
    renderTable() {
        if (!this.$tableBody) return;
        this.$tableBody.innerHTML = '';

        const startIndex = (this.state.currentPage - 1) * this.state.pageSize;
        const endIndex = Math.min(startIndex + this.state.pageSize, this.state.data.length);
        const pageData = this.state.data.slice(startIndex, endIndex);

        pageData.forEach(item => {
            const row = document.createElement('tr');
            row.className = `rarity-${item.rarity.toLowerCase()}`;
            row.innerHTML = `
                <td class="name-cell">${item.name}</td>
                <td class="head_image-cell">${this.gethead_imageContent(item)}</td>
                <td><span class="rarity-badge rarity-${item.rarity.toLowerCase()}">${item.rarity}</span></td>
                <td>${item.type}</td>
                <td>${item.cv}</td>
                <td>${item.region}</td>
                <td>${item.release_date.split(' ')[0]}</td>
                <td class="action-cell">
                    <button class="action-btn view" data-id="${item.shikigami_id}">查看</button>
                    <button class="action-btn edit" data-id="${item.shikigami_id}">编辑</button>
                    <button class="action-btn delete" data-id="${item.shikigami_id}">删除</button>
                </td>
            `;

            // 绑定查看按钮事件
            row.querySelectorAll('.action-btn.view').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.showViewDialog(btn.dataset.id);
                });
            });

            // 绑定编辑按钮事件
            row.querySelectorAll('.action-btn.edit').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.showEditDialog(btn.dataset.id);
                });
            });

            // 绑定删除按钮事件
            row.querySelectorAll('.action-btn.delete').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.showDeleteDialog(btn.dataset.id);
                });
            });

            this.$tableBody.appendChild(row);
        });
    },

    /**
     * 渲染分页控件
     * 更新分页信息和按钮状态
     */
    renderPagination() {
        if (!this.$pagination) return;

        // 更新分页信息
        this.$totalCount.textContent = this.state.totalCount;
        this.$currentPage.textContent = this.state.currentPage;
        this.$totalPages.textContent = this.state.totalPages;

        // 更新分页按钮状态
        this.$firstPage.disabled = this.state.currentPage === 1;
        this.$prevPage.disabled = this.state.currentPage === 1;
        this.$nextPage.disabled = this.state.currentPage === this.state.totalPages || this.state.totalPages === 0;
        this.$lastPage.disabled = this.state.currentPage === this.state.totalPages || this.state.totalPages === 0;

        // 渲染页码按钮
        this.renderPageNumbers();
    },

    /**
     * 渲染页码按钮
     * 动态生成页码，只显示当前页附近的页码（最多5个）
     */
    renderPageNumbers() {
        if (!this.$pageNumbers) return;
        this.$pageNumbers.innerHTML = '';

        const totalPages = this.state.totalPages;
        const currentPage = this.state.currentPage;
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);

        // 调整起始页，确保显示5个页码
        if (endPage - startPage < 4) {
            startPage = Math.max(1, endPage - 4);
        }

        // 添加上一页省略号
        if (startPage > 1) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            this.$pageNumbers.appendChild(ellipsis);
        }

        // 添加页码按钮
        for (let i = startPage; i <= endPage; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `pagination-btn ${i === currentPage ? 'active' : ''}`;
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', () => this.goToPage(i));
            this.$pageNumbers.appendChild(pageBtn);
        }

        // 添加下一页省略号
        if (endPage < totalPages) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            this.$pageNumbers.appendChild(ellipsis);
        }
    },

    /**
     * 跳转到指定页码
     * @param {Number} page - 目标页码
     */
    goToPage(page) {
        if (page < 1 || page > this.state.totalPages || page === this.state.currentPage) {
            return;
        }
        this.state.currentPage = page;
        this.renderTable();
        this.renderPagination();
        this.updateEmptyState();
    },

    /**
     * 更新空状态显示
     * 当数据为空时显示空状态提示
     */
    updateEmptyState() {
        if (!this.$emptyData) return;
        this.$emptyData.style.display = this.state.data.length === 0 ? 'block' : 'none';
    },

    // ------------------------------
    // 查看对话框 - 查看详情功能
    // ------------------------------
    /**
     * 显示查看对话框
     * @param {Number} id - 式神ID
     */
    showViewDialog(id) {
        const item = this.state.data.find(item => item.shikigami_id === parseInt(id));
        if (!item) return;

        // 填充对话框数据
        this.$viewShikigamiName.textContent = item.name;
        this.$viewRarityBadge.textContent = item.rarity;
        this.$viewRarityBadge.className = `view-rarity-badge rarity-${item.rarity.toLowerCase()}`;
        this.$viewId.textContent = item.shikigami_id;
        this.$viewType.textContent = item.type || '-';
        this.$viewCv.textContent = item.cv || '-';
        this.$viewRegion.textContent = item.region || '-';

        // 格式化日期
        if (item.release_date) {
            const date = item.release_date.split(' ')[0];
            this.$viewReleaseDate.textContent = date;
        } else {
            this.$viewReleaseDate.textContent = '-';
        }

        // 设置头像
        if (item.head_image && item.head_image !== 'null' && item.head_image !== '') {
            const imageUrl = item.head_image.startsWith('/') ?
                requestUrl + item.head_image :
                requestUrl + '/util/image/' + item.rarity + '/' + item.head_image;
            this.$viewAvatarImage.src = imageUrl;
            this.$viewAvatarImage.style.display = 'block';
        } else {
            this.$viewAvatarImage.src = '';
            this.$viewAvatarImage.style.display = 'none';
        }

        // 显示对话框
        this.$viewDialog.style.display = 'flex';
    },

    /**
     * 隐藏查看对话框
     */
    hideViewDialog() {
        this.$viewDialog.style.display = 'none';
    },

    // ------------------------------
    // 编辑对话框 - 编辑数据功能
    // ------------------------------
    /**
     * 显示编辑对话框
     * @param {Number} id - 式神ID
     */
    showEditDialog(id) {
        const shikigami = this.state.data.find(item => item.shikigami_id === parseInt(id));
        if (!shikigami) return;

        this.currentEditId = shikigami.shikigami_id; // 保存当前编辑ID

        // 填充表单数据
        this.editName.value = shikigami.name || '';
        this.editRarity.value = shikigami.rarity || 'R';
        this.editType.value = shikigami.type || '输出';
        this.editCv.value = shikigami.cv || '';
        this.editRegion.value = shikigami.region || '';

        // 格式化日期
        if (shikigami.release_date) {
            const date = new Date(shikigami.release_date);
            this.editReleaseDate.value = date.toISOString().split('T')[0];
        } else {
            this.editReleaseDate.value = '';
        }

        // 设置头像
        if (shikigami.head_image) {
            const avatarUrl = shikigami.head_image.startsWith('http')
                ? shikigami.head_image
                : `${this.state.baseUrl}${shikigami.head_image}`;
            this.editAvatarImage.src = avatarUrl;
        } else {
            this.editAvatarImage.src = `${this.state.baseUrl}/static/images/default-avatar.png`;
        }

        // 重置文件上传
        this.avatarUpload.value = '';

        // 显示对话框
        this.editDialog.style.display = 'flex';
    },

    /**
     * 隐藏编辑对话框
     */
    hideEditDialog() {
        this.editDialog.style.display = 'none';
        this.currentEditId = null;
    },

    /**
     * 处理头像上传预览
     * @param {Event} event - 上传事件
     */
    handleAvatarUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        // 预览图片
        const reader = new FileReader();
        reader.onload = (e) => {
            this.editAvatarImage.src = e.target.result;
        };
        reader.readAsDataURL(file);

        // 验证文件大小
        if (file.size > 5 * 1024 * 1024) {
            alert('图片大小不能超过5MB');
            this.avatarUpload.value = '';
            return;
        }
    },

    /**
     * 处理保存编辑内容
     * 验证表单并更新数据
     */
    handleSaveEdit() {
        // 验证表单
        if (!this.editName.value.trim()) {
            alert('请输入名称');
            return;
        }

        // 收集表单数据
        const formData = {
            shikigami_id: this.currentEditId,
            name: this.editName.value.trim(),
            rarity: this.editRarity.value,
            type: this.editType.value,
            cv: this.editCv.value.trim(),
            region: this.editRegion.value.trim(),
            releaseDate: this.editReleaseDate.value
        };

        this.showLoading();

        // 模拟保存操作（实际项目中替换为API调用）
        setTimeout(() => {
            this.updateShikigamiData(formData); // 更新数据
            this.renderTable();                 // 刷新表格
            this.hideEditDialog();              // 隐藏对话框
            this.hideLoading();                 // 隐藏加载状态
            alert('保存成功！');
        }, 500);
    },

    /**
     * 更新式神数据
     * @param {Object} updatedData - 更新后的数据
     */
    updateShikigamiData(updatedData) {
        // 更新当前页数据
        const index = this.state.data.findIndex(item => item.shikigami_id === updatedData.shikigami_id);
        const updatedItem = {
            ...this.state.data[index],
            name: updatedData.name,
            rarity: updatedData.rarity,
            type: updatedData.type,
            cv: updatedData.cv,
            region: updatedData.region,
            release_date: updatedData.releaseDate
        };
        this.state.data[index] = updatedItem;

        // 同步更新原始数据
        const allDataIndex = this.state.allData.findIndex(item => item.shikigami_id === parseInt(updatedData.shikigami_id));
        if (allDataIndex !== -1) {
            this.state.allData[allDataIndex] = { ...this.state.allData[allDataIndex], ...updatedItem };
        }
    },

    // ------------------------------
    // 删除对话框 - 删除数据功能
    // ------------------------------
    /**
     * 显示删除确认对话框
     * @param {Number} id - 式神ID
     */
    showDeleteDialog(id) {
        this.state.selectedId = id;
        if (this.$deleteConfirmDialog) {
            this.$deleteConfirmDialog.style.display = 'flex';
        }
    },

    /**
     * 隐藏删除确认对话框
     */
    hideDeleteDialog() {
        this.state.selectedId = null;
        if (this.$deleteConfirmDialog) {
            this.$deleteConfirmDialog.style.display = 'none';
        }
    },

    /**
     * 确认删除操作
     * 从数据中移除选中项并更新UI
     */
    confirmDelete() {
        // 过滤掉要删除的数据
        this.state.data = this.state.data.filter(item => item.shikigami_id !== parseInt(this.state.selectedId));
        this.state.totalCount = this.state.data.length;
        this.state.totalPages = Math.ceil(this.state.totalCount / this.state.pageSize);

        // 处理当前页无数据的情况
        if (this.state.currentPage > this.state.totalPages && this.state.totalPages > 0) {
            this.state.currentPage = this.state.totalPages;
        }

        // 更新UI
        this.renderTable();
        this.renderPagination();
        this.updateEmptyState();
        this.hideDeleteDialog();
    },

    // ------------------------------
    // 工具函数 - 辅助功能
    // ------------------------------
    /**
     * 获取头像显示内容（带降级处理）
     * @param {Object} item - 式神数据项
     * @returns {String} 头像HTML字符串
     */
    gethead_imageContent(item) {
        if (item.head_image && item.head_image !== 'null' && item.head_image !== '') {
            // 构建头像URL
            const imageUrl = item.head_image.startsWith('/') ?
                requestUrl + item.head_image :
                requestUrl + '/util/image/' + item.rarity + '/' + item.head_image;
            return `
                <div class="head_image-container">
                    <img style="width: 40px; height: 40px;" src="${imageUrl}" alt="${item.name}" class="head_image" crossorigin="anonymous">
                </div>
            `;
        } else {
            // 无头像时显示名称首字符
            let defaultText = item.name.charAt(0);
            return `
                <div class="head_image-container">
                    <div class="head_image-placeholder">${defaultText}</div>
                </div>
            `;
        }
    },

    /**
     * 显示加载状态
     */
    showLoading() {
        if (this.$tableLoading) {
            this.$tableLoading.style.display = 'flex';
        }
    },

    /**
     * 隐藏加载状态
     */
    hideLoading() {
        if (this.$tableLoading) {
            this.$tableLoading.style.display = 'none';
        }
    }
};

// 页面加载完成后初始化组件
document.addEventListener('DOMContentLoaded', () => {
    ShikigamiTable.init();
});