import { currentAgent, prefix } from './config.js'

// 根据当前代理获取对应icon资源路径
export function getIconUrl (url) {
  return `${prefix}${currentAgent}-icon/${url}.png`
}
