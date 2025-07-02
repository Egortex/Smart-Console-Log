import * as vscode from "vscode";

// Функция activate вызывается при активации расширения
export function activate(context: vscode.ExtensionContext) {
	// Регистрация команды smartConsoleLog.log, которая будет доступна в VS Code
	let disposable = vscode.commands.registerCommand("smartConsoleLog.log", () => {
		// Получаем текущий активный текстовый редактор
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showErrorMessage("No active editor");
			return;
		}

		// Получаем документ и язык, на котором написан код
		const document = editor.document;
		const languageId = document.languageId;

		// Список поддерживаемых языков программирования
		const supported = [
			"typescript",
			"javascript",
			"typescriptreact",
			"javascriptreact",
			"python",
			"php",
			"java",
			"csharp",
			"ruby",
			"go",
			"c",
			"cpp",
		];

		// Проверка, поддерживается ли текущий язык
		if (!supported.includes(languageId)) {
			vscode.window.showErrorMessage(`Language ${languageId} not supported`);
			return;
		}

		// Получение пользовательских настроек расширения
		const config = vscode.workspace.getConfiguration("smartConsoleLog");
		const insertAfterBlock = config.get<boolean>("insertAfterBlock", true);
		const templates = config.get<Record<string, string>>("templates", {});

		// Получаем выделенный текст
		const selection = editor.selection;
		const selectedText = document.getText(selection).trim();

		// Если ничего не выделено — показываем сообщение
		if (!selectedText) {
			vscode.window.showInformationMessage("Please select a variable to log.");
			return;
		}

		// Простейший поиск имени функции и класса выше текущей позиции курсора
		const position = selection.active;
		const textBeforeCursor = document.getText(
			new vscode.Range(new vscode.Position(0, 0), position),
		);

		let functionName = "";
		let className = "";
		// Для python, js/ts, php, java, csharp и пр. делаем простой общий поиск

		// Определение имени функции и класса в зависимости от языка
		if (languageId === "python") {
			const pyFuncMatch = textBeforeCursor.match(/def\s+([a-zA-Z0-9_]+)/g);
			functionName = pyFuncMatch
				? pyFuncMatch[pyFuncMatch.length - 1].replace(/def\s+/, "").trim()
				: "";

			const pyClassMatch = textBeforeCursor.match(/class\s+([a-zA-Z0-9_]+)/g);
			className = pyClassMatch
				? pyClassMatch[pyClassMatch.length - 1].replace(/class\s+/, "").trim()
				: "";
		} else if (languageId === "php") {
			const phpFuncMatch = textBeforeCursor.match(/function\s+([a-zA-Z0-9_]+)/g);
			functionName = phpFuncMatch
				? phpFuncMatch[phpFuncMatch.length - 1].replace(/function\s+/, "").trim()
				: "";

			const phpClassMatch = textBeforeCursor.match(/class\s+([a-zA-Z0-9_]+)/g);
			className = phpClassMatch
				? phpClassMatch[phpClassMatch.length - 1].replace(/class\s+/, "").trim()
				: "";
		} else if (languageId === "java" || languageId === "csharp") {
			const javaFuncMatch = textBeforeCursor.match(
				/(?:public|private|protected)?\s*(?:static)?\s*\w+\s+([a-zA-Z0-9_]+)\s*\(/g,
			);
			functionName = javaFuncMatch
				? javaFuncMatch[javaFuncMatch.length - 1].replace(/.*\s/, "").replace(/\(.*/, "").trim()
				: "";

			const javaClassMatch = textBeforeCursor.match(/class\s+([a-zA-Z0-9_]+)/g);
			className = javaClassMatch
				? javaClassMatch[javaClassMatch.length - 1].replace(/class\s+/, "").trim()
				: "";
		} else if (languageId === "ruby") {
			// ✅ Ruby
			const rubyFuncMatch = textBeforeCursor.match(/def\s+([a-zA-Z0-9_]+)/g);
			functionName = rubyFuncMatch
				? rubyFuncMatch[rubyFuncMatch.length - 1].replace(/def\s+/, "").trim()
				: "";

			const rubyClassMatch = textBeforeCursor.match(/class\s+([a-zA-Z0-9_:]+)/g);
			className = rubyClassMatch
				? rubyClassMatch[rubyClassMatch.length - 1].replace(/class\s+/, "").trim()
				: "";
		} else if (languageId === "go") {
			// ✅ Go
			const goFuncMatch = textBeforeCursor.match(/func\s+\(*\s*[a-z]*\s*\)*\s*([a-zA-Z0-9_]+)/g);
			functionName = goFuncMatch
				? goFuncMatch[goFuncMatch.length - 1].replace(/func.*?/g, "").trim()
				: "";

			// В Go нет классов, но есть типы
			const goTypeMatch = textBeforeCursor.match(/type\s+([a-zA-Z0-9_]+)\s+struct/g);
			className = goTypeMatch
				? goTypeMatch[goTypeMatch.length - 1].replace(/type\s+/, "").trim()
				: "";
		} else if (languageId === "c" || languageId === "cpp") {
			// ✅ C / C++
			const cFuncMatch = textBeforeCursor.match(/(\w+)\s+\*?\s*\([^\)]*\)/); // простой поиск функции
			functionName = cFuncMatch ? cFuncMatch[1] : "";

			if (languageId === "cpp") {
				// C++ поддерживает классы
				const cppClassMatch = textBeforeCursor.match(/class\s+([a-zA-Z0-9_]+)/g);
				className = cppClassMatch
					? cppClassMatch[cppClassMatch.length - 1].replace(/class\s+/, "").trim()
					: "";
			}
		} else {
			const jsFuncMatch =
				textBeforeCursor.match(/function\s+([a-zA-Z0-9_]+)/g) ||
				textBeforeCursor.match(/([a-zA-Z0-9_]+)\s*=\s*\(/g) ||
				textBeforeCursor.match(/([a-zA-Z0-9_]+)\s*:\s*\(/g);

			functionName = jsFuncMatch
				? jsFuncMatch[jsFuncMatch.length - 1]
						.replace(/function\s+/, "")
						.replace(/\s*=\s*\(/, "")
						.replace(/\s*:\s*\(/, "")
						.trim()
				: "";

			const jsClassMatch = textBeforeCursor.match(/class\s+([a-zA-Z0-9_]+)/g);
			className = jsClassMatch
				? jsClassMatch[jsClassMatch.length - 1].replace(/class\s+/, "").trim()
				: "";
		}

		// Получаем шаблон из настроек, если нет — дефолт для JS
		let template = templates[languageId];
		if (!template) {
			template = 'console.log("🚀 ~ ${className} ~ ${functionName} ~ ${variable}:", ${variable});';
		}

		// шаблон логирования
		// let logStatement = "";

		// switch (languageId) {
		// 	case "python":
		// 		logStatement = `print("🚀 ~ ${className || ""} ~ ${
		// 			functionName || ""
		// 		} ~ ${selectedText}: ", ${selectedText})`;
		// 		break;
		// 	case "php":
		// 		logStatement = `echo "🚀 ~ ${className || ""} ~ ${
		// 			functionName || ""
		// 		} ~ ${selectedText}: " . ${selectedText} . "\\n";`;
		// 		break;
		// 	case "java":
		// 		logStatement = `System.out.println("🚀 ~ ${className || ""} ~ ${
		// 			functionName || ""
		// 		} ~ ${selectedText}: " + ${selectedText});`;
		// 		break;
		// 	case "csharp":
		// 		logStatement = `Console.WriteLine($"🚀 ~ ${className || ""} ~ ${
		// 			functionName || ""
		// 		} ~ ${selectedText}: {${selectedText}}");`;
		// 		break;
		// 	default:
		// 		logStatement = `console.log("🚀 ~ ${className || ""} ~ ${
		// 			functionName || ""
		// 		} ~ ${selectedText}:", ${selectedText});`;
		// 		break;
		// }
		// Подставляем переменные в шаблон
		const logStatement = template
			.replace(/\${className}/g, className || "")
			.replace(/\${functionName}/g, functionName || "")
			.replace(/\${variable}/g, selectedText);

		// Вставляем лог по правилу insertAfterBlock
		// после блока или сразу после строки
		if (insertAfterBlock) {
			const textAfterCursor = document.getText(
				new vscode.Range(position, document.lineAt(document.lineCount - 1).range.end),
			);

			let blockCloseIndex = -1;
			// Поиск закрывающей скобки или конца блока в зависимости от языка
			if (languageId === "python") {
				const currentIndent = document.lineAt(position.line).firstNonWhitespaceCharacterIndex;
				const lines = textAfterCursor.split("\n");
				for (let i = 0; i < lines.length; i++) {
					const line = lines[i];
					if (line.trim() === "") {
						continue;
					}
					const indent = line.search(/\S/);
					if (indent <= currentIndent) {
						blockCloseIndex = i;
						break;
					}
				}
			} else {
				blockCloseIndex = textAfterCursor.indexOf("}");
			}

			// Если не найден конец блока — вставляем после текущей строки
			if (blockCloseIndex === -1) {
				vscode.window.showWarningMessage(
					"Couldn't find a block end. Inserting after current line.",
				);
				editor.edit((editBuilder) => {
					editBuilder.insert(new vscode.Position(position.line + 1, 0), logStatement + "\n");
				});
				return;
			}

			// Вычисляем позицию вставки
			let insertPos: vscode.Position;
			if (languageId === "python") {
				insertPos = new vscode.Position(position.line + blockCloseIndex + 1, 0);
			} else {
				const bracketPosition = document.positionAt(document.offsetAt(position) + blockCloseIndex);
				insertPos = new vscode.Position(bracketPosition.line + 1, 0);
			}
			// Вставляем лог в нужное место

			editor.edit((editBuilder) => {
				editBuilder.insert(insertPos, logStatement + "\n");
			});
		} else {
			// Вставляем после текущей строки
			const insertPos = new vscode.Position(position.line + 1, 0);
			editor.edit((editBuilder) => {
				editBuilder.insert(insertPos, logStatement + "\n");
			});
		}
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
