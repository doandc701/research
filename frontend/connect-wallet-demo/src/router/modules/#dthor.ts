const dthorRouter = {
  path: "/",
  redirect: "/dthor",
  meta: {
    icon: "link",
    title: "Swap"
  },
  children: [
    {
      path: "/dthor",
      name: "https://dthor.io",
      meta: {
        title: "Swap"
      }
    }
  ]
};
export default dthorRouter;
