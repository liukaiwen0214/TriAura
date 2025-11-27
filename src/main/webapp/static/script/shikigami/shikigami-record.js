// 避免与全局作用域冲突
const ShikigamiTable = {
    // 状态管理
    state: {
        currentPage: 1,
        pageSize: 10,
        totalCount: 0,
        totalPages: 0,
        data: [],
        allData: [], // 存储原始数据，用于筛选
        selectedId: null,
        // 筛选条件
        filters: {
            rarity: 'all',
            raritySort: 'none',
            cv: 'all',
            region: 'all',
            searchTerm: ''
        }
    },

    // 初始化函数
    init() {
        this.cacheDOM();
        this.bindEvents();
        this.loadData();
    },

    // 缓存DOM元素
    cacheDOM() {
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
        this.$deleteConfirmDialog = document.getElementById('deleteConfirmDialog');
        this.$cancelDelete = document.getElementById('cancelDelete');
        this.$confirmDelete = document.getElementById('confirmDelete');
        // 筛选控件
        this.$rarityFilter = document.getElementById('shikigami-filter');
        this.$raritySort = document.getElementById('rarity-sort');
        this.$cvFilter = document.getElementById('cv-filter');
        this.$regionFilter = document.getElementById('region-filter');
        this.$searchInput = document.getElementById('search-input');
        this.$searchBtn = document.getElementById('search-btn');
    },

    // 绑定事件
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

        // 点击遮罩层关闭对话框
        this.$deleteConfirmDialog.addEventListener('click', (e) => {
            if (e.target === this.$deleteConfirmDialog) {
                this.hideDeleteDialog();
            }
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
    },

    // 加载数据
    async loadData() {
        this.showLoading();
        try {
            // 尝试API调用，失败时使用模拟数据
            const data = await this.fetchData();
            this.state.allData = data.items; // 保存原始数据

            // 初始化筛选和排序
            this.filterAndSortData();

            // 初始化筛选选项
            this.initFilterOptions();

            this.renderTable();
            this.renderPagination();
            this.updateEmptyState();

            // 移除finally块中的hideLoading()，改为在图片加载完成后隐藏
            this.checkImagesLoaded();
        } catch (error) {
            console.error('加载数据失败:', error);
            // 使用模拟数据作为降级方案
            this.useMockData();

            // 模拟数据中没有实际图片，直接隐藏加载状态
            this.hideLoading();
        }
    },
    // 检查所有图片是否加载完成
    checkImagesLoaded() {
        const images = document.querySelectorAll('.head_image-cell img');
        if (images.length === 0) {
            // 没有图片需要加载，直接隐藏
            this.hideLoading();
            return;
        }

        let loadedCount = 0;
        const totalImages = images.length;

        images.forEach(img => {
            // 图片已经加载完成
            if (img.complete) {
                loadedCount++;
                if (loadedCount === totalImages) {
                    this.hideLoading();
                }
            } else {
                // 监听图片加载完成事件
                img.addEventListener('load', () => {
                    loadedCount++;
                    if (loadedCount === totalImages) {
                        this.hideLoading();
                    }
                });

                // 监听图片加载失败事件，也算作已处理
                img.addEventListener('error', () => {
                    loadedCount++;
                    if (loadedCount === totalImages) {
                        this.hideLoading();
                    }
                });
            }
        });
    },
    // API调用函数
    async fetchData() {
        const response = await fetch(requestUrl + '/shikigami/all-content');
        // 检查响应状态
        if (!response.ok) {
            throw new Error(`HTTP错误! 状态: ${response.status}`);
        }
        // 解析JSON响应
        const shikigamiList = await response.json();
        // 返回符合组件需求的数据格式
        return {
            items: shikigamiList.data,
            totalCount: shikigamiList.data.length
        };
    },

    // 使用模拟数据
    useMockData() {
        const mockData = this.getMockData();
        this.state.allData = mockData.items; // 保存原始数据
        this.state.filters = {
            rarity: 'all',
            raritySort: 'none',
            cv: 'all',
            region: 'all',
            searchTerm: ''
        };

        // 初始化筛选和排序
        this.filterAndSortData();

        // 初始化筛选选项
        this.initFilterOptions();

        this.renderTable();
        this.renderPagination();
        this.updateEmptyState();
    },

    // 获取模拟数据
    getMockData() {
        const items = [
            {
                id: 1,
                name: '茨木童子',
                rarity: 'N',
                type: '输出',
                cv: '福山润',
                region: '平安京',
                release_date: '2016-09-09',
                head_image: null
            },
            {
                id: 2,
                name: '大天狗',
                rarity: 'R',
                type: '输出',
                cv: '前野智昭',
                region: '平安京',
                release_date: '2016-09-09',
                head_image: null
            },
            {
                id: 3,
                name: '辉夜姬',
                rarity: 'SR',
                type: '辅助',
                cv: '竹达彩奈',
                region: '竹取物语',
                release_date: '2016-10-14',
                head_image: null
            },
            {
                id: 4,
                name: '荒川之主',
                rarity: 'SSR',
                type: '输出',
                cv: '子安武人',
                region: '荒川',
                release_date: '2016-11-25',
                head_image: null
            },
            {
                id: 5,
                name: '雪女',
                rarity: 'SP',
                type: '控制',
                cv: '诹访彩花',
                region: '雪山',
                release_date: '2016-09-09',
                head_image: null
            },
            {
                id: 6,
                name: '姑获鸟',
                rarity: 'UR',
                type: '输出',
                cv: '行成桃姬',
                region: '森林',
                release_date: '2016-09-09',
                head_image: null
            },
            {
                id: 7,
                name: '萤草',
                rarity: 'R',
                type: '治疗',
                cv: '诹访彩花',
                region: '森林',
                release_date: '2016-09-09',
                head_image: null
            },
            {
                id: 8,
                name: '三尾狐',
                rarity: 'R',
                type: '输出',
                cv: '泽城美雪',
                region: '青丘',
                release_date: '2016-09-09',
                head_image: null
            },
            {
                id: 9,
                name: '山兔',
                rarity: 'R',
                type: '辅助',
                cv: '丰崎爱生',
                region: '森林',
                release_date: '2016-09-09',
                head_image: null
            },
            {
                id: 10,
                name: '座敷童子',
                rarity: 'R',
                type: '辅助',
                cv: '竹内顺子',
                region: '平安京',
                release_date: '2016-09-09',
                head_image: null
            },
            {
                id: 11,
                name: '酒吞童子',
                rarity: 'SSR',
                type: '输出',
                cv: '阪口周平',
                region: '大江山',
                release_date: '2016-12-09',
                head_image: null
            },
            {
                id: 12,
                name: '青行灯',
                rarity: 'SSR',
                type: '输出',
                cv: '水树奈奈',
                region: '青行灯',
                release_date: '2017-01-20',
                head_image: null
            },
            {
                id: 13,
                name: '花鸟卷',
                rarity: 'SSR',
                type: '治疗',
                cv: '早见沙织',
                region: '画中世界',
                release_date: '2017-02-24',
                head_image: null
            },
            {
                id: 14,
                name: '彼岸花',
                rarity: 'SSR',
                type: '控制',
                cv: '大原沙耶香',
                region: '黄泉',
                release_date: '2017-03-24',
                head_image: null
            },
            {
                id: 15,
                name: '小鹿男',
                rarity: 'SSR',
                type: '辅助',
                cv: '河西健吾',
                region: '森罗万象',
                release_date: '2017-04-21',
                head_image: null
            }
        ];

        return {items, totalCount: items.length};
    },

    // 获取头像显示内容（带降级处理）
    // 获取头像显示内容（带降级处理）
    gethead_imageContent(item) {
        // 如果有头像且不为null/空字符串，返回图片
        if (item.head_image && item.head_image !== 'null' && item.head_image !== '') {
            // 确保使用正确的代理路径
            // 如果item.head_image已经是完整路径，则直接使用；如果只是文件名，则构建完整路径
            const imageUrl = item.head_image.startsWith('/') ?
                requestUrl + item.head_image :
                requestUrl + '/util/image/' + item.rarity + '/' + item.head_image;

            console.log('正在请求图片:', imageUrl); // 添加日志以便调试

            return `
        <div class="head_image-container">
            <img style="width: 40px; height: 40px;" src="${imageUrl}" alt="${item.name}" class="head_image" crossorigin="anonymous">
        </div>
    `;
        } else {
            // 如果没有头像或获取失败，使用式神名称的第一个字作为默认头像
            let defaultText = item.name.charAt(0);
            return `
        <div class="head_image-container">
            <div class="head_image-placeholder">${defaultText}</div>
        </div>
    `;
        }
    },

    // 渲染表格
    renderTable() {
        if (!this.$tableBody) return;

        this.$tableBody.innerHTML = '';

        const startIndex = (this.state.currentPage - 1) * this.state.pageSize;
        const endIndex = Math.min(startIndex + this.state.pageSize, this.state.data.length);
        const pageData = this.state.data.slice(startIndex, endIndex);

        pageData.forEach(item => {
            const row = document.createElement('tr');
            // 根据稀有度设置行类名
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
                        <button class="action-btn view" data-id="${item.id}">查看</button>
                        <button class="action-btn edit" data-id="${item.id}">编辑</button>
                        <button class="action-btn delete" data-id="${item.id}">删除</button>
                    </td>
                `;

            this.$tableBody.appendChild(row);
        });

        // 绑定行内操作按钮事件
        this.$tableBody.querySelectorAll('.btn-view').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleView(e.target.closest('.btn-view').dataset.id));
        });

        this.$tableBody.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleEdit(e.target.closest('.btn-edit').dataset.id));
        });

        this.$tableBody.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleDelete(e.target.closest('.btn-delete').dataset.id));
        });
    },


    // 渲染分页
    renderPagination() {
        if (!this.$pagination) return;

        // 更新分页信息
        this.$totalCount.textContent = this.state.totalCount;
        this.$currentPage.textContent = this.state.currentPage;
        this.$totalPages.textContent = this.state.totalPages;

        // 更新按钮状态
        this.$firstPage.disabled = this.state.currentPage === 1;
        this.$prevPage.disabled = this.state.currentPage === 1;
        this.$nextPage.disabled = this.state.currentPage === this.state.totalPages || this.state.totalPages === 0;
        this.$lastPage.disabled = this.state.currentPage === this.state.totalPages || this.state.totalPages === 0;

        // 渲染页码
        this.renderPageNumbers();
    },

    // 渲染页码
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

    // 跳转到指定页
    goToPage(page) {
        if (page < 1 || page > this.state.totalPages || page === this.state.currentPage) {
            return;
        }

        this.state.currentPage = page;
        // 直接渲染表格和分页，不调用loadData()
        this.renderTable();
        this.renderPagination();
        this.updateEmptyState();
    },

    // 更新空状态
    updateEmptyState() {
        if (!this.$emptyData) return;

        if (this.state.data.length === 0) {
            this.$emptyData.style.display = 'block';
        } else {
            this.$emptyData.style.display = 'none';
        }
    },

    // 显示加载状态
    showLoading() {
        if (this.$tableLoading) {
            this.$tableLoading.style.display = 'flex';
        }
    },

    // 隐藏加载状态
    hideLoading() {
        if (this.$tableLoading) {
            this.$tableLoading.style.display = 'none';
        }
    },

    // 显示删除确认对话框
    showDeleteDialog(id) {
        this.state.selectedId = id;
        if (this.$deleteConfirmDialog) {
            this.$deleteConfirmDialog.style.display = 'flex';
        }
    },

    // 隐藏删除确认对话框
    hideDeleteDialog() {
        this.state.selectedId = null;
        if (this.$deleteConfirmDialog) {
            this.$deleteConfirmDialog.style.display = 'none';
        }
    },

    // 确认删除
    confirmDelete() {
        // 模拟删除操作
        this.state.data = this.state.data.filter(item => item.id !== parseInt(this.state.selectedId));
        this.state.totalCount = this.state.data.length;
        this.state.totalPages = Math.ceil(this.state.totalCount / this.state.pageSize);

        // 如果当前页没有数据，回退到上一页
        if (this.state.currentPage > this.state.totalPages && this.state.totalPages > 0) {
            this.state.currentPage = this.state.totalPages;
        }

        this.renderTable();
        this.renderPagination();
        this.updateEmptyState();
        this.hideDeleteDialog();

        // 可以在这里添加删除成功的提示
    },

    // 处理查看操作
    handleView(id) {
        console.log('查看式神详情:', id);
        // 可以在这里添加查看详情的逻辑
    },

    // 处理编辑操作
    handleEdit(id) {
        console.log('编辑式神:', id);
        // 可以在这里添加编辑的逻辑
    },

    // 处理删除操作
    handleDelete(id) {
        this.showDeleteDialog(id);
    },
    // 应用筛选
    applyFilters() {
        // 更新筛选条件
        this.state.filters.rarity = this.$rarityFilter.value;
        this.state.filters.raritySort = this.$raritySort.value;
        this.state.filters.cv = this.$cvFilter.value;
        this.state.filters.region = this.$regionFilter.value;
        this.state.filters.searchTerm = this.$searchInput.value.trim();

        // 重置到第一页
        this.state.currentPage = 1;

        // 执行筛选和排序
        this.filterAndSortData();

        // 重新渲染
        this.renderTable();
        this.renderPagination();
        this.updateEmptyState();

    },

// 筛选和排序数据
    filterAndSortData() {
        const {rarity, raritySort, cv, region, searchTerm} = this.state.filters;

        // 从原始数据中筛选
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

        // 模糊搜索
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

        // 更新数据
        this.state.data = filtered;
        this.state.totalCount = filtered.length;
        this.state.totalPages = Math.ceil(this.state.totalCount / this.state.pageSize);
    },
// 初始化筛选选项
    initFilterOptions() {
        // 提取所有唯一的声优
        const cvs = [...new Set(this.state.allData.map(item => item.cv))];
        // 提取所有唯一的地域
        const regions = [...new Set(this.state.allData.map(item => item.region))];

        // 清空并重新添加声优选项
        this.$cvFilter.innerHTML = '<option value="all">所有</option>';
        cvs.forEach(cv => {
            const option = document.createElement('option');
            option.value = cv;
            option.textContent = cv;
            this.$cvFilter.appendChild(option);
        });

        // 清空并重新添加地域选项
        this.$regionFilter.innerHTML = '<option value="all">所有</option>';
        regions.forEach(region => {
            const option = document.createElement('option');
            option.value = region;
            option.textContent = region;
            this.$regionFilter.appendChild(option);
        });
    },
};
// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    ShikigamiTable.init();
});


