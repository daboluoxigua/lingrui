<!-- 系统配置 -->
<template>
  <page-main>
    <div class="configMain">
      <div>
        <div>系统配置类型</div>
        <div>操作</div>
      </div>
      <div>
        <div class="cell">
          <el-image class="systemLogo" :src="form.systemLogo" fit="contain">
            <template #error>
              <SvgIcon name="logo" class="img" />
            </template>
          </el-image>
          <div class="txt">
            <h6>系统LOGO</h6>
            <p>推荐使用154*48像素的透明底PNG、JPG、SVG图片</p>
          </div>
        </div>
        <div class="cell">
          <upload
            v-model.modelValue="form.systemLogo"
            accept=".png,.jpg,.svg"
            :upload-url="`${API}/sys-config/LOGO`"
            @path="getImg"
          />
          <el-button @click="reset('LOGO')">恢复默认</el-button>
        </div>
      </div>
      <div>
        <div class="cell">
          <el-image class="thumbnailLogo" :src="form.thumbnailLogo" fit="contain">
            <template #error>
              <SvgIcon name="collapseLogo" class="img" />
            </template>
          </el-image>
          <div class="txt">
            <h6>缩略图LOGO</h6>
            <p>推荐使用48*48像素的透明底PNG、JPG、SVG图片</p>
          </div>
        </div>
        <div class="cell">
          <upload
            v-model.modelValue="form.thumbnailLogo"
            accept=".png,.jpg,.svg"
            :upload-url="`${API}/sys-config/SMALL`"
            @path="getImg"
          />
          <el-button @click="reset('SMALL')">恢复默认</el-button>
        </div>
      </div>
      <div>
        <div class="cell">
          <el-image class="favicon" :src="form.favicon" fit="contain">
            <template #error>
              <SvgIcon name="favicon" class="img" />
            </template>
          </el-image>
          <div class="txt">
            <h6>Favicon图标</h6>
            <p>推荐使用48*48像素的透明底PNG、JPG、SVG图片</p>
          </div>
        </div>
        <div class="cell">
          <upload
            v-model.modelValue="form.favicon"
            :upload-url="`${API}/sys-config/ICON`"
            accept=".png,.jpg,.svg"
            @path="getImg"
          />
          <el-button @click="reset('ICON')">恢复默认</el-button>
        </div>
      </div>
      <div>
        <div class="cell">
          <div class="txt">
            <h6>系统名称</h6>
            <el-input
              style="width: 220px;"
              v-model="form.platformName"
              clearable
              maxlength="10"
              show-word-limit
              placeholder="请输入系统名称"
            />
          </div>
        </div>
        <div class="cell">
          <el-button icon="Edit" @click="setTitle">确定修改</el-button>
          <el-button @click="reset('PLATFORM_NAME')">恢复默认</el-button>
        </div>
      </div>
      <div>
        <div class="cell">
          <div class="txt">
            <el-button @click="reset('ALL_CONFIG')" style="margin-bottom: 5px;">恢复系统默认</el-button>
            <h6>全部恢复默认</h6>
            <p>点击按钮，以上所有设置将会还原值系统默认设置</p>
          </div>
        </div>
        <div class="cell"></div>
      </div>
    </div>
  </page-main>
</template>

<script setup lang="ts" name="config">
import api from "@/api";
import useUserStore from "@/store/modules/user";
const userStore = useUserStore();

const API = import.meta.env.VUE_APP_API_BASEURL;

const logoData = userStore.configData;
const form = reactive({
  systemLogo: logoData.systemLogo,
  thumbnailLogo: logoData.thumbnailLogo,
  favicon: logoData.favicon,
  platformName: logoData.platformName,
  auditLogSaveDays: logoData.auditLogSaveDays,
});

const getImg = () => {
  userStore.getConfig().then((res) => {
    form.systemLogo = res.systemLogo;
    form.thumbnailLogo = res.thumbnailLogo;
    form.favicon = res.favicon;
    form.platformName = res.platformName;
    form.auditLogSaveDays = res.auditLogSaveDays;
  });
};

const setTitle = () => {
  api.put(`/sys-config/platformName/${form.platformName}`, {}, { loading: true, msg: true }).then(() => {
    getImg();
  });
};

const reset = (configType: string) => {
  api.put(`/sys-config/restoreConfig/${configType}`, {}, { loading: true, msg: true }).then(() => {
    getImg();
  });
};
</script>
<style lang="scss" scoped>
.configMain {
  > div {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid var(--g-border-color);

    &:first-of-type {
      background-color: #fafafa;
      border: none;
      padding: 0 8px;
      height: 40px;
      line-height: 40px;
      font-size: 12px;

      > div:last-of-type {
        position: relative;

        &::before {
          content: "";
          width: 1px;
          height: 12px;
          background-color: #ebeef5;
          position: absolute;
          left: -10px;
          top: 50%;
          transform: translate(0, -50%);
        }
      }
    }

    &:not(:first-of-type) {
      padding: 16px 12px;
    }

    > div {
      &:first-of-type {
        flex: 1;
        display: flex;
        justify-content: left;
        align-items: center;

        .el-image + .txt {
          margin-left: 12px;
        }

        .txt {
          line-height: 22px;

          h6 {
            font-size: 14px;
            font-weight: 400;
            color: var(--g-el-text-color);
          }

          p {
            font-size: 12px;
            color: var(--g-el-text-color-secondary);
          }
        }
      }

      &:last-of-type {
        width: 50%;
        display: flex;
        align-items: center;
      }
    }

    &:first-of-type {
      line-height: 48px;
      color: var(--g-el-text-color);

      > div {
        &:last-of-type {
          justify-content: left;
        }
      }
    }
  }
}

.el-image {
  background: #c0ccda;
  display: flex;
  justify-content: center;
  align-items: center;
}

.systemLogo {
  width: 154px;
  height: 48px;
  overflow: hidden;

  .img {
    max-width: 154px;
    max-height: 48px;
  }
}

.thumbnailLogo {
  width: 50px;
  height: 50px;

  img {
    max-width: 50px;
    max-height: 50px;
  }
}

.favicon {
  width: 50px;
  height: 50px;
  background: #277af5;

  img {
    max-width: 50px;
    max-height: 50px;
  }
}

.robot {
  width: 50px;
  height: 50px;

  img {
    max-width: 50px;
    max-height: 50px;
  }
}

.upload {
  width: auto;
  margin-right: 10px;
}
</style>
