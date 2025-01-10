<template>
  <div class="task-board">
    <!-- 顶部搜索栏 -->
    <div class="search-condition">
      <div class="item">
        <span class="label">承接人</span>
        <Input
            v-model="condition.operator"
            placeholder="请输入承接人"
            @on-enter="doSearch"
            clearable
        ></Input>
      </div>
      <div class="item">
        <span class="label">工单状态</span>
        <Select v-model="condition.status" placeholder="请选择工单状态" clearable>
          <Option value="unclaimed">待认领</Option>
          <Option value="in_progress">进行中</Option>
          <Option value="completed">已完成</Option>
        </Select>
      </div>
      <Button type="primary" @click="doSearch">搜索</Button>
    </div>

    <!-- 内容区域 -->
    <div class="content">
      <!-- 左侧：工单进度 -->
      <div class="task-progress">
        <h3>工单进度</h3>
        <div class="table-container">
          <Table :data="filteredTaskList" :columns="taskColumns" class="task-table" />
        </div>
        <Page
            :total="totalTasks"
            :current="currentPage"
            :page-size="pageSize"
            @on-change="handlePageChange"
            class="pagination"
        />
      </div>

      <!-- 右侧：积分排行榜 -->
      <div class="points-ranking">
        <h3>积分排行榜</h3>
        <div class="table-container">
          <Table :data="rankList" :columns="rankColumns" class="rank-table" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Input, Button, Table, Tag, Progress, Select, Option, Page } from "view-ui-plus";

export default {
  name: "TaskBoard",
  components: {
    Input,
    Button,
    Table,
    Tag,
    Progress,
    Select,
    Option,
    Page,
  },
  data() {
    return {
      condition: {
        operator: "", // 承接人
        status: "", // 工单状态
      },
      taskList: [
        {
          id: 1,
          taskName: "视频剪辑",
          operator: "张三",
          status: "in_progress",
          progress: 60,
          points: 100,
        },
        {
          id: 2,
          taskName: "平面美工",
          operator: "李四",
          status: "completed",
          progress: 100,
          points: 150,
        },
        {
          id: 3,
          taskName: "拍摄",
          operator: "",
          status: "unclaimed",
          progress: 0,
          points: 0,
        },
      ], // 工单列表
      rankList: [
        {
          operator: "张三",
          totalPoints: 300,
        },
        {
          operator: "李四",
          totalPoints: 250,
        },
        {
          operator: "王五",
          totalPoints: 200,
        },
      ], // 积分排行榜
      currentPage: 1, // 当前页码
      pageSize: 10, // 每页条数
    };
  },
  computed: {
    // 过滤后的工单列表
    filteredTaskList() {
      return this.taskList
          .filter((task) => {
            const matchesOperator =
                !this.condition.operator ||
                task.operator.includes(this.condition.operator);
            const matchesStatus =
                !this.condition.status || task.status === this.condition.status;
            return matchesOperator && matchesStatus;
          })
          .slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
    },
    // 总工单数
    totalTasks() {
      return this.taskList.length;
    },
    // 工单进度表格列配置
    taskColumns() {
      return [
        {
          title: "工单名称",
          key: "taskName",
        },
        {
          title: "承接人",
          key: "operator",
          render: (h, { row }) => {
            return h("span", row.operator || "待认领");
          },
        },
        {
          title: "状态",
          render: (h, { row }) => {
            return h(
                Tag,
                {
                  props: {
                    color: this.getStatusColor(row.status),
                  },
                },
                this.getStatusLabel(row.status)
            );
          },
        },
        {
          title: "完成进度",
          render: (h, { row }) => {
            return h(Progress, {
              props: {
                percent: row.progress,
                status: this.getProgressStatus(row.progress),
              },
            });
          },
        },
      ];
    },
    // 积分排行榜表格列配置
    rankColumns() {
      return [
        {
          title: "承接人",
          key: "operator",
        },
        {
          title: "总积分",
          key: "totalPoints",
        },
      ];
    },
  },
  methods: {
    // 搜索工单
    doSearch() {
      this.currentPage = 1; // 重置页码
    },
    // 分页切换
    handlePageChange(page) {
      this.currentPage = page;
    },
    // 获取状态标签颜色
    getStatusColor(status) {
      switch (status) {
        case "unclaimed":
          return "default";
        case "in_progress":
          return "blue";
        case "completed":
          return "green";
        default:
          return "default";
      }
    },
    // 获取状态标签文字
    getStatusLabel(status) {
      switch (status) {
        case "unclaimed":
          return "待认领";
        case "in_progress":
          return "进行中";
        case "completed":
          return "已完成";
        default:
          return "未知状态";
      }
    },
    // 获取进度条状态
    getProgressStatus(progress) {
      if (progress === 100) return "success";
      if (progress > 0) return "active";
      return "normal";
    },
  },
};
</script>

<style scoped lang="less">
.task-board {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding-top: 64px; /* 顶部搜索栏高度 */
}

.search-condition {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background-color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;

  .item {
    display: flex;
    align-items: center;
    flex: 1 1 200px;

    .label {
      margin-right: 8px;
      font-size: 14px;
      color: #606266;
      white-space: nowrap;
    }

    .ivu-input,
    .ivu-select {
      flex: 1;
    }
  }

  .ivu-btn {
    flex: 0 0 auto;
    height: 32px;
    padding: 0 16px;
    font-size: 14px;
  }
}

.content {
  display: flex;
  flex: 1;
  gap: 16px;
  padding: 16px;
  background-color: #f5f7fa;
}

.task-progress {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 16px;

  h3 {
    margin-bottom: 16px;
    font-size: 16px;
    color: #303133;
  }

  .table-container {
    flex: 1;
    overflow-y: auto;
    margin-bottom: 16px;
  }

  .pagination {
    margin-top: auto; /* 分页组件固定在底部 */
  }
}

.points-ranking {
  width: 300px;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 16px;

  h3 {
    margin-bottom: 16px;
    font-size: 16px;
    color: #303133;
  }

  .table-container {
    flex: 1;
    overflow-y: auto;
  }
}

.task-table,
.rank-table {
  margin-bottom: 16px;
}
</style>