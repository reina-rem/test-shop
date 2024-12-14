# Test Shop
This project was developed as a test assignment for the Junior Full Stack Developer position. It demonstrates my ability to create a functional eCommerce site with both back-end and front-end components. The application meets the provided specifications and design.

## Live Demo 
You can view the live demo of the application here: [Live Demo](http://176.120.67.142:8000/)

## Technologies Used
- **Back-end**: PHP 8.2, MySQL 5.6 (running in Docker) 
- **Front-end**: React.js (CRA), Redux Toolkit
- **GraphQL**: For data fetching and mutations
- **CSS-in-JS**: Emotion.js for styling components

## Main Features
### Back-end Functionality
- Built with **PHP** without any back-end frameworks. 
- Created a **MySQL** database populated with data from the provided JSON file
- Developed a GraphQL schema featuring queries for categories, products, individual product details, and order information, as well as a mutation for placing orders

### Front-end Functionality
- Developed as a **Single Page Application (SPA)** using React.js
- Used **class components only**, adhering to the requirement to avoid functional components or component libraries
- Utilized **Redux** for state management, ensuring smooth and efficient handling of application state
- Implemented GraphQL requests to fetch data from the back-end. 
- The site features:
  - Product listing pages with clickable product cards leading to product details
  - A cart modal window that allows users to view items in the cart, modify quantities, and place orders
  - Design implemented according to the provided Figma mockups

## Functionality Breakdown

### Cart Modal Window 
- The header with the cart button is visible on all pages, displaying a bubble with the count of items when there are any
- Displays products with their images, names, prices, attributes, and options, including the selected options for each attribute
- Users can increase or decrease product quantities or remove them by decreasing the amount to 0 in the cart
- The cart total items and price displays dynamically based on the products added
- Users can place orders via a “place order” button, which also clears and closes the cart upon success

### Product Listing Page 
- Displays products within the selected category, which by default is the very first category
- Shows images, names, and prices of products
- Products out of stock are visually distinguished, and the add-to-cart functionality is disabled
- Quick Shop functionality, visible on hover over product cards, allows adding products with default options

### Product Details Page
- Shows detailed product information, including images and descriptions
- Includes an image carousel for viewing product images
- Forces users to select product attributes before adding them to the cart
- If product is out of stock, the "add to cart" button becomes inactive, and the text changes to "out of stock"

## Deploy
The deployment was carried out through a VPS server purchased for **1 month** on the service [https://pq.hosting/](https://pq.hosting/). The server will be operational until January 11, 2025.
