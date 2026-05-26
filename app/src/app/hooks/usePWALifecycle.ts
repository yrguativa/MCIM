import { useState, useEffect, useCallback, useRef } from 'react'
import { registerSW } from 'virtual:pwa-register'

export type PWAStatus = 'checking' | 'installed' | 'updating' | 'ready' | 'offline-ready'

interface PWALifecycleState {
  status: PWAStatus
  needRefresh: boolean
  offlineReady: boolean
}

export function usePWALifecycle() {
  const [state, setState] = useState<PWALifecycleState>({
    status: 'checking',
    needRefresh: false,
    offlineReady: false,
  })
  const updateSWRef = useRef<((reloadPage?: boolean) => Promise<void>) | null>(null)

  useEffect(() => {
    const updateSW = registerSW({
      onNeedRefresh() {
        setState({ status: 'updating', needRefresh: true, offlineReady: false })
      },
      onOfflineReady() {
        setState({ status: 'offline-ready', needRefresh: false, offlineReady: true })
      },
      onRegistered(registration) {
        if (registration) {
          setState({ status: 'installed', needRefresh: false, offlineReady: false })
        }
      },
      onRegisterError() {
        setState({ status: 'ready', needRefresh: false, offlineReady: false })
      },
    })
    updateSWRef.current = updateSW
  }, [])

  const update = useCallback(async () => {
    if (updateSWRef.current) {
      await updateSWRef.current(true)
    }
  }, [])

  return {
    ...state,
    update,
  }
}
