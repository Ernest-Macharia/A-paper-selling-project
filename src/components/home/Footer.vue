<template>
    <footer class="footer md-dark text-light py-4">
      <div class="container">
        <div class="row">
          <!-- About PaperSelling -->
          <div class="col-lg-3 col-md-6 mb-3">
            <h5>📚 GradesHub</h5>
            <p>
              Earn money by sharing your study materials! Upload your notes, help students, and get paid for your knowledge.
            </p>
          </div>
  
          <!-- Quick Links -->
          <div class="col-lg-3 col-md-6 mb-3">
            <h5>🚀 Quick Links</h5>
            <ul class="list-unstyled">
              <li><router-link to="/about" class="footer-link">About Us</router-link></li>
              <li><router-link to="/terms" class="footer-link">Terms & Conditions</router-link></li>
              <li><router-link to="/privacy" class="footer-link">Privacy Policy</router-link></li>
              <li><router-link to="/contact" class="footer-link">Contact Us</router-link></li>
              <li><router-link to="/blog" class="footer-link">Blog</router-link></li>
            </ul>
          </div>
  
          <!-- Support & Help -->
          <div class="col-lg-3 col-md-6 mb-3">
            <h5>🤝 Support & Help</h5>
            <ul class="list-unstyled">
              <li><router-link to="/faq" class="footer-link">FAQs</router-link></li>
              <li><router-link to="/help" class="footer-link">Help Center</router-link></li>
              <li><router-link to="/live-chat" class="footer-link">Live Chat</router-link></li>
              <li><router-link to="/report-issue" class="footer-link">Report an Issue</router-link></li>
            </ul>
          </div>
  
          <!-- Follow Us & Payments -->
          <div class="col-lg-3 col-md-6 mb-3">
            <h5>📲 Stay Connected</h5>
            <p>Follow us for updates and exclusive offers!</p>
            <div class="social-icons">
                <a href="https://x.com" target="_blank" class="x"><i class="fa-brands fa-x-twitter"></i></a>
                <a href="https://facebook.com" target="_blank" class="facebook"><i class="fa-brands fa-facebook"></i></a>
                <a href="https://instagram.com" target="_blank" class="instagram"><i class="fa-brands fa-instagram"></i></a>
            </div>

            <h5 class="mt-3">💳 Secure Payments</h5>
            <p>We accept Visa, MasterCard, and PayPal for fast and secure transactions.</p>
          </div>
        </div>
  
        <!-- Copyright & Disclaimer -->
        <div class="text-center mt-3">
          <p class="mb-0">
            &copy; {{ new Date().getFullYear() }} GradesHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  </template>
  
  <script>
  export default {
    name: "Footer",
  };
  </script>
  
<style scoped>
    .footer {
        background-color: #333;
        color: #fff;
    }
  
    .footer-link {
        color: #ddd;
        text-decoration: none;
        transition: color 0.3s;
    }
    
    .footer-link:hover {
        color: #ffc107;
    }
  
    .social-icons {
        display: flex;
        gap: 15px;
    }

    .social-icons a {
        font-size: 24px; /* Adjust icon size */
        text-decoration: none;
        transition: transform 0.3s ease-in-out, color 0.3s ease-in-out;
    }

    .social-icons a:hover {
        transform: scale(1.2); /* Slight zoom effect */
    }

    /* X (formerly Twitter) */
    .x {
        color: black; /* Official X color */
    }
    .x:hover {
        color: #656d76; /* Slight gray tone on hover */
    }

    /* Facebook */
    .facebook {
        color: #1877f2; /* Facebook Blue */
    }
    .facebook:hover {
        color: #1558b0; /* Darker Facebook Blue on hover */
    }

    /* Instagram */
    .instagram {
        color: #e1306c; /* Instagram Pink */
    }
    .instagram:hover {
        color: #bc2468; /* Darker Instagram Pink on hover */
    }

  </style>
  