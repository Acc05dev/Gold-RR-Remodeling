import { getTranslations } from "next-intl/server";
import { business } from "@/data/business";
import type { Review } from "@/data/reviews";
import type { Locale } from "@/data/types";
import { StarIcon } from "./Icons";

/**
 * Google reviews, attributed and linked to the profile. A review is only shown in quotation
 * marks when its exact text has been copied from Google into data/reviews.ts. Until then the
 * card says what the review is about and sends the reader to the source.
 * No AggregateRating / Review structured data is emitted for the business's own reviews.
 */
export async function Reviews({ locale, reviews }: { locale: Locale; reviews: Review[] }) {
  const t = await getTranslations({ locale });
  const rating = business.google.rating;
  return (
    <div className="reviews">
      <div className="reviews__head">
        <h2 className="display h2" data-split>
          {t("reviews.title")}
        </h2>
        <span className="bar" />
        <p className="reviews__score" role="img" aria-label={t("reviews.ratingLabel", { rating })}>
          <span className="tall" aria-hidden="true">
            {rating.toFixed(1)}
          </span>
          <span className="reviews__stars" aria-hidden="true" style={{ "--fill": `${(rating / 5) * 100}%` } as React.CSSProperties}>
            {Array.from({ length: 5 }, (_, i) => (
              <StarIcon key={i} />
            ))}
          </span>
          <span aria-hidden="true">Google</span>
        </p>
        <div className="reviews__cta">
          <a className="btn btn--ink" href={business.google.review} target="_blank" rel="noopener" data-track="click_review" data-track-at="reviews">
            {t("reviews.leave")}
          </a>
          <a className="link" href={business.google.profile} target="_blank" rel="noopener" data-track="click_review" data-track-at="reviews-read">
            {t("reviews.read")}
          </a>
        </div>
      </div>
      <ul className="reviews__list" data-stagger>
        {reviews.map((r) => (
          <li key={r.author} className="rcard chamfer">
            {r.text ? (
              <blockquote>
                <p>{r.text}</p>
              </blockquote>
            ) : (
              <p className="rcard__topic">{r.topic[locale]}</p>
            )}
            <footer>
              <strong>{r.author}</strong>
              <span>{r.project[locale]}</span>
              <a href={business.google.profile} target="_blank" rel="noopener" data-track="click_review" data-track-at="review-card">
                {t("common.readOnGoogle")}
                <span className="sr"> ({r.author})</span>
              </a>
            </footer>
          </li>
        ))}
      </ul>
    </div>
  );
}
