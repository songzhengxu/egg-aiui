'use strict';

const crypto = require('crypto');
const TULING = require('tuling');
const tuling = new TULING({ key: '1b19b9a11bd74c218f95546dc1246f8c' });

module.exports = app => {
  class Aiui extends app.Service {
    * checkout(query, token) {
      // 加密/校验流程如下：
      // 将token、timestamp、rand三个参数值进行字典序排序
      const { signature, timestamp, rand } = query;
      const combine = [ timestamp, rand, token ];
      combine.sort();
      const content = combine.join('');
      // 将三个参数字符串拼接成一个字符串进行sha1加密
      const str = crypto.createHash('sha1').update(content).digest('hex');
      // 开发者获得加密后的字符串可与signature对比，标识该请求来源于AIUI服务
      if (str === signature) {
        console.log('接口验证成功');
        // 响应信息：
        // 将token进行sha1加密
        return crypto.createHash('sha1').update(token).digest('hex');
      }
      return {
        code: '-1',
      };
    }
    * tuling(intent) {
      // 调用图灵机器人
      let answerText = '听不懂你在说什么';
      const result = intent;
      const { uuid, text } = intent;
      const data = yield tuling.send({
        userid: uuid,
        info: text,
        loc: '广州市',
      });
      if (data.code === 100000) {
        answerText = data.text;
      }
      console.log('图灵机器人返回: ' + answerText);
      result.answer = {
        answerType: 'openQA',
        emotion: 'default',
        text: answerText,
        type: 'T',
      };
      result.operation = 'ANSWER';
      result.service = 'openQA';
      result.status = 0;
      result.score = 1;
      result.array_index = 0;
      result.engine_time = 0.001;

      return result;
    }
  }

  return Aiui;
};
