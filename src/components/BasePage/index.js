import React from "react";
import i18n from "@/utils/i18n";

/**
 * 基础页面
 * 通过this.title设置标题
 */

class BasePage extends React.Component {
  onLoad() {
    i18n.initNavBarTitle(this.title || i18n.t('hello'));
  }

  onShareAppMessage (res) {
    return {
      title: this.title || i18n.t('hello')
    }
  }
  onShareTimeline(res) {
    return {
      title: this.title || i18n.t('hello')
    }
  }
}

export default BasePage;
