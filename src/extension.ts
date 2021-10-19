import * as vscode from 'vscode';
import { getFieldKey } from './hoverProvider';

/**
 * 自动寻找fieldKey.ts文件，更新配置
 */
const updateConfig = () => {
  const workspaceFolders = vscode.workspace.workspaceFolders || [];
  // 找到当前打开的kp7_web_print项目
  const printProject = workspaceFolders.find(project=>project.name==='kp7_web_print');
  if (printProject) {
    // 设置fieldKey.ts目录
    const path = `${printProject.uri.path}/src/constant/fieldKey.ts`;
    vscode.workspace.getConfiguration().update('kpPrintHelper.fieldKey', path).then(()=>{
      const fieldKeyPath = vscode.workspace.getConfiguration().get('kpPrintHelper.fieldKey');
      console.log(`fieldKey目录已被设置为${fieldKeyPath}`);
    })
  }
}

/**
 * 鼠标悬停提示，当鼠标停在fieldKey上时，显示枚举值和注释
 * @param {*} document 
 * @param {*} position 
 * @param {*} token 
 */
const provideHover = (document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Hover> => {
  const word = document.getText(document.getWordRangeAtPosition(position));
  const fieldKeyPath: string = vscode.workspace.getConfiguration().get('kpPrintHelper.fieldKey') || '';
  const hoverText = getFieldKey(fieldKeyPath, word);
  return new vscode.Hover(hoverText);
}

/**
 * 插件被激活时触发，所有代码总入口
 * @param {*} context 插件上下文
 */
export function activate(context: vscode.ExtensionContext) {
  vscode.window.showInformationMessage('打印开发小助手已启动');
  updateConfig();

  // 对ts和tsx提供悬浮提示功能
  context.subscriptions.push(vscode.languages.registerHoverProvider('typescript', {
    provideHover
  }));
  context.subscriptions.push(vscode.languages.registerHoverProvider('typescriptreact', {
    provideHover
  }));
  
}

/**
 * 插件被释放时触发
 */
export function deactivate() {
  vscode.window.showInformationMessage('打印开发小助手已已被释放');
}
