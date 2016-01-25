module.exports = [{
  name: '系统设置',
  icon: 'menu-icon fa fa-cogs fa-lg',
  url: '/system',
  filterBy: '*',
  product: '*'
}, {
  name: '系统状态',
  icon: 'menu-icon fa fa-area-chart fa-lg',
  url: '/sysstate',
  filterBy: 'Codec',
  product: 'Codec'
}, {
  name: '编解码器',
  icon: 'menu-icon fa fa-film fa-lg',
  url: '/devcodec',
  filterBy: 'Codec',
  product: 'Codec'
}, {
  name: '主服务器',
  icon: 'menu-icon fa fa-server fa-lg',
  url: '/mainserver',
  filterBy: 'Server',
  product: 'Codec'
}, {
  name: '流媒体源',
  icon: 'menu-icon fa fa-file-movie-o fa-lg',
  url: '/ms_stream',
  filterBy: 'Server',
  product: 'Codec'
}, {
  name: '媒体管理',
  icon: 'menu-icon fa fa-desktop fa-lg',
  url: '/ms_multimedia',
  filterBy: 'Server',
  product: 'Codec'
}, {
  name: '设备管理',
  icon: 'menu-icon fa fa-cubes fa-lg',
  url: '/ms_devmng',
  filterBy: 'Server',
  product: 'Codec'
}, {
  name: '中控',
  icon: 'menu-icon fa fa-dashboard fa-lg',
  url: '/centerctrl',
  filterBy: 'None',
  product: 'Codec'
}, {
  name: '开发',
  icon: 'menu-icon fa fa-terminal fa-lg',
  url: '/develop',
  filterBy: 'Debug',
  product: '*'
}, {
  name: '流媒体测试',
  icon: 'menu-icon fa fa-bug fa-lg',
  url: '/streamtest',
  filterBy: 'Debug',
  product: 'Codec'
}, {
  name: '服务测试',
  icon: 'menu-icon fa fa-bug fa-lg',
  url: '/servertest',
  filterBy: 'Debug',
  product: 'Codec'
}]