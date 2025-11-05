import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Row, Col, Switch } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();
  const navigate = useNavigate();

  // 登录处理函数
  const handleLogin = async (values) => {
    setLoading(true);
    try {
      // 使用完整的API URL以确保在生产环境中正确连接后端
      const response = await axios.post('http://localhost:3004/api/auth/login', values);
      
      // 保存token和用户信息
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      message.success('登录成功');
      
      // 跳转到首页
      navigate('/');
    } catch (error) {
      console.error('登录失败:', error);
      message.error(
        error.response?.data?.message || '登录失败，请检查用户名和密码'
      );
    } finally {
      setLoading(false);
    }
  };

  // 注册处理函数
  const handleRegister = async (values) => {
    setLoading(true);
    try {
      // 使用完整的API URL以确保在生产环境中正确连接后端
      await axios.post('http://localhost:3004/api/auth/register', values);
      
      message.success('注册成功，请登录');
      
      // 切换回登录模式并清空表单
      setIsRegisterMode(false);
      registerForm.resetFields();
      loginForm.setFieldsValue({ username: values.username });
    } catch (error) {
      console.error('注册失败:', error);
      message.error(
        error.response?.data?.message || '注册失败，请稍后重试'
      );
    } finally {
      setLoading(false);
    }
  };

  // 切换登录/注册模式
  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
    loginForm.resetFields();
    registerForm.resetFields();
  };

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <Row gutter={[24, 0]} align="middle">
        <Col xs={24} md={12} style={{ paddingRight: 24 }}>
          <div style={{ color: 'white', textAlign: 'center' }}>
            <Title level={2} style={{ color: 'white', marginBottom: 24 }}>
              阀门系统智能控制中心
            </Title>
            <Paragraph style={{ fontSize: 18, lineHeight: 1.8 }}>
              高效、安全、智能的阀门监控与控制系统
            </Paragraph>
            <Paragraph style={{ marginTop: 24 }}>
              支持远程监控、实时报警、数据分析等功能
            </Paragraph>
            {!isRegisterMode && (
              <div style={{ marginTop: 24, fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>
                <p>默认管理员账号：</p>
                <p>用户名：admin</p>
                <p>密码：admin123</p>
              </div>
            )}
          </div>
        </Col>
        <Col xs={24} md={12}>
          <Card 
            style={{ 
              width: '100%', 
              maxWidth: 400, 
              margin: '0 auto',
              borderRadius: 8,
              boxShadow: '0 4px 24px rgba(0, 0, 0, 0.15)'
            }}
          >
            <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>
              {isRegisterMode ? '用户注册' : '用户登录'}
            </Title>
            
            {/* 登录表单 */}
            {!isRegisterMode && (
              <Form
                form={loginForm}
                layout="vertical"
                onFinish={handleLogin}
              >
                <Form.Item
                  name="username"
                  label="用户名"
                  rules={[{ required: true, message: '请输入用户名' }]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="请输入用户名"
                    size="large"
                  />
                </Form.Item>
                
                <Form.Item
                  name="password"
                  label="密码"
                  rules={[{ required: true, message: '请输入密码' }]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="请输入密码"
                    size="large"
                  />
                </Form.Item>
                
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    style={{ width: '100%', height: 40 }}
                    loading={loading}
                  >
                    登录
                  </Button>
                </Form.Item>
                
                <div style={{ textAlign: 'center', marginTop: 16 }}>
                  <span style={{ color: '#1890ff', cursor: 'pointer' }}>忘记密码？</span>
                  <span style={{ margin: '0 10px' }}>·</span>
                  <span 
                    style={{ color: '#1890ff', cursor: 'pointer' }}
                    onClick={toggleMode}
                  >
                    注册账号
                  </span>
                </div>
              </Form>
            )}

            {/* 注册表单 */}
            {isRegisterMode && (
              <Form
                form={registerForm}
                layout="vertical"
                onFinish={handleRegister}
              >
                <Form.Item
                  name="username"
                  label="用户名"
                  rules={[
                    { required: true, message: '请输入用户名' },
                    { min: 3, message: '用户名至少需要3个字符' }
                  ]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="请输入用户名"
                    size="large"
                  />
                </Form.Item>
                
                <Form.Item
                  name="email"
                  label="邮箱"
                  rules={[
                    { required: true, message: '请输入邮箱地址' },
                    { type: 'email', message: '请输入有效的邮箱地址' }
                  ]}
                >
                  <Input
                    prefix={<MailOutlined />}
                    placeholder="请输入邮箱地址"
                    size="large"
                  />
                </Form.Item>
                
                <Form.Item
                  name="password"
                  label="密码"
                  rules={[
                    { required: true, message: '请输入密码' },
                    { min: 6, message: '密码长度至少6位' }
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="请输入密码"
                    size="large"
                  />
                </Form.Item>
                
                <Form.Item
                  name="confirmPassword"
                  label="确认密码"
                  dependencies={['password']}
                  rules={[
                    { required: true, message: '请确认密码' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('两次输入的密码不一致'));
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="请再次输入密码"
                    size="large"
                  />
                </Form.Item>
                
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    style={{ width: '100%', height: 40 }}
                    loading={loading}
                  >
                    注册
                  </Button>
                </Form.Item>
                
                <div style={{ textAlign: 'center', marginTop: 16 }}>
                  <span style={{ color: '#1890ff', cursor: 'pointer' }} onClick={toggleMode}>
                    已有账号？返回登录
                  </span>
                </div>
              </Form>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Login;