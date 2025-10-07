# Smart Console Log — VS Code Extension

A Visual Studio Code extension that helps you quickly insert debugging logs into your code.  
Supports multiple programming languages with customizable log output templates.

---

## 🚀 Features

- Insert logs based on selected text (variable, expression, etc.)
- Automatic context detection: class and function where the cursor is located
- Insert log **after the closing brace of a code block** or **on the next line** — configurable
- Supports popular languages: JavaScript, TypeScript, JSX, TSX, Vue, Python, PHP, Java, C#, Ruby, Go, C, C++
- Flexible log template customization for any language via `settings.json`
- Keyboard shortcut for quick insertion: `Ctrl+Alt+L` (Windows/Linux), `Cmd+Alt+L` (macOS)

---

## ⚙️ Installation for developers

1. Clone the repository or download the source archive
2. In VS Code, press `F5` to run the extension in development mode
3. To create a final package, build the extension using `vsce` or install it from the Marketplace (if published)

---

## 🔧 Settings

The following options are available in `settings.json`:

```json
{
	"smartConsoleLog.insertAfterBlock": true,

	"smartConsoleLog.templates": {
		"typescript": "console.log(\"🚀 ~ ${className} ~ ${functionName} ~ ${lineNumber} ~ ${variable}:\", ${variable});",
		"javascript": "console.log(\"🚀 ~ ${className} ~ ${functionName} ~ ${lineNumber} ~ ${variable}:\", ${variable});",
		"typescriptreact": "console.log(\"🚀 ~ ${className} ~ ${functionName} ~ ${lineNumber} ~ ${variable}:\", ${variable});",
		"javascriptreact": "console.log(\"🚀 ~ ${className} ~ ${functionName} ~ ${lineNumber} ~ ${variable}:\", ${variable});",
		"vue": "console.log(\"🚀 ~ ${className} ~ ${functionName} ~ ${lineNumber} ~ ${variable}:\", ${variable});",
		"python": "print(\"🚀 ~ ${className} ~ ${functionName} ~ ${lineNumber} ~ ${variable}:\", ${variable})",
		"php": "echo \"🚀 ~ ${className} ~ ${functionName} ~ ${lineNumber} ~ ${variable}: \" . ${variable} . \"\\n\";",
		"java": "System.out.println(\"🚀 ~ ${className} ~ ${functionName} ~ ${lineNumber} ~ ${variable}: \" + ${variable});",
		"csharp": "Console.WriteLine($\"🚀 ~ ${className} ~ ${functionName} ~ ${lineNumber} ~ ${variable}: {${variable}} \");",
		"ruby": "puts \"🚀 ~ ${className} ~ ${functionName} ~ ${lineNumber} ~ ${variable}: #{${variable}}\"",
		"go": "fmt.Printf(\"🚀 ~ %s ~ %s ~ %s: %v\\n\", \"${className}\", \"${functionName}\", \"${lineNumber}\" , \"${variable}\", ${variable})",
		"c": "printf(\"🚀 ~ %s ~ %s ~ %s: %d\\n\", \"${className}\", \"${functionName}\", \"${lineNumber}\", \"${variable}\", ${variable});",
		"cpp": "std::cout << \"🚀 ~ \" << \"${className}\" << \" ~ \" << \"${functionName}\" << \" ~ \" << \"${variable}\" << \": \" << ${variable} << std::endl;"
	}
}
```

- `insertAfterBlock`:
  `true` — insert the log **after** the current block (after the closing brace or after a block with a smaller indentation level in Python)  
  `false` — insert the log **on the next line** after the current line

- `templates`: an object containing log templates per language. Use placeholders `${className}`, `${functionName}`, and `${variable}` for dynamic substitution.

---

## 💡 Examples

### JavaScript/TypeScript

```ts
function greet(name: string) {
	const greeting = `Hello, ${name}!`;
	// Select "greeting" and press Ctrl+Alt+L
}
```

Result:

```ts
console.log("🚀 ~  ~ greet ~ greeting:", greeting);
```

### Python

```py
class Person:
    def say_hello(self, name):
        message = f"Hi, {name}!"
        # Select "message" and press Ctrl+Alt+L
```

Result:

```py
print("🚀 ~ Person ~ say_hello ~ message:", message)
```

---

## 🛠 Development and Contributions

Pull requests, feature suggestions, and bug reports are welcome!

## 📄 License

MIT License

---

## Thank you for using Smart Console Log!

If you'd like support for additional languages or new features — feel free to open an issue or contribute directly!
