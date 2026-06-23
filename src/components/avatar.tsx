import { Avatar as AvatarComponent, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type AvatarProps = {
  src: string;
  alt: string;
  fallback: string;
};

const Avatar: React.FC<AvatarProps> = ({ src, alt, fallback }) => {
  return (
    <AvatarComponent size="lg" className="after:hidden">
      <AvatarImage src={src} alt={alt} />
      <AvatarFallback className="bg-accent text-primary font-semibold">{fallback}</AvatarFallback>
    </AvatarComponent>
  );
};

export default Avatar;
