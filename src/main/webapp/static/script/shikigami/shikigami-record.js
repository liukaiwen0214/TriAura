// 式神表格组件 - 独立模块
;(() => {
    // 避免与全局作用域冲突
    const ShikigamiTable = {
        // 状态管理
        state: {
            currentPage: 1,
            pageSize: 10,
            totalCount: 0,
            totalPages: 0,
            data: [],
            selectedId: null
        },

        // 初始化函数
        init() {
            console.log('Shikigami Table Component initialized');
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
        },

        // 加载数据
        async loadData() {
            this.showLoading();
            try {
                // 尝试API调用，失败时使用模拟数据
                const data = await this.fetchData();
                this.state.data = data.items;
                this.state.totalCount = data.totalCount;
                this.state.totalPages = Math.ceil(this.state.totalCount / this.state.pageSize);

                this.renderTable();
                this.renderPagination();
                this.updateEmptyState();
            } catch (error) {
                console.error('加载数据失败:', error);
                // 使用模拟数据作为降级方案
                this.useMockData();
            } finally {
                this.hideLoading();
            }
        },

        // API调用函数
        async fetchData() {
            // 模拟API调用
            return new Promise((resolve, reject) => {
                // 模拟网络延迟
                setTimeout(() => {
                    // 模拟API失败，触发降级到模拟数据
                    reject(new Error('API调用失败，使用模拟数据'));
                }, 500);
            });
        },

        // 使用模拟数据
        useMockData() {
            const mockData = this.getMockData();
            this.state.data = mockData.items;
            this.state.totalCount = mockData.totalCount;
            this.state.totalPages = Math.ceil(this.state.totalCount / this.state.pageSize);

            this.renderTable();
            this.renderPagination();
            this.updateEmptyState();
        },

        // 获取模拟数据
        getMockData() {
            const items = [
                { id: 1, name: '茨木童子', rarity: 'N', type: '输出', voiceActor: '福山润', region: '平安京', releaseDate: '2016-09-09', avatar: null },
                { id: 2, name: '大天狗', rarity: 'R', type: '输出', voiceActor: '前野智昭', region: '平安京', releaseDate: '2016-09-09', avatar: null },
                { id: 3, name: '辉夜姬', rarity: 'SR', type: '辅助', voiceActor: '竹达彩奈', region: '竹取物语', releaseDate: '2016-10-14', avatar: null },
                { id: 4, name: '荒川之主', rarity: 'SSR', type: '输出', voiceActor: '子安武人', region: '荒川', releaseDate: '2016-11-25', avatar: null },
                { id: 5, name: '雪女', rarity: 'SP', type: '控制', voiceActor: '诹访彩花', region: '雪山', releaseDate: '2016-09-09', avatar: null },
                { id: 6, name: '姑获鸟', rarity: 'UR', type: '输出', voiceActor: '行成桃姬', region: '森林', releaseDate: '2016-09-09', avatar: null },
                { id: 7, name: '萤草', rarity: 'R', type: '治疗', voiceActor: '诹访彩花', region: '森林', releaseDate: '2016-09-09', avatar: null },
                { id: 8, name: '三尾狐', rarity: 'R', type: '输出', voiceActor: '泽城美雪', region: '青丘', releaseDate: '2016-09-09', avatar: null },
                { id: 9, name: '山兔', rarity: 'R', type: '辅助', voiceActor: '丰崎爱生', region: '森林', releaseDate: '2016-09-09', avatar: null },
                { id: 10, name: '座敷童子', rarity: 'R', type: '辅助', voiceActor: '竹内顺子', region: '平安京', releaseDate: '2016-09-09', avatar: null },
                { id: 11, name: '酒吞童子', rarity: 'SSR', type: '输出', voiceActor: '阪口周平', region: '大江山', releaseDate: '2016-12-09', avatar: null },
                { id: 12, name: '青行灯', rarity: 'SSR', type: '输出', voiceActor: '水树奈奈', region: '青行灯', releaseDate: '2017-01-20', avatar: null },
                { id: 13, name: '花鸟卷', rarity: 'SSR', type: '治疗', voiceActor: '早见沙织', region: '画中世界', releaseDate: '2017-02-24', avatar: null },
                { id: 14, name: '彼岸花', rarity: 'SSR', type: '控制', voiceActor: '大原沙耶香', region: '黄泉', releaseDate: '2017-03-24', avatar: null },
                { id: 15, name: '小鹿男', rarity: 'SSR', type: '辅助', voiceActor: '河西健吾', region: '森罗万象', releaseDate: '2017-04-21', avatar: null }
            ];

            return { items, totalCount: items.length };
        },

        // 获取头像显示内容（带降级处理）
        getAvatarContent(item) {
            // 如果没有头像或获取失败，使用式神名称的第一个字作为默认头像
            const defaultText = item.name.charAt(0);

            return `
                <div class="avatar-container">
                    <div class="avatar-placeholder">${defaultText}</div>
                </div>
            `;
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
                    <td class="avatar-cell">${this.getAvatarContent(item)}</td>
                    <td><span class="rarity-badge rarity-${item.rarity.toLowerCase()}">${item.rarity}</span></td>
                    <td>${item.type}</td>
                    <td>${item.voiceActor}</td>
                    <td>${item.region}</td>
                    <td>${item.releaseDate}</td>
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

        // 渲染星级
        renderStars(count) {
            return '<i class="fas fa-star star-icon"></i>'.repeat(count);
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
            this.loadData();
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
        }
    };

    // 页面加载完成后初始化
    document.addEventListener('DOMContentLoaded', () => {
        ShikigamiTable.init();
    });
})();
