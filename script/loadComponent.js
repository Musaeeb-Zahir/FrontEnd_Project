// assets/js/utils.js

/**
 * Kisi bhi HTML component ko load karne ke liye function
//  * @param {string} elementId - Jahan component dikhana hai us div ki ID
//  * @param {string} filePath - Component file ka path (e.g., /components/header.html)
//  */
// async function loadComponent(elementId, filePath) {
//     try {
//         // File fetch karna
//         const response = await fetch(filePath);
        
//         // Agar file mil gayi
//         if (response.ok) {
//             const content = await response.text();
//             document.getElementById(elementId).innerHTML = content;
//         } else {
//             console.error(`Error: File not found at ${filePath}`);
//         }
//     } catch (error) {
//         console.error("Component load karne mein masla aaya:", error);
//     }
// }
// console.log(loadComponent("header-placeholder","/components/header.html"));

 fetch('Components/header.html')
    .then(response => response.text())
    .then(data => {
      document.querySelector('.header-placeholder').innerHTML = data;
    });
  // Load Newsletter Component and footer
  fetch('Components/newslatter.html')
    .then(response => response.text())
    .then(data => {
      document.querySelector('.newslatter-placeholder').innerHTML = data;
    });
  fetch('Components/footer.html')
    .then(response => response.text())
    .then(data => {
      document.querySelector('.footer-placeholder').innerHTML = data;
    });
