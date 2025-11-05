const axios = require('axios');
const config = require('../../config/config');

class CozeAPI {
  constructor(apiKey = config.cozeApi.apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = config.cozeApi.baseUrl;
    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * 发送消息到扣子API
   * @param {Object} message - 消息对象
   * @param {string} message.content - 消息内容
   * @param {string} message.chatId - 聊天ID
   * @returns {Promise<Object>} - 返回扣子API的响应
   */
  async sendMessage(message) {
    try {
      const response = await this.client.post('/chat/completions', {
        model: 'gpt-4', // 使用适当的模型
        messages: [{
          role: 'user',
          content: message.content
        }],
        chat_id: message.chatId
      });
      return response.data;
    } catch (error) {
      console.error('扣子API调用失败:', error);
      throw new Error('扣子API调用失败: ' + (error.response?.data?.message || error.message));
    }
  }

  /**
   * 创建新的聊天会话
   * @returns {Promise<Object>} - 返回新创建的聊天会话信息
   */
  async createChatSession() {
    try {
      const response = await this.client.post('/chat/create', {
        model: 'gpt-4'
      });
      return response.data;
    } catch (error) {
      console.error('创建聊天会话失败:', error);
      throw new Error('创建聊天会话失败: ' + (error.response?.data?.message || error.message));
    }
  }

  /**
   * 获取聊天历史
   * @param {string} chatId - 聊天ID
   * @returns {Promise<Object>} - 返回聊天历史
   */
  async getChatHistory(chatId) {
    try {
      const response = await this.client.get(`/chat/history/${chatId}`);
      return response.data;
    } catch (error) {
      console.error('获取聊天历史失败:', error);
      throw new Error('获取聊天历史失败: ' + (error.response?.data?.message || error.message));
    }
  }

  /**
   * 通过链接打开阀门系统
   * @param {string} valveId - 阀门ID
   * @param {string} action - 操作类型 (open/close/adjust)
   * @param {number} value - 调节值（如果是调节操作）
   * @returns {Promise<Object>} - 返回操作结果
   */
  async controlValve(valveId, action, value = null) {
    try {
      // 构建控制命令
      let command = {
        valveId,
        action
      };
      
      if (action === 'adjust' && value !== null) {
        command.value = value;
      }

      // 调用API进行阀门控制
      const response = await this.client.post('/valve/control', command);
      return response.data;
    } catch (error) {
      console.error('阀门控制失败:', error);
      throw new Error('阀门控制失败: ' + (error.response?.data?.message || error.message));
    }
  }
};

module.exports = CozeAPI;