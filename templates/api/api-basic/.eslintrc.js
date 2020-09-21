const lint = require('fbi-lint').nodeEslint
module.exports = {
  ...lint,
  rules: {
    ...lint.rules,
    // 你的规则
  },
  // 你的配置项
}
