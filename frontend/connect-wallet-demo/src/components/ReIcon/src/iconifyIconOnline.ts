import { h, defineComponent } from "vue";
import { Icon as IconifyIcon } from "@iconify/vue";

// Iconify Icon được sử dụng trực tuyến trong Vue (cho môi trường mạng bên ngoài)
export default defineComponent({
  name: "IconifyIconOnline",
  components: { IconifyIcon },
  props: {
    icon: {
      type: String,
      default: ""
    }
  },
  render() {
    const attrs = this.$attrs;
    return h(
      IconifyIcon,
      {
        icon: `${this.icon}`,
        style:
          attrs && attrs.style
            ? Object.assign(attrs.style, { outline: "none" })
            : { outline: "none" },
        ...attrs
      },
      {
        default: () => []
      }
    );
  }
});
