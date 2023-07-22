import { ref } from "vue";
import dayjs from "dayjs";

export function useColumns() {
  const columns = ref([
    {
      type: "selection",
      width: 55,
      align: "left",
      hide: ({ checkList }) => !checkList.includes("check column")
    },
    {
      label: "serial number",
      type: "index",
      width: 60,
      align: "left",
      hide: ({ checkList }) => !checkList.includes("serial number column")
    },
    {
      label: "Department name",
      prop: "name",
      width: 180,
      align: "left"
    },
    {
      label: "sort",
      prop: "sort",
      width: 60
    },
    {
      label: "state",
      prop: "status",
      width: 80,
      cellRenderer: ({ row, props }) => (
        <el-tag
          size={props.size}
          type={row.status === 1 ? "danger" : "success"}
          effect="plain"
        >
          {row.status === 0 ? "closure" : "turn on"}
        </el-tag>
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
      label: "Remark",
      prop: "remark"
    },
    {
      label: "operate",
      fixed: "right",
      width: 140,
      slot: "operation"
    }
  ]);

  return {
    columns
  };
}
