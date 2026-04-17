import { 
  Code, Heart, TrendingUp, Palette, Microscope, GraduationCap, 
  Dumbbell, Music, Users, Cog, Scale, Leaf, Plane, Megaphone, Brain,
  Check
} from "lucide-react";

const iconMap = {
  Code,
  Heart,
  TrendingUp,
  Palette,
  Microscope,
  GraduationCap,
  Dumbbell,
  Music,
  Users,
  Cog,
  Scale,
  Leaf,
  Plane,
  Megaphone,
  Brain,
};

export default function DomainCard({ 
  domain, 
  isSelected, 
  onClick, 
  index 
}) {
  const Icon = iconMap[domain.icon] || Code;
  
  return (
    <button
      type="button"
      onClick={onClick}
      data-magnetic
      className={`
        motion-panel group relative overflow-hidden rounded-2xl border transition-all duration-300
        ${isSelected 
          ? "border-cyan/50 bg-cyan/10 shadow-[0_0_30px_rgba(69,208,255,0.2)]" 
          : "border-white/10 bg-white/[0.03] hover:border-white/30 hover:bg-white/[0.06]"
        }
      `}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Gradient background on selection */}
      <div 
        className={`
          absolute inset-0 bg-gradient-to-br ${domain.color} opacity-0 transition-opacity duration-300
          ${isSelected ? "opacity-10" : "group-hover:opacity-5"}
        `}
      />
      
      {/* Glow effect for selected */}
      {isSelected && (
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan/20 to-aurora/20 blur-xl opacity-50" />
      )}
      
      <div className="relative p-5">
        {/* Header with icon and check */}
        <div className="flex items-start justify-between">
          <div 
            className={`
              flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300
              bg-gradient-to-br ${domain.color} 
              ${isSelected ? "scale-110 shadow-lg" : "opacity-80 group-hover:opacity-100"}
            `}
          >
            <Icon className="h-6 w-6 text-white" />
          </div>
          
          {isSelected && (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan text-slate-950 animate-in fade-in zoom-in duration-200">
              <Check className="h-4 w-4" />
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="mt-4">
          <h3 className={`
            font-semibold transition-colors duration-200
            ${isSelected ? "text-white" : "text-white/90 group-hover:text-white"}
          `}>
            {domain.name}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-mist">
            {domain.description}
          </p>
        </div>
        
        {/* Career count */}
        <div className="mt-4 flex items-center gap-2">
          <span className={`
            rounded-full px-2.5 py-1 text-xs font-medium transition-colors
            ${isSelected 
              ? "bg-cyan/20 text-cyan" 
              : "bg-white/10 text-white/60 group-hover:bg-white/15"
            }
          `}>
            {domain.careers.length} careers
          </span>
        </div>
      </div>
      
      {/* Bottom border glow for selected */}
      {isSelected && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan via-aurora to-cyan" />
      )}
    </button>
  );
}
