import { iconType } from "./types";
import { h, defineComponent, Component } from "vue";
import { IconifyIconOnline, IconifyIconOffline, FontIcon } from "../index";

/**
 * Support fontawesome4, 5+, iconfont, remixicon, element-plus icons, custom svg
 * @param icon must pass icon
 * @param attrs optional iconType attribute
 * @returns Component
 */
export function useRenderIcon(icon: any, attrs?: iconType): Component {
  // iconfont
  const ifReg = /^IF-/;
  // typeof icon === "function" Belongs to SVG
  if (ifReg.test(icon)) {
    // iconfont
    const name = icon.split(ifReg)[1];
    const iconName = name.slice(
      0,
      name.indexOf(" ") == -1 ? name.length : name.indexOf(" ")
    );
    const iconType = name.slice(name.indexOf(" ") + 1, name.length);
    return defineComponent({
      name: "FontIcon",
      render() {
        return h(FontIcon, {
          icon: iconName,
          iconType,
          ...attrs
        });
      }
    });
  } else if (
    typeof icon === "function" ||
    (icon && typeof icon.render === "function")
  ) {
    // svg
    return icon;
  } else {
    return defineComponent({
      name: "Icon",
      render() {
        const IconifyIcon =
          attrs && attrs["online"] ? IconifyIconOnline : IconifyIconOffline;
        return h(IconifyIcon, {
          icon: icon,
          ...attrs
        });
      }
    });
  }
}
