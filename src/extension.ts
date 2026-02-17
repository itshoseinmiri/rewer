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

	context.subscriptions.push(reviewCommand, commitMsgCommand);
}

export function deactivate() {}
