// "use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"

interface TerminalProps {
  isDarkMode?: boolean
}

export default function Terminal({ isDarkMode = true }: TerminalProps) {
  const [input, setInput] = useState("")
  const [history, setHistory] = useState<string[]>([])
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  // Terminal is always dark
  const bgColor = "bg-black"
  const textColor = "text-green-400"

  useEffect(() => {
    const handleClick = () => {
      inputRef.current?.focus()
    }

    const terminal = terminalRef.current
    if (terminal) {
      terminal.addEventListener("click", handleClick)

      setHistory([
        "Last login: " + new Date().toLocaleString(),
        "Welcome to macOS Terminal",
        "Type 'help' to see available commands",
        "",
      ])
    }

    return () => {
      terminal?.removeEventListener("click", handleClick)
    }
  }, [])

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [history])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input.trim()) {
      executeCommand(input)
      setCommandHistory((prev) => [...prev, input])
      setHistoryIndex(-1)
      setInput("")
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      navigateHistory(-1)
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      navigateHistory(1)
    }
  }

  const navigateHistory = (direction: number) => {
    if (commandHistory.length === 0) return

    const newIndex = historyIndex + direction

    if (newIndex >= commandHistory.length) {
      setHistoryIndex(-1)
      setInput("")
    } else if (newIndex >= 0) {
      setHistoryIndex(newIndex)
      setInput(commandHistory[commandHistory.length - 1 - newIndex])
    }
  }

  const executeCommand = (cmd: string) => {
    const command = cmd.trim().toLowerCase()
    const args = command.split(" ")
    const mainCommand = args[0]

    setHistory((prev) => [...prev, `agrim@macbook-pro ~ $ ${cmd}`, ""])

    switch (mainCommand) {
      case "help":
        setHistory((prev) => [
          ...prev,
          "Available commands:",
          "  help     - Show this help message",
          "  clear    - Clear the terminal",
          "  echo     - Print text",
          "  date     - Show current date and time",
          "  ls       - List files",
          "  whoami   - Show current user",
          "  about    - About me",
          "  skills   - Technical skills",
          "  contact  - Contact information",
          "",
        ])
        break

      case "clear":
        setHistory([""])
        break

      case "echo":
        setHistory((prev) => [...prev, args.slice(1).join(" "), ""])
        break

      case "date":
        setHistory((prev) => [...prev, new Date().toString(), ""])
        break

      case "ls":
        setHistory((prev) => [
          ...prev,
          "Documents",
          "Projects",
          "Downloads",
          "Desktop",
          "Music",
          "Pictures",
          "Videos",
          "",
        ])
        break

      case "whoami":
        setHistory((prev) => [...prev, "agrim", ""])
        break

      case "about":
        setHistory((prev) => [
          ...prev,
          "┌──────────────────────────────┐",
          "│ Agrim Gupta                  │",
          "│ Computer Science Graduate    │",
          "│ Backend & API Developer      │",
          "└──────────────────────────────┘",
          "",
          "2025 Computer Science graduate with strong",
          "foundations in backend development, APIs,",
          "and quality engineering.",
          "",
          "Focused on building scalable, reliable",
          "and data-driven applications using",
          "modern backend technologies.",
          "",
        ])
        break

      case "skills":
        setHistory((prev) => [
          ...prev,
          "┌──────────────┐",
          "│   Skills     │",
          "└──────────────┘",
          "",
          "Programming:",
          "• Python",
          "• Java",
          "• C++",
          "• JavaScript",
          "",
          "Backend & APIs:",
          "• FastAPI / Flask",
          "• RESTful APIs",
          "• Microservices",
          "",
          "Testing & QA:",
          "• PyTest",
          "• Selenium",
          "• Postman",
          "• JUnit",
          "• Jenkins",
          "",
          "Databases & Data:",
          "• PostgreSQL",
          "• MySQL",
          "• MongoDB",
          "• NumPy / Pandas",
          "",
          "Cloud & Tools:",
          "• Docker",
          "• Git / GitHub",
          "• AWS (Basics)",
          "",
        ])
        break

      case "contact":
        setHistory((prev) => [
          ...prev,
          "┌─────────┐",
          "│ Contact │",
          "└─────────┘",
          "",
          "Email: wa1agrim@gmail.com",
          "GitHub: github.com/Agrim007",
          "LinkedIn: linkedin.com/in/agrim-gupta/",
          "",
        ])
        break

      default:
        setHistory((prev) => [
          ...prev,
          `Command not found: ${mainCommand}`,
          'Type "help" to see available commands',
          "",
        ])
    }
  }

  return (
    <div
      ref={terminalRef}
      className={`h-full ${bgColor} ${textColor} p-4 font-mono text-sm overflow-auto`}
    >
      {history.map((line, index) => (
        <div key={index} className="whitespace-pre-wrap">
          {line}
        </div>
      ))}

      <div className="flex">
        <span className="mr-2">agrim@macbook-pro ~ $</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none caret-green-400 text-green-400"
          autoFocus
        />
      </div>
    </div>
  )
}
