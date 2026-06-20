export default defineAppConfig({
  pages: [
    'pages/dashboard/index',
    'pages/control/index',
    'pages/handover/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#0A2540',
    navigationBarTitleText: '冷链联控',
    navigationBarTextStyle: 'white',
    backgroundColor: '#0F172A'
  },
  tabBar: {
    color: '#64748B',
    selectedColor: '#00D4AA',
    backgroundColor: '#0A2540',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/dashboard/index',
        text: '行程看板'
      },
      {
        pagePath: 'pages/control/index',
        text: '联控提醒'
      },
      {
        pagePath: 'pages/handover/index',
        text: '交接确认'
      }
    ]
  }
})
