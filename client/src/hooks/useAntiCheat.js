import { useEffect, useRef } from 'react'

export function useAntiCheat({ enabled, examId, attemptId, onEvent, onFullscreenViolation, onTabSwitch }) {
  const channelRef = useRef(null)

  useEffect(() => {
    if (!enabled || !examId || !attemptId) return undefined

    const lockKey = `astraexam-tab-lock-${examId}`
    const tabId = `${Date.now()}-${Math.random()}`
    const announceMultiTab = (detail) => onEvent?.('multiple_tab', detail, 'high')

    if (window.localStorage.getItem(lockKey) && window.localStorage.getItem(lockKey) !== tabId) {
      announceMultiTab('Another active exam tab was detected.')
    }
    window.localStorage.setItem(lockKey, tabId)
    channelRef.current = new BroadcastChannel(`astraexam-${examId}`)
    channelRef.current.postMessage({ type: 'join', tabId })
    channelRef.current.onmessage = (message) => {
      if (message.data?.type === 'join' && message.data?.tabId !== tabId) {
        announceMultiTab('A second browser tab joined the same exam channel.')
      }
    }

    const onVisibility = () => {
      if (document.hidden) {
        onTabSwitch?.()
        onEvent?.('tab_switch', 'Candidate moved away from the exam tab.', 'medium')
      }
    }

    const onFullscreen = () => {
      if (!document.fullscreenElement) {
        onFullscreenViolation?.()
        onEvent?.('fullscreen_exit', 'Fullscreen mode was exited during the exam.', 'medium')
      }
    }

    const onContextMenu = (event) => {
      event.preventDefault()
      onEvent?.('context_menu', 'Right click attempt blocked.', 'low')
    }

    const onClipboard = (event) => {
      event.preventDefault()
      onEvent?.('clipboard_action', `${event.type} action blocked.`, 'low')
    }

    const onKeyDown = (event) => {
      if (event.key === 'F12' || (event.ctrlKey && event.shiftKey && ['I', 'J', 'C'].includes(event.key.toUpperCase()))) {
        event.preventDefault()
        onEvent?.('devtools_attempt', 'Developer tools shortcut intercepted.', 'high')
      }
    }

    const onBeforeUnload = (event) => {
      event.preventDefault()
      event.returnValue = ''
    }

    const devtoolInterval = window.setInterval(() => {
      const widthGap = window.outerWidth - window.innerWidth
      const heightGap = window.outerHeight - window.innerHeight
      if (widthGap > 220 || heightGap > 220) {
        onEvent?.('devtools_size', 'Browser size suggests developer tools are open.', 'high')
      }
    }, 4000)

    document.addEventListener('visibilitychange', onVisibility)
    document.addEventListener('fullscreenchange', onFullscreen)
    document.addEventListener('contextmenu', onContextMenu)
    document.addEventListener('copy', onClipboard)
    document.addEventListener('cut', onClipboard)
    document.addEventListener('paste', onClipboard)
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('beforeunload', onBeforeUnload)

    return () => {
      window.clearInterval(devtoolInterval)
      window.localStorage.removeItem(lockKey)
      document.removeEventListener('visibilitychange', onVisibility)
      document.removeEventListener('fullscreenchange', onFullscreen)
      document.removeEventListener('contextmenu', onContextMenu)
      document.removeEventListener('copy', onClipboard)
      document.removeEventListener('cut', onClipboard)
      document.removeEventListener('paste', onClipboard)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('beforeunload', onBeforeUnload)
      channelRef.current?.close()
    }
  }, [attemptId, enabled, examId, onEvent, onFullscreenViolation, onTabSwitch])
}
