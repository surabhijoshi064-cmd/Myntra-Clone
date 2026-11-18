// ---------- 1. Get the elements from the page ----------
var header = document.querySelector(".site-header");
var searchForm = document.querySelector(".search-form");
var searchInput = document.querySelector(".search-input");
var productCards = document.querySelectorAll(".product-card");
var productGrid = document.querySelector(".trending-grid");
var mobileMenuCheckbox = document.getElementById("mobile-nav-toggle");

// the small number badges in the header
var wishlistBadge = document.querySelector('a[href="#wishlist"] .action-badge');
var bagBadge = document.querySelector('a[href="#bag"] .action-badge');

// read the starting numbers written in the HTML
var wishlistCount = Number(wishlistBadge.textContent);
var bagCount = Number(bagBadge.textContent);


// ---------- 2. Toast message (small popup at the bottom) ----------
var toast = document.createElement("div");
toast.style.position = "fixed";
toast.style.bottom = "24px";
toast.style.left = "50%";
toast.style.transform = "translateX(-50%)";
toast.style.background = "#282c3f";
toast.style.color = "#ffffff";
toast.style.padding = "12px 22px";
toast.style.borderRadius = "6px";
toast.style.fontSize = "0.9rem";
toast.style.fontWeight = "600";
toast.style.zIndex = "2000";
toast.style.display = "none";
document.body.appendChild(toast);

var toastTimer; // used to hide the toast after some time

function showToast(message) {
  toast.textContent = message;
  toast.style.display = "block";

  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () {
    toast.style.display = "none";
  }, 2500);
}


// ---------- 3. Header shadow when we scroll ----------
window.addEventListener("scroll", function () {
  if (window.scrollY > 10) {
    header.style.boxShadow = "0 6px 18px rgba(0, 0, 0, 0.12)";
  } else {
    header.style.boxShadow = "";
  }
});


// ---------- 4. Wishlist (heart) buttons ----------
var wishlistButtons = document.querySelectorAll(".wishlist-btn");

wishlistButtons.forEach(function (button) {
  var liked = false; // every product starts as "not liked"

  button.addEventListener("click", function () {
    var heart = button.querySelector("svg");
    var productName = button.closest(".product-card").querySelector(".product-brand").textContent;

    if (liked === false) {
      // add to wishlist
      liked = true;
      heart.style.fill = "#ff3f6c";
      heart.style.stroke = "#ff3f6c";
      wishlistCount = wishlistCount + 1;
      showToast(productName + " added to wishlist");
    } else {
      // remove from wishlist
      liked = false;
      heart.style.fill = "";
      heart.style.stroke = "";
      wishlistCount = wishlistCount - 1;
      showToast(productName + " removed from wishlist");
    }

    wishlistBadge.textContent = wishlistCount;
  });
});


// ---------- 5. "ADD TO BAG" buttons ----------
// The HTML has "VIEW PRODUCT" links. We turn them into "ADD TO BAG" buttons.
var productButtons = document.querySelectorAll(".view-product-btn");

productButtons.forEach(function (button) {
  button.textContent = "ADD TO BAG";

  button.addEventListener("click", function (event) {
    event.preventDefault(); // stop the link from jumping to #product-view

    var card = button.closest(".product-card");
    var brand = card.querySelector(".product-brand").textContent;
    var price = card.querySelector(".current-price").textContent;

    bagCount = bagCount + 1;
    bagBadge.textContent = bagCount;

    showToast(brand + " (" + price + ") added to bag");
  });
});


// ---------- 6. Search products ----------
// message shown when nothing matches
var noResultMessage = document.createElement("p");
noResultMessage.textContent = "No products found. Try 'shirt', 'jeans', 'watch' or a brand name.";
noResultMessage.style.gridColumn = "1 / -1";
noResultMessage.style.textAlign = "center";
noResultMessage.style.padding = "30px 0";
noResultMessage.style.color = "#535766";
noResultMessage.style.display = "none";
productGrid.appendChild(noResultMessage);

function filterProducts() {
  var text = searchInput.value.trim().toLowerCase();
  var found = 0;

  for (var i = 0; i < productCards.length; i++) {
    var card = productCards[i];
    var brand = card.querySelector(".product-brand").textContent.toLowerCase();
    var title = card.querySelector(".product-title").textContent.toLowerCase();

    // show the card if the brand or the title contains the text
    if (brand.includes(text) || title.includes(text)) {
      card.style.display = "flex";
      found = found + 1;
    } else {
      card.style.display = "none";
    }
  }

  if (found === 0) {
    noResultMessage.style.display = "block";
  } else {
    noResultMessage.style.display = "none";
  }
}

// filter while the user is typing
searchInput.addEventListener("input", filterProducts);

// when the user presses Enter
searchForm.addEventListener("submit", function (event) {
  event.preventDefault(); // stop the page from reloading
  filterProducts();
  document.getElementById("trending").scrollIntoView({ behavior: "smooth" });
});


// ---------- 7. Copy coupon code ----------
// clicking the coupon text in the top bar or in the offer card copies it
var couponLinks = document.querySelectorAll(".top-announcement a, .offer-card strong");

couponLinks.forEach(function (item) {
  item.style.cursor = "pointer";

  item.addEventListener("click", function (event) {
    event.preventDefault();
    navigator.clipboard.writeText("MYNTRA400");
    showToast("Coupon code MYNTRA400 copied!");
  });
});


// ---------- 8. Header icons (Profile, Wishlist, Bag) ----------
document.querySelector('a[href="#profile"]').addEventListener("click", function (event) {
  event.preventDefault();
  var name = prompt("Enter your name to log in:");
  if (name && name.trim() !== "") {
    this.querySelector(".action-label").textContent = name.trim().split(" ")[0];
    showToast("Welcome, " + name.trim() + "!");
  }
});

document.querySelector('a[href="#wishlist"]').addEventListener("click", function (event) {
  event.preventDefault();
  showToast("You have " + wishlistCount + " item(s) in your wishlist");
});

document.querySelector('a[href="#bag"]').addEventListener("click", function (event) {
  event.preventDefault();
  showToast("You have " + bagCount + " item(s) in your bag");
});


// ---------- 9. Close the mobile menu after clicking a link ----------
var menuLinks = document.querySelectorAll(".nav-link");

menuLinks.forEach(function (link) {
  link.addEventListener("click", function () {
    mobileMenuCheckbox.checked = false;
  });
});


// ---------- 10. Footer links that have no page ----------
// Links like #footer-policies and #footer-links do not exist in the page,
// so we show a message instead of doing nothing.
var footerLinks = document.querySelectorAll(".footer-links a");

footerLinks.forEach(function (link) {
  var target = link.getAttribute("href").substring(1); // remove the "#"

  if (document.getElementById(target) === null) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      showToast("This page is not available in the demo");
    });
  }
});