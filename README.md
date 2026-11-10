# Power receiving plan viewer

A small static web page that shows a power receiving plan for a combined cycle power plant: a simplified plot plan and a simplified single-line diagram with five selectable supply options (the fifth is supply from the black start diesel generators, with a load against capacity check), an action plan timeline with what-if controls, a requirements matrix, risks, an option comparison and decision points.

## Use

Open `index.html` in a browser, or publish the folder with GitHub Pages (Settings, Pages, deploy from branch, folder root or `/docs`). There is no build step and no server code. All paths are relative, so the folder works from a repository root or from a subfolder.

## Contents

| Path | What |
|---|---|
| `index.html` | Page structure and static text |
| `css/style.css` | Layout, light and dark theme |
| `js/data.js` | Plan tasks, requirements, risks, comparison, decisions |
| `js/plotplan.js` | Plot plan geometry and the route options |
| `js/sld.js` | Single-line diagram geometry |
| `js/app.js` | Rendering and interaction |

## Notes

- No external resources are loaded: no CDN, no web fonts, no analytics. A content security policy in the page restricts loading to the same origin.
- The page carries `noindex, nofollow`. This asks search engines not to list it; it does not restrict access.
- The plot plan and the single-line diagram are simplified sketches for orientation. They are not design drawings and show no switching state.
- Load values in the capacity check are assumptions until a load list is supplied.
- All dates are provisional. Nothing on the page is a statement of readiness or an energisation approval.
- Light and dark theme follow the system setting; the button in the header switches by hand. Animation stops when the system asks for reduced motion.
