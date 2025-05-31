"use client"

import { useState, useEffect, useCallback, useRef } from "react"

type WebSocketHookOptions = {
  url?: string
  onOpen?: (event: WebSocketEventMap["open"]) => void
  onClose?: (event: WebSocketEventMap["close"]) => void
  onMessage?: (event: WebSocketEventMap["message"]) => void
  onError?: (event: WebSocketEventMap["error"]) => void
  reconnectInterval?: number
  reconnectAttempts?: number
  autoConnect?: boolean
}

export function useWebSocket(options: WebSocketHookOptions = {}) {
  const {
    url,
    onOpen,
    onClose,
    onMessage,
    onError,
    reconnectInterval = 5000,
    reconnectAttempts = 10,
    autoConnect = true,
  } = options

  const [isConnected, setIsConnected] = useState(false)
  const [lastMessage, setLastMessage] = useState<MessageEvent | null>(null)
  const webSocketRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectCountRef = useRef(0)

  const connect = useCallback(
    (wsUrl?: string) => {
      if (!wsUrl && !url) return

      // Close existing connection
      if (webSocketRef.current) {
        webSocketRef.current.close()
      }

      try {
        const ws = new WebSocket(wsUrl || url || "")
        webSocketRef.current = ws

        ws.onopen = (event) => {
          setIsConnected(true)
          reconnectCountRef.current = 0
          if (onOpen) onOpen(event)
        }

        ws.onclose = (event) => {
          setIsConnected(false)
          if (onClose) onClose(event)

          // Attempt to reconnect
          if (reconnectCountRef.current < reconnectAttempts) {
            reconnectTimeoutRef.current = setTimeout(() => {
              reconnectCountRef.current += 1
              connect(wsUrl || url)
            }, reconnectInterval)
          }
        }

        ws.onmessage = (event) => {
          setLastMessage(event)
          if (onMessage) onMessage(event)
        }

        ws.onerror = (event) => {
          if (onError) onError(event)
        }
      } catch (error) {
        console.error("WebSocket connection error:", error)
      }
    },
    [url, onOpen, onClose, onMessage, onError, reconnectAttempts, reconnectInterval],
  )

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }

    if (webSocketRef.current) {
      webSocketRef.current.close()
      webSocketRef.current = null
    }
  }, [])

  const sendMessage = useCallback(
    (data: string | ArrayBufferLike | Blob | ArrayBufferView) => {
      if (webSocketRef.current && isConnected) {
        webSocketRef.current.send(data)
        return true
      }
      return false
    },
    [isConnected],
  )

  useEffect(() => {
    if (autoConnect && url) {
      connect()
    }

    return () => {
      disconnect()
    }
  }, [autoConnect, url, connect, disconnect])

  return {
    isConnected,
    lastMessage,
    sendMessage,
    connect,
    disconnect,
  }
}
