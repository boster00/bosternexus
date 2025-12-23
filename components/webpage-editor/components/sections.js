/**
 * Section templates from new.html
 * All click-copy-outer classes have been removed
 * Improved designs and added common usage sections
 */

export const sections = {
  // ============================================
  // HERO SECTIONS
  // ============================================
  hero: {
    name: 'Hero Section',
    category: 'Hero Sections',
    html: `<section class="mb-6 mouse-over-highlight text-center hero-section" style="background-image: url(https://www.bosterbio.com/media/images/design-guide/assay-elisa-kit-reader.jpg)">
  <div class="dark-overlap">
    <div class="container">
      <h2 class="font-large font-weight-bold mb-4">Optional Series Title</h2>
      <h1 class="mb-2 font-weight-bold">Main Hero Title</h1>
      <p class="font-large mb-4">Compelling description that explains your value proposition. This section should capture attention immediately.</p>
      <h3 class="font-weight-bold font-large mb-3">Optional Subheading</h3>
      <div class="row list mb-4">
        <ul class="col-12 col-lg-4">
          <li class="mb-2"><a href="#">Feature Link 1</a></li>
          <li class="mb-2"><a href="#">Feature Link 2</a></li>
          <li class="mb-2"><a href="#">Feature Link 3</a></li>
        </ul>
        <ul class="col-12 col-lg-4">
          <li class="mb-2"><a href="#">Feature Link 4</a></li>
          <li class="mb-2"><a href="#">Feature Link 5</a></li>
          <li class="mb-2"><a href="#">Feature Link 6</a></li>
        </ul>
        <ul class="col-12 col-lg-4">
          <li class="mb-2"><a href="#">Feature Link 7</a></li>
          <li class="mb-2"><a href="#">Feature Link 8</a></li>
          <li class="mb-2"><a href="#">Feature Link 9</a></li>
        </ul>
      </div>
      <a class="btn-outline-white" href="#">Call to Action</a>
    </div>
  </div>
</section>`
  },
  heroWithForm: {
    name: 'Hero Section With Form',
    category: 'Hero Sections',
    html: `<section class="mb-6 mouse-over-highlight text-center hero-section" style="background-image: url(https://www.bosterbio.com/media/images/design-guide/hero-people-team2.jpg)">
  <div class="dark-overlap">
    <div class="container">
      <div class="row">
        <div class="col-lg-8 text-left">
          <h2 class="font-large font-weight-bold mb-4">Optional Series Title</h2>
          <h1 class="mb-2 font-weight-bold">Hero Section With Form</h1>
          <p class="font-large mb-4">Engaging description that leads to the inquiry form. Perfect for lead generation pages.</p>
        </div>
        <div class="col-lg-4 text-left">
          <h3 class="font-large font-weight-bold mb-4">Begin Inquiry</h3>
          <form id="boster-form" action="https://bioinvsync.com/zohobooksAPI/api.php" method="post">
            <div class="row">
              <div class="form-group col-md-6">
                <label for="input-firstname">First Name*</label>
                <input class="form-control" type="text" name="firstname" id="input-firstname" placeholder="e.g. Diana" required>
              </div>
              <div class="form-group col-md-6">
                <label for="input-lastname">Last Name*</label>
                <input class="form-control" type="text" name="lastname" id="input-lastname" placeholder="e.g. Prince" required>
              </div>
            </div>
            <div class="form-group">
              <label for="input-phone">Phone*</label>
              <input class="form-control" type="tel" name="phone" id="input-phone" placeholder="1(510)511-9222" required>
            </div>
            <div class="form-group">
              <label for="input-email">Email*</label>
              <input class="form-control" type="email" name="email" id="input-email" placeholder="example@test.com" required>
            </div>
            <p class="btn-outline-white" onclick="submitInquiryForm(this)">Free, No Obligation Consultation</p>
          </form>
        </div>
      </div>
    </div>
  </div>
</section>`
  },

  // ============================================
  // CONTENT SECTIONS
  // ============================================
  topicHeading: {
    name: 'Topic Heading Section',
    category: 'Content Sections',
    html: `<section class="mb-5 mouse-over-highlight topic-heading-section">
  <h2 class="topic-heading text-orange text-center font-larger text-uppercase font-weight-bold typography-josefin-sans mb-3">Section Title</h2>
  <p class="text-grey text-center w-75 mx-auto mb-5 font-medium">Centered title marks the beginning of a new major section. Use this to introduce new content areas.</p>
</section>`
  },
  blankSection: {
    name: 'Blank Section',
    category: 'Content Sections',
    html: `<section class="mb-6 mouse-over-highlight single-column content-section">
  <div class="container">
    <div class="row">
      <div class="col-12">
        <h3 class="font-large text-orange mb-2 text-capitalize">Section Title</h3>
        <h4 class="font-medium text-grey mb-4">Sub header expanding on the main idea. Delete if not needed.</h4>
        <p class="mb-4">Blank Section is used to host anything that does not require special layout. Elements in this section: Header, Paragraph, Table, Button, Lists, Images.</p>
        <table class="table table-striped mb-4">
          <thead class="bg-grey text-white">
            <tr>
              <th>Column Header 1</th>
              <th>Column Header 2</th>
              <th>Column Header 3</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Row 1, Cell 1</td>
              <td>Row 1, Cell 2</td>
              <td>Row 1, Cell 3</td>
            </tr>
            <tr>
              <td>Row 2, Cell 1</td>
              <td>Row 2, Cell 2</td>
              <td>Row 2, Cell 3</td>
            </tr>
            <tr>
              <td>Row 3, Cell 1</td>
              <td>Row 3, Cell 2</td>
              <td>Row 3, Cell 3</td>
            </tr>
          </tbody>
        </table>
        <a href="#" class="btn-orange">Call to Action Button</a>
      </div>
    </div>
  </div>
</section>`
  },
  doubleColumnWithImage: {
    name: '2 Columns With Image',
    category: 'Content Sections',
    html: `<section class="mb-6 mouse-over-highlight double-column content-section">
  <div class="container">
    <div class="row">
      <div class="col-md-8 p-0">
        <div class="bg-lightgrey p-4">
          <h3 class="font-large text-orange mb-2">Section Title</h3>
          <h4 class="font-medium text-grey mb-4">Sub header expanding on the main idea. Delete if not needed.</h4>
          <p class="mb-4">Two column layout with image is perfect for featuring a concept with visual support. The image helps illustrate your point and makes the content more engaging.</p>
          <h4 class="font-medium mb-3">Key Points</h4>
          <div class="row list">
            <ul class="list-unstyled col-12 col-lg-4">
              <li class="mb-2"><a href="#">Key Point 1</a></li>
              <li class="mb-2"><a href="#">Key Point 2</a></li>
              <li class="mb-2"><a href="#">Key Point 3</a></li>
            </ul>
            <ul class="list-unstyled col-12 col-lg-4">
              <li class="mb-2"><a href="#">Key Point 4</a></li>
              <li class="mb-2"><a href="#">Key Point 5</a></li>
              <li class="mb-2"><a href="#">Key Point 6</a></li>
            </ul>
            <ul class="list-unstyled col-12 col-lg-4">
              <li class="mb-2"><a href="#">Key Point 7</a></li>
              <li class="mb-2"><a href="#">Key Point 8</a></li>
              <li class="mb-2"><a href="#">Key Point 9</a></li>
            </ul>
          </div>
          <a href="#" class="btn-orange mr-4 mt-3">Learn More</a>
        </div>
      </div>
      <div class="col-md-4 p-0">
        <div style="background-image: url('https://bosterbio.com/media/items/female-doctor.jpg')" class="h-100 background-cover"></div>
      </div>
    </div>
  </div>
</section>`
  },
  doubleColumnWithCard: {
    name: '2 Columns With Card',
    category: 'Content Sections',
    html: `<section class="mb-6 mouse-over-highlight double-column content-section">
  <div class="container">
    <div class="row">
      <div class="col-md-8 p-4">
        <h3 class="font-large text-orange mb-2 text-capitalize">Section Title</h3>
        <h4 class="font-medium text-grey mb-4">Sub header expanding on the main idea. Delete if not needed.</h4>
        <p class="mb-4">Two column layout with card is ideal for featuring main content alongside a highlighted call-to-action or additional information card.</p>
        <h4 class="font-medium mb-3">Key Features</h4>
        <div class="row list">
          <ul class="list-unstyled col-12 col-lg-4">
            <li class="mb-2"><a href="#">Feature 1</a></li>
            <li class="mb-2"><a href="#">Feature 2</a></li>
            <li class="mb-2"><a href="#">Feature 3</a></li>
          </ul>
          <ul class="list-unstyled col-12 col-lg-4">
            <li class="mb-2"><a href="#">Feature 4</a></li>
            <li class="mb-2"><a href="#">Feature 5</a></li>
            <li class="mb-2"><a href="#">Feature 6</a></li>
          </ul>
          <ul class="list-unstyled col-12 col-lg-4">
            <li class="mb-2"><a href="#">Feature 7</a></li>
            <li class="mb-2"><a href="#">Feature 8</a></li>
            <li class="mb-2"><a href="#">Feature 9</a></li>
          </ul>
        </div>
        <a href="#" class="btn-orange mr-4 mt-3">Get Started</a>
      </div>
      <div class="col-md-4 p-4">
        <div class="bg-lightgrey p-4 border-rounded">
          <h3 class="text-orange font-large mb-3">Card Title</h3>
          <p class="mb-3">Card content goes here. This can be used to feature additional information, special offers, or call-to-action.</p>
          <a href="#" class="btn-orange">Action Button</a>
        </div>
      </div>
    </div>
  </div>
</section>`
  },
  singleColumnWithImage: {
    name: 'Single Column With Image',
    category: 'Content Sections',
    html: `<section class="mb-6 mouse-over-highlight single-column content-section">
  <div class="container">
    <div class="row">
      <div class="col-12 text-center mb-4">
        <img src="https://www.bosterbio.com/media/images/placeholder.jpg" class="img-fluid mb-4" alt="Section Image" style="max-height: 400px;">
        <h3 class="font-large text-orange mb-2">Section Title</h3>
        <h4 class="font-medium text-grey mb-4">Sub header expanding on the main idea. Delete if not needed.</h4>
        <p class="mb-4">Single column with image is perfect for showcasing a featured image above or below your content. Great for storytelling and visual emphasis.</p>
        <a href="#" class="btn-orange">Learn More</a>
      </div>
    </div>
  </div>
</section>`
  },
  multiColumn: {
    name: 'Multi Column (1:1:1)',
    category: 'Content Sections',
    html: `<section class="mb-6 mouse-over-highlight multi-column content-section">
  <div class="container p-3">
    <h3 class="font-large text-orange mb-4 text-center text-capitalize">Three Equal Columns</h3>
    <div class="multicolumns">
      <div class="table-cell col-md-3 cjcard">
        <h4 class="font-medium text-orange mb-3">Column 1 Title</h4>
        <p class="mb-3">Content for the first column. Can be used to feature plain contents. Elements included: Header, Paragraph, Lists, Button.</p>
        <a href="#" class="btn-orange mb-5 mb-lg-0 btn-full-width">Action</a>
      </div>
      <div class="table-cell col-md-3 cjcard">
        <h4 class="font-medium text-orange mb-3">Column 2 Title</h4>
        <p class="mb-3">Content for the second column. Can be used to feature plain contents. Elements included: Header, Paragraph, Lists, Button.</p>
        <a href="#" class="btn-orange mb-5 mb-lg-0 btn-full-width">Action</a>
      </div>
      <div class="table-cell col-md-3 cjcard">
        <h4 class="font-medium text-orange mb-3">Column 3 Title</h4>
        <p class="mb-3">Content for the third column. Can be used to feature plain contents. Elements included: Header, Paragraph, Lists, Button.</p>
        <a href="#" class="btn-orange mb-5 mb-lg-0 btn-full-width">Action</a>
      </div>
    </div>
  </div>
</section>`
  },
  tabs: {
    name: 'Tabs Section',
    category: 'Content Sections',
    html: `<section class="mb-6 mouse-over-highlight tab-nav-section">
  <div class="container">
    <div class="row">
      <div class="col-12 tabs-wrapper">
        <ul class="nav nav-tabs">
          <li class="nav-item">
            <a class="nav-link active" data-toggle="tab" href="#tab-1">Tab 1</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" data-toggle="tab" href="#tab-2">Tab 2</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" data-toggle="tab" href="#tab-3">Tab 3</a>
          </li>
        </ul>
        <div class="tab-content p-4 bg-white">
          <div class="tab-pane fade show active" id="tab-1">
            <h4 class="font-medium text-orange mb-3">Tab 1 Content</h4>
            <p>Content for the first tab goes here. You can add any HTML elements including paragraphs, lists, images, and more.</p>
          </div>
          <div class="tab-pane fade" id="tab-2">
            <h4 class="font-medium text-orange mb-3">Tab 2 Content</h4>
            <p>Content for the second tab goes here. Use tabs to organize related information without overwhelming the page.</p>
          </div>
          <div class="tab-pane fade" id="tab-3">
            <h4 class="font-medium text-orange mb-3">Tab 3 Content</h4>
            <p>Content for the third tab goes here. Tabs are great for product specifications, features, or detailed information.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>`
  },

  // ============================================
  // FEATURES & BENEFITS
  // ============================================
  featuresGrid: {
    name: 'Features Grid',
    category: 'Features & Benefits',
    html: `<section class="mb-6 mouse-over-highlight features-grid-section">
  <div class="container">
    <h2 class="topic-heading text-orange text-center font-larger text-uppercase font-weight-bold typography-josefin-sans mb-3">Key Features</h2>
    <p class="text-grey text-center w-75 mx-auto mb-5 font-medium">Discover what makes our solution stand out</p>
    <div class="row">
      <div class="col-md-4 mb-4">
        <div class="text-center p-4 bg-lightgrey border-rounded h-100">
          <div class="mb-3">
            <i class="fas fa-check-circle text-orange font-largest"></i>
          </div>
          <h3 class="font-large text-orange mb-3">Feature 1</h3>
          <p class="font-medium">Detailed description of the first key feature and its benefits to users.</p>
        </div>
      </div>
      <div class="col-md-4 mb-4">
        <div class="text-center p-4 bg-lightgrey border-rounded h-100">
          <div class="mb-3">
            <i class="fas fa-star text-orange font-largest"></i>
          </div>
          <h3 class="font-large text-orange mb-3">Feature 2</h3>
          <p class="font-medium">Detailed description of the second key feature and its benefits to users.</p>
        </div>
      </div>
      <div class="col-md-4 mb-4">
        <div class="text-center p-4 bg-lightgrey border-rounded h-100">
          <div class="mb-3">
            <i class="fas fa-shield-alt text-orange font-largest"></i>
          </div>
          <h3 class="font-large text-orange mb-3">Feature 3</h3>
          <p class="font-medium">Detailed description of the third key feature and its benefits to users.</p>
        </div>
      </div>
    </div>
  </div>
</section>`
  },
  benefits: {
    name: 'Benefits Section',
    category: 'Features & Benefits',
    html: `<section class="mb-6 mouse-over-highlight benefits-section bg-lightgrey">
  <div class="container p-4">
    <h2 class="topic-heading text-orange text-center font-larger text-uppercase font-weight-bold typography-josefin-sans mb-3">Why Choose Us</h2>
    <p class="text-grey text-center w-75 mx-auto mb-5 font-medium">Benefits that solve your problems and deliver real value</p>
    <div class="row">
      <div class="col-md-6 mb-4">
        <div class="d-flex">
          <div class="mr-3">
            <i class="fas fa-lightbulb text-orange font-large"></i>
          </div>
          <div>
            <h3 class="font-medium text-orange mb-2">Benefit 1</h3>
            <p class="font-medium">Clear explanation of how this benefit solves a specific problem or improves outcomes.</p>
          </div>
        </div>
      </div>
      <div class="col-md-6 mb-4">
        <div class="d-flex">
          <div class="mr-3">
            <i class="fas fa-rocket text-orange font-large"></i>
          </div>
          <div>
            <h3 class="font-medium text-orange mb-2">Benefit 2</h3>
            <p class="font-medium">Clear explanation of how this benefit solves a specific problem or improves outcomes.</p>
          </div>
        </div>
      </div>
      <div class="col-md-6 mb-4">
        <div class="d-flex">
          <div class="mr-3">
            <i class="fas fa-chart-line text-orange font-large"></i>
          </div>
          <div>
            <h3 class="font-medium text-orange mb-2">Benefit 3</h3>
            <p class="font-medium">Clear explanation of how this benefit solves a specific problem or improves outcomes.</p>
          </div>
        </div>
      </div>
      <div class="col-md-6 mb-4">
        <div class="d-flex">
          <div class="mr-3">
            <i class="fas fa-users text-orange font-large"></i>
          </div>
          <div>
            <h3 class="font-medium text-orange mb-2">Benefit 4</h3>
            <p class="font-medium">Clear explanation of how this benefit solves a specific problem or improves outcomes.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>`
  },
  stats: {
    name: 'Stats/Numbers Section',
    category: 'Features & Benefits',
    html: `<section class="mb-6 mouse-over-highlight stats-section bg-lightgrey">
  <div class="container p-4">
    <div class="row text-center">
      <div class="col-md-3 col-6 mb-4 mb-md-0">
        <div class="p-3">
          <div class="font-larger font-weight-bold text-orange mb-2">10,000+</div>
          <p class="font-medium text-grey">Happy Customers</p>
        </div>
      </div>
      <div class="col-md-3 col-6 mb-4 mb-md-0">
        <div class="p-3">
          <div class="font-larger font-weight-bold text-orange mb-2">99.9%</div>
          <p class="font-medium text-grey">Uptime</p>
        </div>
      </div>
      <div class="col-md-3 col-6 mb-4 mb-md-0">
        <div class="p-3">
          <div class="font-larger font-weight-bold text-orange mb-2">24/7</div>
          <p class="font-medium text-grey">Support</p>
        </div>
      </div>
      <div class="col-md-3 col-6 mb-4 mb-md-0">
        <div class="p-3">
          <div class="font-larger font-weight-bold text-orange mb-2">50+</div>
          <p class="font-medium text-grey">Countries Served</p>
        </div>
      </div>
    </div>
  </div>
</section>`
  },

  // ============================================
  // CALL TO ACTION
  // ============================================
  cta: {
    name: 'Call to Action',
    category: 'Call to Action',
    html: `<section class="mb-6 mouse-over-highlight p-4 bg-orange cta-section">
  <div class="container">
    <div class="row align-items-center">
      <div class="col-lg-8 col-12 mb-3 mb-lg-0">
        <h3 class="font-large font-weight-bold mb-2">Ready to Get Started?</h3>
        <p class="font-medium mb-0">Take action now and experience the difference. Join thousands of satisfied customers today.</p>
      </div>
      <div class="col-lg-4 col-12 text-lg-right text-center">
        <a href="#" class="btn-outline-white btn-lg">Get Started Now</a>
      </div>
    </div>
  </div>
</section>`
  },
  ctaDarkGrey: {
    name: 'Call to Action (Dark Grey)',
    category: 'Call to Action',
    html: `<section class="mb-6 mouse-over-highlight p-4 bg-darkgrey cta-section">
  <div class="container">
    <div class="row align-items-center">
      <div class="col-lg-8 col-12 mb-3 mb-lg-0">
        <h3 class="font-large font-weight-bold mb-2 text-white">Limited Time Offer</h3>
        <p class="font-medium mb-0 text-white">Save up to <span class="font-large font-weight-bold">90%</span> on premium features. Don't miss out on this exclusive deal.</p>
      </div>
      <div class="col-lg-4 col-12 text-lg-right text-center">
        <a href="#" class="btn-outline-white btn-lg">Claim Your Discount</a>
      </div>
    </div>
  </div>
</section>`
  },

  // ============================================
  // PRICING
  // ============================================
  pricing: {
    name: 'Pricing Section',
    category: 'Pricing',
    html: `<section class="mb-6 mouse-over-highlight pricing-section">
  <div class="container">
    <h2 class="topic-heading text-orange text-center font-larger text-uppercase font-weight-bold typography-josefin-sans mb-3">Choose Your Plan</h2>
    <p class="text-grey text-center w-75 mx-auto mb-5 font-medium">Select the perfect plan for your needs</p>
    <div class="row">
      <div class="col-md-4 mb-4">
        <div class="bg-lightgrey p-4 border-rounded h-100 text-center">
          <h3 class="font-large text-orange mb-3">Basic</h3>
          <div class="mb-3">
            <span class="font-larger font-weight-bold text-orange">$29</span>
            <span class="text-grey">/month</span>
          </div>
          <ul class="list-unstyled text-left mb-4">
            <li class="mb-2"><i class="fas fa-check text-orange mr-2"></i>Feature 1</li>
            <li class="mb-2"><i class="fas fa-check text-orange mr-2"></i>Feature 2</li>
            <li class="mb-2"><i class="fas fa-check text-orange mr-2"></i>Feature 3</li>
            <li class="mb-2"><i class="fas fa-times text-grey mr-2"></i>Feature 4</li>
            <li class="mb-2"><i class="fas fa-times text-grey mr-2"></i>Feature 5</li>
          </ul>
          <a href="#" class="btn-orange btn-full-width">Get Started</a>
        </div>
      </div>
      <div class="col-md-4 mb-4">
        <div class="bg-orange p-4 border-rounded h-100 text-center position-relative">
          <span class="badge badge-light position-absolute" style="top: -10px; right: 20px;">Most Popular</span>
          <h3 class="font-large text-white mb-3">Professional</h3>
          <div class="mb-3">
            <span class="font-larger font-weight-bold text-white">$79</span>
            <span class="text-white">/month</span>
          </div>
          <ul class="list-unstyled text-left mb-4">
            <li class="mb-2"><i class="fas fa-check text-white mr-2"></i>Feature 1</li>
            <li class="mb-2"><i class="fas fa-check text-white mr-2"></i>Feature 2</li>
            <li class="mb-2"><i class="fas fa-check text-white mr-2"></i>Feature 3</li>
            <li class="mb-2"><i class="fas fa-check text-white mr-2"></i>Feature 4</li>
            <li class="mb-2"><i class="fas fa-times text-white mr-2"></i>Feature 5</li>
          </ul>
          <a href="#" class="btn-outline-white btn-full-width">Get Started</a>
        </div>
      </div>
      <div class="col-md-4 mb-4">
        <div class="bg-lightgrey p-4 border-rounded h-100 text-center">
          <h3 class="font-large text-orange mb-3">Enterprise</h3>
          <div class="mb-3">
            <span class="font-larger font-weight-bold text-orange">$199</span>
            <span class="text-grey">/month</span>
          </div>
          <ul class="list-unstyled text-left mb-4">
            <li class="mb-2"><i class="fas fa-check text-orange mr-2"></i>Feature 1</li>
            <li class="mb-2"><i class="fas fa-check text-orange mr-2"></i>Feature 2</li>
            <li class="mb-2"><i class="fas fa-check text-orange mr-2"></i>Feature 3</li>
            <li class="mb-2"><i class="fas fa-check text-orange mr-2"></i>Feature 4</li>
            <li class="mb-2"><i class="fas fa-check text-orange mr-2"></i>Feature 5</li>
          </ul>
          <a href="#" class="btn-orange btn-full-width">Get Started</a>
        </div>
      </div>
    </div>
  </div>
</section>`
  },
  comparisonTable: {
    name: 'Comparison Table',
    category: 'Pricing',
    html: `<section class="mb-6 mouse-over-highlight comparison-section">
  <div class="container">
    <h2 class="topic-heading text-orange text-center font-larger text-uppercase font-weight-bold typography-josefin-sans mb-3">Compare Plans</h2>
    <p class="text-grey text-center w-75 mx-auto mb-5 font-medium">See how our plans stack up against each other</p>
    <div class="table-responsive">
      <table class="table table-bordered">
        <thead class="bg-grey text-white">
          <tr>
            <th>Feature</th>
            <th class="text-center">Basic</th>
            <th class="text-center">Professional</th>
            <th class="text-center">Enterprise</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Feature 1</td>
            <td class="text-center"><i class="fas fa-check text-orange"></i></td>
            <td class="text-center"><i class="fas fa-check text-orange"></i></td>
            <td class="text-center"><i class="fas fa-check text-orange"></i></td>
          </tr>
          <tr>
            <td>Feature 2</td>
            <td class="text-center"><i class="fas fa-check text-orange"></i></td>
            <td class="text-center"><i class="fas fa-check text-orange"></i></td>
            <td class="text-center"><i class="fas fa-check text-orange"></i></td>
          </tr>
          <tr>
            <td>Feature 3</td>
            <td class="text-center"><i class="fas fa-times text-grey"></i></td>
            <td class="text-center"><i class="fas fa-check text-orange"></i></td>
            <td class="text-center"><i class="fas fa-check text-orange"></i></td>
          </tr>
          <tr>
            <td>Feature 4</td>
            <td class="text-center"><i class="fas fa-times text-grey"></i></td>
            <td class="text-center"><i class="fas fa-times text-grey"></i></td>
            <td class="text-center"><i class="fas fa-check text-orange"></i></td>
          </tr>
          <tr>
            <td>Support</td>
            <td class="text-center">Email</td>
            <td class="text-center">Email + Chat</td>
            <td class="text-center">24/7 Priority</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</section>`
  },

  // ============================================
  // CREDIBILITY & SOCIAL PROOF
  // ============================================
  credibility: {
    name: 'Credibility Section',
    category: 'Credibility & Social Proof',
    html: `<section class="mt-6 topic-heading-section full-width-section mouse-over-highlight" id="credibility">
  <div class="text-center p-3">
    <div class="dark-overlap px-5 py-6" style="background-image: url(https://www.bosterbio.com/media/images/design-guide/black-background.jpg);">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <div class="d-flex justify-content-lg-between justify-content-center flex-column flex-lg-row">
              <div class="p-3 border-rounded single-item flex-1 mb-3 mb-lg-0">
                <div class="single-credibility-item-icon border-circled m-auto">
                  <i class="fas fa-user-graduate font-largest text-orange"></i>
                </div>
                <p class="mt-3 text-white"><b>Expert Support</b><br>PhD-level assistance<br>when you need it</p>
              </div>
              <div class="p-3 border-rounded single-item flex-1 mb-3 mb-lg-0">
                <div class="single-credibility-item-icon border-circled m-auto">
                  <i class="fas fa-calendar-check font-largest text-orange"></i>
                </div>
                <p class="mt-3 text-white"><b>Proven Track Record</b><br>Trusted since 1993</p>
              </div>
              <div class="p-3 border-rounded single-item flex-1 mb-3 mb-lg-0">
                <div class="single-credibility-item-icon border-circled m-auto">
                  <i class="fas fa-award font-largest text-orange"></i>
                </div>
                <p class="mt-3 text-white"><b>Quality Certified</b><br>ISO certified<br>excellence</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>`
  },
  testimonials: {
    name: 'Testimonials Slider',
    category: 'Credibility & Social Proof',
    html: `<section class="mb-6 mouse-over-highlight bg-lightgrey testimonial-section">
  <div id="testimonials-slider" class="carousel slide global-testimonials-slider">
    <ol class="carousel-indicators">
      <li data-target="#testimonials-slider" data-slide-to="0" class="active"></i>
      <li data-target="#testimonials-slider" data-slide-to="1"></li>
      <li data-target="#testimonials-slider" data-slide-to="2"></li>
    </ol>
    <div class="carousel-inner">
      <div class="carousel-item active">
        <div class="container">
          <div class="row">
            <div class="col-lg-3 col-12 mb-lg-0 mb-5 bg-lightgrey vertical-center horizontal-center">
              <img src="https://www.bosterbio.com/media/images/testimonials/immunofluorescence-PA1239-anti-Glial-fibrillary-acidic-protein-GFAP-antibody.jpg" class="m-auto d-block" alt="Customer Name" title="Customer Name">
            </div>
            <div class="col-lg-9 col-12 p-4">
              <p class="font-weight-bold text-orange font-large mb-1">Customer Name</p>
              <p class="font-small text-midgrey mb-3">Job Title, Company</p>
              <ul class="list-inline-block stars-list mb-4">
                <li><i class="fas fa-star text-orange"></i></li>
                <li><i class="fas fa-star text-orange"></i></li>
                <li><i class="fas fa-star text-orange"></i></li>
                <li><i class="fas fa-star text-orange"></i></li>
                <li><i class="fas fa-star text-orange"></i></li>
              </ul>
              <p class="mb-3"><b class="font-large">Excellent Product!</b></p>
              <p class="mb-3">Detailed testimonial text describing the customer's experience, results, and satisfaction with your product or service.</p>
              <p class="text-midgrey font-small">Use Case, Industry, Application</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <a class="carousel-control-prev" href="#testimonials-slider" data-slide="prev">
      <span><i class="fas fa-chevron-circle-left text-orange"></i></span>
    </a>
    <a class="carousel-control-next" href="#testimonials-slider" data-slide="next">
      <span><i class="fas fa-chevron-circle-right text-orange"></i></span>
    </a>
  </div>
</section>`
  },
  logoParade: {
    name: 'Logo Parade',
    category: 'Credibility & Social Proof',
    html: `<section class="mb-6 mouse-over-highlight logo-parade-section">
  <h2 class="text-orange text-center font-larger text-uppercase font-weight-bold typography-josefin-sans mb-3">Trusted By Industry Leaders</h2>
  <p class="text-grey text-center w-75 mx-auto mb-5 font-medium">Partners and customers who trust our solutions</p>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <div id="logo-parade-slider-container">
          <div id="logo-parade-slides-list">
            <div class="slide wide-slide"><img src="https://www.bosterbio.com/media/images/logos/tulan-logo.png" alt="Partner Logo"></div>
            <div class="slide"><img src="https://www.bosterbio.com/media/images/logos/lsu-logo.png" alt="Partner Logo"></div>
            <div class="slide"><img src="https://www.bosterbio.com/media/images/logos/US-CDC-Logo.png" alt="Partner Logo"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>`
  },
  trustIndicators: {
    name: 'Trust Indicators',
    category: 'Credibility & Social Proof',
    html: `<section class="mb-6 mouse-over-highlight trust-indicators-section bg-lightgrey">
  <div class="container p-4">
    <div class="row text-center">
      <div class="col-md-3 col-6 mb-3 mb-md-0">
        <div class="p-3">
          <i class="fas fa-shield-alt text-orange font-large mb-2"></i>
          <p class="font-medium mb-0">SSL Secured</p>
        </div>
      </div>
      <div class="col-md-3 col-6 mb-3 mb-md-0">
        <div class="p-3">
          <i class="fas fa-lock text-orange font-large mb-2"></i>
          <p class="font-medium mb-0">Data Protected</p>
        </div>
      </div>
      <div class="col-md-3 col-6 mb-3 mb-md-0">
        <div class="p-3">
          <i class="fas fa-certificate text-orange font-large mb-2"></i>
          <p class="font-medium mb-0">ISO Certified</p>
        </div>
      </div>
      <div class="col-md-3 col-6 mb-3 mb-md-0">
        <div class="p-3">
          <i class="fas fa-award text-orange font-large mb-2"></i>
          <p class="font-medium mb-0">Award Winning</p>
        </div>
      </div>
    </div>
  </div>
</section>`
  },

  // ============================================
  // FORMS & CONTACT
  // ============================================
  contactForm: {
    name: 'Contact Form Section',
    category: 'Forms & Contact',
    html: `<section class="mb-6 mouse-over-highlight contact-form-section">
  <div class="container">
    <div class="row">
      <div class="col-lg-8 mx-auto">
        <h2 class="topic-heading text-orange text-center font-larger text-uppercase font-weight-bold typography-josefin-sans mb-3">Get In Touch</h2>
        <p class="text-grey text-center w-75 mx-auto mb-5 font-medium">Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        <form id="contact-form" action="#" method="post" class="bg-lightgrey p-4 border-rounded">
          <div class="row">
            <div class="form-group col-md-6">
              <label for="contact-firstname">First Name*</label>
              <input class="form-control" type="text" name="firstname" id="contact-firstname" placeholder="John" required>
            </div>
            <div class="form-group col-md-6">
              <label for="contact-lastname">Last Name*</label>
              <input class="form-control" type="text" name="lastname" id="contact-lastname" placeholder="Doe" required>
            </div>
          </div>
          <div class="form-group">
            <label for="contact-email">Email*</label>
            <input class="form-control" type="email" name="email" id="contact-email" placeholder="john.doe@example.com" required>
          </div>
          <div class="form-group">
            <label for="contact-phone">Phone</label>
            <input class="form-control" type="tel" name="phone" id="contact-phone" placeholder="1(510)511-9222">
          </div>
          <div class="form-group">
            <label for="contact-subject">Subject*</label>
            <input class="form-control" type="text" name="subject" id="contact-subject" placeholder="How can we help?" required>
          </div>
          <div class="form-group">
            <label for="contact-message">Message*</label>
            <textarea class="form-control" name="message" id="contact-message" rows="5" placeholder="Tell us more about your inquiry..." required></textarea>
          </div>
          <button type="submit" class="btn-orange btn-full-width">Send Message</button>
        </form>
      </div>
    </div>
  </div>
</section>`
  },
  newsletterSignup: {
    name: 'Newsletter Signup',
    category: 'Forms & Contact',
    html: `<section class="mb-6 mouse-over-highlight newsletter-section bg-orange">
  <div class="container p-4">
    <div class="row align-items-center">
      <div class="col-lg-6 col-12 mb-3 mb-lg-0 text-center text-lg-left">
        <h3 class="font-large font-weight-bold mb-2 text-white">Stay Updated</h3>
        <p class="font-medium text-white mb-0">Subscribe to our newsletter for the latest updates, tips, and exclusive offers.</p>
      </div>
      <div class="col-lg-6 col-12">
        <form class="d-flex" action="#" method="post">
          <input class="form-control mr-2" type="email" name="email" placeholder="Enter your email" required>
          <button type="submit" class="btn-outline-white">Subscribe</button>
        </form>
      </div>
    </div>
  </div>
</section>`
  },

  // ============================================
  // MEDIA & GALLERY
  // ============================================
  imageGallery: {
    name: 'Image Gallery',
    category: 'Media & Gallery',
    html: `<section class="mb-6 mouse-over-highlight image-gallery-section">
  <div class="container">
    <h2 class="topic-heading text-orange text-center font-larger text-uppercase font-weight-bold typography-josefin-sans mb-3">Image Gallery</h2>
    <p class="text-grey text-center w-75 mx-auto mb-5 font-medium">Showcase your products, services, or portfolio</p>
    <div class="row">
      <div class="col-md-4 col-6 mb-4">
        <img src="https://www.bosterbio.com/media/images/placeholder.jpg" class="img-fluid w-100" alt="Gallery Image 1" style="height: 250px; object-fit: cover;">
      </div>
      <div class="col-md-4 col-6 mb-4">
        <img src="https://www.bosterbio.com/media/images/placeholder.jpg" class="img-fluid w-100" alt="Gallery Image 2" style="height: 250px; object-fit: cover;">
      </div>
      <div class="col-md-4 col-6 mb-4">
        <img src="https://www.bosterbio.com/media/images/placeholder.jpg" class="img-fluid w-100" alt="Gallery Image 3" style="height: 250px; object-fit: cover;">
      </div>
      <div class="col-md-4 col-6 mb-4">
        <img src="https://www.bosterbio.com/media/images/placeholder.jpg" class="img-fluid w-100" alt="Gallery Image 4" style="height: 250px; object-fit: cover;">
      </div>
      <div class="col-md-4 col-6 mb-4">
        <img src="https://www.bosterbio.com/media/images/placeholder.jpg" class="img-fluid w-100" alt="Gallery Image 5" style="height: 250px; object-fit: cover;">
      </div>
      <div class="col-md-4 col-6 mb-4">
        <img src="https://www.bosterbio.com/media/images/placeholder.jpg" class="img-fluid w-100" alt="Gallery Image 6" style="height: 250px; object-fit: cover;">
      </div>
    </div>
  </div>
</section>`
  },
  videoEmbed: {
    name: 'Video Embed Section',
    category: 'Media & Gallery',
    html: `<section class="mb-6 mouse-over-highlight video-embed-section">
  <div class="container">
    <div class="row">
      <div class="col-lg-8 mx-auto">
        <h2 class="topic-heading text-orange text-center font-larger text-uppercase font-weight-bold typography-josefin-sans mb-3">Watch Our Video</h2>
        <p class="text-grey text-center w-75 mx-auto mb-4 font-medium">Learn more about our product and see it in action</p>
        <div class="embed-responsive embed-responsive-16by9 mb-4">
          <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/dQw4w9WgXcQ" allowfullscreen></iframe>
        </div>
        <p class="text-center font-medium text-grey">Replace the YouTube URL with your own video embed code</p>
      </div>
    </div>
  </div>
</section>`
  },

  // ============================================
  // ABOUT & TEAM
  // ============================================
  team: {
    name: 'Team Section',
    category: 'About & Team',
    html: `<section class="mb-6 mouse-over-highlight team-section">
  <div class="container">
    <h2 class="topic-heading text-orange text-center font-larger text-uppercase font-weight-bold typography-josefin-sans mb-3">Meet Our Team</h2>
    <p class="text-grey text-center w-75 mx-auto mb-5 font-medium">The talented people behind our success</p>
    <div class="row">
      <div class="col-md-4 mb-4">
        <div class="text-center">
          <img src="https://www.bosterbio.com/media/images/placeholder.jpg" class="img-fluid rounded-circle mb-3" alt="Team Member" style="width: 200px; height: 200px; object-fit: cover;">
          <h3 class="font-large text-orange mb-2">Team Member Name</h3>
          <p class="font-medium text-grey mb-2">Job Title</p>
          <p class="font-medium mb-3">Brief bio or description of the team member's role and expertise.</p>
          <div>
            <a href="#" class="mr-2"><i class="fab fa-linkedin text-orange"></i></a>
            <a href="#" class="mr-2"><i class="fab fa-twitter text-orange"></i></a>
            <a href="#"><i class="fas fa-envelope text-orange"></i></a>
          </div>
        </div>
      </div>
      <div class="col-md-4 mb-4">
        <div class="text-center">
          <img src="https://www.bosterbio.com/media/images/placeholder.jpg" class="img-fluid rounded-circle mb-3" alt="Team Member" style="width: 200px; height: 200px; object-fit: cover;">
          <h3 class="font-large text-orange mb-2">Team Member Name</h3>
          <p class="font-medium text-grey mb-2">Job Title</p>
          <p class="font-medium mb-3">Brief bio or description of the team member's role and expertise.</p>
          <div>
            <a href="#" class="mr-2"><i class="fab fa-linkedin text-orange"></i></a>
            <a href="#" class="mr-2"><i class="fab fa-twitter text-orange"></i></a>
            <a href="#"><i class="fas fa-envelope text-orange"></i></a>
          </div>
        </div>
      </div>
      <div class="col-md-4 mb-4">
        <div class="text-center">
          <img src="https://www.bosterbio.com/media/images/placeholder.jpg" class="img-fluid rounded-circle mb-3" alt="Team Member" style="width: 200px; height: 200px; object-fit: cover;">
          <h3 class="font-large text-orange mb-2">Team Member Name</h3>
          <p class="font-medium text-grey mb-2">Job Title</p>
          <p class="font-medium mb-3">Brief bio or description of the team member's role and expertise.</p>
          <div>
            <a href="#" class="mr-2"><i class="fab fa-linkedin text-orange"></i></a>
            <a href="#" class="mr-2"><i class="fab fa-twitter text-orange"></i></a>
            <a href="#"><i class="fas fa-envelope text-orange"></i></a>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>`
  },

  // ============================================
  // WORKFLOW & PROCESS
  // ============================================
  workflow: {
    name: 'Workflow Section',
    category: 'Workflow & Process',
    html: `<section class="mb-6 mouse-over-highlight workflow-section">
  <h2 class="topic-heading text-orange text-center font-larger text-uppercase font-weight-bold typography-josefin-sans mb-3 mt-6">How It Works</h2>
  <p class="text-grey text-center w-75 mx-auto mb-5 font-medium">A step-by-step guide to our process. Each step is clearly explained with brief descriptions.</p>
  <div class="container">
    <div class="row">
      <div class="col-lg-2 col-md-12"></div>
      <div class="col-lg-8 col-md-12">
        <div class="timeline-bubbles timeline-bubbles-small-icons">
          <ul>
            <li>
              <h3 class="font-large text-orange">Step 1: Get Started</h3>
              <p class="font-medium">Initial description of the first step in your process. Explain what happens and what users can expect.</p>
            </li>
            <li>
              <h3 class="font-large text-orange">Step 2: Configure</h3>
              <p class="font-medium">Description of the second step. Detail the configuration process and any important considerations.</p>
            </li>
            <li>
              <h3 class="font-large text-orange">Step 3: Launch</h3>
              <p class="font-medium">Final step description. Explain the launch process and what happens after completion.</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</section>`
  },

  // ============================================
  // ACCORDIONS & FAQ
  // ============================================
  accordion: {
    name: 'Accordion Section',
    category: 'Accordions & FAQ',
    html: `<section class="mb-6 mouse-over-highlight accordion-section">
  <h2 class="topic-heading text-orange text-center font-larger text-uppercase font-weight-bold typography-josefin-sans mb-3">Frequently Asked Questions</h2>
  <p class="text-grey text-center w-75 mx-auto mb-5 font-medium">Find answers to common questions. Click on any question to expand and see the answer.</p>
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <div class="accordion" id="accordion-1">
          <h3 class="font-medium m-0 p-3 bg-lightgrey border-bottom"><a href="#" class="d-block" data-toggle="collapse" data-target="#item1">Q1. What is this product/service?</a></h3>
          <div id="item1" class="collapse" data-parent="#accordion-1">
            <div class="p-4 bg-white">Detailed answer to the first question. Provide comprehensive information that addresses the question fully.</div>
          </div>
          <h3 class="font-medium m-0 p-3 bg-lightgrey border-bottom"><a href="#" class="d-block" data-toggle="collapse" data-target="#item2">Q2. How does it work?</a></h3>
          <div id="item2" class="collapse" data-parent="#accordion-1">
            <div class="p-4 bg-white">Detailed explanation of how the product or service works. Include step-by-step information if relevant.</div>
          </div>
          <h3 class="font-medium m-0 p-3 bg-lightgrey border-bottom"><a href="#" class="d-block" data-toggle="collapse" data-target="#item3">Q3. What are the pricing options?</a></h3>
          <div id="item3" class="collapse" data-parent="#accordion-1">
            <div class="p-4 bg-white">Information about pricing plans, payment options, and any special offers or discounts available.</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>`
  },

  // ============================================
  // PRODUCT SHOWCASE
  // ============================================
  productShowcase: {
    name: 'Product Showcase',
    category: 'Product Showcase',
    html: `<section class="mb-6 mouse-over-highlight p-3 container product-showcase-section">
  <h2 class="topic-heading text-orange text-center font-larger text-uppercase font-weight-bold typography-josefin-sans mb-3">Featured Products</h2>
  <p class="text-grey text-center w-75 mx-auto mb-5 font-medium">Explore our top products and solutions</p>
  <div id="product-showcase-1" class="carousel slide">
    <ol class="carousel-indicators">
      <li data-target="#product-showcase-1" data-slide-to="0" class="active"></li>
      <li data-target="#product-showcase-1" data-slide-to="1"></li>
    </ol>
    <div class="carousel-inner">
      <div class="carousel-item active">
        <div class="row">
          <div class="col-12 col-lg-4 mb-4">
            <img src="https://www.bosterbio.com/media/images/placeholder.jpg" class="mb-3 w-100" height="250" alt="Product Image" title="Product Name">
            <h3 class="font-medium text-orange mb-2">Product Name</h3>
            <table class="mb-3">
              <tbody>
                <tr>
                  <th class="pr-3">SKU:</th>
                  <td>PROD-001</td>
                </tr>
                <tr>
                  <th class="pr-3">Category:</th>
                  <td>Category Name</td>
                </tr>
                <tr>
                  <th class="pr-3">Applications:</th>
                  <td>Application 1, Application 2</td>
                </tr>
              </tbody>
            </table>
            <a href="#" class="btn-orange">Learn More</a>
          </div>
          <div class="col-12 col-lg-4 mb-4">
            <img src="https://www.bosterbio.com/media/images/placeholder.jpg" class="mb-3 w-100" height="250" alt="Product Image" title="Product Name">
            <h3 class="font-medium text-orange mb-2">Product Name</h3>
            <table class="mb-3">
              <tbody>
                <tr>
                  <th class="pr-3">SKU:</th>
                  <td>PROD-002</td>
                </tr>
                <tr>
                  <th class="pr-3">Category:</th>
                  <td>Category Name</td>
                </tr>
                <tr>
                  <th class="pr-3">Applications:</th>
                  <td>Application 1, Application 2</td>
                </tr>
              </tbody>
            </table>
            <a href="#" class="btn-orange">Learn More</a>
          </div>
          <div class="col-12 col-lg-4 mb-4">
            <img src="https://www.bosterbio.com/media/images/placeholder.jpg" class="mb-3 w-100" height="250" alt="Product Image" title="Product Name">
            <h3 class="font-medium text-orange mb-2">Product Name</h3>
            <table class="mb-3">
              <tbody>
                <tr>
                  <th class="pr-3">SKU:</th>
                  <td>PROD-003</td>
                </tr>
                <tr>
                  <th class="pr-3">Category:</th>
                  <td>Category Name</td>
                </tr>
                <tr>
                  <th class="pr-3">Applications:</th>
                  <td>Application 1, Application 2</td>
                </tr>
              </tbody>
            </table>
            <a href="#" class="btn-orange">Learn More</a>
          </div>
        </div>
      </div>
    </div>
    <a class="carousel-control-prev" href="#product-showcase-1" data-slide="prev">
      <span><i class="fas fa-chevron-circle-left text-orange"></i></span>
    </a>
    <a class="carousel-control-next" href="#product-showcase-1" data-slide="next">
      <span><i class="fas fa-chevron-circle-right text-orange"></i></span>
    </a>
  </div>
</section>`
  },

  // ============================================
  // FOOTER
  // ============================================
  footer: {
    name: 'Footer Section',
    category: 'Footer',
    html: `<section class="mb-6 mouse-over-highlight footer-section bg-darkgrey">
  <div class="container p-4">
    <div class="row">
      <div class="col-md-4 mb-4 mb-md-0">
        <h4 class="font-medium text-white mb-3">Company Name</h4>
        <p class="font-medium text-white mb-3">Brief company description or mission statement goes here.</p>
        <div>
          <a href="#" class="mr-3"><i class="fab fa-facebook text-white"></i></a>
          <a href="#" class="mr-3"><i class="fab fa-twitter text-white"></i></a>
          <a href="#" class="mr-3"><i class="fab fa-linkedin text-white"></i></a>
          <a href="#"><i class="fab fa-instagram text-white"></i></a>
        </div>
      </div>
      <div class="col-md-2 mb-4 mb-md-0">
        <h5 class="font-medium text-white mb-3">Quick Links</h5>
        <ul class="list-unstyled">
          <li class="mb-2"><a href="#" class="text-white">About</a></li>
          <li class="mb-2"><a href="#" class="text-white">Services</a></li>
          <li class="mb-2"><a href="#" class="text-white">Products</a></li>
          <li class="mb-2"><a href="#" class="text-white">Contact</a></li>
        </ul>
      </div>
      <div class="col-md-2 mb-4 mb-md-0">
        <h5 class="font-medium text-white mb-3">Resources</h5>
        <ul class="list-unstyled">
          <li class="mb-2"><a href="#" class="text-white">Documentation</a></li>
          <li class="mb-2"><a href="#" class="text-white">Support</a></li>
          <li class="mb-2"><a href="#" class="text-white">Blog</a></li>
          <li class="mb-2"><a href="#" class="text-white">FAQ</a></li>
        </ul>
      </div>
      <div class="col-md-4">
        <h5 class="font-medium text-white mb-3">Contact Info</h5>
        <p class="font-medium text-white mb-2"><i class="fas fa-map-marker-alt mr-2"></i>123 Street Name, City, State 12345</p>
        <p class="font-medium text-white mb-2"><i class="fas fa-phone mr-2"></i>1(510)511-9222</p>
        <p class="font-medium text-white mb-2"><i class="fas fa-envelope mr-2"></i>info@example.com</p>
      </div>
    </div>
    <div class="row mt-4 pt-4 border-top border-secondary">
      <div class="col-12 text-center">
        <p class="font-medium text-white mb-0">&copy; 2024 Company Name. All rights reserved.</p>
      </div>
    </div>
  </div>
</section>`
  }
};

// Get sections grouped by category
export function getSectionsByCategory() {
  const grouped = {};
  Object.values(sections).forEach(section => {
    if (!grouped[section.category]) {
      grouped[section.category] = [];
    }
    grouped[section.category].push(section);
  });
  return grouped;
}

// Get all section names for tabs
export function getSectionCategories() {
  return Object.keys(getSectionsByCategory());
}
