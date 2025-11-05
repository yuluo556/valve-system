import React, { useState, useEffect } from 'react';
import { Table, Card, Row, Col, Button, Modal, Form, Input, Select, DatePicker, message, Tag } from 'antd';
import { ReloadOutlined, FilterOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { RangePicker } = DatePicker;

const AlarmManagement = () => {
  const [alarms, setAlarms] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [filters, setFilters] = useState({ status: '', dateRange: null });
  const [filterVisible, setFilterVisible] = useState(false);
  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [currentAlarm, setCurrentAlarm] = useState(null);
  const [actionType, setActionType] = useState(''); // acknowledge 或 resolve
  const [form] = Form.useForm();

  useEffect(() => {
    fetchAlarms();
  }, [currentPage, filters]);

  // 获取报警列表
  const fetchAlarms = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: pageSize
      };

      if (filters.status) {
        params.status = filters.status;
      }

      if (filters.dateRange && filters.dateRange.length === 2) {
        params.start_date = filters.dateRange[0].format('YYYY-MM-DD');
        params.end_date = filters.dateRange[1].format('YYYY-MM-DD');
      }

      const response = await axios.get('/api/alarms', { params });
      setAlarms(response.data.alarms);
      setTotal(response.data.total);
    } catch (error) {
      console.error('获取报警列表失败:', error);
      message.error('获取报警列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 确认报警
  const handleAcknowledge = async (alarm) => {
    setCurrentAlarm(alarm);
    setActionType('acknowledge');
    form.resetFields();
    setActionModalVisible(true);
  };

  // 解决报警
  const handleResolve = async (alarm) => {
    setCurrentAlarm(alarm);
    setActionType('resolve');
    form.resetFields();
    setActionModalVisible(true);
  };

  // 提交操作
  const submitAction = async (values) => {
    try {
      if (actionType === 'acknowledge') {
        await axios.put(`/api/alarms/${currentAlarm.alarm_id}/acknowledge`, {
          note: values.note
        });
        message.success('报警确认成功');
      } else if (actionType === 'resolve') {
        await axios.put(`/api/alarms/${currentAlarm.alarm_id}/resolve`, {
          note: values.note
        });
        message.success('报警解决成功');
      }
      setActionModalVisible(false);
      fetchAlarms();
    } catch (error) {
      console.error('操作失败:', error);
      message.error('操作失败');
    }
  };

  // 应用过滤器
  const applyFilters = (values) => {
    setFilters({
      status: values.status || '',
      dateRange: values.dateRange
    });
    setCurrentPage(1); // 重置到第一页
    setFilterVisible(false);
  };

  // 重置过滤器
  const resetFilters = () => {
    setFilters({ status: '', dateRange: null });
    setCurrentPage(1);
    setFilterVisible(false);
  };

  // 获取状态标签
  const getStatusTag = (status) => {
    switch (status) {
      case 'active':
        return <Tag color="error" className="status-active">未处理</Tag>;
      case 'acknowledged':
        return <Tag color="warning" className="status-acknowledged">已确认</Tag>;
      case 'resolved':
        return <Tag color="success" className="status-resolved">已解决</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  // 表格列定义
  const columns = [
    {
      title: '报警信息',
      dataIndex: 'alarm_message',
      key: 'alarm_message'
    },
    {
      title: '设备名称',
      dataIndex: 'device_name',
      key: 'device_name',
      render: (name) => name || '未知设备'
    },
    {
      title: '报警类型',
      dataIndex: 'alarm_type_name',
      key: 'alarm_type_name',
      render: (type) => type || '未知类型'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusTag(status)
    },
    {
      title: '发生时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (time) => dayjs(time).format('YYYY-MM-DD HH:mm:ss'),
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at)
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <>
          {record.status === 'active' && (
            <Button type="primary" size="small" style={{ marginRight: 8 }} onClick={() => handleAcknowledge(record)}>
              确认
            </Button>
          )}
          {record.status !== 'resolved' && (
            <Button type="primary" danger size="small" onClick={() => handleResolve(record)}>
              解决
            </Button>
          )}
        </>
      )
    }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1>报警管理</h1>
        <div>
          <Button icon={<ReloadOutlined />} onClick={fetchAlarms}>
            刷新
          </Button>
          <Button icon={<FilterOutlined />} style={{ marginLeft: 8 }} onClick={() => setFilterVisible(true)}>
            筛选
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={8}>
          <Card className="stat-card">
            <div style={{ textAlign: 'center' }}>
              <h3>未处理报警</h3>
              <p style={{ fontSize: 24, color: '#f5222d', fontWeight: 'bold' }}>
                {alarms.filter(a => a.status === 'active').length}
              </p>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="stat-card">
            <div style={{ textAlign: 'center' }}>
              <h3>已确认报警</h3>
              <p style={{ fontSize: 24, color: '#faad14', fontWeight: 'bold' }}>
                {alarms.filter(a => a.status === 'acknowledged').length}
              </p>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="stat-card">
            <div style={{ textAlign: 'center' }}>
              <h3>已解决报警</h3>
              <p style={{ fontSize: 24, color: '#52c41a', fontWeight: 'bold' }}>
                {alarms.filter(a => a.status === 'resolved').length}
              </p>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 报警列表 */}
      <Table
        columns={columns}
        dataSource={alarms}
        rowKey="alarm_id"
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: total,
          onChange: (page) => setCurrentPage(page)
        }}
        scroll={{ x: 'max-content' }}
      />

      {/* 筛选模态框 */}
      <Modal
        title="筛选条件"
        open={filterVisible}
        onCancel={() => setFilterVisible(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={applyFilters}>
          <Form.Item name="status" label="状态">
            <Select placeholder="选择状态">
              <Option value="">全部</Option>
              <Option value="active">未处理</Option>
              <Option value="acknowledged">已确认</Option>
              <Option value="resolved">已解决</Option>
            </Select>
          </Form.Item>
          <Form.Item name="dateRange" label="时间范围">
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item>
            <div style={{ textAlign: 'right' }}>
              <Button style={{ marginRight: 8 }} onClick={resetFilters}>
                重置
              </Button>
              <Button type="primary" htmlType="submit">
                应用
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* 操作模态框 */}
      <Modal
        title={actionType === 'acknowledge' ? "确认报警" : "解决报警"}
        open={actionModalVisible}
        onCancel={() => setActionModalVisible(false)}
        onOk={() => form.submit()}
        okText="确认"
        cancelText="取消"
      >
        <Form form={form} layout="vertical" onFinish={submitAction}>
          <Form.Item
            name="note"
            label={actionType === 'acknowledge' ? "确认备注" : "解决备注"}
            rules={[actionType === 'resolve' ? { required: true, message: '请输入解决备注' } : null]}
          >
            <TextArea rows={4} placeholder="请输入备注信息" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AlarmManagement;