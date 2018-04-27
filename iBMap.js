/**
 * iBMap 百度地图
 * @author iRuxu
 * @desc git@github.com:iRuxu/iBMap.git
 * 
 */

var iBMap = {

    version: '0.2',
    github : 'git@github.com:iRuxu/iBMap.git',
    BMap: {},
    ak: '',
    c_lat:0,
    c_lng:0,
    zoom:16,

    //以下方法需在页面加载api文件及SearchInfoWindow插件相关文件
    init: function (ak, selectorID) {
        iBMap.ak = ak
        iBMap.BMap = new BMap.Map(selectorID);
        iBMap.BMap.addControl(new BMap.NavigationControl());
        iBMap.BMap.enableScrollWheelZoom();
    },

    geocode: function (queryAddress, callback) {
        if (!queryAddress) {
            console.error('[iBMap]正逆地理编码失败，请输入有效的字符串地址')
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

    position : function (geo){
        iBMap.c_lng = geo.lng
        iBMap.c_lat = geo.lat
        iBMap.zoom = geo.zoom
        var point = new BMap.Point(geo.lng,geo.lat);
        iBMap.BMap.centerAndZoom(point, geo.zoom);
    },

    marker: function (geo,status,callback) {
        //自定义设置
        var lat = geo.lat
        var lng = geo.lng
        var zoom = geo.zoom || 16
        var title = geo.title || ''
        var content = geo.content || ''   //可以为自定义html
        var width = geo.width || 290
        var height = geo.height || ''

        //创建坐标点
        var point = new BMap.Point(lng, lat);
        if(!iBMap.c_lat && !iBMap.c_lng){   //如果已经设置过中心坐标就不再设置了，用于数据回调中手动批量创建
            iBMap.BMap.centerAndZoom(point,zoom);
        }

        //添加标注
        if (geo.icon) {
            var myIcon = new BMap.Icon(geo.icon.url, new BMap.Size(geo.icon.width,geo.icon.height));
            var marker = new BMap.Marker(point, { icon: myIcon });
        } else {
            var marker = new BMap.Marker(point);
        }
        iBMap.BMap.addOverlay(marker);
        addClickHandler()

        //信息窗事件
        function addClickHandler(){
            marker.addEventListener("click", function (e) {
                openInfo()
                !!callback && callback(geo)
            }
            );
        }

        //创建指定信息窗
        function openInfo(){
            //创建检索信息窗口对象
            var searchInfoWindow = new BMapLib.SearchInfoWindow(iBMap.BMap, content, {
                title: title,      //标题
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
            searchInfoWindow.open(point, zoom);
        }

        //是否默认显示信息窗
        !!status && openInfo()
    },

    markers: function (geo,callback) {
        //自定义设置
        var c_lng = geo.center.lng || 39.921988
        var c_lat = geo.center.lat || 116.417854
        var zoom = geo.zoom || 16
        var list = geo.arr || []
        var len = list.length
        var width = geo.width || 290
        var height = geo.height || ''

        //设置中心坐标点
        iBMap.BMap.centerAndZoom(new BMap.Point(c_lng, c_lat), zoom);

        //批量添加标注
        for (var i = 0; i < len; i++) {
            if (list[i]['icon']) {
                var myIcon = new BMap.Icon(list[i]['icon']['url'], new BMap.Size(geo.icon.width,geo.icon.height));
                var marker = new BMap.Marker(new BMap.Point(list[i]['lng'], list[i]['lat']), { icon: myIcon });
            } else {
                var marker = new BMap.Marker(new BMap.Point(list[i]['lng'], list[i]['lat']));
            }

            var content = list[i]['content'];
            var title = list[i]['title']
            iBMap.BMap.addOverlay(marker);// 将标注添加到地图中
            addClickHandler(content, title,list[i]);
        }

        //信息窗事件
        function addClickHandler(content, title, geo) {
            marker.addEventListener("click", function (e) {
                openInfo(content, e,title)
                !!callback && callback(geo)
            }
            );
        }
        //创建指定信息窗
        function openInfo(content, e,title) {
            var p = e.target;
            var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
            var searchInfoWindow = new BMapLib.SearchInfoWindow(iBMap.BMap, content, {
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
            searchInfoWindow.open(point, zoom)
        }
    },

    //以下通过URI API调起百度地图嵌入iframe，无需AK，无需初始化
    URI: {
        marker: function (iframeID,geo) {
            var mapurl = 'http://api.map.baidu.com/marker?' +
                'location=' + geo.lat + ',' + geo.lng +
                '&title=' + geo.title +
                '&content=' + geo.content +
                '&output=html'
            document.getElementById(iframeID).src = mapurl
        }
    }

}