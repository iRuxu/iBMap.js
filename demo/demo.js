jQuery(function($){
    //初始化
    iBMap.init('jKIIKKqQqspECMVMdZZGcXsGRj62sPQS', 'map')

    //正地理编码
    iBMap.geocode('北京市海淀区中关村中国人民大学')
    iBMap.geocode('湖南省长沙市韶山路中南大学铁道学院')
    iBMap.geocode('广东省深圳市南山科技园')

    //默认标记
    iBMap.marker({
        lng : 116.307852,   //地理纬度
        lat : 40.057031,    //地理经度
        zoom:16,        //缩放倍数
        title : '百度大厦',   //信息窗的标题
        content : '北京市海淀区上地十街10号', //显示的内容
        icon : {
            url:'http://lbsyun.baidu.com/jsdemo/img/fox.gif', //自定义图标
            width:360,
            height:170
        },
        status:true
    })

    //URI快速调起
    iBMap.URI.marker('map2',{
        lat:39.916979519873,
        lng:116.41004950566,
        title:'测试名称',
        content:'测试描述'
    })

    console.log(iBMap)

});