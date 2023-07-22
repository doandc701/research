export type CollectionDetails01 = {
  value?: any; // sử dụng để gán biến ################# cần xem lại
  id: number | string; // id đặt tự do, tăng dần từ 1
  name: string; // tên bộ sưu tập
  codename: string; // codename định danh
  address?: string; // địa chỉ hợp đồng thông minh
  img: string; // ảnh thumbnail của collection
  avatar: string; // ảnh avatar trong collection/details
  collections: number; // cần loại bỏ *****
  games: number; // số game sử dụng collection này
  standard: string; // tiêu chuẩn mã thông báo
  website: string; // đường dẫn tới bộ sưu tập trên website dự án
  items: string; // số items của bộ sưu tập
  about: string; // giới thiệu
  project: string; // chưa dùn đến *****
  meta_data: {
    type?: string; // loại file lưu meta_data (item list)
    general?: string[];
    attributes?: string[];
  };
  item_name: string; // tên item, sử dụng khi item details không đặt tên
  item_image: {
    base_url: string; // đường dẫn tới folder img của bộ sưu tập
    file_extension: string; // loại file của img
    min_length: number; // eg: 4 thì id < 1000 sẽ thêm 0 vào trước cho đủ độ dài 4, eg: 999 -> 0999, 99 -> 0099, 9 -> 0009
  };
};

export type ItemShow01 = {
  value?: any; // sử dụng để gán biến ################# cần xem lại
  id: number; // sử dụng number để sort
  name: string;
  amount?: number; // ERC1155
  attributes?: any;
  img?: string;
  imgnonebg?: string; // ?????????????????? cần xem lại
  rank?: number; // sử dụng number để sort
  rarity_score?: number; // sử dụng number để sortinfoWithdraw
  codename?: string; // sử dụng ở trang "minting now"
  quantity?: number; // số lượng nft ################# cần xem lại
};
export type TokenDetails = {
  value?: any; // ??? kiểm tra lại xem có dùng không
  name: string; // token name, eg: VeChain
  address: string; // token address
  symbol: string; // eg: VET
  decimals: number; // số thập phân, eg: 18
  logoURI: string; // phải bắt đầu bằng https:
  balanceOf?: string; // số dư (wei)
  // chainId?: number; -> chưa sử dụng
};

/*
FundingTokenDetails: interface cho Funding wallet
depositStatus: 3: ẩn, 4: đình chỉ nạp, (không có đình chỉ add vì đã có đình chỉ chi tiêu)
withdrawStatus: 3: ẩn, 4: đình chỉ rút, 5: đình chỉ rút và chi tiêu, 6: đình chỉ chi tiêu
    (ẩn là đình chỉ tất cả)
*/
export interface FundingTokenDetails extends TokenDetails {
  withdrawStatus?: number; // 4: đình chỉ rút tiền
  withdrawFee?: string; // phí rút token (wei)
  minWithdraw?: string; // số token rút tối thiểu (wei, nên đặt lớn hơn withdrawFee)
  // maxWithdraw?: string; // nên cài đặt cho từng user
  depositStatus?: number; // 4: đình chỉ nạp tiền
  // minDeposit?: string; // quyết định ở smart contract
}

export interface DepositTokenDetails extends FundingTokenDetails {
  enables: boolean;
  minDeposit: string;
}

/*
Collection data type ----------
{
  id: string | number
  name: string,
  codename: string,
  address?: string,
  standard?: string,
  description?: string,
  website?: string,
  items?: number,
  tags?: string[] // eg: ["0 Games"]

  project_id?: string, // tham chiếu đến Id vì ổn định hơn codename
  project_name?: string,
}

Item data type ----------
{
  // id: string | number // tạm thời không sử dụng
  // name: string, // tạm thời không sử dụng
  // codename: string, // tạm thời không sử dụng
  // standard?: string, // tạm thời không sử dụng

  item_name: string, // nếu name trong items không được quy định thì sử dụng item_name này
  item_image: { // sử dụng cấu trúc này thì tên file phải sử dụng itemId
    base_url: string,
    file_extension: string, // png, jpg, gif,...
    min_length: number, // eg: 4 thì id < 1000 sẽ thêm 0 vào trước cho đủ độ dài 4, eg: 999 -> 0999, 99 -> 0099, 9 -> 0009
  },
  item_tags?: string[],

  items: {
    id: string | number
    name?: string, // nếu không có thì sử dụng item_name bên ngoài
    description?: string, // nếu không có thì sử dụng collection description
    image?: string, // kết hợp với base_url bên ngoài, nếu không có thì sử dụng item_image bên ngoài
    3d_url?: string,
    external_url?: string,
    rarity_score?: number,
    rank?: number,
    general?: [
      {
        display_type?: number | date,
        trait_type: string,
        value?: string
      }
    ],
    attributes: [
      {
        display_type?: number | date,
        trait_type: string,
        value?: string
      }
    ],
    tags?: string[]
  }
}
*/
