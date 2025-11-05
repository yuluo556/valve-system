const { query } = require('./utils/db');

async function initDatabase() {
  try {
    console.log('开始初始化数据库...');
    
    // 1. 确保roles表存在并插入必要的角色
    await query(`
      CREATE TABLE IF NOT EXISTS roles (
        id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '角色ID',
        role_name VARCHAR(50) NOT NULL UNIQUE COMMENT '角色名称',
        role_code VARCHAR(50) NOT NULL UNIQUE COMMENT '角色编码',
        description TEXT COMMENT '角色描述',
        permissions TEXT COMMENT '权限JSON',
        status TINYINT DEFAULT 1 COMMENT '状态: 0-禁用, 1-启用',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
      )
    `);
    
    // 插入admin角色（如果不存在）
    await query(
      'INSERT IGNORE INTO roles (role_name, role_code, description, permissions) VALUES (?, ?, ?, ?)',
      ['admin', 'ADMIN', '系统管理员', JSON.stringify(['*'])]
    );
    
    // 插入user角色（如果不存在）
    await query(
      'INSERT IGNORE INTO roles (role_name, role_code, description, permissions) VALUES (?, ?, ?, ?)',
      ['user', 'USER', '普通用户', JSON.stringify(['view', 'monitor'])]
    );
    
    console.log('角色表初始化完成');
    
    // 2. 确保users表有正确的结构
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '用户ID',
        username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
        password VARCHAR(255) NOT NULL COMMENT '密码',
        real_name VARCHAR(50) COMMENT '真实姓名',
        email VARCHAR(100) COMMENT '邮箱',
        phone VARCHAR(20) COMMENT '电话',
        role_id BIGINT NOT NULL COMMENT '角色ID',
        department VARCHAR(100) COMMENT '部门',
        status TINYINT DEFAULT 1 COMMENT '状态: 0-禁用, 1-启用',
        last_login_time DATETIME COMMENT '最后登录时间',
        last_login_ip VARCHAR(50) COMMENT '最后登录IP',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
      )
    `);
    
    // 获取admin角色的ID
    const adminRoles = await query('SELECT id FROM roles WHERE role_name = ?', ['admin']);
    if (adminRoles.length > 0) {
      const adminRoleId = adminRoles[0].id;
      
      // 插入或更新admin用户
      await query(
        'INSERT INTO users (username, password, real_name, email, role_id, status) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE password = VALUES(password), role_id = VALUES(role_id)',
        ['admin', 'admin123', '管理员', 'admin@example.com', adminRoleId, 1]
      );
      console.log('admin用户初始化成功');
    }
    
    // 禁用外键检查以便顺利创建表
    await query('SET FOREIGN_KEY_CHECKS = 0');
    
    // 删除所有相关表
    await query('DROP TABLE IF EXISTS communication_logs');
    await query('DROP TABLE IF EXISTS alarm_notifications');
    await query('DROP TABLE IF EXISTS valve_statistics');
    await query('DROP TABLE IF EXISTS valve_device_configs');
    await query('DROP TABLE IF EXISTS valve_alarms');
    await query('DROP TABLE IF EXISTS valve_devices');
    await query('DROP TABLE IF EXISTS alarm_types');
    await query('DROP TABLE IF EXISTS valve_device_types');
    
    // 3. 创建设备类型表
    await query(`
      CREATE TABLE valve_device_types (
        type_id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '设备类型ID',
        type_name VARCHAR(100) NOT NULL COMMENT '设备类型名称',
        type_code VARCHAR(50) NOT NULL UNIQUE COMMENT '设备类型编码',
        description TEXT COMMENT '设备类型描述',
        status TINYINT DEFAULT 1 COMMENT '状态: 0-禁用, 1-启用',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
      )
    `);
    
    // 插入设备类型示例数据
    const deviceTypes = [
      { type_name: '球阀', type_code: 'BALL_VALVE', type_description: '用于截断或调节介质流量' },
      { type_name: '蝶阀', type_code: 'BUTTERFLY_VALVE', type_description: '适用于大口径管道的调节控制' },
      { type_name: '截止阀', type_code: 'GLOBE_VALVE', type_description: '用于精确调节流量' },
      { type_name: '闸阀', type_code: 'GATE_VALVE', type_description: '用于完全开启或关闭管道' }
    ];
    
    for (const type of deviceTypes) {
      await query(
        'INSERT IGNORE INTO valve_device_types (type_name, type_code, description) VALUES (?, ?, ?)',
        [type.type_name, type.type_code, type.type_description]
      );
    }
    
    console.log('设备类型表初始化完成');
    
    // 4. 创建阀门设备表
    await query(`
      CREATE TABLE valve_devices (
        id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '设备ID',
        device_name VARCHAR(200) NOT NULL COMMENT '设备名称',
        device_type_id BIGINT NOT NULL COMMENT '设备类型ID',
        device_address VARCHAR(100) NOT NULL COMMENT '设备地址',
        description TEXT COMMENT '设备描述',
        status VARCHAR(20) DEFAULT 'offline' COMMENT '状态: online/offline/maintenance',
        last_online DATETIME COMMENT '最后在线时间',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
      )
    `);
    
    // 插入示例设备数据
    const deviceType1 = await query('SELECT type_id FROM valve_device_types WHERE type_code = ?', ['BALL_VALVE']);
    const deviceType2 = await query('SELECT type_id FROM valve_device_types WHERE type_code = ?', ['BUTTERFLY_VALVE']);
    
    const sampleDevices = [
      { device_name: '管道1号球阀', device_type_id: deviceType1[0]?.type_id || 1, device_address: 'DEV-001', status: 'online' },
      { device_name: '管道2号蝶阀', device_type_id: deviceType2[0]?.type_id || 2, device_address: 'DEV-002', status: 'online' },
      { device_name: '管道3号截止阀', device_type_id: 3, device_address: 'DEV-003', status: 'offline' },
      { device_name: '管道4号闸阀', device_type_id: 4, device_address: 'DEV-004', status: 'online' }
    ];
    
    for (const device of sampleDevices) {
      await query(
        'INSERT IGNORE INTO valve_devices (device_name, device_type_id, device_address, description, status, last_online) VALUES (?, ?, ?, ?, ?, ?)',
        [device.device_name, device.device_type_id, device.device_address, '示例设备', device.status, new Date()]
      );
    }
    
    console.log('设备表初始化完成');
    
    // 5. 创建报警类型表
    await query(`
      CREATE TABLE alarm_types (
        type_id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '报警类型ID',
        type_name VARCHAR(100) NOT NULL COMMENT '报警类型名称',
        type_code VARCHAR(50) NOT NULL UNIQUE COMMENT '报警类型编码',
        description TEXT COMMENT '报警类型描述',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
      )
    `);
    
    // 插入报警类型
    const alarmTypes = [
      { type_name: '压力过高', type_code: 'HIGH_PRESSURE' },
      { type_name: '温度过高', type_code: 'HIGH_TEMPERATURE' },
      { type_name: '流量异常', type_code: 'FLOW_ABNORMAL' },
      { type_name: '通信中断', type_code: 'COMMUNICATION_LOST' }
    ];
    
    for (const alarmType of alarmTypes) {
      await query(
        'INSERT IGNORE INTO alarm_types (type_name, type_code, description) VALUES (?, ?, ?)',
        [alarmType.type_name, alarmType.type_code, alarmType.type_name]
      );
    }
    
    console.log('报警类型表初始化完成');
    
    // 6. 创建报警表
    await query(`
      CREATE TABLE valve_alarms (
        alarm_id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '报警ID',
        device_id BIGINT NOT NULL COMMENT '设备ID',
        alarm_type_id BIGINT NOT NULL COMMENT '报警类型ID',
        alarm_message TEXT NOT NULL COMMENT '报警消息',
        status VARCHAR(20) DEFAULT 'active' COMMENT '状态: active/acknowledged/resolved',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
        acknowledged_at DATETIME COMMENT '确认时间',
        resolved_at DATETIME COMMENT '解决时间',
        acknowledged_by BIGINT COMMENT '确认人ID',
        resolved_by BIGINT COMMENT '解决人ID',
        acknowledge_note TEXT COMMENT '确认备注',
        resolve_note TEXT COMMENT '解决备注'
      )
    `);
    
    // 插入示例报警数据
    const alarmType1 = await query('SELECT type_id FROM alarm_types WHERE type_code = ?', ['HIGH_PRESSURE']);
    const devices = await query('SELECT id FROM valve_devices LIMIT 2');
    
    if (alarmType1.length > 0 && devices.length > 0) {
      await query(
        'INSERT IGNORE INTO valve_alarms (device_id, alarm_type_id, alarm_message, status) VALUES (?, ?, ?, ?)',
        [devices[0].id, alarmType1[0].type_id, '设备压力过高，请注意检查', 'active']
      );
      
      if (devices.length > 1) {
        await query(
          'INSERT IGNORE INTO valve_alarms (device_id, alarm_type_id, alarm_message, status) VALUES (?, ?, ?, ?)',
          [devices[1].id, alarmType1[0].type_id, '设备压力异常，需要维护', 'active']
        );
      }
    }
    
    console.log('报警表初始化完成');
    
    console.log('数据库初始化完成！');
  } catch (error) {
    console.error('数据库初始化失败:', error);
    throw error;
  }
}

if (require.main === module) {
  initDatabase()
    .then(() => {
      console.log('数据库初始化脚本执行成功');
      process.exit(0);
    })
    .catch((error) => {
      console.error('数据库初始化脚本执行失败:', error);
      process.exit(1);
    });
}

module.exports = initDatabase;