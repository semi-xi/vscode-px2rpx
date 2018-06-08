'use strict';
import * as vscode from 'vscode';
import { rpxProcess } from './process';
import { rpxProvider } from './provider';

let cog = null;
export function activate(context: vscode.ExtensionContext) {

    cog = vscode.workspace.getConfiguration('px2rpx');

    const process = new rpxProcess(cog);
    let provider = new rpxProvider(process);
    const LANS = ['css', 'less', 'scss', 'sass', 'wxss'];
    for (let lan of LANS) {
        let providerDisposable = vscode.languages.registerCompletionItemProvider(lan, provider);
        context.subscriptions.push(providerDisposable);
    }

    context.subscriptions.push(vscode.commands.registerTextEditorCommand('extension.px2rpx', (textEditor, edit) => {
        const doc = textEditor.document;
        let selection: vscode.Selection | vscode.Range = textEditor.selection;
        if (selection.isEmpty) {
            const start = new vscode.Position(0, 0);
            const end = new vscode.Position(doc.lineCount - 1, doc.lineAt(doc.lineCount - 1).text.length);
            selection = new vscode.Range(start, end);
        }
        
        let text = doc.getText(selection);
        textEditor.edit(builder => {
            builder.replace(selection, process.convertAll(text));
        });
    }));
}
