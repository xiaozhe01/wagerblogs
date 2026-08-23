type TeaserCardBodyProps = {
  title: string;
  desc: string;
};

export default function TeaserCardBody({ title, desc }: TeaserCardBodyProps) {
  return (
    <>
      <div className="font-semibold text-md text-text-primary mb-1">{title}</div>
      <div className="text-xs text-text-meta leading-relaxed">{desc}</div>
    </>
  );
}
