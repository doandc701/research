import {
  ref,
  unref,
  watch,
  nextTick,
  computed,
  PropType,
  defineComponent
} from "vue";
import "./index.scss";
import { cloneDeep } from "lodash-unified";
import { isString } from "@pureadmin/utils";
import { propTypes } from "/@/utils/propTypes";
import { IconifyIconOffline } from "../../ReIcon";
import QRCode, { QRCodeRenderersOptions } from "qrcode";

interface QrcodeLogo {
  src?: string;
  logoSize?: number;
  bgColor?: string;
  borderSize?: number;
  crossOrigin?: string;
  borderRadius?: number;
  logoRadius?: number;
}

const props = {
  // img hoặc canvas, img không hỗ trợ lồng logo
  tag: propTypes.string
    .validate((v: string) => ["canvas", "img"].includes(v))
    .def("canvas"),
  // QR code content
  text: {
    type: [String, Array] as PropType<string | Recordable[]>,
    default: null
  },
  // qrcode.js configuration item
  options: {
    type: Object as PropType<QRCodeRenderersOptions>,
    default: (): QRCodeRenderersOptions => ({})
  },
  // width
  width: propTypes.number.def(200),
  // logo
  logo: {
    type: [String, Object] as PropType<Partial<QrcodeLogo> | string>,
    default: (): QrcodeLogo | string => ""
  },
  // Nó đã hết hạn chưa
  disabled: propTypes.bool.def(false),
  // Nội dung lời nhắc đã hết hạn
  disabledText: propTypes.string.def("")
};

export default defineComponent({
  name: "ReQrcode",
  props,
  emits: ["done", "click", "disabled-click"],
  setup(props, { emit }) {
    const { toCanvas, toDataURL } = QRCode;
    const loading = ref(true);
    const wrapRef = ref<Nullable<HTMLCanvasElement | HTMLImageElement>>(null);
    const renderText = computed(() => String(props.text));
    const wrapStyle = computed(() => {
      return {
        width: props.width + "px",
        height: props.width + "px"
      };
    });
    const initQrcode = async () => {
      await nextTick();
      const options = cloneDeep(props.options || {});
      if (props.tag === "canvas") {
        // Tỷ lệ "dung sai" lỗi. Theo mặc định, tỷ lệ "dung sai" lỗi cao được sử dụng cho mã QR có ít nội dung hơn và tỷ lệ "dung sai" lỗi thấp được sử dụng cho mã QR có nhiều nội dung hơn.
        options.errorCorrectionLevel =
          options.errorCorrectionLevel ||
          getErrorCorrectionLevel(unref(renderText));
        const _width: number = await getOriginWidth(unref(renderText), options);
        options.scale =
          props.width === 0 ? undefined : (props.width / _width) * 4;
        const canvasRef: HTMLCanvasElement = await toCanvas(
          unref(wrapRef) as HTMLCanvasElement,
          unref(renderText),
          options
        );
        if (props.logo) {
          const url = await createLogoCode(canvasRef);
          emit("done", url);
          loading.value = false;
        } else {
          emit("done", canvasRef.toDataURL());
          loading.value = false;
        }
      } else {
        const url = await toDataURL(renderText.value, {
          errorCorrectionLevel: "H",
          width: props.width,
          ...options
        });
        (unref(wrapRef) as HTMLImageElement).src = url;
        emit("done", url);
        loading.value = false;
      }
    };
    watch(
      () => renderText.value,
      val => {
        if (!val) return;
        initQrcode();
      },
      {
        deep: true,
        immediate: true
      }
    );
    const createLogoCode = (canvasRef: HTMLCanvasElement) => {
      const canvasWidth = canvasRef.width;
      const logoOptions: QrcodeLogo = Object.assign(
        {
          logoSize: 0.15,
          bgColor: "#ffffff",
          borderSize: 0.05,
          crossOrigin: "anonymous",
          borderRadius: 8,
          logoRadius: 0
        },
        isString(props.logo) ? {} : props.logo
      );
      const {
        logoSize = 0.15,
        bgColor = "#ffffff",
        borderSize = 0.05,
        crossOrigin = "anonymous",
        borderRadius = 8,
        logoRadius = 0
      } = logoOptions;
      const logoSrc = isString(props.logo) ? props.logo : props.logo.src;
      const logoWidth = canvasWidth * logoSize;
      const logoXY = (canvasWidth * (1 - logoSize)) / 2;
      const logoBgWidth = canvasWidth * (logoSize + borderSize);
      const logoBgXY = (canvasWidth * (1 - logoSize - borderSize)) / 2;
      const ctx = canvasRef.getContext("2d");
      if (!ctx) return;
      // logo background
      canvasRoundRect(ctx)(
        logoBgXY,
        logoBgXY,
        logoBgWidth,
        logoBgWidth,
        borderRadius
      );
      ctx.fillStyle = bgColor;
      ctx.fill();
      // logo
      const image = new Image();
      if (crossOrigin || logoRadius) {
        image.setAttribute("crossOrigin", crossOrigin);
      }
      (image as any).src = logoSrc;
      // Using image drawing can avoid some cross-domain situations
      const drawLogoWithImage = (image: HTMLImageElement) => {
        ctx.drawImage(image, logoXY, logoXY, logoWidth, logoWidth);
      };
      // Draw with canvas for more functionality
      const drawLogoWithCanvas = (image: HTMLImageElement) => {
        const canvasImage = document.createElement("canvas");
        canvasImage.width = logoXY + logoWidth;
        canvasImage.height = logoXY + logoWidth;
        const imageCanvas = canvasImage.getContext("2d");
        if (!imageCanvas || !ctx) return;
        imageCanvas.drawImage(image, logoXY, logoXY, logoWidth, logoWidth);
        canvasRoundRect(ctx)(logoXY, logoXY, logoWidth, logoWidth, logoRadius);
        if (!ctx) return;
        const fillStyle = ctx.createPattern(canvasImage, "no-repeat");
        if (fillStyle) {
          ctx.fillStyle = fillStyle;
          ctx.fill();
        }
      };
      // vẽ logo lên canvas
      return new Promise((resolve: any) => {
        image.onload = () => {
          logoRadius ? drawLogoWithCanvas(image) : drawLogoWithImage(image);
          resolve(canvasRef.toDataURL());
        };
      });
    };
    // Lấy kích thước của QrCode ban đầu để bạn có thể thu phóng để có được kích thước QrCode chính xác
    const getOriginWidth = async (
      content: string,
      options: QRCodeRenderersOptions
    ) => {
      const _canvas = document.createElement("canvas");
      await toCanvas(_canvas, content, options);
      return _canvas.width;
    };
    // Đối với QrCode có ít nội dung hơn, hãy tăng tỷ lệ chịu lỗi
    const getErrorCorrectionLevel = (content: string) => {
      if (content.length > 36) {
        return "M";
      } else if (content.length > 16) {
        return "Q";
      } else {
        return "H";
      }
    };
    // để vẽ các góc tròn
    const canvasRoundRect = (ctx: CanvasRenderingContext2D) => {
      return (x: number, y: number, w: number, h: number, r: number) => {
        const minSize = Math.min(w, h);
        if (r > minSize / 2) {
          r = minSize / 2;
        }
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
        return ctx;
      };
    };
    const clickCode = () => {
      emit("click");
    };
    const disabledClick = () => {
      emit("disabled-click");
    };
    return () => (
      <>
        <div
          v-loading={unref(loading)}
          class="qrcode relative inline-block"
          style={unref(wrapStyle)}
        >
          {props.tag === "canvas" ? (
            <canvas ref={wrapRef} onClick={clickCode}></canvas>
          ) : (
            <img ref={wrapRef} onClick={clickCode}></img>
          )}
          {props.disabled && (
            <div
              class="qrcode--disabled absolute top-0 left-0 flex w-full h-full items-center justify-center"
              onClick={disabledClick}
            >
              <div class="absolute top-[50%] left-[50%] font-bold">
                <IconifyIconOffline
                  class="cursor-pointer"
                  icon="refresh-right"
                  width="30"
                  color="var(--el-color-primary)"
                />
                <div>{props.disabledText}</div>
              </div>
            </div>
          )}
        </div>
      </>
    );
  }
});
