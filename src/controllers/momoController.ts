import axios from "axios";
import { Request, Response } from "express";
import {Payment, LessonChild, Quizzes, Lesson} from "../models/indextModel"
var accessKey = 'F8BBA842ECF85';
var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
const API_URL = 'http://localhost:5000/'
const payment = async (req: Request, res: Response) => {
        //https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
    //parameters
    const {gia, nameCourse, descriptionCourse, imageCourse, userid, courseid, idgv} = req.body;
    const codepayment = {userid: userid, courseid: courseid, idgv: idgv};
    // Chuyển JSON thành chuỗi lưu vào extra
    const jsonString = JSON.stringify(codepayment);
    // Mã hóa chuỗi thành Base64
    const base64Encoded = Buffer.from(jsonString).toString('base64');
    var orderInfo = `${descriptionCourse}`;//'pay with MoMo'
    var partnerCode = 'MOMO';
    var redirectUrl = 'http://localhost:3000/';
    var ipnUrl = 'https://19fe-171-250-165-180.ngrok-free.app/momo/callback';
    var requestType = "payWithMethod";
    var amount = gia;//Giá khóc học
    var orderId = partnerCode + new Date().getTime();
    var requestId = orderId;
    var extraData =base64Encoded;
    var paymentCode = 'T8Qii53fAXyUftPV3m9ysyRhEanUs9KlOPfHgpMR0ON50U10Bh+vZdpJU7VY4z+Z2y77fJHkoDc69scwwzLuW5MzeUKTwPo3ZMaB29imm6YulqnWfTkgzqRaion+EuD7FN9wZ4aXE1+mRt0gHsU193y+yxtRgpmY7SDMU9hCKoQtYyHsfFR5FUAOAKMdw2fzQqpToei3rnaYvZuYaxolprm9+/+WIETnPUDlxCYOiw7vPeaaYQQH0BF0TxyU3zu36ODx980rJvPAgtJzH1gUrlxcSS1HQeQ9ZaVM1eOK/jl8KJm6ijOwErHGbgf/hVymUQG65rHU2MWz9U8QUjvDWA==';
    var orderGroupId ='';
    var autoCapture =true;
    var lang = 'vi';
    var userInfo = {
        "name": "Nguyen Van A",
        "phoneNumber": "0999888999",
        "email": "email_add@domain.com"
    }
    var items = [{
        "id": "204727",  
        "name": `${nameCourse}`,  
        "description": `${descriptionCourse}`,
        "category": "beverage",
        "imageUrl":`${imageCourse}`,
        "manufacturer":"Vinamilk",
        "price": `${gia}`,               
        "quantity": 1,
        "unit":"hộp",
        "totalPrice": gia,
        "taxAmount":"200"
      }]
    //before sign HMAC SHA256 with format
    //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
    var rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType;
    //puts raw signature
    console.log("--------------------RAW SIGNATURE----------------")
    console.log(rawSignature)
    //signature
    const crypto = require('crypto');
    var signature = crypto.createHmac('sha256', secretKey)
        .update(rawSignature)
        .digest('hex');
    console.log("--------------------SIGNATURE----------------")
    console.log(signature)

    //json object send to MoMo endpoint
    const requestBody = JSON.stringify({
        partnerCode : partnerCode,
        partnerName : "Test",
        storeId : "MomoTestStore",
        requestId : requestId,
        amount : amount,
        orderId : orderId,
        orderInfo : orderInfo,
        redirectUrl : redirectUrl,
        ipnUrl : ipnUrl,
        lang : lang,
        requestType: requestType,
        autoCapture: autoCapture,
        extraData : extraData,
        orderGroupId: orderGroupId,
        signature : signature,
        userInfo: userInfo,
        items: items
    });
    //option for axios
    const options = {
        method: "POST",
        url: "https://test-payment.momo.vn/v2/gateway/api/create",
        port: 443,
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(requestBody)
        },
        data: requestBody
    }
    try{
        const res1 = await axios(options);
        return res.status(200).json(res1.data)
    }catch(err){
        return res.status(500).json({err: err})
    }
    
}
//nếu thanh toán thành công thì mới add thêm một payment mới vào 
const callback = async (req: Request, res: Response) => {
    const {extraData, orderId, amount, responseTime, payType, resultCode} = req.body;
    const base64Encoded = extraData;
    // Giải mã Base64 thành chuỗi JSON
    const jsonString = Buffer.from(base64Encoded, 'base64').toString('utf8');

    // Chuyển chuỗi JSON thành đối tượng JSON lấy được mã user và mã môn học 
    const data = JSON.parse(jsonString);
    
    //Lấy số lượng bài giảng con
        const lesson = (await Lesson.findAll({where:{courseid: data.courseid}})).map(item=>item.toJSON());
        const lessonchild = await Promise.all(
            lesson.map(async(item)=>{
                return await LessonChild.findAll({where: {lessonid: item.lessonid}})
            })
        )
        const lenthlesson = lessonchild.reduce((acc, curr) => acc + curr.length, 0); //lấy số lượng bài giảng con 24/10/2024
       //lấy số lượng bài kiểm tra
       const quizzes = await Quizzes.findAll({where: {courseid: data.courseid}});
       const lengthquizzes = quizzes.length;
       const tongbaigiang = lengthquizzes + lenthlesson;
    if(resultCode===0){
        await Payment.create({
            transactionid: orderId,
            idgv: data.idgv,
            userid: data.userid,
            courseid: data.courseid,
            amount: amount,
            paymentdate: responseTime,
            paymentmethod: payType,
            status: true
        });
        const res = await axios.post(`${API_URL}enrollment/create`,{courseid: data.courseid, userid: data.userid,totalquizzes:tongbaigiang });
        const idenrollment = res.data.id;
        //lấy id của enrollment
        await axios.post(`${API_URL}usercoursecurrent/create`, {idenrollment: idenrollment});
    }
    return res.status(200).json(req.body);
}

//kiểm tra trạng thái giao dịch
const kiemtragiaodich = async (req: Request, res: Response) => {
    const {orderId} = req.body;;
    const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=MOMO&requestId=${orderId}`
    const crypto = require('crypto');
    var signature = crypto.createHmac('sha256', secretKey)
        .update(rawSignature)
        .digest('hex');

    const requestBody = JSON.stringify({
        partnerCode: "MOMO",
        requestId: orderId,
        orderId,
        signature,
        lang:"vi"
    });
    const options = {
        method: "POST",
        url: "https://test-payment.momo.vn/v2/gateway/api/query",
        headers: {
            'Content-Type': 'application/json',
        },
        data: requestBody
    }
    let result = await axios(options);
    return res.status(200).json(result.data);
}

export  {callback, payment, kiemtragiaodich};