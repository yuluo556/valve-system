import React from 'react';
import { Result, Button } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const NotFound = () => {
  return (
    <Result
      status="404"
      title="404"
      subTitle="抱歉，您访问的页面不存在"
      icon={<ExclamationCircleOutlined />}
      extra={
        <Button type="primary" onClick={() => window.location.href = '/'}>
          返回首页
        </Button>
      }
    />
  );
};

export default NotFound;