<template>
  <div class="material-center">
    <div class="layout-container">
      <!-- Left Content Panel -->
      <div class="content-panel">
        <!-- Image Grid Section -->
        <div v-if="showImages" class="image-grid">
          <div
              v-for="item in filteredMaterials.filter(m => m.fileType === 'image')"
              :key="item.id"
              class="image-item"
              @click="toggleSelect(item)"
              :class="{ selected: selectedFiles.includes(item.id) }">
            <div class="image-options">
              <Button
                  type="text"
                  class="unbind-single-btn"
                  @click.stop="doDeleteSingle(item.id)">
                <Icon type="ios-close-circle" size="28"/>
              </Button>
            </div>
            <div class="image-wrapper">
              <Image
                  :src="getFileUrl(item.path)"
                  fit="contain"
                  preview
                  @click.stop
                  :preview-list="previewList"
                  :initial-index="getPreviewIndex(item, filteredMaterials)"
                  class="material-image"/>
            </div>
            <div class="image-info">
              <span class="image-name">{{ item.fileName }}</span>
              <div class="image-meta">
                <span class="image-type">{{ item.categoryCode }}</span>
                <span class="image-uploader">
                  <MemberRender :photo="false" :id="item.opId"/>
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- File List Section -->
        <div v-if="showPdfs" class="file-list">
          <div
              v-for="file in filteredMaterials.filter(m => m.fileType === 'pdf')"
              :key="file.id"
              class="file-item"
              :class="{ selected: selectedFiles.includes(file.id) }"
              @click="toggleSelect(file)">
            <div class="file-checkbox">
              <Checkbox
                  :modelValue="selectedFiles.includes(file.id)"
                  @click.stop
                  @change="(val) => handleCheckboxChange(val, file)"/>
            </div>
            <div class="file-icon">
              <Icon type="md-document" size="24"/>
            </div>
            <div class="file-info">
              <div class="file-name">{{ file.fileName }}</div>
              <div class="file-meta">
                <span>{{ formatFileSize(file.size) }}</span>
                <span>{{ file.time }}</span>
              </div>
            </div>
            <Button icon="md-eye" type="text" @click="previewFile(file)">预览</Button>
            <div class="file-actions">
              <MemberRender :photo="false" :id="file.opId"/>
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="footer-actions">
          <div class="selection-info" v-if="selectedFiles.length">
            已选择 {{ selectedFiles.length }} 个文件
          </div>
          <div class="action-buttons">
            <Button type="primary" @click="confirmSelection" :disabled="!canConfirm">
              添加到选品
            </Button>
          </div>
        </div>
      </div>

      <!-- Right Search Panel -->
      <div class="search-panel">
        <Form :model="searchForm">
          <FormItem>
            <Input
                v-model="searchForm.fileName"
                placeholder="文件名称"
                @on-enter="doSearch"
                clearable>
            </Input>
          </FormItem>
          <FormItem>
            <Input
                v-model="searchForm.goodsName"
                placeholder="商品名称"
                clearable
                @on-enter="doSearch">
            </Input>
          </FormItem>
          <FormItem>
            <Input
                v-model="searchForm.shopName"
                placeholder="店铺名称"
                @on-enter="doSearch"
                clearable>
            </Input>
          </FormItem>
          <FormItem>
            <Input
                v-model="searchForm.resourceId"
                placeholder="达人ID"
                @on-enter="doSearch"
                clearable>
            </Input>
          </FormItem>
          <FormItem>
            <Input
                v-model="searchForm.resourceName"
                placeholder="达人名称"
                @on-enter="doSearch"
                clearable>
            </Input>
          </FormItem>
          <FormItem>
            <Select v-model="searchForm.categoryCode" placeholder="分类">
              <Option value="">全部</Option>
              <Option value="logo">Logo</Option>
              <Option value="whiteBg">白底图</Option>
              <Option value="pdf">文档</Option>
              <Option value="resource">达人</Option>
            </Select>
          </FormItem>
          <FormItem>
            <Select v-model="searchForm.fileType" placeholder="文件类型">
              <Option value="">全部</Option>
              <Option value="image">图片</Option>
              <Option value="pdf">PDF</Option>
            </Select>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="doSearch">搜索</Button>
            <Button type="warning" style="margin-left: 8px" @click="resetSearch">重置</Button>
            <Button type="error" style="margin-left: 8px" @click="doDeleteSelected">删除</Button>
          </FormItem>
          <FormItem>
            <Upload
                action="#"
                :before-upload="handleBeforeUpload"
                :show-upload-list="false"
                multiple>
              <Button icon="ios-cloud-upload-outline" type="success">上传文件</Button>
            </Upload>
          </FormItem>
        </Form>
      </div>
    </div>

    <!-- Upload Modal -->
    <Modal
        v-model="showUploadModal"
        title="上传配置"
        @on-ok="handleUpload">
      <Form :model="uploadForm" :label-width="80">
        <FormItem label="分类">
          <Select v-model="uploadForm.categoryCode">
            <Option value="logo">Logo</Option>
            <Option value="whiteBg">白底图</Option>
            <Option value="pdf">文档</Option>
            <Option value="resource">达人</Option>
          </Select>
        </FormItem>
        <FormItem label="文件类型">
          <Select v-model="uploadForm.fileType">
            <Option value="image">图片</Option>
            <Option value="pdf">PDF</Option>
          </Select>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>


<script>
import MemberRender from "@/pc/component/render/MemberRender";

export default {
  name: 'MaterialCenter',
  components: {MemberRender},
  props: {
    modelValue: Boolean,
    target: {
      type: Object,
      required: true
    }
  },
  emits: ['update:modelValue', 'select-materials'],
  data() {
    return {
      searchForm: {
        fileName: '',
        categoryCode: '',
        fileType: '',
        projectId: '', // 从当前项目获取
        deliveryId: '', // 从当前货盘获取
        brandId: '', // 从当前店铺获取
        brandName: '',// 品牌名称
        shopName: '',// 店铺名称
        goodsName: '',// 商品名称
        resourceName: '',// 达人名称
        projectName: ''// 项目名称
      },
      materials: [],
      selectedFiles: [],
      loading: false,
      currentFile: null,
      showUploadModal: false,
      uploadQueue: [],
      uploadForm: {
        categoryCode: '',
        fileType: '',
        escape: '',
        brandId: '',
        productId: '',
        resourceId: '',
        projectId: '',
        deliveryId: '',
      }
    }
  },
  watch:{
    target() {
      if (this.target) {
        this.searchForm.shopId = this.target.shopId // 搜索当前店铺下的所有商品素材
      }
      this.doSearch()
    },
  },
  computed: {
    showDrawer: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    },
    previewList() {
      return this.materials.map(item => this.$filter.photo(item.path));
    },
    showImages() {
      return this.searchForm.fileType === '' || this.searchForm.fileType === 'image'
    },
    showPdfs() {
      return this.searchForm.fileType === '' || this.searchForm.fileType === 'pdf'
    },
    filteredMaterials() {
      return this.materials
    },
    canConfirm() {
      return this.selectedFiles.length > 0
    },
    selectedFilesDetails() {
      return this.selectedFiles.map(id =>
          this.materials.find(file => file.id === id)
      ).filter(Boolean)
    }
  },
  created() {
    if (this.target) {
      this.searchForm.shopId = this.target.shopId
      // 从选品点进素材中心 自动带上 商品、商家
      this.searchForm.goodsName = this.target.title
      this.searchForm.shopName = this.target.shop_name
    }
    this.doSearch()
  },
  methods: {
    // 预览文件
    previewFile(file) {
      window.open(this.getFileUrl(file.path), '_blank');
    },
    doDeleteSingle(fileId){
      this.$Modal.confirm({
        title: '提示',
        content: `确定要删除该文件吗？`,
        onOk: async () => {
          try {
            const params = {
              ids: [fileId]
            }
            const res = await this.$api.liveProject.materialDelete(params)
            if (res.code === 0) {
              this.$Message.success('删除成功')
              await this.doSearch()
              this.selectedFiles = []
            } else {
              this.$Message.error('素材存在绑定关系，请先解除素材与商品绑定关系后，再进行删除')
              this.selectedFiles = []
            }
          } catch (error) {
            this.$Message.error('删除失败')
          }
        },
      })
    },
    doDeleteSelected(){
      this.$Modal.confirm({
        title: '提示',
        content: `确定要删除 ${this.selectedFiles.length} 个素材吗？`,
        onOk: async () => {
          try {
            const params = {
              ids: this.selectedFiles
            }
            const res = await this.$api.liveProject.materialDelete(params)
            if (res.code === 0) {
              this.$Message.success('删除成功')
              await this.doSearch()
              this.selectedFiles = []
            } else {
              this.$Message.error('素材存在绑定关系，请先解除素材与商品绑定关系后，再进行删除')
              this.selectedFiles = []
            }
          } catch (error) {
            this.$Message.error('删除失败')
          }
        },
      })
    },
    async doSearch() {
      this.loading = true
      try {
        const params = {
          ...this.searchForm,
        }
        // 达人名称作为维度搜索
        if (this.searchForm.resourceName || this.searchForm.resourceId) {
          delete params.productId
          delete params.projectId
          delete params.deliveryId
          delete params.shopName
          delete params.shopId
          delete params.brandId
          this.searchForm.categoryCode = 'resource'
          params.categoryCode = 'resource'
        }
        const { code, data } = await this.$api.liveProject.materialSearch(params)
        if (code === 0) {
          this.materials = data
        }
      } catch (error) {
        console.error('搜索失败:', error)
      } finally {
        this.loading = false
      }
    },
    handleBeforeUpload(file) {
      this.uploadQueue.push(file); // 将文件加入队列
      this.uploadForm.fileType = file.type.startsWith('image/') ? 'image' : 'pdf'
      this.showUploadModal = true
      return false
    },
    async handleUpload() {
      if (!this.uploadQueue.length) return;
      try {
        for(const file of this.uploadQueue){
          const formData = new FormData()
          formData.append('file', file)
          formData.append('deliveryId', this.target._id);
          Object.keys(this.uploadForm).forEach(key => {// type、category
            if (this.uploadForm[key] !== null && this.uploadForm[key] !== '') {
              formData.append(key, this.uploadForm[key]);
            }
          });
          Object.entries(this.target).forEach(([key, value]) => {
            if(value) formData.append(key, value);
          })
          const res = await this.$api.liveProject.materialUpload(formData);
          if (res.code === 0) {
            this.$Message.success('上传成功')
            await this.doSearch()
          } else {
            this.$Message.error(res.msg || '上传失败')
          }
        }
      } catch (error) {
        console.error('上传失败:', error)
        this.$Message.error('上传失败，请重试')
      }
      this.currentFile = null
    },


    resetSearch() {
      this.searchForm = {
        fileName: '',
        categoryCode: '',
        fileType: '',
        shopId: this.target.shopId,
      }
      this.doSearch()
    },
    toggleSelect(item) {
      const index = this.selectedFiles.indexOf(item.id)
      if (index === -1) {
        this.selectedFiles.push(item.id)
      } else {
        this.selectedFiles.splice(index, 1)
      }
    },
    handleCheckboxChange(checked, item) {
      if (checked && !this.selectedFiles.includes(item.id)) {
        this.selectedFiles.push(item.id);
      } else if (checked) {
        const index = this.selectedFiles.indexOf(item.id);
        if (index > -1) {
          this.selectedFiles.splice(index, 1);
        }
      }
    },
    confirmSelection(item) {// 添加到选品
      item.selectItem = {
        //category: this.selectedCategory,
        materials: this.selectedFilesDetails
      }
      this.$emit('select', item);
      this.resetSelection()
    },
    resetSelection() {
      this.selectedFiles = []
      // this.selectedCategory = ''
      this.searchForm.fileName = ''
      this.searchForm.fileType = ''
    },
    formatFileSize(size) {
      if (size < 1024) return size + 'B'
      if (size < 1024 * 1024) return (size / 1024).toFixed(2) + 'KB'
      return (size / (1024 * 1024)).toFixed(2) + 'MB'
    },
    getFileUrl(path) {
      return this.$filter.photo(path);
    },
    getPreviewIndex(currentItem, fileList) {
      return fileList.findIndex(item => item.id === currentItem.id);
    },
  },
}
</script>


<style lang="less">
.material-center {
  height: 100%;

  .layout-container {
    display: flex;
    height: 100%;

    // Left Content Panel
    .content-panel {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 16px;
      border-right: 1px solid #eee;
      overflow: hidden;

      .image-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 16px;
        overflow-y: auto;
        padding-right: 8px;

        // Existing image-item styles remain the same
        .image-item {
          // ... (keep existing image-item styles)
        }
      }

      .file-list {
        overflow-y: auto;
        padding-right: 8px;

        // Existing file-item styles remain the same
        .file-item {
          // ... (keep existing file-item styles)
        }
      }
    }

    // Right Search Panel
    .search-panel {
      width: 300px;
      padding: 16px;
      background: #f8f8f8;
      overflow-y: auto;

      .ivu-form-item {
        margin-bottom: 16px;

        .ivu-input-wrapper,
        .ivu-select {
          width: 100%;
        }
      }

      .ivu-btn {
        margin-right: 8px;
      }
    }
  }

  .footer-actions {
    margin-top: auto;
    padding: 16px 0;
    border-top: 1px solid #eee;

    .selection-info {
      margin-bottom: 8px;
    }
  }
}
</style>