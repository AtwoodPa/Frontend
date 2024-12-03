<template>
  <div class="file-folder-container">
    <!--  右键菜单  -->
    <div
        v-show="contextMenuVisible"
        class="context-menu"
        :style="{ left: `${contextMenuPosition.x}px`, top: `${contextMenuPosition.y}px` }"
        @click.stop>
      <ul>
        <li @click="renameFolder(selectedFolder)">重命名</li>
        <li @click="deleteFolder(selectedFolder)">删除</li>
      </ul>
    </div>
    <!--  顶部导航栏  -->
    <div class="breadcrumb-container">
      <div>
        <Icon size="24" type="ios-arrow-back" @click="goBack" v-if="breadcrumb.length > 1" />
        <Breadcrumb class="breadcrumb">
          <BreadcrumbItem
              v-for="(item, index) in breadcrumb"
              :key="item.id"
              @click.native="navigateTo(index)"
          >
            {{ item.name }}
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <Button
          type="default"
          icon="ios-apps"
          @click="toggleView"
          :shape="viewMode === 'grid' ? 'circle' : 'default'">
        切换视图
      </Button>
    </div>
    <!-- 文件夹区域 -->
    <div v-if="viewMode === 'grid'">
      <Row :gutter="16">
        <Col v-for="folder in folders" :key="folder.id" :span="3">
          <div
              class="folder"
              @click="openFolder(folder);contextMenuVisible = false"
              @contextmenu.prevent="handleContextMenu($event, folder)">
            <Icon type="ios-folder" size="48" />
            <p>{{ folder.name }}</p>
          </div>
        </Col>
        <Col :span="3">
          <div class="folder" @click="showCreateFolderModal">
            <Icon type="ios-add-circle" size="48" />
            <p>新建文件夹</p>
          </div>
        </Col>
      </Row>
    </div>

    <div v-else>
      <div class="action-section">
        <Button type="primary" icon="ios-add-circle" @click="showCreateFolderModal">
          新建文件夹
        </Button>
      </div>
      <Table
          :columns="columns"
          :data="folders"
          :bordered="true"
          @on-row-dblclick="onRowDblClick"
      />
    </div>
    <!-- 文件上传区域 -->
    <div class="upload-section">
      <Upload
          :on-success="handleUploadSuccess"
          :before-upload="beforeUpload">
        <Button type="primary" icon="ios-cloud-upload">上传文件</Button>
      </Upload>
    </div>
    <Modal
        v-model="isCreateFolderModalVisible"
        title="新建文件夹"
        @on-ok="createFolder"
        @on-cancel="isCreateFolderModalVisible = false">
      <Input v-model="newFolderName" placeholder="请输入文件夹名称"/>
    </Modal>
  </div>
</template>

<script>
import SparkMD5 from "spark-md5";
export default {
  name: "FileFolder",
  data() {
    return {
      contextMenuVisible: false,
      contextMenuPosition: { x: 0, y: 0 }, // 右键菜单位置
      selectedFolder: null,
      contextMenuOptions: [
        { label: "重命名", name: "rename" },
        { label: "删除", name: "delete" },
      ],
      folders: [],
      isCreateFolderModalVisible: false,
      newFolderName: "",
      breadcrumb: [{ id: null, name: "根目录" }],
      viewMode: "grid",
      columns: [
        { title: "名称", key: "name" },
        { title: "创建时间", key: "createdAt" },
        { title: "大小", key: "size", render: h => h("span", "—") },
      ],
      allFolders: [
        { id: 1, name: "美的", parentId: null, createdAt: "2024-01-01", size: "2 MB" },
        { id: 2, name: "文件夹 2", parentId: null, createdAt: "2024-01-02", size: "3 MB" },
        { id: 3, name: "文件夹 3", parentId: null, createdAt: "2024-01-03", size: "1 MB" },
        { id: 4, name: "文件夹 4", parentId: null, createdAt: "2024-01-04", size: "5 MB" },
        { id: 5, name: "洗衣机", parentId: 1, createdAt: "2024-02-01", size: "500 KB" },
        { id: 6, name: "电饭煲", parentId: 1, createdAt: "2024-02-02", size: "700 KB" },
      ],
    };
  },

  methods: {
    async getUploadFileMD5(file) {
      return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onload = () => {
          const arrayBuffer = fileReader.result;
          const md5Hash = SparkMD5.ArrayBuffer.hash(arrayBuffer);
          resolve(md5Hash);
        };
        fileReader.onerror = (error) => {
          reject(error);
        };

        fileReader.readAsArrayBuffer(file);
      });
    },
    hideContextMenu(event) {
      if (this.contextMenuVisible) {
        this.contextMenuVisible = false;
      }
    },
    renameFolder(folder) {
      this.$Modal.confirm({
        title: "重命名文件夹",
        render: h => {
          return h("Input", {
            props: {
              value: folder.name,
              placeholder: "请输入新的文件夹名称",
            },
            on: {
              input: val => {
                folder.name = val;
              },
            },
          });
        },
        onOk: () => {
          this.$Message.success("文件夹已重命名！");
        },
      });
    },
    deleteFolder(folder) {
      this.$Modal.confirm({
        title: "删除文件夹",
        content: `确认删除文件夹 "${folder.name}" 吗？`,
        onOk: () => {
          const folderIndex = this.allFolders.findIndex(f => f.id === folder.id);
          if (folderIndex !== -1) {
            this.allFolders.splice(folderIndex, 1);
            this.$Message.success("文件夹已删除！");
            const currentFolderId =
                this.breadcrumb.length > 1 ? this.breadcrumb[this.breadcrumb.length - 1].id : null;
            this.fetchFolders(currentFolderId);
          }
        },
      });
    },
    handleContextMenu(event, folder) {
      console.log(event, folder)
      event.preventDefault(); // 阻止浏览器默认的右键菜单
      this.contextMenuVisible = true;
      this.selectedFolder = folder;
      this.contextMenuPosition = { x: event.clientX, y: event.clientY };
    },
    onRowDblClick(row) {
      this.openFolder(row);
    },
    fetchFolders(parentId = null) {
      this.folders = this.allFolders.filter(folder => folder.parentId === parentId);
    },
    showCreateFolderModal() {
      this.isCreateFolderModalVisible = true;
    },
    createFolder() {
      if (!this.newFolderName) {
        this.$Message.error("文件夹名称不能为空！");
        return;
      }
      const currentFolderId = this.breadcrumb.length > 1 ? this.breadcrumb[this.breadcrumb.length - 1].id : null;
      const newFolder = {
        id: Date.now(),
        name: this.newFolderName,
        parentId: currentFolderId,
        createdAt: new Date().toISOString().split("T")[0],
        size: "—",
      };
      this.allFolders.push(newFolder);
      this.$Message.success("文件夹创建成功！");
      this.isCreateFolderModalVisible = false;
      this.newFolderName = "";
      this.fetchFolders(currentFolderId);
    },
    handleUploadSuccess(file) {
      const currentFolderId = this.breadcrumb.length > 1 ? this.breadcrumb[this.breadcrumb.length - 1].id : null;
      const newFile = {
        id: Date.now(),
        name: file.name,
        md5: file.md5,
        parentId: currentFolderId,
        createdAt: new Date().toISOString().split("T")[0],
        size: `${(file.size / 1024).toFixed(2)} KB`,
      };
      this.allFolders.push(newFile);
      this.$Message.success("文件上传成功！");
      this.fetchFolders(currentFolderId);
    },
    async beforeUpload(file) {
      try {
        const md5 = await this.getUploadFileMD5(file);
        console.log("文件 MD5:", md5);
        // 根据需求可以将 MD5 添加到表单或进行验证
        file.md5 = md5;
        console.log("文件 file.md5", file.md5)
        this.handleUploadSuccess(file);

        return true; // 返回 true 允许上传
      } catch (err) {
        this.$Message.error("文件读取失败！");
        return false; // 返回 false 阻止上传
      }

      // return false;
    },
    openFolder(folder) {
      this.breadcrumb.push({ id: folder.id, name: folder.name });
      this.fetchFolders(folder.id);
    },
    goBack() {
      if (this.breadcrumb.length > 1) {
        this.breadcrumb.pop();
        const parentFolder = this.breadcrumb[this.breadcrumb.length - 1];
        this.fetchFolders(parentFolder.id);
      }
    },
    navigateTo(index) {
      this.breadcrumb = this.breadcrumb.slice(0, index + 1);
      const targetFolder = this.breadcrumb[index];
      this.fetchFolders(targetFolder.id);
    },
    toggleView() {
      this.viewMode = this.viewMode === "grid" ? "list" : "grid";
    },
  },
  mounted() {
    this.fetchFolders();
    document.addEventListener("click", this.hideContextMenu);
  },
  beforeDestroy() {
    document.removeEventListener("click", this.hideContextMenu);
  },
};
</script>

<style lang="less">
.file-folder-container {
  padding: 16px;
  .context-menu {
    position: absolute;
    background: white;
    border: 1px solid #ccc;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    ul {
      margin: 0;
      padding: 8px 0;
      list-style: none;
      li {
        padding: 8px 16px;
        cursor: pointer;
        &:hover {
          background: #f5f5f5;
        }
      }
    }
  }
  .folder {
    text-align: center;
    cursor: pointer;
    p {
      margin-top: 8px;
    }
  }
  .upload-section {
    margin-top: 16px;
    text-align: right;
  }
  .breadcrumb-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
    > div {
      display: flex;
      align-items: center;
      .breadcrumb {
        margin-left: 8px;
      }
    }
  }
  .action-section {
    margin-bottom: 16px;
    text-align: left;
  }
}


</style>