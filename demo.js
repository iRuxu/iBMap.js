jQuery(function ($) {

    iBMap.init('jKIIKKqQqspECMVMdZZGcXsGRj62sPQS', 'map')

    iBMap.geocode('北京市海淀区上地十街10号')

    iBMap.position({
        lng:112.81271748030389,
        lat:45.16277754545299,
        zoom:5
    })

    iBMap.cn()
    
    iBMap.marker({
        lng : 116.307852,   //地理纬度
        lat : 40.057031,    //地理经度
        title : '百度大厦',   //信息窗的标题
        content : '北京市海淀区上地十街10号', //显示的内容
        icon : {
            url:'http://lbsyun.baidu.com/jsdemo/img/fox.gif', //自定义图标
            width:360,
            height:170
        },
        status:true,
        zoom:16
    })

    iBMap.markers({
        center: { lng: 116.417854, lat: 39.921988 },
        data: [
            {
                lng: 116.417854,
                lat: 39.921988,
                title: '地址1',
                content: "北京市东城区王府井大街88号乐天银泰百货八层",
                icon: {
                    url:'http://lbsyun.baidu.com/jsdemo/img/fox.gif',
                    width:300,
                    height:170
                },
                status:true
            },
            {
                lng: 116.406605,
                lat: 39.921585,
                title: '地址2',
                content: "地址：北京市东城区东华门大街"
            },
            {
                lng: 116.412222,
                lat: 39.912345,
                title: '地址3',
                content: "地址：北京市东城区正义路甲5号",
            }
        ]
    })

    iBMap.URI.marker('mapx',{
        lat:39.916979519873,
        lng:116.41004950566
    })

    console.log(iBMap)

});