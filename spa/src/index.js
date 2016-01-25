/**
 * Boot up the Vue instance and wire up the router.
 */

var Vue = require('vue');
//Vue.config.debug = true;
var VueRouter = require('vue-router');
var api = require('./lib/api');
var globalCfg = require('./lib/settings').globalCfg;
var isInDebugMode = require('./lib/settings').isInDebugMode;
var log = require('./lib/log');
var utils = require('./lib/utils');
var settings = require('./lib/settings');
var productCfg = settings.productCfg;

var authState = {
  signin: false
};

var App = Vue.extend({
  components: {
    //vue-strap components
    vsAccordion:     VueStrap.accordion,
    vsAffix:         VueStrap.affix,
    vsAlert:         VueStrap.alert,
    vsAside:         VueStrap.aside,
    vsCheckboxBtn:   VueStrap.checkboxBtn,
    vsCheckboxGroup: VueStrap.checkboxGroup,
    vsCarousel:      VueStrap.carousel,
    vsDatepicker:    VueStrap.datepicker,
    vsDropdown:      VueStrap.dropdown,
    vsModal:         VueStrap.modal,
    vsOption:        VueStrap.option,
    vsPanel:         VueStrap.panel,
    vsPopover:       VueStrap.popover,
    vsProgressbar:   VueStrap.progressbar,
    vsRadioBtn:      VueStrap.radioBtn,
    vsRadioGroup:    VueStrap.radioGroup,
    vsSelect:        VueStrap.select,
    vsSlider:        VueStrap.slider,
    vsTab:           VueStrap.tab,
    vsTabset:        VueStrap.tabset,
    vsTooltip:       VueStrap.tooltip,
    vsTypeahead:     VueStrap.typeahead,
    //rdash
    rdLinkTable:       require('./components/rd-link-table.vue'),
    rdWidget:          require('./components/rd-widget.vue'),
    rdWidgetHeader:    require('./components/rd-widget-header.vue'),
    rdWidgetBody:      require('./components/rd-widget-body.vue'),
    rdWidgetFooter:    require('./components/rd-widget-footer.vue'),
    appHeader:         require('./views/header.vue'),
    appSidebar:        require('./views/sidebar.vue'),
    //self
    myTable:           require('./components/my-table.vue')
  },
  data: function() {
    return {
      toggle: true,
      sidebar: {
        header: {
          title: '',
          name: '导航',
        },
        menus: require('./configs/menusCfg'),
        footers: [{
          name: 'Tendzone',
          url: 'http://www.tendzone.com/'
        }, {
          name: 'About',
          url: 'http://www.tendzone.com/'
        }, {
          name: 'Support',
          url: 'http://www.tendzone.com/'
        }]
      },
      header: {
        userImgSrc: 'static/assets/img/avatar.jpg'
      },
      productCfg: {
        product: '',
        encoderEn: false,
        decoderEn: false
      },
      modules: []
    }
  },
  ready: function() {
    this.productCfg.product = productCfg.product;
    this.modules.splice(0, 0, productCfg.dftModule);
    api.utils.getPlatformCfg(function(res) {
      if (res && res.code == 0) {
        var platformCfg = res.data;
        if (platformCfg.devModel === 'codec.founder100e') {
          this.productCfg.encoderEn = true;
          this.sidebar.header.title = 'FOUNDER-100E';
        } else if (platformCfg.devModel === 'codec.founder100d') {
          this.productCfg.decoderEn = true;
          this.sidebar.header.title = 'FOUNDER-100D';
        } else if (platformCfg.devModel === 'server.media.pcv1') {
          this.sidebar.header.title = 'M-MD-SERVER';
        }

        log.DEBUG_TRACE('devModel:' + platformCfg.devModel);

        var runTags = JSON.parse(platformCfg.runTags);
        log.DEBUG_TRACE('runTags:' + runTags);
        for (var i = 0; i < runTags.length; i++) {
          if (runTags[i] === 'codec') {
            this.modules.splice(0, 0, 'Codec');
          } else if (runTags[i] === 'mainServer') {
            this.modules.splice(0, 0, 'Server');
          }
        };
        log.DEBUG_TRACE('modules:' + this.modules);
      }
    }.bind(this)); 

    if (!_.contains(this.modules, 'Server')) {
      if (isInDebugMode && productCfg.product === 'Codec') {
        this.modules.splice(0, 0, 'Server');
      }
    }
  }
});

Vue.use(VueRouter);

var router = new VueRouter({
  hashbang: true,
  history: false
});

router.map({
  '/': {
    component: require('./views/system.vue'),
    belongTo: productCfg.dftModule,
    authState: authState
  },
  '/signin': {
    component: require('./views/dev-signin.vue'),
    belongTo: productCfg.dftModule,
    authState: authState
  },
  '/sysstate': {
    component: require('./views/sysstate.vue'),
    belongTo: 'Platform',
    authState: authState
  },
  '/ms_stream': {
    component: require('./views/main-server-stream.vue'),
    belongTo: 'Server',
    authState: authState
  },
  '/ms_multimedia': {
    component: require('./views/main-server-multimedia.vue'),
    belongTo: 'Server',
    authState: authState
  },
  '/ms_devmng': {
    component: require('./views/main-server-devmng.vue'),
    belongTo: 'Server',
    authState: authState
  },
  '/mainserver': {
    component: require('./views/main-server.vue'),
    belongTo: 'Server',
    authState: authState
  },
  '/centerctrl': {
    component: require('./views/centerctrl.vue'),
    belongTo: 'Server',
    authState: authState
  },
  '/devcodec': {
    component: require('./views/dev-codec.vue'),
    belongTo: 'Codec',
    authState: authState
  },
  '/system': {
    component: require('./views/system.vue'),
    belongTo: productCfg.dftModule,
    authState: authState
  },
  '/develop': {
    component: require('./views/develop.vue'),
    belongTo: '*',
    authState: authState
  },
  '/streamtest': {
    component: require('./views/streamtest.vue'),
    belongTo: 'Codec',
    authState: authState
  },
  '/servertest': {
    component: require('./views/servertest.vue'),
    belongTo: 'Server',
    authState: authState
  }
});

router.go('/signin');

router.beforeEach(function(transition) {
  log.DEBUG_TRACE('from:' + transition.from.path + ':' + transition.from.belongTo);
  log.DEBUG_TRACE('to:' + transition.to.path + ':' + transition.to.belongTo);

  if (authState.signin != true 
    && transition.to.path != '/signin') {
    transition.abort();
    return;
  }
  
  api.switchModule(transition.to.belongTo, function() {
    transition.next();
  });
});

router.start(App, '#page-wrapper');