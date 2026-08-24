import { Button } from "../ui/button";

export default function TopicsCard() {
  return (
    <section className="card pb-0" aria-labelledby="rail-help-me-choose">
      <h2 id="rail-help-me-choose" className="font-bold text-sm text-text-primary mb-2.5">
        Help Me Choose
      </h2>
      <p className="text-xs text-text-body leading-loose mb-2.5">What do you want to bet on?</p>
      <div className="flex flex-col gap-2 mb-3">
        {["Sports", "Casino games", "Esports"].map((o) => (
          <Button key={o} variant="outline" size="xs" className="justify-start">
            {o}
          </Button>
        ))}
      </div>
    </section>
  );
}
