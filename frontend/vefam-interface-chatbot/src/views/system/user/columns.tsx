import { ref } from "vue";
import dayjs from "dayjs";
import { ElMessageBox } from "element-plus";
import { Switch, message } from "@pureadmin/components";

export function useColumns() {
  const switchLoadMap = ref({});

  const columns = ref([
    {
      type: "selection",
      width: 55,
      hide: ({ checkList }) => !checkList.includes("check column")
    },
    {
      label: "serial number",
      type: "index",
      width: 70,
      hide: ({ checkList }) => !checkList.includes("serial number column")
    },
    {
      label: "user ID",
      prop: "id"
    },
    {
      label: "user name",
      prop: "username"
    },
    {
      label: "User nickname",
      prop: "nickname"
    },
    {
      label: "gender",
      prop: "sex",
      cellRenderer: ({ row, props }) => (
        <el-tag
          size={props.size}
          type={row.sex === 1 ? "danger" : ""}
          effect="plain"
        >
          {row.sex === 1 ? "Female" : "Male"}
        </el-tag>
      )
    },
    {
      label: "department",
      prop: "dept",
      formatter: ({ dept }) => dept.name
    },
    {
      label: "cellphone number",
      prop: "mobile"
    },
    {
      label: "state",
      prop: "status",
      width: 130,
      cellRenderer: scope => (
        <Switch
          size={scope.props.size === "small" ? "small" : "default"}
          loading={
            switchLoadMap.value[scope.index] &&
            switchLoadMap.value[scope.index].loading
          }
          v-model:checked={scope.row.status}
          checkedValue={1}
          unCheckedValue={0}
          checked-children="activated"
          un-checked-children="closed"
          onChange={() => onChange(scope)}
        />
      )
    },
    {
      label: "creation time",
      width: 180,
      prop: "createTime",
      formatter: ({ createTime }) =>
        dayjs(createTime).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "operate",
      fixed: "right",
      width: 180,
      slot: "operation"
    }
  ]);

  function onChange({ row, index }) {
    ElMessageBox.confirm(
      `confirm to<strong>${
        row.status === 0 ? "Disable" : "Enable"
      }</strong><strong style='color:var(--el-color-primary)'>${
        row.username
      }</strong>user?`,
      "system hint",
      {
        confirmButtonText: "Sure",
        cancelButtonText: "Cancel",
        type: "warning",
        dangerouslyUseHTMLString: true,
        draggable: true
      }
    )
      .then(() => {
        switchLoadMap.value[index] = Object.assign(
          {},
          switchLoadMap.value[index],
          {
            loading: true
          }
        );
        setTimeout(() => {
          switchLoadMap.value[index] = Object.assign(
            {},
            switchLoadMap.value[index],
            {
              loading: false
            }
          );
          message.success("User status modified successfully");
        }, 300);
      })
      .catch(() => {
        row.status === 0 ? (row.status = 1) : (row.status = 0);
      });
  }

  return {
    columns
  };
}
