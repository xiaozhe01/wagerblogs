"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  getSelfAssessmentResult,
  selfAssessmentQuestions,
  selfAssessmentSource,
} from "@/lib/self-assessment";

const OPTIONS = [
  { label: "Yes", value: true, hint: "Y" },
  { label: "No", value: false, hint: "N" },
];

const TOTAL = selfAssessmentQuestions.length;

export default function SelfAssessment() {
  const [answers, setAnswers] = useState<(boolean | null)[]>(() =>
    selfAssessmentQuestions.map(() => null),
  );
  const [index, setIndex] = useState(0);
  const [finished, setFinished] = useState(false);

  const current = answers[index];
  const isLast = index === TOTAL - 1;
  const score = answers.filter((a) => a === true).length;
  const result = finished ? getSelfAssessmentResult(score) : null;

  const answer = useCallback(
    (value: boolean) => setAnswers((prev) => prev.map((a, i) => (i === index ? value : a))),
    [index],
  );

  const next = useCallback(() => {
    if (answers[index] === null) return;
    if (isLast) setFinished(true);
    else setIndex((i) => i + 1);
  }, [answers, index, isLast]);

  useEffect(() => {
    if (finished) return;
    const onKeyDown = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && (/^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName) || el.isContentEditable)) return;
      const key = e.key.toLowerCase();
      const match = OPTIONS.find((o) => o.hint.toLowerCase() === key);
      if (match) {
        e.preventDefault();
        answer(match.value);
      } else if (e.key === "Enter") {
        e.preventDefault();
        next();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [answer, next, finished]);

  const restart = () => {
    setAnswers(selfAssessmentQuestions.map(() => null));
    setIndex(0);
    setFinished(false);
  };

  if (result) {
    return (
      <div className="border border-border-divider rounded-md p-4 md:p-5 flex flex-col gap-2 animate-in fade-in duration-300 motion-reduce:animate-none">
        <p className="meta-label-caps">
          Score {score} of {TOTAL}
        </p>
        <h3 className="heading text-3xl leading-snug">{result.label}</h3>
        <p className="text-md text-text-body leading-relaxed text-pretty">{result.description}</p>
        <p className="text-xs text-text-meta leading-lead text-pretty">
          This is a self-assessment, not a diagnosis. Only a qualified professional can diagnose a
          gambling disorder. If anything here worries you, talk to someone — see our{" "}
          <Link href="/responsible-gambling/help-directory" className="underline">
            help directory
          </Link>{" "}
          or contact{" "}
          <a href={selfAssessmentSource.url} rel="noopener" target="_blank" className="underline">
            {selfAssessmentSource.organisation}
          </a>
          .
        </p>
        <div className="flex gap-3 mt-2">
          <button type="button" onClick={restart} className="btn-secondary">
            Start over
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-border-divider rounded-md p-4 md:p-5">
      <div
        key={index}
        aria-live="polite"
        className="animate-in fade-in slide-in-from-right-4 duration-300 motion-reduce:animate-none"
      >
        <p className="text-lg font-semibold text-text-meta mb-1.5">
          Question {index + 1} of {TOTAL}
        </p>
        <fieldset>
          <legend className="heading text-xl leading-heading mb-4 text-pretty">
            {selfAssessmentQuestions[index]}
          </legend>
          <div className="flex flex-col gap-2.5">
            {OPTIONS.map((option) => (
              <label
                key={option.label}
                className="flex items-center gap-3 min-h-11 px-3.5 py-2.5 rounded-md border border-border-input cursor-pointer transition-colors hover:bg-bg-subtle has-checked:border-text-primary has-checked:bg-bg-subtle has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-text-primary"
              >
                <input
                  type="radio"
                  name={`self-check-${index}`}
                  checked={current === option.value}
                  onChange={() => answer(option.value)}
                  className="sr-only peer"
                />
                <span className="size-5 shrink-0 rounded-full border-2 border-border-input peer-checked:border-6 peer-checked:border-text-primary transition-all" />
                <span className="flex-1 text-md font-medium text-text-strong-secondary peer-checked:font-semibold peer-checked:text-text-primary">
                  {option.label}
                </span>
                <span
                  aria-hidden="true"
                  className="size-5 shrink-0 grid place-items-center rounded-sm border border-border-hairline-alt text-2xs font-mono text-text-meta"
                >
                  {option.hint}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="flex items-center justify-between gap-3 mt-4">
        <button
          type="button"
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
          className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={next}
          disabled={current === null}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLast ? "See result" : "Next"}
        </button>
      </div>
    </div>
  );
}
