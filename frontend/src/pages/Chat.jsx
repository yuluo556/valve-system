import React, { useState, useEffect, useRef } from 'react';
import { Input, Button, List, Avatar, message, Spin, Empty, Card, Typography, Alert } from 'antd';
import { SendOutlined, UserOutlined, RobotOutlined, LoadingOutlined } from '@ant-design/icons';
import axios from 'axios';

const { TextArea } = Input;
const { Title, Paragraph } = Typography;

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatSessionId, setChatSessionId] = useState(null);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    // 初始化聊天会话和加载历史记录
    initChat();
  }, []);

  // 初始化聊天会话
  const initChat = async () => {
    try {
      setLoadingHistory(true);
      // 尝试获取或创建聊天会话
      const response = await axios.post('/api/chat/create-session');
      setChatSessionId(response.data.sessionId);
      
      // 加载聊天历史
      const historyResponse = await axios.get(`/api/chat/history/${response.data.sessionId}`);
      if (historyResponse.data.length > 0) {
        setMessages(historyResponse.data);
      } else {
        // 如果没有历史记录，添加欢迎消息
        const welcomeMessage = {
          id: 'welcome',
          type: 'ai',
          content: '您好！我是阀门控制系统的智能助手。我可以帮您：\n1. 查询设备状态\n2. 控制阀门开关\n3. 调节阀门开度\n4. 查看报警信息\n\n请告诉我您需要什么帮助？',
          timestamp: new Date().toISOString()
        };
        setMessages([welcomeMessage]);
      }
    } catch (error) {
      console.error('初始化聊天失败:', error);
      message.error('初始化聊天失败，请刷新页面重试');
    } finally {
      setLoadingHistory(false);
      // 滚动到底部
      scrollToBottom();
    }
  };

  // 发送消息
  const sendMessage = async () => {
    if (!inputValue.trim() || !chatSessionId) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date().toISOString()
    };

    // 立即显示用户消息
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      // 发送消息到后端API
      const response = await axios.post('/api/chat/send-message', {
        sessionId: chatSessionId,
        message: inputValue.trim()
      });

      // 添加AI回复消息
      const aiMessage = {
        id: response.data.id || (Date.now() + 1).toString(),
        type: 'ai',
        content: response.data.response,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('发送消息失败:', error);
      message.error('发送消息失败，请重试');
      
      // 添加错误提示消息
      const errorMessage = {
        id: (Date.now() + 2).toString(),
        type: 'error',
        content: '抱歉，我暂时无法回应您的请求。请稍后再试或检查网络连接。',
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  };

  // 处理输入框变化
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // 处理回车键发送
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // 滚动到底部
  const scrollToBottom = () => {
    if (scrollRef.current) {
      setTimeout(() => {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }, 100);
    }
  };

  // 清空聊天记录
  const clearChat = () => {
    setMessages([{
      id: 'welcome',
      type: 'ai',
      content: '您好！我是阀门控制系统的智能助手。我可以帮您：\n1. 查询设备状态\n2. 控制阀门开关\n3. 调节阀门开度\n4. 查看报警信息\n\n请告诉我您需要什么帮助？',
      timestamp: new Date().toISOString()
    }]);
    // 重新创建会话
    initChat();
  };

  return (
    <div className="chat-container">
      <Card 
        title={<Title level={4} style={{ margin: 0 }}>智能控制助手</Title>} 
        extra={<Button type="link" onClick={clearChat}>清空聊天</Button>}
        className="chat-card"
      >
        {/* 使用提示 */}
        <Alert
          message="使用提示"
          description="您可以使用自然语言与助手交流，例如：'开启1号阀门'、'关闭所有阀门'、'将阀门2的开度调节到60%'或'查看最近的报警信息'"
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
        
        {/* 聊天记录区域 */}
        <div 
          className="chat-history" 
          ref={scrollRef}
          style={{ 
            maxHeight: '500px', 
            overflowY: 'auto', 
            marginBottom: '16px',
            padding: '8px'
          }}
        >
          {loadingHistory ? (
            <div style={{ textAlign: 'center', padding: '24px' }}>
              <Spin indicator={<LoadingOutlined spin />} />
              <p>加载历史消息中...</p>
            </div>
          ) : messages.length === 0 ? (
            <Empty description="暂无消息" />
          ) : (
            <List
              dataSource={messages}
              renderItem={item => (
                <List.Item style={{ padding: '8px 0', alignItems: 'flex-start' }}>
                  <List.Item.Meta
                    avatar={
                      item.type === 'user' ? (
                        <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
                      ) : item.type === 'error' ? (
                        <Avatar icon={<RobotOutlined />} style={{ backgroundColor: '#ff4d4f' }} />
                      ) : (
                        <Avatar icon={<RobotOutlined />} style={{ backgroundColor: '#52c41a' }} />
                      )
                    }
                    title={
                      item.type === 'user' ? '您' : item.type === 'error' ? '系统错误' : '智能助手'
                    }
                    description={
                      <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                        <Paragraph 
                          dangerouslySetInnerHTML={{ 
                            __html: item.content.replace(/\n/g, '<br />') 
                          }} 
                        />
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          )}
          
          {/* 加载中状态 */}
          {loading && (
            <List.Item style={{ padding: '8px 0', alignItems: 'flex-start' }}>
              <List.Item.Meta
                avatar={<Avatar icon={<LoadingOutlined spin />} style={{ backgroundColor: '#52c41a' }} />}
                title="智能助手"
                description={
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Spin size="small" style={{ marginRight: 8 }} />
                    <span>思考中...</span>
                  </div>
                }
              />
            </List.Item>
          )}
        </div>

        {/* 输入区域 */}
        <div className="chat-input-area">
          <TextArea
            rows={3}
            placeholder="请输入消息...(回车发送，Shift+回车换行)"
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            disabled={!chatSessionId || loading}
            style={{ resize: 'none', marginBottom: 8 }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={sendMessage}
              disabled={!inputValue.trim() || !chatSessionId || loading}
              loading={loading}
            >
              发送
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Chat;