<template>
  <div class="ad-upload">
    <div class="overlap" v-if="overlap && uploadList.length">
      <template v-if="uploadList[0].url">
        <Image
          :src="uploadList[0].url"
          width="58px"
          height="58px"
          fit="cover"
          preview
          :preview-list="uploadList.map((item) => item.url)"
        />
      </template>

      <span class="image-num">
        {{ uploadList.length + "张" }}
      </span>
    </div>

    <div v-else class="upload-list" v-for="item in uploadList" :key="item.name">
      <template v-if="item.status === 'finished'">
        <img :src="item.url" />
        <div class="upload-list-cover">
          <Icon type="ios-eye-outline" @click="handlePreview(item)"></Icon>
          <Icon
            type="ios-trash-outline"
            @click="handleRemove(item)"
            v-if="!disabled"
          ></Icon>
        </div>
      </template>
      <template v-else>
        <Progress
          v-if="item.showProgress"
          :percent="item.percentage"
          hide-info
        ></Progress>
      </template>
    </div>
    <Upload
      :disabled="disabled"
      ref="upload"
      :show-upload-list="false"
      :default-file-list="defaultList"
      :on-success="handleSuccess"
      :format="format"
      :max-size="maxSize || config.maxSize"
      :on-format-error="handleFormatError"
      :on-exceeded-size="handleMaxSize"
      :before-upload="handleBeforeUpload"
      :multiple="multiple"
      type="drag"
      :style="style"
      :name="config.name"
      :action="config.action"
    >
      <div style="width: 58px; height: 58px; line-height: 58px">
        <Icon type="ios-camera" size="20"></Icon>
      </div>
    </Upload>
  </div>
</template>
<script>
import Config from "./UploadConfig";

export default {
  props: {
    modelValue: [String, Array],
    format: {
      type: Array,
      default() {
        return ["jpg", "jpeg", "png", "webp", "gif"];
      },
    },
    max: {
      type: Number,
      default: 1,
    },
    trigger: {
      type: String,
      default: "always",
    },
    maxSize: {
      type: Number,
    },
    overlap: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    config() {
      return Config;
    },
    style() {
      return {
        display:
          this.multiple ||
          this.trigger === "always" ||
          this.uploadList.length === 0
            ? "inline-block"
            : "none",
        width: "60px",
      };
    },
  },
  watch: {
    modelValue(val) {
      if (val) {
        if (val instanceof Array) {
          this.multiple = true;
          val.forEach((item, i) => {
            if (!this.uploadList[i]) {
              this.uploadList.push({
                status: "finished",
                showProgress: false,
                percentage: 100,
              });
            }
            Config.patchValue(this.uploadList[i], item);
          });
        } else {
          this.multiple = false;
          if (this.uploadList[0]) {
            Config.patchValue(this.uploadList[0], val);
          } else {
            let mock = {
              status: "finished",
              percentage: 100,
              showProgress: false,
            };
            Config.patchValue(mock, val);
            this.uploadList.push(mock);
          }
        }
      } else {
        // 必须这么写，得是原来的那个数组
        this.$refs.upload.fileList.splice(0, this.uploadList.length);
        // console.log(JSON.stringify(this.uploadList))
        // if (this.uploadList[0]) {
        //     Config.patchValue(this.uploadList[0], '')
        // }
      }
    },
  },
  data() {
    let { multiple, defaultList } = this.initData();

    return {
      multiple,
      defaultList,

      uploadList: [],
    };
  },
  methods: {
    initData() {
      let multiple = false;
      let defaultList = [];
      if (this.modelValue instanceof Array) {
        multiple = true;
        this.modelValue.forEach((md5Ext) => {
          defaultList.push(Config.patchDefaultList(md5Ext));
        });
      } else if (this.modelValue) {
        defaultList.push(Config.patchDefaultList(this.modelValue));
      }
      return { multiple, defaultList };
    },
    emitInput() {
      // watch uploadList在handleSuccess之前就发生，所以还是手动触发吧
      if (this.multiple) {
        if (this.uploadList && this.uploadList.length > 0) {
          let md5Exts = [];
          this.uploadList.forEach((item) => {
            md5Exts.push(item.name);
          });
          console.log("md5Exts", md5Exts);
          this.$emit("update:modelValue", md5Exts);
        } else {
          this.$emit("update:modelValue", []);
        }
      } else {
        let single = this.uploadList[0];
        this.$emit("update:modelValue", single ? single.name : "");
      }
    },
    handlePreview({ url, name }) {
      if (url) {
        this.$ImagePreview.show({
          previewList: [url],
        });
      }
    },
    handleRemove(file) {
      const fileList = this.$refs.upload.fileList;
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
      this.emitInput();
    },
    handleSuccess(res, file) {
      let { code, data } = res;
      if (code === 0) {
        Config.patchFile(file, data);
      }
      if (!this.multiple) {
        const fileList = this.$refs.upload.fileList;
        if (fileList.length > 1) {
          this.$refs.upload.fileList.splice(0, 1);
        }
      }
      this.emitInput();
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: "The file format is incorrect",
        desc:
          "File format of " +
          file.name +
          " is incorrect, please select jpg or png.",
      });
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: "Exceeding file size limit",
        desc: "File  " + file.name + " is too large, no more than 6M.",
      });
    },
    handleBeforeUpload() {
      if (!this.multiple) {
        return true;
      }
      const check = this.uploadList.length < this.max;
      if (!check) {
        this.$Notice.warning({
          title: `最多上传${this.max}个图片`,
        });
      }
      return check;
    },
  },
  mounted() {
    this.uploadList = this.$refs.upload.fileList;
  },
};
</script>
<style lang="less">
.ad-upload {
  line-height: 0;
  display: inline-flex;
  align-items: center;
  .overlap {
    width: 58px;
    height: 58px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    .image-num {
      flex-shrink: 0;
      position: absolute;
      font-weight: bold;
      color: #19be6b;
      // border-radius: 50%;
      // border: 1px solid #19be6b;
    }
  }

  .upload-list {
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border: 1px dashed #dcdee2;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    /*box-shadow: 0 1px 1px rgba(0,0,0,.2);*/
    margin-right: 4px;
  }

  .upload-list img {
    width: 100%;
    height: 100%;
  }

  .upload-list-cover {
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.6);
  }

  .upload-list:hover .upload-list-cover {
    display: block;
  }

  .upload-list-cover i {
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }
}
</style>
