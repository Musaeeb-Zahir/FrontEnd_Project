document.addEventListener("DOMContentLoaded", (event) => {
  if (document.querySelector(".hero-container")) {
    loadCategoryList();
    updateUIForDealElements();
    updateUIHomeElements();
    updateUIElectronicItems();
    loadUIforrecommandedItems();
  }

  if (document.querySelector(".product-detail-placeholder")) {
    loadProductDetailPage();
    window.openTab = function openTab(evt, tabName) {
      const allContents = document.querySelectorAll(".tab-content");
      allContents.forEach((content) => {
        content.classList.remove("active-content");
      });
      const allButtons = document.querySelectorAll(".tab-link");
      allButtons.forEach((btn) => {
        btn.classList.remove("active");
      });
      evt.currentTarget.classList.add("active");
      document.getElementById(tabName).classList.add("active-content");
    };
  }
  if (document.querySelector(".listing-page-container")) {
    loadCategoryListingItems();
    document
      .querySelector("#btn-icon-grid")
      .addEventListener("click", handleGridClick);
    document
      .querySelector("#btn-icon-list")
      .addEventListener("click", handleListClick);
  }

  if (document.querySelector(".cart-section")) {
    renderSavedForLater();
    renderCartUI();
  }
});
// Fetch products data
async function fetchProductsData() {
  try {
    const response = await fetch("/productData/products.json");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching deals:", error);
  }
}
// load category list navgation

async function loadCategoryList() {
  const categoryListContainer = document.querySelector(
    "#category-list-navigation"
  );
  const data = await fetchProductsData();
  const categories = [...new Set(data.map((item) => item.category))];
  categories.forEach((category) => {
    categoryListContainer.innerHTML += `
    <a href="/pages/productListing.html?category=${category}">
      <li onclick="handleActiveCategory()" class="availableCategory">${category}</li>
    </a>
    `;
    document.querySelectorAll(".availableCategory")[0].style.backgroundColor =
      "#E5F1FF";
  });
}
//handleActiveCategory
const dealItems = document.querySelector(".deal-items");
// Filter function for deal items
async function filterDealItems() {
  const data = await fetchProductsData();
  return data.filter((item) => item.price.discount_label !== null);
}

// UI update function
async function updateUIForDealElements() {
  const discountItems = await filterDealItems();
  dealItems.innerHTML = "";
  discountItems
    .filter((element) => {
      const discountValue = Math.abs(parseInt(element.price.discount_label));
      return discountValue > 10;
    })
    .slice(0, 5)
    .forEach((element) => {
      dealItems.innerHTML += `
       <a href="/pages/productDetail.html?id=${element.id}">
      <article class="deal-item">
        <img src="${element.images.main}" alt="">
        <p>${element.title}</p>
        <span>${element.price.discount_label}%</span>
      </article>
      </a>
    `;
    });
}

//Load home and interior items
const categoryGridContainer = document.querySelector(".category-grid");
const filterHomeAndOutdoorItems = async () => {
  const data = await fetchProductsData();
  return data
    .filter((element) => element.category == "home and interior")
    .slice(0, 8);
};
//update home and items category function
async function updateUIHomeElements() {
  const homeAndOutdooritems = await filterHomeAndOutdoorItems();
  categoryGridContainer.innerHTML = "";
  homeAndOutdooritems.forEach((element) => {
    categoryGridContainer.innerHTML += `
     <a href="/pages/productDetail.html?id=${element.id}">
  <article class="cat-item">
       <div><h3>${element.slug}</h3>
        <span>From</span>
        <span class="price"> ${element.price.currency} ${element.price.current}</span></div> 
        <img src="${element.images.main}" alt="Soft chairs">
      </article>
      </a>
  `;
  });
}

//Load electronics items
const electronicsGridContainer = document.querySelector("#electronics-grid");
const filterElectronicsItems = async () => {
  const data = await fetchProductsData();
  return data.filter((element) => element.category == "tech").slice(0, 8);
};
//update home and items category function
async function updateUIElectronicItems() {
  const electronicsItems = await filterElectronicsItems();
  electronicsGridContainer.innerHTML = "";
  electronicsItems.forEach((element) => {
    electronicsGridContainer.innerHTML += `
     <a href="/pages/productDetail.html?id=${element.id}">
  <article class="cat-item">
       <div><h3>${element.slug}</h3>s
        <span>From</span>
        <span class="price"> ${element.price.currency} ${element.price.current}</span></div> 
        <img src="${element.images.main}" alt="Soft chairs">
      </article>
      </a>
  `;
  });
}

//laod recommanded items
const recommandedItemsGrid = document.querySelector(".recommended-items-grid");
async function loadUIforrecommandedItems() {
  recommandedItemsGrid.innerHTML = "";
  const recommandedItems = await fetchProductsData();
  recommandedItems.slice(0, 10).map((element) => {
    recommandedItemsGrid.innerHTML += `
    <a href="/pages/productDetail.html?id=${element.id}">
    <article class="recommended-item">
        <img src="${element.images.main}" alt="" width="170px">
        <div>
        <p class="price">
          <strong>$${element.price.current}</strong>
        </p>
        <p>${element.title}</p></div>
      </article>
      </a>
    `;
  });
}

// Load product detail page
async function loadProductDetailPage() {
  if (document.querySelector(".product-detail-placeholder")) {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");
    const path1 = document.querySelector(".category-page");
    const path2 = document.querySelector(".detail-page");
    const products = await fetchProductsData();
    const product = products.find((item) => item.id == productId);
    if (product) {
      loadProductDetailUI(product);
      path1.textContent = product.category;
      path2.textContent = product.title;
    }
    path1.addEventListener("click", () => {
      path1.href = `/pages/productListing.html?category=${product.category}`;
    });
  }
}
async function loadProductDetailUI(product) {
  const productDetailPlaceholder = document.querySelector(
    ".product-detail-placeholder"
  );
  const el = {
    mainImage: document.getElementById("product-detail-image"),
    title: document.querySelector(".product-title"),
    stockText: document.querySelector(".stock-status"),
    thumbnails: document.querySelector(".thumbnail-list"),
    reviewsCount: document.querySelector("#reviews-count"),
    soldCount: document.querySelector("#sold-count"),
    featuresList: document.getElementById("features-list"),
    bulkPrice: document.querySelectorAll(".price-val"),
    attrValue: document.querySelectorAll(".attr-value"),
    saveForLater: document.querySelector(".btn-save-later"),
    btnInquiry: document.querySelector(".btn-inquiry"),
    ratingStars: document.querySelector(".rating-stars"),
    ratingNum: document.querySelector("#rating-num"),
    // minOrder: document.querySelector(".min-order"),
    // companyName: document.querySelector(".company-name"),
    // supplierFlag: document.querySelector(".supplier-flag"),
    // supplierLocation: document.querySelector(".supplier-location"),
    // supplierShipping: document.querySelector(".supplier-shipping"),
    // descriptionText: document.querySelector(".content-text p"),
    // modelId: document.querySelector(".model-id"),
  };
  el.ratingStars.innerHTML = getStarHTML(product.rating.stars);
  el.ratingNum.innerText = product.rating.stars;
  el.saveForLater.addEventListener("click", () => saveForLater(product.id));
  el.btnInquiry.addEventListener("click", () => moveToCart(product.id));
  el.mainImage.src = product.images.main;
  el.title.textContent = product.title;
  el.stockText.innerText = product.stock_status;
  el.reviewsCount.textContent = `${product.sales.reviews_count} Reviews`;
  el.soldCount.textContent = `${product.sales.sold_count} Sold`;
  console.log(el.bulkPrice[0]);
  el.bulkPrice[0].textContent = `$${
    product.bulk_price.first || "not available"
  }`;
  el.bulkPrice[1].textContent = `$${product.bulk_price.second}`;
  el.bulkPrice[2].textContent = `$${product.bulk_price.third}`;
  console.log(el.attrValue);

  el.attrValue[0].textContent = `$${product.price.current}`;
  el.attrValue[2].textContent = `${
    product.specifications.Material || "Not Provided"
  }`;

  el.attrValue[1].textContent = `${product.type || "Not Provided"}`;
  el.attrValue[3].textContent = `${product.design || "Not Provided"}`;
  el.attrValue[4].textContent = `${product.custamization || "Not Provided"}`;
  el.attrValue[5].textContent = `${product.protection || "Not Provided"}`;
  el.attrValue[6].textContent = `${product.warranty || "Not Provided"}`;

  //view all thumnail list
  el.thumbnails.innerHTML = "";
  if (product.images.gallery.length <= 0) {
    el.thumbnails.innerHTML = "";
  } else {
    product.images.gallery.forEach((img) => {
      el.thumbnails.innerHTML += `
     <button class="thumb-btn active">
                      <img src=${img} alt="Thumb">
                  </button>
    `;
    });
  }
  //load description tab
  const specTable = document.querySelector(".spec-table");
  for (const [key, value] of Object.entries(product.specifications)) {
    specTable.innerHTML = "";
    specTable.innerHTML += `
  <tr>
  <td class="spec-label">${key}</td>
  <td class="spec-value">${value}</td>
  </tr>
  `;
  }
  //load features list
  const featureCheckListContainer = document.querySelector(
    ".feature-check-list"
  );
  featureCheckListContainer.innerHTML = "";
  product.features.forEach((feature) => {
    featureCheckListContainer.innerHTML += `
    <li>
                       <i class="fa-solid fa-check opacity"></i>
                        <span>${feature}</span>
                    </li>
    `;
  });

  //load user reviews
  const reviewsContainer = document.querySelector(".review-list");
  reviewsContainer.innerHTML = "";
  product.reviews.forEach((review) => {
    reviewsContainer.innerHTML += `
<div class="review-item">
                <div class="review-head">
                    <span class="reviewer-name">${review.user}</span>
                    <div class="stars">
                        <i class="fa-solid fa-star text-warning"></i>
                        <i class="fa-solid fa-star text-warning"></i>
                        <i class="fa-solid fa-star text-warning"></i>
                        <i class="fa-solid fa-star text-warning"></i>
                        <i class="fa-solid fa-star text-gray"></i>
                        <span class="rating-num">${review.rating}</span>
                    </div>
                </div>
                <span class="review-date">${review.date}</span>
                <p class="review-text">${review.comment}</p>
            </div>

`;
  });
  //load shipping detail
  const shippingContainer = document.querySelector(".specs-table");
  for (const [key, value] of Object.entries(product.supplier)) {
    console.log(`${key}: ${value}`);
    shippingContainer.innerHTML += `
  <tr>
                <td class="label">${key}</td>
                <td>${value}</td>
            </tr>
  `;
  }

  //load seller detail
  const sellerContainer = document.querySelector("#seller");
  if (
    !product.sellerInfo ||
    product.sellerInfo.length === 0 ||
    product.sellerInfo === null
  ) {
    sellerContainer.innerHTML = "<p>No seller information available.</p>";
  } else {
    product.seller.forEach((sellerInfo) => {
      sellerContainer.innerHTML = "";
      sellerContainer.innerHTML += `
     <div class="seller-profile">
            <div class="seller-img">
                <span class="seller-initial">${sellerInfo.name[0].toUpperCase()}</span> </div>
            <div class="seller-info">
                <h4>${sellerInfo.name}</h4>
                <div class="seller-meta">
                    <span class="country">
                        <img src=${
                          sellerInfo.flag
                        } alt="flag" class="icon-xs"> Germany
                    </span>
                    <span class="verified">
                        <i class="fa-solid fa-shield-halved"></i> ${
                          sellerInfo.verified_status
                        }
                    </span>
                </div>
                <p class="seller-desc">${sellerInfo.description}</p>
                <button class="btn-msg">Contact Seller</button>
            </div>
        </div>
      `;
    });
  }

  //load related items
  const relatedItemsContainer = document.querySelector(".related-grid");
  const allItems = await fetchProductsData();
  const relatedItems = allItems.filter(
    (item) => item.category === product.category && item.id !== product.id
  );

  relatedItemsContainer.innerHTML = "";
  relatedItems.forEach((element) => {
    relatedItemsContainer.innerHTML += `
    <a href="/pages/productDetail.html?id=${element.id}">
  <div class="related-card">
            <div class="img-box">
                <img src=${element.images.main} alt="Wallet">
            </div>
            <div class="info-box">
                <a href="#" class="rp-title">${element.title}</a>
                <span class="rp-price">$40.00</span>
            </div>
        </div>
     </a>`;
  });

  //load may like items
  const mayLikeItemsContainer = document.querySelector(".related-list");
  const mayLikeItems = allItems.filter(
    (item) =>
      item.id !== product.id &&
      item.category !== product.category &&
      item.price.current < product.price.current
  );
  mayLikeItemsContainer.innerHTML = "";
  mayLikeItems.forEach((element) => {
    mayLikeItemsContainer.innerHTML += `
      <a href="/pages/productDetail.html?id=${element.id}" class="related-item">
                        <div class="related-img">
                            <img src=${element.images.main} alt="Coat">
                        </div>
                        <div class="related-info">
                            <h4>${element.title}</h4>
                            <span class="related-price">$${element.price.current}</span>
                        </div>
                    </a>
    `;
  });
}

// Load category listing items
async function loadCategoryListingItems() {
  const path = document.querySelector(".category-page");
  const urlParams = new URLSearchParams(window.location.search);
  const categoryName = urlParams.get("category");
  path.textContent = categoryName;
  const listingContainer = document.querySelector(".products-wrapper");
  const paginationWrapper = document.querySelector(".pagination-wrapper");
  const itemTotal = document.querySelector(".item-count");
  const allItems = await fetchProductsData();
  const categoryItems = allItems.filter(
    (item) => item.category === categoryName
  );
  itemTotal.textContent = `${categoryItems.length}${
    categoryItems.length <= 1 ? " item" : " items"
  } in ${categoryName}`;
  let savedIdsNumbers;
  const savedItemsForlater = JSON.parse(localStorage.getItem("wishlistIds"));
  console.log("savedddddddd", savedItemsForlater);
  if (savedItemsForlater !== null) {
    savedIdsNumbers = savedItemsForlater.map(Number);
  } else {
    savedIdsNumbers = [];
  }
  listingContainer.innerHTML = "";
  categoryItems.forEach((element) => {
    const starIcons = getStarHTML(element.rating.stars);
    listingContainer.innerHTML += `
     <article class="product-card">
                <div class="card-image">
                    <img src=${element.images.main} alt="iPhone" height="
187.6px">
                </div>
                <div class="card-details">
                    <div class="card-header">
                        <h4>${element.title}</h4>
                        <button class="btn-fav" onclick="saveForLater(${
                          element.id
                        })">
                            <img class="savedIcon" src=${
                              savedIdsNumbers.includes(element.id)
                                ? "/assets/icons/SVG/saved.svg"
                                : "/assets/icons/SVG/save.svg"
                            } alt="Fav">
                        </button>
                    </div>
                    
                    <div class="price-info">
                        <span class="price-current">$${
                          element.price.current
                        }</span>
                        <span class="price-old">$${element.price.old}</span>
                    </div>

                    <div class="rating-info">
                        <div class="stars">
                        ${starIcons}
                        </div>
                        <span class="rating-score">${
                          element.rating.stars
                        }</span>
                        <span class="dot"></span>
                        <span class="orders-count">${
                          element.sales.sold_count
                        } orders</span>
                        <span class="dot"></span>
                        <span class="shipping-status">${
                          element.supplier.shipping
                        }</span>
                    </div>

                    <p class="product-desc">
                        ${element.description}
                    </p>

                    <a href="/pages/productDetail.html?id=${
                      element.id
                    }" class="view-link">View details</a>
                </div>
            </article>
    `;
    if (categoryItems.length <= 6) {
      paginationWrapper.classList.add("hidden");
    }
  });
}

//switch list to gird
const gridBtn = document.querySelector("#btn-icon-grid");
const listBtn = document.querySelector("#btn-icon-list");
function handleGridClick() {
  const container = document.querySelector(".products-wrapper");
  // Sirf Parent par class toggle karein
  container.classList.add("grid-mode");
  container.classList.remove("list-mode");
  gridBtn.classList.add("active");
  listBtn.classList.remove("active");
}
function handleListClick() {
  const container = document.querySelector(".products-wrapper");
  container.classList.remove("grid-mode");
  container.classList.add("list-mode");
  gridBtn.classList.remove("active");
  listBtn.classList.add("active");
}

//load and add saved for later cart
const storedData = localStorage.getItem("wishlistIds");
let savedItems = storedData ? JSON.parse(storedData) : [];
async function saveForLater(elementid) {
  const index = savedItems.indexOf(elementid);
  if (index !== -1) {
    console.log(`already mojood ${elementid}`);
  } else {
    savedItems.unshift(elementid);
  }
  localStorage.setItem("wishlistIds", JSON.stringify(savedItems));
  console.log("Updated List:", savedItems);
}

//hide and show filter list in listing page
function toggleFilterList(id) {
  const filterList = document.querySelector(`#${id}`);
  filterList.classList.toggle("display-block");
  // filterList.classList.toggle("display-none-list");
  event.target.src = event.target.src.includes("Vector.png")
    ? "/assets/Layout/Form/input-group/Icon/control/Vector2.png"
    : "/assets/Layout/Form/input-group/Icon/control/Vector.png";
}

async function renderSavedForLater() {
  const savedGrid = document.querySelector(".saved-grid");
  const savedItemsForlater = JSON.parse(localStorage.getItem("wishlistIds"));
  const products = await fetchProductsData();
  const savedIdsNumbers = savedItemsForlater.map(Number) || [];
  console.log(savedIdsNumbers);

  const wishlistProducts = products.filter((product) => {
    return savedIdsNumbers.includes(product.id);
  });
  savedGrid.innerHTML = "";
  wishlistProducts.forEach((pro) => {
    savedGrid.innerHTML += `
  <article class="saved-card">
                    <div class="saved-img">
                        <img src=${pro.images.main} alt="Tablet">
                    </div>
                    <div class="saved-info">
                        <span class="saved-price">$${pro.price.current}</span>
                        <h4 class="saved-title">${pro.title}</h4>
                        <button class="btn-move-cart" onclick="moveToCart(${pro.id})">
                            <span class="material-symbols-outlined">
shopping_cart
</span>  Move to cart
                        </button>
                    </div>
                </article>
  `;
  });
}
//render cart UI
async function renderCartUI() {
  const cartContainer = document.querySelector(".cart-main");
  const cartItemsStored = sessionStorage.getItem("cartItems");
  const cartItems = cartItemsStored ? JSON.parse(cartItemsStored) : [];

  // check empty cart
  if (cartItems.length === 0) {
    cartContainer.innerHTML = "<p>Your cart is empty</p>";
    return;
  }

  // Products fetch
  const products = await fetchProductsData();

  const cartProducts = products.filter((product) => {
    return (
      cartItems.includes(product.id) || cartItems.includes(String(product.id))
    );
  });

  cartContainer.innerHTML = "";
  cartProducts.forEach((element) => {
    cartContainer.innerHTML += `
        <article class="cart-item">

                    <figure class="item-img">

                        <img src=${element.images.main} alt="T-shirt">

                    </figure>

                    <div class="item-info">

                        <div class="info-left">

                            <h4>${element.slug}</h4>

                            <p class="item-specs">Size: ${
                              element.specifications.size
                                ? element.specifications.size
                                : ""
                            }, Color: ${
      element.specifications.color ? element.specifications.color : ""
    }, Material: ${
      element.specifications.Material ? element.specifications.Material : ""
    }</p>

                            <p class="seller-name">Seller: ${
                              element.seller ? element.seller : ""
                            }</p>



                            <div class="action-btns">

                                <button class="btn-remove" onclick="removeFromCart(${
                                  element.id
                                })">Remove</button>

                                <button class="btn-save" onclick="saveForLater(${
                                  element.id
                                })">Save for later</button>

                            </div>

                        </div>



                        <div class="info-right">

                            <span class="item-price">$${
                              element.price.current
                            }</span>

                    <div class="qty-select">
 <input list="qty" id="qty-choice" name="qty" value="1" class="qty-feild"
        data-price="${element.price.current}" 
        data-discount="${element.price.discount_label || 0}" 
        data-tax="${element.price.tax_percent || 0}" 
        
        onchange="priceCalculation()"
        onkeyup="priceCalculation()">
<datalist id="qty" qty-feild>
  <option value="10">
  <option value="30">
  <option value="50">
  <option value="100">
</datalist>

                            </div>

                        </div>

                    </div>

                </article>
        `;
  });
  priceCalculation();
}

async function moveToCart(productid) {
  let cartItems = JSON.parse(sessionStorage.getItem("cartItems")) || [];
  if (!cartItems.includes(productid)) {
    cartItems.unshift(productid);
    sessionStorage.setItem("cartItems", JSON.stringify(cartItems));
    console.log(`Added ${productid}`);

    await renderCartUI();
  } else {
    console.log("Item already in cart");
  }
}

async function removeFromCart(id) {
  let cartItems = JSON.parse(sessionStorage.getItem("cartItems")) || [];
  const updatedItems = cartItems.filter((e) => e != id);
  sessionStorage.setItem("cartItems", JSON.stringify(updatedItems));
  await renderCartUI();
  priceCalculation();
}

//handle coupon
function handleCoupon() {
  let inputCoupon = document.querySelector(".add-coupon");
  inputCoupon.value = "No coupon match";
  inputCoupon.style.color = "red";
}

// calculate total price
function priceCalculation() {
  let finalTotal = 0;
  let totalDiscountGiven = 0;
  let totalTaxCollected = 0;

  const qtyInputs = document.querySelectorAll("#qty-choice");

  qtyInputs.forEach((input) => {
    const qty = parseInt(input.value);
    const price = parseFloat(input.getAttribute("data-price"));
    const discountPercent = parseFloat(input.getAttribute("data-discount"));
    const taxPercent = parseFloat(input.getAttribute("data-tax"));

    const baseTotal = price * qty;
    const discountAmount = (baseTotal * discountPercent) / 100;

    const priceAfterDiscount = baseTotal - discountAmount;
    const taxAmount = (priceAfterDiscount * taxPercent) / 100;

    const itemFinalTotal = priceAfterDiscount + taxAmount;

    finalTotal += itemFinalTotal;
    totalDiscountGiven += discountAmount;
    totalTaxCollected += taxAmount;
  });

  console.log(
    `Total: ${finalTotal}, Tax: ${totalTaxCollected}, Disc: ${totalDiscountGiven}`
  );

  // Subtotal
  const subTotalEl = document.querySelector(".sub-total");
  if (subTotalEl)
    subTotalEl.innerText = "$" + (finalTotal - totalTaxCollected).toFixed(2);
  document.querySelector(".discount-percentage").innerText =
    "-" + totalDiscountGiven;
  document.querySelector(".tax-price").innerText = "+" + totalTaxCollected;
  // Final Total
  const grandTotalEl = document.querySelector(".total-price"); // Total Price
  if (grandTotalEl) grandTotalEl.innerText = "$" + finalTotal.toFixed(2);
}

//render star according to rating
function getStarHTML(ratingValue) {
  let starsHTML = "";

  for (let i = 1; i <= 5; i++) {
    if (i <= Math.round(ratingValue)) {
      starsHTML += `<img src="../assets/icons/SVG/star.svg" alt="star">`;
    } else {
      starsHTML += `<img src="../assets/icons/star.png" alt="star">`;
    }
  }

  return starsHTML;
}
