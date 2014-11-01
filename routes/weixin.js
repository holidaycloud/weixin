/**
 * Created by zzy on 2014/10/17.
 */
var express = require('express');
var router = express.Router();
var weixinAction = require('./../action/weixinAction');

/* GET home page. */
router.get('/configDetail/:id',weixinAction.configDetail);
router.post('/saveConfig/:id',weixinAction.saveConfig);
router.get('/:id', weixinAction.check);
router.post('/:id',weixinAction.msgNotify);
router.get('/accesstoken/:id',weixinAction.accesstoken);
router.get('/codeAccesstoken/:id',weixinAction.codeAccesstoken);
router.post('/createGroup/:id',weixinAction.createGroup);
router.post('/updateGroup/:id',weixinAction.updateGroup);
router.get('/groupList/:id',weixinAction.groupList);
router.get('/getCusGroup/:id',weixinAction.getCusGroup);
router.post('/moveGroup/:id',weixinAction.moveGroup);
router.get('/userInfo/:id',weixinAction.userInfo);
router.get('/userList/:id',weixinAction.userList);
router.post('/createMenu/:id',weixinAction.createMenu);
router.get('/getMenu/:id',weixinAction.getMenu);
router.get('/deleteMenu/:id',weixinAction.deleteMenu);
router.post('/createQRCode/:id',weixinAction.createQRCode);
router.post('/upload/:id',weixinAction.uploadMedia);
router.get('/mediaList/:id',weixinAction.mediaList);
router.get('/getMedia/:id',weixinAction.getMedia);
router.post('/uploadArticles/:id',weixinAction.uploadArticles);
router.post('/groupSendArticle/:id',weixinAction.groupSendArticle);
router.post('/sendOrderTemplate/:id',weixinAction.sendOrderTemplate);

module.exports = router;
