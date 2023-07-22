import NProgress from "nprogress";
import "nprogress/nprogress.css";

NProgress.configure({
  // animation
  easing: "ease",
  // Tốc độ tăng thanh tiến trình
  speed: 500,
  // Có hiển thị ico đang tải hay không
  showSpinner: false,
  // auto increment interval
  trickleSpeed: 200,
  // Phần trăm tối thiểu khi khởi tạo
  minimum: 0.3
});

export default NProgress;
