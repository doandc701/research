import "xe-utils";
import "./index.scss";
import XEUtils from "xe-utils";
import { App, unref } from "vue";
import { i18n } from "/@/plugins/i18n";
import "font-awesome/css/font-awesome.min.css";
import zh from "vxe-table/lib/locale/lang/zh-CN";
import en from "vxe-table/lib/locale/lang/en-US";

import {
  // core
  VXETable,
  // Form function
  Footer,
  Icon,
  Filter,
  Edit,
  Menu,
  Export,
  Keyboard,
  Validator,
  // Optional components
  Column,
  Colgroup,
  Grid,
  Tooltip,
  Toolbar,
  Pager,
  Form,
  FormItem,
  FormGather,
  Checkbox,
  CheckboxGroup,
  Radio,
  RadioGroup,
  RadioButton,
  Switch,
  Input,
  Select,
  Optgroup,
  Option,
  Textarea,
  Button,
  Modal,
  List,
  Pulldown,
  // sheet
  Table
} from "vxe-table";

// Global default parameters
VXETable.setup({
  size: "medium",
  version: 0,
  zIndex: 1002,
  table: {
    // Tự động theo dõi các thay đổi đối với các phần tử mẹ để tính toán lại bảng
    autoResize: true,
    // Liệu di chuột qua có highligh hay không
    highlightHoverRow: true
  },
  input: {
    clearable: true
  },
  i18n: (key, args) => {
    return unref(i18n.global.locale) === "zh"
      ? XEUtils.toFormatString(XEUtils.get(zh, key), args)
      : XEUtils.toFormatString(XEUtils.get(en, key), args);
  },
  translate(key) {
    const NAMESPACED = ["el.", "buttons."];
    if (key && NAMESPACED.findIndex(v => key.includes(v)) !== -1) {
      return i18n.global.t.call(i18n.global.locale, key);
    }
    return key;
  }
});

export function useTable(app: App) {
  app
    .use(Footer)
    .use(Icon)
    .use(Filter)
    .use(Edit)
    .use(Menu)
    .use(Export)
    .use(Keyboard)
    .use(Validator)
    // optional components
    .use(Column)
    .use(Colgroup)
    .use(Grid)
    .use(Tooltip)
    .use(Toolbar)
    .use(Pager)
    .use(Form)
    .use(FormItem)
    .use(FormGather)
    .use(Checkbox)
    .use(CheckboxGroup)
    .use(Radio)
    .use(RadioGroup)
    .use(RadioButton)
    .use(Switch)
    .use(Input)
    .use(Select)
    .use(Optgroup)
    .use(Option)
    .use(Textarea)
    .use(Button)
    .use(Modal)
    .use(List)
    .use(Pulldown)
    // installation form
    .use(Table);
}
