<template>
    <div class="bind-code less-draw">
        <div @mouseover="onMouseOver" @mouseout="onMouseOut" class="wrapper">
            <template v-if="config.value">
                <img :src="config.value" class="q-art" />
                <div
                    class="mask"
                    @click="forceRefresh"
                    :expired="expired"
                    v-show="(expired || showMask) && !justRefreshed"
                >
                    <template v-if="expired">已过期</template>
                    <template v-else>点击刷新</template>
                    <Icon type="md-refresh" color="white" size="50" />
                </div>
            </template>
            <spin v-else fix style="background-color: transparent">
                <Icon
                    type="ios-loading"
                    size="18"
                    class="spin-icon-load"
                ></Icon>
                <div>Loading</div>
            </spin>
        </div>
    </div>
</template>
<script>
const appId = "wxa689c75e9475365b";
const appName = "告趣公众号";
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
        this.refresh();
    },

    beforeUnmount() {
        this.bindingId = "";
    },
    methods: {
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
                    let { code, data } =
                        await this.$api.gzh.deferredStateBinding(
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
