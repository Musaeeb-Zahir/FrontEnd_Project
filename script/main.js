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
  }
  if (document.querySelector(".listing-page-container")) {
    loadCategoryListingItems();
    document
      .querySelector("#btn-icon-grid")
      .addEventListener("click", handleGridClick);
  }
  document
    .querySelector("#btn-icon-list")
    .addEventListener("click", handleListClick);
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
        <p>${element.description}</p></div>
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
    // thumbnails: document.querySelector(".thumbnail-list"),
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
    descriptionText: document.querySelector(".content-text p"),
    // modelId: document.querySelector(".model-id"),
    featuresList: document.getElementById("features-list"),
  };
  el.mainImage.src = product.images.main;
  el.title.textContent = product.title;
  el.stockText.innerText = product.stock_status;
  el.reviewsCount.textContent = `${product.sales.reviews_count} Reviews`;
  el.soldCount.textContent = `${product.sales.sold_count} Sold`;

  el.descriptionText.textContent = product.description;

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
                        <button class="btn-fav">
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
