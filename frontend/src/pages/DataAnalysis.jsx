import React from 'react';
import { Card, Typography, Empty } from 'antd';

const { Title, Paragraph } = Typography;

const DataAnalysis = () => {
  return (
    <Card className="page-card">
      <Title level={2}>数据分析</Title>
      <Paragraph>
        数据分析页面正在建设中，敬请期待！
      </Paragraph>
      <Empty description="暂无数据分析功能" />
    </Card>
  );
};

export default DataAnalysis;