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
      <li>${category}</li>
    </a>
    `;
  });
}

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

  discountItems.forEach((element) => {
    dealItems.innerHTML += `
      <article class="deal-item">
        <img src="${element.images.main}" alt="">
        <h3>${element.category}</h3>
        <span>${element.price.discount_label}</span>
      </article>
    `;
  });
}

//Load Home and outdoor items
const categoryGridContainer = document.querySelector(".category-grid");
const filterHomeAndOutdoorItems = async () => {
  const data = await fetchProductsData();
  return data.filter((element) => element.category == "home and outdoor");
};
//update home and items category function
async function updateUIHomeElements() {
  const homeAndOutdooritems = await filterHomeAndOutdoorItems();
  categoryGridContainer.innerHTML = "";
  homeAndOutdooritems.forEach((element) => {
    categoryGridContainer.innerHTML += `
  <article class="cat-item">
       <div><h3>${element.slug}</h3>
        <span>From</span>
        <span class="price"> ${element.price.currency} ${element.price.current}</span></div> 
        <img src="${element.images.main}" alt="Soft chairs">
      </article>
  `;
  });
}

//Load electronics items
const electronicsGridContainer = document.querySelector("#electronics-grid");
const filterElectronicsItems = async () => {
  const data = await fetchProductsData();
  return data.filter((element) => element.category == "electronics");
};
//update home and items category function
async function updateUIElectronicItems() {
  const electronicsItems = await filterHomeAndOutdoorItems();
  electronicsGridContainer.innerHTML = "";
  electronicsItems.forEach((element) => {
    electronicsGridContainer.innerHTML += `
  <article class="cat-item">
       <div><h3>${element.slug}</h3>s
        <span>From</span>
        <span class="price"> ${element.price.currency} ${element.price.current}</span></div> 
        <img src="${element.images.main}" alt="Soft chairs">
      </article>
  `;
  });
}

//laod recommanded items
const recommandedItemsGrid = document.querySelector(".recommended-items-grid");
async function loadUIforrecommandedItems() {
  recommandedItemsGrid.innerHTML = "";
  const recommandedItems = await fetchProductsData();
  recommandedItems.forEach((element) => {
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
    console.log(productId);

    const products = await fetchProductsData();
    const product = products.find((item) => item.id == productId);
    if (product) {
      loadProductDetailUI(product);
    }
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
    // ratingStars: document.querySelector(".rating-stars"),
    reviewsCount: document.querySelector("#reviews-count"),
    soldCount: document.querySelector("#sold-count"),
    // priceBlocks: document.querySelector(".price-blocks"),
    // dynamicSpecs: document.getElementById("dynamic-specs"),
    // minOrder: document.querySelector(".min-order"),
    // companyName: document.querySelector(".company-name"),
    // supplierFlag: document.querySelector(".supplier-flag"),
    // supplierLocation: document.querySelector(".supplier-location"),
    // supplierShipping: document.querySelector(".supplier-shipping"),
    // descriptionText: document.querySelector(".content-text p"),
    // modelId: document.querySelector(".model-id"),
    featuresList: document.getElementById("features-list"),
  };
  el.mainImage.src = product.images.main;
  el.title.textContent = product.title;
  el.stockText.innerText = product.stock_status;
  el.reviewsCount.textContent = `${product.sales.reviews_count} Reviews`;
  el.soldCount.textContent = `${product.sales.sold_count} Sold`;

  // el.descriptionText.textContent = product.description;

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
                <img src="../assets/products/wallet.png" alt="Wallet">
            </div>
            <div class="info-box">
                <a href="#" class="rp-title">Xiaomi Redmi 8 Original</a>
                <span class="rp-price">$32.00-$40.00</span>
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
  const urlParams = new URLSearchParams(window.location.search);
  const categoryName = urlParams.get("category");
  const listingContainer = document.querySelector(".products-wrapper");
  const paginationWrapper = document.querySelector(".pagination-wrapper");
  const allItems = await fetchProductsData();
  const categoryItems = allItems.filter(
    (item) => item.category === categoryName
  );
  listingContainer.innerHTML = "";
  categoryItems.forEach((element) => {
    listingContainer.innerHTML += `
     <article class="product-card">
                <div class="card-image">
                    <img src=${element.images.main} alt="iPhone" height="
187.6px">
                </div>
                <div class="card-details">
                    <div class="card-header">
                        <h4>${element.title}</h4>
                        <button class="btn-fav" onclick="saveForLater(${element.id})">
                            <img src="../assets/Layout/Form/input-group/Icon/control/fav.png" alt="Fav">
                        </button>
                    </div>
                    
                    <div class="price-info">
                        <span class="price-current">$${element.price.current}</span>
                        <span class="price-old">$${element.price.old}</span>
                    </div>

                    <div class="rating-info">
                        <div class="stars">
                            <img src="../assets/icons/star-fill.png" alt="star">
                            <img src="../assets/icons/star-fill.png" alt="star">
                            <img src="../assets/icons/star-fill.png" alt="star">
                            <img src="../assets/icons/star-fill.png" alt="star">
                            <img src="../assets/icons/star-empty.png" alt="star">
                        </div>
                        <span class="rating-score">${element.rating.score}</span>
                        <span class="dot"></span>
                        <span class="orders-count">${element.sales.sold_count} orders</span>
                        <span class="dot"></span>
                        <span class="shipping-status">${element.supplier.shipping}</span>
                    </div>

                    <p class="product-desc">
                        ${element.description}
                    </p>

                    <a href="/pages/productDetail.html?id=${element.id}" class="view-link">View details</a>
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
    savedItems.splice(index, 1);
    console.log(`Removed ${elementid}`);
  } else {
    savedItems.unshift(elementid);
    console.log(`Added ${elementid}`);
  }
  localStorage.setItem("wishlistIds", JSON.stringify(savedItems));
  console.log("Updated List:", savedItems);
}

//hide and show filter list in lsition page
function toggleFilterList(id) {
  const filterList = document.querySelector(`#${id}`);
  filterList.classList.toggle("display-none");
  event.target.src = event.target.src.includes("Vector.png")
    ? "/assets/Layout/Form/input-group/Icon/control/Vector2.png"
    : "/assets/Layout/Form/input-group/Icon/control/Vector.png";
}

async function renderSavedForLater() {
  const savedGrid = document.querySelector(".saved-grid");
  const savedItemsForlater = JSON.parse(localStorage.getItem("wishlistIds"));
  const products = await fetchProductsData();
  const savedIdsNumbers = savedItemsForlater.map(Number);
  console.log(savedIdsNumbers);

  const wishlistProducts = products.filter((product) => {
    return savedIdsNumbers.includes(product.id);
  });
  savedGrid.innerHTML = "";
  wishlistProducts.forEach((pro) => {
    savedGrid.innerHTML += `
  <article class="saved-card">
                    <div class="saved-img">
                        <img src=${pro.images.main}alt="Tablet">
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

                            <span class="item-price">${
                              element.price.current
                            }</span>

                            <div class="qty-select">

                                <select>

                                    <option value="9">Qty: 9</option>

                                    <option value="1">Qty: 1</option>

                                </select>

                            </div>

                        </div>

                    </div>

                </article>
        `;
  });
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
}
document.addEventListener("DOMContentLoaded", () => {
  renderCartUI();
});
