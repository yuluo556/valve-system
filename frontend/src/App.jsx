import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { Layout, Menu, Button, Dropdown, Avatar, message } from 'antd';
import { HomeOutlined, AppstoreOutlined, BellOutlined, UserOutlined, LogoutOutlined, SettingOutlined, BarChartOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios';

// 导入页面组件（稍后创建）
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DeviceManagement from './pages/DeviceManagement';
import AlarmManagement from './pages/AlarmManagement';
import DataAnalysis from './pages/DataAnalysis';
import UserProfile from './pages/UserProfile';
import NotFound from './pages/NotFound';
import ValveControl from './pages/ValveControl';

const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;

// 路由保护组件
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// 主布局组件
const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // 从localStorage获取用户信息
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  // 处理退出登录
  const handleLogout = async () => {
    try {
      // 清除localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setCurrentUser(null);
      message.success('退出登录成功');
    } catch (error) {
      console.error('退出登录失败:', error);
      message.error('退出登录失败');
    }
  };

  // 用户下拉菜单项
  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: <a href="/profile">个人信息</a>
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: <a href="/settings">系统设置</a>
    },
    {
      type: 'divider'
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout
    }
  ];

  return (
    <Layout className="app-layout">
      <Header className="header">
        <div className="logo">
          阀门系统智能控制中心
        </div>
        <div style={{ float: 'right', display: 'flex', alignItems: 'center' }}>
          <Button
            type="primary"
            style={{ marginRight: 16 }}
          >
            <Link to="/control" style={{ color: 'white' }}>快速控制</Link>
          </Button>
          <Dropdown menu={{ items: [
                  {
                    key: 'profile',
                    icon: <UserOutlined />,
                    label: <Link to="/profile">个人信息</Link>
                  },
                  {
                    key: 'settings',
                    icon: <SettingOutlined />,
                    label: <Link to="/settings">系统设置</Link>
                  },
                  {
                    type: 'divider'
                  },
                  {
                    key: 'logout',
                    icon: <LogoutOutlined />,
                    label: '退出登录',
                    onClick: handleLogout
                  }
                ] }} placement="bottomRight">
            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '0 24px' }}>
              <Avatar icon={<UserOutlined />} style={{ marginRight: 8 }} />
              <span>{currentUser?.username || '未登录'}</span>
            </div>
          </Dropdown>
        </div>
      </Header>
      <Layout>
        <Sider
          width={200}
          theme="light"
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          style={{ height: 'calc(100vh - 64px)', overflowY: 'auto' }}
        >
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            style={{ height: '100%', borderRight: 0 }}
            items={[
              {
                key: '/',
                icon: <HomeOutlined />,
                label: <Link to="/">首页</Link>
              },
              {
                key: '/devices',
                icon: <AppstoreOutlined />,
                label: <Link to="/devices">设备管理</Link>
              },
              {
                key: '/alarms',
                icon: <BellOutlined />,
                label: <Link to="/alarms">报警管理</Link>
              },
              {
                key: '/analysis',
                icon: <BarChartOutlined />,
                label: <Link to="/analysis">数据分析</Link>
              },
              {
                key: '/control',
                icon: <ExclamationCircleOutlined />,
                label: <Link to="/control">阀门控制</Link>
              }
            ]}
          />
        </Sider>
        <Layout>
          <Content className="content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/devices" element={<DeviceManagement />} />
              <Route path="/alarms" element={<AlarmManagement />} />
              <Route path="/analysis" element={<DataAnalysis />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/control" element={<ValveControl />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

// API请求拦截器
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// API响应拦截器
axios.interceptors.response.use(
  response => response,
  error => {
              if (error.response?.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.replace('/login');
              }
              return Promise.reject(error);
            }
);

// 主应用组件
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;