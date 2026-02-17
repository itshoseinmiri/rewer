import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	const reviewCommand = vscode.commands.registerCommand('rewer.helloRewer', async () => {
		const branch = await vscode.window.showInputBox({
			prompt: 'Enter the branch name',
			placeHolder: 'e.g. feature'
		});
		if (!branch) {
			return;
		}
		const terminal = vscode.window.createTerminal('Rewer');
		terminal.show();
		terminal.sendText(`rewer -b ${branch}`);
	});

	const commitMsgCommand = vscode.commands.registerCommand('rewer.commitMsg', async () => {
		const terminal = vscode.window.createTerminal('Rewer Commit');
		terminal.show();
		terminal.sendText('rewer commit --msg');
	});

	const explainFileCommand = vscode.commands.registerCommand('rewer.explainFile', async () => {
		let filePath: string | undefined;

		const activeEditor = vscode.window.activeTextEditor;
		if (activeEditor) {
			filePath = activeEditor.document.uri.fsPath;
		}

		if (!filePath) {
			filePath = await vscode.window.showInputBox({
				prompt: 'Enter the file path to explain',
				placeHolder: 'e.g. src/index.ts'
			});
		}

		if (!filePath) {
			return;
		}

		const terminal = vscode.window.createTerminal('Rewer Explain');
		terminal.show();
		terminal.sendText(`rewer explain ${filePath}`);
	});

	const dailyReportCommand = vscode.commands.registerCommand('rewer.dailyReport', async () => {
		const terminal = vscode.window.createTerminal('Rewer Daily');
		terminal.show();
		terminal.sendText('rewer daily');
	});

	const securityScanCommand = vscode.commands.registerCommand('rewer.securityScan', async () => {
		const terminal = vscode.window.createTerminal('Rewer Security');
		terminal.show();
		terminal.sendText('rewer security-scan');
	});

	context.subscriptions.push(reviewCommand, commitMsgCommand, explainFileCommand, dailyReportCommand, securityScanCommand);
}

export function deactivate() {}
