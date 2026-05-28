# Smoke Components Checklist

Rendered HTML, source-audited component presence, and browser spot-checks were used for this pass. HTTP route coverage was 67/67 on the clean post-build dev server at port 3002.

ROUTE | ELEMENT | STATUS
--- | --- | ---
/ | Storefront header nav links | OK
/ | Storefront footer links | OK
/admin | Admin sidebar links | OK
/admin/clinic | Clinic block links | OK
/admin/products | Sidebar hrefs resolve to real routes | OK
/admin/products | Ecommerce collapsible group | OK
/admin/clinic/team | Clinic / Medical collapsible group | OK
/admin/products | Collapsible click and Enter-key toggle | OK
/admin | Collapsible persistence implementation | OK
/admin/website-setup | Website Setup standalone sidebar link | OK
/admin/products/new | Tabs primitive | OK
/admin/marketing | Tabs primitive | OK
/admin/sellers | Tabs primitive | OK
/admin/delivery | Tabs primitive | OK
/admin/affiliate | Tabs primitive | OK
/admin/refunds | Tabs primitive | OK
/admin/club-points | Tabs primitive | OK
/admin/support | Tabs primitive | OK
/admin/reports | Tabs primitive | OK
/admin/clinic/holidays | Tabs primitive | OK
/admin/clinic/evaluations | Tabs primitive | OK
/admin/clinic/accounting | Tabs primitive | OK
/admin/clinic/mail | Tabs primitive | OK
/admin/website-setup | Page tabs | OK
/login | Login form | OK
/register | Register form | OK
/login-2 | Alternate login form | OK
/login-2/register | Alternate register form | OK
/checkout | Checkout form and submit handler | OK
/admin/products/new | New product form | OK
/admin/clinic/appointments/new | New appointment form | OK
/admin/clinic/team/new | New employee form | OK
/admin/clinic/patients | New patient entry surface | OK
/admin/purchase/new | New purchase order form | OK
/admin/marketing | New coupon form | OK
/admin/marketing | Newsletter compose form | OK
/contact | Storefront contact form | OK
/shop | Shop search input | OK
/admin | Admin top-bar search input | OK
/admin/products | Table search fields | OK
/admin/orders | Orders status filter | OK
/admin/sellers | Sellers approval tabs/filter | OK
/admin/refunds | Refunds tabs/filter | OK
/admin/categories | Table edit/delete icon buttons | OK
/admin/sellers | Approve/reject icon buttons | OK
/admin/clinic/blog | Approve/reject/edit icon buttons | OK
/admin/clinic/blog-categories | Add/delete buttons | OK
/admin/products/new | Product media upload mock zone | OK
/admin/clinic/blog | Blog approval actions | OK
/admin/clinic/team/new | Employee photo upload mock zone | OK
/admin/website-setup | Website setup upload mock zone | OK
/product/digital-thermometer | Add to cart button | OK
/cart | Quantity +/- buttons | OK
/cart | Remove and clear cart buttons | OK
/checkout | Mock 800 ms checkout submit to success | OK
/admin/pos | POS cart and Charge action | OK
/admin/reports | From/To/Status/Filter/Get report controls | OK
/admin/settings | Settings tabs | OK
/admin/clinic/appointments/new | Mock alert and route to appointments | OK
/admin/clinic/mail | Inbox / Sent / New tabs | OK
/admin/website-setup | Sections list, EN/AR toggle, Update button | OK
