import type { Faq as FaqItem } from "@/data/types";

/**
 * Accordion on native <details>: works without JavaScript, is keyboard and screen-reader
 * friendly by default, and every answer is in the HTML for search engines.
 * `name` makes the group exclusive (one open at a time) in browsers that support it.
 */
export function Faq({ items, name = "faq" }: { items: FaqItem[]; name?: string }) {
  return (
    <div className="faq" data-stagger>
      {items.map((f, i) => (
        <details key={f.q} name={name} open={i === 0}>
          <summary>
            <h3>{f.q}</h3>
            <i aria-hidden="true" />
          </summary>
          <div className="faq__a">
            <p>{f.a}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
