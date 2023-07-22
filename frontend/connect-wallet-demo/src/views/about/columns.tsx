export function useColumns() {
  const { pkg, lastBuildTime } = __APP_INFO__;
  const { version } = pkg;
  const columns = [
    {
      label: "Version",
      cellRenderer: () => {
        return <el-tag size="small">{version}</el-tag>;
      }
    },
    {
      label: "last compile time",
      cellRenderer: () => {
        return <el-tag size="small">{lastBuildTime}</el-tag>;
      }
    },
    {
      label: "document address",
      cellRenderer: () => {
        return (
          <a href="https://pure-admin-doc.vercel.app" target="_blank">
            <span style="color: var(--el-color-primary)">
              https://pure-admin-doc.vercel.app
            </span>
          </a>
        );
      }
    },
    {
      label: "preview address",
      cellRenderer: () => {
        return (
          <a href="https://vue-pure-admin.vercel.app" target="_blank">
            <span style="color: var(--el-color-primary)">
              https://vue-pure-admin.vercel.app
            </span>
          </a>
        );
      }
    },
    {
      label: "Github",
      cellRenderer: () => {
        return (
          <a
            href="https://github.com/xiaoxian521/vue-pure-admin"
            target="_blank"
          >
            <span style="color: var(--el-color-primary)">Github</span>
          </a>
        );
      }
    },
    {
      label: "QQ exchange group",
      cellRenderer: () => {
        return (
          <a href="https://jq.qq.com/?_wv=1027&k=HntMx0dt" target="_blank">
            <span style="color: var(--el-color-primary)">
              Click the link【Pure Admin】
            </span>
          </a>
        );
      }
    }
  ];

  return {
    columns
  };
}
