import { IconifyIconOffline } from "/@/components/ReIcon";

export function useColumns() {
  const lists = [
    { type: "", label: "Kind" },
    { type: "success", label: "studious" },
    { type: "info", label: "humor" },
    { type: "danger", label: "travel" },
    { type: "warning", label: "chasing drama" }
  ];

  const columnsA = [
    {
      labelRenderer: () => (
        <div class="flex items-center">
          <el-icon>
            <IconifyIconOffline icon="user" />
          </el-icon>
          username
        </div>
      ),
      value: "xiaoxian"
    },
    {
      labelRenderer: () => (
        <div class="flex items-center">
          <el-icon>
            <IconifyIconOffline icon="iphone" />
          </el-icon>
          Phone number
        </div>
      ),
      value: "123456789"
    },
    {
      labelRenderer: () => (
        <div class="flex items-center">
          <el-icon>
            <IconifyIconOffline icon="location" />
          </el-icon>
          place of residence
        </div>
      ),
      value: "Shanghai"
    }
  ];

  const columnsB = [
    {
      labelRenderer: () => (
        <div class="flex items-center">
          <el-icon>
            <IconifyIconOffline icon="tickets" />
          </el-icon>
          Label
        </div>
      ),
      cellRenderer: () => {
        return lists.map(v => {
          return (
            <el-tag class="mr-10px" type={v.type} size="small" effect="dark">
              {v.label}
            </el-tag>
          );
        });
      }
    },
    {
      labelRenderer: () => (
        <div class="flex items-center">
          <el-icon>
            <IconifyIconOffline icon="office-building" />
          </el-icon>
          contact address
        </div>
      ),
      value: "Xuhui District, Shanghai"
    }
  ];

  const columnsC = [
    {
      labelRenderer: () => (
        <div class="flex items-center">
          <el-icon>
            <IconifyIconOffline icon="notebook" />
          </el-icon>
          study hard, improve every day
        </div>
      ),
      value: "Xuhui District, Shanghai"
    }
  ];

  return {
    columnsA,
    columnsB,
    columnsC
  };
}
