const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { query, transaction } = require('../utils/db');

const router = express.Router();

// 获取所有设备
router.get('/', authenticateToken, async (req, res) => {
  try {
    const devices = await query(
      `SELECT v.id as valve_id, v.device_name, v.device_type_id, v.device_address,
              v.status, v.last_online, v.created_at,
              t.type_name
       FROM valve_devices v
       LEFT JOIN valve_device_types t ON v.device_type_id = t.type_id
       ORDER BY v.created_at DESC`
    );
    res.json(devices);
  } catch (error) {
    console.error('获取设备列表错误:', error);
    res.status(500).json({ message: '获取设备列表失败: ' + error.message });
  }
});

// 获取设备详情
router.get('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const devices = await query(
      `SELECT v.id as valve_id, v.device_name, v.device_type_id, v.device_address,
              v.status, v.last_online, v.created_at,
              t.type_name
       FROM valve_devices v
       LEFT JOIN valve_device_types t ON v.device_type_id = t.type_id
       WHERE v.id = ?`,
      [id]
    );
    
    if (devices.length === 0) {
      return res.status(404).json({ message: '设备不存在' });
    }
    
    res.json(devices[0]);
  } catch (error) {
    console.error('获取设备详情错误:', error);
    res.status(500).json({ message: '获取设备详情失败: ' + error.message });
  }
});

// 创建新设备
router.post('/', authenticateToken, authorizeRoles(['admin', 'operator']), [
  body('device_name').notEmpty().withMessage('设备名称不能为空'),
  body('device_type_id').isInt().withMessage('设备类型ID必须是整数'),
  body('device_address').notEmpty().withMessage('设备地址不能为空')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { device_name, device_type_id, device_address, description } = req.body;

  try {
    // 检查设备地址是否已存在
    const existing = await query('SELECT * FROM valve_devices WHERE device_address = ?', [device_address]);
    if (existing.length > 0) {
      return res.status(400).json({ message: '设备地址已存在' });
    }

    // 创建设备
    const result = await query(
      'INSERT INTO valve_devices (device_name, device_type_id, device_address, description, status, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [device_name, device_type_id, device_address, description || '', 'offline']
    );

    res.status(201).json({
      message: '设备创建成功',
      valve_id: result.insertId
    });
  } catch (error) {
    console.error('创建设备错误:', error);
    res.status(500).json({ message: '创建设备失败: ' + error.message });
  }
});

// 更新设备信息
router.put('/:id', authenticateToken, authorizeRoles(['admin', 'operator']), async (req, res) => {
  const { id } = req.params;
  const { device_name, device_type_id, device_address, description } = req.body;

  try {
    // 检查设备是否存在
    const devices = await query('SELECT * FROM valve_devices WHERE valve_id = ?', [id]);
    if (devices.length === 0) {
      return res.status(404).json({ message: '设备不存在' });
    }

    // 更新设备信息
    await query(
      'UPDATE valve_devices SET device_name = ?, device_type_id = ?, device_address = ?, description = ? WHERE valve_id = ?',
      [device_name, device_type_id, device_address, description || '', id]
    );

    res.json({ message: '设备更新成功' });
  } catch (error) {
    console.error('更新设备错误:', error);
    res.status(500).json({ message: '更新设备失败: ' + error.message });
  }
});

// 删除设备
router.delete('/:id', authenticateToken, authorizeRoles(['admin']), async (req, res) => {
  const { id } = req.params;

  try {
    // 使用事务删除设备及其相关配置
    await transaction(async (connection) => {
      // 删除设备配置
      await connection.execute('DELETE FROM valve_device_configs WHERE valve_id = ?', [id]);
      // 删除设备
      await connection.execute('DELETE FROM valve_devices WHERE valve_id = ?', [id]);
    });

    res.json({ message: '设备删除成功' });
  } catch (error) {
    console.error('删除设备错误:', error);
    res.status(500).json({ message: '删除设备失败: ' + error.message });
  }
});

// 控制设备状态
router.post('/:id/control', authenticateToken, authorizeRoles(['admin', 'operator']), [
  body('action').isIn(['open', 'close', 'adjust']).withMessage('无效的操作类型'),
  body('value').if(body('action').equals('adjust')).isInt({ min: 0, max: 100 }).withMessage('调节值必须在0-100之间')
], async (req, res) => {
  const { id } = req.params;
  const { action, value } = req.body;

  try {
    // 检查设备是否存在
    const devices = await query('SELECT * FROM valve_devices WHERE valve_id = ?', [id]);
    if (devices.length === 0) {
      return res.status(404).json({ message: '设备不存在' });
    }

    // 这里应该添加实际的设备控制逻辑
    // 例如调用底层接口或发送命令到设备
    
    // 更新数据库中的设备状态
    let newStatus = action;
    if (action === 'adjust') {
      newStatus = `adjusted_${value}`;
    }
    
    await query(
      'UPDATE valve_devices SET status = ? WHERE valve_id = ?',
      [newStatus, id]
    );

    // 记录控制操作
    await query(
      'INSERT INTO control_logs (valve_id, user_id, action, value, created_at) VALUES (?, ?, ?, ?, NOW())',
      [id, req.user.userId, action, value || null]
    );

    res.json({ message: '设备控制成功', action, value });
  } catch (error) {
    console.error('控制设备错误:', error);
    res.status(500).json({ message: '控制设备失败: ' + error.message });
  }
});

// 获取设备实时数据
router.get('/:id/realtime-data', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const data = await query(
      'SELECT * FROM valve_realtime_data WHERE valve_id = ? ORDER BY timestamp DESC LIMIT 1',
      [id]
    );
    
    res.json(data.length > 0 ? data[0] : {});
  } catch (error) {
    console.error('获取设备实时数据错误:', error);
    res.status(500).json({ message: '获取设备实时数据失败: ' + error.message });
  }
});

module.exports = router;