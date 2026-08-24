type TeaserCardBodyProps = {
  title: string;
  desc: string;
};

export default function TeaserCardBody({ title, desc }: TeaserCardBodyProps) {
  return (
    <>
      <h3 className="font-semibold text-md text-text-primary mb-1">{title}</h3>
      <p className="text-xs text-text-meta leading-relaxed">{desc}</p>
    </>
  );
}
