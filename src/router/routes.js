export const routes = [{
        path: '/register',
        name: 'Register',
        component: r => require(['../views/Register.vue'], r)
    },
    {
        path: '/login',
        name: 'Login',
        component: r => require(['../views/Login.vue'], r)
    },
    {
        path: '/detail',
        name: 'Detail',
        component: r => require(['../views/Detail.vue'], r)
    },
    {
        path: '/submitOrder',
        name: 'SubmitOrder',
        component: r => require(['../views/SubmitOrder.vue'], r)
    },
    {
        path: '/address',
        name: 'Address',
        component: r => require(['../views/Address.vue'], r)
    },
    {
        path: '/addressManage',
        name: 'AddressManage',
        component: r => require(['../views/AddressManage.vue'], r)
    },
    {
        path: '/accountManage',
        name: 'AccountManage',
        component: r => require(['../views/AccountManage.vue'], r)
    },
    {
        path: '/myCollect',
        name: 'MyCollect',
        component: r => require(['../views/MyCollect.vue'], r)
    },
    {
        path: '/securityCente',
        name: 'SecurityCente',
        component: r => require(['../views/SecurityCente.vue'], r)
    },
    {
        path: '/findPassword',
        name: 'FindPassword',
        component: r => require(['../views/FindPassword.vue'], r)
    },
    {
        path: '/main',
        name: 'Main',
        component: r => require(['../views/Main.vue'], r),
        children: [{
                path: 'menu',
                name: 'Menu',
                component: r => require(['../views/mainviews/Menu.vue'], r),
            },
            {
                path: 'order',
                name: 'Order',
                component: r => require(['../views/mainviews/Order.vue'], r)
            },
            {
                path: 'shopcart',
                name: 'Shopcart',
                component: r => require(['../views/mainviews/Shopcart.vue'], r)
            },
            {
                path: 'my',
                name: 'My',
                component: r => require(['../views/mainviews/My.vue'], r)
            },
        ]
    },
    {
        path: '*',
        redirect: {
            name: 'Menu'
        }
    }
]