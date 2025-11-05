import React from 'react';
import { Card, Typography, Empty } from 'antd';

const { Title, Paragraph } = Typography;

const UserProfile = () => {
  return (
    <Card className="page-card">
      <Title level={2}>用户信息</Title>
      <Paragraph>
        用户信息页面正在建设中，敬请期待！
      </Paragraph>
      <Empty description="暂无用户信息功能" />
    </Card>
  );
};

export default UserProfile;