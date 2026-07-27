import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Search,
  Heart,
  Layers,
  FileCheck,
  BookOpen,
  Users,
  DollarSign,
  TrendingUp,
  Megaphone,
  Map,
  CheckSquare,
  Shield,
  Menu,
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

const navGroups = [
  {
    label: 'Fundamentos',
    items: [
      { path: '/diagnostico', label: 'Diagnóstico', icon: Search },
      { path: '/identidade', label: 'Identidade', icon: Heart },
      { path: '/modelo', label: 'Modelo', icon: Layers },
    ],
  },
  {
    label: 'Implantação',
    items: [
      { path: '/regulamentacao', label: 'Regularização', icon: FileCheck },
      { path: '/pedagogico', label: 'Pedagógico', icon: BookOpen },
      { path: '/equipe', label: 'Equipe', icon: Users },
    ],
  },
  {
    label: 'Execução',
    items: [
      { path: '/capex', label: 'CAPEX', icon: DollarSign },
      { path: '/dre', label: 'DRE', icon: TrendingUp },
      { path: '/captacao', label: 'Captação', icon: Megaphone },
      { path: '/roadmap', label: 'Roadmap', icon: Map },
      { path: '/proximos', label: 'Próximos Passos', icon: CheckSquare },
    ],
  },
]

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { user, role } = useAuth()

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all border-l-2',
      isActive
        ? 'text-sidebar-primary bg-sidebar-primary/15 border-sidebar-primary'
        : 'text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent border-transparent',
    )

  return (
    <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border w-[272px]">
      <div className="p-4 border-b border-sidebar-border">
        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-black bg-sidebar-primary/20 text-sidebar-primary border border-sidebar-primary/30 font-display tracking-wide">
          ✦ IBMS × LEGACY
        </span>
        <p className="text-xs font-bold text-sidebar-foreground mt-2 font-display">
          Planejamento Estratégico
        </p>
        <p className="text-[10px] text-sidebar-foreground/50">
          Escola IBMS · Franquia Legacy School
        </p>
      </div>

      <div className="p-2 border-b border-sidebar-border">
        <p className="text-[10px] text-sidebar-foreground/50 px-2 mb-1">
          {user?.email || 'Visitante'}
        </p>
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sidebar-foreground/10 text-sidebar-foreground">
          {(role || 'leitura').toUpperCase()}
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto p-2 space-y-4">
        <NavLink to="/" end className={linkClass} onClick={onNavigate}>
          <LayoutDashboard className="w-4 h-4" />
          Dashboard
        </NavLink>

        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="px-3 py-1 text-[9px] font-black uppercase tracking-wider text-sidebar-foreground/40">
              {group.label}
            </p>
            {group.items.map((item) => (
              <NavLink key={item.path} to={item.path} className={linkClass} onClick={onNavigate}>
                <item.icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            ))}
          </div>
        ))}

        {role === 'admin' && (
          <div>
            <p className="px-3 py-1 text-[9px] font-black uppercase tracking-wider text-sidebar-foreground/40">
              Administração
            </p>
            <NavLink to="/admin" className={linkClass} onClick={onNavigate}>
              <Shield className="w-4 h-4" />
              Admin
            </NavLink>
          </div>
        )}
      </nav>
    </div>
  )
}

export function Sidebar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="hidden xl:block fixed left-0 top-0 bottom-0 z-30">
        <SidebarContent />
      </div>
      <div className="xl:hidden no-print">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button className="fixed top-3 left-3 z-50 p-2 bg-card border border-border rounded-lg shadow-subtle">
              <Menu className="w-5 h-5 text-foreground" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-[272px] bg-sidebar">
            <SidebarContent onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
