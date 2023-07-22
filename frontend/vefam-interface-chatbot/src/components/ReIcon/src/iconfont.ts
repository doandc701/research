import { h, defineComponent } from "vue";

// Đóng gói (Encapsulates) thành phần iconfont component, chế độ tham chiếu mặc định `font-class`, hỗ trợ tham chiếu `unicode`, tham chiếu `font-class`, tham chiếu `symbol`
//(https://www.iconfont.cn/help/detail?spm=a313x.7781069.1998910419.20&helptype=code)
export default defineComponent({
  name: "FontIcon",
  props: {
    icon: {
      type: String,
      default: ""
    }
  },
  render() {
    const attrs = this.$attrs;
    if (
      Object.keys(attrs).includes("uni") ||
      (attrs && attrs.iconType === "uni")
    ) {
      return h(
        "i",
        {
          class: "iconfont",
          ...attrs
        },
        this.icon
      );
    } else if (
      Object.keys(attrs).includes("svg") ||
      (attrs && attrs.iconType === "svg")
    ) {
      return h(
        "svg",
        {
          class: "icon-svg",
          "aria-hidden": true
        },
        {
          default: () => [
            h("use", {
              "xlink:href": `#${this.icon}`
            })
          ]
        }
      );
    } else {
      return h("i", {
        class: `iconfont ${this.icon}`,
        ...attrs
      });
    }
  }
});
