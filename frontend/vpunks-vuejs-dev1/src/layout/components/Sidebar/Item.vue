<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    img: {
      type: String,
      default: ''
    }
  },
  render(h, context) {
    const { icon, title, img } = context.props
    const vnodes = []

    if (icon) {
      if (icon.includes('el-icon')) {
        vnodes.push(<i class={[icon, 'sub-el-icon']} />)
      } else {
        vnodes.push(<svg-icon icon-class={icon}/>)
      }
    }

    if (title) {
      if (img) {
        if (img === 'new') {
          vnodes.push(<span slot='title'>{(title)} <img src='./img/icons/new.png' class='new-img' /></span>)
        } else if (img === 'hot') {
          vnodes.push(<span slot='title'>{(title)} <img src='./img/icons/hot.png' class='hot-img' /></span>)
        } else {
          vnodes.push(<span slot='title'>{(title)} <img src='./img/icons/soon.png' class='soon-img' /></span>)
        }
      } else {
        vnodes.push(<span slot='title'>{(title)}</span>)
      }
    }

    return vnodes
  }
}
</script>

<style scoped>
.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}
.hot-img, .new-img, .soon-img {
  position: relative;
  left: 5px;
}
.hot-img {
  top: -9px;
  height: 12px;
}
.new-img {
  top: -8px;
  height: 10.5px;
}
.soon-img {
  top: -9px;
  height: 13px;
}
</style>
