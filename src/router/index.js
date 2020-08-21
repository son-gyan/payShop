import Vue from "vue";
import Router from "vue-router";
import Home from "@/views/Home.vue";
import Index from "@/views/index/index";
import Store from '@/store'
import api from '@/api/api'
// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router);
const router =  new Router({
	routes: [{
		path: "/",
		name: "Home",
		component: Home,  
		redirect: '/index',           
		children: [
			{
				path: "/index",
				name: "首页",
				component: Index
			}
		]
	},
]
});

router.beforeEach((to, from, next) => {
	let self = this
	window.addEventListener('message', function (e) {
		console.log("第一次获取token:",e.data);
		//debugger
		let bascInfo = {
			authorization:"eyJhbGciOiJIUzI1NiJ9.eyJjb21wYW55SWQiOiJLSFdVNiIsImNyZWF0ZVRpbWVNaWxsaXMiOiIxNTk3OTg5Mzc1NzQ1IiwiY3VycmVudFRpbWVNaWxsaXMiOiIxNTk3OTg5Mzc1NzQ1IiwibG9naW5EZXZpY2UiOiJ3ZWIiLCJleHAiOjE1OTc5OTI5NzUsInVzZXJJZCI6IjI1YjUxZTU0YTk3YTRmMjA4NzRhMzI3Y2JjNWFhOTMxIiwiaWF0IjoxNTk3OTg5Mzc1LCJhY2NvdW50IjoiRkRaMDQiLCJqdGkiOiJ0b2tlbklkIn0.imah42DpIUNc8HxN7fhiqcj9tyhyuc9qmEHq3gvff2s",
			companyId:"KHWU6",
			language:'cn'
		}
		if(Store.state.app.firstEnter){
			return
		}
		if (e.data && e.data.authorization) {
			sessionStorage.setItem('Authorization', e.data.authorization);
			sessionStorage.setItem('companyId', e.data.companyId);
			Store.dispatch('setLanguage', e.data.language)
			init(()=>{
				// 不是首页
				const token = sessionStorage.getItem('Authorization')
				if (token) {
					let resData = Store.state.menu.navTree
                	next(resData[0].menuUrl)
				} else {
					next(to.path)
				}
			});
		}else{
			sessionStorage.setItem('Authorization', bascInfo.authorization);
			sessionStorage.setItem('companyId', bascInfo.companyId);
			Store.dispatch('setLanguage', bascInfo.language)
			init(()=>{
				// 不是首页
				const token = sessionStorage.getItem('Authorization')
				if (token) {
					let resData = Store.state.menu.navTree
                	next(resData[0].menuUrl)
				} /* else {
					next(to.path)
				} */
			});
		}
	})
	next()
});

function init(callBack){
	// 添加动态路由
    api.menu.getMenu().then((res) => {
		if(!res){
			return
		}
		var data = res.data;
		if(data&&data!=null&&data!=""){
			let treeMenu = data.data.menu[0].children;
			sessionStorage.setItem('user', JSON.stringify(data.data));
			sessionStorage.setItem('menuTree', JSON.stringify(treeMenu));
			let dynamicRoutes = addDynamicRoutes(treeMenu);
			handleStaticComponent(router, dynamicRoutes)
			router.addRoutes(router.options.routes)
			//保存用户信息
			Store.dispatch('setUserInfo', data.data)
			// 保存菜单树
			Store.commit('setNavTree', treeMenu)
			//修改第一次进入状态
			Store.dispatch('setFirstEnter', true)
			callBack&&callBack();
		}                
	})
}



/**
 * 处理路由到本地直接指定页面组件的情况
 * 比如'代码生成'是要求直接绑定到'Generator'页面组件
 */
function handleStaticComponent(router, dynamicRoutes) {
    for(let j=0;j<dynamicRoutes.length; j++) {
        if(dynamicRoutes[j].name == '代码生成') {
            dynamicRoutes[j].component = Generator
            break
        }
    }
    router.options.routes[0].children = router.options.routes[0].children.concat(dynamicRoutes)
    console.log(router);
}


/**
* 添加动态(菜单)路由
* @param {*} menuList 菜单列表
* @param {*} routes 递归创建的动态(菜单)路由
*/
function addDynamicRoutes (menuList = [], routes = []) {
    var temp = []
    for (var i = 0; i < menuList.length; i++) {
        if (menuList[i].children && menuList[i].children.length >= 1) {
            temp = temp.concat(menuList[i].children)
        } else if (menuList[i].menuUrl && /\S/.test(menuList[i].menuUrl)) {
            menuList[i].menuUrl = menuList[i].menuUrl.replace(/^\//, '')
            // 创建路由配置
            var route = {
                path: menuList[i].menuUrl,
                component: null,
                name: menuList[i].menuName,
                meta: {
                    icon: menuList[i].iconUrl,
                    index: menuList[i].menuId
                }
            }
			try {
				// 根据菜单URL动态加载vue组件，这里要求vue组件须按照url路径存储
				// 如url="sys/user"，则组件路径应是"@/views/sys/user.vue",否则组件加载不到
				let array = menuList[i].menuUrl.split('/')
				let url = ''
				for(let i=0; i<array.length; i++) {
					url += array[i].substring(0,1).toUpperCase() + array[i].substring(1) + '/'
				}
				url = url.substring(0, url.length - 1)
				route['component'] = resolve => require([`@/views/${url}`], resolve)
			} catch (e) {}
            routes.push(route)
        }
    }
    if (temp.length >= 1) {
        addDynamicRoutes(temp, routes)
    } else {
        console.log('动态路由加载...')
        console.log(routes)
        console.log('动态路由加载完成.')
    }
    return routes
 }
export default router