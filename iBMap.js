/**
 * iBMap 百度地图
 * @author iRuxu
 * @desc git@github.com:iRuxu/iBMap.git
 * 
 */

var iBMap = {

    version: '1.0',
    github: 'git@github.com:iRuxu/iBMap.git',

    //缓存创建的百度地图实例对象
    BMap: {},

    //存储ak用于Web API
    ak: '',

    //存储当前的地理信息
    _lat: 0,
    _lng: 0,
    _zoom: 5,
    _title: '',
    _content: '',
    _status: false,  //默认信息窗关闭
    _width: 0,
    _height: 0,
    _icon: {},

    //iBMap.geo 默认的地理对象
    geo: {
        lat: 35.16277754545299,
        lng: 112.81271748030389,
        zoom: 16,
        title: '我的位置',
        content: '目的地',
        status: false,
        width: 290,
        height: '',
        icon: {
            url: '',
            width: 0,
            height: 0
        },
    },

    //主方法需在页面加载api文件及SearchInfoWindow插件相关文件
    /**
     * init 初始化
     * @desc 创建百度地图实例对象，控件控制
     * @param {string} ak 百度ak密钥
     * @param {string} selectorID 选择器id
     * @returns {object} 返回iBMap对象
     */
    init: function (ak, selectorID) {
        iBMap.ak = ak
        iBMap.BMap = new BMap.Map(selectorID);

        //控件开启
        iBMap.BMap.addControl(new BMap.NavigationControl());
        iBMap.BMap.enableScrollWheelZoom();

        return iBMap
    },

    /**
     * geocode 正地理编码
     * @desc 将字符串转为iBMap地理信息geo对象
     * @param {string} queryAddress 查询的字符串
     * @param {function} callback 查询接口获取编码后执行的回调函数，传入一个iBMap地理信息geo对象
     */
    geocode: function (queryAddress, callback) {
        if (!queryAddress) {
            console.error('[iBMap]正地理编码失败，请输入有效的字符串地址')
        }
        $.ajax({
            url: 'http://api.map.baidu.com/geocoder/v2/',
            type: 'get',
            dataType: 'jsonp',
            data: {
                'ak': iBMap.ak,
                'address': queryAddress,
                'output': 'json'
            },
            success: function (data) {
                var point = {}
                point.lat = data.result.location.lat
                point.lng = data.result.location.lng
                console.log('[iBMap]正地理编码结果', point)
                !!callback && callback(point)
            },
            error: function () {
                console.error('[iBMap]无法连接百度地图正/逆地理编码接口')
            }
        })
    },

    /**
     * position 定位
     * @desc 定位中心坐标与放缩倍数
     * @param {object} geo iBMap地理信息geo对象
     * @returns 返回iBMap对象
     */
    position: function (geo) {
        iBMap._lng = geo.lng || iBMap.geo.lng
        iBMap._lat = geo.lat || iBMap.geo.lat
        iBMap._zoom = geo.zoom || iBMap.geo.zoom
        var point = new BMap.Point(geo.lng, geo.lat);
        iBMap.BMap.centerAndZoom(point, geo.zoom);

        return iBMap
    },

    /**
     * cn 中国
     * @desc 快捷定位到中国概貌
     * @returns 返回iBMap对象
     */
    cn: function () {
        var point = new BMap.Point(iBMap.geo.lng, iBMap.geo.lat);
        iBMap.BMap.centerAndZoom(point,5);

        return iBMap
    },

    fn : {
        openInfo : function(){
            
        }  
    },


    /**
     * marker 单标记
     * @desc 添加单个标记
     * @param {object} geo iBMap地理信息geo对象
     * @param {function} callback 点击标记后执行的回调函数，传入iBMap地理信息geo对象
     * @returns {object} 返回iBMap对象
     */
    marker: function (geo, callback) {

        if (!geo.lng || !geo.lat) {
            console.error('[iBMap]添加标记失败,传入的地理信息对象有误')
        }

        //重定义当前iBMap属性
        iBMap._lng = geo.lng
        iBMap._lat = geo.lat
        iBMap._zoom = geo.zoom || iBMap.geo.zoom
        iBMap._title = geo.title || ''
        iBMap._content = geo.content || ''   //可以为自定义html
        iBMap._width = geo.width || iBMap.geo.width
        iBMap._height = geo.height || iBMap.geo.height

        //创建坐标点
        var point = new BMap.Point(geo.lng, geo.lat);
        iBMap.BMap.centerAndZoom(point, iBMap._zoom);

        //添加标记与设置图标
        if (geo.icon) {
            var myIcon = new BMap.Icon(geo.icon.url, new BMap.Size(geo.icon.width, geo.icon.height));
            var marker = new BMap.Marker(point, { icon: myIcon });
        } else {
            var marker = new BMap.Marker(point);
        }
        iBMap.BMap.addOverlay(marker);
        addClickHandler(geo)

        //绑定标记点击事件
        function addClickHandler(geo) {
            marker.addEventListener("click", function (e) {
                openInfo()
                !!callback && callback(geo)
            }
            );
        }

        //创建检索信息窗口对象
        function openInfo() {
            var searchInfoWindow = new BMapLib.SearchInfoWindow(iBMap.BMap, iBMap._content, {
                title: iBMap._title,      //标题
                width: iBMap._width,      //宽度
                height: iBMap._height,     //高度
                panel: "panel",        //检索结果面板
                enableAutoPan: true,    //自动平移
                searchTypes: [
                    BMAPLIB_TAB_SEARCH,  //周边检索
                    BMAPLIB_TAB_TO_HERE, //到这里去
                    BMAPLIB_TAB_FROM_HERE//从这里出发
                ]
            });
            searchInfoWindow.open(point, iBMap._zoom);
        }

        //是否默认显示信息窗
        !!geo.status && openInfo()

        return iBMap
    },

    /**
     * markers 多标记
     * @desc 批量添加多个标记
     * @param {object} 可集中设置统一的选项，必须包含data数组，data数组中的各项属性会覆写集中设置的值
     * @param {object} 返回iBMap对象
     */
    markers: function (geo, callback) {
        if (!geo.data || !Array.isArray(geo.data)) {
            console.error('[iBMap]传入的标记数据有误')
        }

        //重定义当前iBMap属性
        iBMap._lng = geo.center.lng || iBMap.geo.lng
        iBMap._lat = geo.center.lat || iBMap.geo.lat
        iBMap._zoom = geo.zoom || iBMap.geo.zoom
        iBMap._width = geo.width || iBMap.geo.width
        iBMap._height = geo.height || iBMap.geo.height
        iBMap._title = geo.title ||  iBMap.geo.title
        iBMap._content = geo.content || iBMap.geo.content

        //设置中心坐标点
        iBMap.BMap.centerAndZoom(new BMap.Point(geo.center.lng, geo.center.lat), iBMap._zoom);

        //批量添加标记
        for (var i = 0; i < geo.data.length; i++) {

            if (geo.data[i]['icon']) {
                var myIcon = new BMap.Icon(geo.data[i]['icon']['url'], new BMap.Size(geo.data[i]['icon']['width'], geo.data[i]['icon']['height']));
                var marker = new BMap.Marker(new BMap.Point(geo.data[i]['lng'], geo.data[i]['lat']), { icon: myIcon });
            } else {
                var marker = new BMap.Marker(new BMap.Point(geo.data[i]['lng'], geo.data[i]['lat']));
            }

            iBMap.BMap.addOverlay(marker);
            addClickHandler(geo.data[i]);

            //默认显示指定的一个属性的信息窗,只能设置一个
            !!geo.data[i].status && openInfo(geo.data[i])   
        }

        //绑定标记点击事件，并添加回调
        function addClickHandler(geo) {
            marker.addEventListener("click", function (e) {
                openInfo(geo)
                !!callback && callback(geo)
            }
            );
        }

        //创建信息窗
        function openInfo(geo) {

            //如果批量标注有进行全局设置
            var content = geo.content || iBMap._content
            var title = geo.title || iBMap._title
            var width = geo.width || iBMap._width
            var height = geo.height || iBMap._height

            var point = new BMap.Point(geo.lng, geo.lat);
            var searchInfoWindow = new BMapLib.SearchInfoWindow(iBMap.BMap,content, {
                title: title,
                width: width,      //宽度
                height: height,     //高度
                panel: "panel",        //检索结果面板
                enableAutoPan: true,    //自动平移
                searchTypes: [
                    BMAPLIB_TAB_SEARCH,  //周边检索
                    BMAPLIB_TAB_TO_HERE, //到这里去
                    BMAPLIB_TAB_FROM_HERE//从这里出发
                ]
            });
            searchInfoWindow.open(point, iBMap._zoom)
        }

        return iBMap
    },

    //以下通过URI API调起百度地图嵌入iframe，无需AK，无需初始化
    URI: {
        marker: function (iframeID, geo) {
            var mapurl = 'http://api.map.baidu.com/marker?' +
                'location=' + geo.lat + ',' + geo.lng +
                '&title=' + geo.title +
                '&content=' + geo.content +
                '&output=html'
            document.getElementById(iframeID).src = mapurl
        }
    }

}
