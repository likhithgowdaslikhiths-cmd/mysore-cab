# Mysore Cabs

Static landing page and legal pages for Mysore taxi fare enquiries. The build uses the existing Node.js and vanilla browser stack with no package dependencies.

## Local preview

Run `npm run preview` with Node.js 22 and open [the local preview](http://127.0.0.1:4173/). Set `MYSORE_PREVIEW_PORT` to choose a starting port; if it is occupied, the preview automatically tries the next available port. Run `npm run build` to build `dist/` or `npm test` to run the source checks. In the Windows sandbox, invoke Node with `--preserve-symlinks --preserve-symlinks-main` before the script or test flag.

The preview is noindex. Call and WhatsApp links use a local preview dialog for the placeholder number. The configured destinations are `tel:+911234567890` and `https://wa.me/911234567890`. A valid form produces a copyable WhatsApp message. An approved production configuration enables direct contact.

## Production build

1. In `config.mjs`, replace the placeholder with the active Indian business number, verify its call and WhatsApp destinations, and set the real HTTPS origin in `siteUrl`.
2. Confirm service coverage, vehicle and seating arrangements, fare inclusions, booking process and payment, change and cancellation terms. The landing page uses quote requests. Add prices, reviews, hours or address only once the business supplies and approves them.
3. Set `demoMode: false` and `allowIndexing: true`. Run `npm run build -- --production` and upload the contents of `dist/` to the root of ordinary static hosting. The build rejects the placeholder phone and requires an explicitly indexable configuration. Serve the supplied sitemap and robots file. Confirm the live canonical, HTTPS response, indexing headers, contact and route links before starting ads.
4. Verify the business phone and landing-page destination in Google Ads. Review the legal text against the actual hosting, booking and tracking arrangements. [Google Ads destination requirements](https://support.google.com/adspolicy/answer/6368661/destination-requirements) · [Call asset requirements](https://support.google.com/adspolicy/answer/1054212)

## Analytics setup

The only tag installation strategy is GTM. Analytics stays off until enabled in production with the business’s real container ID. Install GA4 and Google Ads tags only in that container, using genuine IDs and conversion labels configured in GTM. The optional consent interface loads the container after acceptance. Rejection leaves enquiries usable. Visitors can reopen their preference from the footer.

| Data layer event | GTM mapping |
| --- | --- |
| `call_click` | Custom Event trigger for phone intent, with CTA location |
| `whatsapp_click` | Custom Event trigger for general WhatsApp intent, with CTA location |
| `quote_form_start` | Custom Event trigger for first meaningful form interaction, with trip type |
| `quote_form_validation_error` | Custom Event trigger for validation diagnostics, with field identifiers |
| `route_select` | Custom Event trigger for route interest, with route ID and trip type |
| `quote_whatsapp_handoff` | Custom Event trigger for the form’s explicit WhatsApp handoff, with trip and vehicle categories |

Treat conversion actions as enquiry intent. Choose primary or secondary conversion status deliberately. Use either a Google Ads conversion tag or an imported GA4 conversion per action to avoid duplicate counting. A confirmed call, sent message or booked trip requires separate outcome measurement. [Google Ads click tracking](https://support.google.com/google-ads/answer/6331304) · [GA4 event reference](https://developers.google.com/analytics/devguides/collection/ga4/reference/events)

In GA4, turn off automatic outbound-click and form-interaction measurement before publishing. Avoid GTM generic click, form and link URL variables. Use only the mapped custom events and allowlisted parameters. Configure page location as origin and pathname only, omit URL queries, fragments and full referrers, and avoid user-provided or enhanced conversions for these events. This build adds no attribution storage. Validate production tags in Tag Assistant with consent rejected and accepted. Check the tag count and network payloads, particularly after a WhatsApp handoff. Tag Assistant needs the business’s actual GTM configuration.

## Assets and content

Inter (400–700), Poppins (400, 600, 700, 800 and 900), and the Font Awesome Free solid and brands webfonts are served locally. Their licenses are bundled in assets/fonts/.

`IMAGE_ASSET_DIR` in `config.mjs` records the supplied image directory on E:. Optimized copies are bundled with the project. See [the asset manifest](ASSET-MANIFEST.md) for the mapping. Enter genuine supplied reviews in `reviews` as records with `name` and `review`. The component renders only when populated. The quote-only pricing section uses copy in `pages.mjs`. Update it when the business approves fares. Business and tracking details are in `config.mjs`.

## Verification

Run `npm run build` and `npm test` for local checks. The browser preview is noindex and uses a local contact dialog for the configured placeholder number. No calls or messages are sent during verification.

The public reference is used only for layout comparison; its business details, claims, pricing and reviews are not used. Real business contact details, genuine reviews, approved service terms, the production HTTPS origin and any GTM container remain owner-supplied dependencies.


