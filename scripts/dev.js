#!/usr/bin/env node

import { spawn } from 'child_process';
import open from 'open';

// 启动Next.js开发服务器
const nextDev = spawn('npx', ['next', 'dev'], {
  stdio: 'pipe',
  shell: true
});

// 监听输出，提取端口
nextDev.stdout.on('data', (data) => {
  const output = data.toString();
  console.log(output);
  
  // 查找端口信息
  const portMatch = output.match(/Local:\s+http:\/\/localhost:(\d+)/);
  if (portMatch) {
    const port = portMatch[1];
    const url = `http://localhost:${port}`;
    console.log(`Opening browser at ${url}`);
    open(url);
  }
});

// 监听错误
nextDev.stderr.on('data', (data) => {
  console.error(data.toString());
});

// 监听退出
nextDev.on('exit', (code) => {
  console.log(`Next.js dev server exited with code ${code}`);
});
