import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'
import { useRouter } from 'next/router'
import { MenuItem } from '../lib/menuHelper'

interface MenuContextType {
  menuList: MenuItem[]
  activeMain?: MenuItem
  activeSub?: MenuItem
}

const MenuContext = createContext<MenuContextType | undefined>(undefined)

export const MenuProvider = ({ children }: { children: ReactNode }) => {
  const [menuList, setMenuList] = useState<MenuItem[]>([])
  const [activeMain, setActiveMain] = useState<MenuItem>()
  const [activeSub, setActiveSub] = useState<MenuItem>()
  const router = useRouter()

  useEffect(() => {
    const raw = localStorage.getItem('userPriviledge')
    if (!raw) return

    const parsed = JSON.parse(raw)
    const menus: MenuItem[] = parsed.priviledges || []

    menus.sort((a, b) => Number(a.displayorder) - Number(b.displayorder))

    menus.forEach(m =>
      m.items?.sort(
        (a, b) => Number(a.displayorder) - Number(b.displayorder)
      )
    )

    setMenuList(menus)

    menus.forEach(main => {
      main.items?.forEach(sub => {
        if (sub.path === router.pathname) {
          setActiveMain(main)
          setActiveSub(sub)
        }
      })
    })
  }, [router.pathname])

  return (
    <MenuContext.Provider value={{ menuList, activeMain, activeSub }}>
      {children}
    </MenuContext.Provider>
  )
}

export const useMenu = () => {
  const ctx = useContext(MenuContext)
  if (!ctx) throw new Error('useMenu must be inside MenuProvider')
  return ctx
}
