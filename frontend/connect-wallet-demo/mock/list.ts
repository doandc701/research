import { MockMethod } from "vite-plugin-mock";

export default [
  {
    url: "/getCardList",
    method: "post",
    response: () => {
      return {
        code: 0,
        data: {
          list: [
            {
              index: 1,
              isSetup: true,
              type: 4,
              banner: "https://tdesign.gtimg.com/tdesign-pro/cloud-server.jpg",
              name: "SSL certificate",
              description:
                "SSL certificate is also called server certificate. Tencent Cloud provides you with one-stop service for certificates, including application, management and department of free and paid certificates."
            },
            {
              index: 2,
              isSetup: false,
              type: 4,
              banner: "https://tdesign.gtimg.com/tdesign-pro/t-sec.jpg",
              name: "Nhận dạng khuôn mặt",
              description:
                "SSL certificate is also called server certificate. Tencent Cloud provides you with one-stop service for certificates, including application, management and department of free and paid certificates."
            },
            {
              index: 3,
              isSetup: false,
              type: 5,
              banner: "https://tdesign.gtimg.com/tdesign-pro/ssl.jpg",
              name: "CVM",
              description:
                "Cloud Disk provides you with persistent block-level storage services for CVM. The data in the cloud hard disk is automatically redundant with multiple copies within the availability zone."
            },
            {
              index: 4,
              isSetup: false,
              type: 2,
              banner: "https://tdesign.gtimg.com/tdesign-pro/ssl.jpg",
              name: "SSL certificate",
              description:
                "ApsaraDB cho MySQL cung cấp cho người dùng các dịch vụ cơ sở dữ liệu đám mây cấp doanh nghiệp an toàn, đáng tin cậy, hiệu suất cao và dễ bảo trì."
            },
            {
              index: 5,
              isSetup: true,
              type: 3,
              banner:
                "https://tdesign.gtimg.com/tdesign-pro/face-recognition.jpg",
              name: "SSL certificate",
              description:
                "ApsaraDB cho MySQL cung cấp cho người dùng các dịch vụ cơ sở dữ liệu đám mây cấp doanh nghiệp an toàn, đáng tin cậy, hiệu suất cao và dễ bảo trì."
            },
            {
              index: 6,
              isSetup: true,
              type: 3,
              banner: "https://tdesign.gtimg.com/tdesign-pro/ssl.jpg",
              name: "T-Sec Cloud Firewall",
              description:
                "Sản phẩm Tường lửa đám mây bảo mật Tencent là một sản phẩm tường lửa SaaS được phát triển độc lập bởi nhóm bảo mật Đám mây Tencent kết hợp các ưu điểm của đám mây gốc."
            },
            {
              index: 7,
              isSetup: false,
              type: 1,
              banner: "https://tdesign.gtimg.com/tdesign-pro/t-sec.jpg",
              name: "CVM",
              description:
                "Sản phẩm Tường lửa đám mây bảo mật Tencent là một sản phẩm tường lửa SaaS được phát triển độc lập bởi nhóm bảo mật Đám mây Tencent kết hợp các ưu điểm của đám mây gốc."
            },
            {
              index: 8,
              isSetup: true,
              type: 3,
              banner: "https://tdesign.gtimg.com/tdesign-pro/t-sec.jpg",
              name: "SSL certificate",
              description:
                "Cloud Disk provides you with persistent block-level storage services for CVM. The data in the cloud hard disk is automatically redundant with multiple copies within the availability zone."
            },
            {
              index: 9,
              isSetup: false,
              type: 1,
              banner: "https://tdesign.gtimg.com/tdesign-pro/cloud-server.jpg",
              name: "SSL certificate",
              description:
                "Sản phẩm Tường lửa đám mây bảo mật Tencent là một sản phẩm tường lửa SaaS được phát triển độc lập bởi nhóm bảo mật Đám mây Tencent kết hợp các ưu điểm của đám mây gốc."
            },
            {
              index: 10,
              isSetup: true,
              type: 4,
              banner: "https://tdesign.gtimg.com/tdesign-pro/ssl.jpg",
              name: "CVM",
              description:
                "ApsaraDB cho MySQL cung cấp cho người dùng các dịch vụ cơ sở dữ liệu đám mây cấp doanh nghiệp an toàn, đáng tin cậy, hiệu suất cao và dễ bảo trì."
            },
            {
              index: 11,
              isSetup: true,
              type: 5,
              banner: "https://tdesign.gtimg.com/tdesign-pro/t-sec.jpg",
              name: "Cơ sở dữ liệu đám mây",
              description:
                "SSL certificate is also called server certificate. Tencent Cloud provides you with one-stop service for certificates, including application, management and department of free and paid certificates."
            },
            {
              index: 12,
              isSetup: true,
              type: 2,
              banner: "https://tdesign.gtimg.com/tdesign-pro/t-sec.jpg",
              name: "SSL certificate",
              description:
                "SSL certificate is also called server certificate. Tencent Cloud provides you with one-stop service for certificates, including application, management and department of free and paid certificates."
            },
            {
              index: 13,
              isSetup: true,
              type: 3,
              banner: "https://tdesign.gtimg.com/tdesign-pro/cloud-db.jpg",
              name: "Cơ sở dữ liệu đám mây",
              description:
                "Sản phẩm Tường lửa đám mây bảo mật Tencent là một sản phẩm tường lửa SaaS được phát triển độc lập bởi nhóm bảo mật Đám mây Tencent kết hợp các ưu điểm của đám mây gốc."
            },
            {
              index: 14,
              isSetup: false,
              type: 5,
              banner: "https://tdesign.gtimg.com/tdesign-pro/t-sec.jpg",
              name: "SSL certificate",
              description:
                "Dựa trên công nghệ phân tích khuôn mặt mạnh mẽ của Tencent Youtu, nó cung cấp tính năng phát hiện và phân tích khuôn mặt, định vị các đặc điểm trên khuôn mặt"
            },
            {
              index: 15,
              isSetup: true,
              type: 2,
              banner: "https://tdesign.gtimg.com/tdesign-pro/t-sec.jpg",
              name: "Cơ sở dữ liệu đám mây",
              description:
                "SSL certificate is also called server certificate. Tencent Cloud provides you with one-stop service for certificates, including application, management and department of free and paid certificates."
            },
            {
              index: 16,
              isSetup: false,
              type: 3,
              banner: "https://tdesign.gtimg.com/tdesign-pro/cloud-server.jpg",
              name: "CVM",
              description:
                "Dựa trên công nghệ phân tích khuôn mặt mạnh mẽ của Tencent Youtu, nó cung cấp tính năng phát hiện và phân tích khuôn mặt, định vị các đặc điểm trên khuôn mặt"
            },
            {
              index: 17,
              isSetup: false,
              type: 5,
              banner:
                "https://tdesign.gtimg.com/tdesign-pro/face-recognition.jpg",
              name: "Cơ sở dữ liệu đám mây",
              description:
                "SSL certificate is also called server certificate. Tencent Cloud provides you with one-stop service for certificates, including application, management and department of free and paid certificates."
            },
            {
              index: 18,
              isSetup: false,
              type: 4,
              banner:
                "https://tdesign.gtimg.com/tdesign-pro/face-recognition.jpg",
              name: "Cơ sở dữ liệu đám mây",
              description:
                "Sản phẩm Tường lửa đám mây bảo mật Tencent là một sản phẩm tường lửa SaaS được phát triển độc lập bởi nhóm bảo mật Đám mây Tencent kết hợp các ưu điểm của đám mây gốc."
            },
            {
              index: 19,
              isSetup: true,
              type: 2,
              banner: "https://tdesign.gtimg.com/tdesign-pro/ssl.jpg",
              name: "CVM",
              description:
                "SSL certificate is also called server certificate. Tencent Cloud provides you with one-stop service for certificates, including application, management and department of free and paid certificates."
            },
            {
              index: 20,
              isSetup: true,
              type: 4,
              banner:
                "https://tdesign.gtimg.com/tdesign-pro/face-recognition.jpg",
              name: "SSL certificate",
              description:
                "SSL certificate is also called server certificate. Tencent Cloud provides you with one-stop service for certificates, including application, management and department of free and paid certificates."
            },
            {
              index: 21,
              isSetup: false,
              type: 4,
              banner: "https://tdesign.gtimg.com/tdesign-pro/t-sec.jpg",
              name: "Cơ sở dữ liệu đám mây",
              description:
                "Cloud Disk provides you with persistent block-level storage services for CVM. The data in the cloud hard disk is automatically redundant with multiple copies within the availability zone."
            },
            {
              index: 22,
              isSetup: false,
              type: 3,
              banner: "https://tdesign.gtimg.com/tdesign-pro/cloud-db.jpg",
              name: "CVM",
              description:
                "SSL certificate is also called server certificate. Tencent Cloud provides you with one-stop service for certificates, including application, management and department of free and paid certificates."
            },
            {
              index: 23,
              isSetup: true,
              type: 1,
              banner: "https://tdesign.gtimg.com/tdesign-pro/ssl.jpg",
              name: "Nhận dạng khuôn mặt",
              description:
                "Dựa trên công nghệ phân tích khuôn mặt mạnh mẽ của Tencent Youtu, nó cung cấp tính năng phát hiện và phân tích khuôn mặt, định vị các đặc điểm trên khuôn mặt"
            },
            {
              index: 24,
              isSetup: true,
              type: 4,
              banner: "https://tdesign.gtimg.com/tdesign-pro/ssl.jpg",
              name: "Nhận dạng khuôn mặt",
              description:
                "Dựa trên công nghệ phân tích khuôn mặt mạnh mẽ của Tencent Youtu, nó cung cấp tính năng phát hiện và phân tích khuôn mặt, định vị các đặc điểm trên khuôn mặt"
            },
            {
              index: 25,
              isSetup: false,
              type: 5,
              banner:
                "https://tdesign.gtimg.com/tdesign-pro/face-recognition.jpg",
              name: "CVM",
              description:
                "Cloud Disk provides you with persistent block-level storage services for CVM. The data in the cloud hard disk is automatically redundant with multiple copies within the availability zone."
            },
            {
              index: 26,
              isSetup: true,
              type: 4,
              banner: "https://tdesign.gtimg.com/tdesign-pro/cloud-server.jpg",
              name: "SSL certificate",
              description:
                "Cloud Disk provides you with persistent block-level storage services for CVM. The data in the cloud hard disk is automatically redundant with multiple copies within the availability zone."
            },
            {
              index: 27,
              isSetup: true,
              type: 5,
              banner: "https://tdesign.gtimg.com/tdesign-pro/ssl.jpg",
              name: "CVM",
              description:
                "SSL certificate is also called server certificate. Tencent Cloud provides you with one-stop service for certificates, including application, management and department of free and paid certificates."
            },
            {
              index: 28,
              isSetup: false,
              type: 4,
              banner: "https://tdesign.gtimg.com/tdesign-pro/ssl.jpg",
              name: "Cơ sở dữ liệu đám mây",
              description:
                "Dựa trên công nghệ phân tích khuôn mặt mạnh mẽ của Tencent Youtu, nó cung cấp tính năng phát hiện và phân tích khuôn mặt, định vị các đặc điểm trên khuôn mặt"
            },
            {
              index: 29,
              isSetup: false,
              type: 5,
              banner: "https://tdesign.gtimg.com/tdesign-pro/cloud-db.jpg",
              name: "CVM",
              description:
                "SSL certificate is also called server certificate. Tencent Cloud provides you with one-stop service for certificates, including application, management and department of free and paid certificates."
            },
            {
              index: 30,
              isSetup: true,
              type: 1,
              banner: "https://tdesign.gtimg.com/tdesign-pro/ssl.jpg",
              name: "CVM",
              description:
                "Cloud Disk provides you with persistent block-level storage services for CVM. The data in the cloud hard disk is automatically redundant with multiple copies within the availability zone."
            },
            {
              index: 31,
              isSetup: true,
              type: 4,
              banner: "https://tdesign.gtimg.com/tdesign-pro/cloud-server.jpg",
              name: "CVM",
              description:
                "Dựa trên công nghệ phân tích khuôn mặt mạnh mẽ của Tencent Youtu, nó cung cấp tính năng phát hiện và phân tích khuôn mặt, định vị các đặc điểm trên khuôn mặt"
            },
            {
              index: 32,
              isSetup: false,
              type: 3,
              banner: "https://tdesign.gtimg.com/tdesign-pro/cloud-server.jpg",
              name: "T-Sec Cloud Firewall",
              description:
                "Sản phẩm Tường lửa đám mây bảo mật Tencent là một sản phẩm tường lửa SaaS được phát triển độc lập bởi nhóm bảo mật Đám mây Tencent kết hợp các ưu điểm của đám mây gốc."
            },
            {
              index: 33,
              isSetup: true,
              type: 3,
              banner: "https://tdesign.gtimg.com/tdesign-pro/t-sec.jpg",
              name: "CVM",
              description:
                "ApsaraDB cho MySQL cung cấp cho người dùng các dịch vụ cơ sở dữ liệu đám mây cấp doanh nghiệp an toàn, đáng tin cậy, hiệu suất cao và dễ bảo trì."
            },
            {
              index: 34,
              isSetup: false,
              type: 2,
              banner: "https://tdesign.gtimg.com/tdesign-pro/ssl.jpg",
              name: "SSL certificate",
              description:
                "Sản phẩm Tường lửa đám mây bảo mật Tencent là một sản phẩm tường lửa SaaS được phát triển độc lập bởi nhóm bảo mật Đám mây Tencent kết hợp các ưu điểm của đám mây gốc."
            },
            {
              index: 35,
              isSetup: false,
              type: 1,
              banner: "https://tdesign.gtimg.com/tdesign-pro/cloud-server.jpg",
              name: "Cơ sở dữ liệu đám mây",
              description:
                "Dựa trên công nghệ phân tích khuôn mặt mạnh mẽ của Tencent Youtu, nó cung cấp tính năng phát hiện và phân tích khuôn mặt, định vị các đặc điểm trên khuôn mặt"
            },
            {
              index: 36,
              isSetup: false,
              type: 4,
              banner:
                "https://tdesign.gtimg.com/tdesign-pro/face-recognition.jpg",
              name: "SSL certificate",
              description:
                "Sản phẩm Tường lửa đám mây bảo mật Tencent là một sản phẩm tường lửa SaaS được phát triển độc lập bởi nhóm bảo mật Đám mây Tencent kết hợp các ưu điểm của đám mây gốc."
            },
            {
              index: 37,
              isSetup: true,
              type: 5,
              banner: "https://tdesign.gtimg.com/tdesign-pro/cloud-server.jpg",
              name: "CVM",
              description:
                "ApsaraDB cho MySQL cung cấp cho người dùng các dịch vụ cơ sở dữ liệu đám mây cấp doanh nghiệp an toàn, đáng tin cậy, hiệu suất cao và dễ bảo trì."
            },
            {
              index: 38,
              isSetup: false,
              type: 4,
              banner: "https://tdesign.gtimg.com/tdesign-pro/ssl.jpg",
              name: "Cơ sở dữ liệu đám mây",
              description:
                "Cloud Disk provides you with persistent block-level storage services for CVM. The data in the cloud hard disk is automatically redundant with multiple copies within the availability zone."
            },
            {
              index: 39,
              isSetup: false,
              type: 3,
              banner: "https://tdesign.gtimg.com/tdesign-pro/t-sec.jpg",
              name: "Nhận dạng khuôn mặt",
              description:
                "Cloud Disk provides you with persistent block-level storage services for CVM. The data in the cloud hard disk is automatically redundant with multiple copies within the availability zone."
            },
            {
              index: 40,
              isSetup: true,
              type: 4,
              banner: "https://tdesign.gtimg.com/tdesign-pro/ssl.jpg",
              name: "CVM",
              description:
                "SSL certificate is also called server certificate. Tencent Cloud provides you with one-stop service for certificates, including application, management and department of free and paid certificates."
            },
            {
              index: 41,
              isSetup: true,
              type: 4,
              banner: "https://tdesign.gtimg.com/tdesign-pro/ssl.jpg",
              name: "T-Sec Cloud Firewall",
              description:
                "Cloud Disk provides you with persistent block-level storage services for CVM. The data in the cloud hard disk is automatically redundant with multiple copies within the availability zone."
            },
            {
              index: 42,
              isSetup: true,
              type: 3,
              banner: "https://tdesign.gtimg.com/tdesign-pro/cloud-server.jpg",
              name: "T-Sec Cloud Firewall",
              description:
                "Cloud Disk provides you with persistent block-level storage services for CVM. The data in the cloud hard disk is automatically redundant with multiple copies within the availability zone."
            },
            {
              index: 43,
              isSetup: false,
              type: 3,
              banner: "https://tdesign.gtimg.com/tdesign-pro/cloud-db.jpg",
              name: "SSL certificate",
              description:
                "Cloud Disk provides you with persistent block-level storage services for CVM. The data in the cloud hard disk is automatically redundant with multiple copies within the availability zone."
            },
            {
              index: 44,
              isSetup: true,
              type: 4,
              banner: "https://tdesign.gtimg.com/tdesign-pro/t-sec.jpg",
              name: "SSL certificate",
              description:
                "Cloud Disk provides you with persistent block-level storage services for CVM. The data in the cloud hard disk is automatically redundant with multiple copies within the availability zone."
            },
            {
              index: 45,
              isSetup: false,
              type: 3,
              banner: "https://tdesign.gtimg.com/tdesign-pro/ssl.jpg",
              name: "T-Sec Cloud Firewall",
              description:
                "SSL certificate is also called server certificate. Tencent Cloud provides you with one-stop service for certificates, including application, management and department of free and paid certificates."
            },
            {
              index: 46,
              isSetup: true,
              type: 2,
              banner: "https://tdesign.gtimg.com/tdesign-pro/cloud-server.jpg",
              name: "SSL certificate",
              description:
                "SSL certificate is also called server certificate. Tencent Cloud provides you with one-stop service for certificates, including application, management and department of free and paid certificates."
            },
            {
              index: 47,
              isSetup: false,
              type: 4,
              banner: "https://tdesign.gtimg.com/tdesign-pro/cloud-server.jpg",
              name: "SSL certificate",
              description:
                "Sản phẩm Tường lửa đám mây bảo mật Tencent là một sản phẩm tường lửa SaaS được phát triển độc lập bởi nhóm bảo mật Đám mây Tencent kết hợp các ưu điểm của đám mây gốc."
            },
            {
              index: 48,
              isSetup: false,
              type: 3,
              banner: "https://tdesign.gtimg.com/tdesign-pro/ssl.jpg",
              name: "T-Sec Cloud Firewall",
              description:
                "SSL certificate is also called server certificate. Tencent Cloud provides you with one-stop service for certificates, including application, management and department of free and paid certificates."
            }
          ]
        }
      };
    }
  }
] as MockMethod[];
