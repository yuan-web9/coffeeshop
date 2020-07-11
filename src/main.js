import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'font-awesome/css/font-awesome.css'
import axios from 'axios'
import VueAxios from 'vue-axios'

// 导入vant框架
import {
    NavBar,
    Form,
    Field,
    Button,
    Uploader,
    Image as VanImage,
    Toast,
    Tabbar,
    TabbarItem,
    Swipe,
    SwipeItem,
    Sidebar,
    SidebarItem,
    Icon,
    Stepper,
    GoodsAction,
    GoodsActionIcon,
    GoodsActionButton,
    Checkbox,
    CheckboxGroup,
    Empty,
    SwipeCell,
    SubmitBar,
    ActionSheet,
    Card,
    Overlay,
    AddressEdit,
    AddressList,
    Area,
    Tab,
    Tabs,
    Cell,
    CellGroup,
    Popup,
    List,
} from 'vant'

// 导入用于设置rem基准值模块
import 'lib-flexible'

// 注册vant框架的组件
Vue.use(NavBar)
    .use(Form)
    .use(Field)
    .use(Button)
    .use(Uploader)
    .use(VanImage)
    .use(Toast)
    .use(Tabbar)
    .use(TabbarItem)
    .use(Swipe)
    .use(SwipeItem)
    .use(Sidebar)
    .use(SidebarItem)
    .use(Icon)
    .use(Stepper)
    .use(GoodsAction)
    .use(GoodsActionIcon)
    .use(GoodsActionButton)
    .use(Checkbox)
    .use(CheckboxGroup)
    .use(Empty)
    .use(SwipeCell)
    .use(SubmitBar)
    .use(Card)
    .use(ActionSheet)
    .use(Overlay)
    .use(AddressList)
    .use(AddressEdit)
    .use(Area)
    .use(Tab)
    .use(Tabs)
    .use(Cell)
    .use(CellGroup)
    .use(Popup)
    .use(List)

// 注册axios
Vue.use(VueAxios, axios)

// 配置请求基础路径
axios.defaults.baseURL = 'http://www.kangliuyong.com:10002'

// 配置post请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

// 发起请求之前的处理
axios.interceptors.request.use(config => {
    

    if (config.method == 'post') {
        let paramsString = '';
        // post请求参数序列化,转化一个字符串
        for (let key in config.data) {
            paramsString += key + '=' + config.data[key] + '&';
        }

        
        config.data = paramsString.slice(0, -1);
        
    }
    return config;
})

Vue.config.productionTip = false

// 添加appkey属性保存appkey
Vue.prototype.appkey = 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA='


// 添加全局过滤器
Vue.filter('formatDate', (value, format) => {
    //value: 2020-07-08T02:40:51.000Z
    //format: yyyy-MM-dd hh:mm:ss
    let current = new Date(value);

    //获取年份
    let year = current.getFullYear();
    // 
    if (/(y+)/.test(format)) {
        //获取匹配组的内容
        let yearContent = RegExp.$1;
        // 

        format = format.replace(yearContent, year);
    }

    //处理月日时分秒
    let dateObject = {
        M: current.getMonth() + 1,
        d: current.getDate(),
        h: current.getHours(),
        m: current.getMinutes(),
        s: current.getSeconds()
    };

    for (let key in dateObject) {
        //创建动态正则表达式
        let reg = new RegExp(`(${key}+)`)
            // 
        if (reg.test(format)) {
            //获取匹配组的内容, RegExp.$n必须需要test验证通过可以获取
            let content = RegExp.$1;
            // 

            //控制补零
            let value = dateObject[key] >= 10 ? dateObject[key] : content.length == 2 ? '0' + dateObject[key] : dateObject[key];
            format = format.replace(content, value);
        }
    }

    return format;
})



new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')