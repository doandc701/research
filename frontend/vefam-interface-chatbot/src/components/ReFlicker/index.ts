import "./index.css";
import { h, defineComponent, Component } from "vue";
import { nullCoalescing } from "/@/utils";

export interface attrsType {
  width?: string;
  height?: string;
  borderRadius?: number | string;
  background?: string;
  scale?: number | string;
}

/**
 * Dot, square flickering animation components
 * @param width optional string
 * @param height optional string
 * @param borderRadius Optional number | string Pass 0 for square, pass 50% or not pass for circle
 * @param background optional string flash color
 * @param scale optional number | string phạm vi nhấp nháy, mặc định là 2, giá trị càng lớn, phạm vi nhấp nháy càng lớn
 * @returns Component
 */
export function useRenderFlicker(attrs?: attrsType): Component {
  return defineComponent({
    name: "ReFlicker",
    render() {
      return h(
        "div",
        {
          class: "point point-flicker",
          style: {
            "--point-width": nullCoalescing(attrs && attrs.width, "12px"),
            "--point-height": nullCoalescing(attrs && attrs.height, "12px"),
            "--point-background": nullCoalescing(
              attrs && attrs.background,
              "var(--el-color-primary)"
            ),
            "--point-border-radius": nullCoalescing(
              attrs && attrs.borderRadius,
              "50%"
            ),
            "--point-scale": nullCoalescing(attrs && attrs.scale, "2")
          }
        },
        {
          default: () => []
        }
      );
    }
  });
}
