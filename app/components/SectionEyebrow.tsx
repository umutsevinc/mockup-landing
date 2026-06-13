type Props = {
  num: string;
  label: string;
  className?: string;
};

/**
 * Marc Lou / Contralabs-style section eyebrow.
 * Orange "NN" + ink label, JetBrains Mono Medium, letter-spacing 2px.
 * Never use em-dashes or circled numbers around it.
 */
export function SectionEyebrow({ num, label, className = "" }: Props) {
  return (
    <p className={`eyebrow ${className}`}>
      <span className="num">{num}</span>
      <span>{label}</span>
    </p>
  );
}
