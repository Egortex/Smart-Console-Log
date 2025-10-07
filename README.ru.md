# Smart Console Log — VS Code Extension

Расширение для Visual Studio Code, которое помогает быстро вставлять отладочные логи в код.
Поддерживает несколько языков программирования с настраиваемыми шаблонами вывода.

---

## 🚀 Возможности

- Вставка логов по выделенному тексту (переменной, выражению и т.п.)
- Автоматическое определение контекста: класс и функция, в которой находится курсор
- Вставка лога **после закрывающей фигурной скобки блока** или **на следующей строке** — настраивается
- Поддержка популярных языков: JavaScript, TypeScript, JSX, TSX, Vue, Python, PHP, Java, C#, RUBY, GO, C, C++
- Гибкая настройка шаблонов логов для любого языка через `settings.json`
- Горячая клавиша для быстрого добавления: `Ctrl+Alt+L` (Windows/Linux), `Cmd+Alt+L` (macOS)

---

## ⚙️ Установка для разработчиков

1. Склонируйте репозиторий или скачайте архив с исходниками
2. В VS Code нажмите `F5` для запуска расширения в режиме разработки
3. Для финального пакета соберите расширение с помощью `vsce` или установите из Marketplace (если опубликовано)

---

## 🔧 Настройки

В `settings.json` доступны следующие опции:

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
  `true` — вставлять лог **после** блока (после закрывающей скобки или блока с меньшим отступом в Python)
  `false` — вставлять лог **на следующей строке** после текущей

- `templates`: объект с шаблонами логов по языкам. Используйте `${className}`, `${functionName}`, `${variable}` для подстановок

---

## 💡 Примеры

### JavaScript/TypeScript

```ts
function greet(name: string) {
	const greeting = `Hello, ${name}!`;
	// выделяем "greeting" и нажимаем Ctrl+Alt+L
}
```

Добавится:

```ts
console.log("🚀 ~  ~ greet ~ greeting:", greeting);
```

### Python

```py
class Person:
    def say_hello(self, name):
        message = f"Hi, {name}!"
        # выделяем "message" и нажимаем Ctrl+Alt+L
```

Добавится:

```py
print("🚀 ~ Person ~ say_hello ~ message:", message)
```

---

## 🛠 Разработка и вклад

Пулреквесты, идеи и багрепорты приветствуются!

## 📄 Лицензия

MIT license

---

## Спасибо за использование!

Если хочешь новых языков или функционала — пиши или добавляй сам!
