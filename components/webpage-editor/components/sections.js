/**
 * Section templates from new.html
 * All click-copy-outer classes have been removed
 */

export const sections = {
  hero: {
    name: 'Hero Section',
    category: 'Hero Sections',
    html: `<section class="mb-6 mouse-over-highlight text-center hero-section" style="background-image: url(https://www.bosterbio.com/media/images/design-guide/assay-elisa-kit-reader.jpg)">
  <div class="dark-overlap">
    <h2 class="font-large font-weight-bold mb-4">To be used if this page is part of a series</h2>
    <h1 class="mb-2">Hero Section</h1>
    <p class="font-large mb-4">To be used as the first section for a page. There should be no more than 1 hero section per page. Elements in this section: Header, Paragraph, Lists, Button</p>
    <h3 class="font-weight-bold font-large">Remove the list if not needed</h3>
    <div class="row list">
      <ul class="col-12 col-lg-4">
        <li class="mb-2"><a href="#">Primary Antibodies</a></li>
        <li class="mb-2"><a href="#">Secondary Antibodies</a></li>
        <li class="mb-2"><a href="#">Picokine™ ELISA Kits</a></li>
      </ul>
      <ul class="col-12 col-lg-4">
        <li class="mb-2"><a href="#">Primary Antibodies</a></li>
        <li class="mb-2"><a href="#">Secondary Antibodies</a></li>
        <li class="mb-2"><a href="#">Picokine™ ELISA Kits</a></li>
      </ul>
      <ul class="col-12 col-lg-4">
        <li class="mb-2"><a href="#">Custom Antibodies</a></li>
        <li class="mb-2"><a href="#">Antibody Validation Service</a></li>
        <li class="mb-2"><a href="#">Multiplex ELISA Testing Service</a></li>
      </ul>
    </div>
    <a class="btn-outline-white" href="#">Remove the button if not needed</a>
  </div>
</section>`
  },
  heroWithForm: {
    name: 'Hero Section With Form',
    category: 'Hero Sections',
    html: `<section class="mb-6 mouse-over-highlight text-center hero-section" style="background-image: url(https://www.bosterbio.com/media/images/design-guide/hero-people-team2.jpg)">
  <div class="dark-overlap">
    <div class="row">
      <div class="col-lg-8 text-left">
        <h2 class="font-large font-weight-bold mb-4">To be used if this page is part of a series</h2>
        <h1 class="mb-2">Hero Section With Form</h1>
        <p class="font-large mb-4">To be used as the first section for a page. There should be no more than 1 hero section per page. Elements in this section: Header, Paragraph, Lists, Button</p>
      </div>
      <div class="col-lg-4 text-left">
        <h3 class="font-large font-weight-bold mb-4">Begin Inquiry</h3>
        <form id="boster-form" action="https://bioinvsync.com/zohobooksAPI/api.php" method="post">
          <div class="row">
            <div class="form-group col-md-6"><label for="input-6">First Name*</label>
              <input class="form-control" type="text" name="firstname" id="input-6" placeholder="e.g. Diana" required>
            </div>
            <div class="form-group col-md-6"><label for="input-6">Last Name*</label>
              <input class="form-control" type="text" name="lastname" id="input-6" placeholder="e.g. Prince" required>
            </div>
          </div>
          <div class="form-group"><label for="input-8">Phone*</label>
            <input class="form-control" type="tel" name="phone" id="input-8" placeholder="1(510)511-9222" required>
          </div>
          <div class="form-group"><label for="input-7">Email*</label>
            <input class="form-control" type="email" name="email" id="input-7" placeholder="example@test.com" required>
          </div>
          <p class="btn-outline-white" onclick="submitInquiryForm(this)">Free, No Obligation Consultation</p>
        </form>
      </div>
    </div>
  </div>
</section>`
  },
  topicHeading: {
    name: 'Topic Heading Section',
    category: 'Content Sections',
    html: `<section class="mb-5 mouse-over-highlight topic-heading-section">
  <h2 class="topic-heading text-orange text-center font-larger text-uppercase font-weight-bold typography-josefin-sans mb-3">Centered Title h2</h2>
  <p class="text-grey text-center w-75 mx-auto mb-5 font-medium">Centered title marks the beginning of a new major section.</p>
</section>`
  },
  blankSection: {
    name: 'Blank Section',
    category: 'Content Sections',
    html: `<section class="mb-6 mouse-over-highlight single-column content-section">
  <div class="container">
    <div class="row">
      <div class="col-12">
        <h3 class="font-large text-orange mb-2 text-capitalize">Blank Section: no grid at all.</h3>
        <h4 class="font-medium text-grey mb-4">Sub header should be expanding on the main idea , delete if not needed</h4>
        <p class="mb-4">Blank Section is used to host anything that does not require special layout. Elements in this section: Header, Paragraph, Table, Button.</p>
        <table class="table table-striped">
          <thead class="bg-grey text-white">
            <tr>
              <th>Cell Name</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>Some Cell Value Here</th>
              <td>Bone</td>
            </tr>
            <tr>
              <th>Other Cell Value Here</th>
              <td>Throat</td>
            </tr>
            <tr>
              <th>One Last Cell Value</th>
              <td>Really Long Location Value Here</td>
            </tr>
          </tbody>
        </table>
        <a href="#" class="btn-orange">Remove the button if not needed</a>
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
        <div class="bg-lightgrey p-3">
          <h3 class="font-large text-orange mb-2">2 Columns With Image</h3>
          <h4 class="font-medium text-grey mb-4">Sub header should be expanding on the main idea , delete if not needed</h4>
          <p class="mb-5">2 Column with Image can be used to feature a concept with image and text, and offer some interactive elements such as plain links or button(s).</p>
          <h4 class="font-medium">Remove list if not needed</h4>
          <div class="row list">
            <ul class="list-unstyled col-12 col-lg-4">
              <li class="mb-2"><a href="#">Primary Antibodies</a></li>
              <li class="mb-2"><a href="#">Secondary Antibodies</a></li>
              <li class="mb-2"><a href="#">Picokine™ ELISA Kits</a></li>
            </ul>
            <ul class="list-unstyled col-12 col-lg-4">
              <li class="mb-2"><a href="#">Primary Antibodies</a></li>
              <li class="mb-2"><a href="#">Secondary Antibodies</a></li>
              <li class="mb-2"><a href="#">Picokine™ ELISA Kits</a></li>
            </ul>
            <ul class="list-unstyled col-12 col-lg-4">
              <li class="mb-2"><a href="#">Custom Antibodies</a></li>
              <li class="mb-2"><a href="#">Antibody Validation Service</a></li>
              <li class="mb-2"><a href="#">Mutliplex ELISA Testing Service</a></li>
            </ul>
          </div>
          <a href="#" class="btn-orange mr-4">Remove button if not needed</a>
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
      <div class="col-md-8 p-3">
        <h3 class="font-large text-orange mb-2 text-capitalize">2 Columns With Card</h3>
        <h4 class="font-medium text-grey mb-4">Sub header should be expanding on the main idea , delete if not needed</h4>
        <p class="mb-4">2 Column with Image can be used to feature a concept with image and text, and offer some interactive elements such as plain links or button(s).</p>
        <h4 class="font-medium">Remove list if not needed</h4>
        <div class="row list">
          <ul class="list-unstyled col-12 col-lg-4">
            <li class="mb-2"><a href="#">Primary Antibodies</a></li>
            <li class="mb-2"><a href="#">Secondary Antibodies</a></li>
            <li class="mb-2"><a href="#">Picokine™ ELISA Kits</a></li>
          </ul>
          <ul class="list-unstyled col-12 col-lg-4">
            <li class="mb-2"><a href="#">Primary Antibodies</a></li>
            <li class="mb-2"><a href="#">Secondary Antibodies</a></li>
            <li class="mb-2"><a href="#">Picokine™ ELISA Kits</a></li>
          </ul>
          <ul class="list-unstyled col-12 col-lg-4">
            <li class="mb-2"><a href="#">Custom Antibodies</a></li>
            <li class="mb-2"><a href="#">Antibody Validation Service</a></li>
            <li class="mb-2"><a href="#">Multiplex ELISA Testing Service</a></li>
          </ul>
        </div>
        <a href="#" class="btn-orange mr-4">Remove button if not needed</a>
      </div>
      <div class="col-md-4 p-3">
        <div class="bg-lightgrey p-4 border-rounded">
          <h3 class="text-orange font-large">Card Title</h3>
          <p>Card content goes here. This can be used to feature additional information or call-to-action.</p>
          <a href="#" class="btn-orange">Remove button if not needed</a>
        </div>
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
    <h3 class="font-large text-orange mb-3 text-capitalize">1:1:1 Columns</h3>
    <div class="multicolumns">
      <div class="table-cell col-md-3 cjcard">
        <p class="mb-3">3-5 columns with the same width. Can be used to feature plain contents. Elements included in this section: Header, Paragraph, Table, Lists, Button. Remove any elements if not needed.</p>
        <a href="#" class="btn-orange mb-5 mb-lg-0 btn-full-width">Remove button if not needed</a>
      </div>
      <div class="table-cell col-md-3 cjcard">
        <p class="mb-3">3-5 columns with the same width. Can be used to feature plain contents. Elements included in this section: Header, Paragraph, Table, Lists, Button. Remove any elements if not needed.</p>
        <a href="#" class="btn-orange mb-5 mb-lg-0 btn-full-width">Remove button if not needed</a>
      </div>
      <div class="table-cell col-md-3 cjcard">
        <p class="mb-3">3-5 columns with the same width. Can be used to feature plain contents. Elements included in this section: Header, Paragraph, Table, Lists, Button. Remove any elements if not needed.</p>
        <a href="#" class="btn-orange mb-5 mb-lg-0 btn-full-width">Remove button if not needed</a>
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
            <a class="nav-link active" data-toggle="tab" href="#tab-1">Product Info</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" data-toggle="tab" href="#tab-2">Protocols</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" data-toggle="tab" href="#tab-3">More Data</a>
          </li>
        </ul>
        <div class="tab-content">
          <div class="tab-pane fade show active" id="tab-1">Product Info Content</div>
          <div class="tab-pane fade" id="tab-2">Protocols Content</div>
          <div class="tab-pane fade" id="tab-3">More Content</div>
        </div>
      </div>
    </div>
  </div>
</section>`
  },
  ctaOrange: {
    name: 'Call to Action (Orange)',
    category: 'Call to Action',
    html: `<section class="mb-6 mouse-over-highlight p-3 bg-orange cta-section">
  <div class="container">
    <div class="row">
      <div class="col-lg-8 col-12">
        <h3 class="font-large">Did You Know ?</h3>
        <p>You can Save up to <span class="font-large">90%</span> on the above regerent if you buy them from Bosterbio</p>
      </div>
      <div class="col-lg-4 col-12">
        <a href="#" class="btn-outline-white btn-full-width">Check out these great deals now !</a>
      </div>
    </div>
  </div>
</section>`
  },
  ctaDarkGrey: {
    name: 'Call to Action (Dark Grey)',
    category: 'Call to Action',
    html: `<section class="mb-6 mouse-over-highlight p-3 bg-darkgrey cta-section">
  <div class="container">
    <div class="row">
      <div class="col-lg-8 col-12">
        <h3 class="font-large">Did You Know ?</h3>
        <p>You can Save up to <span class="font-large">90%</span> on the above regerent if you buy them from Bosterbio</p>
      </div>
      <div class="col-lg-4 col-12">
        <a href="#" class="btn-outline-white btn-full-width">Check out these great deals now !</a>
      </div>
    </div>
  </div>
</section>`
  },
  credibility: {
    name: 'Credibility Section',
    category: 'Credibility Section',
    html: `<section class="mt-6 topic-heading-section full-width-section" id="service-overview">
  <div class="text-center p-3">
    <div class="dark-overlap px-5 py-6" style="background-image: url(https://www.bosterbio.com/media/images/design-guide/black-background.jpg);">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <div class="d-flex justify-content-lg-between justify-content-center flex-column flex-lg-row">
              <div class="p-3 border-rounded single-item flex-1 mb-3 mb-lg-0">
                <div class="single-credibility-item-icon border-circled m-auto">
                  <i class="fas fa-th font-largest"></i>
                </div>
                <p class="mt-3"><b>PhD-level support</b><br>great communication<br></p>
              </div>
              <div class="p-3 border-rounded single-item flex-1 mb-3 mb-lg-0">
                <div class="single-credibility-item-icon border-circled m-auto">
                  <i class="fas fa-calendar font-largest"></i>
                </div>
                <p class="mt-3"><b>Experience</b><br> since 1993</p>
              </div>
              <div class="p-3 border-rounded single-item flex-1 mb-3 mb-lg-0">
                <div class="single-credibility-item-icon border-circled m-auto">
                  <i class="fas fa-award font-largest"></i>
                </div>
                <p class="mt-3"><b>Quality</b><br>ISO certified</p>
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
    category: 'Credibility Section',
    html: `<section class="mb-6 mouse-over-highlight bg-lightgrey testimonial-section">
  <div id="testimonials-slider" class="carousel slide global-testimonials-slider">
    <ol class="carousel-indicators">
      <li data-target="#testimonials-slider" data-slide-to="0" class="active"></li>
      <li data-target="#testimonials-slider" data-slide-to="1"></li>
      <li data-target="#testimonials-slider" data-slide-to="2"></li>
    </ol>
    <div class="carousel-inner">
      <div class="carousel-item active">
        <div class="container">
          <div class="row">
            <div class="col-lg-3 col-12 mb-lg-0 mb-5 bg-lightgrey vertical-center horizontal-center">
              <img src="https://www.bosterbio.com/media/images/testimonials/immunofluorescence-PA1239-anti-Glial-fibrillary-acidic-protein-GFAP-antibody.jpg" class="m-auto d-block" alt="Company Name" title="Company Name">
            </div>
            <div class="col-lg-9 col-12 p-3">
              <p class="font-weight-bold text-orange font-large">Maria Teresa Dell'Anno</p>
              <p class="font-small text-midgrey">Postdoc</p>
              <ul class="list-inline-block stars-list mb-4">
                <li><i class="fas fa-star text-orange"></i></li>
                <li><i class="fas fa-star text-orange"></i></li>
                <li><i class="fas fa-star text-orange"></i></li>
                <li><i class="fas fa-star text-orange"></i></li>
                <li><i class="fas fa-star text-orange"></i></li>
              </ul>
              <p><b class="font-large">This Antibody Works Perfectly!</b></p>
              <p>I used it for IHC on frozen sections at a dilution of 1:500. It did not need several trials to optimize the protocol. No bad things overall. I will purchase it again.</p>
              <p class="text-midgrey font-small"> Immunohistochemistry , Spinal cord , Confocal microscope</p>
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
  workflow: {
    name: 'Workflow Section',
    category: 'Maps & Workflow',
    html: `<section class="mb-6 mouse-over-highlight workflow-section">
  <h2 class="topic-heading text-orange text-center font-larger text-uppercase font-weight-bold typography-josefin-sans mb-3 mt-6">A Stepwise Workflow</h2>
  <p class="text-grey text-center w-75 mx-auto mb-5 font-medium">This is used for listing out steps with brief description. Each row can accommodate one short paragraph and no other elements.</p>
  <div class="container">
    <div class="row">
      <div class="col-lg-2 col-md-12"></div>
      <div class="col-lg-8 col-md-12">
        <div class="timeline-bubbles timeline-bubbles-small-icons">
          <ul>
            <li>
              <h3 class="font-large">Title</h3>
              <p class="font-medium">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            </li>
            <li>
              <h3 class="font-large">Title</h3>
              <p class="font-medium">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            </li>
            <li>
              <h3 class="font-large">Title</h3>
              <p class="font-medium">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</section>`
  },
  logoParade: {
    name: 'Logo Parade',
    category: 'Logo Parade',
    html: `<section class="mb-6 mouse-over-highlight logo-parade-section">
  <h2 class="text-orange text-center font-larger text-uppercase font-weight-bold typography-josefin-sans mb-3">Partners & Customers</h2>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <div id="logo-parade-slider-container">
          <div id="logo-parade-slides-list">
            <div class="slide wide-slide"><img src="https://www.bosterbio.com/media/images/logos/tulan-logo.png"></div>
            <div class="slide"><img src="https://www.bosterbio.com/media/images/logos/lsu-logo.png"></div>
            <div class="slide"><img src="https://www.bosterbio.com/media/images/logos/US-CDC-Logo.png"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>`
  },
  accordion: {
    name: 'Accordion Section',
    category: 'Accordions',
    html: `<section class="mb-6 mouse-over-highlight accordion-section">
  <h2 class="topic-heading text-orange text-center font-larger text-uppercase font-weight-bold typography-josefin-sans mb-3">Accordions</h2>
  <p class="text-grey text-center w-75 mx-auto mb-5 font-medium">Can be used for listing lots of complex info, like FAQs or additional services on service offer pages</p>
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <div class="accordion" id="accordion-1">
          <h3 class="font-medium m-0 p-3 bg-lightgrey border-bottom"><a href="#" class="d-block" data-toggle="collapse" data-target="#item1">Q1. What is ELISA Kits ?</a></h3>
          <div id="item1" class="collapse" data-parent="#accordion-1">
            <div class="p-4 bg-white">ELISA Kit is Something</div>
          </div>
          <h3 class="font-medium m-0 p-3 bg-lightgrey border-bottom"><a href="#" class="d-block" data-toggle="collapse" data-target="#item2">Q2. Some Other Question ?</a></h3>
          <div id="item2" class="collapse" data-parent="#accordion-1">
            <div class="p-4">Answer content goes here.</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>`
  },
  productShowcase: {
    name: 'Product Showcase',
    category: 'Product Showcase',
    html: `<section class="mb-6 mouse-over-highlight p-3 container product-showcase-section">
  <h2 class="topic-heading text-orange text-center font-larger text-uppercase font-weight-bold typography-josefin-sans mb-3">Product Showcase Heading</h2>
  <p class="text-grey text-center w-75 mx-auto mb-5 font-medium">Lorem ipsum dolor sit amet</p>
  <div id="product-showcase-1" class="carousel slide">
    <ol class="carousel-indicators">
      <li data-target="#product-showcase-1" data-slide-to="0" class="active"></li>
      <li data-target="#product-showcase-1" data-slide-to="1"></li>
    </ol>
    <div class="carousel-inner">
      <div class="carousel-item active">
        <div class="row">
          <div class="col-12 col-lg-4">
            <img src="https://www.bosterbio.com/media/images/placeholder.jpg" class="mb-3 w-100" height="250" alt="" title="">
            <h3 class="font-medium text-orange">Products Here</h3>
            <table>
              <tbody>
                <tr>
                  <th>SKU</th>
                  <td>EK0540</td>
                </tr>
                <tr>
                  <th>Reactivity</th>
                  <td>Rat</td>
                </tr>
                <tr>
                  <th class="pr-5">Applications</th>
                  <td>ELISA</td>
                </tr>
              </tbody>
            </table>
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
