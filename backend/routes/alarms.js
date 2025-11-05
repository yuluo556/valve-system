const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { query } = require('../utils/db');

const router = express.Router();

// 获取报警列表
router.get('/', authenticateToken, async (req, res) => {
  const { status, start_date, end_date } = req.query;
  // 确保page和limit是有效的整数
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  
  try {
    // 构建查询条件
    let whereClause = [];
    let params = [];
    
    if (status) {
      whereClause.push('status = ?');
      params.push(status);
    }
    
    if (start_date) {
      whereClause.push('created_at >= ?');
      params.push(start_date);
    }
    
    if (end_date) {
      whereClause.push('created_at <= ?');
      params.push(end_date);
    }
    
    const whereStr = whereClause.length > 0 ? 'WHERE ' + whereClause.join(' AND ') : '';
    
    // 查询报警列表
    const alarms = await query(
      `SELECT a.alarm_id, a.device_id, a.alarm_type_id, a.alarm_message, 
              a.status, a.created_at, a.acknowledged_at, a.resolved_at,
              a.acknowledged_by, a.resolved_by, a.acknowledge_note, a.resolve_note,
              v.device_name, t.type_name as alarm_type_name
       FROM valve_alarms a
       LEFT JOIN valve_devices v ON a.device_id = v.id
       LEFT JOIN alarm_types t ON a.alarm_type_id = t.type_id
       ${whereStr}
       ORDER BY a.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, Number(limit), Number(offset)]
    );
    
    // 获取总数
    const countResult = await query(
      `SELECT COUNT(*) as total FROM valve_alarms a ${whereStr}`,
      params
    );
    
    res.json({
      total: countResult[0].total,
      page: parseInt(page),
      limit: parseInt(limit),
      alarms
    });
  } catch (error) {
    console.error('获取报警列表错误:', error);
    res.status(500).json({ message: '获取报警列表失败: ' + error.message });
  }
});

// 获取报警详情
router.get('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const alarms = await query(
      `SELECT a.alarm_id, a.device_id, a.alarm_type_id, a.alarm_message, 
              a.status, a.created_at, a.acknowledged_at, a.resolved_at,
              a.acknowledged_by, a.resolved_by, a.acknowledge_note, a.resolve_note,
              v.device_name, t.type_name as alarm_type_name
       FROM valve_alarms a
       LEFT JOIN valve_devices v ON a.device_id = v.id
       LEFT JOIN alarm_types t ON a.alarm_type_id = t.type_id
       WHERE a.alarm_id = ?`,
      [id]
    );
    
    if (alarms.length === 0) {
      return res.status(404).json({ message: '报警不存在' });
    }
    
    res.json(alarms[0]);
  } catch (error) {
    console.error('获取报警详情错误:', error);
    res.status(500).json({ message: '获取报警详情失败: ' + error.message });
  }
});

// 确认报警
router.put('/:id/acknowledge', authenticateToken, authorizeRoles(['admin', 'operator']), [
  body('note').optional().isString().withMessage('备注必须是字符串')
], async (req, res) => {
  const { id } = req.params;
  const { note } = req.body;

  try {
    // 检查报警是否存在
    const alarms = await query('SELECT * FROM valve_alarms WHERE alarm_id = ?', [id]);
    if (alarms.length === 0) {
      return res.status(404).json({ message: '报警不存在' });
    }
    
    const alarm = alarms[0];
    if (alarm.status !== 'active') {
      return res.status(400).json({ message: '只能确认活跃状态的报警' });
    }

    // 更新报警状态
    await query(
      'UPDATE valve_alarms SET status = ?, acknowledged_at = NOW(), acknowledged_by = ?, acknowledge_note = ? WHERE alarm_id = ?',
      ['acknowledged', req.user.userId, note || '', id]
    );

    res.json({ message: '报警确认成功' });
  } catch (error) {
    console.error('确认报警错误:', error);
    res.status(500).json({ message: '确认报警失败: ' + error.message });
  }
});

// 解决报警
router.put('/:id/resolve', authenticateToken, authorizeRoles(['admin', 'operator']), [
  body('note').notEmpty().withMessage('解决备注不能为空')
], async (req, res) => {
  const { id } = req.params;
  const { note } = req.body;

  try {
    // 检查报警是否存在
    const alarms = await query('SELECT * FROM valve_alarms WHERE alarm_id = ?', [id]);
    if (alarms.length === 0) {
      return res.status(404).json({ message: '报警不存在' });
    }
    
    const alarm = alarms[0];
    if (alarm.status === 'resolved') {
      return res.status(400).json({ message: '该报警已经解决' });
    }

    // 更新报警状态
    await query(
      'UPDATE valve_alarms SET status = ?, resolved_at = NOW(), resolved_by = ?, resolve_note = ? WHERE alarm_id = ?',
      ['resolved', req.user.userId, note, id]
    );

    res.json({ message: '报警解决成功' });
  } catch (error) {
    console.error('解决报警错误:', error);
    res.status(500).json({ message: '解决报警失败: ' + error.message });
  }
});

// 获取报警统计
router.get('/statistics/summary', authenticateToken, async (req, res) => {
  try {
    // 获取不同状态的报警数量
    const statusCounts = await query(
      'SELECT status, COUNT(*) as count FROM valve_alarms GROUP BY status'
    );
    
    // 获取最近7天的报警趋势
    const dailyTrend = await query(
      `SELECT DATE(created_at) as date, COUNT(*) as count 
       FROM valve_alarms 
       WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
       GROUP BY DATE(created_at)
       ORDER BY date`
    );
    
    // 获取报警类型分布
    const typeDistribution = await query(
      `SELECT t.type_name, COUNT(*) as count 
       FROM valve_alarms a
       LEFT JOIN alarm_types t ON a.alarm_type_id = t.type_id
       GROUP BY t.type_name
       ORDER BY count DESC`
    );
    
    res.json({
      statusCounts,
      dailyTrend,
      typeDistribution
    });
  } catch (error) {
    console.error('获取报警统计错误:', error);
    res.status(500).json({ message: '获取报警统计失败: ' + error.message });
  }
});

module.exports = router;