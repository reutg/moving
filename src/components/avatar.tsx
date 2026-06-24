import { Avatar as AvatarComponent, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type AvatarProps = {
  src: string;
  alt: string;
  fallback: string;
  size?: "default" | "sm" | "lg" | "xl";
};

const Avatar: React.FC<AvatarProps> = ({ src, alt, fallback, size = "lg" }) => {
  return (
    <AvatarComponent size={size} className="after:hidden">
      <AvatarImage src={src} alt={alt} />
      <AvatarFallback className="bg-accent text-primary font-semibold">{fallback}</AvatarFallback>
    </AvatarComponent>
  );
};

export default Avatar;
