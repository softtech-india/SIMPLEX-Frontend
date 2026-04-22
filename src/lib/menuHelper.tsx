export interface MenuItem {
  menuid: number
  parentmenuid: number
  menuname: string
  text?: string
  icon?: string
  path?: string
  displayorder?: string
  isactive: boolean

  isviewed?: boolean
  isadded?: boolean
  isupdated?: boolean
  isdeleted?: boolean
  isexported?: boolean
  isprinted?: boolean
  isemailed?: boolean
  isapproved?: boolean

  items?: MenuItem[]
}

// Filter only active menus
export const filterActiveMenus = (menus: MenuItem[] = []) =>
  menus.filter(menu => menu.isactive)