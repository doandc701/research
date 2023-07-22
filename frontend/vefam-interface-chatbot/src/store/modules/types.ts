import { RouteRecordName } from "vue-router";
import Connex from "@vechain/connex";
import { TokenDetails, FundingTokenDetails } from "/@/types/collection";

export type cacheType = {
  mode: string;
  name?: RouteRecordName;
};

export type positionType = {
  startIndex?: number;
  length?: number;
};

export type appType = {
  sidebar: {
    opened: boolean;
    withoutAnimation: boolean;
    // Xác định xem có nên nhấp vào Thu gọn (Collapse) theo cách thủ công hay không
    isClickCollapse: boolean;
  };
  layout: string;
  device: string;
  started: number;
  tokenList: TokenDetails[];
  $connex: Connex;
  fundingWalletList: FundingTokenDetails;
  cAccVET: string;
  cAccVPU: string;
};

export type multiType = {
  path: string;
  parentPath: string;
  name: string;
  meta: any;
  query?: object;
};

export type setType = {
  title: string;
  fixedHeader: boolean;
  hiddenSideBar: boolean;
};

export type userType = {
  token: string;
  name?: string; // guest
  verifyCode?: string;
  currentPage?: number;
  cAccount: {
    userName: string;
    linkedCode: string;
    linkedAddr: string;
  };
  dAccount: {
    myAddr: string;
    linkedCode: string;
    currentPage: string;
  };
};
