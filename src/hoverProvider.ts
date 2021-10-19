const recast = require('recast');
const fs = require('fs');

/**
 * 鼠标悬停提示，当鼠标停在fieldKey上时，显示枚举值和注释
 * @param {string} fieldKeyPath  fieldKey文件地址
 * @param {string} word  悬停文本 
 * @return {array} 返回值 
 */
export const getFieldKey = (fieldKeyPath: string, word: string): string[] =>{
  if (!fieldKeyPath || !word) {
    return [];
  }
  
  const code = fs.readFileSync(fieldKeyPath, 'utf8');
  const ast = recast.parse(code);

  let fieldList: any[] = [];
  
  recast.visit(ast, {
    // 遍历单行注释，根据注释取name和key值
    visitLine(path: any) {
      fieldList.push({
        name: path.node.key.name,
        key: path.node.value.value,
        description: path.value.value,
      });
      return false;
    }
  });

  // 如果找得到对应的值，则悬浮显示注释
  const field = fieldList.find(key=>key.name===word);
  if (field) {
    return [`${field.key} ${field.description}`];
  }

  // 找不到则不显示
  return [];
}