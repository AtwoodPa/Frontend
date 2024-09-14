<template>
  <div class="bind-code less-draw" id="ding"></div>
  <iframe src="https://wxapp.gaoq.com" width="300" height="300"></iframe>
</template>
<script>
import "./injected/ddlogin.js";
const appId = "wxa689c75e9475365b";
const appName = "告趣公众号";
console.dir(window);
export default {
  emits: ["bind-ok"],
  data() {
    return {
      aim: {
        kind: "登录",
        org: appName,
        tip: "",
      },
      showMask: false,
      justRefreshed: false,
      config: {
        value: "",
        // imagePath,
        filter: "threshold",
      },
      link: "",
      expired: false,
    };
  },
  mounted() {
    this.$api.shiro.me();
    // this.dingCode();
  },

  beforeUnmount() {
    this.bindingId = "";
  },
  methods: {
    dingCode() {
      window.DTFrameLogin(
        {
          id: "ding",
          width: 300,
          height: 300,
        },
        {
          redirect_uri: encodeURIComponent(
            "https://wxapp.gaoq.com/gq-uat/shiro/signIn"
          ),
          client_id: "dingxdovkyq55uvgcvuj",
          scope: "openid",
          response_type: "code",
          state: "",
          prompt: "consent",
        },
        (loginResult) => {
          cosnole.error("loginResult", loginResult);
          // const { redirectUrl, authCode, state } = loginResult;
          // 这里可以直接进行重定向
          // window.location.href = redirectUrl;
          // 也可以在不跳转页面的情况下，使用code进行授权
          // console.log(authCode);
        },
        (errorMsg) => {
          // 这里一般需要展示登录失败的具体原因,可以使用toast等轻提示
          console.error(`errorMsg of errorCbk: ${errorMsg}`);
        }
      );
    },
    onMouseOver() {
      this.showMask = true;
    },
    onMouseOut() {
      this.justRefreshed = false;
      this.showMask = false;
    },
    forceRefresh() {
      this.justRefreshed = true;
      this.refresh();
    },
    async longPolling(bindingId) {
      if (bindingId === this.bindingId) {
        try {
          let { code, data } = await this.$api.gzh.deferredStateBinding(
            "signIn",
            bindingId
          );
          if (code === 0 && data.doSignIn === true) {
            this.$emit("bind-ok", data);
          }
        } catch (e) {
          if (Date.now() - this.start > 1000 * 60 * 60 * 2) {
            this.expired = true;
          } else {
            setTimeout(() => {
              this.longPolling(bindingId);
            }, 2000);
          }
        }
      }
    },
    async refresh() {
      this.config.value = "";
      let { code, data } = await this.$api.gzh.bindBrowser({
        ...this.aim,
        appId,
        appName,
      });
      if (code === 0) {
        this.expired = false;
        let bindingPath = this.$api.gzh.getBindingPath(data);
        let rs = await this.$api.gzh.qrScene({
          scene:
            "bindingPath:" +
            (this.aim.tip || this.aim.kind) +
            "->" +
            bindingPath,
          appId,
        });
        if (rs.code === 0) {
          this.config.value =
            "https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=" +
            rs.data.ticket;
        }
        this.bindingId = data;
        this.start = Date.now();
        this.longPolling(data);
      }
    },
  },
};
</script>
<style lang="less">
.bind-code {
  position: relative;
  margin: auto;
  width: 195px;
  min-height: 195px;
  z-index: 1000;
  .wrapper {
    width: 195px;
    position: relative;
    height: 195px;
  }
  &[select="true"] {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px dashed var(--primary);
    border-radius: 3px;
    flex-direction: column;

    .ivu-radio-group {
      margin-top: 10px;
    }
  }

  .q-art {
    height: 100%;

    div {
      height: 100%;
    }
  }

  .mask {
    position: absolute;
    width: 100%;
    display: flex;
    height: 100%;
    flex-direction: column;
    color: white;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    background-color: rgba(0, 0, 0, 0.6);
    top: 0;
    user-select: none;

    &[expired="true"] {
      display: flex;
    }
  }
}
</style>
