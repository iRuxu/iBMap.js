//单点标记
function marker(){
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
        status:true,
    })
}

//多点标记
function markers(){
    iBMap.markers({
        center: { lng: 116.417854, lat: 39.921988 },
        zoom : 5,
        title : '公共通用的标题',
        content : '公共通用的描述',
        data: [
            {
                lng: 116.31994326590801,
                lat: 39.97607404926124,
                title: '中国人民大学',
                content: "北京市海淀区中关村中国人民大学",
                icon: {
                    url:'http://lbsyun.baidu.com/jsdemo/img/fox.gif',
                    width:300,
                    height:170
                },
                status:true
            },
            {
                lng: 112.99818397682962,
                lat: 28.144100359563986,
                title: '中南大学',
                content: "湖南省长沙市韶山路中南大学软件学院"
            },
            {
                lng: 113.95318216526101,
                lat: 22.556131678385142,
                title: '南山科技园',
                content: "广东省深圳市南山科技园"
            }
        ]
    })
}

//URI快速调起
function urimarker(){
    iBMap.URI.marker('map2',{
        lat:39.916979519873,
        lng:116.41004950566
    })
}

jQuery(function($){
    //初始化
    iBMap.init('jKIIKKqQqspECMVMdZZGcXsGRj62sPQS', 'map')

    //正地理编码
    iBMap.geocode('北京市海淀区中关村中国人民大学')
    iBMap.geocode('湖南省长沙市韶山路中南大学铁道学院')
    iBMap.geocode('广东省深圳市南山科技园')

    $('.panel li').on('click',function (){
        $(this).addClass('on').siblings().removeClass('on')
        $('.map').removeClass('on')
    })
    $('.fn_default').on('click',function (){
        $('.default_map').addClass('on')
    })
    $('.fn_uri').on('click',function (){
        $('.iframe_map').addClass('on')
    })

});