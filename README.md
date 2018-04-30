# iBMap
DEMO: [http://iruxu.com/iBMap/demo]

### 一、使用Javascript API调起
#### Step.1 引入js文件

加载依赖文件 （*如仅使用URI API，可不加载下列文件*）
```html
<script src="http://libs.baidu.com/jquery/1.10.2/jquery.min.js"></script>
<script src="http://api.map.baidu.com/api?v=2.0&ak=你的AK"></script>
<script type="text/javascript" src="http://api.map.baidu.com/library/SearchInfoWindow/1.5/src/SearchInfoWindow_min.js"></script>
<link rel="stylesheet" href="http://api.map.baidu.com/library/SearchInfoWindow/1.5/src/SearchInfoWindow_min.css" />
<script src="$youpath/iBMap.js"></script> 
```

#### Step.2 初始化
```javascript
iBMap.init('百度AK', '加载地图的id')
//此外需在样式中指定该元素的宽高
```

#### Step.3 调用方法
| 函数名(参数) | 描述 | 备注   |
|-------------| -----| ------|
| iBMap.geocode(string,callback(geo)) | 对传入的字符串地址进行正地理解析 | 回调函数中传入一个Web API返回处理后的geo对象
| iBMap.position(geo) | 传入一个iBMap geo地理对象，定位到指定位置为中心点 | - |
| iBMap.cn | 快速定位到中国全貌 | - |
| iBMap.marker(geo) | 单标记，标记传入的iBMap geo地理对象(见下方) | 如数据是异步回调则可循环该方法创建 |
| iBMap.markers(geos) | 多标记，一次性批量标记多个点(见下方) | data数组中单个的属性可以覆盖统一定义值，信息窗status只能有一个设置为true |


**iBMap geo地理对象格式**
```javascript
//geo
{
    lng : 116.307852,   //地理纬度，必须*
    lat : 40.057031,    //地理经度，必须*
    zoom:16,            //缩放倍数
    title : '百度大厦',   //信息窗的标题
    content : '北京市海淀区上地十街10号', //信息窗显示的内容，可为自定义html
    width : 290,    //信息窗的宽度
    height : 170,   //信息窗的高度
    icon : {    //自定义图标
        url:'http://lbsyun.baidu.com/jsdemo/img/fox.gif',
        width:360,
        height:170
    },  
    status:true    //默认是否显示标记，同一时间只能打开一个
}
```

```javascript
//geos
{
    center: { lng: 116.417854, lat: 39.921988 },    //中心点
    zoom : 5,   //全局缩放倍数
    title : '公共通用的标题',   //默认标题
    content : '公共通用的描述', //默认描述，可为自定html
    data: [ //geo数组
        {
            lng: 116.417854,
            lat: 39.921988,
            title: '小姐姐',    //覆盖默认值
            content: "地址1号",  //覆盖默认值
            icon: { //自定义图标
                url:'http://lbsyun.baidu.com/jsdemo/img/fox.gif',
                width:300,
                height:170
            },
            status:true //此位置默认展开信息窗
        },
        {
            lng: 116.406605,
            lat: 39.921585,
            content: "地址2号"
        },
        {
            lng: 116.412222,
            lat: 39.912345,
            content: "地址3号",
        }
    ]
}
```

### 二、使用URI API调起
URI对象下挂载的方法，无需ak，无需初始化。

| 函数名(参数) | 描述 | 备注 |
|------------ |-----| ---- |
| iBMap.URI.marker(id,geo) | 传入iframe的ID与iBMap geo对象，标记单个点 | 

**注意事项：**

如果你的地图调起是通过弹窗打开，即如果地图装载的容器默认并未渲染（比如设置了display:none），则地图无法正常加载。

*解决方法: *  
a.设置fixed定位，并且设置一个较大的偏移值，例如margin:5000px，当触发时再修正位置  
b.设置transform:scale3d(0,0,0)，默认将其放缩至0，触发候再将其恢复正常transform:sacle(1,1,1)，还可以有一个放缩动画效果。（但是仅使用此条，刚打开页面时，会有一个缩小动画，所以仍旧需要先将其偏移至可视区外，可结合第一条）  
c.根据具体测试，overflow:hidden也能正常渲染地图，但是此时通常你不得不将尺寸设为0，此时加载地图时，标记的位置可能会错误。


