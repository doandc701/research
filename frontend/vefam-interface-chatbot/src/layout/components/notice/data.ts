export interface ListItem {
  avatar: string;
  title: string;
  datetime: string;
  type: string;
  description: string;
  status?: "" | "success" | "warning" | "info" | "danger";
  extra?: string;
}

export interface TabItem {
  key: string;
  name: string;
  list: ListItem[];
}

export const noticesData: TabItem[] = [
  {
    key: "1",
    name: "Notice",
    list: [
      {
        avatar:
          "https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png",
        title: "Bạn đã nhận được 12 tuần báo mới",
        datetime: "a year ago",
        description: "",
        type: "1"
      },
      {
        avatar:
          "https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png",
        title:
          "Chuyên gia front-end mà bạn giới thiệu đã vượt qua vòng phỏng vấn thứ ba",
        datetime: "a year ago",
        description: "",
        type: "1"
      },
      {
        avatar:
          "https://gw.alipayobjects.com/zos/rmsportal/kISTdvpyTAhtGxpovNWd.png",
        title: "Mẫu này có thể phân biệt giữa các loại thông báo khác nhau",
        datetime: "a year ago",
        description: "",
        type: "1"
      },
      {
        avatar:
          "https://gw.alipayobjects.com/zos/rmsportal/GvqBnKhFgObvnSGkDsje.png",
        title:
          "Hiển thị phương pháp xử lý sau khi nội dung tiêu đề vượt quá một dòng. Nếu nội dung vượt quá một dòng, nội dung đó sẽ tự động bị cắt bớt và hỗ trợ chú giải công cụ để hiển thị tiêu đề hoàn chỉnh.",
        datetime: "a year ago",
        description: "",
        type: "1"
      },
      {
        avatar:
          "https://gw.alipayobjects.com/zos/rmsportal/GvqBnKhFgObvnSGkDsje.png",
        title: "Các biểu tượng bên trái dùng để phân biệt các loại",
        datetime: "a year ago",
        description: "",
        type: "1"
      },
      {
        avatar:
          "https://gw.alipayobjects.com/zos/rmsportal/GvqBnKhFgObvnSGkDsje.png",
        title: "Các biểu tượng bên trái dùng để phân biệt các loại",
        datetime: "a year ago",
        description: "",
        type: "1"
      }
    ]
  },
  {
    key: "2",
    name: "Information",
    list: [
      {
        avatar:
          "https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg",
        title: "Li Bai đã nhận xét về bạn",
        description:
          "Đôi khi sẽ có sóng gió và sóng gió, cánh buồm sẽ được treo thẳng ra biển",
        datetime: "a year ago",
        type: "2"
      },
      {
        avatar:
          "https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg",
        title: "Lý Bạch trả lời bạn",
        description:
          "Đường khó đi, đường khó đi, muôn trùng khúc khuỷu, giờ tôi đã bình an vô sự.",
        datetime: "a year ago",
        type: "2"
      },
      {
        avatar:
          "https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg",
        title: "Title",
        description:
          "Vui lòng di chuyển chuột của bạn vào đây để kiểm tra xem các thư dài hơn được xử lý ở đây như thế nào. Trong ví dụ này, số dòng tối đa trong mô tả được đặt thành 2. Nội dung mô tả có nhiều hơn 2 dòng sẽ bị bỏ qua và có thể xem toàn bộ nội dung thông qua chú giải công cụ",
        datetime: "a year ago",
        type: "2"
      }
    ]
  },
  {
    key: "3",
    name: "Agency",
    list: [
      {
        avatar: "",
        title: "Mission name",
        description: "Nhiệm vụ cần bắt đầu trước 2022-11-16 20:00",
        datetime: "",
        extra: "chưa bắt đầu",
        status: "info",
        type: "3"
      },
      {
        avatar: "",
        title: "Thay đổi mã khẩn cấp của bên thứ ba",
        description:
          "Một cú đấm đã được gửi vào ngày 2022-11-16 và nhiệm vụ thay đổi mã cần được hoàn thành trước 2022-11-18",
        datetime: "",
        extra: "due soon",
        status: "danger",
        type: "3"
      },
      {
        avatar: "",
        title: "Kỳ thi An toàn Thông tin",
        description:
          "Chỉ định Xiaoxian hoàn thành bản cập nhật và phát hành trước 2022-12-12",
        datetime: "",
        extra: "8 ngày trôi qua",
        status: "warning",
        type: "3"
      },
      {
        avatar: "",
        title: "Đã phát hành phiên bản vue-pure-admin",
        description: "Đã phát hành phiên bản vue-pure-admin",
        datetime: "",
        extra: "Chế biến",
        type: "3"
      }
    ]
  }
];
