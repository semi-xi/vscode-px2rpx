import * as vscode from 'vscode';
import { rpxProcess } from "./process";

export class rpxProvider implements vscode.CompletionItemProvider {

    constructor(private process: rpxProcess) { }

    provideCompletionItems (document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): Thenable<vscode.CompletionItem[]> {

        return new Promise((resolve, reject) => {
			
			let wordAtPosition = document.getWordRangeAtPosition(position);
			var currentWord = '';
			if (wordAtPosition && wordAtPosition.start.character < position.character) {
				var word = document.getText(wordAtPosition);
				currentWord = word.substr(0, position.character - wordAtPosition.start.character);
			}
			// const lineText = document.getText(new vscode.Range(position.with(undefined, 0), position));
            const res = this.process.convert(currentWord);
            if (!res) {
                return resolve([]);
            }
            
            const item = new vscode.CompletionItem(`${res.pxValue}px -> ${res.rpx}`, vscode.CompletionItemKind.Snippet);
            item.insertText = res.rpx;
            return resolve([item]);

        });
    }
}