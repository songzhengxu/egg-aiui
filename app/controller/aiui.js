'use strict';
module.exports = app => {
  class Aiui extends app.Controller {
    constructor(ctx) {
      super(ctx);
      this.token = '347711c067ea6a9c';
      this.aeskey = 'be9ec160c4c80849';
      // 接口配置有效性效验
      this.rule = {
        signature: 'string',
        timestamp: 'string',
        rand: 'string',
      };
    }
    // 接口有效性效验
    * index() {
      const query = this.ctx.query;
      this.ctx.validate(this.rule, query);
      const result = yield this.ctx.service.aiui.checkout(query, this.token);
      // 将加密后的内容字符串放在响应消息的body中
      // 将消息返回即可
      this.ctx.body = result;

    }
    // 接收消息
    * create() {
      const { Msg } = this.ctx.request.body;
      // Content 需要自己base64解密
      const msg = JSON.parse(Buffer.from(Msg.Content, 'base64').toString());
      const { intent } = msg;
      if (intent.rc === 4) {
        // 处理不了的东西，调用图灵机器人进行处理
        console.log(intent);
        const result = yield this.ctx.service.aiui.tuling(intent);
        // 返回的结果，不需要自己base64解密
        this.ctx.body = {
          intent: result,
        };
      } else {
        // aiui自己能处理的消息，则直接返回
        console.log(intent);
        this.ctx.body = Msg;
      }
    }
  }
  return Aiui;
};
